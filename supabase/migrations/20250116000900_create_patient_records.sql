-- Create patient_evolutions table
CREATE TABLE public.patient_evolutions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'note', -- 'note', 'proc', 'pay'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS for evolutions
ALTER TABLE public.patient_evolutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view evolutions for their clinic"
    ON public.patient_evolutions FOR SELECT
    USING (clinic_id = public.get_my_clinic_id());

CREATE POLICY "Users can insert evolutions for their clinic"
    ON public.patient_evolutions FOR INSERT
    WITH CHECK (clinic_id = public.get_my_clinic_id());

CREATE POLICY "Users can delete evolutions for their clinic"
    ON public.patient_evolutions FOR DELETE
    USING (clinic_id = public.get_my_clinic_id());


-- Create patient_files table
CREATE TABLE public.patient_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL, -- S3 URL or similar
    type TEXT NOT NULL, -- e.g. 'application/pdf', 'image/png'
    size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for files
ALTER TABLE public.patient_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view files for their clinic"
    ON public.patient_files FOR SELECT
    USING (clinic_id = public.get_my_clinic_id());

CREATE POLICY "Users can insert files for their clinic"
    ON public.patient_files FOR INSERT
    WITH CHECK (clinic_id = public.get_my_clinic_id());

CREATE POLICY "Users can delete files for their clinic"
    ON public.patient_files FOR DELETE
    USING (clinic_id = public.get_my_clinic_id());
