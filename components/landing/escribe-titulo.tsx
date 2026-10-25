"use client";

import { useEffect, useRef, useState } from "react";

import { Cursor } from "@/components/maquina/maquina";

/* =====================================================================
   Título que se escribe solo al llegar a su sección.
   El texto completo llega en el HTML (SEO y lectores de pantalla lo ven
   siempre); la animación es decorativa y respeta `prefers-reduced-motion`.
   ===================================================================== */

interface Props {
  /** Texto completo del título, ya unido. */
  completo: string;
  /** Cuántos caracteres van en color normal. */
  corteAntes: number;
  /** Dónde termina la palabra gancho (en rojo). */
  corteGancho: number;
  velocidad?: number;
}

export function EscribeTitulo({ completo, corteAntes, corteGancho, velocidad = 26 }: Props) {
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [visibles, setVisibles] = useState(completo.length);
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    const nodo = ref.current;
    const sinMovimiento =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (sinMovimiento || typeof IntersectionObserver === "undefined" || !nodo) return;

    setVisibles(0);

    let temporizador = 0;
    let indice = 0;

    const escribir = () => {
      indice += 1;
      setVisibles(indice);
      if (indice >= completo.length) {
        setActivo(false);
        return;
      }
      temporizador = window.setTimeout(escribir, velocidad);
    };

    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((entrada) => entrada.isIntersecting)) return;
        observador.disconnect();
        setActivo(true);
        temporizador = window.setTimeout(escribir, 220);
      },
      { threshold: 0.35 },
    );

    observador.observe(nodo);

    return () => {
      observador.disconnect();
      window.clearTimeout(temporizador);
    };
  }, [completo, velocidad]);

  const texto = completo.slice(0, visibles);

  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {texto.slice(0, Math.min(texto.length, corteAntes))}
        <span className="mq-hook">{texto.slice(corteAntes, Math.min(texto.length, corteGancho))}</span>
        {texto.slice(corteGancho)}
      </span>
      <span className="sr-only">{completo}</span>
      {activo ? <Cursor /> : null}
    </span>
  );
}
