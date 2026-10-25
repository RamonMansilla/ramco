import Link from "next/link";
import { ThemePicker } from "@/components/theme-picker";
import { IconClose, IconMenu } from "@/components/landing/icons";

export const CORREO = "ramcochile@gmail.com";

export const MAILTO = `mailto:${CORREO}`;

const PAGINAS = [
  { href: "/servicios", label: "Servicios" },
  { href: "/planes", label: "Planes" },
] as const;

const SECCIONES = [
  { href: "/#desafio", label: "Desafío" },
  { href: "/#proyeccion", label: "Proyección" },
  { href: "/#metodo", label: "Método" },
  { href: "/#medicion", label: "Medición" },
] as const;

/**
 * Navegación global (se usa en todas las páginas públicas).
 * Server Component: el menú móvil es un `<details>` nativo, sin JavaScript.
 */
export function SiteNav() {
  return (
    <header className="lp-header">
      <a className="lp-skip" href="#contenido">
        Saltar al contenido
      </a>

      <div className="lp-shell lp-header__inner">
        <Link className="lp-brand" href="/" aria-label="RAMNCO Asesores, ir al inicio">
          <span className="lp-brand__mark" aria-hidden="true">
            R
          </span>
          <span className="lp-brand__word">
            RAMNCO
            <span className="lp-brand__sub">ASESORES</span>
          </span>
        </Link>

        <nav className="lp-nav" aria-label="Navegación principal">
          {PAGINAS.map((link) => (
            <Link key={link.href} className="lp-nav__link" href={link.href}>
              {link.label}
              <span className="lp-nav__line" aria-hidden="true" />
            </Link>
          ))}
          {SECCIONES.map((link) => (
            <a key={link.href} className="lp-nav__link" href={link.href}>
              {link.label}
              <span className="lp-nav__line" aria-hidden="true" />
            </a>
          ))}
        </nav>

        <div className="lp-header__actions">
          <ThemePicker compacto />

          <a className="lp-btn lp-btn--ghost lp-btn--sm lp-header__cta" href={MAILTO}>
            Hablemos
          </a>

          <details className="lp-menu">
            <summary className="lp-menu__toggle">
              <span className="sr-only">Abrir menú de navegación</span>
              <IconMenu className="lp-menu__icon lp-menu__icon--open" width={20} height={20} />
              <IconClose className="lp-menu__icon lp-menu__icon--close" width={20} height={20} />
            </summary>

            <nav className="lp-menu__panel" aria-label="Navegación móvil">
              {PAGINAS.map((link) => (
                <Link key={link.href} className="lp-menu__link" href={link.href}>
                  {link.label}
                </Link>
              ))}
              {SECCIONES.map((link) => (
                <a key={link.href} className="lp-menu__link" href={link.href}>
                  {link.label}
                </a>
              ))}
              <a className="lp-btn lp-btn--primary lp-menu__cta" href={MAILTO}>
                Hablemos
              </a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
