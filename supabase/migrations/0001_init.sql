-- RAMCO - esquema inicial
-- Ejecutar con: supabase db push   (o pegar en el SQL Editor del dashboard)

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- perfiles
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text not null default '',
  role       text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- leads
create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  company         text not null,
  contact_name    text,
  email           text,
  phone           text,
  website         text,
  industry        text,
  source          text default 'manual',
  stage           text not null default 'nuevo'
                    check (stage in ('nuevo', 'contactado', 'reunion', 'propuesta', 'negociacion', 'ganado', 'perdido')),
  estimated_value numeric(12, 2),
  owner_id        uuid references public.profiles (id) on delete set null,
  notes           text,
  last_contact_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists leads_stage_idx on public.leads (stage);
create index if not exists leads_owner_idx on public.leads (owner_id);
create index if not exists leads_created_idx on public.leads (created_at desc);

-- ---------------------------------------------------------------- interacciones
create table if not exists public.interactions (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references public.leads (id) on delete cascade,
  kind        text not null default 'nota'
                check (kind in ('email', 'llamada', 'reunion', 'whatsapp', 'nota')),
  subject     text,
  body        text,
  happened_at timestamptz not null default now(),
  author_id   uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);
create index if not exists interactions_lead_idx on public.interactions (lead_id, happened_at desc);

-- ---------------------------------------------------------------- proyectos
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references public.leads (id) on delete set null,
  name        text not null,
  client_name text not null,
  status      text not null default 'planificacion'
                check (status in ('planificacion', 'en_curso', 'pausado', 'entregado', 'cancelado')),
  description text,
  budget      numeric(12, 2),
  start_date  date,
  due_date    date,
  repo_url    text,
  deploy_url  text,
  owner_id    uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists projects_status_idx on public.projects (status);

-- ---------------------------------------------------------------- cotizaciones
create table if not exists public.quotes (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references public.leads (id) on delete set null,
  number      text unique,
  title       text not null,
  amount      numeric(12, 2) not null default 0,
  currency    text not null default 'CLP',
  status      text not null default 'borrador'
                check (status in ('borrador', 'enviada', 'aceptada', 'rechazada')),
  valid_until date,
  sent_at     timestamptz,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists quotes_status_idx on public.quotes (status);

-- ---------------------------------------------------------------- tareas
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  status      text not null default 'pendiente'
                check (status in ('pendiente', 'en_curso', 'hecha')),
  priority    text not null default 'media'
                check (priority in ('baja', 'media', 'alta')),
  due_date    date,
  project_id  uuid references public.projects (id) on delete cascade,
  lead_id     uuid references public.leads (id) on delete cascade,
  assignee_id uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists tasks_status_idx on public.tasks (status, due_date);

-- ---------------------------------------------------------------- bitacora
create table if not exists public.activity_log (
  id         bigserial primary key,
  actor_id   uuid references public.profiles (id) on delete set null,
  entity     text not null,
  entity_id  uuid,
  action     text not null,
  details    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists activity_log_created_idx on public.activity_log (created_at desc);

-- ---------------------------------------------------------------- updated_at
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['leads', 'projects', 'quotes']
  loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format(
      'create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at()', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------- perfil automático
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    'member'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------- RLS
-- El equipo es de 4 personas: cualquier usuario autenticado es miembro interno.
alter table public.profiles      enable row level security;
alter table public.leads         enable row level security;
alter table public.interactions  enable row level security;
alter table public.projects      enable row level security;
alter table public.quotes        enable row level security;
alter table public.tasks         enable row level security;
alter table public.activity_log  enable row level security;

do $$
declare t text;
begin
  foreach t in array array['profiles', 'leads', 'interactions', 'projects', 'quotes', 'tasks', 'activity_log']
  loop
    execute format('drop policy if exists team_all on public.%I', t);
    execute format(
      'create policy team_all on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end;
$$;
