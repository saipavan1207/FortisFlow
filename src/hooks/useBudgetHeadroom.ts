import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface BudgetHeadroomResult {
  /** ₹ available to spend / save this month (budget limit - actual spend). null if no budget set. */
  headroom: number | null;
  /** The raw monthly budget limit. null if not configured. */
  budgetLimit: number | null;
  /** How much has been spent so far this month */
  actualSpend: number;
  /** Manually re-fetch (call after budget adjustment) */
  refresh: () => Promise<void>;
}

export function useBudgetHeadroom(): BudgetHeadroomResult {
  const [headroom, setHeadroom]       = useState<number | null>(null);
  const [budgetLimit, setBudgetLimit] = useState<number | null>(null);
  const [actualSpend, setActualSpend] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const now       = new Date();
      const month     = now.getMonth() + 1;
      const year      = now.getFullYear();
      const startOfMonth = new Date(year, month - 1, 1).toISOString();
      const endOfMonth   = new Date(year, month, 0, 23, 59, 59).toISOString();

      const [{ data: budgetRow }, { data: txns }] = await Promise.all([
        supabase
          .from('budgets')
          .select('Budget, amount, month, year')
          .eq('user_id', user.id)
          .eq('month', month)
          .eq('year', year)
          .maybeSingle(),
        supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', user.id)
          .eq('type', 'expense')
          .gte('created_at', startOfMonth)
          .lte('created_at', endOfMonth),
      ]);

      const limit   = parseFloat((budgetRow as any)?.Budget ?? (budgetRow as any)?.amount ?? '0');
      const spent   = (txns ?? []).reduce((sum: number, t: any) => sum + parseFloat(t.amount ?? '0'), 0);
      const avail   = limit > 0 ? Math.max(0, limit - spent) : null;

      setBudgetLimit(limit > 0 ? limit : null);
      setActualSpend(spent);
      setHeadroom(avail);
    } catch (err) {
      console.error('[useBudgetHeadroom] fetch failed', err);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { headroom, budgetLimit, actualSpend, refresh };
}
