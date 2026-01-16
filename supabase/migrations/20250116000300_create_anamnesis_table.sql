create table if not exists public.anamnesis (
  id uuid default uuid_generate_v4() primary key,
  clinic_id uuid references public.clinics(id) not null,
  patient_id uuid references public.patients(id) not null,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.anamnesis enable row level security;

create policy "Users can view anamnesis from their clinic"
  on public.anamnesis for select using ( clinic_id = public.get_my_clinic_id() );

create policy "Users can insert anamnesis for their clinic"
  on public.anamnesis for insert with check ( clinic_id = public.get_my_clinic_id() );

create policy "Users can update anamnesis for their clinic"
  on public.anamnesis for update using ( clinic_id = public.get_my_clinic_id() );
