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

            {/* Dashboard Preview Visual */}
            <div className="mt-10 w-full max-w-6xl mx-auto px-4 relative">
                <div className="rounded-xl border border-white/10 p-2 bg-zinc-900/50 backdrop-blur-sm shadow-2xl relative z-10">
                    <div className="w-full bg-zinc-950 rounded-lg overflow-hidden relative shadow-2xl p-6 min-h-[300px] flex flex-col gap-4">
                        {/* Mock top KPI row */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Financial Health', value: '—', sub: 'Add transactions to score' },
                                { label: 'Monthly Spend', value: '₹0', sub: 'No data yet' },
                                { label: 'AI Insight', value: 'Waiting for data...', sub: '', gradient: true }
                            ].map((card, i) => (
                                <div key={i} className={`rounded-2xl border p-4 h-28 flex flex-col justify-between ${card.gradient ? 'bg-gradient-to-br from-blue-600 to-purple-700 border-transparent' : 'bg-zinc-900/50 border-white/5'}`}>
                                    <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">{card.label}</p>
                                    <p className={`text-xl font-bold ${card.gradient ? 'text-white' : 'text-white'}`}>{card.value}</p>
                                    {card.sub && <p className="text-zinc-500 text-[10px]">{card.sub}</p>}
                                </div>
                            ))}
                        </div>
                        {/* Mock chart area */}
                        <div className="rounded-2xl border border-white/5 bg-zinc-900/30 p-5 h-40 flex items-center justify-center">
                            <p className="text-zinc-600 text-sm">Your income &amp; expense chart appears here after first transaction</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
