import React from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '../common/ScrollReveal'
import { Brain, Activity, Target, Layers, Wallet, LineChart } from 'lucide-react'

const BentoCard = ({ title, description, icon: Icon, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className={`group relative overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all duration-300 ${className}`}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative p-8 h-full flex flex-col">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-6 h-6 text-blue-400" />
            </div>

            <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
                {description}
            </p>

            {/* Decorative Shimmer */}
            <div className="absolute top-0 -inset-full h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-5 group-hover:animate-shimmer" />
        </div>
    </motion.div>
)

const Features = () => {
    return (
        <section id="features" className="py-32 relative bg-zinc-950">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <ScrollReveal width="100%">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Financial clarity <br />
                            <span className="text-blue-500">reimagined</span>
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal width="100%" delay={0.2}>
                        <p className="text-zinc-400 text-lg">
                            Everything you need to master your money, wrapped in a beautiful, intuitive interface designed for the modern era.
                        </p>
                    </ScrollReveal>
                </div>

                <div className="grid md:grid-cols-3 gap-6 auto-rows-[300px]">
                    {/* Large Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5 }}
                        className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/5 p-8 flex flex-col md:flex-row items-center gap-8"
                    >
                        <div className="flex-1 space-y-4 text-center md:text-left z-10">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 mx-auto md:mx-0">
                                <Brain className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-3xl font-bold">AI Financial Analyst</h3>
                            <p className="text-zinc-400">
                                Our advanced AI models analyze your spending patterns in real-time, offering personalized insights and proactive saving opportunities that you might have missed.
                            </p>
                        </div>
                        <div className="flex-1 w-full h-full bg-blue-500/5 rounded-2xl border border-blue-500/10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                            {/* Fake Chart */}
                            <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-between px-4 pb-4 gap-2">
                                {[40, 70, 45, 90, 65, 85].map((h, i) => (
                                    <div key={i} style={{ height: `${h}%` }} className="w-full bg-blue-500/40 rounded-t-sm"></div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Tall Card */}
                    <BentoCard
                        title="Smart Goals"
                        description="Set targets for what matters. We'll help you stay on track with automated contributions."
                        icon={Target}
                        className="md:row-span-2 bg-gradient-to-b from-zinc-900 to-zinc-950"
                    />

                    <BentoCard
                        title="Health Score"
                        description="A single metric to track your financial wellness."
                        icon={Activity}
                    />

                    <BentoCard
                        title="Multi-Currency"
                        description="Track accounts across borders seamlessly."
                        icon={Wallet}
                    />

                    <BentoCard
                        title="Future Casting"
                        description="Predict accurate account balances 30 days out."
                        icon={LineChart}
                        className="md:col-span-2"
                    />
                </div>
            </div>
        </section>
    )
}

export default Features
