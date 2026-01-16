-- Add Plan and Status to Clinics
ALTER TABLE public.clinics
ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'active';

-- Valid values check constraints (optional but good)
ALTER TABLE public.clinics
DROP CONSTRAINT IF EXISTS clinics_plan_check;
ALTER TABLE public.clinics
ADD CONSTRAINT clinics_plan_check CHECK (plan IN ('free', 'pro', 'plus'));

-- Update existing rows to free if needed (default handles new ones)
-- UPDATE public.clinics SET plan = 'free' WHERE plan IS NULL;
