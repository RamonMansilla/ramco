# RAMNCO

**Asesoría de publicidad estratégica.** Estrategia, pauta y optimización en Google Ads y Meta Ads
para convertir inversión publicitaria en ventas medibles.

Sitio público + panel interno + base de datos, en un solo proyecto.

> **Contacto:** ramcochile@gmail.com · **Sitio:** pendiente de dominio (se publicará en Vercel)
> **Fuente de contenido:** `RAMNCO_presentacion_comercial_visual_final.pptx` (presentación comercial 2026).
> La landing se construye a partir de ese deck: mismo relato, mismos conceptos y misma estética
> (noche violácea, púrpura `#B052FF`, azul `#3D82FF`).

## Qué hay acá

| Parte | Ruta | Estado |
|---|---|---|
| Landing pública | `/` | Funcional, basada en la presentación comercial |
| Panel interno (CRM ligero) | `/admin` | Funcional: leads, proyectos, cotizaciones, tareas |
| Base de datos + login | Supabase | Creada y con RLS activo |
| Material comercial | `devting/` | Marca, oferta, guiones y playbooks |
| Scripts de arranque y sync | `scripts/` | Listos |

## Stack

- **Next.js 15** (App Router) + **TypeScript** + CSS propio → un solo despliegue para landing y panel.
- **Supabase** (Postgres + Auth + RLS) → base de datos y usuarios internos, plan gratuito.
- **Vercel** → hosting del sitio y del panel, plan gratuito.
- Tipografías con `next/font` (Sora para títulos, Inter para texto).
- Sin dependencias de UI externas: el diseño vive en `app/globals.css` y `app/landing.css`.

## Estructura del repositorio

```
app/
  page.tsx              landing pública (contenido de la presentación comercial)
  landing.css           estilos propios de la landing
  globals.css           sistema de diseño (paleta, tarjetas, tablas, botones)
  layout.tsx            layout raíz, fuentes y metadatos
  admin/
    login/              acceso del equipo
    (panel)/            panel interno protegido
      page.tsx          portada con KPIs del negocio
      leads/            prospectos y pipeline
      proyectos/        proyectos en ejecución
      cotizaciones/     propuestas y su estado
      tareas/           pendientes del equipo
      actions.ts        Server Actions del panel
components/
  landing/              piezas de la landing (nav, iconos, animaciones)
lib/
  supabase/             clientes de Supabase (servidor, navegador, middleware)
  auth.ts               guard de sesión (requireUser)
```

## Puesta en marcha

```powershell
npm install
Copy-Item .env.example .env.local   # y completa las dos variables
npm run dev                          # http://localhost:3000
```

Variables en `.env.local` (Supabase → **Project Settings → API**):

```
NEXT_PUBLIC_SUPABASE_URL=https://<proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
```

`.env.local` está en `.gitignore`: **nunca** se sube al repositorio.

## Panel interno

- Entra en `/admin` con el correo de la empresa y la contraseña definida al crear el usuario.
- **Crear usuarios:** Supabase → **Authentication → Users → Add user** (marca *Auto Confirm User*).
  Cualquier usuario autenticado entra al panel; los permisos se administran desde Supabase.
- Cada usuario nuevo obtiene su fila en `profiles` automáticamente (trigger `on_auth_user_created`).
- Nadie sin sesión puede leer ni escribir en la base: todas las tablas tienen **RLS** activo
  y solo permiten `authenticated`.

### Roles

`profiles.role`: `owner` · `admin` · `member`. Hoy todos tienen acceso completo;
cuando haga falta, se pueden separar permisos por rol en las políticas RLS.

## Base de datos

Tablas: `profiles`, `leads`, `interactions`, `projects`, `quotes`, `tasks`, `activity_log`.

- Esquema completo en `supabase/migrations/0001_init.sql`.
- Datos de ejemplo (opcional) en `supabase/seed.sql`.
- Para aplicar cambios: pega el SQL en el **SQL Editor** de Supabase, o usa la CLI
  (`supabase db push`) cuando esté configurada.
- El proyecto Supabase está en la región **us-west-2**. Si la latencia molesta en Chile,
  más adelante se puede migrar a `sa-east-1` (São Paulo).

## Ramas y scripts

| Rama | Para qué |
|---|---|
| `main` | Versión estable / publicada. `run-remote` siempre ejecuta esta. |
| `main-local` | Trabajo diario con tus cambios locales. `run-local` ejecuta esta. |

Flujo: trabajar en `main-local` → probar con `run-local` → subir con `sync` → fusionar a `main` cuando esté estable.

| Script | Qué hace |
|---|---|
| `scripts\setup-github.bat` | Guarda el token de GitHub (una vez por PC) |
| `scripts\run-local.bat` | Ejecuta la app con tus cambios locales (`main-local`) |
| `scripts\run-remote.bat` | Baja la última `main` desde GitHub y la ejecuta |
| `scripts\sync.bat` | Commit, rebase sobre el remoto y push |
| `publicar.bat` | Publica en Vercel (producción) ahora mismo |
| `scripts\setup-vercel.bat` | Guarda el token de Vercel (una vez por PC) |

`Start-RamcoApp.ps1` detecta el tipo de proyecto: con `package.json` instala dependencias y
corre `dev`/`start`; si no, abre la landing estática o ejecuta Python.

## Despliegue

**Sitio en producción:** <https://ramnco.vercel.app>

- Proyecto Vercel: `ramnco` (team `team_5cvkq3WIBH6KLfjnhddq9wvg`).
- Variables de entorno en Vercel: `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Publicar manualmente: doble clic en `publicar.bat`.
- Publicación automática: tarea programada de Windows **«RAMNCO - Publicar en Vercel»**, cada
  30 minutos; `scripts\deploy.ps1 -Latest` revisa si `main` avanzó y solo entonces publica.
  Se administra desde el Programador de tareas; se puede desactivar o borrar cuando quieras.
- Token de Vercel: guardado en `%USERPROFILE%\.ramnco-vercel-token`, **fuera** del repositorio.
  Si expira, vuelve a ejecutar `scripts\setup-vercel.bat`.

> La integración Git nativa de Vercel no se puede activar en esta cuenta porque entró con Google
> y Vercel exige conectar GitHub como método de login. Por eso la automatización vive en la tarea
> programada y en `deploy.ps1`.

## Colaboración

1. GitHub → repo → **Settings → Collaborators → Add people**.
2. Invitar por usuario con rol **Write** (push) o **Maintain** (además issues/PRs).
3. Cada persona acepta la invitación desde su correo o desde GitHub.
4. Regla: cada cambio grande va en su rama (`feature/nombre-corto`) y se abre Pull Request.
5. No subir credenciales, tokens ni `.env*`.

## Seguridad

- La `service_role` key de Supabase **no** se usa en la app; solo la `anon` (pública, limitada por RLS).
- Tokens de GitHub guardados en el Administrador de credenciales de Windows, no en el repo.
- Ante cualquier filtración: rotar token/contraseña en el proveedor y avisar.

## Contacto

- Correo: ramcochile@gmail.com
- Repositorio: <https://github.com/RamonMansilla/ramco>
- Owner: Ramon Mansilla
