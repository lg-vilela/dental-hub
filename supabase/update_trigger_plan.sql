-- UPDATE TRIGGER TO ACCEPT PLAN
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Create a new Clinic
  -- Now checking for 'plan' in metadata (default to 'free' if missing)
  with new_clinic as (
    insert into public.clinics (name, plan)
    values (
      COALESCE(new.raw_user_meta_data->>'clinicName', 'Minha Clínica'),
      COALESCE(new.raw_user_meta_data->>'plan', 'free')
    )
    returning id
  )
  -- Create the Profile
  insert into public.profiles (id, clinic_id, role, email, full_name)
  select new.id, id, 'admin', new.email, new.raw_user_meta_data->>'name'
  from new_clinic;

  return new;
end;
$$ language plpgsql security definer;
