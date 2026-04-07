-- 1️⃣ PROFILES TABLE
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  currency text default 'INR',
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Users can select own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);


-- 2️⃣ AUTO PROFILE CREATION TRIGGER
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users cascade;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 3️⃣ TRANSACTIONS TABLE
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  amount numeric not null,
  type text check (type in ('income', 'expense')) not null,
  category text,
  title text,
  description text,
  transaction_date date default current_date,
  source text default 'manual',
  created_at timestamp with time zone default now()
);

alter table public.transactions enable row level security;

create policy "Users manage own transactions" on public.transactions
  for all using (auth.uid() = user_id);

create index idx_transactions_user_id on public.transactions(user_id);
create index idx_transactions_date on public.transactions(transaction_date);


-- 4️⃣ GOALS TABLE
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  target_amount numeric not null,
  saved_amount numeric default 0,
  target_date date,
  created_at timestamp with time zone default now()
);

alter table public.goals enable row level security;

create policy "Users manage own goals" on public.goals
  for all using (auth.uid() = user_id);


-- 5️⃣ LINKED ACCOUNTS TABLE
create table public.linked_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  provider text not null,
  account_name text,
  last_four_digits text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

alter table public.linked_accounts enable row level security;

create policy "Users manage own linked accounts" on public.linked_accounts
  for all using (auth.uid() = user_id);


-- 6️⃣ BUDGETS TABLE
create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  category text not null,
  monthly_limit numeric not null,
  month date,
  created_at timestamp with time zone default now()
);

alter table public.budgets enable row level security;

create policy "Users manage own budgets" on public.budgets
  for all using (auth.uid() = user_id);


-- 7️⃣ DASHBOARD METRICS RPC
-- Returns all data needed by the dashboard in a single round-trip.
-- monthlyStatsData always contains exactly 6 rows (one per calendar month going
-- back from the current month) so the Recent Activity chart is always fully
-- populated even when some months have no transactions.
create or replace function public.get_dashboard_metrics(uid uuid)
returns json
language plpgsql
security definer set search_path = public
as $$
declare
    v_monthly_stats     json;
    v_category_breakdown json;
    v_financial_health  numeric;
    v_budgets_vs_actual json;
    v_goal_predictions  json;
    v_category_trends   json;
begin
    -- ── 1. Monthly stats: last 6 calendar months ──────────────────────────────
    -- generate_series guarantees 6 rows even when a month has no transactions.
    select json_agg(row_order)
    into v_monthly_stats
    from (
        select
            to_char(month_series, 'Mon') as month,
            coalesce(sum(case when t.type = 'income'  then t.amount else 0 end), 0) as income,
            coalesce(sum(case when t.type = 'expense' then t.amount else 0 end), 0) as expense
        from generate_series(
            date_trunc('month', now()) - interval '5 months',
            date_trunc('month', now()),
            interval '1 month'
        ) as month_series
        left join public.transactions t
            on  t.user_id = uid
            and date_trunc('month', t.transaction_date::date) = month_series
        group by month_series
        order by month_series
    ) row_order;

    -- ── 2. Category breakdown (current month, top 5 expenses) ─────────────────
    select json_agg(cats)
    into v_category_breakdown
    from (
        select category as name, sum(amount) as amount
        from public.transactions
        where user_id = uid
          and type = 'expense'
          and date_trunc('month', transaction_date::date) = date_trunc('month', now())
        group by category
        order by amount desc
        limit 5
    ) cats;

    -- ── 3. Financial health score (0–100) ─────────────────────────────────────
    -- Score = (income - expense) / income * 100, clamped to [0, 100].
    select
        case
            when coalesce(sum(case when type = 'income' then amount end), 0) = 0 then 0
            else least(100, greatest(0,
                round(
                    (coalesce(sum(case when type = 'income'  then amount end), 0) -
                     coalesce(sum(case when type = 'expense' then amount end), 0))
                    / coalesce(sum(case when type = 'income' then amount end), 1) * 100
                )
            ))
        end
    into v_financial_health
    from public.transactions
    where user_id = uid
      and date_trunc('month', transaction_date::date) = date_trunc('month', now());

    -- ── 4. Budgets vs actual (current month) ──────────────────────────────────
    select json_agg(bva)
    into v_budgets_vs_actual
    from (
        select
            b.category,
            b.monthly_limit,
            coalesce(t.actual_spend, 0) as actual_spend,
            case
                when b.monthly_limit > 0
                then round(coalesce(t.actual_spend, 0) / b.monthly_limit * 100)
                else 0
            end as usage_percentage
        from public.budgets b
        left join (
            select category, sum(amount) as actual_spend
            from public.transactions
            where user_id = uid
              and type = 'expense'
              and date_trunc('month', transaction_date::date) = date_trunc('month', now())
            group by category
        ) t on t.category = b.category
        where b.user_id = uid
    ) bva;

    -- ── 5. Goal predictions ───────────────────────────────────────────────────
    select json_agg(gp)
    into v_goal_predictions
    from (
        select
            g.title,
            g.target_amount,
            g.saved_amount,
            round(avg_monthly.avg_saving) as avg_monthly_saving,
            case
                when g.saved_amount >= g.target_amount then 0
                else ceil(
                    (g.target_amount - g.saved_amount)
                    / greatest(avg_monthly.avg_saving, 1)
                )
            end as months_left
        from public.goals g
        cross join lateral (
            select coalesce(avg(monthly_income), 0) as avg_saving
            from (
                select sum(amount) as monthly_income
                from public.transactions
                where user_id = uid
                  and type = 'income'
                  and transaction_date >= date_trunc('month', now()) - interval '3 months'
                group by date_trunc('month', transaction_date::date)
            ) monthly_totals
        ) avg_monthly
        where g.user_id = uid
    ) gp;

    -- ── 6. Category trends (current vs previous month) ────────────────────────
    select json_agg(ct)
    into v_category_trends
    from (
        select
            curr.category,
            curr.current_spend,
            coalesce(prev.prev_spend, 0) as prev_spend,
            case
                when coalesce(prev.prev_spend, 0) > 0
                then round(
                    (curr.current_spend - prev.prev_spend) / prev.prev_spend * 100,
                    1
                )
                else null
            end as change_pct
        from (
            select category, sum(amount) as current_spend
            from public.transactions
            where user_id = uid
              and type = 'expense'
              and date_trunc('month', transaction_date::date) = date_trunc('month', now())
            group by category
        ) curr
        left join (
            select category, sum(amount) as prev_spend
            from public.transactions
            where user_id = uid
              and type = 'expense'
              and date_trunc('month', transaction_date::date) =
                  date_trunc('month', now()) - interval '1 month'
            group by category
        ) prev on prev.category = curr.category
        order by curr.current_spend desc
        limit 5
    ) ct;

    -- ── Return everything as a single JSON object ──────────────────────────────
    return json_build_object(
        'monthlyStatsData',    coalesce(v_monthly_stats,        '[]'::json),
        'categoryBreakdown',   coalesce(v_category_breakdown,   '[]'::json),
        'financialHealth',     coalesce(v_financial_health,     0),
        'budgetsVsActual',     coalesce(v_budgets_vs_actual,    '[]'::json),
        'goalPredictions',     coalesce(v_goal_predictions,     '[]'::json),
        'categoryTrends',      coalesce(v_category_trends,      '[]'::json)
    );
end;
$$;
