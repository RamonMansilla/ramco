import { Cta } from "@/components/planes/piezas";
import { IconPhone } from "@/components/planes/iconos";
import { APPS } from "@/lib/planes";

/** Sección D · apps iOS y Android, con llamada a la acción propia. */
export function Apps() {
  return (
    <section className="pl-sec pl-sec--banda" id="apps" aria-labelledby="apps-title">
      <div className="pl-shell">
        <header className="pl-head">
          <div className="pl-head__intro">
            <p className="pl-kicker">
              <span className="pl-kicker__num" aria-hidden="true">
                04
              </span>
              <span className="pl-kicker__label">Apps móviles</span>
            </p>
            <h2 className="pl-h2" id="apps-title">
              {APPS.titulo}
            </h2>
          </div>
          <p className="pl-lead">{APPS.intro}</p>
        </header>

        <div className="pl-apps">
          <div className="pl-apps__copy">
            <span className="pl-apps__badge" aria-hidden="true">
              <IconPhone width={22} height={22} />
            </span>
            <p className="pl-apps__hooks">
              iOS y Android
              <span className="pl-apps__hooks-sep" aria-hidden="true">
                ·
              </span>
              App Store y Google Play
              <span className="pl-apps__hooks-sep" aria-hidden="true">
                ·
              </span>
              ASO
            </p>
            <Cta label={APPS.cta} />
          </div>

          <ol className="pl-apps__list">
            {APPS.etapas.map((etapa, index) => (
              <li className="pl-apps__item" key={etapa.titulo}>
                <span className="pl-apps__num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="pl-apps__item-title">{etapa.titulo}</p>
                  <p className="pl-apps__item-text">{etapa.detalle}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
