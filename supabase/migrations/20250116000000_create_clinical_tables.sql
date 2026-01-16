-- 1. Create PATIENTS table
create table if not exists public.patients (
  id uuid default uuid_generate_v4() primary key,
  clinic_id uuid references public.clinics(id) not null,
  full_name text not null,
  cpf text,
  phone text,
  email text,
  birth_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create APPOINTMENTS table
create table if not exists public.appointments (
  id uuid default uuid_generate_v4() primary key,
  clinic_id uuid references public.clinics(id) not null,
  patient_id uuid references public.patients(id) on delete cascade not null,
  dentist_id uuid references public.profiles(id), -- Nullable if just a placeholder, but usually required
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  status text check (status in ('scheduled', 'confirmed', 'completed', 'canceled', 'no-show')) default 'scheduled',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS
alter table public.patients enable row level security;
alter table public.appointments enable row level security;

-- 4. RLS Policies (Clinic Isolation)
-- Patients: Everyone in the clinic can view/edit patients (Receptionist + Dentists)
create policy "Users can view patients from their clinic"
  on public.patients for select
  using ( clinic_id = public.get_my_clinic_id() );

create policy "Users can insert patients for their clinic"
  on public.patients for insert
  with check ( clinic_id = public.get_my_clinic_id() );

create policy "Users can update patients from their clinic"
  on public.patients for update
  using ( clinic_id = public.get_my_clinic_id() );

create policy "Users can delete patients from their clinic"
  on public.patients for delete
  using ( clinic_id = public.get_my_clinic_id() );

-- Appointments: Everyone in the clinic can view appointments (Shared Calendar)
-- Optionally, we could restrict so Dentists only edit their own, but usually Reception manages all.
create policy "Users can view appointments from their clinic"
  on public.appointments for select
  using ( clinic_id = public.get_my_clinic_id() );

create policy "Users can insert appointments for their clinic"
  on public.appointments for insert
  with check ( clinic_id = public.get_my_clinic_id() );

create policy "Users can update appointments from their clinic"
  on public.appointments for update
  using ( clinic_id = public.get_my_clinic_id() );

create policy "Users can delete appointments from their clinic"
  on public.appointments for delete
  using ( clinic_id = public.get_my_clinic_id() );

-- 5. Indexes for performance
create index idx_patients_clinic_id on public.patients(clinic_id);
create index idx_appointments_clinic_id on public.appointments(clinic_id);
create index idx_appointments_dentist_id on public.appointments(dentist_id);
create index idx_appointments_start_time on public.appointments(start_time);
