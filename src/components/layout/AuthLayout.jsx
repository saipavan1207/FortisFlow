import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

const AuthLayout = ({ children, title, subtitle, formPosition = 'right', visualContent }) => {
    return (
        <div className={`min-h-screen w-full flex bg-zinc-950 text-white ${formPosition === 'left' ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Visual Side */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-zinc-900 items-center justify-center p-12">
                {visualContent ? (
                    visualContent
                ) : (
                    <>
                        {/* Background Gradients */}
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.2),rgba(0,0,0,0))]" />
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(168,85,247,0.1),rgba(0,0,0,0))]" />

                        {/* Grid Pattern */}
                        <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                        </div>

                        {/* Floating Content */}
                        <div className="relative z-10 max-w-lg">
                            <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-xs font-semibold text-zinc-300">Trusted by 10,000+ users</span>
                            </div>

                            <h1 className="text-4xl font-bold mb-6 leading-tight">
                                Master your money with <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI-driven precision.</span>
                            </h1>

                            <ul className="space-y-4 text-zinc-400">
                                {['Real-time expense tracking', 'Smart savings goals', 'Investment portfolio analysis'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Animated Orbs */}
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                    </>
                )}
            </div>

            {/* Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                {/* Mobile Back Button */}
                <Link to="/" className="absolute top-6 left-6 text-sm text-zinc-500 hover:text-white transition-colors">
                    ← Back to website
                </Link>

                <div className="w-full max-w-md space-y-8 animate-fade-up">
                    <div className="text-center">
                        <div className="w-10 h-10 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 6H17M7 12H14M7 6V18" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold font-manrope">{title}</h2>
                        <p className="mt-2 text-zinc-400 font-inter">{subtitle}</p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    )
}

export default AuthLayout
