import React from 'react'
import { motion } from 'framer-motion'
import { Twitter, Github, Linkedin, CheckCircle, ArrowRight } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="relative w-full bg-[#050507] border-t border-white/5 overflow-hidden font-manrope">
            {/* Animated Background Glow - Softened */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -bottom-[20%] left-[10%] w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[120px] animate-pulse duration-[4000ms]" />
                <div className="absolute -top-[20%] right-[10%] w-[600px] h-[600px] bg-violet-900/5 rounded-full blur-[100px] opacity-70" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-10">
                    {/* LEFT SIDE - BRANDING */}
                    <div className="lg:col-span-4 space-y-5">
                        {/* Logo - Matches Navbar */}
                        <div className="flex items-center gap-2 group cursor-default opacity-90 hover:opacity-100 transition-opacity">
                            <div className="w-7 h-7 flex items-center justify-center relative">
                                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 5H5v14h4v-7h6" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight font-brand group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-300" style={{ transform: 'scaleY(1.03)' }}>FortisFlow</span>
                        </div>

                        <p className="text-zinc-500 text-xs leading-relaxed max-w-xs font-medium">
                            Pioneering AI-driven financial intelligence. Understand your money, optimize growth, and secure your future.
                        </p>

                        <div className="flex items-center gap-3 pt-1">
                            {[
                                { icon: Twitter, href: "#" },
                                { icon: Github, href: "#" },
                                { icon: Linkedin, href: "#" }
                            ].map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    whileHover={{ scale: 1.1, color: "#60a5fa", backgroundColor: "rgba(255,255,255,0.08)" }}
                                    className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 transition-all hover:border-blue-500/30"
                                >
                                    <social.icon className="w-3.5 h-3.5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDE - LINKS GRID */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8 pt-2">
                        {[
                            { title: "Product", links: ['Features', 'Integrations', 'Pricing', 'Changelog'] },
                            { title: "Resources", links: ['Documentation', 'API Reference', 'Community', 'Help Center'] },
                            { title: "Company", links: ['About', 'Blog', 'Careers'] },
                            { title: "Legal", links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] }
                        ].map((column) => (
                            <div key={column.title} className="space-y-3">
                                <h4 className="text-xs font-bold text-white tracking-wider uppercase opacity-90">{column.title}</h4>
                                <ul className="space-y-1.5">
                                    {column.links.map((item) => (
                                        <li key={item}>
                                            <a href="#" className="text-xs text-zinc-500 hover:text-blue-400 transition-colors block font-medium">{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DIVIDER */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                {/* BOTTOM ROW */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] text-zinc-600 font-medium tracking-wide">
                        © {new Date().getFullYear()} FortisFlow. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors cursor-default">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">All systems operational</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
