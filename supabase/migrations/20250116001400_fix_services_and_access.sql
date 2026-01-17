-- 1. Create SERVICES table (Missing)
create table if not exists public.services (
  id uuid default uuid_generate_v4() primary key,
  clinic_id uuid references public.clinics(id) not null,
  title text not null,
  price numeric default 0,
  duration_minutes integer default 30,
  icon text default 'dentistry',
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.services enable row level security;

-- Policies for Services
drop policy if exists "Users can view services from their clinic" on public.services;
create policy "Users can view services from their clinic"
  on public.services for select
  using ( clinic_id = public.get_my_clinic_id() );

drop policy if exists "Users can insert services for their clinic" on public.services;
create policy "Users can insert services for their clinic"
  on public.services for insert
  with check ( clinic_id = public.get_my_clinic_id() );

drop policy if exists "Users can update services from their clinic" on public.services;
create policy "Users can update services from their clinic"
  on public.services for update
  using ( clinic_id = public.get_my_clinic_id() );

drop policy if exists "Users can delete services from their clinic" on public.services;
create policy "Users can delete services from their clinic"
  on public.services for delete
  using ( clinic_id = public.get_my_clinic_id() );


-- 2. Fix PROFILES visibility (Team Members disappearing)
-- Ensure RLS is enabled
alter table public.profiles enable row level security;

-- Allow viewing ALL profiles in the SAME clinic (not just self)
drop policy if exists "Users can view profiles from their clinic" on public.profiles;
create policy "Users can view profiles from their clinic"
  on public.profiles for select
  using ( clinic_id = public.get_my_clinic_id() );

-- Allow admins to update roles? (Optional, but good for management)
-- For now, focused on visibility.
