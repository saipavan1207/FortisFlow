import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Calendar, Sparkles, Wand2 } from 'lucide-react';

const GoalPlannerModal = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiPlan, setAiPlan] = useState(null);

    const handleGeneratePlan = () => {
        if (!name || !targetAmount || !deadline) return;
        setIsGenerating(true);
        // Simulate API call to AI service
        setTimeout(() => {
            setAiPlan({
                monthlySaving: Math.ceil(targetAmount / 12), // Rough estimate
                successProbability: 84,
                suggestions: [
                    "Reduce food delivery by ₹1,500/month",
                    "Cancel 2 unused subscriptions (₹800/mo)",
                    "Auto-transfer 10% on payday"
                ]
            });
            setIsGenerating(false);
        }, 1500);
    };

    const handleSave = () => {
        onSave({
            name,
            targetAmount: Number(targetAmount),
            savedAmount: 0,
            deadline,
            successProbability: aiPlan ? aiPlan.successProbability : 50,
            icon: '🎯',
            color: 'from-blue-500 to-indigo-600'
        });
        // Reset state
        setName('');
        setTargetAmount('');
        setDeadline('');
        setAiPlan(null);
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
                                                        <span className="text-xl font-bold text-emerald-400">{aiPlan.successProbability}%</span>
                                                    </div>
                                                </div>

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
