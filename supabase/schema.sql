3-- 1️⃣ PROFILES TABLE
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
