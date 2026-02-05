import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import Navbar from '../../components/layout/Navbar'
import Button from '../../components/common/Button'
import { Loader2, Github, User, Mail, Lock, ShieldCheck, Zap, AlertCircle, TrendingUp, Activity, Home, Utensils, ArrowUpRight, Layers, Eye, EyeOff, Check } from 'lucide-react'

// --- VISUALS COMPONENT (RIGHT SIDE) ---
const LoginVisuals = () => {
    const ref = useRef(null)

    // Mouse position values
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Smooth springs for tilt - Reduced sensitivity for premium weight
    const rotateX = useSpring(useTransform(y, [-300, 300], [2, -2]), { stiffness: 100, damping: 30 })
    const rotateY = useSpring(useTransform(x, [-300, 300], [-4, 4]), { stiffness: 100, damping: 30 })

    // Glare position - Softer intensity
    const glareX = useSpring(useTransform(x, [-300, 300], [0, 100]), { stiffness: 150, damping: 20 })
    const glareY = useSpring(useTransform(y, [-300, 300], [0, 100]), { stiffness: 150, damping: 20 })

    function handleMouseMove(event) {
        const rect = event.currentTarget.getBoundingClientRect()
        const xPos = event.clientX - rect.left - rect.width / 2
        const yPos = event.clientY - rect.top - rect.height / 2
        x.set(xPos)
        y.set(yPos)
    }

    function handleMouseLeave() {
        x.set(0)
        y.set(0)
    }

    return (
        <div
            ref={ref}
            className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900"
            style={{ perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background Gradient (Edge-to-Edge) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a]" />

            {/* Ambient Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

            {/* UNIFIED 3D WRAPPER */}
            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative z-10 w-[320px] h-[680px] group"
            >
                {/* 360° Ambient Glow (Intensified) */}
                <motion.div
                    animate={{
                        opacity: [0.5, 0.8, 0.5],
                        scale: [0.98, 1.02, 0.98],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -inset-16 bg-gradient-to-tr from-blue-600/40 via-violet-500/40 to-blue-600/40 blur-[50px] rounded-[4.5rem] -z-10 group-hover:opacity-100 group-hover:blur-[60px] transition-all duration-700"
                />

                {/* --- PHONE CONTAINER --- */}
                <div className="absolute inset-0 w-full h-full bg-zinc-950 rounded-[3.5rem] border-[8px] border-zinc-900 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] ring-1 ring-white/20 flex flex-col overflow-hidden">
                    {/* Inner Rim Light */}
                    <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] pointer-events-none z-50"></div>

                    {/* Glare */}
                    <motion.div
                        className="absolute inset-0 w-full h-full z-50 pointer-events-none mix-blend-soft-light opacity-60"
                        style={{
                            background: useTransform(
                                [glareX, glareY],
                                ([latestX, latestY]) => `radial-gradient(circle at ${latestX}% ${latestY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
                            )
                        }}
                    />

                    {/* Scrollbar Hide */}
                    <style>{`
                        .no-scrollbar::-webkit-scrollbar { display: none; }
                        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    `}</style>

                    {/* Inner Gloss */}
                    <div className="absolute inset-0 pointer-events-none z-40 rounded-[3rem] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
                    <div className="absolute inset-0 pointer-events-none z-40 rounded-[3rem] opacity-20 bg-gradient-to-tr from-white/5 to-transparent mix-blend-overlay" />

                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 w-full h-8 flex items-center justify-between px-6 z-30 bg-zinc-950/80 backdrop-blur-md">
                        <span className="text-[10px] font-medium text-white">9:41</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 bg-white rounded-full opacity-20" />
                            <div className="w-3 h-3 bg-white rounded-full opacity-20" />
                            <div className="w-3 h-3 bg-white rounded-full" />
                        </div>
                    </div>

                    {/* Island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30" />

                    {/* --- DASHBOARD CONTENT --- */}
                    <div className="flex-1 overflow-y-auto pt-14 pb-12 px-5 font-manrope space-y-6 no-scrollbar bg-zinc-950 relative z-20">

                        {/* Top Bar: DASHBOARD + Avatar */}
                        <div className="flex items-center justify-between mb-4 mt-2">
                            <h2 className="text-sm font-medium text-zinc-200 tracking-wide">DASHBOARD</h2>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500/30 to-purple-500/30 p-[1px] shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                                <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center border border-white/10 group">
                                    <User className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* Card 1: Monthly Spend */}
                        <div className="bg-zinc-900/50 rounded-2xl p-5 border border-white/5 relative overflow-hidden group shadow-lg">
                            <div className="absolute top-0 right-0 p-4 opacity-50"><Activity className="w-5 h-5 text-blue-500 animate-pulse" /></div>
                            <p className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase mb-1">Monthly Spend</p>
                            <h3 className="text-3xl font-bold text-white tracking-tight">₹8,240.50</h3>
                            <div className="flex items-center gap-1 mt-2">
                                <span className="text-xs font-semibold text-emerald-400 flex items-center"><ArrowUpRight className="w-3 h-3" /> +2.1%</span>
                                <span className="text-[10px] text-zinc-600 font-medium">vs last month</span>
                            </div>
                        </div>

                        {/* Card 2: Financial Health */}
                        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl -z-10"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">Financial Health</p>
                                    <div className="flex items-baseline gap-1.5 mt-1">
                                        <span className="text-4xl font-bold text-white">82</span>
                                        <span className="text-sm text-zinc-600 font-medium">/ 100</span>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                            </div>
                            {/* Minimal Bar Visualization */}
                            <div className="h-10 flex items-end gap-1.5 mb-3">
                                {[30, 40, 35, 50, 45, 60, 82].map((h, i) => (
                                    <div key={i} className={`flex-1 rounded-t-sm ${i === 6 ? 'bg-emerald-500' : 'bg-zinc-800'}`} style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </div>

                        {/* Card 3: Recent Transactions (Two Rows Only) */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between px-1 mb-2">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Recent Transactions</p>
                            </div>
                            <div className="flex flex-col space-y-0">
                                {/* Housing */}
                                <div className="flex items-center justify-between p-3 rounded-t-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                            <Home className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">Housing</span>
                                    </div>
                                    <span className="text-xs font-bold text-white">-₹2,400</span>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent my-1" />

                                {/* Subscriptions */}
                                <div className="flex items-center justify-between p-3 rounded-b-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                                            style={{ background: 'linear-gradient(135deg, #0F1115 0%, #0B0D12 100%)' }}
                                        >
                                            <Layers className="w-3.5 h-3.5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                                        </div>
                                        <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">Subscriptions</span>
                                    </div>
                                    <span className="text-xs font-bold text-white">-₹320</span>
                                </div>
                            </div>
                        </div>

                        {/* Budget Hit Drop-Down Indicator (Internal) */}
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                            className="absolute bottom-[12%] right-0 w-[160px] h-px bg-gradient-to-l from-transparent via-yellow-500/20 to-transparent blur-[0.5px]"
                        />

                        <div className="h-8" />
                    </div>

                    {/* Bottom Fade */}
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none z-30" />
                </div>

                {/* --- FLOATING HOVER CARDS (Outside Phone) --- */}

                {/* Savings Goal - Top Left Overlap */}
                <motion.div
                    style={{ transform: "translateZ(60px)" }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[18%] -left-12 isolate z-50 max-w-[170px] rounded-xl bg-[#141820]/72 backdrop-blur-[12px] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] p-3"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex-shrink-0 flex items-center justify-center text-emerald-400 font-bold shadow-inner border border-emerald-500/10">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Savings Goal</p>
                            <p className="text-xs font-bold text-white tracking-tight">+₹12,450 saved</p>
                        </div>
                    </div>
                </motion.div>

                {/* Budget Hit - Bottom Right */}
                <motion.div
                    style={{ transform: "translateZ(40px)" }}
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[10%] -right-3 isolate z-50 max-w-[180px] rounded-xl bg-[#141820]/72 backdrop-blur-[12px] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] p-3"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex-shrink-0 flex items-center justify-center text-amber-400 font-bold shadow-inner border border-amber-500/10">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Budget Hit</p>
                            <p className="text-xs font-bold text-white tracking-tight">Dining Out limit</p>
                        </div>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    )
}

// --- MAIN LOGIN PAGE ---
const Login = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 2000)
    }

    return (
        <div className="min-h-screen w-full bg-[#050507] text-white flex flex-col font-inter">
            {/* 1. Navbar (Fixed) */}
            <Navbar />

            {/* 2. Main Layout (Centered Card) */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 z-10 pt-36 md:pt-40">

                {/* THE CARD FRAME */}
                <div className="w-full max-w-[1280px] h-[800px] bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-[3rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative ring-1 ring-white/5">

                    {/* LEFT SIDE: AUTH FORM */}
                    <div className="relative flex items-center justify-center p-12 lg:p-16 bg-zinc-950/50">
                        <div className="w-full max-w-md space-y-7 animate-fade-up">

                            {/* Header */}
                            <div className="text-left space-y-2">
                                <h1 className="text-3xl lg:text-4xl font-medium font-serif text-white tracking-[-0.02em]">
                                    Login to your account
                                </h1>
                                <p className="text-white/[0.72] text-[15px] font-inter font-normal leading-[1.55] tracking-[-0.01em] max-w-sm">
                                    AI-powered insights to track spending, budgets, and financial health in real time.
                                </p>
                            </div>

                            {/* Auth Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Google Button */}
                                <button className="h-[50px] rounded-[14px] bg-white/[0.04] border border-white/[0.08] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-white/[0.08] hover:border-white/[0.16] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)] transition-all duration-300 flex items-center justify-center gap-3 group">
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span className="text-white font-medium tracking-[-0.01em]">Google</span>
                                </button>

                                {/* GitHub Button */}
                                <button className="h-[50px] rounded-[14px] bg-white/[0.04] border border-white/[0.08] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-white/[0.08] hover:border-white/[0.16] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)] transition-all duration-300 flex items-center justify-center gap-3 group">
                                    <Github className="w-5 h-5 text-white/90 group-hover:scale-110 transition-transform duration-300" />
                                    <span className="text-white font-medium tracking-[-0.01em]">GitHub</span>
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-zinc-800" />
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-bold">
                                    <span className="bg-zinc-950 px-3 text-zinc-500">Or continue with email</span>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-400 ml-1 tracking-wide">Email or Username</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors duration-300" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-11 pr-5 py-3.5 rounded-xl bg-zinc-900/50 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all duration-300 text-white placeholder-zinc-600 font-medium text-sm hover:border-white/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-400 ml-1 tracking-wide">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors duration-300" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-zinc-900/50 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all duration-300 text-white placeholder-zinc-600 font-medium text-sm hover:border-white/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button variant="shiny" className="w-full py-4 rounded-xl mt-4 text-sm font-bold tracking-wide shadow-xl shadow-blue-900/20 hover:shadow-blue-900/40 transition-shadow duration-300" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                                </Button>
                            </form>

                            {/* Footer */}
                            <p className="text-center text-xs text-zinc-500">
                                Don’t have an account?{' '}
                                <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* RIGHT SIDE: VISUALS */}
                    <div className="relative hidden lg:block h-full bg-zinc-900 overflow-hidden">
                        <LoginVisuals />

                        {/* Overlay Shadow for Depth at seam */}
                        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-950/50 to-transparent pointer-events-none" />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login
