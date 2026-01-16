-- Create REMINDERS table
create table if not exists public.reminders (
  id uuid default uuid_generate_v4() primary key,
  clinic_id uuid references public.clinics(id) not null,
  title text not null,
  created_by uuid references public.profiles(id),
  assigned_to uuid references public.profiles(id),
  status text check (status in ('pending', 'in_progress', 'done')) default 'pending',
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.reminders enable row level security;

-- Policies
create policy "Users can view reminders from their clinic"
  on public.reminders for select
  using ( clinic_id = public.get_my_clinic_id() );

create policy "Users can insert reminders for their clinic"
  on public.reminders for insert
  with check ( clinic_id = public.get_my_clinic_id() );

create policy "Users can update reminders from their clinic"
  on public.reminders for update
  using ( clinic_id = public.get_my_clinic_id() );

create policy "Users can delete reminders from their clinic"
  on public.reminders for delete
  using ( clinic_id = public.get_my_clinic_id() );

-- Indexes
create index idx_reminders_clinic_id on public.reminders(clinic_id);
create index idx_reminders_assigned_to on public.reminders(assigned_to);
