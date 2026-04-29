// src/types/goals.ts

export interface GoalContribution {
  amount: number;
  date: string; // ISO date
}

export type GoalColorPreset = 'blue' | 'green' | 'purple' | 'orange' | 'red';

export interface GoalRecord {
  id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  icon: string;
  color_preset: GoalColorPreset;
  deadline: string;         // ISO date
  status: 'active' | 'completed' | 'paused' | 'archived';
  priority: number;
  created_at: string;
  completed_at?: string;
  contributions: GoalContribution[];
}

export interface GoalHistory {
  completedDate: string;
  timeTakenDays: number;
  performance: 'Ahead of Schedule' | 'On Time' | 'Delayed';
}

export interface GoalAnalytics {
  progress: number;           // 0–100
  remaining: number;          // ₹ left
  avgDailySaving: number;     // computed from contributions
  estimatedDaysLeft: number;  // -1 if no data
  probability: number;        // 0–100
  isOnTrack: boolean;
  projectedDate: Date | null;
}

export interface GoalsOverviewStats {
  totalActive: number;
  totalCompleted: number;
  overallProgress: number;    // weighted average
  totalSaved: number;
  totalTarget: number;
}

export interface GoalUIModel extends GoalRecord {
  analytics: GoalAnalytics;
  glowType: GoalColorPreset;
  theme: {
    baseColor: string;
    gradient: string;
  };
}

export interface ProjectionPoint {
  month: string;       // "Jan 2027"
  projected: number;   // cumulative ₹ saved
  actual?: number;     // if historical month
}
