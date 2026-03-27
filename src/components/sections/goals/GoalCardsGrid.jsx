import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal } from 'lucide-react';

const GoalCard = ({ goal, index }) => {
    const [justContributed, setJustContributed] = useState(false);
    const progress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
    const isCompleted = progress >= 100;



    const handleContributeMock = () => {
        setJustContributed(true);
        setTimeout(() => setJustContributed(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`relative overflow-hidden bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col justify-between group hover:border-white/10 transition-all duration-200 hover:-translate-y-1 ${
                isCompleted ? 'shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'shadow-lg hover:shadow-2xl'
            }`}
        >
            {/* Glow effect based on goal color */}
            <div className={`absolute -inset-1 bg-gradient-to-br ${goal.color} opacity-0 group-hover:opacity-[0.08] blur-2xl transition-opacity duration-500 rounded-3xl pointer-events-none`} />
            
            <div className="relative z-10 flex flex-col h-full space-y-5">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${goal.color} p-[1px] transition-transform duration-200 group-hover:scale-[1.03]`}>
                            <div className="w-full h-full bg-zinc-950/80 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm">
                                {goal.icon}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">{goal.name}</h3>
                            <p className="text-zinc-500 text-xs font-semibold">Deadline: {goal.deadline}</p>
                        </div>
                    </div>
                    <button className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>

                {/* Amount Info */}
                <div className="flex justify-between flex-wrap gap-2 text-sm">
                    <div className="flex flex-col">
                        <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">Saved</span>
                        <span className="text-white text-xl font-extrabold tracking-tight drop-shadow-sm">₹{goal.savedAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider">Target</span>
                        <span className="text-zinc-300 font-bold tracking-wide">₹{goal.targetAmount.toLocaleString()}</span>
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div className="space-y-2 mt-auto">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                        <span className="text-zinc-500">Progress</span>
                        <span className={isCompleted ? 'text-emerald-400' : 'text-zinc-300'}>
                            {progress.toFixed(0)}%
                        </span>
                    </div>
                    <div className="h-2.5 w-full bg-zinc-800/80 rounded-full overflow-hidden shadow-inner ring-1 ring-white/5 cursor-pointer relative">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.2, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                            className={`h-full rounded-full relative bg-gradient-to-r ${goal.color}`}
                        >
                            <div className="absolute right-0 top-0 bottom-0 w-6 bg-white/30 group-hover:bg-white/40 blur-[3px] rounded-full transition-colors duration-200" />
                        </motion.div>
                    </div>
                </div>

                {/* Footer Data */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 bg-zinc-900/50 px-2.5 py-1 rounded-md border border-white/5">
                        <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-blue-400'} animate-pulse`} />
                        <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider text-center">
                            {isCompleted ? 'Achieved' : 'On Track'}
                        </span>
                    </div>
                    {!isCompleted && (
                        <motion.div 
                            animate={{ scale: [1, 1.03, 1] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]"
                        >
                            <span className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-wider">Prob.</span>
                            <span className="text-xs font-bold text-emerald-400">{goal.successProbability}%</span>
                        </motion.div>
                    )}
                </div>

                {/* Action Buttons */}
                {!isCompleted && (
                    <div className="grid grid-cols-2 gap-3 mt-2 relative">
                        <motion.button 
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all border border-white/5 shadow-sm text-center"
                        >
                            View Details
                        </motion.button>
                        <div className="relative">
                            <motion.button 
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={handleContributeMock}
                                className={`w-full py-2.5 px-3 bg-gradient-to-r ${goal.color} hover:brightness-110 text-white text-xs font-bold rounded-xl transition-all shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] text-center relative overflow-hidden`}
                            >
                                <span className="relative z-10">Contribute</span>
                                {/* Button inner gradient shift */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                            </motion.button>

                            {/* Contribution Feedback Pop */}
                            <AnimatePresence>
                                {justContributed && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, y: -25, scale: 1 }}
                                        exit={{ opacity: 0, y: -40 }}
                                        className="absolute -top-1 left-0 right-0 flex justify-center pointer-events-none z-20"
                                    >
                                        <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg">
                                            +₹200 added
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
                {isCompleted && (
                     <div className="mt-2">
                        <motion.button 
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            className="w-full py-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-sm font-bold rounded-xl transition-all border border-emerald-500/20 text-center hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                        >
                            Goal Achieved 🎉
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const AddGoalCard = ({ onAddNew }) => {
    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            onClick={onAddNew}
            whileHover={{ y: -4 }}
            className="bg-transparent border border-dashed border-zinc-700/60 hover:border-solid hover:border-blue-500/40 rounded-2xl p-6 min-h-[320px] flex flex-col items-center justify-center group transition-all duration-300 relative h-full w-full overflow-hidden"
        >
            {/* Soft Radial Center Glow */}
            <div className="absolute inset-x-0 bottom-0 h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <motion.div 
                className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 flex items-center justify-center mb-4 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] relative"
            >
                <Plus className="w-8 h-8 text-zinc-500 group-hover:text-blue-400 transition-colors z-10" />
                <motion.div 
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <Plus className="w-8 h-8 text-zinc-500 opacity-0 group-hover:opacity-30 group-hover:text-blue-400 transition-colors" />
                </motion.div>
            </motion.div>
            
            <h3 className="text-white font-bold text-lg mb-1 group-hover:text-blue-100 transition-colors">Create New Goal</h3>
            <p className="text-zinc-500 text-sm text-center max-w-[200px] group-hover:text-zinc-400 transition-colors">Set a new target and let AI help you reach it.</p>
        </motion.button>
    );
};

const GoalCardsGrid = ({ goals, onAddNew }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {goals.map((goal, index) => (
                <GoalCard key={goal.id} goal={goal} index={index} />
            ))}
            <AddGoalCard onAddNew={onAddNew} />
        </div>
    );
};

export default GoalCardsGrid;
