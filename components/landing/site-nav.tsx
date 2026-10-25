import Link from "next/link";
import { IconClose, IconMenu } from "./icons";

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#proceso", label: "Cómo trabajamos" },
  { href: "#planes", label: "Planes" },
  { href: "#porque", label: "Por qué RAMCO" },
] as const;

export const CORREO = "ramcochile@gmail.com";

export const MAILTO = `mailto:${CORREO}?subject=${encodeURIComponent(
  "Quiero una propuesta de RAMCO",
)}`;

export function SiteNav() {
  return (
    <header className="lp-header">
      <a className="lp-skip" href="#contenido">
        Saltar al contenido
      </a>

      <div className="container">
        <div className="landing-nav lp-header__bar">
          <a className="lp-logo" href="#inicio" aria-label="RAMCO, volver al inicio">
            <span className="lp-logo__mark" aria-hidden="true">
              R
            </span>
            <span className="lp-logo__word">RAMCO</span>
          </a>

          <nav className="landing-nav__links lp-header__links" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="lp-header__actions">
            <Link className="lp-header__panel" href="/admin">
              Panel
            </Link>
            <a className="btn btn--primary btn--sm" href={MAILTO}>
              Hablemos
            </a>
          </div>

          {/* Menú móvil sin JavaScript: <details> nativo */}
          <details className="lp-menu">
            <summary className="lp-menu__toggle">
              <span className="sr-only">Abrir menú de navegación</span>
              <IconMenu className="lp-menu__icon lp-menu__icon--open" />
              <IconClose className="lp-menu__icon lp-menu__icon--closed" />
            </summary>
            <nav className="lp-menu__panel" aria-label="Navegación móvil">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
              <a className="lp-menu__cta btn btn--primary" href={MAILTO}>
                Hablemos
              </a>
              <Link className="lp-menu__panel-link" href="/admin">
                Panel
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
