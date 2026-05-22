-- =========================================================
-- EXTENSIONS
-- =========================================================

create extension if not exists "pgcrypto";

-- =========================================================
-- ENUMS
-- =========================================================

create type public.transaction_type as enum (
  'income',
  'expense'
);

create type public.subscription_plan as enum (
  'free',
  'pro'
);

create type public.subscription_status as enum (
  'pending',
  'active',
  'expired',
  'cancelled'
);

create type public.assistant_role as enum (
  'user',
  'assistant',
  'system'
);

create type public.assistant_draft_source as enum (
  'chat',
  'voice'
);

create type public.assistant_draft_status as enum (
  'pending',
  'confirmed',
  'discarded'
);

create type public.export_format as enum (
  'csv',
  'xlsx'
);

create type public.theme_mode as enum (
  'light',
  'dark',
  'system'
);

-- =========================================================
-- USERS
-- =========================================================

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,

  email text not null unique,
  full_name text,
  avatar_url text,

  plan public.subscription_plan not null default 'free',

  onboarding_completed boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- USER PREFERENCES
-- =========================================================

create table public.user_preferences (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null unique
    references public.users(id)
    on delete cascade,

  theme public.theme_mode not null default 'system',

  home_layout jsonb not null default '{
    "sections": [
      {
        "id": "balance",
        "enabled": true,
        "order": 1
      },
      {
        "id": "income_expense",
        "enabled": true,
        "order": 2
      },
      {
        "id": "financial_trend",
        "enabled": true,
        "order": 3
      },
      {
        "id": "allocation",
        "enabled": true,
        "order": 4
      },
      {
        "id": "recent_transactions",
        "enabled": true,
        "order": 5
      }
    ]
  }'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- CATEGORIES
-- =========================================================

create table public.categories (
  id uuid primary key default gen_random_uuid(),

  user_id uuid
    references public.users(id)
    on delete cascade,

  type public.transaction_type not null,

  name text not null,

  icon text not null,
  color text not null,

  is_default boolean not null default false,

  created_at timestamptz not null default now()
);

-- =========================================================
-- TRANSACTIONS
-- =========================================================

create table public.transactions (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id)
    on delete cascade,

  category_id uuid not null
    references public.categories(id)
    on delete restrict,

  type public.transaction_type not null,

  amount numeric(14,2) not null check (amount >= 0),

  description text,

  transaction_date date not null,

  transaction_month int not null check (
    transaction_month between 1 and 12
  ),

  transaction_year int not null check (
    transaction_year >= 2020
  ),

  attachment_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- ASSISTANT CONVERSATIONS
-- =========================================================

create table public.assistant_conversations (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null unique
    references public.users(id)
    on delete cascade,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- ASSISTANT MESSAGES
-- =========================================================

create table public.assistant_messages (
  id uuid primary key default gen_random_uuid(),

  conversation_id uuid not null
    references public.assistant_conversations(id)
    on delete cascade,

  role public.assistant_role not null,

  content text not null,

  metadata jsonb,

  created_at timestamptz not null default now()
);

-- =========================================================
-- ASSISTANT DRAFTS
-- =========================================================

create table public.assistant_drafts (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id)
    on delete cascade,

  category_id uuid
    references public.categories(id)
    on delete set null,

  type public.transaction_type not null,

  amount numeric(14,2) not null check (amount >= 0),

  description text,

  transaction_date date not null,

  source public.assistant_draft_source not null,

  raw_input text,

  status public.assistant_draft_status not null default 'pending',

  created_at timestamptz not null default now()
);

-- =========================================================
-- SUBSCRIPTIONS
-- =========================================================

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id)
    on delete cascade,

  plan public.subscription_plan not null,

  status public.subscription_status not null default 'pending',

  started_at timestamptz,
  expires_at timestamptz,

  created_at timestamptz not null default now()
);

-- =========================================================
-- PAYMENT TRANSACTIONS
-- =========================================================

create table public.payment_transactions (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id)
    on delete cascade,

  midtrans_order_id text not null unique,

  amount numeric(14,2) not null check (amount >= 0),

  status text not null,

  payment_type text,

  payload jsonb,

  created_at timestamptz not null default now()
);

-- =========================================================
-- EXPORTS
-- =========================================================

create table public.exports (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id)
    on delete cascade,

  format public.export_format not null,

  month int not null check (
    month between 1 and 12
  ),

  year int not null check (
    year >= 2020
  ),

  created_at timestamptz not null default now()
);

-- =========================================================
-- USER SESSIONS
-- =========================================================

create table public.user_sessions (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.users(id)
    on delete cascade,

  device_name text,
  browser text,
  ip_address text,

  last_active_at timestamptz not null default now(),

  revoked_at timestamptz,

  created_at timestamptz not null default now()
);

-- =========================================================
-- INDEXES
-- =========================================================

create index idx_transactions_user_id
on public.transactions(user_id);

create index idx_transactions_user_month_year
on public.transactions(
  user_id,
  transaction_month,
  transaction_year
);

create index idx_transactions_category_id
on public.transactions(category_id);

create index idx_categories_user_type
on public.categories(user_id, type);

create index idx_assistant_messages_conversation_id
on public.assistant_messages(conversation_id);

create index idx_subscriptions_user_id
on public.subscriptions(user_id);

create index idx_user_sessions_user_id
on public.user_sessions(user_id);

-- =========================================================
-- UPDATED_AT FUNCTION
-- =========================================================

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- UPDATED_AT TRIGGERS
-- =========================================================

create trigger users_updated_at
before update on public.users
for each row
execute procedure public.handle_updated_at();

create trigger user_preferences_updated_at
before update on public.user_preferences
for each row
execute procedure public.handle_updated_at();

create trigger transactions_updated_at
before update on public.transactions
for each row
execute procedure public.handle_updated_at();

create trigger assistant_conversations_updated_at
before update on public.assistant_conversations
for each row
execute procedure public.handle_updated_at();

-- =========================================================
-- AUTO CREATE USER
-- =========================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (
    id,
    email,
    full_name,
    avatar_url
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  );

  insert into public.user_preferences (
    user_id
  )
  values (
    new.id
  );

  insert into public.assistant_conversations (
    user_id
  )
  values (
    new.id
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

-- =========================================================
-- ENABLE RLS
-- =========================================================

alter table public.users enable row level security;
alter table public.user_preferences enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.assistant_conversations enable row level security;
alter table public.assistant_messages enable row level security;
alter table public.assistant_drafts enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.exports enable row level security;
alter table public.user_sessions enable row level security;

-- =========================================================
-- USERS POLICIES
-- =========================================================

create policy "Users can view own profile"
on public.users
for select
using (
  auth.uid() = id
);

create policy "Users can update own profile"
on public.users
for update
using (
  auth.uid() = id
);

-- =========================================================
-- USER PREFERENCES POLICIES
-- =========================================================

create policy "Users can manage own preferences"
on public.user_preferences
for all
using (
  auth.uid() = user_id
);

-- =========================================================
-- CATEGORIES POLICIES
-- =========================================================

create policy "Users can view categories"
on public.categories
for select
using (
  user_id is null
  or auth.uid() = user_id
);

create policy "Users can insert own categories"
on public.categories
for insert
with check (
  auth.uid() = user_id
);

create policy "Users can update own categories"
on public.categories
for update
using (
  auth.uid() = user_id
);

create policy "Users can delete own categories"
on public.categories
for delete
using (
  auth.uid() = user_id
);

-- =========================================================
-- TRANSACTIONS POLICIES
-- =========================================================

create policy "Users can manage own transactions"
on public.transactions
for all
using (
  auth.uid() = user_id
);

-- =========================================================
-- ASSISTANT CONVERSATIONS POLICIES
-- =========================================================

create policy "Users can manage own conversations"
on public.assistant_conversations
for all
using (
  auth.uid() = user_id
);

-- =========================================================
-- ASSISTANT MESSAGES POLICIES
-- =========================================================

create policy "Users can manage own assistant messages"
on public.assistant_messages
for all
using (
  exists (
    select 1
    from public.assistant_conversations ac
    where ac.id = conversation_id
    and ac.user_id = auth.uid()
  )
);

-- =========================================================
-- ASSISTANT DRAFTS POLICIES
-- =========================================================

create policy "Users can manage own assistant drafts"
on public.assistant_drafts
for all
using (
  auth.uid() = user_id
);

-- =========================================================
-- SUBSCRIPTIONS POLICIES
-- =========================================================

create policy "Users can view own subscriptions"
on public.subscriptions
for select
using (
  auth.uid() = user_id
);

-- =========================================================
-- PAYMENT TRANSACTIONS POLICIES
-- =========================================================

create policy "Users can view own payment transactions"
on public.payment_transactions
for select
using (
  auth.uid() = user_id
);

-- =========================================================
-- EXPORTS POLICIES
-- =========================================================

create policy "Users can manage own exports"
on public.exports
for all
using (
  auth.uid() = user_id
);

-- =========================================================
-- USER SESSIONS POLICIES
-- =========================================================

create policy "Users can manage own sessions"
on public.user_sessions
for all
using (
  auth.uid() = user_id
);