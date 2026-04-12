import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, TrendingUp, ArrowUpRight } from 'lucide-react';
import { GlowCard } from '../../ui/spotlight-card';
import { GoalsOverviewStats } from '../../../types/goals';

interface GoalsOverviewProps {
    stats: GoalsOverviewStats;
}

interface StatCardProps {
    delay?: number;
    glowColor: 'blue' | 'green' | 'purple';
    accentBg: string;
    accentText: string;
    accentBorder: string;
    hoverBg: string;
    hoverBorder: string;
    glowBg: string;
    glowHover: string;
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
    footer: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
    delay = 0, glowColor, accentBg, accentText, accentBorder, hoverBg, hoverBorder,
    glowBg, glowHover, icon, label, children, footer,
}) => (
    <GlowCard customSize={true} glowColor={glowColor} className="h-[180px] p-0 rounded-2xl">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="bg-transparent h-full rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden"
        >
            {/* Ambient corner glow */}
            <div className={`absolute -top-8 -right-8 w-36 h-36 ${glowBg} blur-[50px] rounded-full pointer-events-none transition-colors duration-700 ${glowHover}`} />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            {/* Top row */}
            <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1.5">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${accentText}`}>{label}</p>
                    {children}
                </div>
                {/* Icon pill */}
                <div className={`p-3 rounded-xl ${accentBg} border ${accentBorder} shadow-inner transition-all duration-300 group-hover:${hoverBg} group-hover:${hoverBorder}`}>
                    {icon}
                </div>
            </div>

            {/* Bottom row */}
            <div className="relative z-10">
                {footer}
            </div>
        </motion.div>
    </GlowCard>
);

const GoalsOverview: React.FC<GoalsOverviewProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* ── Active Goals ── */}
            <StatCard
                delay={0}
                glowColor="blue"
                accentBg="bg-blue-500/10"
                accentText="text-blue-400"
                accentBorder="border-blue-500/20"
                hoverBg="bg-blue-500/20"
                hoverBorder="border-blue-500/40"
                glowBg="bg-blue-500/10"
                glowHover="group-hover:bg-blue-500/25"
                label="Active Goals"
                icon={<Target className="w-5 h-5 text-blue-400" />}
                footer={
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-zinc-500 text-xs font-medium">Currently tracking</span>
                    </div>
                }
            >
                <div className="flex items-baseline gap-1.5">
                    <h2 className="text-4xl font-black text-white tracking-tight tabular-nums">{stats.totalActive}</h2>
                    <ArrowUpRight className="w-4 h-4 text-blue-400 mb-1" />
                </div>
            </StatCard>

            {/* ── Completed ── */}
            <StatCard
                delay={0.1}
                glowColor="green"
                accentBg="bg-emerald-500/10"
                accentText="text-emerald-400"
                accentBorder="border-emerald-500/20"
                hoverBg="bg-emerald-500/20"
                hoverBorder="border-emerald-500/40"
                glowBg="bg-emerald-500/10"
                glowHover="group-hover:bg-emerald-500/25"
                label="Completed"
                icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                footer={
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-zinc-500 text-xs font-medium">Milestones achieved</span>
                    </div>
                }
            >
                <div className="flex items-baseline gap-1.5">
                    <h2 className="text-4xl font-black text-white tracking-tight tabular-nums">{stats.totalCompleted}</h2>
                    <span className="text-emerald-400 text-xs font-bold mb-1">✓</span>
                </div>
            </StatCard>

            {/* ── Overall Progress ── */}
            <StatCard
                delay={0.2}
                glowColor="purple"
                accentBg="bg-purple-500/10"
                accentText="text-purple-400"
                accentBorder="border-purple-500/20"
                hoverBg="bg-purple-500/20"
                hoverBorder="border-purple-500/40"
                glowBg="bg-purple-500/10"
                glowHover="group-hover:bg-purple-500/25"
                label="Overall Progress"
                icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
                footer={
                    <div className="space-y-1.5">
                        <div className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden shadow-inner ring-1 ring-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.overallProgress}%` }}
                                transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 rounded-full relative"
                            >
                                <div className="absolute right-0 top-0 bottom-0 w-6 bg-white/30 blur-[2px] rounded-full" />
                            </motion.div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-600 text-[10px] font-bold">0%</span>
                            <span className="text-zinc-600 text-[10px] font-bold">100%</span>
                        </div>
                    </div>
                }
            >
                <div className="flex items-baseline gap-0.5">
                    <h2 className="text-4xl font-black text-white tracking-tight tabular-nums">{stats.overallProgress}</h2>
                    <span className="text-xl text-purple-400 font-black mb-0.5">%</span>
                </div>
            </StatCard>
        </div>
    );
};

export default GoalsOverview;
