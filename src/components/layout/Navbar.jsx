import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from '../common/Logo'

import { motion } from 'framer-motion'

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const location = useLocation()





    return (
        <>
            <motion.nav
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "95%", opacity: 1 }}
                transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }} // smooth ease-out (decelerate gently)
                className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 max-w-4xl rounded-full border border-white/10 bg-black/80 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-2xl shadow-black/50`}
            >

                {/* Logo - Delayed Fade In (Waits for width to finish) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3, duration: 0.5 }}
                >
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="flex items-center justify-center relative">
                            <Logo className="h-8 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white font-brand group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-300" style={{ transform: 'scaleY(1.03)' }}>FortisFlow</span>
                    </Link>
                </motion.div>

                {/* Desktop Links - Staggered Fade In */}
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="hidden md:flex items-center gap-2"
                >
                    <NavLink
                        to="/product"
                        active={location.pathname === '/product'}
                    >
                        Product
                    </NavLink>
                    <NavLink
                        to="/solution"
                        active={location.pathname === '/solution'}
                    >
                        Solution
                    </NavLink>

                    <NavLink
                        to="/contact"
                        active={location.pathname === '/contact'}
                    >
                        Contact
                    </NavLink>
                </motion.div>

                {/* CTA Button - Delayed Fade In */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.7, duration: 0.5 }}
                    className="hidden md:flex items-center pl-8"
                >
                    <Link to="/signup">
                        <button className="relative px-6 py-2 rounded-full bg-black text-white text-[10px] font-extrabold tracking-[0.2em] border border-blue-600/60 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.8),inset_0_0_10px_rgba(37,99,235,0.4)] hover:border-blue-400 transition-all duration-300 group overflow-hidden tracking-widest uppercase font-manrope">
                            <span className="relative z-10">Get Started</span>
                            {/* Shine effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent skew-x-12"></div>
                        </button>
                    </Link>
                </motion.div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-zinc-950 pt-32 px-6 animate-fade-in">
                    <div className="flex flex-col gap-6 text-center text-xl font-medium font-manrope">
                        <Link to="/product" onClick={() => setMobileMenuOpen(false)}>Product</Link>
                        <Link to="/solution" onClick={() => setMobileMenuOpen(false)}>Solution</Link>

                        <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                        <div className="h-px bg-white/10 w-full my-2"></div>
                        <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="bg-white text-black py-3 rounded-full font-bold">
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}

const NavLink = ({ href, to, children, active }) => {
    const Component = to ? Link : 'a'
    const props = to ? { to } : { href }

    return (
        <Component
            {...props}
            className="relative px-4 py-2 group flex items-center justify-center"
        >
            {/* Active State Lighting Container (No physical shape) */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-0'}`}>

                {/* 1. Atmospheric Bloom Layer (Secondary Light Scatter - Very faint, large) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[200%] bg-[radial-gradient(closest-side,rgba(59,130,246,0.08)_0%,transparent_70%)] blur-[40px]" />

                {/* 2. Back Spotlight Glow (Primary Light Source - Concentrated) */}
                {/* Deep Electric Blue #0A3A8F, 40% Opacity, Smooth Fade */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(closest-side,rgba(10,58,143,0.4)_0%,transparent_100%)] blur-[25px]" />

                {/* 3. Glass Light Response (Subtle Top Highlight) */}
                <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05)_0%,transparent_70%)] blur-[10px]" />

                {/* 4. Underline Light Streak (Energy Emitter) */}
                {/* Core: Electric Blue #3B82F6 */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent shadow-[0_0_8px_rgba(59,130,246,0.8)] opacity-100" />

                {/* Bleed/Glow for Streak */}
                <div className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-[40%] h-[2px] bg-[#3B82F6] blur-[2px] opacity-60" />
            </div>

            {/* Hover State: Subtle Atmospheric Shift */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-[radial-gradient(closest-side,rgba(10,58,143,0.2)_0%,transparent_100%)] blur-[20px] transition-opacity duration-300 pointer-events-none ${active ? 'opacity-0' : 'group-hover:opacity-100 opacity-0'}`} />

            {/* Text Styling */}
            <span className={`relative z-10 text-sm font-semibold font-manrope tracking-wide transition-all duration-300 ${active ? 'text-[#EAF2FF]' : 'text-zinc-400 group-hover:text-zinc-200'}`}
                style={active ? { textShadow: '0 0 12px rgba(59,130,246,0.4)' } : {}}
            >
                {children}
            </span>
        </Component>
    )
}

export default Navbar
