import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GoalsOverview from '../components/sections/goals/GoalsOverview';
import GoalCardsGrid from '../components/sections/goals/GoalCardsGrid';
import AiInsightsProjection from '../components/sections/goals/AiInsightsProjection';
import GoalPlannerModal from '../components/sections/goals/GoalPlannerModal';

// Mock AI Insight
const aiInsight = "You are 44% toward your Laptop goal. Reduce food delivery spending by ₹1,000/month to reach your goal 2 months earlier.";

const Goals = () => {
    const [isPlannerOpen, setIsPlannerOpen] = useState(false);
    
    // Mock Data
    const [goals, setGoals] = useState([
        {
            id: 1,
            name: 'Laptop',
            savedAmount: 35000,
            targetAmount: 80000,
            deadline: 'Dec 2026',
            successProbability: 76,
            icon: '💻',
            color: 'from-blue-500 to-indigo-600'
        },
        {
            id: 2,
            name: 'Emergency Fund',
            savedAmount: 120000,
            targetAmount: 300000,
            deadline: 'Jan 2027',
            successProbability: 92,
            icon: '🛡️',
            color: 'from-emerald-500 to-teal-600'
        },
        {
            id: 3,
            name: 'Vacation',
            savedAmount: 15000,
            targetAmount: 50000,
            deadline: 'Aug 2026',
            successProbability: 45,
            icon: '✈️',
            color: 'from-purple-500 to-pink-600'
        }
    ]);

    const stats = {
        totalActive: goals.length,
        completed: 1,
        averageProgress: Math.round(goals.reduce((acc, goal) => acc + (goal.savedAmount / goal.targetAmount) * 100, 0) / goals.length)
    };

    const handleAddGoal = (newGoal) => {
        setGoals([...goals, { ...newGoal, id: Date.now() }]);
        setIsPlannerOpen(false);
    };

    return (
        <div className="p-6 md:p-8 space-y-8 h-full flex flex-col font-manrope overflow-y-auto custom-scrollbar relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Goals</h1>
                    <p className="text-zinc-400 text-sm mt-1">Track and achieve your financial aspirations.</p>
                </div>
            </div>

            {/* Top Section */}
            <GoalsOverview stats={stats} />

            {/* Middle Section */}
            <GoalCardsGrid 
                goals={goals} 
                onAddNew={() => setIsPlannerOpen(true)} 
            />

            {/* Bottom Section */}
            <AiInsightsProjection insightText={aiInsight} />

            {/* Modal */}
            <GoalPlannerModal 
                isOpen={isPlannerOpen}
                onClose={() => setIsPlannerOpen(false)}
                onSave={handleAddGoal}
            />
        </div>
    );
};

export default Goals;
