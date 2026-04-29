import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GoalCard, Goal } from './GoalCard';
import { Target, Sparkles, Plus } from 'lucide-react';

interface GoalGridProps {
  goals?: any[];
}

export const GoalGrid: React.FC<GoalGridProps> = ({ goals = [] }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 relative">
          <div className="absolute -inset-2 bg-blue-500/10 blur-xl rounded-full" />
          <div className="p-2.5 bg-zinc-900 border border-white/10 rounded-xl relative z-10 shadow-xl">
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Active Goals <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            </h2>
            <p className="text-[15px] text-zinc-400 font-medium">Accelerate your financial aspirations</p>
          </div>
        </div>
      </div>

      {goals.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col items-center justify-center p-10 bg-zinc-900/50 border border-white/5 rounded-[2rem]"
        >
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No goals yet</h3>
          <p className="text-sm text-zinc-400 mb-6 text-center max-w-sm">
            Set your first financial milestone and let FortisFlow help you reach it faster.
          </p>
          <Link 
            to="/goals" 
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create your first goal
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
              }}
            >
              <GoalCard goal={goal} onContribute={() => {}} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
