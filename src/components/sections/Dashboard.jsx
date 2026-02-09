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
    Target
} from 'lucide-react'

// --- Mock Data ---
const spendingData = [
    { month: 'Jan', amount: 4500, active: false },
    { month: 'Feb', amount: 5200, active: false },
    { month: 'Mar', amount: 4800, active: false },
    { month: 'Apr', amount: 8240, active: true }, // Current/High
    { month: 'May', amount: 6100, active: false },
    { month: 'Jun', amount: 5900, active: false },
]

const categories = [
    { name: 'Housing', amount: 2400, color: 'bg-orange-500', icon: Home },
    { name: 'Food & Dining', amount: 1850, color: 'bg-blue-500', icon: UtensilsCrossed },
    { name: 'Transport', amount: 940, color: 'bg-purple-500', icon: Car },
    { name: 'Subscriptions', amount: 320, color: 'bg-pink-500', icon: Smartphone },
]

const SidebarItem = ({ icon: Icon, label, active = false }) => (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all cursor-pointer group ${active ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}>
        <Icon className={`w-4 h-4 ${active ? 'text-blue-500' : 'text-zinc-500 group-hover:text-zinc-400'}`} />
        <span className="font-medium text-sm">{label}</span>
    </div>
)

const Dashboard = () => {
    return (
        <div className="flex h-screen w-full bg-[#09090b] text-white font-manrope overflow-hidden rounded-2xl border border-zinc-800/50 shadow-2xl">
            {/* --- SIDEBAR --- */}
            <aside className="w-60 h-full flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-white/5">
                    <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
                        <div className="w-8 h-8 flex items-center justify-center relative">
                            {/* Stylized 'F' Logo */}
                            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 5H5v14h4v-7h6" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold tracking-wide text-white font-manrope">FortisFlow</span>
                    </div>
                </div>

                <div className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pt-6">
                    {/* Platform Group */}
                    <div>
                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-3">Platform</h3>
                        <div className="space-y-1">
                            <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
                            <SidebarItem icon={ArrowRightLeft} label="Transactions" />
                            <SidebarItem icon={CreditCard} label="Cards" />
                            <SidebarItem icon={Smartphone} label="UPI" />
                            <SidebarItem icon={Wallet} label="Categories" />
                            <SidebarItem icon={Target} label="Goals" />
                        </div>
                    </div>

                    {/* Insights Group */}
                    <div>
                        <h3 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-4 px-4">Insights</h3>
                        <div className="space-y-1">
                            <SidebarItem icon={BarChart3} label="Analytics" />
                            <SidebarItem icon={PieChart} label="Reports" />
                            <SidebarItem icon={Sparkles} label="AI Insights" />
                        </div>
                    </div>
                </div>

                {/* User Profile */}
                <div className="p-6 border-t border-white/5">
                    <div className="flex items-center gap-3 py-2 rounded-xl hover:bg-zinc-900/50 cursor-pointer transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[1px]">
                            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-xs font-bold text-white">
                                CJ
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Carl Johnson</p>
                            <p className="text-xs text-zinc-500 truncate">Pro Plan</p>
                        </div>
                        <Settings className="w-4 h-4 text-zinc-500" />
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0c0c0e] relative overflow-hidden">
                {/* Ambient Glows */}
                {/* Ambient Glows - REMOVED for clean dark look */}
                {/* <div className="absolute top-0 left-0 w-full h-[500px] bg-blue-900/10 blur-[120px] pointer-events-none" /> */}

                {/* Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 relative z-10 flex-shrink-0">
                    <div>
                        <p className="text-zinc-500 text-sm mb-0.5">Overview</p>
                        <h1 className="text-xl font-bold text-white">Dashboard</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-xs text-emerald-400 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live Updates
                        </div>

                        {/* Divider */}
                        <div className="h-6 w-[1px] bg-gradient-to-b from-transparent via-zinc-200/20 to-transparent hidden md:block mx-1" />

                        <button className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-zinc-950" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors">
                            <Plus className="w-4 h-4" />
                            Add Expense
                        </button>
                    </div>
                </header>

                {/* Dashboard Grid */}
                <div className="p-6 overflow-y-auto flex-1 relative z-10 custom-scrollbar">
                    <div className="space-y-6">
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
                                            <h2 className="text-2xl font-bold text-white">78<span className="text-base text-zinc-600 font-medium">/100</span></h2>
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
                                            <h2 className="text-2xl font-bold text-white">₹8,240<span className="text-base text-zinc-600 font-medium">.50</span></h2>
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
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
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
                                        <h3 className="text-xl font-bold text-white tracking-tight font-sans">Spending Trend</h3>
                                        <p className="text-sm text-zinc-500 font-medium mt-1">Last 6 Months</p>
                                    </div>
                                    <div className="px-3 py-1.5 bg-zinc-900/80 rounded-full border border-white/10 flex items-center gap-2 shadow-lg shadow-black/20">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                        <span className="text-xs font-bold text-emerald-400 tracking-wide">+24% vs average</span>
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
                                    <h2 className="text-[26px] font-bold text-white leading-none">₹6,295.29</h2>
                                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold tracking-wide">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        <span>12% increase</span>
                                    </div>
                                </div>

                                {/* List Group - Consistent 12px vertical rhythm */}
                                <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto custom-scrollbar pr-1">
                                    {categories.map((cat, i) => (
                                        <div key={cat.name} className="group relative">
                                            {/* Label Row - 4px bottom spacing (Label-to-Bar) */}
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-6 h-6 rounded-md ${cat.color} bg-opacity-20 flex items-center justify-center`}>
                                                        <cat.icon className="w-3.5 h-3.5 text-white" />
                                                    </div>
                                                    <span className="text-[12px] font-semibold text-zinc-300">{cat.name}</span>
                                                </div>
                                                <span className="text-[12px] font-bold text-white">₹{cat.amount}</span>
                                            </div>
                                            {/* Progress Bar - Clipped & Z-Indexed */}
                                            <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden relative z-0 ring-1 ring-white/5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(cat.amount / 2400) * 100}%` }}
                                                    transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                                                    className={`h-full ${cat.color} rounded-full relative z-10`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Bottom Action Strip */}
                        {/* Bottom Action Strip: Spending Control */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                            className="w-full bg-[#0A0F1C]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl shadow-black/50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/30 ring-4 ring-emerald-500/10 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                    <div className="absolute inset-0 bg-white/20 animate-pulse-slow sm:hidden" />
                                    <ShieldCheck className="w-5 h-5 text-white relative z-10" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg flex items-center gap-2">
                                        Spending Control
                                    </h4>
                                    <p className="text-xs text-zinc-400 font-medium">Safe to spend: <span className="text-white font-bold">₹3,200</span> • <span className="text-emerald-400">On track</span></p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex flex-col items-end gap-1 mr-2">
                                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Budget Used</div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-[78%] rounded-full" />
                                        </div>
                                        <span className="text-xs text-white font-bold">78%</span>
                                    </div>
                                </div>
                                <button className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10 flex items-center gap-2">
                                    Adjust Budget
                                    <Settings className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Dashboard
