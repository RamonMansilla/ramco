import type { Metadata } from "next";
import Link from "next/link";
import "./servicios.css";
import { CATEGORIAS, contarServicios } from "@/lib/catalogo";
import { FiltroServicios, ATRIBUTO_CATEGORIA, ATRIBUTO_TARJETA } from "@/components/servicios/filtro";
import { NavegacionCategorias } from "@/components/servicios/navegacion";
import { Reactivacion } from "@/components/reactivacion/reactivacion";
import {
  IconAndroid,
  IconApple,
  IconArrowRight,
  IconSpark,
  iconoDe,
} from "@/components/servicios/icons";

const CORREO = "ramcochile@gmail.com";
const MAILTO = `mailto:${CORREO}`;

const TOTAL_SERVICIOS = contarServicios();
const TOTAL_CATEGORIAS = CATEGORIAS.length;

/**
 * Datos mínimos para los componentes cliente. Se envían sólo lo necesario
 * (el catálogo completo viaja ya renderizado en el HTML) para no duplicar
 * el payload RSC.
 */
const INDICE = CATEGORIAS.map(({ id, nombre }) => ({ id, nombre }));
const CATEGORIAS_FILTRO = CATEGORIAS.map(({ id, nombre, servicios }) => ({
  id,
  nombre,
  resumen: "",
  icono: "",
  servicios: servicios.map((servicio) => ({ nombre: servicio.nombre, descripcion: "" })),
}));

export const metadata: Metadata = {
  title: "Servicios digitales",
  description:
    "Catálogo de servicios de RAMNCO: aplicaciones, páginas web, comercio electrónico, paneles, automatización, WhatsApp, publicidad, datos, APIs y soporte. Apps para iOS y Android publicadas.",
  alternates: {
    canonical: "/servicios",
  },
  openGraph: {
    title: "Servicios digitales · RAMNCO",
    description:
      "Once categorías de servicios digitales para construir, automatizar y sostener tu operación. Incluye apps para iOS y Android.",
    locale: "es_CL",
    type: "website",
  },
};

/** Texto normalizado para el buscador: nombre + descripción + entregable. */
function textoBuscable(nombre: string, descripcion: string, resultado?: string): string {
  return [nombre, descripcion, resultado ?? ""].join(" μ ").toLowerCase();
}

/* ------------------------------------------------------------------ página */

export default function ServiciosPage() {
  return (
    <div className="sv-page">
      <a className="sv-skip" href="#catalogo">
        Saltar al catálogo
      </a>

      <header className="sv-topbar">
        <div className="sv-shell sv-topbar__inner">
          <Link className="sv-brand" href="/" aria-label="RAMNCO Asesores, ir al inicio">
            <span className="sv-brand__mark" aria-hidden="true">
              R
            </span>
            <span className="sv-brand__word">
              RAMNCO
              <span className="sv-brand__sub">ASESORES</span>
            </span>
          </Link>

          <nav className="sv-topbar__nav" aria-label="Navegación del sitio">
            <Link href="/">Inicio</Link>
            <a href="#planes">Planes</a>
            <a className="sv-btn sv-btn--primary sv-btn--sm" href={MAILTO}>
              Hablar con RAMNCO
            </a>
          </nav>
        </div>
      </header>

      <main id="contenido" tabIndex={-1}>
        {/* ------------------------------------------------------------ hero */}
        <section className="sv-hero" aria-labelledby="servicios-title">
          <div className="sv-hero__glow" aria-hidden="true" />

          <div className="sv-shell sv-hero__inner">
            <p className="sv-eyebrow">
              <span className="sv-eyebrow__dot" aria-hidden="true" />
              Catálogo de servicios · {TOTAL_CATEGORIAS} categorías
            </p>

            <h1 className="sv-h1" id="servicios-title">
              Todo lo que podemos{" "}
              <span className="sv-grad">construir para tu negocio</span>
            </h1>

            <p className="sv-hero__lead">
              Aplicaciones, sitios web, tiendas, paneles, automatizaciones, publicidad y soporte
              técnico. Elegimos la tecnología que resuelve tu operación y la dejamos funcionando.
            </p>

            <div className="sv-hero__actions">
              <a className="sv-btn sv-btn--primary" href={MAILTO}>
                Hablar con RAMNCO
                <IconArrowRight width={18} height={18} />
              </a>
              <a className="sv-btn sv-btn--ghost" href="/#planes">
                Ver planes
              </a>
            </div>

            <ul className="sv-hero__chips">
              <li>{TOTAL_SERVICIOS} servicios</li>
              <li>{TOTAL_CATEGORIAS} categorías</li>
            </ul>

            <aside className="sv-store" aria-label="Apps publicadas en iOS y Android">
              <span className="sv-store__icons" aria-hidden="true">
                <IconApple width={20} height={20} />
                <IconAndroid width={20} height={20} />
              </span>
              <p className="sv-store__text">
                <strong>Desarrollamos y publicamos apps en iOS y Android.</strong>{" "}
                Publicación en App Store y Google Play incluida en el proyecto.
              </p>
            </aside>
          </div>
        </section>

        {/*
          Un único contenedor `.sv-filtro` abarca la barra de búsqueda y el
          catálogo: el Client Component filtra en memoria las tarjetas que ya
          vienen renderizadas desde el servidor.
        */}
        <div className="sv-catalogo">
          <div className="sv-toolbar" id="catalogo">
            <div className="sv-shell">
              <NavegacionCategorias categorias={INDICE} />
              <FiltroServicios categorias={CATEGORIAS_FILTRO} />
            </div>
          </div>

          {/* ------------------------------------------------------ categorías */}
          <div className="sv-shell sv-cuerpo">
            {CATEGORIAS.map((categoria, indice) => {
            const Icono = iconoDe(categoria.icono);
            const prefix = `sv-${categoria.id}`;
            const num = String(indice + 1).padStart(2, "0");

            return (
              <section
                className="sv-sec"
                key={categoria.id}
                id={categoria.id}
                data-sv-categoria={categoria.id}
                aria-labelledby={`${prefix}-titulo`}
              >
                <header className="sv-sec__head">
                  <div className="sv-sec__titles">
                    <span className="sv-sec__icon" aria-hidden="true">
                      <Icono width={22} height={22} />
                    </span>
                    <div className="sv-sec__texts">
                      <p className="sv-sec__num">
                        <span>{num}</span>
                        <span className="sv-sec__count">{categoria.servicios.length} servicios</span>
                      </p>
                      <h2 className="sv-h2" id={`${prefix}-titulo`}>
                        {categoria.nombre}
                      </h2>
                      <p className="sv-sec__resumen">{categoria.resumen}</p>
                    </div>
                  </div>
                </header>

                <ul className="sv-grid">
                  {categoria.servicios.map((servicio) => (
                    <li
                      className="sv-card"
                      key={servicio.nombre}
                      data-sv-tarjeta={textoBuscable(
                        servicio.nombre,
                        servicio.descripcion,
                        servicio.resultado,
                      )}
                    >
                      <h3 className="sv-card__nombre">{servicio.nombre}</h3>
                      <p className="sv-card__desc">{servicio.descripcion}</p>
                      {servicio.resultado ? (
                        <p className="sv-card__resultado">
                          <span className="sv-card__resultado-label">Entregable</span>
                          {servicio.resultado}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>

                {categoria.id === "aplicaciones" ? (
                  <p className="sv-sec__nota">
                    <IconSpark width={16} height={16} />
                    <span>
                      Desarrollamos y publicamos apps en <strong>iOS</strong> y{" "}
                      <strong>Android</strong>: apps nativas, multiplataforma y PWA con publicación
                      en App Store y Google Play.
                    </span>
                  </p>
                ) : null}
              </section>
            );
          })}
          </div>
        </div>

        {/* ------------------------------------------- recuperar cartera */}
        <section className="sv-seccion sv-seccion--cartera" id="cartera" aria-labelledby="cartera-titulo">
          <div className="sv-shell">
            <header className="sv-cabecera">
              <p className="sv-eyebrow">
                <span className="sv-eyebrow__dot" aria-hidden="true" />
                Lo que casi nadie te ofrece
              </p>
              <h2 className="sv-h2" id="cartera-titulo">
                Recupera los clientes que ya tuviste
              </h2>
              <p className="sv-lead">
                Antes de gastar en clientes nuevos, hay dinero dormido en tu propia base: personas
                que te compraron, te cotizaron o dejaron de aparecer. Las identificamos, las
                contactamos y las volvemos a traer.
              </p>
            </header>

            <ol className="sv-pasos-cartera">
              <li>
                <span className="sv-pasos-cartera__num">01</span>
                <h3>Ordenamos la cartera</h3>
                <p>
                  Limpiamos duplicados, teléfonos inválidos y correos muertos. Segmentamos por
                  quién compró, cuánto y cuándo.
                </p>
              </li>
              <li>
                <span className="sv-pasos-cartera__num">02</span>
                <h3>Contactamos con una razón</h3>
                <p>
                  Mensaje personalizado por segmento: recuperación, oferta de regreso o
                  recordatorio de lo que tenía pendiente.
                </p>
              </li>
              <li>
                <span className="sv-pasos-cartera__num">03</span>
                <h3>Medimos lo recuperado</h3>
                <p>
                  Cada contacto tiene estado y valor: contactado, respondió, cotizó, recuperado.
                  El panel muestra cuánto ingreso volvió.
                </p>
              </li>
            </ol>

            <Reactivacion />

            <p className="sv-nota-cartera">
              El servicio se puede contratar suelto o incluido en el <a href="/planes">Plan de
              Crecimiento</a>. También sirve para carteras que están en planillas, CRM antiguos o
              correos sueltos.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------ cierre */}
        <section className="sv-cierre" aria-labelledby="cierre-titulo">
          <div className="sv-shell">
            <div className="sv-cierre__box">
              <div className="sv-cierre__copy">
                <h2 className="sv-h2" id="cierre-titulo">
                  ¿No encuentras lo que necesitas?
                </h2>
                <p className="sv-cierre__lead">
                  Escríbenos y lo evaluamos. Revisamos tu caso, te decimos si es viable y con qué
                  alcance, antes de hablar de plazos.
                </p>
                <div className="sv-cierre__actions">
                  <a className="sv-btn sv-btn--primary" href={MAILTO}>
                    Hablar con RAMNCO
                    <IconArrowRight width={18} height={18} />
                  </a>
                  <a className="sv-btn sv-btn--ghost" href="/#planes">
                    Ver planes
                  </a>
                </div>
              </div>

              <aside className="sv-cierre__panel" aria-label="Datos de contacto">
                <p className="sv-cierre__panel-label">Contacto directo</p>
                <a className="sv-cierre__mail" href={MAILTO}>
                  {CORREO}
                </a>
                <p className="sv-cierre__panel-note">
                  Respuesta en horario hábil. Cuéntanos qué necesitas y te orientamos con los
                  próximos pasos.
                </p>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <footer className="sv-footer">
        <div className="sv-shell sv-footer__inner">
          <p className="sv-footer__brand">
            RAMNCO <span>· PUBLICIDAD ESTRATÉGICA Y DESARROLLO</span>
          </p>
          <div className="sv-footer__meta">
            <a href={MAILTO}>{CORREO}</a>
            <Link href="/">Inicio</Link>
            <span>© 2026 RAMNCO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
