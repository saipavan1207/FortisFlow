import { Link } from 'react-router-dom'
import Button from '../common/Button'
import ScrollReveal from '../common/ScrollReveal'
import { ArrowRight, ChevronRight } from 'lucide-react'
import CapabilityStrip from './CapabilityStrip'
import Dashboard from './Dashboard' // Remounting dashboard here for the "preview" look

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

            {/* Dashboard Peek at Bottom */}
            <div className="mt-10 w-full max-w-6xl mx-auto px-4 relative">
                {/* Gradient Overlay - REMOVED for clarity */}
                {/* <div className="absolute inset-x-0 -top-20 h-40 bg-gradient-to-b from-transparent to-[var(--color-bg-main)] z-20"></div> */}
                <div className="rounded-xl border border-white/10 p-2 bg-zinc-900/50 backdrop-blur-sm shadow-2xl relative z-10 transform rotate-x-6 perspective-1000 origin-top">
                    {/* Live Dashboard Component */}
                    <div className="w-full bg-zinc-950 rounded-lg overflow-hidden relative shadow-2xl">
                        <Dashboard isPreview={true} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
