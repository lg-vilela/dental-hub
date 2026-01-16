-- Tabela de TRANSAÇÕES FINANCEIRAS
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  clinic_id uuid references public.clinics(id) not null,
  description text not null,
  amount numeric(10,2) not null, -- Positive for IN, Negative for OUT? Or use 'type' column.
  type text check (type in ('income', 'expense')) not null,
  category text, -- e.g. 'Tratamento', 'Aluguel', 'Materiais'
  date date not null default CURRENT_DATE,
  patient_id uuid references public.patients(id), -- Opcional, se for pagamento de paciente
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index
create index transactions_clinic_id_idx on public.transactions(clinic_id);
create index transactions_date_idx on public.transactions(date);

-- RLS
alter table public.transactions enable row level security;

create policy "Users can view transactions from their clinic"
  on public.transactions for select using ( clinic_id = public.get_my_clinic_id() );

create policy "Users can insert transactions for their clinic"
  on public.transactions for insert with check ( clinic_id = public.get_my_clinic_id() );

create policy "Users can update transactions from their clinic"
  on public.transactions for update using ( clinic_id = public.get_my_clinic_id() );

create policy "Users can delete transactions from their clinic"
  on public.transactions for delete using ( clinic_id = public.get_my_clinic_id() );
