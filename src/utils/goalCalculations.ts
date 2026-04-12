import { GoalRecord, GoalAnalytics, GoalsOverviewStats, ProjectionPoint, GoalUIModel } from '../types/goals';

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
 * Sort goals:
 * 1. Active before Completed
 * 2. Higher Priority first (assuming lower number = higher priority)
 * 3. Lowest Probability first (urgent goals surface to the top)
 */
export function sortGoals(goals: GoalUIModel[]): GoalUIModel[] {
  return [...goals].sort((a, b) => {
    // Active vs Completed
    if (a.status !== b.status) {
      return a.status === 'active' ? -1 : 1;
    }
    // Priority
    const priorityA = Number(a.priority) || 0;
    const priorityB = Number(b.priority) || 0;
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    // Probability
    return (a.analytics?.probability || 0) - (b.analytics?.probability || 0);
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
 * Generate 6-month forward projection.
 * Adds slight deterministic variance for realism.
 */
export function generateProjection(
  goals: GoalRecord[],
  months: number = 6
): ProjectionPoint[] {
  const activeGoals = goals.filter(g => g.status === 'active');
  const totalSaved = goals.reduce((sum, g) => sum + (Number(g.saved_amount) || 0), 0);
  const allContributions = activeGoals.flatMap(g => g.contributions || []);
  const globalAvgDaily = computeAvgDailySaving(allContributions);
  const avgMonthly = globalAvgDaily * 30;

  const points: ProjectionPoint[] = [];
  const today = new Date();

  // Add "Today" as starting point
  points.push({
    month: 'Today',
    projected: Math.round(totalSaved) || 0,
  });

  let currentProjected = totalSaved;

  for (let i = 1; i <= months; i++) {
    const futureDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const monthLabel = futureDate.toLocaleDateString('en-IN', {
      month: 'short',
      year: '2-digit'
    });

    // Add a deterministic pseudo-random variance between -0.05 and +0.05 to make graph realistic
    // Uses month index to seed it
    const varianceFactor = 1 + (Math.sin(i * 12.3) * 0.05);
    const thisMonthSaving = Math.max(0, avgMonthly * varianceFactor);
    
    currentProjected += thisMonthSaving;

    points.push({
      month: monthLabel,
      projected: Math.round(currentProjected) || 0,
    });
  }

  return points;
}
