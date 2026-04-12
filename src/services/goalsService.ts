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
}): Promise<GoalRecord> {
  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: userId,
      title: goal.title,
      target_amount: goal.target_amount,
      deadline: goal.deadline,
      icon: goal.icon || 'star', // fallback
      color_preset: goal.color_preset || 'blue',
      priority: goal.priority ?? 3,
      status: 'active',
      saved_amount: 0,
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

export async function deleteGoal(goalId: string): Promise<void> {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId);

  if (error) throw error;
}

export async function updateGoalStatus(
  goalId: string,
  status: 'active' | 'completed' | 'paused'
): Promise<void> {
  const { error } = await supabase
    .from('goals')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', goalId);

  if (error) throw error;
}
