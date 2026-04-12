import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { GoalCard } from '../../goals/GoalCard';
import { GlowCard } from '../../ui/spotlight-card';
import { GoalUIModel } from '../../../types/goals';

interface GoalCardsGridProps {
    goals: GoalUIModel[];
    onAddNew: () => void;
    onContribute: (id: string, amount: number) => void;
    contributingIds: Set<string>;
}

const AddGoalCard = ({ onAddNew }: { onAddNew: () => void }) => {
    return (
        <GlowCard customSize={true} glowColor="blue" className="h-full w-full p-0">
            <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                onClick={onAddNew}
                whileHover={{ y: -4 }}
                className="bg-transparent rounded-2xl p-6 h-full min-h-[320px] flex flex-col items-center justify-center group transition-all duration-300 relative w-full overflow-hidden"
            >
                <div className="absolute inset-x-0 bottom-0 h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <motion.div 
                    className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 flex items-center justify-center mb-4 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] relative"
                >
                    <Plus className="w-8 h-8 text-zinc-500 group-hover:text-blue-400 transition-colors z-10" />
                </motion.div>
                
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-blue-100 transition-colors">Create New Goal</h3>
                <p className="text-zinc-500 text-sm text-center max-w-[200px] group-hover:text-zinc-400 transition-colors">Set a new target and let AI help you reach it.</p>
            </motion.button>
        </GlowCard>
    );
};

const GoalCardsGrid: React.FC<GoalCardsGridProps> = ({ goals, onAddNew, onContribute, contributingIds }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {goals.map((goal, index) => (
                <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full"
                >
                    <GoalCard 
                        goal={goal} 
                        onContribute={onContribute} 
                        isContributing={contributingIds.has(goal.id)}
                    />
                </motion.div>
            ))}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: goals.length * 0.1 }}
                className="h-full"
            >
                <AddGoalCard onAddNew={onAddNew} />
            </motion.div>
        </div>
    );
};

export default GoalCardsGrid;
