import type { Metadata } from "next";
import Link from "next/link";
import "./landing.css";
import { SiteNav, CORREO, MAILTO } from "@/components/landing/site-nav";
import {
  IconArrowRight,
  IconBolt,
  IconChart,
  IconCheck,
  IconClock,
  IconCode,
  IconMail,
  IconPen,
  IconShield,
  IconUsers,
  IconWeb,
} from "@/components/landing/icons";

export const metadata: Metadata = {
  title: "Tecnología que vende. Marketing que convierte.",
  description:
    "RAMCO diseña y programa sitios web, landing pages y automatizaciones para pymes chilenas. Marketing medible, entregas en 5 a 7 días y planes desde CLP 180.000.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RAMCO · Tecnología que vende. Marketing que convierte.",
    description:
      "Sitios web, landing pages, automatización y campañas para pymes chilenas. Planes desde CLP 180.000, con entrega en 5 a 7 días.",
    locale: "es_CL",
    type: "website",
  },
};

const SERVICIOS = [
  {
    icon: IconWeb,
    label: "Sitios y landing pages",
    titulo: "Sitios web y landing pages",
    texto:
      "Diseñamos y programamos páginas rápidas en Next.js, responsivas y fáciles de actualizar. Cada sección responde una duda y lleva a la persona a contactarte.",
  },
  {
    icon: IconBolt,
    label: "Automatización",
    titulo: "Automatización de procesos",
    texto:
      "Formularios inteligentes, respuestas automáticas, registro de leads y avisos por correo. Menos copiar y pegar, más tiempo para vender.",
  },
  {
    icon: IconPen,
    label: "Contenido y redes",
    titulo: "Contenido y redes",
    texto:
      "Textos comerciales y piezas alineadas con tu oferta. Las redes atraen atención; tu web ordena la oferta y cierra la consulta.",
  },
  {
    icon: IconChart,
    label: "Datos y analítica",
    titulo: "Datos y analítica",
    texto:
      "Medición desde el día uno: eventos de contacto, origen de las consultas y un reporte simple para decidir qué ajustar.",
  },
] as const;

const PASOS = [
  {
    num: "01",
    titulo: "Diagnóstico sin costo",
    texto:
      "Revisamos tu oferta, tus canales y cómo te contactan hoy. Definimos qué necesita convertir y dónde se pierden las consultas.",
  },
  {
    num: "02",
    titulo: "Propuesta por escrito",
    texto:
      "Alcance, plazos y precio fijo. Sabes exactamente qué recibes y cuándo, antes de pagar nada.",
  },
  {
    num: "03",
    titulo: "Diseño y desarrollo",
    texto:
      "Primer borrador en días, no semanas. Ajustamos diseño y textos contigo hasta que apruebes.",
  },
  {
    num: "04",
    titulo: "Lanzamiento y medición",
    texto:
      "Publicamos con tu dominio, activamos la medición y revisamos juntos cómo responden los primeros contactos.",
  },
] as const;

const PLANES = [
  {
    nombre: "Presencia Digital Express",
    para: "Para negocios que necesitan verse profesionales rápido.",
    desde: "CLP 180.000",
    hasta: "hasta CLP 350.000",
    nota: "",
    etiqueta: "Ideal para empezar",
    destacado: true,
    incluye: [
      "Landing page de una página con servicios, beneficios y contacto",
      "Copy comercial enfocado en venta",
      "Botón directo a WhatsApp",
      "Optimización básica de Instagram o LinkedIn",
      "Entrega en 5 a 7 días",
    ],
  },
  {
    nombre: "Sistema de Captación",
    para: "Para recibir consultas de forma constante, no por rachas.",
    desde: "CLP 450.000",
    hasta: "hasta CLP 850.000",
    nota: "+ inversión publicitaria",
    etiqueta: "",
    destacado: false,
    incluye: [
      "Landing optimizada para conversión",
      "Formulario o WhatsApp con mensaje prearmado",
      "Pixel y medición básica de resultados",
      "Primera campaña de Meta Ads o Google Ads",
      "8 piezas de contenido",
      "Reporte mensual simple",
    ],
  },
  {
    nombre: "Automatización y Web",
    para: "Para negocios que pierden horas respondiendo y cotizando a mano.",
    desde: "CLP 700.000",
    hasta: "hasta CLP 1.500.000",
    nota: "",
    etiqueta: "",
    destacado: false,
    incluye: [
      "Sitio o mini sistema web a medida",
      "Formulario inteligente y base de datos de prospectos",
      "Automatización de respuestas",
      "Integración con correo, WhatsApp o planilla",
      "Capacitación para tu equipo",
    ],
  },
] as const;

const BENEFICIOS = [
  {
    icon: IconUsers,
    titulo: "Equipo pequeño, trato directo",
    texto:
      "Hablas con quienes diseñan y programan tu proyecto. Sin intermediarios ni ejecutivos que nunca abren el archivo.",
  },
  {
    icon: IconCode,
    titulo: "Diseño y código propios",
    texto:
      "Nada de plantillas genéricas: el sitio queda a tu nombre, con tu dominio y sin dependencias raras.",
  },
  {
    icon: IconBolt,
    titulo: "Velocidad como prioridad",
    texto:
      "Sitios livianos y optimizados. La mayoría de tus visitas llega desde el celular y ahí tiene que cargar rápido.",
  },
  {
    icon: IconClock,
    titulo: "Plazos por escrito",
    texto:
      "Cada proyecto tiene fecha de entrega definida en la propuesta. Si algo se corre, te avisamos antes, no después.",
  },
  {
    icon: IconChart,
    titulo: "Medición desde el día uno",
    texto:
      "Analítica y eventos de contacto configurados desde el inicio, para saber cuántas consultas genera la web.",
  },
  {
    icon: IconShield,
    titulo: "Acompañamiento al entregar",
    texto:
      "Ajustes menores y soporte incluidos las primeras semanas. No te dejamos solo con una carpeta comprimida.",
  },
] as const;

const GARANTIAS = [
  "Primer borrador a revisión: si no te convence, no seguimos y no pagas el resto.",
  "Pago 50% al iniciar y 50% al entregar, sin permanencia ni cobros automáticos.",
  "Todo por escrito: alcance, plazos y precio antes de empezar.",
] as const;

export default function HomePage() {
  return (
    <>
      <SiteNav />

      <main id="contenido" tabIndex={-1}>
        {/* ------------------------------------------------------------- hero */}
        <section className="hero" id="inicio" aria-labelledby="hero-titulo">
          <div className="container">
            <div className="lp-hero">
              <div className="lp-hero__text">
                <span className="eyebrow">Marketing + desarrollo web · Chile</span>
                <h1 id="hero-titulo">
                  Tecnología que <span className="lp-accent">vende</span>.
                  <br />
                  Marketing que <span className="lp-accent">convierte</span>.
                </h1>
                <p className="lead">
                  Somos RAMCO: un equipo chileno de cuatro personas que diseña, programa y mide
                  sitios web pensados para que tu negocio reciba consultas reales, no solo visitas.
                </p>
                <div className="hero__actions">
                  <a className="btn btn--primary" href={MAILTO}>
                    Hablemos de tu proyecto
                    <IconArrowRight width={18} height={18} />
                  </a>
                  <a className="btn btn--ghost" href="#planes">
                    Ver planes y precios
                  </a>
                </div>
                <ul className="lp-facts" aria-label="Condiciones de trabajo">
                  <li>
                    <IconClock width={17} height={17} />
                    Entrega en 5 a 7 días
                  </li>
                  <li>
                    <IconShield width={17} height={17} />
                    50% al iniciar, 50% al entregar
                  </li>
                  <li>
                    <IconCode width={17} height={17} />
                    Código y dominio tuyos
                  </li>
                </ul>
              </div>

              <aside className="card lp-offer" aria-labelledby="oferta-titulo">
                <span className="badge badge--verde">Oferta de lanzamiento</span>
                <h2 id="oferta-titulo" className="lp-offer__title">
                  Landing profesional desde
                </h2>
                <p className="lp-offer__price">
                  CLP 180.000
                  <span className="lp-offer__price-note">pago único</span>
                </p>
                <ul className="lp-offer__list">
                  <li>
                    <IconCheck width={16} height={16} />
                    Landing page de una página
                  </li>
                  <li>
                    <IconCheck width={16} height={16} />
                    Textos comerciales incluidos
                  </li>
                  <li>
                    <IconCheck width={16} height={16} />
                    Botón directo a WhatsApp
                  </li>
                  <li>
                    <IconCheck width={16} height={16} />
                    Optimización básica de tus redes
                  </li>
                </ul>
                <a className="btn btn--ghost lp-offer__btn" href="#planes">
                  Ver qué incluye
                </a>
              </aside>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- servicios */}
        <section className="section" id="servicios" aria-labelledby="servicios-titulo">
          <div className="container">
            <span className="eyebrow">Servicios</span>
            <h2 id="servicios-titulo">Cuatro piezas, un mismo objetivo: que te contacten.</h2>
            <p className="lead lp-section-lead">
              No vendemos páginas bonitas sueltas. Armamos un sistema simple donde el sitio, el
              contenido, la automatización y la medición trabajan juntos.
            </p>

            <div className="grid grid--3 lp-services">
              {SERVICIOS.map((servicio) => {
                const Icon = servicio.icon;
                return (
                  <article className="feature lp-service" key={servicio.titulo}>
                    <span className="feature__icon" role="img" aria-label={servicio.label}>
                      <Icon width={20} height={20} />
                    </span>
                    <h3>{servicio.titulo}</h3>
                    <p className="muted">{servicio.texto}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ proceso */}
        <section
          className="section lp-band"
          id="proceso"
          aria-labelledby="proceso-titulo"
        >
          <div className="container">
            <span className="eyebrow">Cómo trabajamos</span>
            <h2 id="proceso-titulo">Un proceso corto, con fechas y sin sorpresas.</h2>
            <p className="lead lp-section-lead">
              Cuatro pasos, de la primera conversación al sitio publicado. Cada uno con un
              entregable concreto.
            </p>

            <div className="grid grid--4 lp-steps">
              {PASOS.map((paso) => (
                <div className="step lp-step" key={paso.num}>
                  <span className="step__num">{paso.num}</span>
                  <h3>{paso.titulo}</h3>
                  <p className="muted">{paso.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- planes */}
        <section className="section" id="planes" aria-labelledby="planes-titulo">
          <div className="container">
            <span className="eyebrow">Planes</span>
            <h2 id="planes-titulo">Precios en pesos chilenos, claros desde el inicio.</h2>
            <p className="lead lp-section-lead">
              Rangos de referencia según alcance. El valor final se fija en la propuesta, después
              del diagnóstico y sin costo por cotizar.
            </p>

            <div className="grid grid--3 lp-plans">
              {PLANES.map((plan) => (
                <article
                  className={`card lp-plan${plan.destacado ? " lp-plan--destacado" : ""}`}
                  key={plan.nombre}
                >
                  <div className="lp-plan__head">
                    {plan.etiqueta ? (
                      <span className="badge badge--verde">{plan.etiqueta}</span>
                    ) : null}
                    <h3>{plan.nombre}</h3>
                    <p className="muted lp-plan__para">{plan.para}</p>
                  </div>

                  <p className="lp-plan__price">
                    <span className="lp-plan__desde">{plan.desde}</span>
                    <span className="lp-plan__hasta">{plan.hasta}</span>
                    {plan.nota ? <span className="lp-plan__nota">{plan.nota}</span> : null}
                  </p>

                  <ul className="lp-plan__features">
                    {plan.incluye.map((item) => (
                      <li key={item}>
                        <IconCheck width={16} height={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    className={`btn ${plan.destacado ? "btn--primary" : "btn--ghost"} lp-plan__btn`}
                    href={MAILTO}
                  >
                    Pedir propuesta
                  </a>
                </article>
              ))}
            </div>

            <p className="dim lp-plans__note">
              Valores en CLP como referencia inicial. La inversión publicitaria de los planes con
              campañas se paga directo a Meta o Google. Forma de pago: 50% al iniciar y 50% al
              entregar.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------ por qué */}
        <section className="section lp-band" id="porque" aria-labelledby="porque-titulo">
          <div className="container">
            <span className="eyebrow">Por qué RAMCO</span>
            <h2 id="porque-titulo">Somos cuatro. Eso juega a tu favor.</h2>
            <p className="lead lp-section-lead">
              Un equipo chico significa decisiones rápidas, trato directo y nadie que te venda
              cosas que no vamos a construir.
            </p>

            <div className="grid grid--3 lp-beneficios">
              {BENEFICIOS.map((beneficio) => {
                const Icon = beneficio.icon;
                return (
                  <article className="lp-beneficio" key={beneficio.titulo}>
                    <span className="lp-beneficio__icon" aria-hidden="true">
                      <Icon width={18} height={18} />
                    </span>
                    <h3>{beneficio.titulo}</h3>
                    <p className="muted">{beneficio.texto}</p>
                  </article>
                );
              })}
            </div>

            <div className="card lp-garantias" aria-labelledby="garantias-titulo">
              <h3 id="garantias-titulo" className="lp-garantias__title">
                <IconShield width={20} height={20} />
                Garantías de trabajo
              </h3>
              <ul className="lp-garantias__list">
                {GARANTIAS.map((garantia) => (
                  <li key={garantia}>
                    <IconCheck width={16} height={16} />
                    <span>{garantia}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- cta */}
        <section className="section lp-cta" id="contacto" aria-labelledby="contacto-titulo">
          <div className="container">
            <div className="lp-cta__box">
              <div className="lp-cta__text">
                <span className="eyebrow">Empecemos</span>
                <h2 id="contacto-titulo">
                  Conversemos. Te enviamos 3 mejoras concretas para tu presencia digital.
                </h2>
                <p className="lead">
                  Sin costo y sin compromiso: revisamos tu web o tu Instagram y te decimos qué
                  cambiar primero. Si no aplica a tu negocio, te lo decimos también.
                </p>
              </div>
              <div className="lp-cta__actions">
                <a className="btn btn--primary lp-cta__mail" href={MAILTO}>
                  <IconMail width={18} height={18} />
                  Escribir a {CORREO}
                </a>
                <a className="btn btn--ghost" href="#planes">
                  Revisar planes
                </a>
                <p className="dim lp-cta__hint">
                  Atención directa del equipo, de lunes a viernes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------- footer */}
      <footer className="footer">
        <div className="container">
          <div className="lp-footer">
            <div className="lp-footer__brand">
              <a className="lp-logo" href="#inicio" aria-label="RAMCO, volver al inicio">
                <span className="lp-logo__mark" aria-hidden="true">
                  R
                </span>
                <span className="lp-logo__word">RAMCO</span>
              </a>
              <p className="lp-footer__tagline">Marketing que vende. Tecnología que convierte.</p>
              <p className="dim">Chile · Atención remota en todo el país</p>
            </div>

            <nav className="lp-footer__nav" aria-label="Enlaces del pie">
              <a href="#servicios">Servicios</a>
              <a href="#proceso">Cómo trabajamos</a>
              <a href="#planes">Planes</a>
              <a href="#porque">Por qué RAMCO</a>
            </nav>

            <div className="lp-footer__contact">
              <a className="lp-footer__mail" href={MAILTO}>
                <IconMail width={16} height={16} />
                {CORREO}
              </a>
              <Link className="lp-footer__panel" href="/admin">
                Panel interno
              </Link>
              <p className="dim">© RAMCO 2026 · Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
