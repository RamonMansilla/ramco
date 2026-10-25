import type { Metadata } from "next";
import Link from "next/link";
import "./planes.css";
import { SiteNav } from "@/components/landing/site-nav";
import { Cta } from "@/components/planes/piezas";
import { IconPhone, IconTarget, IconWindow } from "@/components/planes/iconos";
import { PlanesMarketing } from "@/components/planes/planes-marketing";
import { DesarrolloWeb } from "@/components/planes/desarrollo-web";
import { WordPress } from "@/components/planes/wordpress";
import { Apps } from "@/components/planes/apps";
import { Comparador } from "@/components/planes/comparador";
import { ModeloTrabajo } from "@/components/planes/modelo-trabajo";
import { Preguntas } from "@/components/planes/preguntas";
import { CORREO, MAILTO } from "@/lib/planes";

export const metadata: Metadata = {
  title: "Planes y precios",
  description:
    "Planes de pauta en Google Ads, Meta Ads y TikTok desde $150.000/mes; desarrollo web desde $280.000 con pago en 3 fases; apps iOS y Android; y reemplazo de WordPress/WooCommerce.",
  alternates: {
    canonical: "/planes",
  },
  openGraph: {
    title: "Planes y precios · RAMNCO",
    description:
      "Tres planes de marketing, desarrollo web por hitos, apps móviles y reemplazo de WordPress. Precios en pesos chilenos, con la inversión publicitaria siempre aparte.",
    locale: "es_CL",
    type: "website",
    url: "/planes",
  },
};

const ATAJOS = [
  {
    href: "#marketing",
    label: "Planes de marketing",
    detalle: "Desde $150.000/mes",
    Icon: IconTarget,
  },
  {
    href: "#desarrollo-web",
    label: "Desarrollo web",
    detalle: "Desde $280.000 · 3 fases",
    Icon: IconWindow,
  },
  {
    href: "#apps",
    label: "Apps iOS y Android",
    detalle: "Desarrollo, ASO y publicación",
    Icon: IconPhone,
  },
] as const;

export default function PlanesPage() {
  return (
    <div className="pl-page">
      <SiteNav />

      <main id="contenido" tabIndex={-1}>
        {/* Hero: qué es esta página y atajos a cada bloque. */}
        <section className="pl-hero" aria-labelledby="planes-title">
          <div className="pl-shell">
            <p className="pl-eyebrow">
              <span className="pl-eyebrow__dot" aria-hidden="true" />
              Planes y precios
            </p>

            <h1 className="pl-h1" id="planes-title">
              Elige cómo <em className="pl-accent">crecer</em>
            </h1>

            <p className="pl-hero__lead">
              Pauta digital, desarrollo web y apps para empresas en Chile. Precios claros,
              alcance por escrito y la inversión publicitaria siempre separada de los
              honorarios.
            </p>

            <div className="pl-hero__actions">
              <Cta label="Hablemos" />
              <a className="pl-btn pl-btn--ghost" href="#comparador">
                Ver el comparador
              </a>
            </div>

            <ul className="pl-shortcuts">
              {ATAJOS.map((atajo) => (
                <li key={atajo.href}>
                  <a className="pl-shortcut" href={atajo.href}>
                    <span className="pl-shortcut__icon" aria-hidden="true">
                      <atajo.Icon width={18} height={18} />
                    </span>
                    <span className="pl-shortcut__text">
                      <span className="pl-shortcut__label">{atajo.label}</span>
                      <span className="pl-shortcut__detail">{atajo.detalle}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Orden: A planes · B web · C WordPress · D apps · F comparador · E modelo · G FAQ */}
        <PlanesMarketing />
        <DesarrolloWeb />
        <WordPress />
        <Apps />
        <Comparador />
        <ModeloTrabajo />
        <Preguntas />
      </main>

      <footer className="pl-footer">
        <div className="pl-shell pl-footer__inner">
          <div className="pl-footer__brand">
            <p className="pl-footer__logo">RAMNCO</p>
            <p className="pl-footer__tagline">
              Publicidad estratégica · Desarrollo web y apps
            </p>
          </div>
          <div className="pl-footer__meta">
            <a className="pl-footer__mail" href={MAILTO}>
              {CORREO}
            </a>
            <Link className="pl-footer__link" href="/">
              Volver al inicio
            </Link>
            <Link className="pl-footer__link" href="/#contacto">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
