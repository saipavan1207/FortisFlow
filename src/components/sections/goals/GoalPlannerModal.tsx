import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Calendar, Sparkles, Wand2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

interface GoalPlannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (goalData: { title: string; target_amount: number; deadline: string; icon: string; color_preset: string; recommended_monthly_contribution?: number | null; }) => void;
}

const presetColors = ['blue', 'green', 'purple', 'orange', 'red'];
const presetIcons = ['target', 'laptop', 'shield', 'plane'];

const GoalPlannerModal: React.FC<GoalPlannerModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    
    // simple fallback colors/icons since we don't have a picker yet
    const resolveColor = (name: string) => {
        if(name.toLowerCase().includes('travel') || name.toLowerCase().includes('vacation')) return 'purple';
        if(name.toLowerCase().includes('emergency')) return 'green';
        if(name.toLowerCase().includes('car')) return 'red';
        return 'blue';
    };

    const resolveIcon = (name: string) => {
        if(name.toLowerCase().includes('travel') || name.toLowerCase().includes('vacation')) return 'plane';
        if(name.toLowerCase().includes('emergency')) return 'shield';
        if(name.toLowerCase().includes('laptop') || name.toLowerCase().includes('computer')) return 'laptop';
        return 'target';
    };

    const [aiPlan, setAiPlan] = useState<{
        monthlySaving: number;
        successProbability: number;
        suggestions: string[];
        budgetHeadroom: number | null;
        isBudgetConstrained: boolean;
    } | null>(null);

    const handleGeneratePlan = async () => {
        if (!name || !targetAmount || !deadline) return;
        setIsGenerating(true);
        
        try {
            // Import getTransactions dynamically to avoid circular dependencies if any, or statically at top
            const { getTransactions } = await import('../../../services/transactions');
            const { data: transactions } = await getTransactions();
            
            const monthsToDeadline = Math.max(1, (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
            const requiredMonthlySaving = Math.ceil(Number(targetAmount) / monthsToDeadline);

            let suggestions: string[] = [];
            let successProbability = 84; // Default baseline

            if (transactions && transactions.length > 0) {
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                // Simple analysis: Calculate total expenses by category over all time (or last few months)
                const expensesByCategory: Record<string, number> = {};
                let totalIncome = 0;
                let totalExpense = 0;

                // For simplicity, aggregate all data to find spending patterns
                transactions.forEach((t: any) => {
                    const amount = parseFloat(t.amount);
                    if (t.type === 'expense') {
                        totalExpense += amount;
                        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + amount;
                    } else if (t.type === 'income') {
                        totalIncome += amount;
                    }
                });

                // Find top expense categories
                const sortedCategories = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);
                
                // Formulate dynamic suggestions based on their highest spending categories
                let potentialSavings = 0;
                
                if (sortedCategories.length > 0) {
                    const topCategory = sortedCategories[0];
                    const cutAmount = Math.ceil(topCategory[1] * 0.15); // suggest cutting 15% of top expense
                    suggestions.push(`Reduce ${topCategory[0] || 'top expense'} by ₹${cutAmount.toLocaleString()}/month`);
                    potentialSavings += cutAmount;
                }
                
                if (sortedCategories.length > 1) {
                    const secondCategory = sortedCategories[1];
                    const cutAmount = Math.ceil(secondCategory[1] * 0.10); // suggest cutting 10% of 2nd top expense
                    suggestions.push(`Limit ${secondCategory[0] || 'secondary expense'} spending (Save ₹${cutAmount.toLocaleString()}/mo)`);
                    potentialSavings += cutAmount;
                }
                
                suggestions.push(`Auto-transfer ₹${Math.ceil(requiredMonthlySaving * 0.5).toLocaleString()} on payday`);

                // Adjust probability based on financial health
                if (totalIncome > 0) {
                    const savingsRate = (totalIncome - totalExpense) / totalIncome;
                    if (savingsRate > 0.2) successProbability = 95;
                    else if (savingsRate > 0.1) successProbability = 85;
                    else successProbability = 65;
                }

                if (requiredMonthlySaving > totalIncome && totalIncome > 0) {
                    successProbability = Math.max(10, successProbability - 30);
                    suggestions.unshift("Target amount might be too high for current income. Consider extending the deadline.");
                }

            } else {
                suggestions = [
                    "Reduce non-essential spending by 15%",
                    "Review and cancel unused subscriptions",
                    `Auto-transfer ₹${Math.ceil(requiredMonthlySaving * 0.5).toLocaleString()} on payday`
                ];
            }

            // ── Fetch current month's budget headroom ──────────────────────────
            let budgetHeadroom: number | null = null;
            let isBudgetConstrained = false;
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const now2 = new Date();
                    const { data: budgetRow } = await supabase
                        .from('budgets')
                        .select('Budget, amount')
                        .eq('user_id', user.id)
                        .eq('month', now2.getMonth() + 1)
                        .eq('year', now2.getFullYear())
                        .maybeSingle();

                    const limit = parseFloat((budgetRow as any)?.Budget ?? (budgetRow as any)?.amount ?? '0');
                    if (limit > 0 && transactions) {
                        // Use already-fetched transactions to compute current month spend
                        const startOfMonth = new Date(now2.getFullYear(), now2.getMonth(), 1);
                        const monthlySpend = transactions
                            .filter((t: any) => t.type === 'expense' && new Date(t.created_at) >= startOfMonth)
                            .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
                        budgetHeadroom = Math.max(0, limit - monthlySpend);
                        isBudgetConstrained = requiredMonthlySaving > budgetHeadroom;
                        if (isBudgetConstrained) {
                            // Proportionally reduce success probability
                            successProbability = Math.max(10, Math.round(successProbability * (budgetHeadroom / requiredMonthlySaving)));
                        }
                    }
                }
            } catch (_) { /* non-fatal */ }

            setAiPlan({
                monthlySaving: requiredMonthlySaving,
                successProbability,
                suggestions: suggestions.slice(0, 3),
                budgetHeadroom,
                isBudgetConstrained,
            });
        } catch (error) {
            console.error("Error generating AI plan:", error);
            const monthsToDeadline = Math.max(1, (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
            setAiPlan({
                monthlySaving: Math.ceil(Number(targetAmount) / monthsToDeadline),
                successProbability: 75,
                suggestions: [
                    "Reduce non-essential spending by 15%",
                    "Review and cancel unused subscriptions",
                    "Auto-transfer savings on payday"
                ],
                budgetHeadroom: null,
                isBudgetConstrained: false,
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        onSave({
            title: name,
            target_amount: Number(targetAmount),
            deadline: new Date(deadline).toISOString().split('T')[0],
            icon: resolveIcon(name),
            color_preset: resolveColor(name),
            recommended_monthly_contribution: aiPlan?.monthlySaving ?? null,
        });
        // Reset state
        setName('');
        setTargetAmount('');
        setDeadline('');
        setAiPlan(null);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#09090b]/80 backdrop-blur-md z-[100]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 font-manrope">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg bg-zinc-950 border border-white/10 shadow-2xl rounded-3xl overflow-hidden relative"
                        >
                            {/* Decorative Top Glow */}
                            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-sm" />
                            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent" />

                            <div className="p-6 sm:p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                                            <Wand2 className="w-6 h-6 text-blue-400" />
                                            AI Goal Planner
                                        </h2>
                                        <p className="text-zinc-400 text-sm mt-1">Set a target and let FortisFlow create a roadmap.</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors self-start border border-white/5"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Input: Name */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">Goal Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. Dream Laptop"
                                            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium placeholder:text-zinc-600 shadow-inner"
                                        />
                                    </div>

                                    {/* Inputs: Amount & Date Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">Target Amount (₹)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Target className="h-4 w-4 text-zinc-500" />
                                                </div>
                                                <input
                                                    type="number"
                                                    value={targetAmount}
                                                    onChange={(e) => setTargetAmount(e.target.value)}
                                                    placeholder="80000"
                                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium placeholder:text-zinc-600 shadow-inner"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">Deadline</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Calendar className="h-4 w-4 text-zinc-500" />
                                                </div>
                                                <input
                                                    type="month"
                                                    value={deadline}
                                                    onChange={(e) => setDeadline(e.target.value)}
                                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium placeholder:text-zinc-600 shadow-inner [color-scheme:dark]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Generate Button Wrapper */}
                                    {!aiPlan && (
                                        <div className="pt-4">
                                            <button
                                                onClick={handleGeneratePlan}
                                                disabled={!name || !targetAmount || !deadline || isGenerating}
                                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
                                            >
                                                {isGenerating ? (
                                                    <span className="flex items-center gap-2">Generating...</span>
                                                ) : (
                                                    <>
                                                        Generate AI Strategy
                                                        <Sparkles className="w-4 h-4 group-hover/btn:animate-pulse" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* AI Strategy Reveal */}
                                <AnimatePresence>
                                    {aiPlan && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-6 pt-6 border-t border-white/5 overflow-hidden"
                                        >
                                            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-2xl p-5 shadow-inner">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="px-2 py-1 bg-indigo-500/20 rounded-md border border-indigo-500/30">
                                                        <Sparkles className="w-4 h-4 text-indigo-400" />
                                                    </div>
                                                    <h3 className="text-indigo-200 font-bold text-sm uppercase tracking-wide">Recommended Plan</h3>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                                        <span className="block text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">Monthly Req</span>
                                                        <span className="text-xl font-bold text-white">₹{aiPlan.monthlySaving.toLocaleString()}</span>
                                                    </div>
                                                    <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                                        <span className="block text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">Success Prob</span>
                                                        <span className={`text-xl font-bold ${aiPlan.isBudgetConstrained ? 'text-amber-400' : 'text-emerald-400'}`}>{aiPlan.successProbability}%</span>
                                                    </div>
                                                </div>

                                                {/* Budget Constraint Banner */}
                                                {aiPlan.isBudgetConstrained && aiPlan.budgetHeadroom !== null && (
                                                    <div className="flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 mb-4">
                                                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="text-amber-300 text-xs font-bold">Budget Constrained</p>
                                                            <p className="text-zinc-400 text-[11px] mt-0.5">
                                                                Your budget allows <span className="text-white font-bold">₹{aiPlan.budgetHeadroom.toLocaleString()}/mo</span>. The button on your goal card will contribute this amount. Increase your budget to contribute more.
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Effective contribution row (only when constrained) */}
                                                {aiPlan.isBudgetConstrained && aiPlan.budgetHeadroom !== null && (
                                                    <div className="bg-black/20 rounded-xl p-3 border border-white/5 mb-4">
                                                        <span className="block text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-1">Effective Contribution / mo</span>
                                                        <span className="text-xl font-bold text-amber-400">₹{aiPlan.budgetHeadroom.toLocaleString()}</span>
                                                        <span className="text-zinc-600 text-xs ml-2">(budget limit)</span>
                                                    </div>
                                                )}

                                                <div className="space-y-2">
                                                    <span className="block text-zinc-500 text-[10px] uppercase font-bold tracking-wider ml-1">AI Adjustments</span>
                                                    {aiPlan.suggestions.map((suggestion, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-sm text-zinc-300 bg-black/10 p-2.5 rounded-lg border border-white/5">
                                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                                            {suggestion}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-6 flex justify-end gap-3">
                                                <button
                                                    onClick={() => setAiPlan(null)}
                                                    className="px-4 py-2.5 text-zinc-400 hover:text-white font-bold text-sm transition-colors"
                                                >
                                                    Recalculate
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    className="px-6 py-2.5 bg-white text-black hover:bg-zinc-200 font-bold text-sm rounded-xl transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                                                >
                                                    Start Goal
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default GoalPlannerModal;
