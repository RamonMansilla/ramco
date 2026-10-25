import { ETAPAS_TRABAJO } from "@/lib/planes";

/** Sección E · modelo de trabajo en 4 etapas (catálogo oficial). */
export function ModeloTrabajo() {
  return (
    <section className="pl-sec" id="modelo" aria-labelledby="modelo-title">
      <div className="pl-shell">
        <header className="pl-head">
          <div className="pl-head__intro">
            <p className="pl-kicker">
              <span className="pl-kicker__num" aria-hidden="true">
                06
              </span>
              <span className="pl-kicker__label">Modelo de trabajo</span>
            </p>
            <h2 className="pl-h2" id="modelo-title">
              Cuatro etapas, sin sorpresas
            </h2>
          </div>
          <p className="pl-lead">
            Así avanza cualquier proyecto, sea pauta, web o app: cada etapa deja un
            entregable y, cuando corresponde, un hito de pago.
          </p>
        </header>

        <ol className="pl-etapas">
          {ETAPAS_TRABAJO.map((etapa) => (
            <li className="pl-etapa" key={etapa.numero}>
              <span className="pl-etapa__num" aria-hidden="true">
                {etapa.numero}
              </span>
              <h3 className="pl-etapa__name">{etapa.nombre}</h3>
              <p className="pl-etapa__text">{etapa.detalle}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
