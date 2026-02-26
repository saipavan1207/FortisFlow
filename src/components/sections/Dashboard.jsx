import React from 'react'
import { motion } from 'framer-motion'
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

const spendingData = [
    { month: 'Jan', amount: 4500, active: false },
    { month: 'Feb', amount: 5200, active: false },
    { month: 'Mar', amount: 4800, active: false },
    { month: 'Apr', amount: 8240, active: true }, // Current/High
    { month: 'May', amount: 6100, active: false },
    { month: 'Jun', amount: 5900, active: false },
]

const Dashboard = ({ isPreview = false }) => {
    // 1. Fetch Data Hook
    const { loading } = useDashboardData();
    // const [isModalOpen, setIsModalOpen] = useState(false); // Disabled for now
    // Loading State
    if (loading && !isPreview) {
        return (
            <div className="flex w-full items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        )
    }

    // Use Mock Data for Preview Mode ONLY
    const displayStats = {
        monthlySpend: 8240.50,
        score: 78
    };

    const displayCategories = [
        { name: 'Housing', amount: 2400, color: 'bg-orange-500', icon: Home },
        { name: 'Food & Dining', amount: 1850, color: 'bg-blue-500', icon: UtensilsCrossed },
        { name: 'Transport', amount: 940, color: 'bg-purple-500', icon: Car },
        { name: 'Subscriptions', amount: 320, color: 'bg-pink-500', icon: Smartphone },
    ];

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
                                <h2 className="text-2xl font-bold text-white">{displayStats.score}<span className="text-base text-zinc-600 font-medium">/100</span></h2>
                            </div>
                        </div>
                        <div className="p-3 rounded-xl bg-zinc-900/50 border border-white/5 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                            <Zap className="w-6 h-6 text-zinc-400 group-hover:text-blue-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +4 pts
                        </div>
                        <span className="text-zinc-600 text-xs">vs last month</span>
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
                        <div className="px-2 py-1 rounded-md bg-rose-500/10 text-rose-400 text-xs font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +2.1%
                        </div>
                        <span className="text-zinc-600 text-xs">vs last month</span>
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

                        <p className="text-white font-medium leading-relaxed text-lg">
                            &quot;You spent <span className="font-bold text-white underline decoration-blue-300 decoration-2 underline-offset-2">22% more</span> on food delivery this month compared to your average.&quot;
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

                    {/* Bars Container */}
                    <div className="flex-1 flex items-end justify-center gap-[24px] w-full px-6 relative z-10 select-none pb-4 overflow-visible">
                        {spendingData.map((item, index) => {
                            // ✅ CORRECT BAR HEIGHT DATA
                            const heights = {
                                'Jan': 38,
                                'Feb': 52,
                                'Mar': 45,
                                'Apr': 72, // Active
                                'May': 60,
                                'Jun': 58
                            };
                            // Ensure height is never 0 using logical OR fallback
                            const barHeightPct = heights[item.month] || 40;

                            return (
                                <div key={item.month} className="flex flex-col items-center gap-4 group/bar relative h-full justify-end">
                                    {/* Bar Wrapper - Size driven by height % */}
                                    <div className="relative w-[32px] flex items-end justify-center" style={{ height: `${barHeightPct}%` }}>
                                        {/* Tooltip - Anchored to Top of Bar Wrapper */}
                                        <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 transition-all duration-300 transform ${item.active ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95 group-hover/bar:opacity-100 group-hover/bar:translate-y-0 group-hover/bar:scale-100'} bg-[#12141C]/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-50 whitespace-nowrap pointer-events-none origin-bottom`}>
                                            ₹{item.amount.toLocaleString()}
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#12141C] border-b border-r border-white/10 transform rotate-45"></div>
                                        </div>

                                        {/* Actual Animated Bar */}
                                        <motion.div
                                            // ✅ POP OUT ANIMATION
                                            initial={{ opacity: 0, y: 40, scaleY: 0.6 }}
                                            animate={{ opacity: 1, y: 0, scaleY: 1 }}
                                            transition={{
                                                duration: 0.8,
                                                delay: index * 0.08, // Stagger 80ms
                                                ease: [0.16, 1, 0.3, 1]
                                            }}
                                            className={`w-full h-full rounded-full relative transition-all duration-300 ease-out flex-shrink-0 origin-bottom 
                                                    ${item.active
                                                    ? 'bg-gradient-to-b from-[#7EB6FF] via-[#4F86F7] to-[#2F6BFF] hover:scale-y-[1.05] hover:brightness-110 shadow-[0_0_18px_rgba(47,107,255,0.4)]'
                                                    : 'bg-white/10 hover:bg-white/20 hover:scale-y-[1.05] hover:brightness-110'
                                                }
                                                `}
                                        >
                                            {/* Inactive Bevel/Highlight */}
                                            {!item.active && (
                                                <div className="absolute inset-0 rounded-full border border-white/5 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                                            )}

                                            {/* Active Inner Light */}
                                            {item.active && (
                                                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none" />
                                            )}

                                            {/* ✅ ACTIVE GLOW PULSE ANIMATION */}
                                            {item.active && (
                                                <motion.div
                                                    animate={{ boxShadow: ["0 0 8px rgba(47,107,255,0.4)", "0 0 20px rgba(47,107,255,0.6)", "0 0 8px rgba(47,107,255,0.4)"] }}
                                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                    className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl -z-10"
                                                />
                                            )}
                                        </motion.div>
                                    </div>

                                    {/* Label - Anchored to Chart Bottom */}
                                    <span className={`text-[11px] font-semibold tracking-wide uppercase transition-colors duration-300 absolute top-full mt-3 ${item.active ? 'text-white font-bold' : 'text-zinc-500 group-hover/bar:text-zinc-300'}`}>
                                        {item.month}
                                    </span>
                                </div>
                            )
                        })}
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
                            <p className="text-sm text-zinc-500 font-medium">Last 14 days</p>
                        </div>
                        <button className="text-zinc-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5">
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>

                    {/* KPI Group - 24px bottom margin (Clear Section Break) */}
                    <div className="mb-6 flex flex-col gap-1">
                        <h2 className="text-[26px] font-bold text-white leading-none">₹{displayStats.monthlySpend.toLocaleString()}</h2>
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold tracking-wide">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>12% increase</span>
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
                                        animate={{ width: `${Math.min((cat.amount / displayStats.monthlySpend) * 100, 100)}%` }}
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

                        <button className="shrink-0 px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-black text-sm font-bold rounded-full hover:bg-zinc-200 transition-all duration-300 hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)] flex items-center gap-2 group/btn relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                            <span className="relative z-10">Adjust Budget</span>
                            <Settings className="w-4 h-4 text-zinc-700 group-hover/btn:rotate-90 transition-transform duration-500 relative z-10" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Dashboard
