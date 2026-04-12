import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, CalendarDays, Brain, Zap, BarChart3 } from 'lucide-react';
import { GlowCard } from '../../ui/spotlight-card';
import { ProjectionPoint } from '../../../types/goals';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

/* ─── Floating ₹ particles ─── */
const FloatingCurrency = () => {
    const [elements, setElements] = useState<{ id: string; left: number; size: number }[]>([]);

    useEffect(() => {
        const spawn = () => {
            const id = Math.random().toString(36).substring(2, 9);
            const left = Math.floor(Math.random() * 85) + 5;
            const size = Math.random() > 0.5 ? 'text-lg' : 'text-2xl';
            setElements(prev => [...prev, { id, left, size: 0 }]);
            setTimeout(() => setElements(prev => prev.filter(el => el.id !== id)), 3200);
        };
        const iv = setInterval(spawn, 2800);
        return () => clearInterval(iv);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <AnimatePresence>
                {elements.map(el => (
                    <motion.span
                        key={el.id}
                        initial={{ opacity: 0, y: 120, scale: 0.4 }}
                        animate={{ opacity: [0, 0.25, 0], y: -30, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3.2, ease: 'easeOut' }}
                        style={{ left: `${el.left}%` }}
                        className="absolute bottom-0 text-indigo-300/30 font-black text-xl select-none"
                    >
                        ₹
                    </motion.span>
                ))}
            </AnimatePresence>
        </div>
    );
};

/* ─── Typing indicator ─── */
const TypingDots = () => (
    <span className="inline-flex items-center gap-0.5 ml-1">
        {[0, 1, 2].map(i => (
            <motion.span
                key={i}
                className="w-1 h-1 rounded-full bg-indigo-300/60 inline-block"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
        ))}
    </span>
);

/* ─── Custom recharts tooltip ─── */
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-zinc-900/95 border border-white/10 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md">
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mb-1.5">{label}</p>
            <p className="text-white font-black text-lg tabular-nums">₹{payload[0].value.toLocaleString('en-IN')}</p>
            <div className="mt-1.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-indigo-400" />
                <span className="text-[10px] text-indigo-400 font-bold">Projected savings</span>
            </div>
        </div>
    );
};

interface AiInsightsProjectionProps {
    insightText: string;
    projectionData: ProjectionPoint[];
}

const AiInsightsProjection: React.FC<AiInsightsProjectionProps> = ({ insightText, projectionData }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    /* Typewriter effect when insightText changes */
    useEffect(() => {
        if (!insightText) return;
        setIsTyping(true);
        setDisplayedText('');
        let i = 0;
        const timer = setInterval(() => {
            if (i < insightText.length) {
                setDisplayedText(insightText.slice(0, i + 1));
                i++;
            } else {
                setIsTyping(false);
                clearInterval(timer);
            }
        }, 18);
        return () => clearInterval(timer);
    }, [insightText]);

    /* Max value for reference line */
    const maxProjected = projectionData.length > 0
        ? Math.max(...projectionData.map(p => p.projected))
        : 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* ── AI Insight Card (2/5) ── */}
            <GlowCard customSize={true} glowColor="purple" className="lg:col-span-2 min-h-[360px] p-0 rounded-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden p-7 rounded-3xl flex flex-col gap-6 cursor-default group h-full w-full"
                >
                    {/* Layered gradient background */}
                    <motion.div
                        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                        transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
                        className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950/95 to-blue-950 bg-[length:200%_200%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Shimmer sweep */}
                    <motion.div
                        animate={{ x: ['-200%', '300%'] }}
                        transition={{ repeat: Infinity, duration: 12, ease: 'linear', repeatDelay: 3 }}
                        className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -skew-x-12 pointer-events-none z-10"
                    />

                    {/* Decorative orbs */}
                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/20 blur-[70px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-600/15 blur-[70px] rounded-full pointer-events-none" />

                    <div className="relative z-10 flex flex-col h-full gap-5">
                        {/* Header badge */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 bg-white/[0.08] backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                <Brain className="w-3.5 h-3.5 text-indigo-300" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">AI Goal Guidance</span>
                                <Zap className="w-3 h-3 text-indigo-300 animate-pulse" />
                            </div>
                        </div>

                        {/* Insight text with typewriter */}
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="relative">
                                <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent rounded-full" />
                                <p className="text-white/90 font-medium leading-relaxed text-[15px] pl-3 drop-shadow-sm">
                                    &ldquo;{displayedText}{isTyping && <TypingDots />}&rdquo;
                                </p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* CTA */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                                <span className="text-[11px] text-indigo-300/70 font-medium">Powered by Gemini</span>
                            </div>
                            <button className="flex items-center gap-1.5 text-xs text-indigo-200 font-bold hover:text-white transition-colors group/btn px-3 py-1.5 rounded-lg hover:bg-white/10">
                                View Plan
                                <TrendingUp className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </GlowCard>

            {/* ── Trajectory Chart (3/5) ── */}
            <GlowCard customSize={true} glowColor="blue" className="lg:col-span-3 min-h-[360px] p-0 rounded-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="bg-transparent rounded-3xl p-6 lg:p-7 relative overflow-hidden flex flex-col h-full w-full"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <BarChart3 className="w-4 h-4 text-indigo-400" />
                                <h3 className="text-[17px] font-bold text-white tracking-tight">Savings Trajectory</h3>
                            </div>
                            <p className="text-xs text-zinc-500 font-medium">
                                Projected cumulative savings across all goals
                            </p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 rounded-full border border-white/[0.06]">
                            <CalendarDays className="w-3.5 h-3.5 text-zinc-500" />
                            <span className="text-[11px] font-bold text-zinc-400">6 months</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-0.5 rounded-full bg-indigo-400" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Projected</span>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="flex-1 relative w-full z-10 min-h-[220px]">
                        <FloatingCurrency />
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={projectionData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#818cf8" stopOpacity={0.35} />
                                        <stop offset="75%" stopColor="#818cf8" stopOpacity={0.05} />
                                        <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="2" result="blur" />
                                        <feMerge>
                                            <feMergeNode in="blur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    vertical={false}
                                    stroke="rgba(255,255,255,0.04)"
                                />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#52525b', fontSize: 11, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={v =>
                                        v >= 100000 ? `₹${(v / 100000).toFixed(1)}L`
                                        : v >= 1000 ? `₹${(v / 1000).toFixed(0)}k`
                                        : `₹${v}`
                                    }
                                    tick={{ fill: '#52525b', fontSize: 11, fontWeight: 700 }}
                                    width={54}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{
                                        stroke: 'rgba(129,140,248,0.15)',
                                        strokeWidth: 1,
                                        strokeDasharray: '4 4',
                                    }}
                                />
                                {maxProjected > 0 && (
                                    <ReferenceLine
                                        y={maxProjected}
                                        stroke="rgba(129,140,248,0.2)"
                                        strokeDasharray="4 4"
                                        label={{
                                            value: `Peak: ₹${(maxProjected / 1000).toFixed(0)}k`,
                                            position: 'insideTopRight',
                                            fill: '#6366f1',
                                            fontSize: 10,
                                            fontWeight: 700,
                                        }}
                                    />
                                )}
                                <Area
                                    type="monotone"
                                    dataKey="projected"
                                    stroke="#818cf8"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#areaGradient)"
                                    filter="url(#glow)"
                                    activeDot={{
                                        r: 5,
                                        fill: '#fff',
                                        stroke: '#818cf8',
                                        strokeWidth: 2,
                                        filter: 'url(#glow)',
                                    }}
                                    dot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </GlowCard>
        </div>
    );
};

export default AiInsightsProjection;
