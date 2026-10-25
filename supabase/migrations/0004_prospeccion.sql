-- RAMNCO · prospección: plantillas de correo y envíos

create table if not exists public.prospect_templates (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  canal       text not null default 'email' check (canal in ('email', 'whatsapp', 'instagram', 'llamada')),
  asunto      text,
  cuerpo      text not null,
  activo      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.prospect_outreach (
  id            uuid primary key default gen_random_uuid(),
  lead_id       uuid references public.leads (id) on delete cascade,
  template_id   uuid references public.prospect_templates (id) on delete set null,
  canal         text not null default 'email' check (canal in ('email', 'whatsapp', 'instagram', 'llamada')),
  destinatario  text not null,
  asunto        text,
  cuerpo        text,
  estado        text not null default 'borrador'
                  check (estado in ('borrador', 'enviado', 'respondio', 'rebotado', 'descartado')),
  intento       int not null default 1,
  error         text,
  enviado_at    timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists prospect_outreach_estado_idx
  on public.prospect_outreach (estado, created_at desc);
create index if not exists prospect_outreach_lead_idx
  on public.prospect_outreach (lead_id);

alter table public.prospect_templates enable row level security;
alter table public.prospect_outreach  enable row level security;

do $$
declare t text;
begin
  foreach t in array array['prospect_templates', 'prospect_outreach']
  loop
    execute format('drop policy if exists team_all on public.%I', t);
    execute format('create policy team_all on public.%I for all to authenticated using (true) with check (true)', t);
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format('create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at()', t);
  end loop;
end;
$$;

insert into public.prospect_templates (nombre, canal, asunto, cuerpo)
select 'Web lenta o sin web', 'email', '{{empresa}}: una cosa que vi en su sitio',
       'Hola {{nombre}}:

Estuve mirando el sitio de {{empresa}} y hay algo que se puede mejorar rápido: la página demora en cargar en el celular, y eso hace que la gente se vaya antes de leerla.

Soy de RAMNCO. Trabajamos con empresas chilenas en dejar el sitio rápido, claro y con un botón directo a WhatsApp para que las visitas se conviertan en consultas.

¿Le sirve que le mande 3 mejoras concretas, sin compromiso?'
where not exists (select 1 from public.prospect_templates);
