import { Cta } from "@/components/planes/piezas";
import { CORREO, FAQ, MAILTO } from "@/lib/planes";

/**
 * Sección G · preguntas frecuentes. Cada respuesta es un `<details>` nativo:
 * abre y cierra sin JavaScript y el foco es visible por CSS.
 */
export function Preguntas() {
  return (
    <section className="pl-sec" id="faq" aria-labelledby="faq-title">
      <div className="pl-shell">
        <header className="pl-head">
          <div className="pl-head__intro">
            <p className="pl-kicker">
              <span className="pl-kicker__num" aria-hidden="true">
                07
              </span>
              <span className="pl-kicker__label">Dudas frecuentes</span>
            </p>
            <h2 className="pl-h2" id="faq-title">
              Antes de cotizar
            </h2>
          </div>
          <p className="pl-lead">
            Si tu pregunta no está acá, escríbenos: respondemos por correo con una
            respuesta concreta para tu caso.
          </p>
        </header>

        <div className="pl-faq">
          {FAQ.map((item, index) => (
            <details className="pl-faq__item" key={item.pregunta}>
              <summary className="pl-faq__q">
                <span className="pl-faq__n" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="pl-faq__text">{item.pregunta}</span>
                <span className="pl-faq__chev" aria-hidden="true" />
              </summary>
              <div className="pl-faq__a">
                <p>{item.respuesta}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="pl-close-cta">
          <p className="pl-close-cta__text">
            ¿Queda algo por definir? <strong>Conversemos</strong> y dejamos el alcance por
            escrito antes de empezar.
          </p>
          <Cta />
        </div>

        <p className="pl-note pl-note--mail">
          Escríbenos a <a href={MAILTO}>{CORREO}</a>
        </p>
      </div>
    </section>
  );
}
