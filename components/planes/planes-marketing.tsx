import { Cta, Incluye } from "@/components/planes/piezas";
import { NOTA_PAUTA, PLANES_MARKETING, clp } from "@/lib/planes";

/**
 * Sección A · planes de marketing (pauta digital).
 * Server Component. Lo único "interactivo" es el hover/foco, resuelto en CSS.
 */
export function PlanesMarketing() {
  return (
    <section className="pl-sec" id="marketing" aria-labelledby="marketing-title">
      <div className="pl-shell">
        <header className="pl-head">
          <div className="pl-head__intro">
            <p className="pl-kicker">
              <span className="pl-kicker__num" aria-hidden="true">
                01
              </span>
              <span className="pl-kicker__label">Planes de marketing</span>
            </p>
            <h2 className="pl-h2" id="marketing-title">
              Tres formas de <em className="pl-accent">hacer crecer</em> tu negocio
            </h2>
          </div>
          <p className="pl-lead">
            Pauta con estrategia, ejecución y reportes medibles. Los precios son
            honorarios de RAMNCO; la plataforma publicitaria se paga aparte.
          </p>
        </header>

        <ul className="pl-plans">
          {PLANES_MARKETING.map((plan) => (
            <li className="pl-plans__item" key={plan.id}>
              <article
                className="pl-plan"
                data-destacado={plan.destacado ? "true" : undefined}
                aria-labelledby={`plan-${plan.id}`}
              >
                <div className="pl-plan__top">
                  <p className="pl-plan__num">{plan.numero}</p>
                  {plan.destacado ? <p className="pl-plan__tag">Más elegido</p> : null}
                </div>

                <h3 className="pl-plan__name" id={`plan-${plan.id}`}>
                  {plan.nombre}
                </h3>
                <p className="pl-plan__desc">{plan.paraQuien}</p>

                <p className="pl-plan__price">
                  <span className="pl-plan__from">Inversión desde</span>
                  <span className="pl-plan__amount">
                    {clp(plan.desde)}
                    <span className="pl-plan__per"> /mes</span>
                  </span>
                </p>

                {plan.incluyeWeb ? (
                  <div className="pl-plan__web">
                    <p className="pl-plan__web-title">
                      <span className="pl-plan__web-mark" aria-hidden="true">
                        ✓
                      </span>
                      {plan.incluyeWeb.titulo}
                    </p>
                    <p className="pl-plan__web-text">{plan.incluyeWeb.detalle}</p>
                  </div>
                ) : null}

                <Incluye items={plan.caracteristicas} />

                <div className="pl-plan__cta">
                  <Cta label="Cotizar" variante={plan.destacado ? "primary" : "ghost"} />
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className="pl-note pl-note--pauta">
          <strong>La inversión publicitaria se paga aparte.</strong> {NOTA_PAUTA}
        </p>
      </div>
    </section>
  );
}
