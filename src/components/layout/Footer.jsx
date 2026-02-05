import React from 'react'
import { motion } from 'framer-motion'
import { Twitter, Github, Linkedin, CheckCircle, ArrowRight } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="relative w-full bg-[#050507] border-t border-white/5 overflow-hidden">
            {/* Animated Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-violet-900/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* LEFT SIDE - BRANDING */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Logo */}
                        <div className="flex items-center gap-2 group cursor-default">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                                F
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight font-brand group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-300" style={{ transform: 'scaleY(1.03)' }}>FortisFlow</span>
                        </div>

                        <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                            Pioneering AI-driven financial intelligence for the modern era.
                            Understand your money, optimize your growth, and secure your future with precision.
                        </p>

                        <div className="flex items-center gap-4 pt-2">
                            {[
                                { icon: Twitter, href: "#" },
                                { icon: Github, href: "#" },
                                { icon: Linkedin, href: "#" }
                            ].map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    whileHover={{ scale: 1.1, color: "#60a5fa" }}
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-zinc-500 transition-colors hover:bg-white/10 hover:border-blue-500/30"
                                >
                                    <social.icon className="w-4 h-4" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDE - LINKS GRID */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {/* Column 1 - Product */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Product</h4>
                            <ul className="space-y-2">
                                {['Features', 'Integrations', 'Pricing', 'Changelog'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-sm text-zinc-500 hover:text-blue-400 transition-colors block py-0.5">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 2 - Resources */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Resources</h4>
                            <ul className="space-y-2">
                                {['Documentation', 'API Reference', 'Community', 'Help Center'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-sm text-zinc-500 hover:text-blue-400 transition-colors block py-0.5">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3 - Company */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Company</h4>
                            <ul className="space-y-2">
                                {['About', 'Blog', 'Careers'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-sm text-zinc-500 hover:text-blue-400 transition-colors block py-0.5">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 4 - Legal */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Legal</h4>
                            <ul className="space-y-2">
                                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-sm text-zinc-500 hover:text-blue-400 transition-colors block py-0.5">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* DIVIDER */}
                <div className="w-full h-px bg-white/5 mb-8" />

                {/* BOTTOM ROW */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-zinc-600">
                        © 2026 FortisFlow. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-medium text-emerald-400">All systems operational</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
