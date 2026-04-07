import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { fetchDashboardData } from '../services/dashboardService';
import GoalsOverview from '../components/sections/goals/GoalsOverview';
import GoalCardsGrid from '../components/sections/goals/GoalCardsGrid';
import AiInsightsProjection from '../components/sections/goals/AiInsightsProjection';
import GoalPlannerModal from '../components/sections/goals/GoalPlannerModal';

// Mock AI Insight
const aiInsight = "You are 44% toward your Laptop goal. Reduce food delivery spending by ₹1,000/month to reach your goal 2 months earlier.";

const GOAL_PALETTE = [
    { gradient: 'from-blue-500 to-indigo-600',    ring: '#3b82f6' },
    { gradient: 'from-emerald-500 to-teal-600',   ring: '#10b981' },
    { gradient: 'from-purple-500 to-pink-600',    ring: '#a855f7' },
    { gradient: 'from-orange-500 to-rose-600',    ring: '#f97316' },
    { gradient: 'from-cyan-500 to-blue-600',      ring: '#06b6d4' },
];

const GOAL_ICONS = ['🎯', '🛡️', '✈️', '💻', '🏠', '🚗', '📱', '💰'];

const formatDeadline = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

const Goals = () => {
    const [isPlannerOpen, setIsPlannerOpen] = useState(false);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchGoals = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setLoading(false); return; }

            const [goalsResult, dashResult] = await Promise.all([
                supabase
                    .from('goals')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false }),
                fetchDashboardData(user.id),
            ]);

            const goalsData = goalsResult.data || [];
            const { goalPredictions } = dashResult;

            const predMap = {};
            (goalPredictions || []).forEach(p => { predMap[p.title] = p; });

            const mapped = goalsData.map((g, idx) => {
                const palette = GOAL_PALETTE[idx % GOAL_PALETTE.length];
                const pred = predMap[g.title];
                const saved = parseFloat(g.saved_amount) || 0;
                const target = parseFloat(g.target_amount) || 0;
                const pct = target > 0 ? (saved / target) * 100 : 0;
                return {
                    id: g.id,
                    name: g.title,
                    savedAmount: saved,
                    targetAmount: target,
                    deadline: formatDeadline(g.target_date),
                    successProbability: Math.min(95, Math.max(30, Math.round(pct * 0.5 + 50))),
                    icon: GOAL_ICONS[idx % GOAL_ICONS.length],
                    color: palette.gradient,
                    ringColor: palette.ring,
                    monthsLeft: pred ? pred.months_left : null,
                };
            });

            setGoals(mapped);
        } catch (err) {
            console.error('Goals fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const stats = {
        totalActive: goals.filter(g => g.savedAmount < g.targetAmount).length,
        completed: goals.filter(g => g.savedAmount >= g.targetAmount).length,
        averageProgress: goals.length > 0
            ? Math.round(goals.reduce((acc, g) => acc + Math.min((g.savedAmount / g.targetAmount) * 100, 100), 0) / goals.length)
            : 0,
    };

    const handleAddGoal = async (newGoal) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            await supabase.from('goals').insert({
                user_id: user.id,
                title: newGoal.name,
                target_amount: newGoal.targetAmount,
                saved_amount: 0,
                target_date: newGoal.deadline && /^\d{4}-\d{2}$/.test(newGoal.deadline)
                    ? new Date(newGoal.deadline + '-01').toISOString().split('T')[0]
                    : null,
            });
            await fetchGoals();
        } catch (err) {
            console.error('Goal insert error:', err);
        }
        setIsPlannerOpen(false);
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.08 }
                }
            }}
            className="p-6 md:p-8 space-y-8 h-full flex flex-col font-manrope overflow-y-auto custom-scrollbar relative"
        >
            {/* Header */}
            <motion.div 
                variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Goals</h1>
                    <p className="text-zinc-400 text-sm mt-1">Track and achieve your financial aspirations.</p>
                </div>
            </motion.div>

            {/* Top Section */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <GoalsOverview stats={stats} />
            </motion.div>

            {/* Middle Section */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <GoalCardsGrid 
                    goals={goals} 
                    onAddNew={() => setIsPlannerOpen(true)} 
                />
            </motion.div>

            {/* Bottom Section */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <AiInsightsProjection insightText={aiInsight} />
            </motion.div>

            {/* Modal */}
            <GoalPlannerModal 
                isOpen={isPlannerOpen}
                onClose={() => setIsPlannerOpen(false)}
                onSave={handleAddGoal}
            />
        </motion.div>
    );
};

export default Goals;
