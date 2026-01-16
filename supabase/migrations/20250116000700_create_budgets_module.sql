-- Create BUDGETS table
create table if not exists public.budgets (
  id uuid default uuid_generate_v4() primary key,
  clinic_id uuid references public.clinics(id) not null,
  patient_id uuid references public.patients(id) not null,
  status text check (status in ('draft', 'sent', 'approved', 'rejected', 'paid')) default 'draft',
  total_value numeric(10,2) default 0,
  notes text,
  valid_until date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create BUDGET_ITEMS table
create table if not exists public.budget_items (
  id uuid default uuid_generate_v4() primary key,
  budget_id uuid references public.budgets(id) on delete cascade not null,
  service_id uuid references public.services(id), -- Optional link to original service
  title text not null,
  quantity integer default 1,
  unit_price numeric(10,2) not null,
  subtotal numeric(10,2) generated always as (quantity * unit_price) stored
);

-- Enable RLS
alter table public.budgets enable row level security;
alter table public.budget_items enable row level security;

-- Policies for Budgets
create policy "Users can view budgets from their clinic"
  on public.budgets for select using ( clinic_id = public.get_my_clinic_id() );

create policy "Users can insert budgets for their clinic"
  on public.budgets for insert with check ( clinic_id = public.get_my_clinic_id() );

create policy "Users can update budgets from their clinic"
  on public.budgets for update using ( clinic_id = public.get_my_clinic_id() );

create policy "Users can delete budgets from their clinic"
  on public.budgets for delete using ( clinic_id = public.get_my_clinic_id() );

-- Policies for Budget Items (Access via Budget's Clinic)
-- Ideally, RLS checks the parent budget, but for simplicity we can just rely on the fact
-- that you can only insert items if you can insert the budget. 
-- However, for SELECT, we need a join or using clause.
-- A simpler approach for items is: if you have access to the budget, you have access to the items.
-- But standard RLS on items table usually requires a link to clinic_id or a potentially slow join.
-- Let's add clinic_id to items for easier RLS, or just do the join.
-- Let's add clinic_id to budget_items to simplify RLS performance and security.

alter table public.budget_items add column clinic_id uuid references public.clinics(id);
update public.budget_items set clinic_id = (select clinic_id from public.budgets where id = budget_items.budget_id); -- For existing rows if any (none now)
-- make it not null after ensuring data? It's empty now.
-- actually, let's just drop and recreate for clean migration since it's new.

drop table if exists public.budget_items;

create table public.budget_items (
  id uuid default uuid_generate_v4() primary key,
  clinic_id uuid references public.clinics(id) not null, -- Denormalized for RLS
  budget_id uuid references public.budgets(id) on delete cascade not null,
  service_id uuid references public.services(id),
  title text not null,
  quantity integer default 1,
  unit_price numeric(10,2) not null,
  subtotal numeric(10,2) generated always as (quantity * unit_price) stored
);

alter table public.budget_items enable row level security;

create policy "Users can view budget items from their clinic"
  on public.budget_items for select using ( clinic_id = public.get_my_clinic_id() );

create policy "Users can insert budget items for their clinic"
  on public.budget_items for insert with check ( clinic_id = public.get_my_clinic_id() );

create policy "Users can update budget items from their clinic"
  on public.budget_items for update using ( clinic_id = public.get_my_clinic_id() );

create policy "Users can delete budget items from their clinic"
  on public.budget_items for delete using ( clinic_id = public.get_my_clinic_id() );


-- RPC Function to Save Budget + Items Atomically
CREATE OR REPLACE FUNCTION public.save_budget(
    p_clinic_id uuid,
    p_patient_id uuid,
    p_total_value numeric,
    p_items jsonb,
    p_notes text default null,
    p_budget_id uuid default null -- If provided, update; else insert
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_budget_id uuid;
    v_item jsonb;
BEGIN
    IF p_budget_id IS NOT NULL THEN
        -- Link to update logic later if needed, for now let's focus on Creation or simple overwrite
        -- Actually, let's treat p_budget_id as "Update this budget"
        UPDATE public.budgets 
        SET total_value = p_total_value, notes = p_notes
        WHERE id = p_budget_id AND clinic_id = p_clinic_id;
        
        v_budget_id := p_budget_id;
        
        -- Clear existing items to rewrite them (simplest update strategy for document-like entities)
        DELETE FROM public.budget_items WHERE budget_id = v_budget_id;
    ELSE
        INSERT INTO public.budgets (clinic_id, patient_id, total_value, notes)
        VALUES (p_clinic_id, p_patient_id, p_total_value, p_notes)
        RETURNING id INTO v_budget_id;
    END IF;

    -- Insert Items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO public.budget_items (clinic_id, budget_id, service_id, title, quantity, unit_price)
        VALUES (
            p_clinic_id,
            v_budget_id,
            (v_item->>'service_id')::uuid,
            (v_item->>'title'),
            (v_item->>'quantity')::int,
            (v_item->>'unit_price')::numeric
        );
    END LOOP;

    RETURN json_build_object('id', v_budget_id);
END;
$$;
