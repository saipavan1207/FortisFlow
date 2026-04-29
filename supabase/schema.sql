-- ══════════════════════════════════════════════════════════════════
-- FortisFlow — Supabase Database Schema (Source of Truth)
-- Last updated: 2026-04-29
-- ══════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────
-- 1️⃣  PROFILES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     text,
  email         text,
  avatar_url    text,
  currency      text DEFAULT 'INR',
  monthly_budget numeric DEFAULT 0,
  created_at    timestamp with time zone DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);


-- ─────────────────────────────────────────────
-- 2️⃣  AUTO PROFILE CREATION TRIGGER
--     Fires on every new auth.users row, creates matching profile.
--     Uses SECURITY DEFINER so it bypasses RLS safely.
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'username',
      new.email
    ),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name  = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ─────────────────────────────────────────────
-- 3️⃣  TRANSACTIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount         numeric NOT NULL,
  type           text CHECK (type IN ('income', 'expense')) NOT NULL,
  category       text,
  subcategory    text,              -- e.g. "Fuel", "Groceries" within Food
  merchant       text,              -- merchant / payee name
  account_source text,              -- e.g. "HDFC Bank", "GPay"
  description    text,              -- optional note
  status         text DEFAULT 'completed',
  created_at     timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own transactions"
  ON public.transactions FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id  ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created  ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type     ON public.transactions(type);


-- ─────────────────────────────────────────────
-- 4️⃣  GOALS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.goals (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title         text,
  target_amount numeric,
  saved_amount  numeric DEFAULT 0,
  deadline      date,
  icon          text,
  color_preset  text,
  priority      numeric DEFAULT 3,
  status        text DEFAULT 'active',   -- active | completed | paused | archived
  created_at    timestamp with time zone DEFAULT now(),
  updated_at    timestamp with time zone DEFAULT now(),
  completed_at  timestamp with time zone
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own goals"
  ON public.goals FOR ALL
  USING (auth.uid() = user_id);


-- ─────────────────────────────────────────────
-- 5️⃣  GOAL CONTRIBUTIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.goal_contributions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id           uuid NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount            numeric NOT NULL,
  contribution_date date DEFAULT CURRENT_DATE,
  notes             text,
  created_at        timestamp with time zone DEFAULT now()
);

ALTER TABLE public.goal_contributions ENABLE ROW LEVEL SECURITY;

-- Single policy (no duplicates)
CREATE POLICY "Users can manage their own contributions"
  ON public.goal_contributions FOR ALL
  USING (auth.uid() = user_id);


-- Auto-sync goals.saved_amount whenever a contribution is inserted/deleted
CREATE OR REPLACE FUNCTION public.sync_goal_saved_amount()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE goals
  SET
    saved_amount = (
      SELECT COALESCE(SUM(amount), 0)
      FROM goal_contributions
      WHERE goal_id = COALESCE(NEW.goal_id, OLD.goal_id)
    ),
    updated_at = now(),
    status = CASE
      WHEN (
        SELECT COALESCE(SUM(amount), 0)
        FROM goal_contributions
        WHERE goal_id = COALESCE(NEW.goal_id, OLD.goal_id)
      ) >= target_amount THEN 'completed'
      ELSE 'active'
    END
  WHERE id = COALESCE(NEW.goal_id, OLD.goal_id);

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_goal_saved_amount ON public.goal_contributions;

CREATE TRIGGER trg_sync_goal_saved_amount
  AFTER INSERT OR DELETE ON public.goal_contributions
  FOR EACH ROW EXECUTE PROCEDURE public.sync_goal_saved_amount();


-- ─────────────────────────────────────────────
-- 6️⃣  BUDGETS (per-category monthly limits)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.budgets (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category   text NOT NULL,
  amount     numeric NOT NULL,   -- monthly limit for this category
  month      integer NOT NULL,   -- 1–12
  year       integer NOT NULL,
  created_at timestamp without time zone DEFAULT now()
);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own budgets"
  ON public.budgets FOR ALL
  USING (auth.uid() = user_id);


-- ─────────────────────────────────────────────
-- 7️⃣  ANALYTICS RPC FUNCTION
--     Called by analyticsService.js via supabase.rpc('get_analytics_data', ...)
-- ─────────────────────────────────────────────
-- (Defined separately in Supabase dashboard; do not overwrite without care)
-- Signature:
--   get_analytics_data(p_user_id uuid, p_start_date date, p_end_date date,
--                      p_time_group text, p_category_filter text DEFAULT NULL)
--   RETURNS json


-- ─────────────────────────────────────────────
-- 8️⃣  GOALS RPC FUNCTION
--     Called by goalsService.ts via supabase.rpc('get_goals_data', { uid })
-- ─────────────────────────────────────────────
-- (Defined separately in Supabase dashboard; do not overwrite without care)
-- Signature:
--   get_goals_data(uid uuid) RETURNS jsonb


-- ══════════════════════════════════════════════════════════════════
-- REMOVED (no longer used):
--   ✗ linked_accounts table        — no code references, 0 rows
--   ✗ get_budget_summary()         — orphaned function
--   ✗ get_budget_vs_actual()       — orphaned function
--   ✗ get_category_trends()        — orphaned function
--   ✗ get_expense_trend()          — orphaned function
--   ✗ get_financial_health()       — orphaned function
--   ✗ get_goal_predictions()       — orphaned function
--   ✗ get_monthly_stats()          — orphaned function
--   ✗ get_top_categories()         — orphaned function
-- ══════════════════════════════════════════════════════════════════
