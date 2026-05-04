import { supabase } from '../lib/supabase';
import { GoalRecord } from '../types/goals';

export async function fetchGoals(userId: string): Promise<GoalRecord[]> {
  const { data, error } = await supabase.rpc('get_goals_data', { uid: userId });

  if (error) {
    console.error("fetchGoals Error:", error);
    throw error;
  }
  return data?.goals ?? [];
}

export async function createGoal(userId: string, goal: {
  title: string;
  target_amount: number;
  deadline: string;
  icon: string;
  color_preset: string;
  priority?: number;
  recommended_monthly_contribution?: number | null;
}): Promise<GoalRecord> {
  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: userId,
      title: goal.title,
      target_amount: goal.target_amount,
      deadline: goal.deadline,
      icon: goal.icon || 'star',
      color_preset: goal.color_preset || 'blue',
      priority: goal.priority ?? 3,
      status: 'active',
      saved_amount: 0,
      recommended_monthly_contribution: goal.recommended_monthly_contribution ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return { ...data, contributions: [] } as GoalRecord;
}

export async function contribute(
  userId: string,
  goalId: string,
  amount: number
): Promise<void> {
  const { error } = await supabase
    .from('goal_contributions')
    .insert({
      user_id: userId,
      goal_id: goalId,
      amount,
      contribution_date: new Date().toISOString().split('T')[0],
    });

  if (error) throw error;
  // Trigger automatically updates goals.saved_amount
}

export async function deleteGoal(userId: string, goalId: string): Promise<void> {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function updateGoalStatus(
  userId: string,
  goalId: string,
  status: 'active' | 'completed' | 'paused' | 'archived',
  completedAt?: string
): Promise<void> {
  const updates: any = { status, updated_at: new Date().toISOString() };
  if (completedAt !== undefined) {
    updates.completed_at = completedAt;
  }
  
  const { error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', goalId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function archiveGoal(userId: string, goalId: string): Promise<void> {
  return updateGoalStatus(userId, goalId, 'archived');
}
