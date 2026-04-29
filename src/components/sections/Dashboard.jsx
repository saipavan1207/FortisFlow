import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import {
    LayoutDashboard,
    CreditCard,
    Wallet,
    ArrowRightLeft,
    BarChart3,
    PieChart,
    Sparkles,
    Bell,
    Plus,
    TrendingUp,
    TrendingDown,
    Home,
    UtensilsCrossed,
    Car,
    Smartphone,
    Search,
    ChevronDown,
    Settings,
    LogOut,
    CheckCircle2,
    Zap,
    Send,
    Brain,
    Activity,
    ShieldCheck,
    Target,
    Loader2
} from 'lucide-react'
import { useDashboardData } from '../../hooks/useDashboardData'
import { getSafePercentageChange } from '../../utils/formatters'
import BudgetModal from '../BudgetModal'
import { GoalGrid } from '../goals/GoalGrid'
import { useGoalsData } from '../../hooks/useGoalsData'


const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        
        const formatLabel = (lbl) => {
            if (!lbl || !lbl.includes('-')) return lbl;
            const [year, month] = lbl.split('-');
            const date = new Date(year, month - 1);
            return date.toLocaleDateString('default', { month: 'short', year: 'numeric' });
        };
        
        return (
            <div className="bg-[#12141c]/90 border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
                <p className="text-white font-bold mb-3">{formatLabel(label)} Insights</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 mb-2 shadow-sm rounded-md mix-blend-screen bg-black/20 p-2 border border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-zinc-400 font-semibold text-xs tracking-wide">{entry.name}</span>
                        </div>
                        <span className="text-white font-extrabold text-sm drop-shadow-md">₹{entry.value.toLocaleString()}</span>
                    </div>
                ))}
                {data.changeInfo?.trend !== 'neutral' && (
                    <div className={`mt-3 pt-3 border-t border-white/10 text-xs font-bold ${data.changeInfo.trend === 'up' ? 'text-rose-400' : 'text-emerald-400'} flex items-center gap-1.5`}>
                        {data.changeInfo.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {data.changeInfo.uiLabel}
                    </div>
                )}
                {data.changeInfo?.trend === 'neutral' && (
                    <div className="mt-3 pt-3 border-t border-white/10 text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" />
                        {data.changeInfo.uiLabel}
                    </div>
                )}
            </div>
        );
    }
    return null;
};

const getCategoryEmoji = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('food') || cat.includes('dining') || cat.includes('restaurant') || cat.includes('swiggy') || cat.includes('zomato')) return '🍔';
    if (cat.includes('transport') || cat.includes('travel') || cat.includes('fuel') || cat.includes('uber') || cat.includes('ola')) return '🚗';
    if (cat.includes('shopping') || cat.includes('retail') || cat.includes('amazon') || cat.includes('flipkart')) return '🛍️';
    if (cat.includes('bills') || cat.includes('utilities') || cat.includes('subscription')) return '🧾';
    if (cat.includes('health') || cat.includes('medical') || cat.includes('pharmacy')) return '💊';
    if (cat.includes('entertainment') || cat.includes('movies') || cat.includes('netflix')) return '🎬';
    if (cat.includes('salary') || cat.includes('income')) return '💰';
    if (cat.includes('investment')) return '📈';
    if (cat.includes('grocery') || cat.includes('groceries')) return '🛒';
    return '💳'; // Default
};

const Dashboard = () => {
    const { loading, spendingStats, categoryBreakdown, financialHealth, monthlyStatsData, aiInsight, expenseTrend, profile, transactions } = useDashboardData();
    const { activeGoals } = useGoalsData();

    const currentSpending = spendingStats?.monthlySpend || 0;
    const hasData = transactions && transactions.length > 0;

    const [monthlyBudget, setMonthlyBudget] = useState(0);

    useEffect(() => {
        if (profile?.id) {
            const saved = localStorage.getItem(`monthlyBudget_${profile.id}`);
            if (profile.monthly_budget) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setMonthlyBudget(profile.monthly_budget);
            } else if (saved) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setMonthlyBudget(parseFloat(saved));
            }
        }
    }, [profile]);

    const handleSaveBudget = async (newBudget) => {
        setMonthlyBudget(newBudget);
        if (profile?.id) {
            localStorage.setItem(`monthlyBudget_${profile.id}`, newBudget.toString());
            try {
                // Update profile fallback
                await supabase.from('profiles').update({ monthly_budget: newBudget }).eq('id', profile.id);
                
                // Update specific monthly budget
                const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
                const currentMonth = new Date().getMonth() + 1;
                const currentYear = new Date().getFullYear();

                const { data: existingBudgets } = await supabase
                    .from('budgets')
                    .select('id')
                    .eq('user_id', profile.id)
                    .eq('category', currentMonthName)
                    .eq('month', currentMonth)
                    .eq('year', currentYear);

                if (existingBudgets && existingBudgets.length > 0) {
                    await supabase
                        .from('budgets')
                        .update({ Budget: newBudget })
                        .eq('id', existingBudgets[0].id);
                } else {
                    await supabase
                        .from('budgets')
                        .insert({
                            user_id: profile.id,
                            category: currentMonthName,
                            Budget: newBudget,
                            month: currentMonth,
                            year: currentYear
                        });
                }
            } catch (err) {
                console.error('Failed to save budget to DB', err);
            }
        }
    };

    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

    const safeToSpend = monthlyBudget > 0 ? Math.max(0, monthlyBudget - currentSpending) : 0;
    const usedPercentage = monthlyBudget > 0 ? Math.min((currentSpending / monthlyBudget) * 100, 100) : 0;
    const isWarning = usedPercentage > 90;

    if (loading) {
        return (
            <div className="flex w-full items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    const scoreValue = financialHealth?.score;
    const isNoData = scoreValue === null;
    const score = isNoData ? 'No data' : Math.round(scoreValue || 0);
    
    let healthLabel = 'Bad';
    let healthColor = 'text-rose-400';
    let healthBg = 'bg-rose-500/10';

    if (isNoData) {
        healthLabel = 'N/A';
        healthColor = 'text-zinc-400';
        healthBg = 'bg-zinc-500/10';
    } else if (score >= 70) {
        healthLabel = 'Good';
        healthColor = 'text-emerald-400';
        healthBg = 'bg-emerald-500/10';
    } else if (score >= 40) {
        healthLabel = 'Average';
        healthColor = 'text-blue-400';
        healthBg = 'bg-blue-500/10';
    }

    const chartData = hasData
        ? (monthlyStatsData || []).map(m => ({
            month: m.month,
            income: parseFloat(m.income) || 0,
            expense: parseFloat(m.expense) || 0
          }))
        : [];

    const enhancedData = chartData.map((item, index, arr) => {
        if (index === 0) {
            return { ...item, changeInfo: { value: 0, label: 'New', trend: 'neutral' } };
        }
        const prev = arr[index - 1].expense;
        const curr = item.expense;
        return { ...item, changeInfo: getSafePercentageChange(curr, prev) };
    });

    const { uiLabel, trend } = (hasData && expenseTrend) || { uiLabel: 'No data', trend: 'neutral' };
    const changeColor = trend === 'up' ? 'text-rose-400' : (trend === 'down' ? 'text-emerald-400' : 'text-zinc-400');
    const changeBg = trend === 'up' ? 'bg-rose-500/10' : (trend === 'down' ? 'bg-emerald-500/10' : 'bg-zinc-500/10');

    const displayCategories = hasData
        ? (categoryBreakdown || []).map((c, i) => ({
            name: c.name,
            amount: c.amount,
            color: ['bg-orange-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-emerald-500'][i % 5],
            emoji: getCategoryEmoji(c.name),
          }))
        : [];

    const maxCategoryAmount = Math.max(...displayCategories.map(c => c.amount), 1);

    return (
        <div className="p-6 space-y-6 pb-8 relative z-10 w-full">
            {/* Top Row Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: Health Score */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-zinc-950/50 border border-white/5 p-4 h-[180px] rounded-2xl flex flex-col justify-between group hover:border-white/10 transition-colors"
                >
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Financial Health</p>
                            <div className="flex items-baseline gap-2 relative group/score">
                                <h2 className="text-2xl font-bold text-white cursor-help border-b border-dashed border-zinc-500/50 pb-0.5">
                                    {score}
                                    {!isNoData && <span className="text-base text-zinc-600 font-medium border-none pb-0">/100</span>}
                                </h2>
                                {/* Popover Tooltip */}
                                <div className="absolute left-0 top-full mt-2 w-max opacity-0 invisible group-hover/score:opacity-100 group-hover/score:visible transition-all duration-300 z-50">
                                    <div className="bg-[#1a1f2e] border border-white/10 rounded-lg p-3 shadow-xl backdrop-blur-xl">
                                        <p className="text-sm text-zinc-300 font-medium whitespace-nowrap">
                                            Savings rate: <span className="text-white font-bold">{financialHealth?.savings_rate_score || 0}/40</span> | Goals: <span className="text-white font-bold">{financialHealth?.goals_progress_score || 0}/30</span> | Budget: <span className="text-white font-bold">{financialHealth?.budget_adherence_score || 0}/30</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                            <Zap className="w-6 h-6 text-zinc-400 group-hover:text-blue-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <div className={`px-2 py-1.5 rounded-md ${healthBg} ${healthColor} text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1`}>
                            {isNoData ? <Activity className="w-3 h-3" /> : (score >= 70 ? <TrendingUp className="w-3 h-3" /> : (score >= 40 ? <Activity className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />))}
                            {healthLabel}
                        </div>
                        <span className="text-zinc-600 text-xs font-medium">Based on income & goals</span>
                    </div>
                </motion.div>

                {/* Card 2: Monthly Spend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-zinc-950/50 border border-white/5 p-4 h-[180px] rounded-2xl flex flex-col justify-between group hover:border-white/10 transition-colors"
                >
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Monthly Spend</p>
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-2xl font-bold text-white">₹{currentSpending.toLocaleString()}<span className="text-base text-zinc-600 font-medium"></span></h2>
                            </div>
                        </div>
                        <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-colors">
                            <Activity className="w-6 h-6 text-zinc-400 group-hover:text-purple-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <div className={`px-2 py-1.5 rounded-md ${changeBg} ${changeColor} text-[10px] font-extrabold tracking-wide uppercase flex items-center gap-1`}>
                            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : (trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Activity className="w-3 h-3" />)}
                            {uiLabel}
                        </div>
                        <span className="text-zinc-600 text-xs font-medium">vs last month</span>
                    </div>
                </motion.div>

                {/* Card 3: AI Insight (Gradient) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 40px -10px rgba(79, 70, 229, 0.5)" }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="relative overflow-hidden p-5 h-[180px] rounded-2xl flex flex-col justify-between cursor-pointer group"
                >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-blue-100 uppercase tracking-wider bg-white/10 px-2 py-1 rounded-md backdrop-blur-sm border border-white/10 group-hover:bg-white/20 transition-colors">AI Insight</span>
                            <Sparkles className="w-5 h-5 text-blue-200 animate-pulse-slow" />
                        </div>

                        <p className="text-white font-medium leading-relaxed text-lg whitespace-pre-line">
                            {aiInsight}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Middle Row: Charts & List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Main Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="lg:col-span-2 rounded-3xl h-[320px] p-8 flex flex-col relative overflow-hidden group"
                    style={{
                        backgroundColor: 'rgba(12, 14, 22, 0.65)',
                        backdropFilter: 'blur(18px)',
                        borderColor: 'rgba(255, 255, 255, 0.06)',
                        borderWidth: '1px'
                    }}
                >
                    {/* Background Grid & Glow */}
                    <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full opacity-20 pointer-events-none -translate-y-1/2" />
                    <div className="absolute inset-x-12 top-32 bottom-20 flex flex-col justify-between pointer-events-none opacity-30">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-full h-px bg-transparent border-t border-dotted border-white/20" />
                        ))}
                    </div>

                    <div className="flex items-center justify-between mb-0 relative z-10">
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight font-sans">Recent Activity</h3>
                            <p className="text-sm text-zinc-500 font-medium mt-1">Last 6 Months</p>
                        </div>
                        <div className="px-3 py-1.5 bg-zinc-900/80 rounded-full border border-white/10 flex items-center gap-2 shadow-lg shadow-black/20">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <span className="text-xs font-bold text-emerald-400 tracking-wide">Live</span>
                        </div>
                    </div>

                    {/* Recharts Container */}
                    <div className="flex-1 w-full mt-4 ml-[-20px] relative z-10 overflow-hidden h-[180px]">
                        {!hasData ? (
                            <div className="flex flex-col items-center justify-center h-full gap-2">
                                <BarChart3 className="w-8 h-8 text-zinc-700" />
                                <p className="text-zinc-500 text-sm font-medium">No transactions yet</p>
                                <p className="text-zinc-600 text-xs">Add a transaction to see your activity chart</p>
                            </div>
                        ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={enhancedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => {
                                    if (!value || !value.includes('-')) return value;
                                    const [year, month] = value.split('-');
                                    const date = new Date(year, month - 1);
                                    return date.toLocaleDateString('default', { month: 'short', year: '2-digit' });
                                }} />
                                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                                <Bar dataKey="income" name="Income" fill="#34d399" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="expense" name="Expense" radius={[4, 4, 0, 0]} barSize={20}>
                                    {enhancedData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.changeInfo.trend === 'up' ? '#f43f5e' : (entry.changeInfo.trend === 'down' ? '#34d399' : '#a1a1aa')} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                {/* Top Categories */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col h-[320px] relative overflow-hidden"
                >
                    {/* Header Group - 16px bottom margin (Section Break) */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex flex-col gap-0.5">
                            <h3 className="text-lg font-bold text-white leading-tight">Top Sources</h3>
                            <p className="text-sm text-zinc-500 font-medium">This Month</p>
                        </div>
                        <button className="text-zinc-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5">
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>

                    {/* KPI Group - 24px bottom margin (Clear Section Break) */}
                    <div className="mb-6 flex flex-col gap-1">
                        <h2 className="text-[26px] font-bold text-white leading-none">₹{currentSpending.toLocaleString()}</h2>
                        <div className={`flex items-center gap-1.5 ${changeColor} text-xs font-bold tracking-wide`}>
                            {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : (trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />)}
                            <span>{uiLabel}</span>
                        </div>
                    </div>

                    {/* List Group - Consistent 12px vertical rhythm */}
                    <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto custom-scrollbar pr-1">
                        {displayCategories.length > 0 ? displayCategories.map((cat, i) => (
                            <div key={i} className="group relative">
                                {/* Label Row - 4px bottom spacing (Label-to-Bar) */}
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-6 h-6 rounded-md ${cat.color} bg-opacity-20 flex items-center justify-center`}>
                                            <span className="text-[14px] leading-none">{cat.emoji}</span>
                                        </div>
                                        <span className="text-[12px] font-semibold text-zinc-300">{cat.name}</span>
                                    </div>
                                    <span className="text-[12px] font-bold text-white">₹{cat.amount.toLocaleString()}</span>
                                </div>
                                {/* Progress Bar - Clipped & Z-Indexed */}
                                <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden relative z-0 ring-1 ring-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((cat.amount / maxCategoryAmount) * 100, 100)}%` }}
                                        transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                                        className={`h-full ${cat.color} rounded-full relative z-10`}
                                    />
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-zinc-500 text-xs py-4">No categories found</div>
                        )}
                    </div>
                </motion.div>
            </div>



            {/* Bottom Action Strip - Polished */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full relative group"
            >
                {/* Glow Behind Card */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-blue-500/20 rounded-[24px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative w-full bg-[#0A0F1C]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl overflow-hidden">
                    {/* Ambient Light inside card */}
                    <div className="absolute top-0 left-1/4 w-1/2 h-full bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none" />

                    <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 bg-emerald-500/40 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center ring-1 ring-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] relative z-10">
                                <ShieldCheck className="w-6 h-6 text-white drop-shadow-md" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-bold text-lg sm:text-xl tracking-tight flex items-center gap-2">
                                Spending Control
                            </h4>
                            <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span>Safe to spend: <span className="text-white font-bold">₹{safeToSpend.toLocaleString()}</span></span>
                                <span className="hidden sm:inline text-zinc-600">•</span>
                                <span className={`${isWarning ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'} font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${isWarning ? 'bg-rose-400' : 'bg-emerald-400'} animate-pulse`} />
                                    {isWarning ? 'Warning' : 'On track'}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 sm:gap-5 w-full md:w-auto justify-between md:justify-end relative z-10">
                        <div className="hidden sm:flex flex-col items-end justify-center mr-2">
                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Budget Used</div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-32 h-1.5 bg-black/50 rounded-full overflow-hidden ring-1 ring-white/10 shadow-inner relative">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(usedPercentage, 100)}%` }}
                                        transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        className={`absolute top-0 bottom-0 left-0 ${isWarning ? 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.6)]' : 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]'} rounded-full`}
                                    >
                                        <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/40 blur-[2px] rounded-full" />
                                    </motion.div>
                                </div>
                                <span className="text-xs text-white font-bold drop-shadow-md">{Math.min(Math.round(usedPercentage), 100)}%</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsBudgetModalOpen(true)}
                            className="shrink-0 px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-all duration-300 hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)] flex items-center gap-2 group/btn relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                            <span className="relative z-10">Adjust Budget</span>
                            <Settings className="w-4 h-4 text-zinc-700 group-hover/btn:rotate-90 transition-transform duration-500 relative z-10" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Goal Cards Module */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="w-full relative z-10"
            >
                <GoalGrid goals={activeGoals} />
            </motion.div>

            {/* Budget Modal */}
            <BudgetModal
                isOpen={isBudgetModalOpen}
                onClose={() => setIsBudgetModalOpen(false)}
                currentBudget={monthlyBudget}
                onSave={handleSaveBudget}
            />
        </div>
    )
}

export default Dashboard
