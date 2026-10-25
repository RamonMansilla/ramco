"use client";

import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from "react";
import type { CategoriaCatalogo } from "@/lib/catalogo";
import { IconLupa } from "@/components/servicios/icons";

/**
 * Buscador del catálogo de servicios.
 *
 * Filtra en memoria por texto y por categoría, sin librerías ni llamadas de
 * red. El catálogo completo llega renderizado desde el servidor: aquí sólo se
 * decide qué tarjetas se ven, alternando el atributo `hidden`. Así el HTML
 * inicial funciona sin JavaScript y no se vuelve a pintar la lista entera en
 * cada tecla; además el contador se calcula en el mismo paso que el filtrado.
 */

export const ATRIBUTO_TARJETA = "data-sv-tarjeta";
export const ATRIBUTO_CATEGORIA = "data-sv-categoria";

/** Normaliza texto: minúsculas y sin tildes, para que "aplicacion" encuentre "aplicación". */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function FiltroServicios({ categorias }: { categorias: CategoriaCatalogo[] }) {
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const textoDiferido = useDeferredValue(texto);

  const idBusqueda = useId();
  const idEstado = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const termino = normalizar(textoDiferido);

  /** El total sale de las props: está disponible también en el render del servidor. */
  const total = useMemo(
    () => categorias.reduce((suma, item) => suma + item.servicios.length, 0),
    [categorias],
  );

  /**
   * Visibilidad de tarjetas y bloques.
   *
   * Se calcula en un efecto (y no en el render) porque necesita el DOM ya
   * montado: las tarjetas las pinta el servidor y desde aquí sólo se alterna
   * su atributo `hidden`. Se consulta el documento completo porque el catálogo
   * vive junto a la barra, no dentro de ella. En el primer render todo queda
   * visible, tal como llegó en el HTML.
   */
  const [visibles, setVisibles] = useState(total);

  useEffect(() => {
    let visiblesTotal = 0;

    document.querySelectorAll<HTMLElement>(`[${ATRIBUTO_CATEGORIA}]`).forEach((bloque) => {
      const idCategoria = bloque.getAttribute(ATRIBUTO_CATEGORIA);
      const coincideCategoria = categoria === "todas" || idCategoria === categoria;

      let visiblesBloque = 0;
      bloque.querySelectorAll<HTMLElement>(`[${ATRIBUTO_TARJETA}]`).forEach((tarjeta) => {
        const contenido = normalizar(tarjeta.getAttribute(ATRIBUTO_TARJETA) ?? "");
        const mostrar = coincideCategoria && (termino.length === 0 || contenido.includes(termino));
        tarjeta.hidden = !mostrar;
        if (mostrar) visiblesBloque += 1;
      });

      bloque.hidden = visiblesBloque === 0;
      visiblesTotal += visiblesBloque;
    });

    setVisibles(visiblesTotal);
  }, [termino, categoria]);

  const hayFiltro = termino.length > 0 || categoria !== "todas";
  const sinResultados = hayFiltro && visibles === 0;

  const limpiar = () => {
    setTexto("");
    setCategoria("todas");
    inputRef.current?.focus();
  };

  const estado = !hayFiltro
    ? `${total} servicios en ${categorias.length} categorías.`
    : sinResultados
      ? "Sin resultados para esa búsqueda."
      : `${visibles} de ${total} servicios.`;

  return (
    <div className="sv-filtro">
      <div className="sv-filtro__bar">
        <div className="sv-filtro__campo">
          <label className="sv-filtro__label" htmlFor={idBusqueda}>
            Buscar un servicio
          </label>
          <span className="sv-filtro__lupa" aria-hidden="true">
            <IconLupa width={17} height={17} />
          </span>
          <input
            ref={inputRef}
            id={idBusqueda}
            className="sv-filtro__input"
            type="search"
            autoComplete="off"
            spellCheck={false}
            placeholder="Tienda, WhatsApp, API, reservas…"
            value={texto}
            aria-describedby={idEstado}
            onChange={(evento) => setTexto(evento.currentTarget.value)}
            onKeyDown={(evento) => {
              if (evento.key === "Escape" && texto.length > 0) {
                evento.preventDefault();
                setTexto("");
              }
            }}
          />
          {texto.length > 0 ? (
            <button
              type="button"
              className="sv-filtro__quitar"
              onClick={() => {
                setTexto("");
                inputRef.current?.focus();
              }}
            >
              Quitar texto
            </button>
          ) : null}
        </div>

        <p className="sv-filtro__estado" id={idEstado} role="status" aria-live="polite">
          {estado}
        </p>
      </div>

      <div className="sv-filtro__grupo" role="group" aria-label="Filtrar por categoría">
        <button
          type="button"
          className="sv-chip"
          aria-pressed={categoria === "todas"}
          onClick={() => setCategoria("todas")}
        >
          Todas
          <span className="sv-chip__num" aria-hidden="true">
            {total}
          </span>
        </button>
        {categorias.map((item) => (
          <button
            key={item.id}
            type="button"
            className="sv-chip"
            aria-pressed={categoria === item.id}
            onClick={() => setCategoria(categoria === item.id ? "todas" : item.id)}
          >
            {item.nombre}
            <span className="sv-chip__num" aria-hidden="true">
              {item.servicios.length}
            </span>
          </button>
        ))}
      </div>

      <div className="sv-vacio" hidden={!sinResultados}>
        <p className="sv-vacio__titulo">No encontramos ese servicio</p>
        <p className="sv-vacio__texto">
          Prueba con otra palabra o escríbenos: si necesitas algo distinto, lo evaluamos.
        </p>
        <div className="sv-vacio__acciones">
          <button type="button" className="sv-btn sv-btn--ghost" onClick={limpiar}>
            Limpiar filtros
          </button>
          <a className="sv-btn sv-btn--primary" href="mailto:ramcochile@gmail.com">
            Hablar con RAMNCO
          </a>
        </div>
      </div>
    </div>
  );
}
