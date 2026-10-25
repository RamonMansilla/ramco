import { Cta, Incluye } from "@/components/planes/piezas";
import { IconWindow } from "@/components/planes/iconos";
import { FASES_PAGO, FASES_PAGO_TOTAL, SITIOS_WEB, clp } from "@/lib/planes";

/**
 * Sección B · desarrollo web sin plan de marketing.
 * El cobro por hitos se explica arriba de las tarjetas porque aplica a los tres
 * niveles; el total (100%) se refuerza visualmente al final de la fila.
 */
export function DesarrolloWeb() {
  return (
    <section className="pl-sec" id="desarrollo-web" aria-labelledby="web-title">
      <div className="pl-shell">
        <header className="pl-head">
          <div className="pl-head__intro">
            <p className="pl-kicker">
              <span className="pl-kicker__num" aria-hidden="true">
                02
              </span>
              <span className="pl-kicker__label">Desarrollo web</span>
            </p>
            <h2 className="pl-h2" id="web-title">
              La web sola, <em className="pl-accent">sin plan de pauta</em>
            </h2>
          </div>
          <p className="pl-lead">
            Se puede contratar el sitio por separado. Si después sumas publicidad, la web
            ya quedó lista para recibir tráfico y consultas.
          </p>
        </header>

        <aside className="pl-hitos" aria-labelledby="hitos-title">
          <div className="pl-hitos__intro">
            <span className="pl-hitos__icon" aria-hidden="true">
              <IconWindow width={20} height={20} />
            </span>
            <div>
              <h3 className="pl-hitos__title" id="hitos-title">
                Pago por hitos
              </h3>
              <p className="pl-hitos__text">
                El sitio se paga según avanza, no todo por adelantado:{" "}
                <strong>3 fases de pago: inicio, piloto y entrega.</strong>
              </p>
            </div>
          </div>

          <ol className="pl-hitos__track">
            {FASES_PAGO.map((fase) => (
              <li className="pl-hito" key={fase.nombre}>
                <span className="pl-hito__pct">{fase.porcentaje}%</span>
                <span className="pl-hito__name">{fase.nombre}</span>
              </li>
            ))}
            <li className="pl-hito pl-hito--total">
              <span className="pl-hito__pct">{FASES_PAGO_TOTAL}%</span>
              <span className="pl-hito__name">Total</span>
            </li>
          </ol>
        </aside>

        <ul className="pl-sites">
          {SITIOS_WEB.map((sitio) => (
            <li className="pl-sites__item" key={sitio.id}>
              <article className="pl-site" aria-labelledby={`sitio-${sitio.id}`}>
                <h3 className="pl-site__name" id={`sitio-${sitio.id}`}>
                  {sitio.nombre}
                </h3>
                <p className="pl-site__resumen">{sitio.resumen}</p>

                <p className="pl-site__price">
                  {sitio.desde === null ? (
                    <>
                      <span className="pl-site__from">Valor</span>
                      <span className="pl-site__amount">A cotizar</span>
                      <span className="pl-site__per">según alcance</span>
                    </>
                  ) : (
                    <>
                      <span className="pl-site__from">Desde</span>
                      <span className="pl-site__amount">{clp(sitio.desde)}</span>
                    </>
                  )}
                </p>

                {sitio.gancho ? <p className="pl-site__gancho">{sitio.gancho}</p> : null}

                <Incluye items={sitio.caracteristicas} />

                <p className="pl-site__entrega">{sitio.entrega}</p>
              </article>
            </li>
          ))}
        </ul>

        <div className="pl-close-cta">
          <p className="pl-close-cta__text">
            ¿No sabes qué nivel te sirve? <strong>Lo definimos juntos</strong> en una
            reunión de alcance, sin costo.
          </p>
          <Cta label="Cotizar" />
        </div>
      </div>
    </section>
  );
}
