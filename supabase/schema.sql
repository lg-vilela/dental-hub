-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CLINICS TABLE
-- Stores the tenant information and plan limits.
create table public.clinics (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  plan text not null default 'free' check (plan in ('free', 'pro', 'plus')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PROFILES TABLE
-- Links Supabase Auth Users to a Clinic.
create table public.profiles (
  id uuid references auth.users not null primary key,
  clinic_id uuid references public.clinics not null,
  role text not null default 'admin' check (role in ('admin', 'dentist', 'receptionist')),
  full_name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. RLS HELPERS
-- Function to get the current user's clinic_id.
-- This is critical for performance and security policies.
create or replace function public.get_my_clinic_id()
returns uuid as $$
  select clinic_id from public.profiles where id = auth.uid() limit 1;
$$ language sql security definer;

-- 4. ENABLE RLS
alter table public.clinics enable row level security;
alter table public.profiles enable row level security;

-- 5. POLICIES

-- PROFILES: Users can view their own profile.
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );

-- CLINICS: Users can view their own clinic.
create policy "Users can view own clinic"
  on public.clinics for select
  using ( id = public.get_my_clinic_id() );
  
-- 6. AUTOMATION (Triggers)
-- When a new user signs up via Supabase Auth, we need to create a clinic and profile for them automatically.
-- Or, the frontend calls a function. For simplicity/security, a Database Function is better.

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- 1. Create a new Clinic for this user (Default name, Free plan)
  -- Note: existing SetupWizard logic might need to update this name later.
  with new_clinic as (
    insert into public.clinics (name)
    values ('Minha Clínica')
    returning id
  )
  -- 2. Create the Profile linking User -> Clinic
  insert into public.profiles (id, clinic_id, role, email, full_name)
  select new.id, id, 'admin', new.email, new.raw_user_meta_data->>'name'
  from new_clinic;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger logic (Uncomment to enable auto-creation if using raw Supabase Auth signup)
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();

-- For this application, since we have a SetupWizard that collects specific data *after* signup or during,
-- we might prefer calling a helper function via RPC, but the Trigger is the most robust way to ensure every user has a clinic.
