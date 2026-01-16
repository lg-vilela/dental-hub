-- Update function to handle Invites
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_clinic_id uuid;
  v_role text;
BEGIN
  -- Check if user has an improved invitation in metadata
  IF new.raw_user_meta_data->>'invite_clinic_id' IS NOT NULL THEN
    v_clinic_id := (new.raw_user_meta_data->>'invite_clinic_id')::uuid;
    v_role := COALESCE(new.raw_user_meta_data->>'invite_role', 'dentist');
    
    -- Insert Profile linked to EXISTING clinic
    INSERT INTO public.profiles (id, clinic_id, role, full_name, email)
    VALUES (
      new.id, 
      v_clinic_id, 
      v_role, 
      COALESCE(new.raw_user_meta_data->>'full_name', 'Novo Membro'),
      new.email
    );
    
  ELSE
    -- Default flow: Create NEW Clinic
    INSERT INTO public.clinics (name)
    VALUES ('Consultório de ' || COALESCE(new.raw_user_meta_data->>'full_name', 'Novo Usuário'))
    RETURNING id INTO v_clinic_id;

    -- Insert Admin Profile
    INSERT INTO public.profiles (id, clinic_id, role, full_name, email)
    VALUES (
      new.id, 
      v_clinic_id, 
      'admin', 
      COALESCE(new.raw_user_meta_data->>'full_name', 'Dr. ' || new.email),
      new.email
    );
  END IF;

  RETURN new;
END;
$function$;
