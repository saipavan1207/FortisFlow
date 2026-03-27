import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, TrendingUp } from 'lucide-react';

const GoalsOverview = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Total Goals */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-lg p-5 h-[160px] rounded-2xl flex flex-col justify-between group hover:border-white/10 hover:bg-zinc-900/50 transition-all duration-300 relative overflow-hidden"
            >
                {/* Soft ambient glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-[40px] rounded-full group-hover:bg-blue-500/20 transition-colors duration-500" />
                <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-1">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Active Goals</p>
                        <h2 className="text-3xl font-extrabold text-white mt-1 drop-shadow-sm">{stats.totalActive}</h2>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] shadow-inner group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300">
                        <Target className="w-6 h-6 text-blue-400" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 relative z-10">
                    <span className="text-zinc-400 text-xs font-medium">Currently tracking</span>
                </div>
            </motion.div>

            {/* Card 2: Completed Goals */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-lg p-5 h-[160px] rounded-2xl flex flex-col justify-between group hover:border-white/10 hover:bg-zinc-900/50 transition-all duration-300 relative overflow-hidden"
            >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[40px] rounded-full group-hover:bg-emerald-500/20 transition-colors duration-500" />
                <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-1">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Completed</p>
                        <h2 className="text-3xl font-extrabold text-white mt-1 drop-shadow-sm">{stats.completed}</h2>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] shadow-inner group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-300">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 relative z-10">
                    <span className="text-zinc-400 text-xs font-medium">Goals achieved so far</span>
                </div>
            </motion.div>

            {/* Card 3: Overall Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-lg p-5 h-[160px] rounded-2xl flex flex-col justify-between group hover:border-white/10 hover:bg-zinc-900/50 transition-all duration-300 relative overflow-hidden"
            >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 blur-[40px] rounded-full group-hover:bg-purple-500/20 transition-colors duration-500" />
                <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-1">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Overall Progress</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <h2 className="text-3xl font-extrabold text-white drop-shadow-sm">{stats.averageProgress}</h2>
                            <span className="text-xl text-zinc-500 font-bold">%</span>
                        </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] shadow-inner group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-all duration-300">
                        <TrendingUp className="w-6 h-6 text-purple-400" />
                    </div>
                </div>
                <div className="mt-4 flex flex-col gap-2 relative z-10">
                    <div className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden shadow-inner ring-1 ring-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.averageProgress}%` }}
                            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full relative"
                        >
                             <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/20 blur-[3px] rounded-full" />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default GoalsOverview;
