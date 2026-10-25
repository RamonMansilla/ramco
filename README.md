# RAMCO

Empresa de servicios digitales: **marketing** y **desarrollo**.

> Pendiente de completar: descripción de la empresa, sitio web y contacto.

## Contenido del repositorio

| Carpeta | Qué contiene |
|---|---|
| `devting/` | Marca DEVTING: identidad, landing, oferta comercial y playbooks de venta |
| `scripts/` | Scripts para ejecutar y sincronizar el proyecto |

### Dentro de `devting/`

| Archivo | Contenido |
|---|---|
| `brand/` | Guía de marca y logotipo |
| `landing/` | Landing page (HTML) |
| `oferta-y-precios.md` | Servicios y precios sugeridos |
| `primer-cliente-playbook.md` | Ruta para conseguir el primer cliente |
| `mensajes-de-venta.md` | Guiones de contacto y seguimiento |
| `checklist-lanzamiento.md` | Pendientes de lanzamiento |
| `propuesta-comercial.md` | Plantilla de propuesta |
| `calendario-contenido-14-dias.md` | Calendario de contenidos |
| `prospectos.csv` | Lista de prospección (estado y seguimiento) |

## Ramas

| Rama | Para qué |
|---|---|
| `main` | Versión estable / publicada. `run-remote` siempre ejecuta esta. |
| `main-local` | Trabajo diario con tus cambios locales. `run-local` ejecuta esta. |

Flujo recomendado: trabajar en `main-local` → probar con `run-local` → subir con `sync`
→ cuando esté estable, fusionar a `main`.

## Scripts

Todos están en `scripts/` y se usan con **doble clic**.

| Script | Qué hace |
|---|---|
| `setup-github.bat` | Guarda tu token de GitHub para poder subir cambios (una vez por equipo/PC) |
| `run-local.bat` | Ejecuta la app con **tus cambios locales**, en la rama `main-local` |
| `run-remote.bat` | Descarga la última versión de `main` desde GitHub y la ejecuta |
| `sync.bat` | Hace commit de tus cambios, los rebasa sobre el remoto y los sube |

`Start-RamcoApp.ps1` es interno: detecta qué tipo de proyecto es y lo levanta.

- Si hay `package.json` → instala dependencias si faltan y ejecuta `dev`/`start`.
- Si hay `devting/landing/index.html` → lo abre en el navegador.
- Si hay `app.py` / `main.py` → lo ejecuta con Python.

## Primer uso

1. Doble clic en `scripts\setup-github.bat` y pega un token de
   <https://github.com/settings/tokens/new> con scopes **`repo`** y **`read:org`**.
2. Doble clic en `scripts\run-local.bat`.
3. Para publicar cambios: `scripts\sync.bat`.

## Colaboración

Para invitar a otros desarrolladores:

1. Entrar a **Settings → Collaborators → Add people** del repositorio.
2. Invitar por usuario de GitHub y asignar rol **Write** (puede hacer push) o
   **Maintain** (además administra issues y PRs).
3. Cada persona debe aceptar la invitación desde su correo o desde GitHub.

Buenas prácticas para el equipo:

- Cada dev trabaja en su propia rama (`feature/nombre-corto`) y abre un Pull Request.
- `main` solo recibe cambios revisados.
- No subir credenciales ni archivos `.env` (ya están en `.gitignore`).

## Contacto

_(completar: correo, teléfono, sitio web)_
