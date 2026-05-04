import { Link } from 'react-router-dom'
import Button from '../common/Button'
import ScrollReveal from '../common/ScrollReveal'
import { ArrowRight, ChevronRight } from 'lucide-react'
import CapabilityStrip from './CapabilityStrip'

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex flex-col items-center justify-center text-center">
            {/* Glow */}
            {/* Glow - REMOVED for clean dark look */}
            {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div> */}

            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-8 animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span className="text-xs font-semibold text-zinc-300">FortisFlow 2.0 is live</span>
                    <ChevronRight className="w-3 h-3 text-zinc-500" />
                </div>

                <ScrollReveal width="100%">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.1] mb-12 max-w-6xl mx-auto font-body text-white">
                        Manage your finances with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-medium">Intelligence.</span>
                    </h1>
                </ScrollReveal>

                <ScrollReveal width="100%" delay={0.2}>
                    <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
                        See where your money really goes. FortisFlow tracks spending, scores your financial health, and gives AI-driven saving guidance in real time.
                    </p>
                </ScrollReveal>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mt-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <Link to="/product">
                        <Button variant="shiny" className="px-8 py-4 text-base shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                            Explore features <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>


            </div>

            {/* Capability Strip */}
            <CapabilityStrip />

            {/* Dashboard Preview — Rich Static Mockup */}
            <div className="mt-16 w-full max-w-6xl mx-auto px-4 relative">
                {/* Ambient glow behind the card */}
                <div className="absolute -inset-4 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />

                {/* Browser chrome frame */}
                <div className="relative rounded-2xl border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
                    {/* Title bar */}
                    <div className="bg-zinc-900 border-b border-white/5 px-4 py-3 flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                        </div>
                        <div className="flex-1 mx-4 bg-zinc-800 rounded-md px-3 py-1 text-[11px] text-zinc-500 text-left select-none">
                            app.fortisflow.in/dashboard
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                    </div>

                    {/* App shell */}
                    <div className="bg-[#09090b] flex" style={{ minHeight: 520 }}>
                        {/* Sidebar */}
                        <div className="w-14 bg-zinc-950 border-r border-white/5 flex flex-col items-center py-4 gap-3 shrink-0">
                            {/* Logo */}
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 mb-3 flex items-center justify-center">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10 L5 6 L8 8 L12 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            {[
                                <><rect x="2" y="2" width="4" height="4" rx="1"/><rect x="8" y="2" width="4" height="4" rx="1"/><rect x="2" y="8" width="4" height="4" rx="1"/><rect x="8" y="8" width="4" height="4" rx="1"/></>,
                                <><rect x="2" y="3" width="10" height="1.5" rx="0.75"/><rect x="2" y="6.25" width="7" height="1.5" rx="0.75"/><rect x="2" y="9.5" width="9" height="1.5" rx="0.75"/></>,
                                <><circle cx="7" cy="5" r="3"/><path d="M2 13c0-2.76 2.24-5 5-5s5 2.24 5 5"/></>,
                            ].map((icon, i) => (
                                <div key={i} className={`w-9 h-9 rounded-xl flex items-center justify-center ${i === 0 ? 'bg-blue-500/15 border border-blue-500/30' : 'hover:bg-white/5'}`}>
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={i === 0 ? '#60a5fa' : '#52525b'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        {icon}
                                    </svg>
                                </div>
                            ))}
                        </div>

                        {/* Main content */}
                        <div className="flex-1 p-5 overflow-hidden flex flex-col gap-4">

                            {/* ── Row 1: KPI Cards ── */}
                            <div className="grid grid-cols-3 gap-3">
                                {/* Health Score */}
                                <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-4 h-[110px] flex flex-col justify-between">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest">Financial Health</p>
                                            <p className="text-white text-2xl font-bold mt-0.5">84<span className="text-zinc-600 text-sm font-medium">/100</span></p>
                                        </div>
                                        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round"><path d="M2 10 L5 7 L8 9 L12 4"/><path d="M10 4h2v2"/></svg>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-wide">↑ Good</span>
                                        <span className="text-zinc-600 text-[9px]">Budget · Goals · Savings</span>
                                    </div>
                                </div>

                                {/* Monthly Spend */}
                                <div className="bg-zinc-900/60 border border-white/5 rounded-2xl p-4 h-[110px] flex flex-col justify-between">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest">Monthly Spend</p>
                                            <p className="text-white text-2xl font-bold mt-0.5">₹32,450</p>
                                        </div>
                                        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"><path d="M2 7h10M7 2v10"/><circle cx="7" cy="7" r="5"/></svg>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 rounded-md bg-rose-500/10 text-rose-400 text-[9px] font-black uppercase tracking-wide">↑ 12%</span>
                                        <span className="text-zinc-600 text-[9px]">vs last month</span>
                                    </div>
                                </div>

                                {/* AI Insight */}
                                <div className="relative rounded-2xl p-4 h-[110px] flex flex-col justify-between overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700" />
                                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
                                    <div className="relative z-10 flex items-center justify-between">
                                        <span className="text-[9px] font-bold text-blue-100 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-md border border-white/10">AI Insight</span>
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"><path d="M7 2l1.5 3 3 .5-2 2 .5 3L7 9.5 4 11l.5-3-2-2 3-.5z"/></svg>
                                    </div>
                                    <p className="relative z-10 text-white text-xs font-semibold leading-snug">Cut dining by ₹2k this month to hit your savings goal 🎯</p>
                                </div>
                            </div>

                            {/* ── Row 2: Chart + Categories ── */}
                            <div className="grid grid-cols-3 gap-3 flex-1">
                                {/* Bar Chart */}
                                <div className="col-span-2 bg-zinc-900/40 border border-white/5 rounded-2xl p-5 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-white text-sm font-bold">Recent Activity</p>
                                            <p className="text-zinc-500 text-[10px]">Last 6 Months</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/10 rounded-full px-2.5 py-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[9px] font-bold text-emerald-400">Live</span>
                                        </div>
                                    </div>
                                    {/* SVG bar chart */}
                                    <div className="flex-1 flex items-end justify-around gap-2 px-2 pb-1">
                                        {[
                                            { m: 'Nov', inc: 60, exp: 50 },
                                            { m: 'Dec', inc: 75, exp: 70 },
                                            { m: 'Jan', inc: 55, exp: 65 },
                                            { m: 'Feb', inc: 80, exp: 55 },
                                            { m: 'Mar', inc: 70, exp: 80 },
                                            { m: 'Apr', inc: 90, exp: 72 },
                                        ].map(({ m, inc, exp }, i) => (
                                            <div key={i} className="flex flex-col items-center gap-1 flex-1">
                                                <div className="flex items-end gap-1 w-full justify-center" style={{ height: 100 }}>
                                                    <div className="w-3 rounded-t-sm bg-emerald-500/70" style={{ height: `${inc}%` }} />
                                                    <div className="w-3 rounded-t-sm" style={{ height: `${exp}%`, backgroundColor: exp > inc ? '#f43f5e88' : '#34d39988' }} />
                                                </div>
                                                <span className="text-zinc-600 text-[8px]">{m}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Legend */}
                                    <div className="flex items-center gap-4 mt-2 pl-1">
                                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500/70"/><span className="text-zinc-500 text-[9px]">Income</span></div>
                                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500/60"/><span className="text-zinc-500 text-[9px]">Expense</span></div>
                                    </div>
                                </div>

                                {/* Top Categories */}
                                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 flex flex-col">
                                    <p className="text-white text-sm font-bold mb-0.5">Top Sources</p>
                                    <p className="text-zinc-500 text-[10px] mb-3">This Month</p>
                                    <p className="text-white text-xl font-bold mb-0.5">₹32,450</p>
                                    <p className="text-rose-400 text-[10px] font-bold mb-4">↑ 12% vs last month</p>
                                    <div className="flex flex-col gap-3">
                                        {[
                                            { emoji: '🍔', name: 'Food & Dining', amount: '12,800', pct: 100, color: 'bg-orange-500' },
                                            { emoji: '🚗', name: 'Transport', amount: '7,200', pct: 56, color: 'bg-blue-500' },
                                            { emoji: '🛍️', name: 'Shopping', amount: '5,900', pct: 46, color: 'bg-purple-500' },
                                            { emoji: '🧾', name: 'Bills', amount: '4,100', pct: 32, color: 'bg-pink-500' },
                                        ].map((c, i) => (
                                            <div key={i}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[11px]">{c.emoji}</span>
                                                        <span className="text-zinc-300 text-[10px] font-semibold">{c.name}</span>
                                                    </div>
                                                    <span className="text-white text-[10px] font-bold">₹{c.amount}</span>
                                                </div>
                                                <div className="h-1 w-full bg-zinc-800/60 rounded-full overflow-hidden">
                                                    <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ── Row 3: Spending Control Strip ── */}
                            <div className="bg-[#0A0F1C]/90 border border-white/8 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shrink-0">
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"><path d="M7 2l1 2.5 2.5.5-1.8 1.8.4 2.7L7 8.2 4.9 9.5l.4-2.7L3.5 5l2.5-.5z"/><circle cx="7" cy="7" r="5.5"/></svg>
                                    </div>
                                    <div>
                                        <p className="text-white text-xs font-bold">Spending Control</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-zinc-400 text-[10px]">Safe to spend: <span className="text-white font-bold">₹17,550</span></span>
                                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                                <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block"/> On track
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:flex flex-col items-end gap-1">
                                        <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">Budget Used</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-1 bg-black/50 rounded-full overflow-hidden">
                                                <div className="h-full w-[65%] bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                            </div>
                                            <span className="text-white text-[10px] font-bold">65%</span>
                                        </div>
                                    </div>
                                    <button className="px-4 py-1.5 bg-white text-black text-[10px] font-bold rounded-full flex items-center gap-1.5 opacity-80">
                                        Adjust Budget
                                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 2v2M7 10v2M2 7h2M10 7h2M4 4l1.4 1.4M8.6 8.6L10 10M4 10l1.4-1.4M8.6 5.4L10 4"/><circle cx="7" cy="7" r="2.5"/></svg>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Bottom fade out */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none rounded-b-2xl" />
            </div>
        </section>
    )
}

export default Hero
