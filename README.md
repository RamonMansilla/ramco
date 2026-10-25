# RAMCO

**Servicios digitales: marketing y desarrollo web.** Empresa chilena, equipo de 4 personas.
Sitio público + panel interno + base de datos, en un solo proyecto.

> **Contacto:** ramcochile@gmail.com · **Sitio:** pendiente de dominio (se publicará en Vercel)
> **Instagram / redes:** pendiente de definir

## Qué hay acá

| Parte | Ruta | Estado |
|---|---|---|
| Landing pública | `/` | En construcción |
| Panel interno (CRM ligero) | `/admin` | Funcional: leads, proyectos, cotizaciones, tareas |
| Base de datos + login | Supabase | Creada y con RLS activo |
| Material comercial DEVTING | `devting/` | Listo (marca, oferta, playbooks) |
| Scripts de arranque y sync | `scripts/` | Listos |

## Stack

- **Next.js 15** (App Router) + **TypeScript** + CSS propio → un solo despliegue para landing y panel.
- **Supabase** (Postgres + Auth + RLS) → base de datos y usuarios del equipo, plan gratuito.
- **Vercel** → hosting del sitio y del panel, plan gratuito.
- Sin dependencias de UI externas: el diseño vive en `app/globals.css`.

## Estructura del repositorio

```
app/
  page.tsx              landing pública
  landing.css           estilos propios de la landing
  globals.css           sistema de diseño (colores de marca, tarjetas, tablas, botones)
  layout.tsx            layout raíz y metadatos
  admin/
    login/              acceso del equipo
    (panel)/            panel interno protegido
      page.tsx          portada con KPIs del negocio
      leads/            prospectos y pipeline
      proyectos/        proyectos en ejecución
      cotizaciones/     propuestas y su estado
      tareas/           pendientes del equipo
      actions.ts        Server Actions del panel
lib/
  supabase/             clientes de Supabase (servidor, navegador, middleware)
  auth.ts               guard de sesión (requireUser)
  ui.ts                 tipos, etiquetas y formateadores compartidos
supabase/
  migrations/           esquema SQL (tablas, triggers, RLS)
  seed.sql              datos de ejemplo opcionales
devting/                marca, oferta, guiones y playbooks comerciales
scripts/                arranque local, remoto y sincronización con GitHub
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

- Entra en `/admin` con el correo de la empresa y la contraseña que se definió al crear el usuario.
- **Crear usuarios del equipo:** Supabase → **Authentication → Users → Add user** (marca *Auto Confirm User*).
  Cualquier usuario autenticado entra al panel; el equipo son 4 personas de confianza.
- Cada usuario nuevo obtiene su fila en `profiles` automáticamente (trigger `on_auth_user_created`).
- Nadie sin sesión puede leer ni escribir en la base: todas las tablas tienen **RLS** activo
  y solo permiten `authenticated`.

### Roles

`profiles.role`: `owner` (Ramon) · `admin` · `member`. Hoy todos tienen acceso completo;
cuando el equipo crezca se pueden separar permisos por rol en las políticas RLS.

## Base de datos

Tablas: `profiles`, `leads`, `interactions`, `projects`, `quotes`, `tasks`, `activity_log`.

- Esquema completo en `supabase/migrations/0001_init.sql`.
- Datos de ejemplo (opcional) en `supabase/seed.sql`.
- Para aplicar cambios: pega el SQL en el **SQL Editor** de Supabase, o usa la CLI
  (`supabase db push`) cuando esté configurada.
- El proyecto Supabase está en la región **us-west-2**. Si la latencia molesta al equipo
  en Chile, más adelante se puede migrar a `sa-east-1` (São Paulo).

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

`Start-RamcoApp.ps1` detecta el tipo de proyecto: con `package.json` instala dependencias y
corre `dev`/`start`; si no, abre la landing estática o ejecuta Python.

## Despliegue

1. Subir el repo a GitHub → **Vercel → Add New Project → Import** `RamonMansilla/ramco`.
2. Cargar las mismas dos variables de entorno en Vercel (Settings → Environment Variables).
3. Cada push a `main` publica automáticamente. Los push a `main-local` generan *preview*.

## Colaboración (equipo de 4)

1. GitHub → repo → **Settings → Collaborators → Add people**.
2. Invitar por usuario con rol **Write** (push) o **Maintain** (además issues/PRs).
3. Cada persona acepta la invitación desde su correo o desde GitHub.
4. Regla: cada cambio grande va en su rama (`feature/nombre-corto`) y se abre Pull Request.
5. No subir credenciales, tokens ni `.env*`.

## Seguridad

- La `service_role` key de Supabase **no** se usa en la app; solo la `anon` (pública, limitada por RLS).
- Tokens de GitHub guardados en el Administrador de credenciales de Windows, no en el repo.
- Ante cualquier filtración: rotar token/contraseña en el proveedor y avisar al equipo.

## Contacto

- Correo: ramcochile@gmail.com
- Repositorio: <https://github.com/RamonMansilla/ramco>
- Equipo: Ramon Mansilla (owner) + 3 integrantes por invitar
