"use client";

import { useEffect, useRef, useState } from "react";
import type { CategoriaCatalogo } from "@/lib/catalogo";

/**
 * Barra de anclas sticky del catálogo.
 *
 * Es un `<nav>` con enlaces reales: funciona sin JavaScript y sin hidratación.
 * El script sólo agrega el resaltado de la categoría visible (scroll-spy) y
 * asegura que el chip activo quede a la vista en horizontal.
 */
export function NavegacionCategorias({
  categorias,
}: {
  categorias: Pick<CategoriaCatalogo, "id" | "nombre">[];
}) {
  const [activa, setActiva] = useState<string>(categorias[0]?.id ?? "");
  const listaRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const secciones = categorias
      .map((categoria) => document.getElementById(categoria.id))
      .filter((nodo): nodo is HTMLElement => nodo !== null);

    if (secciones.length === 0 || typeof IntersectionObserver === "undefined") return;

    const visibles = new Set<string>();

    const observer = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            visibles.add(entrada.target.id);
          } else {
            visibles.delete(entrada.target.id);
          }
        });

        // La primera categoría visible en el orden del documento gana.
        const primera = categorias.find((categoria) => visibles.has(categoria.id));
        if (primera) setActiva(primera.id);
      },
      { rootMargin: "-38% 0px -52% 0px", threshold: 0 },
    );

    secciones.forEach((seccion) => observer.observe(seccion));
    return () => observer.disconnect();
  }, [categorias]);

  useEffect(() => {
    const chip = listaRef.current?.querySelector<HTMLElement>(`[data-id="${activa}"]`);
    chip?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activa]);

  return (
    <nav className="sv-nav" aria-label="Categorías de servicios">
      <ul className="sv-nav__lista" ref={listaRef}>
        {categorias.map((categoria) => {
          const esActiva = categoria.id === activa;
          return (
            <li key={categoria.id}>
              <a
                className="sv-nav__link"
                href={`#${categoria.id}`}
                data-id={categoria.id}
                aria-current={esActiva ? "true" : undefined}
              >
                {categoria.nombre}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
