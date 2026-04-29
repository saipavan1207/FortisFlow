-- ══════════════════════════════════════════════════════════════════
-- FortisFlow — DB Cleanup Script
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ══════════════════════════════════════════════════════════════════

-- ─── STEP 1: Drop unused table ────────────────────────────────────
-- linked_accounts: zero rows, zero code references
DROP TABLE IF EXISTS public.linked_accounts CASCADE;

-- ─── STEP 2: Remove duplicate RLS policy ─────────────────────────
-- goal_contributions had two identical ALL policies
DROP POLICY IF EXISTS "Users manage own goal contributions" ON public.goal_contributions;

-- ─── STEP 3: Add missing INSERT policy on profiles ───────────────
-- Needed for completeness (handle_new_user runs as SECURITY DEFINER
-- so it already bypasses RLS, but this is best practice)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'profiles'
      AND policyname = 'Users can insert own profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can insert own profile" ON public.profiles
             FOR INSERT WITH CHECK (auth.uid() = id)';
  END IF;
END $$;

-- ─── STEP 4: Drop orphaned functions ─────────────────────────────
-- None of these are called from any file in src/
DROP FUNCTION IF EXISTS public.get_budget_summary(uuid);
DROP FUNCTION IF EXISTS public.get_budget_vs_actual(uuid);
DROP FUNCTION IF EXISTS public.get_category_trends(uuid);
DROP FUNCTION IF EXISTS public.get_expense_trend(uuid);
DROP FUNCTION IF EXISTS public.get_financial_health(uuid);
DROP FUNCTION IF EXISTS public.get_goal_predictions(uuid);
DROP FUNCTION IF EXISTS public.get_monthly_stats(uuid);
DROP FUNCTION IF EXISTS public.get_top_categories(uuid);

-- ─── VERIFY: List remaining tables ───────────────────────────────
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
-- Expected: budgets, goal_contributions, goals, profiles, transactions
