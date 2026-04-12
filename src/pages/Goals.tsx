import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GoalsOverview from '../components/sections/goals/GoalsOverview';
import GoalCardsGrid from '../components/sections/goals/GoalCardsGrid';
import AiInsightsProjection from '../components/sections/goals/AiInsightsProjection';
import GoalPlannerModal from '../components/sections/goals/GoalPlannerModal';
import { useGoalsData } from '../hooks/useGoalsData';
import { Plus, Sparkles, Target } from 'lucide-react';

const SECTION_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const Goals: React.FC = () => {
    const [isPlannerOpen, setIsPlannerOpen] = useState(false);

    const {
        goals,
        overviewStats,
        projections,
        aiGuidance,
        isLoading,
        isError,
        addGoal,
        contributeToGoal,
        contributingIds
    } = useGoalsData();

    const handleAddGoal = async (goalData: any) => {
        await addGoal(goalData);
        setIsPlannerOpen(false);
    };

    const handleContribute = async (id: string, amount: number) => {
        await contributeToGoal(id, amount);
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                            <Target className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500 animate-ping" />
                    </div>
                    <div className="text-center">
                        <p className="text-white font-semibold">Loading your goals</p>
                        <p className="text-zinc-500 text-sm mt-0.5">Crunching the numbers...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center p-6 bg-red-900/20 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 font-bold mb-2">Failed to load goals</p>
                    <p className="text-zinc-500 text-sm break-words max-w-md" id="error-box">
                        {errorObject ? String(errorObject) : 'Unknown Error'}
                    </p>
                    <p className="text-zinc-500 text-sm mt-4">Please refresh the page or try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="p-6 md:p-8 space-y-10 h-full flex flex-col font-manrope overflow-y-auto custom-scrollbar relative"
        >
            {/* ── Page Header ── */}
            <motion.div
                variants={SECTION_VARIANTS}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <span className="text-[11px] font-black uppercase tracking-widest text-blue-500/80 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                            Financial Goals
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                        Your Goals
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1.5 max-w-md">
                        Plan, track, and celebrate every milestone on your path to financial freedom.
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsPlannerOpen(true)}
                    className="flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <Plus className="w-4 h-4" />
                    New Goal
                    <Sparkles className="w-3.5 h-3.5 opacity-70" />
                </motion.button>
            </motion.div>

            {/* ── Overview Stats ── */}
            <motion.section variants={SECTION_VARIANTS}>
                <GoalsOverview stats={overviewStats} />
            </motion.section>

            {/* ── Goal Cards ── */}
            <motion.section variants={SECTION_VARIANTS}>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-lg font-bold text-white tracking-tight">Active Goals</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">{goals.filter(g => g.status === 'active').length} goal{goals.filter(g => g.status === 'active').length !== 1 ? 's' : ''} in progress</p>
                    </div>
                </div>
                <GoalCardsGrid
                    goals={goals}
                    onAddNew={() => setIsPlannerOpen(true)}
                    onContribute={handleContribute}
                    contributingIds={contributingIds}
                />
            </motion.section>

            {/* ── AI Insights + Trajectory ── */}
            <motion.section variants={SECTION_VARIANTS}>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-lg font-bold text-white tracking-tight">Intelligence &amp; Projection</h2>
                        <p className="text-zinc-500 text-xs mt-0.5">AI-powered insights and 6-month savings forecast</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                        <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
                        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Gemini AI</span>
                    </div>
                </div>
                <AiInsightsProjection
                    insightText={aiGuidance || "Analyzing your savings trajectory..."}
                    projectionData={projections}
                />
            </motion.section>

            {/* ── Modal ── */}
            <GoalPlannerModal
                isOpen={isPlannerOpen}
                onClose={() => setIsPlannerOpen(false)}
                onSave={handleAddGoal}
            />
        </motion.div>
    );
};

export default Goals;
