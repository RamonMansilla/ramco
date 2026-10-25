import { Cta } from "@/components/planes/piezas";
import {
  FILAS_COMPARADOR,
  PLANES_MARKETING,
  type CeldaPlan,
} from "@/lib/planes";

/**
 * Sección F · comparador. En escritorio es una tabla real (con `<th scope>`,
 * `<caption>` y celdas ✓/—); en móvil las mismas filas se apilan como
 * tarjetas, así que no hace falta hacer scroll horizontal para comparar.
 */

function Marca({ incluido }: { incluido: boolean }) {
  return (
    <span className="pl-cmp__mark" aria-hidden="true" data-on={String(incluido)}>
      {incluido ? "✓" : "—"}
    </span>
  );
}

function Celda({ celda }: { celda: CeldaPlan }) {
  return (
    <>
      <Marca incluido={celda.incluido} />
      <span className="pl-sr">{celda.incluido ? "Incluido" : "No incluido"}</span>
      {celda.nota ? <span className="pl-cmp__sub">{celda.nota}</span> : null}
    </>
  );
}

function celdaDe(fila: (typeof FILAS_COMPARADOR)[number], id: string): CeldaPlan {
  if (id === "esencial") return fila.esencial;
  if (id === "crecimiento") return fila.crecimiento;
  return fila.premium;
}

export function Comparador() {
  return (
    <section
      className="pl-sec pl-sec--banda"
      id="comparador"
      aria-labelledby="cmp-title"
    >
      <div className="pl-shell">
        <header className="pl-head">
          <div className="pl-head__intro">
            <p className="pl-kicker">
              <span className="pl-kicker__num" aria-hidden="true">
                05
              </span>
              <span className="pl-kicker__label">Comparador</span>
            </p>
            <h2 className="pl-h2" id="cmp-title">
              Qué trae cada plan
            </h2>
          </div>
          <p className="pl-lead">
            ✓ incluido · — no incluido. La diferencia de valor entre planes es de alcance
            y canales, no de horas de trabajo.
          </p>
        </header>

        <div className="pl-cmp">
          {/* --- tabla (escritorio) --- */}
          <div className="pl-cmp__scroll">
            <table className="pl-cmp__table">
              <caption className="pl-sr">
                Comparación de los planes Esencial, Crecimiento y Premium de RAMNCO
              </caption>
              <thead>
                <tr>
                  <td className="pl-cmp__corner">
                    <span className="pl-sr">Característica</span>
                  </td>
                  {PLANES_MARKETING.map((plan) => (
                    <th
                      key={plan.id}
                      scope="col"
                      className="pl-cmp__col"
                      data-destacado={plan.destacado ? "true" : undefined}
                    >
                      <span className="pl-cmp__head">{plan.numero}</span>
                      <span className="pl-cmp__head-name">{plan.nombre}</span>
                      {plan.destacado ? (
                        <span className="pl-cmp__head-tag">Más elegido</span>
                      ) : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FILAS_COMPARADOR.map((fila) => (
                  <tr key={fila.etiqueta}>
                    <th scope="row" className="pl-cmp__label">
                      {fila.etiqueta}
                    </th>
                    <td className="pl-cmp__cell">
                      <Celda celda={fila.esencial} />
                    </td>
                    <td className="pl-cmp__cell pl-cmp__cell--hot" data-destacado="true">
                      <Celda celda={fila.crecimiento} />
                    </td>
                    <td className="pl-cmp__cell">
                      <Celda celda={fila.premium} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- tarjetas apiladas (móvil) --- */}
          <ul className="pl-cmp__cards">
            {PLANES_MARKETING.map((plan) => (
              <li key={plan.id}>
                <article
                  className="pl-cmp__card"
                  data-destacado={plan.destacado ? "true" : undefined}
                  aria-labelledby={`cmp-card-${plan.id}`}
                >
                  <header className="pl-cmp__card-head">
                    <p className="pl-cmp__head">{plan.numero}</p>
                    <h3 className="pl-cmp__card-name" id={`cmp-card-${plan.id}`}>
                      {plan.nombre}
                    </h3>
                    {plan.destacado ? (
                      <span className="pl-cmp__head-tag">Más elegido</span>
                    ) : null}
                  </header>
                  <dl className="pl-cmp__list">
                    {FILAS_COMPARADOR.map((fila) => {
                      const celda = celdaDe(fila, plan.id);
                      return (
                        <div className="pl-cmp__line" key={fila.etiqueta}>
                          <dt>{fila.etiqueta}</dt>
                          <dd>
                            <Celda celda={celda} />
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <div className="pl-close-cta">
          <p className="pl-close-cta__text">
            ¿Dudas entre dos planes? Te decimos cuál conviene para tu negocio.
          </p>
          <Cta />
        </div>
      </div>
    </section>
  );
}
