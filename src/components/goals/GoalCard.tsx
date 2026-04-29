import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, CalendarDays, Brain, Sparkles, Laptop, ShieldCheck, Plane, Zap, TrendingUp, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { GlowCard } from '../ui/spotlight-card';
import { GoalUIModel } from '../../types/goals';
import { getGoalHistory } from '../../utils/goalCalculations';

interface GoalCardProps {
  goal: GoalUIModel;
  onContribute: (id: string, amount: number) => void;
  onArchive?: (id: string) => void;
  isContributing?: boolean;
}

const IconRenderer = ({ name, className }: { name?: string; className?: string }) => {
  switch (name?.toLowerCase()) {
    case 'laptop': return <Laptop className={className} />;
    case 'shield': return <ShieldCheck className={className} />;
    case 'plane': return <Plane className={className} />;
    default: return <Target className={className} />;
  }
};

const getProbabilityLabel = (prob: number, isPassed: boolean): { text: string; color: string } => {
  if (isPassed && prob < 100) return { text: 'Overdue', color: 'text-red-500' };
  if (prob >= 85) return { text: 'On track', color: 'text-emerald-400' };
  if (prob >= 60) return { text: 'Moderate', color: 'text-amber-400' };
  return { text: 'At risk', color: 'text-rose-400' };
};

const getInsightMessage = (
  estimatedDays: number, 
  probability: number, 
  title: string,
  deadline: string,
): React.ReactNode => {
  const isPassed = new Date(deadline).getTime() < Date.now();

  if (estimatedDays === 0) {
    return (
      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        {title} goal achieved! Exceptional work.
      </span>
    );
  }

  if (isPassed) {
    return (
      <span className="text-rose-400 font-medium flex items-center gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        Deadline passed. Keep contributing to reach your target!
      </span>
    );
  }

  if (estimatedDays > 0) {
    const weeks = Math.round(estimatedDays / 7);
    const timeStr = weeks >= 4
      ? `~${Math.round(weeks / 4)} month${Math.round(weeks / 4) !== 1 ? 's' : ''}`
      : `~${weeks} week${weeks !== 1 ? 's' : ''}`;

    if (probability >= 85) {
      return (
        <>
          You&apos;re <span className="text-emerald-400 font-bold">ahead of schedule</span> — estimated completion in{' '}
          <span className="text-white font-black">{timeStr}</span>.
        </>
      );
    }
    if (probability >= 60) {
      return (
        <>
          At current pace, goal completes in <span className="text-white font-black">{timeStr}</span>.
          {' '}<span className="text-amber-400 font-semibold">A small boost could help.</span>
        </>
      );
    }
    return (
      <>
        Goal at risk — only <span className="text-rose-400 font-bold">{Math.round(probability)}%</span> chance at current pace.
        {' '}Consider increasing contributions.
      </>
    );
  }
  
  return <>Start contributing to unlock your tailored savings forecast.</>;
};

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onContribute, onArchive, isContributing = false }) => {
  const { id, title, target_amount, saved_amount, deadline, icon, glowType, theme, analytics, status } = goal;

  const currentAmount = Number(saved_amount) || 0;
  const targetAmount = Number(target_amount) || 0;
  const remaining = Math.max(targetAmount - currentAmount, 0);

  const estimatedDays = analytics.estimatedDaysLeft;
  const progress = analytics.progress;
  const isPassed = new Date(deadline).getTime() < Date.now();
  const probLabel = getProbabilityLabel(analytics.probability, isPassed && progress < 100);
  const isComplete = status === 'completed' || progress >= 100;
  const history = isComplete ? getGoalHistory(goal) : null;

  return (
    <GlowCard
      customSize={true}
      className={`flex flex-col justify-between h-full group ${isContributing ? 'opacity-80' : ''}`}
      glowColor={glowType}
    >
      <div className="relative p-6 h-full flex flex-col gap-5 z-10 w-full">

        {/* Corner ambient glow */}
        <div className={`absolute top-0 right-0 w-40 h-40 ${theme.baseColor} opacity-[0.07] blur-[50px] rounded-full pointer-events-none group-hover:opacity-[0.18] transition-opacity duration-500`} />

        {/* ── Header ── */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3.5">
            {/* Icon */}
            <div className="relative w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shadow-lg border border-white/10 group-hover:border-white/25 transition-all duration-300 shrink-0">
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-25 group-hover:opacity-50 transition-opacity duration-300`} />
              <IconRenderer name={icon} className="w-6 h-6 text-white drop-shadow-md relative z-10" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[17px] font-bold text-white tracking-tight leading-tight truncate">{title}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <CalendarDays className={`w-3.5 h-3.5 shrink-0 ${isPassed && !isComplete ? 'text-red-500/70' : 'text-zinc-600'}`} />
                <span className={`text-[11px] font-semibold ${isPassed && !isComplete ? 'text-red-500/90' : 'text-zinc-500'}`}>Due {deadline}</span>
              </div>
            </div>
          </div>

          {/* Probability badge or History Performance badge */}
          <div className="flex flex-col items-end gap-1 shrink-0 group/badge relative">
            {isComplete ? (
               <div className={`flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full`}>
                 <Sparkles className="w-3 h-3 text-emerald-400" />
                 <span className="text-[11px] font-black text-emerald-400 tracking-wide">Achieved</span>
               </div>
            ) : (
               <>
                 <div className={`flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] rounded-full group-hover/badge:border-white/15 transition-all`}>
                   <Zap className={`w-3 h-3 ${probLabel.color}`} />
                   <span className={`text-[11px] font-black ${probLabel.color} tracking-wide`}>{Math.round(analytics.probability)}%</span>
                 </div>
                 <span className={`text-[10px] font-bold ${probLabel.color} opacity-70`}>{probLabel.text}</span>
               </>
            )}
          </div>
        </div>

        {/* ── Progress & Amounts ── */}
        <div>
          {/* Amount row */}
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-zinc-600 mb-1">Saved</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-black text-white tracking-tight tabular-nums leading-none">
                  ₹{currentAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-zinc-600 mb-0.5">
                  / ₹{targetAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-black tracking-widest text-zinc-600 mb-1">Progress</p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[22px] font-black text-white tabular-nums leading-none">{Math.round(progress)}</span>
                <span className="text-xs font-bold text-zinc-400 mb-0.5">%</span>
              </div>
            </div>
          </div>

          {/* Progress track */}
          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden shadow-inner ring-1 ring-white/[0.04] relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full relative`}
            >
              {/* Leading glow dot */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/60 blur-[2px]" />
            </motion.div>
          </div>

          {/* Remaining amount */}
          {!isComplete && remaining > 0 && (
            <p className="text-[11px] text-zinc-600 font-medium mt-2">
              ₹{remaining.toLocaleString('en-IN')} remaining
            </p>
          )}
        </div>

        {/* ── Dynamic Box (AI Insight or History) ── */}
        <div className={`backdrop-blur-md rounded-2xl p-4 border transition-all duration-300 relative overflow-hidden ${
          isComplete 
           ? 'bg-emerald-900/10 border-emerald-500/20 group-hover:border-emerald-500/30' 
           : 'bg-white/[0.02] border-white/[0.06] group-hover:border-white/[0.10]'
        }`}>
          {isComplete && history ? (
            // --- HISTORICAL COMPLETED DATA --- 
            <div className="flex gap-4 items-center">
              <div className="flex-1 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Completed Date</p>
                <p className="text-[13px] font-semibold text-zinc-200">{history.completedDate}</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex-1 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Time Taken</p>
                <p className="text-[13px] font-semibold text-zinc-200">{history.timeTakenDays} days</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex-1 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Performance</p>
                <p className={`text-[12px] font-bold ${
                  history.performance === 'Ahead of Schedule' ? 'text-emerald-400' :
                  history.performance === 'On Time' ? 'text-blue-400' : 'text-amber-400'
                }`}>{history.performance}</p>
              </div>
            </div>
          ) : (
            // --- AI INSIGHT BOX ---
            <>
              {/* Subtle top gradient line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

              <div className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Brain className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400/80">AI Insight</span>
                    <span className="w-1 h-1 rounded-full bg-blue-500/50" />
                    <Clock className="w-3 h-3 text-zinc-600" />
                    <span className="text-[10px] text-zinc-600 font-medium">Now</span>
                  </div>
                  <p className="text-[12.5px] text-zinc-300 leading-relaxed">
                    {getInsightMessage(estimatedDays, analytics.probability, title, deadline)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex items-center gap-2 mt-auto">
          {isComplete && onArchive && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onArchive(id)}
              className="py-3.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors"
            >
              Archive
            </motion.button>
          )}
          
          <motion.button
            whileHover={isComplete || isContributing ? {} : { scale: 1.015, y: -1 }}
            whileTap={isComplete || isContributing ? {} : { scale: 0.97 }}
            onClick={() => onContribute(id, 1000)}
            disabled={isComplete || isContributing}
            className={`
              w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-[14px]
              transition-all duration-200 relative overflow-hidden flex-1
              ${isComplete
                ? 'bg-zinc-900/50 text-emerald-500/70 border border-emerald-900/20'
                : isContributing 
                  ? 'bg-zinc-800 text-zinc-400 cursor-wait border border-white/5'
                  : 'bg-white text-zinc-900 hover:bg-zinc-100 shadow-[0_4px_24px_rgba(255,255,255,0.08)] hover:shadow-[0_4px_32px_rgba(255,255,255,0.15)] cursor-pointer'
              }
            `}
          >
            {!(isComplete || isContributing) && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            )}
            {isComplete ? (
              <>
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-500/80">Completed Goal</span>
              </>
            ) : isContributing ? (
              <>
                <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-black" />
                Contribute ₹1,000
                <TrendingUp className="w-3.5 h-3.5 text-zinc-500 ml-auto" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </GlowCard>
  );
};
