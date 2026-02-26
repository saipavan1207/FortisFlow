-- 1. Create Profiles Table (Public Profile Data)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  username text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- 2. Create Transactions Table
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  amount numeric(12, 2) not null,
  category text,
  description text,
  type text check (type in ('income', 'expense')), -- Enforce type
  date timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- 3. Create Budgets Table
create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  category text not null,
  limit_amount numeric(12, 2) not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table transactions enable row level security;
alter table budgets enable row level security;

-- Policies for Profiles
-- Users can view their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Trigger to create profile on signup (Optional but recommended)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, username)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Policies for Transactions
-- Users can only see their own transactions
create policy "Users can view own transactions" on transactions
  for select using (auth.uid() = user_id);

-- Users can insert their own transactions
create policy "Users can insert own transactions" on transactions
  for insert with check (auth.uid() = user_id);

-- Users can update their own transactions
create policy "Users can update own transactions" on transactions
  for update using (auth.uid() = user_id);

-- Users can delete their own transactions
create policy "Users can delete own transactions" on transactions
  for delete using (auth.uid() = user_id);


-- Policies for Budgets
-- Users can view own budgets
create policy "Users can view own budgets" on budgets
  for select using (auth.uid() = user_id);

-- Users can manage own budgets
create policy "Users can all own budgets" on budgets
  for all using (auth.uid() = user_id);
