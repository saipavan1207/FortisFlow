import { GoalRecord, GoalAnalytics, GoalsOverviewStats, ProjectionPoint, GoalUIModel, GoalHistory } from '../types/goals';

/**
 * Compute avg daily saving from recent contribution history (last 30 days).
 * If no recent contributions, falls back to all-time, or 0.
 */
export function computeAvgDailySaving(contributions: { amount: number; date: string }[]): number {
  if (!contributions || contributions.length === 0) return 0;

  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  // Filter for last 30 days
  let recentContributions = contributions.filter(c => new Date(c.date).getTime() >= thirtyDaysAgo);
  
  // Fallback to all-time if no recent contributions
  if (recentContributions.length === 0) {
    recentContributions = [...contributions];
  }

  const sorted = [...recentContributions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const firstDate = new Date(sorted[0].date);
  const daySpan = Math.max(
    (now - firstDate.getTime()) / (1000 * 60 * 60 * 24),
    1 // minimum 1 day to prevent Infinity
  );

  const totalContributed = recentContributions.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  return Number.isNaN(totalContributed) ? 0 : totalContributed / daySpan;
}

/**
 * Estimate days remaining to reach goal at current pace.
 * Returns -1 if no saving activity exists.
 * Caps at 3650 days (10 years) for extreme edge cases.
 */
export function computeEstimatedDays(remaining: number, avgDaily: number): number {
  if (remaining <= 0) return 0;
  if (avgDaily <= 0) return -1;
  return Math.min(Math.ceil(remaining / avgDaily), 3650);
}

/**
 * Calculate probability of hitting goal by deadline.
 */
export function computeProbability(
  saved: number,
  target: number,
  avgDaily: number,
  deadline: string
): number {
  const daysLeft = Math.max(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    0
  );

  if (saved >= target) return 100;
  if (daysLeft === 0) return 0; // Deadline passed, and target not reached
  if (avgDaily <= 0 && saved < target) return 0;

  const projectedTotal = saved + avgDaily * daysLeft;
  const ratio = projectedTotal / target;

  if (ratio >= 1) return 100;
  return Math.max(0, Math.min(100, Math.round(Math.pow(ratio, 0.7) * 100)));
}

/**
 * Full analytics derivation for a single goal.
 */
export function deriveGoalAnalytics(goal: GoalRecord): GoalAnalytics {
  const target = Number(goal.target_amount) || 0;
  const saved = Number(goal.saved_amount) || 0;
  
  const progress = target > 0 ? Math.min((saved / target) * 100, 100) : 0;
  const remaining = Math.max(target - saved, 0);
  const avgDailySaving = computeAvgDailySaving(goal.contributions || []);
  const estimatedDaysLeft = computeEstimatedDays(remaining, avgDailySaving);
  const probability = computeProbability(saved, target, avgDailySaving, goal.deadline);

  const projectedDate = avgDailySaving > 0 && estimatedDaysLeft > 0
    ? new Date(Date.now() + estimatedDaysLeft * 86400000)
    : null;

  const deadlineDate = new Date(goal.deadline);
  const isOnTrack = projectedDate ? projectedDate <= deadlineDate : false;

  return {
    progress: Number.isNaN(progress) ? 0 : progress,
    remaining: Number.isNaN(remaining) ? 0 : remaining,
    avgDailySaving: Number.isNaN(avgDailySaving) ? 0 : avgDailySaving,
    estimatedDaysLeft: Number.isNaN(estimatedDaysLeft) ? 0 : estimatedDaysLeft,
    probability: Number.isNaN(probability) ? 0 : probability,
    isOnTrack,
    projectedDate,
  };
}

/**
 * Returns historical tracking analytics for a completed goal.
 */
export function getGoalHistory(goal: GoalRecord | GoalUIModel): GoalHistory | null {
  if (!goal.completed_at || goal.status !== 'completed') return null;

  const createdTime = new Date(goal.created_at).getTime();
  const completedTime = new Date(goal.completed_at).getTime();
  const deadlineTime = new Date(goal.deadline).getTime();

  const timeTakenDays = Math.max(1, Math.round((completedTime - createdTime) / (1000 * 60 * 60 * 24)));
  const expectedDays = Math.max(1, Math.round((deadlineTime - createdTime) / (1000 * 60 * 60 * 24)));

  let performance: GoalHistory['performance'] = 'On Time';
  if (timeTakenDays < expectedDays * 0.8) {
    performance = 'Ahead of Schedule';
  } else if (timeTakenDays > expectedDays) {
    performance = 'Delayed';
  }

  const completedDateStr = new Date(goal.completed_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return {
    completedDate: completedDateStr,
    timeTakenDays,
    performance,
  };
}

/**
 * Sort goals:
 * 1. Active before Completed
 * 2. Active: Higher Priority first
 * 3. Active: Lowest Probability first
 * 4. Completed: Fastest timeTakenDays first
 */
export function sortGoals(goals: GoalUIModel[]): GoalUIModel[] {
  return [...goals].sort((a, b) => {
    // Active vs Completed
    if (a.status !== b.status) {
      if (a.status === 'active') return -1;
      if (b.status === 'active') return 1;
      if (a.status === 'completed') return -1;
      return 1;
    }
    
    // Sort logic for active goals
    if (a.status === 'active') {
      const priorityA = Number(a.priority) || 0;
      const priorityB = Number(b.priority) || 0;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return (a.analytics?.probability || 0) - (b.analytics?.probability || 0);
    }

    // Sort logic for completed goals: fastest completion first
    if (a.status === 'completed') {
      const historyA = getGoalHistory(a);
      const historyB = getGoalHistory(b);
      const timeA = historyA ? historyA.timeTakenDays : Infinity;
      const timeB = historyB ? historyB.timeTakenDays : Infinity;
      return timeA - timeB;
    }

    return 0;
  });
}

/**
 * Aggregate overview stats across all goals.
 */
export function computeOverviewStats(goals: GoalRecord[]): GoalsOverviewStats {
  const active = goals.filter(g => g.status === 'active');
  const completed = goals.filter(g => g.status === 'completed');

  const totalSaved = goals.reduce((sum, g) => sum + (Number(g.saved_amount) || 0), 0);
  const totalTarget = goals.reduce((sum, g) => sum + (Number(g.target_amount) || 0), 0);

  // Weighted average: each goal's progress weighted by its target
  const overallProgress = totalTarget > 0
    ? (totalSaved / totalTarget) * 100
    : 0;

  return {
    totalActive: active.length,
    totalCompleted: completed.length,
    overallProgress: Math.max(0, Math.min(100, Math.round(overallProgress || 0))),
    totalSaved,
    totalTarget,
  };
}

/**
 * Generate 6-month forward projection using per-goal AI-recommended contributions.
 *
 * Logic per goal (active only):
 *   1. Use recommended_monthly_contribution if stored (from AI planner)
 *   2. Else derive: remaining / months_to_deadline
 *   3. Stop contributing for a goal once its deadline passes OR it's fully funded
 *
 * Starting point = actual current total saved across ALL goals.
 * No artificial variance — the slope accurately reflects the AI plan.
 */
export function generateProjection(
  goals: GoalRecord[],
  months: number = 6
): ProjectionPoint[] {
  const activeGoals = goals.filter(g => g.status === 'active');

  // Actual current total saved (start the chart here, not at ₹0)
  const totalCurrentSaved = goals.reduce((sum, g) => sum + (Number(g.saved_amount) || 0), 0);

  // Pre-compute per-goal plan rates
  const goalPlans = activeGoals.map(g => {
    const target    = Number(g.target_amount)  || 0;
    const saved     = Number(g.saved_amount)   || 0;
    const remaining = Math.max(target - saved, 0);
    const deadline  = new Date(g.deadline);

    let monthly: number;
    if (g.recommended_monthly_contribution && g.recommended_monthly_contribution > 0) {
      monthly = g.recommended_monthly_contribution;
    } else {
      const monthsLeft = Math.max(
        1,
        (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
      );
      monthly = remaining > 0 ? remaining / monthsLeft : 0;
    }

    return { monthly, remaining, deadline, currentRemaining: remaining };
  });

  // Fallback: if no goals have any plan, use historical contribution pace
  const totalPlanMonthly = goalPlans.reduce((s, g) => s + g.monthly, 0);
  let fallbackMonthly = 0;
  if (totalPlanMonthly === 0) {
    const allContributions = activeGoals.flatMap(g => g.contributions || []);
    fallbackMonthly = computeAvgDailySaving(allContributions) * 30;
  }

  const points: ProjectionPoint[] = [];
  const today = new Date();

  points.push({
    month: 'Today',
    projected: Math.round(totalCurrentSaved),
  });

  let cumulative = totalCurrentSaved;
  // Track remaining per goal to stop over-contributing
  const remainingPerGoal = goalPlans.map(p => p.currentRemaining);

  for (let i = 1; i <= months; i++) {
    const futureDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const monthLabel = futureDate.toLocaleDateString('en-IN', {
      month: 'short',
      year: '2-digit',
    });

    let monthlyContribution = fallbackMonthly; // used when no goal plans

    if (totalPlanMonthly > 0) {
      monthlyContribution = 0;
      goalPlans.forEach((plan, idx) => {
        // Only contribute if deadline hasn't passed and goal isn't fully funded
        if (futureDate <= plan.deadline && remainingPerGoal[idx] > 0) {
          const contribution = Math.min(plan.monthly, remainingPerGoal[idx]);
          monthlyContribution += contribution;
          remainingPerGoal[idx] -= contribution;
        }
      });
    }

    cumulative += Math.max(0, monthlyContribution);

    points.push({
      month: monthLabel,
      projected: Math.round(cumulative),
    });
  }

  return points;
}
