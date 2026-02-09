import React, { useEffect } from 'react'
import { motion, useTransform, useMotionValue, useAnimation, animate } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Button from '../components/common/Button'
import { Signal, Battery, Shield, Bell, FileText, Sparkles, HelpCircle, LayoutDashboard, User } from 'lucide-react'
import { ArrowRight, TrendingUp, AlertCircle, Play, Check, Layers, PieChart, Activity, Wallet, CreditCard, BarChart3, ArrowUpRight, ShoppingBag } from 'lucide-react'
import Testimonials from '../components/sections/Testimonials'

// --- HERO SECTION COMPONENTS ---

const FloatingCard = ({ children, className, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: [6, -6, 6]
            }}
            transition={{
                opacity: { duration: 0.8, delay },
                y: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay * 2 // Offset loops for natural feel
                }
            }}
            whileHover={{
                scale: 1.05,
                y: -6,
                zIndex: 60,
                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
                transition: { duration: 0.12, ease: "easeOut" }
            }}
            onHoverEnd={() => ({
                transition: { duration: 0.2, ease: "easeInOut" }
            })}
            className={`absolute backdrop-blur-xl bg-zinc-900/80 border border-white/10 rounded-2xl p-4 shadow-2xl z-20 cursor-default ${className}`}
        >
            {children}
        </motion.div>
    )
}


const HeroPhoneInteraction = () => {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useTransform(y, [-300, 300], [5, -5])
    const rotateY = useTransform(x, [-300, 300], [-5, 5])

    function handleMouseMove(event) {
        const rect = event.currentTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        x.set(event.clientX - centerX)
        y.set(event.clientY - centerY)
    }

    function handleMouseLeave() {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            className="relative z-50 flex justify-center perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY }}
            whileHover={{ scale: 1.02, y: -10, transition: { duration: 0.3 } }}
        >
            {/* Phone Mockup - Strict Layout */}
            <div className="relative z-10 w-[380px] h-[780px] bg-zinc-950 rounded-[3.5rem] border-[10px] border-zinc-900 shadow-2xl overflow-hidden ring-1 ring-white/10 font-inter flex flex-col select-none pointer-events-none">
                {/* Status Bar - Fixed Top */}
                <div className="absolute top-0 right-0 w-full h-14 z-50 flex items-center justify-end px-7 pt-4">
                    <div className="flex items-center gap-2 text-white">
                        <span className="text-[13px] font-semibold tracking-wide">9:41</span>
                        <Battery className="w-[20px] h-[20px] opacity-90" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Dynamic Island */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[110px] h-[30px] bg-black rounded-full z-50 shadow-lg border border-zinc-800/80" />

                {/* Main Scrollable Content */}
                <div className="flex-1 w-full relative overflow-hidden flex flex-col pt-16 px-5 pb-32">
                    {/* Background Gradients */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-950/20 via-zinc-950/90 to-zinc-950 -z-10"></div>
                    <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] -z-10"></div>

                    {/* Header Row */}
                    <div className="w-full flex items-center justify-between mb-8 pl-1 pr-1 relative z-10">
                        <h2 className="text-[30px] font-bold text-white tracking-tight leading-none">Stats</h2>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-red-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Bell className="w-6 h-6 text-white transition-transform group-hover:scale-110" strokeWidth={2.5} />
                            <div className="absolute top-0 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-[3px] border-zinc-950"></div>
                        </div>
                    </div>

                    {/* Spending Trend Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full relative rounded-[2rem] bg-zinc-900/60 border border-white/5 p-6 overflow-hidden shadow-2xl mb-6"
                    >
                        <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-xl -z-10"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-60"></div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-[17px] font-bold text-white tracking-tight">Spending Trend</h3>
                                <p className="text-[12px] text-zinc-400 font-medium tracking-wide opacity-80">Last 6 Months</p>
                            </div>
                            <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                                +24%
                            </span>
                        </div>

                        <div className="h-36 flex items-end justify-between gap-3 relative z-10 px-1">
                            {/* Tooltip */}
                            <div className="absolute -top-14 left-[64%] -translate-x-1/2 bg-zinc-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.5)] border border-white/10 z-20 flex items-center gap-1">
                                <span className="text-blue-400">₹</span>8,240
                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-800 rotate-45 border-r border-b border-white/10"></div>
                            </div>

                            {[35, 55, 40, 65, 85, 45].map((h, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [`${h}%`, `${h - 5}%`, `${h}%`] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                                    className={`flex-1 rounded-full max-w-[16px] relative transition-all duration-300 ${i === 4 ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]' : 'bg-zinc-800'}`}
                                    style={{ height: `${h}%` }}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Action Row */}
                    <div className="w-full grid grid-cols-3 gap-4 mb-6">
                        {[
                            { icon: BarChart3, label: "Analytics" },
                            { icon: FileText, label: "Reports" },
                            { icon: Sparkles, label: "Insights" }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-2.5">
                                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-50"></div>
                                    <item.icon className="w-6 h-6 text-zinc-300" />
                                </div>
                                <span className="text-[11px] font-semibold text-zinc-400">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Financial Health Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="w-full relative rounded-[2rem] bg-zinc-900/60 border border-white/5 p-6 flex justify-between items-center overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-md -z-10"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 via-transparent to-transparent opacity-50"></div>

                        <div className="flex flex-col justify-center gap-1.5 z-10">
                            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">Financial Health</p>
                            <div className="flex items-center gap-3">
                                <h3 className="text-4xl font-bold text-white tracking-tighter">82</h3>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-[11px] font-bold text-emerald-400">Excellent</span>
                            </div>
                            <div className="flex gap-1.5 mt-2 h-1.5">
                                {[1, 1, 1, 1, 1].map((_, i) => (
                                    <div key={i} className={`w-5 h-1.5 rounded-full ${i >= 2 ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-emerald-500/20'}`} />
                                ))}
                            </div>
                        </div>

                        <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)] relative">
                            <Shield className="w-7 h-7 text-emerald-400" />
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Navigation - Fixed */}
                <div className="absolute bottom-6 left-6 right-6 h-[72px] bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.6)] z-50 flex items-center justify-between px-2">
                    {[
                        { icon: LayoutDashboard, label: "Dash", active: false },
                        { icon: BarChart3, label: "Stats", active: true },
                        { icon: HelpCircle, label: "Help", active: false },
                        { icon: User, label: "Profile", active: false }
                    ].map((item, i) => (
                        <div key={i} className={`flex-1 h-full flex flex-col items-center justify-center gap-1 ${!item.active && 'opacity-60'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.active ? 'bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-lg scale-110 -translate-y-2' : ''}`}>
                                <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-zinc-400'}`} strokeWidth={2.5} />
                            </div>
                            {!item.active && <span className="text-[9px] font-semibold text-zinc-500">{item.label}</span>}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

const TrackGoalsCard = () => {
    const controls = useAnimation()

    useEffect(() => {
        let isMounted = true;

        const loopAnimation = async () => {
            if (!isMounted) return;

            // Linear sweep across
            await controls.start({
                x: ["-100%", "200%"],
                transition: { duration: 2.5, ease: "linear" }
            });

            // Variable delay between loops (0.5s to 1.2s)
            if (isMounted) {
                const randomDelay = Math.random() * 700 + 500;
                await new Promise(resolve => setTimeout(resolve, randomDelay));
                loopAnimation(); // Recurse
            }
        };

        loopAnimation();

        return () => { isMounted = false; };
    }, [controls]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="h-[320px]"
        >
            <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 1.5 }}
                className="h-full"
            >
                <div className="group relative bg-[#09090b] border border-white/5 rounded-3xl p-6 overflow-hidden flex flex-col h-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:-translate-y-1.5 transition-transform duration-300 ease-out hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]">

                    {/* Ambient Background & Noise */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-gradient-to-tr from-emerald-900/10 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

                    {/* Header */}
                    <div className="relative z-10 mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-zinc-800/50 border border-white/5 flex items-center justify-center group/icon">
                                <TrendingUp className="w-5 h-5 text-emerald-500/80 group-hover/icon:text-emerald-400 transition-colors" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white leading-tight">Track Goals</h3>
                                <p className="text-[11px] text-zinc-500 font-medium tracking-wide">SMART SAVINGS</p>
                            </div>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">Save smarter with AI-guided goal planning.</p>
                    </div>

                    {/* Goal Content */}
                    {/* Goal Content - Redesigned with Donut */}
                    <div className="mt-auto relative z-10 flex items-end justify-between gap-4">
                        {/* Left: Text Details */}
                        <div className="flex flex-col gap-1 pb-1">
                            <h4 className="text-white font-bold text-lg leading-tight">Sony Bravia<br />4K TV</h4>
                            <div className="flex items-center gap-2 mt-1 mb-3">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Target</span>
                                <span className="text-sm font-bold text-zinc-300">₹89,999</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                <p className="text-[10px] text-emerald-500/90 font-medium tracking-wide uppercase">Save ₹6k / mo</p>
                            </div>
                        </div>

                        {/* Right: Premium Donut Chart */}
                        <div className="relative w-[120px] h-[120px] flex-shrink-0 group/donut">
                            {/* Ambient Glow Behind */}
                            <div className="absolute inset-0 bg-emerald-500/20 blur-[30px] rounded-full opacity-20 group-hover/donut:opacity-40 transition-opacity duration-500" />

                            <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                                {/* Definitions */}
                                <defs>
                                    <linearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#10b981" /> {/* emerald-500 */}
                                        <stop offset="100%" stopColor="#34d399" /> {/* emerald-400 */}
                                    </linearGradient>
                                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>

                                {/* 1. Outer Pulse Ring - Faint Energy Field */}
                                <motion.circle
                                    cx="50" cy="50" r="48"
                                    stroke="url(#donutGradient)"
                                    strokeWidth="0.5"
                                    fill="none"
                                    opacity="0.1"
                                    animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                />

                                {/* 2. Track Background - Dark Glass */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="rgba(255,255,255,0.06)"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeLinecap="round"
                                />

                                {/* 3. Progress Fill - 42% */}
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="url(#donutGradient)"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray="251.2" // 2 * pi * 40
                                    initial={{ strokeDashoffset: 251.2 }}
                                    whileInView={{ strokeDashoffset: 251.2 * (1 - 0.42) }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                    style={{ filter: "url(#glow)" }}
                                />


                            </svg>

                            {/* Tick Marker Layer - Rotated based on percentage */}
                            <motion.div
                                className="absolute inset-0 z-20"
                                initial={{ rotate: 0 }}
                                whileInView={{ rotate: 360 * 0.42 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                            >
                                <div className="absolute top-[10px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]" />
                            </motion.div>

                            {/* Floating Particles - Orbiting */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-[-10%] pointer-events-none"
                            >
                                <div className="absolute top-0 left-1/2 w-1 h-1 bg-emerald-400/40 rounded-full blur-[1px]" />
                                <div className="absolute bottom-1/4 right-0 w-1.5 h-1.5 bg-emerald-500/20 rounded-full blur-[1px]" />
                            </motion.div>

                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                    className="text-2xl font-bold text-white tracking-tighter"
                                >
                                    42<span className="text-sm text-emerald-500">%</span>
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="text-[8px] uppercase tracking-widest text-zinc-500 font-semibold"
                                >
                                    Goal
                                </motion.span>
                            </div>
                        </div>
                    </div>

                </div>
            </motion.div>
        </motion.div>
    )
}

const TrackIncomeCard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="h-[320px]"
        >
            <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
                className="h-full"
            >
                <motion.div
                    whileHover={{
                        y: -6,
                        boxShadow: "0 20px 40px -10px rgba(16,185,129,0.1), inset 0 1px 1px rgba(255,255,255,0.05)"
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="group relative bg-[#09090b] border border-white/5 rounded-3xl p-6 overflow-hidden flex flex-col h-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                >
                    {/* Ambient Background & Noise */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-to-tl from-emerald-900/10 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none" />
                    {/* Header */}
                    <div className="relative z-10 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800/50 border border-white/5 flex items-center justify-center mb-6">
                            <Wallet className="w-5 h-5 text-emerald-500/80" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Track Income</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Detect deposits automatically. <span className="text-[#1EDB9F] font-medium block mt-1">Net after expenses</span>
                        </p>
                    </div>

                    {/* Solid Graph */}
                    <div className="mt-auto h-28 flex items-end justify-between gap-3 relative z-10 px-1">
                        {[35, 55, 45, 75, 60, 85].map((h, i) => {
                            const isVerified = i === 5;
                            return (
                                <div key={i} className="relative flex-1 h-full flex items-end group/bar">
                                    <motion.div
                                        initial={{ height: "0%" }}
                                        whileInView={{ height: `${h}%` }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.8,
                                            delay: i * 0.1,
                                            ease: "easeOut"
                                        }}
                                        whileHover={{
                                            y: isVerified ? -5 : 0,
                                            scaleY: 1.04,
                                            filter: isVerified ? "brightness(1)" : "brightness(1.5)",
                                            transition: { duration: 0.2, ease: "easeOut" }
                                        }}
                                        style={{ originY: 1 }}
                                        className={`w-full rounded-[2px] transition-all duration-300 relative
                                    ${isVerified
                                                ? 'bg-gradient-to-br from-[#1EDB9F] to-[#059669] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]'
                                                : 'bg-gradient-to-br from-zinc-600 to-zinc-800'
                                            }`}
                                    >
                                        {/* Active State Indicators (Only for Verified Bar) */}
                                        {isVerified && (
                                            <>
                                                {/* Hover Highlight (Inner) */}
                                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200" />

                                                {/* Vertical Indicator Line */}
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-px h-3 bg-[#1EDB9F]/60 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200" />

                                                {/* Hover Label */}
                                                <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 pointer-events-none">
                                                    <span className="text-[10px] font-bold text-[#1EDB9F] tracking-wide uppercase">Active</span>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

const CinematicRadar = () => {
    // Interactive Tilt Logic
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useTransform(y, [-200, 200], [5, -5])
    const rotateY = useTransform(x, [-200, 200], [-5, 5])

    function handleMouseMove(e) {
        const rect = e.currentTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        x.set(e.clientX - centerX)
        y.set(e.clientY - centerY)
    }

    function handleMouseLeave() {
        x.set(0)
        y.set(0)
    }

    // --- Radar Logic ---
    // 6 Axes: Spending, Savings, Investments, Goals, Liquidity, Growth
    const v1 = useMotionValue(60) // Spending
    const v2 = useMotionValue(45) // Savings
    const v3 = useMotionValue(70) // Investments
    const v4 = useMotionValue(50) // Goals
    const v5 = useMotionValue(30) // Liquidity
    const v6 = useMotionValue(55) // Growth

    useEffect(() => {
        // Randomize animations for each axis to simulate "live" data
        const animateAxis = (val, base, range) => {
            const sequence = [
                base,
                base + Math.random() * range,
                base - Math.random() * range,
                base + Math.random() * (range / 2),
                base
            ]
            animate(val, sequence, {
                duration: 3 + Math.random() * 2, // variable duration 3-5s
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "mirror"
            })
        }

        animateAxis(v1, 65, 20)
        animateAxis(v2, 50, 15)
        animateAxis(v3, 75, 20)
        animateAxis(v4, 55, 15)
        animateAxis(v5, 40, 10)
        animateAxis(v6, 60, 20)
    }, [v1, v2, v3, v4, v5, v6])

    // Transform values into path 'd' attribute
    const pathD = useTransform([v1, v2, v3, v4, v5, v6], (values) => {
        const points = values.map((r, i) => {
            const angle = (i * 60 - 90) * (Math.PI / 180) // -90 to start at top
            const px = 50 + (r * 0.45) * Math.cos(angle) // max radius 45% (to leave padding)
            const py = 50 + (r * 0.45) * Math.sin(angle)
            return `${px},${py}`
        })
        return `M ${points[0]} L ${points[1]} L ${points[2]} L ${points[3]} L ${points[4]} L ${points[5]} Z`
    })

    // Helper to get x/y for a specific index from the MotionValues
    const useVertex = (index, mv) => {
        const angle = (index * 60 - 90) * (Math.PI / 180)
        const x = useTransform(mv, r => 50 + (r * 0.45) * Math.cos(angle))
        const y = useTransform(mv, r => 50 + (r * 0.45) * Math.sin(angle))
        return { x, y }
    }

    const p1 = useVertex(0, v1)
    const p2 = useVertex(1, v2)
    const p3 = useVertex(2, v3)
    const p4 = useVertex(3, v4)
    const p5 = useVertex(4, v5)
    const p6 = useVertex(5, v6)
    const corners = [p1, p2, p3, p4, p5, p6]
    const labels = ["Spending", "Savings", "Invest", "Goals", "Liquid", "Growth"]

    return (
        <motion.div
            className="relative w-[450px] h-[450px] flex items-center justify-center perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Mouse Follower Glow (Subtle) */}
            <motion.div
                className="absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full transition-opacity duration-300 pointer-events-none"
                style={{ x: useTransform(x, v => v * 0.1), y: useTransform(y, v => v * 0.1) }}
            />

            <motion.div
                style={{ rotateX, rotateY }}
                className="relative w-full h-full flex items-center justify-center"
            >
                <svg viewBox="0 0 100 100" className="absolute w-full h-full overflow-visible">
                    <defs>
                        <radialGradient id="radarOrganicFill" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                            <stop offset="60%" stopColor="rgba(59, 130, 246, 0.05)" />
                            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                        </radialGradient>
                        <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="1" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* --- Layer 1: Background Grid (Faded) --- */}
                    <g className="opacity-20">
                        {/* Concentric Rings */}
                        {[15, 30, 45].map((r, i) => (
                            <circle
                                key={`ring-${i}`}
                                cx="50" cy="50" r={r}
                                fill="none"
                                stroke="#94a3b8"
                                strokeWidth="0.2"
                                strokeDasharray="1 2"
                            />
                        ))}
                        {/* Spokes */}
                        {[0, 60, 120, 180, 240, 300].map(deg => {
                            const rad = (deg - 90) * (Math.PI / 180)
                            const x2 = 50 + 45 * Math.cos(rad)
                            const y2 = 50 + 45 * Math.sin(rad)
                            return <line key={deg} x1="50" y1="50" x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="0.2" />
                        })}
                    </g>

                    {/* --- Layer 2: Calculated Organic Shape --- */}
                    <motion.path
                        d={pathD}
                        fill="url(#radarOrganicFill)"
                        stroke="#3b82f6" // Blue-500
                        strokeWidth="0.8"
                        strokeLinejoin="round"
                        filter="url(#glow-strong)"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />

                    {/* --- Layer 3: Vertices & Labels --- */}
                    {corners.map((pos, i) => (
                        <g key={`vertex-${i}`}>
                            {/* Vertex Dot */}
                            <motion.circle
                                cx={pos.x}
                                cy={pos.y}
                                r="1.5"
                                fill="white"
                                stroke="#2563eb"
                                strokeWidth="0.5"
                            />

                            {/* Label */}
                            {(() => {
                                const angle = (i * 60 - 90) * (Math.PI / 180)
                                const lx = 50 + 52 * Math.cos(angle)
                                const ly = 50 + 52 * Math.sin(angle)
                                return (
                                    <text
                                        x={lx}
                                        y={ly}
                                        fontSize="3"
                                        fill="#aaa"
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        className="font-mono uppercase tracking-wider font-semibold"
                                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                                    >
                                        {labels[i]}
                                    </text>
                                )
                            })()}
                        </g>
                    ))}

                </svg>
            </motion.div>
        </motion.div>
    )
}

const ProductHero = () => {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex flex-col items-center justify-center text-center">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-[80rem] mx-auto text-center mb-16 px-4"
                >
                    <div className="inline-flex items-center h-6 px-3 rounded-full bg-zinc-900/60 border border-white/5 mb-6 backdrop-blur-sm shadow-sm gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse"></span>
                        <span className="text-[10px] md:text-[11px] font-medium text-zinc-400 tracking-widest uppercase leading-none pt-[1px]">FortisFlow Intelligence</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05] md:whitespace-nowrap">
                        Understand. Control. Grow.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-violet-500 bg-[length:200%_auto] animate-[shimmer_4s_linear_infinite] drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] pb-2 block">Your money — with AI clarity.</span>
                    </h1>

                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                        FortisFlow turns raw transactions into intelligent financial insight. It auto-tracks spending, predicts savings opportunities, and shows your real financial health in real time — without manual spreadsheets or guesswork.
                    </p>

                    <div className="flex justify-center items-center mt-8 w-full">
                        <div className="inline-block group relative">
                            <button className="group inline-flex min-w-[140px] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-105 border border-white/10 text-sm font-medium text-white/80 hover:text-white tracking-tight bg-white/5 backdrop-blur-xl rounded-full py-3 px-5 relative items-center justify-center gap-2 shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play-circle h-4 w-4" style={{ strokeWidth: 1.5 }}>
                                    <circle cx="12" cy="12" r="10" />
                                    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                                </svg>
                                <span className="relative">Watch demo</span>
                                <span aria-hidden="true" className="transition-all duration-300 group-hover:opacity-80 opacity-20 w-[70%] h-[1px] rounded-full absolute bottom-0 left-1/2 -translate-x-1/2" style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 50%,rgba(255,255,255,0) 100%)' }}></span>
                            </button>
                            <span className="pointer-events-none absolute -bottom-3 left-1/2 z-0 h-6 w-44 -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" style={{ background: 'radial-gradient(60% 100% at 50% 50%, rgba(139,92,246,.55), rgba(139,92,246,.28) 35%, transparent 70%)', filter: 'blur(10px) saturate(120%)' }} aria-hidden="true"></span>
                        </div>
                    </div>
                </motion.div>

                {/* Interactive Hero Stage - Radial Orbit Layout */}
                <div className="w-full max-w-[1280px] mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center relative z-20 perspective-1000">

                    {/* LEFT ORBIT COLUMN: Top-Left & Bottom-Left */}
                    <div className="hidden lg:flex flex-col justify-between h-[640px] items-end pointer-events-none pb-20 pt-10">
                        {/* Top-Left: Netflix (Subscription) */}
                        <FloatingCard className="relative right-0 pointer-events-auto" delay={0.2}>
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="text-sm font-bold text-white mb-1">Netflix</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 uppercase tracking-wider font-semibold">Sub</span>
                                        <p className="text-sm font-bold text-white">-₹1,299</p>
                                    </div>
                                </div>
                            </div>
                        </FloatingCard>

                        {/* Bottom-Left: Starbucks (Dining) */}
                        <FloatingCard className="relative right-8 pointer-events-auto" delay={0.8}>
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                                    <Activity className="w-6 h-6" />
                                    {/* Using Activity generic or CreditCard */}
                                </div>
                                <div className="text-left flex-1">
                                    <p className="text-sm font-bold text-white mb-1">Starbucks</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase tracking-wider font-semibold">Food</span>
                                        <p className="text-sm font-bold text-white">-₹350</p>
                                    </div>
                                </div>
                            </div>
                        </FloatingCard>
                    </div>

                    {/* CENTER COLUMN: Interactive Phone Mockup */}
                    {/* This layer is z-50 and handles the mouse interaction */}
                    <HeroPhoneInteraction />

                    {/* RIGHT ORBIT COLUMN: Top-Right & Bottom-Right */}
                    <div className="hidden lg:flex flex-col justify-between h-[640px] items-start pointer-events-none pb-20 pt-10">
                        {/* Top-Right: Uber (Transport) */}
                        <FloatingCard className="relative left-0 pointer-events-auto" delay={1.0}>
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-white border border-zinc-700 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="text-sm font-bold text-white mb-1">Uber</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700 uppercase tracking-wider font-semibold">Ride</span>
                                        <p className="text-sm font-bold text-white">-₹245</p>
                                    </div>
                                </div>
                            </div>
                        </FloatingCard>

                        {/* Bottom-Right: Amazon (Shopping) */}
                        <FloatingCard className="relative left-8 pointer-events-auto" delay={0.5}>
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <div className="text-left flex-1">
                                    <p className="text-sm font-bold text-white mb-1">Amazon</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 uppercase tracking-wider font-semibold">Shop</span>
                                        <p className="text-sm font-bold text-white">-₹4,500</p>
                                    </div>
                                </div>
                            </div>
                        </FloatingCard>
                    </div>

                </div>

                {/* Floor Glow */}
                <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-[400px] h-[100px] bg-blue-500/20 rounded-[100%] blur-[60px] transform rotate-x-[60deg]"></div>
            </div>
        </section>
    )
}

const Product = () => {
    return (
        <div className="min-h-screen bg-transparent text-white font-inter selection:bg-blue-500/30">
            <Navbar />
            <main>
                <ProductHero />

                {/* AUTOMATION SECTION */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Left Text */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                    Smart auto-categorization <br />
                                    <span className="text-blue-500">and instant summaries.</span>
                                </h2>
                                <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                                    FortisFlow learns your spending patterns and automatically tags transactions, groups expenses, and builds clean summaries — zero manual sorting.
                                </p>
                                <ul className="space-y-4">
                                    {['Self-learning categories', 'Merchant recognition', 'Real-time tagging', 'Editable rules'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-zinc-300">
                                            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-blue-400" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            {/* Right Visual: Stacked Cards */}
                            <div className="relative h-[400px] flex items-center justify-center">
                                {/* Glow behind stack */}
                                <div className="absolute inset-0 bg-blue-600/5 blur-[80px] rounded-full pointer-events-none"></div>

                                <div className="relative w-full max-w-sm perspective-1000">
                                    {[
                                        { name: 'Netflix', cat: 'Subscription', amount: '-₹1,299', color: 'bg-red-500/10 text-red-500', icon: Layers, yBase: 0, scale: 1, z: 30, delay: 0 },
                                        { name: 'Starbucks', cat: 'Dining', amount: '-₹350', color: 'bg-amber-500/10 text-amber-500', icon: CreditCard, yBase: 100, scale: 0.96, z: 20, delay: 0.15 },
                                        { name: 'Uber', cat: 'Transport', amount: '-₹245', color: 'bg-zinc-800 text-white', icon: Activity, yBase: 200, scale: 0.92, z: 10, delay: 0.3 },
                                    ].map((card, i) => (
                                        // Parent Wrapper: Handles Positioning, Entrance, and Hover Lift/Z-Index
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.97, y: card.yBase }}
                                            whileInView={{ opacity: 1, scale: 1, y: card.yBase }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            transition={{
                                                duration: 0.8,
                                                delay: i * 0.12,
                                                ease: [0.16, 1, 0.3, 1]
                                            }}
                                            whileHover={{
                                                y: card.yBase - 4, // Lift -4px on interaction
                                                zIndex: 50,
                                                scale: 1, // Ensure no scale pulse
                                                transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                                            }}
                                            className="absolute left-0 right-0 group cursor-default"
                                            style={{
                                                zIndex: card.z,
                                                scale: card.scale,
                                                top: 0
                                            }}
                                        >
                                            {/* Child: Handles Continuous 'Alive' Float (Uninterrupted) */}
                                            <motion.div
                                                animate={{ y: [0, -2, 0] }} // Relative idle float ±2px
                                                transition={{
                                                    duration: 6,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                    delay: 1 + (i * 1.5)
                                                }}
                                                className="p-5 rounded-2xl bg-zinc-900/95 border border-white/5 shadow-xl flex items-center justify-between backdrop-blur-md transition-all duration-300 group-hover:bg-[#0c0c0e] group-hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.15)] group-hover:border-white/15"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors duration-300`}>
                                                        <card.icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white mb-0.5 text-base group-hover:text-blue-100 transition-colors">{card.name}</h4>
                                                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-xs text-zinc-500 font-medium group-hover:text-zinc-400">{card.cat}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-white/90 text-lg tracking-tight group-hover:text-white transition-colors">{card.amount}</span>

                                                {/* Edge Glow */}
                                                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-blue-500/0 group-hover:ring-blue-500/20 transition-all duration-500 pointer-events-none" />
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CORE MODULES SECTION */}
                <section className="py-24 relative overflow-hidden">
                    {/* Background: Deep Navy -> Black Radial w/ Seamless Blend */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/30 via-zinc-950/80 to-zinc-950 pointer-events-none -z-20"></div>

                    {/* Ambient Glow: Subtle Blue behind the cards */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center max-w-2xl mx-auto mb-16"
                        >
                            <h2 className="text-3xl font-bold mb-4">Complete Financial Clarity</h2>
                            <p className="text-zinc-400">Everything you need to master your money in one place.</p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Card 1: Track Expenses (Custom Analytics Design) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="h-[320px]"
                            >
                                <motion.div
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 1 }}
                                    className="h-full"
                                >
                                    <motion.div
                                        whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)" }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="group relative bg-[#09090b] border border-white/5 rounded-3xl p-6 overflow-hidden flex flex-col h-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                                    >
                                        {/* Background Noise */}
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
                                        <div className="absolute top-0 left-0 w-3/4 h-3/4 bg-gradient-to-br from-blue-900/10 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />


                                        {/* Header */}
                                        <div className="mb-6 relative z-10">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                                    <CreditCard className="w-5 h-5" />
                                                </div>
                                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider bg-white/5 px-2 py-1 rounded-md border border-white/5">Analytics</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-1">Track Expenses</h3>
                                            <p className="text-sm text-zinc-400 leading-relaxed max-w-[90%]">Monitor daily spending with AI-grouped categories.</p>
                                        </div>

                                        <div className="mt-6 space-y-3">
                                            {[
                                                { title: 'Whole Foods', time: 'Yesterday', amount: '-₹4,250', icon: ShoppingBag, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                                                { title: 'Uber Ride', time: 'Today', amount: '-₹245', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                                                { title: 'Netflix', time: '2 days ago', amount: '-₹1,299', icon: Layers, color: 'text-red-400', bg: 'bg-red-500/10' },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between py-2 group/row cursor-default">
                                                    <div className="flex items-center gap-3">
                                                        {/* Minimal Icon - No Background */}
                                                        <div className={`flex items-center justify-center ${item.color} opacity-80 group-hover/row:opacity-100 group-hover/row:scale-110 transition-all duration-300`}>
                                                            <item.icon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-zinc-300 group-hover/row:text-white transition-colors">{item.title}</p>
                                                            <p className="text-[10px] text-zinc-500 font-medium group-hover/row:text-zinc-400 transition-colors">{item.time}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-semibold text-zinc-200 group-hover/row:text-white group-hover/row:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all duration-300">{item.amount}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>


                            {/* NEW PREMIUM CARD: Track Income */}
                            <TrackIncomeCard />

                            {/* NEW PREMIUM CARD: Track Goals */}
                            <TrackGoalsCard />

                        </div>
                    </div>
                </section>
                {/* ANALYTICS SECTION */}
                <section className="py-24 relative overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">

                            {/* Left: Radar Chart Visualization - Cinematic Reveal */}
                            <div className="relative order-2 lg:order-1 flex items-center justify-center h-[500px]">
                                <CinematicRadar />
                            </div>

                            {/* Right: Text Content */}
                            <motion.div
                                className="order-1 lg:order-2"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                    See cash flow, trends, <br />
                                    <span className="text-violet-500">and financial health clearly.</span>
                                </h2>
                                <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                                    FortisFlow converts your transaction history into visual intelligence — showing where money goes, what patterns exist, and where you can improve.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        { title: 'Monthly Net Worth', desc: 'Track your total asset growth over time.' },
                                        { title: 'AI Spending Breakdown', desc: 'Understand exactly where your money goes.' },
                                        { title: 'Predictive Savings Forecast', desc: 'Forecast your future balance based on habits.' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center flex-shrink-0">
                                                <Activity className="w-5 h-5 text-violet-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                                <p className="text-sm text-zinc-500">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* TESTIMONIALS SECTION */}
                <Testimonials />

                {/* CTA / Footer Area Replacement could go here, but fitting to existing sections */}
                <div className="pb-20"></div>
            </main>
        </div>
    )
}

export default Product
