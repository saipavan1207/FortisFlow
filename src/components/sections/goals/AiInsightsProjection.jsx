import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, CalendarDays } from 'lucide-react';

const AiInsightsProjection = ({ insightText }) => {
    // Mock chart data arrays
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const projectedSavings = [25000, 32000, 54000, 78000, 105000, 140000];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* AI Insight Gradient Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-1 relative overflow-hidden p-6 rounded-3xl flex flex-col justify-between cursor-pointer group shadow-xl h-[340px]"
            >
                {/* Dynamic Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 opacity-90 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[50px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 blur-[40px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-auto">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
                            <Sparkles className="w-4 h-4 text-blue-200 animate-pulse" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider">AI Goal Guidance</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-white font-medium leading-relaxed text-[17px] md:text-lg drop-shadow-sm">
                            &quot;{insightText}&quot;
                        </p>
                        <div className="w-full h-px bg-white/20 mt-4 mb-2" />
                        <button className="flex items-center gap-2 text-sm text-blue-100 font-bold hover:text-white transition-colors group/btn">
                            Apply Recommendations
                            <TrendingUp className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Savings Projection Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2 rounded-3xl p-6 relative overflow-hidden border border-white/5 bg-zinc-900/40 backdrop-blur-xl h-[340px] flex flex-col"
            >
                <div className="flex items-start justify-between mb-6 relative z-10">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">Projected Trajectory</h3>
                        <p className="text-sm text-zinc-500 font-medium mt-1">Estimated growth across all goals</p>
                    </div>
                    <div className="px-3 py-1.5 bg-zinc-950/80 rounded-full border border-white/5 flex items-center gap-2 hidden sm:flex">
                        <CalendarDays className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs font-bold text-zinc-300">Next 6 Months</span>
                    </div>
                </div>

                {/* Custom Graph Area */}
                <div className="flex-1 relative w-full mt-4">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between opacity-30 pointer-events-none">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-full h-px border-t border-dashed border-zinc-700" />
                        ))}
                    </div>

                    {/* Bars Container */}
                    <div className="absolute inset-0 flex items-end justify-between px-2 sm:px-8 pb-8 z-10">
                        {months.map((month, index) => {
                            const value = projectedSavings[index];
                            const maxVal = Math.max(...projectedSavings);
                            const heightPct = (value / maxVal) * 100;

                            return (
                                <div key={month} className="flex flex-col items-center gap-3 relative group/chart h-[90%] justify-end w-10 sm:w-14">
                                    <div className="relative w-full h-full flex items-end justify-center">
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/chart:opacity-100 transition-opacity bg-zinc-800 text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/10 shadow-lg whitespace-nowrap z-50 pointer-events-none">
                                            ₹{value.toLocaleString()}
                                        </div>

                                        {/* Bar */}
                                        <motion.div
                                            initial={{ height: "0%" }}
                                            animate={{ height: `${heightPct}%` }}
                                            transition={{ duration: 1, delay: 0.3 + (index * 0.1), ease: "easeOut" }}
                                            className="w-full bg-gradient-to-t from-blue-900/40 to-blue-500/80 rounded-t-sm relative overflow-hidden group-hover/chart:brightness-125 transition-all outline outline-1 outline-blue-400/20"
                                        >
                                            <div className="absolute top-0 inset-x-0 h-1 bg-blue-300/50" />
                                        </motion.div>
                                    </div>
                                    <span className="text-[11px] font-bold text-zinc-500 uppercase">{month}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AiInsightsProjection;
