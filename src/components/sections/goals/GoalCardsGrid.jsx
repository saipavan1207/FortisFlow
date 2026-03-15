import React from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal } from 'lucide-react';

const GoalCard = ({ goal, index }) => {
    const progress = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
    const isCompleted = progress >= 100;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`relative overflow-hidden bg-zinc-950/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col justify-between group hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                isCompleted ? 'shadow-[0_0_20px_rgba(16,185,129,0.1)]' : ''
            }`}
        >
            {/* Glow effect based on goal color */}
            <div className={`absolute -inset-1 bg-gradient-to-br ${goal.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 rounded-3xl`} />
            
            <div className="relative z-10 flex flex-col h-full space-y-5">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${goal.color} p-[1px]`}>
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
                        <span className="text-zinc-500 text-xs font-semibold">Saved</span>
                        <span className="text-white font-bold tracking-wide">₹{goal.savedAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-zinc-500 text-xs font-semibold">Target</span>
                        <span className="text-white font-bold tracking-wide">₹{goal.targetAmount.toLocaleString()}</span>
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div className="space-y-2 mt-auto">
                    <div className="flex justify-between text-xs font-bold">
                        <span className="text-zinc-400">Progress</span>
                        <span className={isCompleted ? 'text-emerald-400' : 'text-white'}>
                            {progress.toFixed(0)}%
                        </span>
                    </div>
                    <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden shadow-inner ring-1 ring-white/5 cursor-pointer group/bar relative">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                            className={`h-full rounded-full relative bg-gradient-to-r ${goal.color}`}
                        >
                            <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/20 blur-[2px] rounded-full" />
                        </motion.div>
                    </div>
                </div>

                {/* Footer Data */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5 bg-zinc-900/50 px-2.5 py-1 rounded-md border border-white/5">
                        <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-blue-400'} animate-pulse`} />
                        <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider text-center">
                            {isCompleted ? 'Achieved' : 'On Track'}
                        </span>
                    </div>
                    {!isCompleted && (
                        <div className="text-[11px] font-bold text-zinc-400">
                            Success Prob: <span className="text-emerald-400">{goal.successProbability}%</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                {!isCompleted && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <button className="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-colors border border-white/5 shadow-sm text-center">
                            View Details
                        </button>
                        <button className={`py-2.5 px-3 bg-gradient-to-r ${goal.color} hover:brightness-110 text-white text-xs font-bold rounded-xl transition-all shadow-lg text-center`}>
                            Contribute
                        </button>
                    </div>
                )}
                {isCompleted && (
                     <div className="mt-4">
                        <button className="w-full py-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-sm font-bold rounded-xl transition-colors border border-emerald-500/20 text-center">
                            Goal Achieved 🎉
                        </button>
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
            className="bg-transparent border border-dashed border-zinc-700/50 hover:border-blue-500/50 rounded-2xl p-6 min-h-[320px] flex flex-col items-center justify-center group transition-colors relative h-full w-full"
        >
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl pointer-events-none" />
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 flex items-center justify-center mb-4 transition-all duration-300 shadow-lg group-hover:scale-110">
                <Plus className="w-8 h-8 text-zinc-500 group-hover:text-blue-400 transition-colors" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Create New Goal</h3>
            <p className="text-zinc-500 text-sm text-center max-w-[200px]">Set a new target and let AI help you reach it.</p>
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
