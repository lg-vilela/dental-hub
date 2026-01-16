-- Create inventory_items table
CREATE TABLE public.inventory_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 5,
    unit TEXT DEFAULT 'Unidades',
    cost DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view inventory items for their clinic"
    ON public.inventory_items FOR SELECT
    USING (clinic_id = public.get_my_clinic_id());

CREATE POLICY "Users can insert inventory items for their clinic"
    ON public.inventory_items FOR INSERT
    WITH CHECK (clinic_id = public.get_my_clinic_id());

CREATE POLICY "Users can update inventory items for their clinic"
    ON public.inventory_items FOR UPDATE
    USING (clinic_id = public.get_my_clinic_id());

CREATE POLICY "Users can delete inventory items for their clinic"
    ON public.inventory_items FOR DELETE
    USING (clinic_id = public.get_my_clinic_id());
