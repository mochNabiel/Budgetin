-- TABEL PROFILE USER
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  email text not null,
  full_name text,

  avatar_url text,

  plan text not null default 'free'
    check (plan in ('free', 'pro')),

  onboarding_completed boolean not null default false,
  currency text not null default 'IDR',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- INDEXING UNTUK TABEL PROFILE
create unique index profiles_email_idx
on public.profiles(email);

create index profiles_plan_idx
on public.profiles(plan);


-- TABEL WALLET
create table public.wallets (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  name text not null,

  icon text not null,

  color text not null,

  balance bigint not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- INDEXING UNTUK TABEL WALLET
create index idx_wallets_user
on public.wallets(user_id);


-- TABEL KATEGORI
create table public.categories (
  id integer generated always as identity primary key,

  user_id uuid
    references public.profiles(id)
    on delete cascade,

  type text not null
    check (type in ('income', 'expense')),

  name text not null,

  icon text not null,

  color text not null,

  is_default boolean not null default false,

  created_at timestamptz not null default now(),

  unique(user_id, name, type)
);

-- INDEXING UNTUK TABEL KATEGORI
create index idx_categories_user
on public.categories(user_id);

create index idx_categories_type
on public.categories(type);

-- TABEL TRANSAKSI
create table public.transactions (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  wallet_id uuid not null
    references public.wallets(id)
    on delete cascade,

  category_id integer not null
    references public.categories(id),

  type text not null
    check (type in ('income', 'expense')),

  amount bigint not null
    check (amount > 0),

  notes text,

  attachment_url text,

  transaction_date date not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- INDEXING UNTUK TABEL TRANSAKSI
create index idx_transactions_user
on public.transactions(user_id);

create index idx_transactions_wallet
on public.transactions(wallet_id);

create index idx_transactions_category
on public.transactions(category_id);

create index idx_transactions_date
on public.transactions(transaction_date desc);

create index idx_transactions_user_date
on public.transactions(user_id, transaction_date desc);


-- TABEL TRANSFER
create table public.transfers (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  from_wallet_id uuid not null
    references public.wallets(id) on delete cascade,

  to_wallet_id uuid not null
    references public.wallets(id) on delete cascade,

  amount bigint not null
    check (amount > 0),

  notes text,

  transfer_date date not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  check (from_wallet_id <> to_wallet_id)
);

-- INDEXING UNTUK TABEL TRANSFER
create index idx_transfers_user
on public.transfers(user_id);

create index idx_transfers_date
on public.transfers(transfer_date desc);


-- TABEL SUBSCRIPTION
create table public.subscriptions (
  id bigint generated always as identity primary key,

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  provider text not null,

  plan text not null,

  status text not null,

  provider_subscription_id text,

  started_at timestamptz,

  expires_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- INDEXING UNTUK TABEL SUBSCRIPTION
create unique index idx_subscriptions_user
on public.subscriptions(user_id);


-- TABEL AI CONVERSATION
create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references public.profiles(id)
    on delete cascade,

  title text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- INDEXING UNTUK TABEL AI CONVERSATION
create index idx_ai_conversations_user
on public.ai_conversations(user_id);


-- TABEL AI MESSAGES
create table public.ai_messages (
  id bigint generated always as identity primary key,

  conversation_id uuid not null
    references public.ai_conversations(id)
    on delete cascade,

  role text not null
    check (role in ('user', 'assistant')),

  content text not null,

  created_at timestamptz not null default now()
);

-- INDEXING UNTUK TABEL AI MESSAGES
create index idx_ai_messages_conversation
on public.ai_messages(conversation_id);



-- TRIGGER UNTUK HANDLE USER BARU OTOMATIS CREATE PROFILE
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    onboarding_completed
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    false
  );

  -- Default categories
  insert into public.categories (
    user_id,
    type,
    name,
    icon,
    color
  )
  values
    -- Income
    (new.id, 'income', 'Salary', '💼', '#86EFAC'),
    (new.id, 'income', 'Business', '🏪', '#67E8F9'),
    (new.id, 'income', 'Other Income', '💰', '#C4B5FD'),

    -- Expense
    (new.id, 'expense', 'Food & Drinks', '🍜', '#FDBA74'),
    (new.id, 'expense', 'Transportation', '🚗', '#7DD3FC'),
    (new.id, 'expense', 'Shopping', '🛍️', '#FDA4AF'),
    (new.id, 'expense', 'Bills', '🧾', '#FCD34D'),
    (new.id, 'expense', 'Entertainment', '🎮', '#DDD6FE'),
    (new.id, 'expense', 'Health', '❤️', '#99F6E4');

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- STORAGE BUCKET UNTUK MENYIMPAN AVATAR USER
insert into storage.buckets (
  id,
  name,
  public
)
values (
  'avatars',
  'avatars',
  true
);


-- ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.transfers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;


-- POLICIES
create policy "profile_select"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profile_update"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "wallets_all"
on public.wallets
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "categories_select"
on public.categories
for select
to authenticated
using (
  auth.uid() = user_id
);

create policy "categories_insert"
on public.categories
for insert
to authenticated
with check (
  auth.uid() = user_id
);

create policy "categories_update"
on public.categories
for update
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);

create policy "categories_delete"
on public.categories
for delete
to authenticated
using (
  auth.uid() = user_id
);

create policy "transactions_all"
on public.transactions
for all
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);

create policy "transfers_all"
on public.transfers
for all
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);

create policy "subscriptions_select"
on public.subscriptions
for select
to authenticated
using (
  auth.uid() = user_id
);

create policy "ai_conversations_all"
on public.ai_conversations
for all
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);

create policy "ai_messages_all"
on public.ai_messages
for all
to authenticated
using (
  exists (
    select 1
    from public.ai_conversations c
    where c.id = conversation_id
      and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.ai_conversations c
    where c.id = conversation_id
      and c.user_id = auth.uid()
  )
);

create policy "avatar_upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "avatar_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "avatar_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "avatar_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- TRIGGER FUNCTION UNTUK AUTO UPDATE updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- PROFILE
create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.handle_updated_at();

-- WALLET
create trigger wallets_updated_at
before update on public.wallets
for each row
execute function public.handle_updated_at();

-- TRANSACTIONS
create trigger transactions_updated_at
before update on public.transactions
for each row
execute function public.handle_updated_at();

-- TRANSFER
create trigger transfers_updated_at
before update on public.transfers
for each row
execute function public.handle_updated_at();

-- SUBSCRIPTIONS
create trigger subscriptions_updated_at
before update on public.subscriptions
for each row
execute function public.handle_updated_at();

-- AI CONVERSATIONS
create trigger ai_conversations_updated_at
before update on public.ai_conversations
for each row
execute function public.handle_updated_at();