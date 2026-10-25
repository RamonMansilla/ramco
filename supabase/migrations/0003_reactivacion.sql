-- RAMNCO · campañas de reactivación de clientes sobre carteras antiguas
-- Tablas para gestionar la recuperación de clientes inactivos desde el panel.

create table if not exists public.reactivation_campaigns (
  id             uuid primary key default gen_random_uuid(),
  nombre         text not null,
  origen         text not null default 'cartera_antigua'
                   check (origen in ('cartera_antigua', 'base_propia', 'ventas_perdidas', 'cotizaciones', 'otro')),
  estado         text not null default 'borrador'
                   check (estado in ('borrador', 'en_curso', 'pausada', 'terminada')),
  inactivos_desde_meses int not null default 6,
  oferta         text,
  canal_principal text default 'whatsapp'
                   check (canal_principal in ('whatsapp', 'email', 'llamada', 'instagram', 'mixto')),
  meta_contactos int default 0,
  fecha_inicio   date,
  fecha_fin      date,
  responsable_id uuid references public.profiles (id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists reactivacion_estado_idx on public.reactivation_campaigns (estado);

create table if not exists public.reactivation_contacts (
  id              uuid primary key default gen_random_uuid(),
  campaign_id     uuid not null references public.reactivation_campaigns (id) on delete cascade,
  nombre          text,
  empresa         text,
  telefono        text,
  email           text,
  estado          text not null default 'pendiente'
                    check (estado in ('pendiente', 'contactado', 'respondio', 'cotizado', 'recuperado', 'descartado')),
  ultimo_contacto timestamptz,
  notas           text,
  valor_recuperado numeric(12, 2),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists reactivacion_contactos_campaign_idx
  on public.reactivation_contacts (campaign_id, estado);

alter table public.reactivation_campaigns enable row level security;
alter table public.reactivation_contacts  enable row level security;

do $$
declare t text;
begin
  foreach t in array array['reactivation_campaigns', 'reactivation_contacts']
  loop
    execute format('drop policy if exists team_all on public.%I', t);
    execute format(
      'create policy team_all on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['reactivation_campaigns', 'reactivation_contacts']
  loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format(
      'create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at()', t);
  end loop;
end;
$$;
