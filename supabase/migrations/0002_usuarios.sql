-- RAMNCO · invitar al equipo y administrar usuarios
--
-- Solo el dueño (profiles.is_owner = true) puede invitar, cambiar roles o
-- desactivar a otras personas del panel.

alter table public.profiles add column if not exists is_owner boolean not null default false;
alter table public.profiles add column if not exists disabled boolean not null default false;

update public.profiles set is_owner = true where role = 'owner';

-- ------------------------------------------------------------- helper dueño
create or replace function public.es_dueno()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select is_owner from public.profiles where id = auth.uid()), false);
$$;

-- ------------------------------------------------------------- policies
drop policy if exists team_all on public.profiles;
drop policy if exists perfiles_ver on public.profiles;
drop policy if exists perfiles_editar_propio on public.profiles;

create policy perfiles_ver on public.profiles
  for select to authenticated using (true);

create policy perfiles_editar_propio on public.profiles
  for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- ------------------------------------------------------------- invitaciones
create table if not exists public.invitations (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  full_name  text,
  role       text not null default 'member' check (role in ('admin', 'member')),
  status     text not null default 'pendiente'
               check (status in ('pendiente', 'enviada', 'aceptada', 'cancelada')),
  invited_by uuid references public.profiles (id) on delete set null,
  sent_at    timestamptz,
  created_at timestamptz not null default now(),
  unique (email)
);

alter table public.invitations enable row level security;

drop policy if exists invitaciones_dueno on public.invitations;
create policy invitaciones_dueno on public.invitations
  for all to authenticated
  using (public.es_dueno())
  with check (public.es_dueno());

-- ------------------------------------------------------------- auto-perfil
-- Refuerzo: cuando alguien se registra, su perfil nace como miembro normal.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, is_owner)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    'member',
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
