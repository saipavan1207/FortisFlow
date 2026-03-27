import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, CalendarDays } from 'lucide-react';

const FloatingCurrency = () => {
    const [elements, setElements] = useState([]);

    useEffect(() => {
        const createFloatingElement = () => {
            const id = Math.random().toString(36).substr(2, 9);
            const left = Math.floor(Math.random() * 80) + 10; // 10% to 90%
            setElements(prev => [...prev, { id, left }]);
            setTimeout(() => {
                setElements(prev => prev.filter(el => el.id !== id));
            }, 3000);
        };

        const interval = setInterval(createFloatingElement, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <AnimatePresence>
                {elements.map(el => (
                    <motion.div
                        key={el.id}
                        initial={{ opacity: 0, y: 150, scale: 0.5 }}
                        animate={{ opacity: [0, 0.4, 0], y: -50, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3, ease: "easeOut" }}
                        style={{ left: `${el.left}%` }}
                        className="absolute bottom-0 text-white/5 font-bold text-2xl"
                    >
                        ₹
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

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
                className="lg:col-span-1 relative overflow-hidden p-8 rounded-3xl flex flex-col justify-between cursor-pointer group shadow-2xl h-[340px] border border-white/10"
            >
                {/* Dynamic Background */}
                <motion.div 
                    animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 12, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900/90 to-blue-900 opacity-90 transition-transform duration-1000 group-hover:scale-105 bg-[length:200%_200%]" 
                />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-50 mix-blend-overlay" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                {/* Shimmer Sweep Animation */}
                <motion.div 
                    animate={{ x: ['-200%', '300%'] }}
                    transition={{ repeat: Infinity, duration: 10, ease: 'linear', repeatDelay: 2 }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none z-10"
                />
                
                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/30 blur-[60px] rounded-full pointer-events-none group-hover:bg-indigo-400/40 transition-colors duration-1000" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-purple-400/30 transition-colors duration-1000" />

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-auto">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
                            <Sparkles className="w-4 h-4 text-blue-200 animate-pulse" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider">AI Goal Guidance</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-white font-medium leading-relaxed text-lg lg:text-xl drop-shadow-md">
                            &quot;{insightText}&quot;
                        </p>
                        <div className="w-full h-px bg-white/10 mt-6 mb-4" />
                        <button className="flex items-center gap-2 text-sm text-indigo-200 font-bold hover:text-white transition-colors group/btn">
                            Apply Recommendations
                            <TrendingUp className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Savings Projection Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2 rounded-3xl p-6 lg:p-8 relative overflow-hidden border border-white/5 bg-zinc-900/40 backdrop-blur-xl shadow-lg h-[340px] flex flex-col"
            >
                <div className="flex items-start justify-between mb-6 relative z-10">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-sm">Projected Trajectory</h3>
                        <p className="text-sm text-zinc-500 font-medium mt-1">Estimated growth across all goals</p>
                    </div>
                    <div className="px-3 py-1.5 bg-zinc-950/80 rounded-full border border-white/5 flex items-center gap-2 hidden sm:flex">
                        <CalendarDays className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs font-bold text-zinc-300">Next 6 Months</span>
                    </div>
                </div>

                {/* Custom Graph Area */}
                <div className="flex-1 relative w-full mt-4">
                    <FloatingCurrency />
                    
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

                                        {/* Bar Entrance & Breathing Loop */}
                                        <motion.div
                                            initial={{ height: "0%" }}
                                            animate={{ height: [`${heightPct}%`, `${heightPct + 2}%`, `${heightPct}%`] }}
                                            transition={{ 
                                                height: {
                                                    times: [0, 0.5, 1],
                                                    duration: 4,
                                                    repeat: Infinity,
                                                    repeatType: 'reverse',
                                                    ease: "easeInOut",
                                                    delay: 1.5 // Start breathing after entrance
                                                }
                                            }}
                                            className="w-full bg-gradient-to-t from-blue-900/40 to-indigo-500/90 rounded-t-md relative overflow-hidden group-hover/chart:brightness-125 transition-all outline outline-1 outline-indigo-400/30 shadow-[0_-5px_15px_rgba(99,102,241,0.2)] group-hover/chart:w-[110%] origin-bottom"
                                        >
                                            {/* Dedicated entrance animation layer */}
                                            <motion.div 
                                                initial={{ y: "100%" }}
                                                animate={{ y: "0%" }}
                                                transition={{ duration: 1.2, delay: 0.3 + (index * 0.1), ease: [0.16, 1, 0.3, 1] }}
                                                className="absolute inset-0 w-full h-full bg-inherit"
                                            >
                                                <div className="absolute top-0 inset-x-0 h-1.5 bg-indigo-300/60 blur-[1px]" />
                                                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent mix-blend-overlay" />
                                            </motion.div>
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
