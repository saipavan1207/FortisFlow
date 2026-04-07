import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, Legend } from 'recharts'
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
import BudgetModal from './BudgetModal'

const spendingData = [
    { month: 'Jan', amount: 4500, active: false },
    { month: 'Feb', amount: 5200, active: false },
    { month: 'Mar', amount: 4800, active: false },
    { month: 'Apr', amount: 8240, active: true }, // Current/High
    { month: 'May', amount: 6100, active: false },
    { month: 'Jun', amount: 5900, active: false },
]

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-[#12141c]/90 border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
                <p className="text-white font-bold mb-3">{label} Insights</p>
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

const Dashboard = ({ isPreview = false }) => {
    const { loading, refresh, spendingStats, categoryBreakdown, financialHealth, monthlyStatsData, aiInsight, expenseTrend, budgetsVsActual, goalPredictions } = useDashboardData(isPreview);
    const [budgetModalOpen, setBudgetModalOpen] = useState(false);

    if (loading && !isPreview) {
        return (
            <div className="flex w-full items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        )
    }

    const displayStats = isPreview ? { monthlySpend: 8240.50 } : { monthlySpend: spendingStats?.monthlySpend || 0 };

    const score = Math.round(financialHealth || 0);
    let healthLabel = 'Bad';
    let healthColor = 'text-rose-400';
    let healthBg = 'bg-rose-500/10';

    if (score >= 70) {
        healthLabel = 'Good';
        healthColor = 'text-emerald-400';
        healthBg = 'bg-emerald-500/10';
    } else if (score >= 40) {
        healthLabel = 'Average';
        healthColor = 'text-blue-400';
        healthBg = 'bg-blue-500/10';
    }

    const chartData = (monthlyStatsData || []).map(m => ({
        month: m.month,
        income: parseFloat(m.income) || 0,
        expense: parseFloat(m.expense) || 0
    }));

    const enhancedData = chartData.map((item, index, arr) => {
        if (index === 0) {
            return { ...item, changeInfo: { value: 0, label: "New", trend: "neutral" } };
        }
        const prev = arr[index - 1].expense;
        const curr = item.expense;
        return {
            ...item,
            changeInfo: getSafePercentageChange(curr, prev)
        };
    });

    const { uiLabel, trend } = expenseTrend || { uiLabel: "First active record", trend: "neutral" };
    const changeColor = trend === 'up' ? 'text-rose-400' : (trend === 'down' ? 'text-emerald-400' : 'text-zinc-400');
    const changeBg = trend === 'up' ? 'bg-rose-500/10' : (trend === 'down' ? 'bg-emerald-500/10' : 'bg-zinc-500/10');

    const displayCategories = (categoryBreakdown || []).map((c, i) => ({
        name: c.name,
        amount: c.amount,
        color: ['bg-orange-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-emerald-500'][i % 5],
        icon: UtensilsCrossed
    }));

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
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-2xl font-bold text-white">{score}<span className="text-base text-zinc-600 font-medium">/100</span></h2>
                            </div>
                        </div>
                        <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                            <Zap className="w-6 h-6 text-zinc-400 group-hover:text-blue-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <div className={`px-2 py-1.5 rounded-md ${healthBg} ${healthColor} text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1`}>
                            {score >= 70 ? <TrendingUp className="w-3 h-3" /> : (score >= 40 ? <Activity className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />)}
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
                                <h2 className="text-2xl font-bold text-white">₹{displayStats.monthlySpend.toLocaleString()}<span className="text-base text-zinc-600 font-medium"></span></h2>
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
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={enhancedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
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
                            <p className="text-sm text-zinc-500 font-medium">Last 30 Days</p>
                        </div>
                        <button className="text-zinc-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5">
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>

                    {/* KPI Group - 24px bottom margin (Clear Section Break) */}
                    <div className="mb-6 flex flex-col gap-1">
                        <h2 className="text-[26px] font-bold text-white leading-none">₹{displayStats.monthlySpend.toLocaleString()}</h2>
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
                                            <cat.icon className="w-3.5 h-3.5 text-white" />
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

            {/* Insights Row: Budget Tracker & Goal Predictions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Budget Tracking */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Wallet className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-bold text-white leading-tight">Budget vs Actual</h3>
                    </div>
                    {budgetsVsActual.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart
                                data={budgetsVsActual.map(b => ({
                                    category: b.category,
                                    Budget: parseFloat(b.monthly_limit) || 0,
                                    Actual: parseFloat(b.actual_spend) || 0,
                                    overBudget: b.usage_percentage > 100
                                }))}
                                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                                barCategoryGap="30%"
                                barGap={4}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="category" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                                    content={({ active, payload, label }) => {
                                        if (!active || !payload?.length) return null;
                                        const row = payload[0]?.payload;
                                        return (
                                            <div className="bg-[#12141c]/90 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                                                <p className="text-white font-bold mb-2 flex items-center gap-2">
                                                    {label}
                                                    {row?.overBudget && (
                                                        <span className="text-[10px] font-extrabold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                            Over Budget
                                                        </span>
                                                    )}
                                                </p>
                                                {payload.map((entry, i) => (
                                                    <div key={i} className="flex items-center justify-between gap-4 text-xs mb-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                            <span className="text-zinc-400 font-semibold">{entry.name}</span>
                                                        </div>
                                                        <span className="text-white font-bold">₹{entry.value.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }}
                                />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', paddingTop: '8px' }}
                                />
                                <Bar dataKey="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={18} />
                                <Bar dataKey="Actual" radius={[4, 4, 0, 0]} barSize={18}>
                                    {budgetsVsActual.map((b, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={b.usage_percentage > 100 ? '#f43f5e' : (b.usage_percentage > 90 ? '#f59e0b' : '#34d399')}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-sm text-zinc-500">No active budgets this month. Setting limits helps control capital.</p>
                    )}
                </motion.div>

                {/* Goal Predictions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Target className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-lg font-bold text-white leading-tight">Goal Forecasts</h3>
                    </div>
                    {goalPredictions.length > 0 ? goalPredictions.map((goal, i) => (
                        <div key={i} className="mb-4 last:mb-0 p-3 bg-zinc-950/50 border border-white/5 rounded-xl">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-zinc-300 font-bold">{goal.title}</span>
                                <span className="text-xs font-medium text-zinc-500 shadow-sm">Target: ₹{goal.target_amount}</span>
                            </div>
                            <p className="text-xs text-zinc-400 mb-2">Saved: ₹{goal.saved_amount} | Avg Monthly Rate: ₹{Math.round(goal.avg_monthly_saving)}</p>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                <span className="text-emerald-400 font-bold text-sm tracking-wide">
                                    {goal.months_left <= 0 ? "Goal Reached! 🎉" : `${Math.ceil(goal.months_left)} months to completion`}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <p className="text-sm text-zinc-500">No active goals. Define what you are saving for.</p>
                    )}
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
                                <span>Safe to spend: <span className="text-white font-bold">₹3,200</span></span>
                                <span className="hidden sm:inline text-zinc-600">•</span>
                                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    On track
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
                                        animate={{ width: "78%" }}
                                        transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.6)]"
                                    >
                                        <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/40 blur-[2px] rounded-full" />
                                    </motion.div>
                                </div>
                                <span className="text-xs text-white font-bold drop-shadow-md">78%</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setBudgetModalOpen(true)}
                            className="shrink-0 px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-all duration-300 hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)] flex items-center gap-2 group/btn relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                            <span className="relative z-10">Adjust Budget</span>
                            <Settings className="w-4 h-4 text-zinc-700 group-hover/btn:rotate-90 transition-transform duration-500 relative z-10" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>

        {!isPreview && (
            <BudgetModal
                isOpen={budgetModalOpen}
                onClose={() => setBudgetModalOpen(false)}
                onSave={() => { setBudgetModalOpen(false); refresh(); }}
            />
        )}
    )
}

export default Dashboard
