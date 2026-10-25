-- RAMCO · datos de ejemplo (OPCIONAL)
-- Pégalo en el SQL Editor de Supabase solo si quieres ver el panel con contenido
-- de prueba. Bórralo después con: delete from public.leads where source = 'demo';

insert into public.leads (company, contact_name, email, phone, industry, source, stage, estimated_value, notes)
values
  ('Panadería Los Robles', 'Camila Soto', 'contacto@losrobles.cl', '+56 9 1111 1111', 'Retail / alimentos', 'demo', 'contactado', 890000,
   'Necesita landing + pedidos por WhatsApp. Pidió propuesta para la primera semana.'),
  ('Clínica Dental Aurora', 'Dr. Ignacio Pérez', 'ignacio@dentalaurora.cl', '+56 9 2222 2222', 'Salud', 'demo', 'reunion', 1450000,
   'Reunión agendada. Interesa pack mensual de contenido + sitio de reservas.'),
  ('Constructora Andes', 'María José Rivas', 'mj.rivas@andes.cl', '+56 9 3333 3333', 'Construcción', 'demo', 'propuesta', 2600000,
   'Propuesta enviada: sitio corporativo + automatización de cotizaciones.'),
  ('Transportes Vega', 'Luis Vega', 'luis@transportesvega.cl', '+56 9 4444 4444', 'Logística', 'demo', 'nuevo', 650000,
   'Llegó por referencia. Hay que llamar esta semana.')
on conflict do nothing;

insert into public.projects (name, client_name, status, description, budget, start_date, due_date)
values
  ('Landing Panadería Los Robles', 'Panadería Los Robles', 'en_curso',
   'Landing con catálogo simple y botón de pedido por WhatsApp.', 890000,
   current_date - interval '10 days', current_date + interval '14 days'),
  ('Sitio corporativo Constructora Andes', 'Constructora Andes', 'planificacion',
   'Sitio 6 secciones + formulario de cotización conectado a correo.', 2600000,
   current_date + interval '7 days', current_date + interval '45 days')
on conflict do nothing;

insert into public.quotes (number, title, amount, status, valid_until, notes)
values
  ('COT-2026-001', 'Sitio web corporativo + automatización', 2600000, 'enviada',
   current_date + interval '15 days', 'Incluye hosting 1 año y capacitación de 2 horas.'),
  ('COT-2026-002', 'Pack marketing mensual (inicial)', 350000, 'borrador',
   current_date + interval '20 days', 'Contenido, redes y reporte mensual.')
on conflict (number) do nothing;

insert into public.tasks (title, status, priority, due_date)
values
  ('Llamar a Transportes Vega', 'pendiente', 'alta', current_date),
  ('Enviar propuesta final a Clínica Dental Aurora', 'pendiente', 'alta', current_date + interval '2 days'),
  ('Publicar 3 reels de la semana', 'pendiente', 'media', current_date + interval '3 days'),
  ('Revisar métricas de la landing de Los Robles', 'pendiente', 'baja', current_date + interval '7 days')
on conflict do nothing;
