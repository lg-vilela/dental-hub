-- 1. UPDATE TRIGGER FUNCTION
-- Modify to use the 'clinicName' from user metadata if provided.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Create a new Clinic (Use name from Metadata or Default)
  with new_clinic as (
    insert into public.clinics (name)
    values ( COALESCE(new.raw_user_meta_data->>'clinicName', 'Minha Clínica') )
    returning id
  )
  -- Create the Profile
  insert into public.profiles (id, clinic_id, role, email, full_name)
  select new.id, id, 'admin', new.email, new.raw_user_meta_data->>'name'
  from new_clinic;

  return new;
end;
$$ language plpgsql security definer;

-- 2. ENABLE UPDATE PERMISSIONS
-- Allow admins to update their own clinic (e.g. change name, branding)
create policy "Admins can update own clinic"
  on public.clinics for update
  using ( id = public.get_my_clinic_id() )
  with check ( id = public.get_my_clinic_id() );
