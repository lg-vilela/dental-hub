-- Create patient_odontograms table
CREATE TABLE public.patient_odontograms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL UNIQUE,
    teeth_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_by UUID REFERENCES auth.users(id)
);

-- RLS
ALTER TABLE public.patient_odontograms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view odontograms for their clinic"
    ON public.patient_odontograms FOR SELECT
    USING (clinic_id = public.get_my_clinic_id());

CREATE POLICY "Users can insert odontograms for their clinic"
    ON public.patient_odontograms FOR INSERT
    WITH CHECK (clinic_id = public.get_my_clinic_id());

CREATE POLICY "Users can update odontograms for their clinic"
    ON public.patient_odontograms FOR UPDATE
    USING (clinic_id = public.get_my_clinic_id());

CREATE POLICY "Users can delete odontograms for their clinic"
    ON public.patient_odontograms FOR DELETE
    USING (clinic_id = public.get_my_clinic_id());
