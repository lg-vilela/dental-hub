-- 1. Create SERVICES table for Public Booking
create table if not exists public.services (
  id uuid default uuid_generate_v4() primary key,
  clinic_id uuid references public.clinics(id) not null,
  title text not null,
  price numeric(10, 2) not null default 0.00, -- Can be 0 for 'Grátis' or 'A combinar' logic in UI
  duration_minutes integer not null default 30,
  icon text default 'dentistry', -- Material Symbol name
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. RLS for Services
alter table public.services enable row level security;

-- Clinic owners can manage their services
create policy "Users can view services from their clinic"
  on public.services for select
  using ( clinic_id = public.get_my_clinic_id() );

create policy "Users can insert services for their clinic"
  on public.services for insert
  with check ( clinic_id = public.get_my_clinic_id() );

create policy "Users can update services from their clinic"
  on public.services for update
  using ( clinic_id = public.get_my_clinic_id() );

create policy "Users can delete services from their clinic"
  on public.services for delete
  using ( clinic_id = public.get_my_clinic_id() );

-- PUBLIC ACCESS POLICY (Crucial for the Public Booking Page)
-- This allows anyone (even unauthenticated) to VIEW services if they have the clinic_id context
-- Since we don't have a public.get_my_clinic_id() for unauth users, we usually allow public read 
-- IF we filter by ID in the query.
-- However, typically RLS blocks everything. 
-- For a public booking page, the best standard pattern is:
-- Allow SELECT on 'services' and 'clinics' (public info) for everyone (anon).
-- BUT, we only want to expose services if the user knows the clinic_id.
-- Let's try a broad read policy for 'anon' role?
-- For now, let's keep it restricted and assume the Supabase Client for Public Page might use a Service Role or we open it up.
-- actually, let's simplify: public pages usually use the public anon key.
-- So we need a policy for 'anon' role.

create policy "Public can view active services"
  on public.services for select
  to anon
  using ( active = true );

-- 3. Update Appointments to support "Public Booking" context if needed?
-- The schema seems fine. We just need to ensure we can Create Patient + Appointment via RPC or Client.
-- Since 'anon' users can't usually write to 'patients', we might need a Postgres Function (RPC) for the booking flow to be secure.
-- This function will: Take (clinic_id, name, phone, service_id, time).
-- 1. Check/Create Patient.
-- 2. Create Appointment.
-- 3. Return Success.

CREATE OR REPLACE FUNCTION public.create_public_booking(
    p_clinic_id uuid,
    p_name text,
    p_phone text,
    p_service_id uuid,
    p_start_time timestamp with time zone
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- Run as Superuser/Owner to bypass RLS for anon inserts
AS $$
DECLARE
    v_patient_id uuid;
    v_appt_id uuid;
    v_duration int;
    v_end_time timestamp with time zone;
BEGIN
    -- 1. Validation (Basic)
    IF p_name IS NULL OR p_phone IS NULL THEN
        RAISE EXCEPTION 'Nome e Telefone são obrigatórios.';
    END IF;

    -- 2. Find or Create Patient (by Phone + Clinic)
    SELECT id INTO v_patient_id
    FROM public.patients
    WHERE clinic_id = p_clinic_id AND phone = p_phone
    LIMIT 1;

    IF v_patient_id IS NULL THEN
        INSERT INTO public.patients (clinic_id, full_name, phone)
        VALUES (p_clinic_id, p_name, p_phone)
        RETURNING id INTO v_patient_id;
    END IF;

    -- 3. Get Service Duration
    SELECT duration_minutes INTO v_duration
    FROM public.services
    WHERE id = p_service_id;

    IF v_duration IS NULL THEN
        v_duration := 30; -- Default fallback
    END IF;

    v_end_time := p_start_time + (v_duration || ' minutes')::interval;

    -- 4. Create Appointment
    INSERT INTO public.appointments (clinic_id, patient_id, start_time, end_time, status, notes)
    VALUES (p_clinic_id, v_patient_id, p_start_time, v_end_time, 'scheduled', 'Agendamento Online')
    RETURNING id INTO v_appt_id;

    RETURN json_build_object('appointment_id', v_appt_id, 'patient_id', v_patient_id);
END;
$$;
