import { Cta } from "@/components/planes/piezas";
import { IconRefresh, IconShield } from "@/components/planes/iconos";
import { WORDPRESS } from "@/lib/planes";

const TITULOS_CON_ESCUDO = new Set(["Menos brechas de seguridad"]);

/**
 * Sección C · reemplazo de WordPress/WooCommerce. Va en un bloque propio,
 * separado de los niveles de sitio, para que no se lea como "un plan más".
 */
export function WordPress() {
  return (
    <section className="pl-sec" id="wordpress" aria-labelledby="wp-title">
      <div className="pl-shell">
        <div className="pl-wp">
          <div className="pl-wp__head">
            <span className="pl-wp__icon" aria-hidden="true">
              <IconRefresh width={22} height={22} />
            </span>
            <h2 className="pl-h2 pl-wp__title" id="wp-title">
              {WORDPRESS.titulo}
            </h2>
            <p className="pl-wp__intro">{WORDPRESS.intro}</p>
            <Cta label={WORDPRESS.cta} />
          </div>

          <ul className="pl-wp__list">
            {WORDPRESS.beneficios.map((beneficio) => (
              <li className="pl-wp__item" key={beneficio.titulo}>
                <span className="pl-wp__item-icon" aria-hidden="true">
                  {TITULOS_CON_ESCUDO.has(beneficio.titulo) ? (
                    <IconShield width={17} height={17} />
                  ) : (
                    <IconRefresh width={17} height={17} />
                  )}
                </span>
                <div>
                  <p className="pl-wp__item-title">{beneficio.titulo}</p>
                  <p className="pl-wp__item-text">{beneficio.detalle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
