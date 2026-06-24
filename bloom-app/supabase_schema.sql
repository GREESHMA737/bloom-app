-- ===================================================
-- BLOOM APP SUPABASE DATABASE MIGRATION SCRIPT
-- ===================================================
-- Copy and paste this script into the Supabase SQL Editor
-- (Database -> SQL Editor -> New Query) and click Run.

-- 1. Create Profiles Table (Linked to Supabase Auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  streak integer default 5 not null,
  active_theme text default 'theme-lavender' not null,
  is_dark_mode boolean default false not null,
  dump_thoughts text default '' not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

create policy "Users can view their own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- Trigger to automatically create a Profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, streak, active_theme, is_dark_mode)
  values (new.id, 5, 'theme-lavender', false);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Create Todos Table
create table public.todos (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  text text not null,
  priority text default 'medium' not null,
  completed boolean default false not null,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.todos enable row level security;

create policy "Users can perform all actions on their own todos" 
  on public.todos for all 
  using (auth.uid() = user_id);


-- 3. Create Notes Table
create table public.notes (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text not null,
  color text default '#fef3c7' not null,
  pinned boolean default false not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notes enable row level security;

create policy "Users can perform all actions on their own notes" 
  on public.notes for all 
  using (auth.uid() = user_id);


-- 4. Create Journals Table
create table public.journals (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  title text not null,
  content text not null,
  mood text not null,
  good_thing text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.journals enable row level security;

create policy "Users can perform all actions on their own journals" 
  on public.journals for all 
  using (auth.uid() = user_id);


-- 5. Create Bucket List Table
create table public.bucket_list (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  text text not null,
  emoji text default '🌟' not null,
  progress integer default 0 not null,
  completed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.bucket_list enable row level security;

create policy "Users can perform all actions on their own bucket items" 
  on public.bucket_list for all 
  using (auth.uid() = user_id);


-- 6. Create Time Capsules Table
create table public.time_capsules (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  message text not null,
  photos text[] default '{}'::text[] not null, -- Array of image URLs/Base64 strings
  unlock_date timestamp with time zone not null,
  unlocked boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.time_capsules enable row level security;

create policy "Users can perform all actions on their own time capsules" 
  on public.time_capsules for all 
  using (auth.uid() = user_id);


-- 7. Create Memories Table (Memory Wall Polaroids)
create table public.memories (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  caption text not null,
  photo text not null, -- Base64 JPEG data or Unsplash URL
  date date not null,
  emotion text not null,
  location text default '' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.memories enable row level security;

create policy "Users can perform all actions on their own memories" 
  on public.memories for all 
  using (auth.uid() = user_id);


-- 8. Create Letters Table (Letters to Future Me)
create table public.letters (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  content text not null,
  open_date timestamp with time zone not null,
  unlocked boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.letters enable row level security;

create policy "Users can perform all actions on their own letters" 
  on public.letters for all 
  using (auth.uid() = user_id);


-- 9. Create Gratitude Notes Table (Gratitude Jar)
create table public.gratitude_notes (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.gratitude_notes enable row level security;

create policy "Users can perform all actions on their own gratitude notes" 
  on public.gratitude_notes for all 
  using (auth.uid() = user_id);

