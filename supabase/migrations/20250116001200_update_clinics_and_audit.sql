-- Add settings columns to clinics table
ALTER TABLE public.clinics
ADD COLUMN IF NOT EXISTS opening_time text DEFAULT '08:00',
ADD COLUMN IF NOT EXISTS closing_time text DEFAULT '18:00',
ADD COLUMN IF NOT EXISTS slot_duration integer DEFAULT 30,
ADD COLUMN IF NOT EXISTS working_days integer[] DEFAULT '{1,2,3,4,5}'; -- Mon-Fri default

-- Create AUDIT LOGS table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    clinic_id uuid REFERENCES public.clinics(id) NOT NULL,
    user_id uuid REFERENCES public.profiles(id) NOT NULL,
    action text NOT NULL,
    details jsonb,
    ip_address text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for Audit Logs
-- Only view logs from own clinic
CREATE POLICY "Users can view audit logs from their clinic"
    ON public.audit_logs FOR SELECT
    USING ( clinic_id = public.get_my_clinic_id() );

-- Insert logs (usually done by backend/triggers, but allow authenticated users to log actions for now as we are client-side mostly)
CREATE POLICY "Users can insert audit logs for their clinic"
    ON public.audit_logs FOR INSERT
    WITH CHECK ( clinic_id = public.get_my_clinic_id() );
