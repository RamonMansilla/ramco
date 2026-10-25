"use client";

/* =====================================================================
   RAMNCO · títulos que se escriben solos
   ---------------------------------------------------------------------
   Efecto máquina de escribir sobre texto real:

   - El texto llega completo desde el servidor (SEO y lectores de pantalla
     siempre lo ven). Por eso el texto vive en el HTML y el cursor es
     decorativo.
   - Al entrar en pantalla (`IntersectionObserver`) el componente escribe
     letra por letra. Con `prefers-reduced-motion: reduce` no se oculta
     nada: aparece completo, sin animación.
   - `data-hook` marca las palabras que deben ir resaltadas en rojo.
   ===================================================================== */

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import "./maquina.css";

/* ------------------------------------------------------------- cursor */

/** Barra que parpadea mientras se escribe. */
export function Cursor({ oculto = false }: { oculto?: boolean }) {
  return (
    <span className="mq-cursor" data-oculto={oculto ? "si" : "no"} aria-hidden="true" />
  );
}

/* ------------------------------------------------------- máquina simple */

interface MaquinaProps {
  /** Texto plano que se escribe letra por letra. */
  texto: string;
  /** Retardo inicial en ms. */
  retardo?: number;
  /** Velocidad en ms por letra. */
  velocidad?: number;
  /** Clase extra para el <span> contenedor. */
  className?: string;
  /** Muestra el cursor al terminar. */
  cursorFinal?: boolean;
}

/**
 * Escribe un texto plano. Lee el texto de sus props, así que también
 * funciona en el servidor (HTML completo) y se anima al llegar a la vista.
 */
export function Maquina({
  texto,
  retardo = 0,
  velocidad = 45,
  className,
  cursorFinal = false,
}: MaquinaProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [visibles, setVisibles] = useState(texto.length);
  const [terminado, setTerminado] = useState(true);

  useEffect(() => {
    const nodo = ref.current;
    const sinMovimiento =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (sinMovimiento || typeof IntersectionObserver === "undefined" || !nodo) {
      return;
    }

    setVisibles(0);
    setTerminado(false);

    let temporizador = 0;
    let indice = 0;

    const escribir = () => {
      indice += 1;
      setVisibles(indice);
      if (indice >= texto.length) {
        setTerminado(true);
        return;
      }
      temporizador = window.setTimeout(escribir, velocidad);
    };

    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((entrada) => entrada.isIntersecting)) return;
        observador.disconnect();
        temporizador = window.setTimeout(escribir, retardo);
      },
      { threshold: 0.3 },
    );

    observador.observe(nodo);

    return () => {
      observador.disconnect();
      window.clearTimeout(temporizador);
    };
  }, [texto, retardo, velocidad]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{texto.slice(0, visibles)}</span>
      <span className="sr-only">{texto}</span>
      {cursorFinal ? <Cursor oculto={terminado} /> : null}
    </span>
  );
}

/* --------------------------------------------- título multimodo estático */

interface MultimodoProps {
  /** Frases que se alternan escribiendo y borrando. */
  frases: readonly string[];
  /** Cuánto queda escrita cada frase antes de borrarla. */
  pausa?: number;
  /** Velocidad al escribir (ms por letra). */
  velocidad?: number;
  /** Velocidad al borrar (ms por letra). */
  velocidadBorrado?: number;
}

/**
 * Alterna entre varias frases (escribe, pausa, borra, siguiente).
 * La primera frase va en el HTML del servidor; el resto se generan en el
 * cliente. Se detiene si el visitante pidió menos movimiento.
 */
export function Multimodo({
  frases,
  pausa = 1700,
  velocidad = 70,
  velocidadBorrado = 32,
}: MultimodoProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [texto, setTexto] = useState(frases[0] ?? "");

  useEffect(() => {
    const nodo = ref.current;
    const sinMovimiento =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (sinMovimiento || typeof IntersectionObserver === "undefined" || !nodo) {
      return;
    }

    let activo = false;
    let temporizador = 0;
    let indice = 0;
    let escrito = frases[0]?.length ?? 0;
    let borrando = false;

    const paso = () => {
      if (!activo) return;

      const actual = frases[indice] ?? "";

      if (!borrando) {
        escrito += 1;
        setTexto(actual.slice(0, escrito));
        if (escrito >= actual.length) {
          borrando = true;
          temporizador = window.setTimeout(paso, pausa);
          return;
        }
        temporizador = window.setTimeout(paso, velocidad);
        return;
      }

      escrito -= 1;
      setTexto(actual.slice(0, Math.max(escrito, 0)));
      if (escrito <= 0) {
        borrando = false;
        indice = (indice + 1) % frases.length;
        temporizador = window.setTimeout(paso, 260);
        return;
      }
      temporizador = window.setTimeout(paso, velocidadBorrado);
    };

    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((entrada) => entrada.isIntersecting)) return;
        observador.disconnect();
        activo = true;
        temporizador = window.setTimeout(paso, 260);
      },
      { threshold: 0.2 },
    );

    observador.observe(nodo);

    return () => {
      activo = false;
      observador.disconnect();
      window.clearTimeout(temporizador);
    };
  }, [frases, pausa, velocidad, velocidadBorrado]);

  return (
    <span ref={ref} className="mq-multimodo">
      <span aria-hidden="true">{texto}</span>
      <span className="sr-only">{frases.join(" · ")}</span>
      <Cursor />
    </span>
  );
}

/* ------------------------------------------------------ gancho (hook) */

/**
 * Palabra resaltada en rojo dentro de un título.
 * Envuelve texto normal: funciona en Server Components.
 */
export function Gancho({ children }: { children: ReactNode }) {
  return <span className="mq-hook">{children}</span>;
}

/* ------------------------------------------- revelador de una sola vez */

interface ClipProps {
  /** Duración total del revelado en ms. */
  duracion?: number;
  children: ReactNode;
  className?: string;
  /** Etiqueta del contenedor. */
  as?: "div" | "p" | "span" | "h2" | "h3";
}

/**
 * Revela el contenido con una máscara que se abre de arriba hacia abajo,
 * como si se estuviera escribiendo/descubriendo al llegar a esa sección.
 * El contenido queda siempre en el HTML (sin ocultar a lectores de pantalla).
 */
export function Revelar({ duracion = 900, children, className, as = "div" }: ClipProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    const nodo = ref.current;
    const sinMovimiento =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (sinMovimiento || typeof IntersectionObserver === "undefined" || !nodo) return;

    setActivo(false);
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((entrada) => entrada.isIntersecting)) return;
        setActivo(true);
        observador.disconnect();
      },
      { threshold: 0.25 },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  const Etiqueta = as as "div";

  return (
    <Etiqueta
      ref={ref as React.Ref<HTMLDivElement>}
      className={`mq-revelar${className ? ` ${className}` : ""}`}
      data-activo={activo ? "si" : "no"}
      style={{ ["--mq-duracion" as string]: `${duracion}ms` }}
    >
      {children}
    </Etiqueta>
  );
}
