import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import * as goalsService from '../services/goalsService';
import * as calc from '../utils/goalCalculations';
import { generateGoalGuidance } from '../services/goalAiService';
import { GoalRecord, GoalUIModel, GoalsOverviewStats, ProjectionPoint } from '../types/goals';

const COLOR_MAP: Record<string, { baseColor: string; gradient: string }> = {
  blue:   { baseColor: 'bg-blue-500',    gradient: 'from-blue-600 to-blue-400'    },
  green:  { baseColor: 'bg-emerald-500', gradient: 'from-emerald-600 to-emerald-400' },
  purple: { baseColor: 'bg-purple-500',  gradient: 'from-purple-600 to-pink-500'  },
  orange: { baseColor: 'bg-orange-500',  gradient: 'from-orange-600 to-amber-400' },
  red:    { baseColor: 'bg-red-500',     gradient: 'from-red-600 to-rose-400'     },
};

interface GoalsState {
  loading: boolean;
  isError: boolean;
  errorObject?: string;
  goals: GoalUIModel[];
  overviewStats: GoalsOverviewStats;
  projection: ProjectionPoint[];
  aiGuidance: string;
}

export function useGoalsData() {
  const [state, setState] = useState<GoalsState>({
    loading: true,
    isError: false,
    goals: [],
    overviewStats: { totalActive: 0, totalCompleted: 0, overallProgress: 0, totalSaved: 0, totalTarget: 0 },
    projection: [],
    aiGuidance: 'Analyzing your goal trajectories...',
  });

  const [contributingIds, setContributingIds] = useState<Set<string>>(new Set());

  // Refs for debouncing and hashing
  const aiDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastAiHash = useRef<string | null>(null);

  const triggerAIGuidance = useCallback((uiModels: GoalUIModel[]) => {
    // Hash: "count-totalSaved"
    const currentHash = `${uiModels.length}-${uiModels.reduce((acc, g) => acc + (Number(g.saved_amount) || 0), 0)}`;
    
    if (lastAiHash.current === currentHash) return; // Prevent unnecessary calls
    
    lastAiHash.current = currentHash;

    if (aiDebounceTimer.current) clearTimeout(aiDebounceTimer.current);

    aiDebounceTimer.current = setTimeout(() => {
      const goalsWithAnalytics = uiModels.map(g => ({
        goal: g,
        analytics: g.analytics,
      }));
      generateGoalGuidance(goalsWithAnalytics).then(guidance => {
        setState(prev => ({ ...prev, aiGuidance: guidance }));
      }).catch(console.error);
    }, 1200); // 1.2s Debounce

  }, []);

  const processGoals = useCallback((records: GoalRecord[]) => {
    const rawUiModels: GoalUIModel[] = records.map(record => {
      const analytics = calc.deriveGoalAnalytics(record);
      const preset = record.color_preset || 'blue';
      return {
        ...record,
        analytics,
        glowType: preset as any,
        theme: COLOR_MAP[preset] || COLOR_MAP.blue,
      };
    });

    const uiModels = calc.sortGoals(rawUiModels);
    const stats = calc.computeOverviewStats(records);
    const proj = calc.generateProjection(records);

    setState(prev => ({
      ...prev,
      loading: false,
      isError: false,
      goals: uiModels,
      overviewStats: stats,
      projection: proj,
    }));

    triggerAIGuidance(uiModels);
  }, [triggerAIGuidance]);

  const fetchData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const records = await goalsService.fetchGoals(user.id);
      processGoals(records);
    } catch (err: any) {
      console.error('Goals fetch error FULL:', err);
      setState(prev => ({ ...prev, loading: false, isError: true, errorObject: err?.toString() || JSON.stringify(err) }));
    }
  }, [processGoals]);

  useEffect(() => { 
    fetchData(); 
    return () => {
      if (aiDebounceTimer.current) clearTimeout(aiDebounceTimer.current);
    }
  }, [fetchData]);

  // ─── Mutations ───

  const contribute = useCallback(async (goalId: string, amount: number) => {
    // Prevent double rapid clicks
    if (contributingIds.has(goalId)) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setContributingIds(prev => new Set(prev).add(goalId));

    try {
      // Optimistic update
      setState(prev => {
        const updatedRaw = prev.goals.map(g => {
          if (g.id !== goalId) return g;
          
          const target = Number(g.target_amount) || 0;
          const newSaved = Math.min(Number(g.saved_amount) + amount, target);
          const newStatus = newSaved >= target ? 'completed' : g.status;

          const updatedGoal = { 
            ...g, 
            status: newStatus,
            saved_amount: newSaved, 
            contributions: [...(g.contributions||[]), { amount, date: new Date().toISOString() }] 
          };
          
          return { ...updatedGoal, analytics: calc.deriveGoalAnalytics(updatedGoal) };
        });

        const sortedModels = calc.sortGoals(updatedRaw);

        triggerAIGuidance(sortedModels);

        return {
          ...prev,
          goals: sortedModels,
          overviewStats: calc.computeOverviewStats(sortedModels),
          projection: calc.generateProjection(sortedModels),
        };
      });

      // Backend sync
      await goalsService.contribute(user.id, goalId, amount);
      
      // Delay fetch to let backend trigger finish
      setTimeout(() => fetchData(), 1500);

    } catch(e) {
      console.error("Contribution failed", e);
      fetchData(); // Rollback
    } finally {
      setContributingIds(prev => {
        const next = new Set(prev);
        next.delete(goalId);
        return next;
      });
    }
  }, [contributingIds, fetchData, triggerAIGuidance]);

  const createGoal = useCallback(async (goalData: Parameters<typeof goalsService.createGoal>[1]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await goalsService.createGoal(user.id, goalData);
    await fetchData();
  }, [fetchData]);

  return {
    isLoading: state.loading,
    isError: state.isError,
    errorObject: state.errorObject,
    goals: state.goals,
    overviewStats: state.overviewStats,
    projections: state.projection,
    aiGuidance: state.aiGuidance,
    contributingIds,
    contributeToGoal: contribute,
    addGoal: createGoal,
    refetch: fetchData,
  };
}
