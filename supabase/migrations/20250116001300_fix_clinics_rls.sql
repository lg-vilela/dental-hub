-- Ensure helper function exists (Idempotent)
CREATE OR REPLACE FUNCTION public.get_my_clinic_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $function$
  select clinic_id from public.profiles where id = auth.uid() limit 1;
$function$;

-- Ensure RLS is enabled on clinics
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own clinic
DROP POLICY IF EXISTS "Users can view their own clinic" ON public.clinics;
CREATE POLICY "Users can view their own clinic"
ON public.clinics FOR SELECT
USING (id = public.get_my_clinic_id());

-- Allow users to update their own clinic permissions
DROP POLICY IF EXISTS "Users can update their own clinic" ON public.clinics;
CREATE POLICY "Users can update their own clinic"
ON public.clinics FOR UPDATE
USING (id = public.get_my_clinic_id());
