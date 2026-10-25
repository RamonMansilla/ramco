import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./landing.css";
import { MAILTO, CORREO, SiteNav } from "@/components/landing/site-nav";
import { ScrollReveal } from "@/components/landing/reveal";
import {
  IconArrowDown,
  IconArrowRight,
  IconAudience,
  IconChart,
  IconClipboard,
  IconCompass,
  IconEye,
  IconGauge,
  IconLayers,
  IconMail,
  IconRefresh,
  IconSearch,
  IconTarget,
  IconUserPlus,
  IconWallet,
} from "@/components/landing/icons";

export const metadata: Metadata = {
  title: { absolute: "RAMNCO · Publicidad que convierte en ventas" },
  description:
    "RAMNCO es una asesoría de publicidad estratégica en Chile: estrategia, pauta y optimización en Google Ads y Meta Ads, con reportes claros y control real de la inversión.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RAMNCO · Publicidad que convierte en ventas",
    description:
      "Estrategia, pauta y optimización para hacer crecer tu negocio. Google Ads + Meta Ads con reportes claros y métricas que puedes ver.",
    locale: "es_CL",
    type: "website",
  },
};

/* ------------------------------------------------------------------ datos */

const KEYWORDS = ["Google Ads", "Meta Ads", "Performance", "Conversión", "Datos"] as const;

const DESAFIOS = [
  {
    num: "01",
    tag: "VISIBILIDAD",
    icon: IconEye,
    titulo: "Alcance sin intención",
    texto: "Llegas a personas que no buscan tu solución.",
  },
  {
    num: "02",
    tag: "INVERSIÓN",
    icon: IconWallet,
    titulo: "Presupuesto sin control",
    texto: "No sabes qué anuncios generan oportunidades.",
  },
  {
    num: "03",
    tag: "EJECUCIÓN",
    icon: IconGauge,
    titulo: "Decisiones tardías",
    texto: "Sin medición, optimizar toma demasiado tiempo.",
  },
] as const;

const PASOS = [
  {
    num: "01",
    icon: IconCompass,
    titulo: "Estrategia",
    texto: "Objetivos, oferta y audiencia.",
  },
  {
    num: "02",
    icon: IconLayers,
    titulo: "Campañas",
    texto: "Google Ads y Meta Ads.",
  },
  {
    num: "03",
    icon: IconRefresh,
    titulo: "Mejora",
    texto: "Revisión constante de datos.",
  },
] as const;

const CANALES = [
  {
    nombre: "GOOGLE ADS",
    claim: "Captura demanda activa",
    texto:
      "Aparece cuando tus clientes buscan productos o servicios como los tuyos.",
    icon: IconSearch,
    modifier: "lp-channel--google",
  },
  {
    nombre: "META ADS",
    claim: "Genera demanda",
    texto:
      "Llega a audiencias relevantes con anuncios visuales y segmentados.",
    icon: IconAudience,
    modifier: "lp-channel--meta",
  },
] as const;

const FASES = [
  {
    etiqueta: "FASE 1",
    indice: "1",
    titulo: "Diseño de estrategia",
    texto: "Definimos objetivos, público y propuesta comercial.",
  },
  {
    etiqueta: "FASE 2",
    indice: "2",
    titulo: "Implementación",
    texto: "Creamos campañas, anuncios y medición.",
  },
  {
    etiqueta: "FASE 3",
    indice: "3",
    titulo: "Optimización",
    texto: "Revisamos resultados y ajustamos la inversión.",
  },
] as const;

const METRICAS = [
  {
    num: "1",
    titulo: "Leads",
    texto: "Oportunidades generadas",
  },
  {
    num: "2",
    titulo: "Conversión",
    texto: "Rendimiento por campaña",
  },
  {
    num: "3",
    titulo: "Inversión",
    texto: "Control por canal",
  },
] as const;

const PANEL_METRICAS = [
  { label: "Leads", icon: IconUserPlus },
  { label: "Conversión", icon: IconTarget },
  { label: "Inversión", icon: IconChart },
] as const;

/* ----------------------------------------------------------- piezas locales */

function SectionHead({
  index,
  label,
  title,
  lead,
  titleId,
}: {
  index: string;
  label: string;
  title: ReactNode;
  lead?: string;
  titleId: string;
}) {
  return (
    <header className="lp-sec__head" data-reveal data-delay="0">
      <div className="lp-sec__intro">
        <p className="lp-kicker">
          <span className="lp-kicker__num">{index}</span>
          <span className="lp-kicker__sep" aria-hidden="true">
            /
          </span>
          <span className="lp-kicker__label">{label}</span>
        </p>
        <h2 className="lp-h2" id={titleId}>
          {title}
        </h2>
      </div>
      {lead ? <p className="lp-sec__lead">{lead}</p> : null}
    </header>
  );
}

/* ---------------------------------------------------------------- página */

export default function HomePage() {
  return (
    <div className="lp-page">
      <SiteNav />
      <ScrollReveal />

      <main id="contenido" tabIndex={-1}>
        {/* ------------------------------------------------------------ hero */}
        <section className="lp-hero" id="inicio" aria-labelledby="hero-title">
          <div className="lp-hero__bg" aria-hidden="true">
            <span className="lp-blob lp-blob--a" />
            <span className="lp-blob lp-blob--b" />
            <span className="lp-blob lp-blob--c" />
            <span className="lp-hero__grid" />
            <span className="lp-hero__noise" />
          </div>

          <div className="lp-shell lp-hero__inner">
            <div className="lp-hero__copy">
              <p className="lp-eyebrow">
                <span className="lp-eyebrow__dot" aria-hidden="true" />
                PUBLICIDAD ESTRATÉGICA · 2026
              </p>

              <h1 className="lp-h1" id="hero-title">
                Publicidad que{" "}
                <span className="lp-grad lp-grad--live">convierte en ventas</span>
              </h1>

              <p className="lp-hero__lead">
                Estrategia, pauta y optimización para hacer crecer tu negocio.
              </p>

              <div className="lp-hero__actions">
                <a className="lp-btn lp-btn--primary" href={MAILTO}>
                  Agenda tu diagnóstico
                  <IconArrowRight width={18} height={18} />
                </a>
                <a className="lp-btn lp-btn--ghost" href="#metodo">
                  Ver el método
                  <IconArrowDown width={18} height={18} />
                </a>
              </div>

              <p className="lp-hero__meta">
                <span>Google Ads</span>
                <span className="lp-hero__meta-sep" aria-hidden="true">
                  ·
                </span>
                <span>Meta Ads</span>
                <span className="lp-hero__meta-sep" aria-hidden="true">
                  ·
                </span>
                <span>Reportes claros</span>
              </p>
            </div>

            <div className="lp-hero__panel">
              <aside className="lp-panel" aria-label="Panel de campaña de ejemplo">
                <div className="lp-panel__bar">
                  <span className="lp-panel__brand">RAMNCO / CRECIMIENTO DIGITAL</span>
                  <span className="lp-panel__flag">EJEMPLO</span>
                </div>

                <div className="lp-panel__head">
                  <p className="lp-panel__title">Panel de campaña</p>
                  <span className="lp-panel__live">
                    <span className="lp-dot" aria-hidden="true" />
                    Vista de ejemplo
                  </span>
                </div>

                <ul className="lp-panel__metrics">
                  {PANEL_METRICAS.map((metrica) => {
                    const Icon = metrica.icon;
                    return (
                      <li className="lp-panel__metric" key={metrica.label}>
                        <span className="lp-panel__metric-name">
                          <Icon width={15} height={15} />
                          {metrica.label}
                        </span>
                        <span className="lp-panel__track" aria-hidden="true">
                          <span className="lp-panel__fill" />
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <ul className="lp-panel__chips">
                  <li>Google Ads</li>
                  <li>Meta Ads</li>
                </ul>

                <p className="lp-panel__note">Esquema de ejemplo. Sin cifras reales.</p>
              </aside>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- marquee */}
        <div className="lp-marquee" aria-hidden="true">
          <div className="lp-marquee__track">
            {[0, 1].map((copy) => (
              <div className="lp-marquee__group" key={copy}>
                {KEYWORDS.map((keyword) => (
                  <span className="lp-marquee__item" key={`${copy}-${keyword}`}>
                    {keyword}
                    <span className="lp-marquee__spark">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------ 02 desafío */}
        <section className="lp-sec" id="desafio" aria-labelledby="desafio-title">
          <div className="lp-shell">
            <SectionHead
              index="02"
              label="EL DESAFÍO"
              title="Crecer sin desperdiciar presupuesto"
              lead="La pauta sin una estrategia clara suele generar tráfico, pero no ventas."
              titleId="desafio-title"
            />

            <div className="lp-grid lp-grid--3">
              {DESAFIOS.map((desafio, index) => {
                const Icon = desafio.icon;
                return (
                  <article
                    className="lp-card lp-challenge"
                    key={desafio.tag}
                    data-reveal
                    data-delay={index}
                  >
                    <div className="lp-challenge__top">
                      <span className="lp-challenge__tag">
                        <span className="lp-challenge__num">{desafio.num}</span>
                        <span aria-hidden="true">·</span>
                        {desafio.tag}
                      </span>
                      <span className="lp-card__icon">
                        <Icon width={20} height={20} />
                      </span>
                    </div>
                    <h3>{desafio.titulo}</h3>
                    <p>{desafio.texto}</p>
                  </article>
                );
              })}
            </div>

            <div className="lp-close" data-reveal>
              <p className="lp-close__text">
                RAMNCO convierte inversión publicitaria en una{" "}
                <em>operación medible</em>.
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- 03 método */}
        <section
          className="lp-sec lp-sec--band"
          id="metodo"
          aria-labelledby="metodo-title"
        >
          <div className="lp-shell">
            <SectionHead
              index="03"
              label="MÉTODO"
              title="Cómo atraemos clientes"
              lead="Conectamos la intención de búsqueda con campañas que generan demanda."
              titleId="metodo-title"
            />

            <ol className="lp-timeline">
              {PASOS.map((paso, index) => {
                const Icon = paso.icon;
                return (
                  <li
                    className="lp-timeline__item"
                    key={paso.num}
                    data-reveal
                    data-delay={index}
                  >
                    <span className="lp-timeline__node" aria-hidden="true">
                      {paso.num}
                    </span>
                    <div className="lp-timeline__body">
                      <span className="lp-timeline__icon">
                        <Icon width={18} height={18} />
                      </span>
                      <h3>{paso.titulo}</h3>
                      <p>{paso.texto}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="lp-close" data-reveal>
              <p className="lp-close__text">
                Más control sobre <em>cada peso invertido</em>.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- 04 canales */}
        <section className="lp-sec" id="canales" aria-labelledby="canales-title">
          <div className="lp-shell">
            <SectionHead
              index="04"
              label="CANALES"
              title={
                <>
                  Google Ads <span className="lp-plus">+</span> Meta Ads
                </>
              }
              lead="Dos canales, una misma estrategia comercial."
              titleId="canales-title"
            />

            <div className="lp-canales">
              {CANALES.map((canal) => {
                const Icon = canal.icon;
                return (
                  <article
                    className={`lp-card lp-channel ${canal.modifier}`}
                    key={canal.nombre}
                    data-reveal
                  >
                    <header className="lp-channel__head">
                      <span className="lp-channel__icon">
                        <Icon width={22} height={22} />
                      </span>
                      <h3 className="lp-channel__name">{canal.nombre}</h3>
                    </header>
                    <p className="lp-channel__claim">{canal.claim}</p>
                    <p className="lp-channel__text">{canal.texto}</p>
                  </article>
                );
              })}
              <span className="lp-canales__join" aria-hidden="true">
                +
              </span>
            </div>

            <div className="lp-close lp-close--sm" data-reveal>
              <p className="lp-close__text">
                La combinación permite atraer, convertir y volver a impactar a tus
                potenciales clientes.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ 05 asesoría */}
        <section
          className="lp-sec lp-sec--band"
          id="asesoria"
          aria-labelledby="asesoria-title"
        >
          <div className="lp-shell">
            <SectionHead
              index="05"
              label="ASESORÍA RAMNCO"
              title={
                <>
                  Servicio integral <span className="lp-grad">360°</span>
                </>
              }
              titleId="asesoria-title"
            />

            <div className="lp-phases">
              {FASES.map((fase, index) => (
                <article
                  className="lp-card lp-phase"
                  key={fase.etiqueta}
                  data-reveal
                  data-delay={index}
                >
                  <span className="lp-phase__index" aria-hidden="true">
                    {fase.indice}
                  </span>
                  <span className="lp-phase__label">{fase.etiqueta}</span>
                  <h3>{fase.titulo}</h3>
                  <p>{fase.texto}</p>
                </article>
              ))}
            </div>

            <div className="lp-phases__footer">
              <div className="lp-close" data-reveal>
                <p className="lp-close__text">
                  Una sola asesoría para administrar y mejorar toda tu pauta digital.
                </p>
              </div>
              <p className="lp-note" data-reveal>
                Acompañamiento desde la planificación hasta el reporte de resultados.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ 06 medición */}
        <section className="lp-sec lp-sec--glow" id="medicion" aria-labelledby="medicion-title">
          <div className="lp-shell">
            <SectionHead
              index="06"
              label="MEDICIÓN"
              title="Resultados que puedes ver"
              titleId="medicion-title"
            />

            <div className="lp-metrics">
              {METRICAS.map((metrica, index) => (
                <article
                  className="lp-metric"
                  key={metrica.titulo}
                  data-reveal
                  data-delay={index}
                >
                  <span className="lp-metric__num">{metrica.num}</span>
                  <div className="lp-metric__body">
                    <h3>{metrica.titulo}</h3>
                    <p>{metrica.texto}</p>
                  </div>
                </article>
              ))}
            </div>

            <p className="lp-measure" data-reveal>
              Seguimiento claro para tomar decisiones con información real.
            </p>

            <blockquote className="lp-manifesto" data-reveal>
              <p className="lp-manifesto__text">
                <span className="lp-grad">Sin promesas vacías</span>: reportes simples,
                métricas claras y mejoras continuas.
              </p>
            </blockquote>
          </div>
        </section>

        {/* --------------------------------------------------- 07 próximo paso */}
        <section className="lp-final" id="contacto" aria-labelledby="proximo-title">
          <div className="lp-shell">
            <div className="lp-final__box" data-reveal>
              <div className="lp-final__copy">
                <p className="lp-kicker">
                  <span className="lp-kicker__num">07</span>
                  <span className="lp-kicker__sep" aria-hidden="true">
                    /
                  </span>
                  <span className="lp-kicker__label">PRÓXIMO PASO</span>
                </p>

                <h2 className="lp-h2" id="proximo-title">
                  Hablemos de tu crecimiento
                </h2>

                <p className="lp-sec__lead">
                  Agenda una conversación para revisar tu situación y tus oportunidades de
                  pauta.
                </p>

                <a className="lp-btn lp-btn--primary lp-btn--caps" href={MAILTO}>
                  CONTACTAR
                  <IconArrowRight width={18} height={18} />
                </a>
              </div>

              <aside className="lp-diagnostico" aria-label="Diagnóstico inicial">
                <span className="lp-diagnostico__icon" aria-hidden="true">
                  <IconClipboard width={22} height={22} />
                </span>
                <h3 className="lp-diagnostico__label">Diagnóstico inicial</h3>
                <p className="lp-diagnostico__text">
                  Revisamos objetivos, canales y próximos pasos.
                </p>
              </aside>
            </div>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------ footer */}
      <footer className="lp-footer">
        <div className="lp-shell lp-footer__inner">
          <div className="lp-footer__brand">
            <a className="lp-footer__logo" href="#inicio">
              RAMNCO <span className="lp-footer__logo-sub">· ASESORES</span>
            </a>
            <p className="lp-footer__tagline">
              Publicidad estratégica · Crecimiento digital
            </p>
          </div>

          <div className="lp-footer__meta">
            <a className="lp-footer__mail" href={MAILTO}>
              <IconMail width={16} height={16} />
              {CORREO}
            </a>
            <span className="lp-footer__copy">© 2026 RAMNCO</span>
            <Link className="lp-footer__admin" href="/admin">
              Acceso equipo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
