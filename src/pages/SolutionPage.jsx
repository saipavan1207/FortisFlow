import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { ArrowRight, Activity, Shield, TrendingUp, Zap, Radio, Globe, Layers, CheckCircle2, Database, Brain, Sparkles, BarChart3, LineChart } from 'lucide-react'

const SolutionPage = () => {
    return (
        <div className="min-h-screen bg-transparent text-white selection:bg-blue-500/30 font-inter overflow-x-hidden">
            <Navbar />

            <main className="relative pt-32 pb-20">

                {/* --- 1. HERO SECTION --- */}
                <section className="relative container mx-auto px-6 mb-32 flex flex-col items-center text-center">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -z-10 pointer-events-none animate-pulse duration-[4000ms]"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-white/10 mb-8 backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs font-medium text-blue-200 tracking-wide uppercase">AI-Powered Financial Intelligence</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                            Your Personal <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">AI Financial Assistant</span>
                        </h1>

                        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            FortisFlow transforms raw transaction data into actionable insights and a real-time financial health score. Stop guessing, start knowing.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="group relative px-8 py-4 bg-white text-zinc-950 rounded-full font-bold text-sm tracking-wide transition-all hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] overflow-hidden">
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            </button>

                            <button className="px-8 py-4 bg-transparent border border-white/10 text-white rounded-full font-medium text-sm tracking-wide transition-all hover:bg-white/5 hover:border-white/20 active:scale-95 backdrop-blur-sm">
                                View Dashboard
                            </button>
                        </div>
                    </motion.div>
                </section>

                {/* --- 2. PROBLEM -> SOLUTION FLOW --- */}
                <section className="container mx-auto px-6 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold mb-4">From Chaos to Clarity</h2>
                        <p className="text-zinc-400">A seamless flow to financial freedom.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                        {/* Connector Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent -z-10"></div>

                        {[
                            { icon: LinkIcon, title: "Connect Accounts", desc: "Securely link banks" },
                            { icon: Activity, title: "Track Transactions", desc: "Real-time monitoring" },
                            { icon: Brain, title: "AI Analysis", desc: "Deep learning insights" },
                            { icon: CheckCircle2, title: "Smart Decisions", desc: "Actionable advice" }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="relative group bg-zinc-900/40 border border-white/5 backdrop-blur-sm p-8 rounded-2xl hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2 text-center"
                            >
                                <div className="w-16 h-16 mx-auto rounded-full bg-zinc-800/50 border border-white/5 flex items-center justify-center mb-6 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors shadow-lg">
                                    <step.icon className="w-7 h-7 text-zinc-400 group-hover:text-blue-400 transition-colors" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-white group-hover:text-blue-200 transition-colors">{step.title}</h3>
                                <p className="text-sm text-zinc-500">{step.desc}</p>

                                {/* Mobile Arrow */}
                                {i < 3 && <div className="md:hidden absolute -bottom-5 left-1/2 -translate-x-1/2 text-zinc-700"><ArrowRight className="w-5 h-5 rotate-90" /></div>}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* --- 3. CORE CAPABILITIES (Vertical Cards) --- */}
                <section className="container mx-auto px-6 mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Premium Intelligence</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto">
                            Advanced features designed to give you complete control over your financial destiny.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Shield,
                                title: "Health Score",
                                desc: "A single metric to track your overall financial wellness, updated daily.",
                                color: "emerald"
                            },
                            {
                                icon: Layers,
                                title: "Smart Categorization",
                                desc: "Transactions are automatically sorted into meaningful categories by AI.",
                                color: "blue"
                            },
                            {
                                icon: TrendingUp,
                                title: "Goal Success",
                                desc: "Predictive analytics to tell you when you'll hit your saving targets.",
                                color: "amber"
                            },
                            {
                                icon: Zap,
                                title: "AI Insights",
                                desc: "Personalized tips to cut costs and optimize your spending habits.",
                                color: "purple"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="relative overflow-hidden rounded-3xl bg-zinc-900/30 border border-white/5 p-8 transition-all duration-300 hover:bg-zinc-800/50 hover:border-white/10 group"
                            >
                                <div className={`absolute top-0 right-0 w-[150px] h-[150px] bg-${feature.color}-500/5 rounded-full blur-[60px] -mr-10 -mt-10 transition-opacity group-hover:bg-${feature.color}-500/10`}></div>

                                <div className={`w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-6 shadow-xl`}>
                                    <feature.icon className={`w-6 h-6 text-${feature.color}-400`} strokeWidth={1.5} />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* --- 4. TECH PIPELINE VISUALIZATION --- */}
                <section className="container mx-auto px-6 mb-32">
                    <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 md:p-16 relative overflow-hidden">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                        <div className="relative z-10">
                            <div className="text-center mb-12">
                                <h2 className="text-2xl font-bold mb-2">How It Works</h2>
                                <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full"></div>
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 max-w-5xl mx-auto">
                                {[
                                    { label: "Transactions", icon: LineChart },
                                    { label: "Secure DB", icon: Database },
                                    { label: "AI Engine", icon: Brain, highlight: true },
                                    { label: "Insights", icon: Sparkles },
                                    { label: "Dashboard", icon: Radio }
                                ].map((node, i, arr) => (
                                    <React.Fragment key={i}>
                                        {/* Node */}
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            whileInView={{ scale: 1, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.15, type: "spring" }}
                                            className="flex flex-col items-center gap-3 relative z-10"
                                        >
                                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border shadow-2xl ${node.highlight ? 'bg-blue-600 border-blue-400 shadow-blue-900/50' : 'bg-zinc-950 border-zinc-800'}`}>
                                                <node.icon className={`w-6 h-6 md:w-8 md:h-8 ${node.highlight ? 'text-white' : 'text-zinc-400'}`} />
                                            </div>
                                            <span className={`text-xs md:text-sm font-semibold tracking-wide ${node.highlight ? 'text-blue-400' : 'text-zinc-500'}`}>{node.label}</span>
                                        </motion.div>

                                        {/* Arrow Connector */}
                                        {i < arr.length - 1 && (
                                            <motion.div
                                                initial={{ width: 0, opacity: 0 }}
                                                whileInView={{ width: "100%", opacity: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: (i * 0.15) + 0.1, duration: 0.4 }}
                                                className="hidden md:flex flex-1 mx-4 h-[2px] bg-zinc-800 items-center overflow-hidden relative"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                                            </motion.div>
                                        )}

                                        {/* Mobile Down Arrow */}
                                        {i < arr.length - 1 && (
                                            <div className="md:hidden text-zinc-700 my-2">↓</div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 5. FINAL CTA --- */}
                <section className="container mx-auto px-6 pb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative py-20 px-6 rounded-[3rem] bg-gradient-to-b from-blue-900/20 to-zinc-900/50 border border-white/5 overflow-hidden"
                    >
                        {/* Glows */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                        <div className="absolute inset-0 bg-blue-500/5 blur-[100px] pointer-events-none"></div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
                            Ready to take control?
                        </h2>
                        <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto">
                            Join thousands of users who have mastered their financial future with FortisFlow&apos;s intelligent tracking.
                        </p>

                        <button className="px-10 py-5 bg-white text-black rounded-full font-bold text-base tracking-wide shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:scale-105 transition-all duration-300">
                            Start Free Today
                        </button>
                    </motion.div>
                </section>

            </main>

            <Footer />
        </div>
    )
}

// Icon component helper
const LinkIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
)

export default SolutionPage

/*
    ================================================================
    ADD THE FOLLOWING ROUTE TO YOUR App.jsx (inside Routes):

    import SolutionPage from './pages/SolutionPage'

    <Route path="/solution" element={<SolutionPage />} />
    ================================================================
*/
