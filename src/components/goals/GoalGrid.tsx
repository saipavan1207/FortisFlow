import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GoalCard, Goal } from './GoalCard';
import { Target, Sparkles } from 'lucide-react';

const INITIAL_GOALS: any[] = [
  {
    id: 'g1',
    title: 'Laptop Upgrade',
    saved_amount: 15000,
    target_amount: 80000,
    deadline: 'Dec 2026',
    icon: 'laptop',
    glowType: 'blue',
    theme: {
      baseColor: 'bg-blue-500',
      gradient: 'from-blue-600 to-blue-400',
    },
    analytics: {
      progress: (15000 / 80000) * 100,
      estimatedDaysLeft: 60,
      probability: 76,
      averageDailySaving: 200
    }
  },
  {
    id: 'g2',
    title: 'Emergency Fund',
    saved_amount: 210000,
    target_amount: 300000,
    deadline: 'Jan 2027',
    icon: 'shield',
    glowType: 'green',
    theme: {
      baseColor: 'bg-emerald-500',
      gradient: 'from-emerald-600 to-emerald-400',
    },
    analytics: {
      progress: (210000 / 300000) * 100,
      estimatedDaysLeft: 120,
      probability: 92,
      averageDailySaving: 500
    }
  },
  {
    id: 'g3',
    title: 'Vacation',
    saved_amount: 15000,
    target_amount: 50000,
    deadline: 'Aug 2026',
    icon: 'plane',
    glowType: 'purple',
    theme: {
      baseColor: 'bg-purple-500',
      gradient: 'from-purple-600 to-pink-500',
    },
    analytics: {
      progress: (15000 / 50000) * 100,
      estimatedDaysLeft: 200,
      probability: 45,
      averageDailySaving: 150
    }
  }
];

export const GoalGrid: React.FC = () => {
  const [goals, setGoals] = useState<any[]>(INITIAL_GOALS);

  const handleContribute = (id: string | number) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === id 
          ? { 
              ...goal, 
              saved_amount: Math.min(goal.saved_amount + 1000, goal.target_amount),
              analytics: {
                ...goal.analytics,
                progress: ((goal.saved_amount + 1000) / goal.target_amount) * 100
              }
            } 
          : goal
      )
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6 relative">
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
            <GoalCard goal={goal} onContribute={handleContribute} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
