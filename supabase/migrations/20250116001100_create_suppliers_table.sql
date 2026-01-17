-- Create suppliers table
CREATE TABLE public.suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    contact_name TEXT,
    phone TEXT,
    email TEXT,
    category TEXT DEFAULT 'Geral',
    tax_id TEXT, -- CNPJ/CPF
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view suppliers for their clinic"
    ON public.suppliers FOR SELECT
    USING (clinic_id = public.get_my_clinic_id());

CREATE POLICY "Users can insert suppliers for their clinic"
    ON public.suppliers FOR INSERT
    WITH CHECK (clinic_id = public.get_my_clinic_id());

CREATE POLICY "Users can update suppliers for their clinic"
    ON public.suppliers FOR UPDATE
    USING (clinic_id = public.get_my_clinic_id());

CREATE POLICY "Users can delete suppliers for their clinic"
    ON public.suppliers FOR DELETE
    USING (clinic_id = public.get_my_clinic_id());
