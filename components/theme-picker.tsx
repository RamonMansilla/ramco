import { cookies } from "next/headers";
import { TEMA_COOKIE, TEMAS, buscarTema } from "@/lib/temas";
import { guardarTema } from "@/app/tema-actions";

/** Selector de temas. Envía el formulario al cambiar de opción (sin JS propio). */
export async function ThemePicker({ compacto = false }: { compacto?: boolean }) {
  const store = await cookies();
  const actual = buscarTema(store.get(TEMA_COOKIE)?.value);

  return (
    <details className={`tp${compacto ? " tp--compacto" : ""}`}>
      <summary className="tp__toggle" aria-label="Elegir tema de colores">
        <span className="tp__swatches" aria-hidden="true">
          {actual.muestra.map((color) => (
            <span key={color} style={{ background: color }} />
          ))}
        </span>
        <span className="tp__label">Tema</span>
      </summary>

      <form action={guardarTema} className="tp__panel">
        <p className="tp__title">Elige los colores del sitio</p>
        {TEMAS.map((tema) => (
          <button
            key={tema.id}
            type="submit"
            name="tema"
            value={tema.id}
            className="tp__option"
            aria-pressed={tema.id === actual.id}
            data-activo={tema.id === actual.id}
          >
            <span className="tp__dots" aria-hidden="true">
              {tema.muestra.map((color) => (
                <span key={color} style={{ background: color }} />
              ))}
            </span>
            <span className="tp__text">
              <strong>{tema.nombre}</strong>
              <small>{tema.detalle}</small>
            </span>
          </button>
        ))}
      </form>
    </details>
  );
}
