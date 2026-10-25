"use client";

/* Título del hero: escribe una frase gancho con efecto máquina de escribir
   y después alterna frases relacionadas con lo que hace RAMNCO. */

import { useEffect, useRef, useState } from "react";

import { Cursor } from "./maquina";

const ALTERNATIVAS = [
  "que vende por internet.",
  "que aparece primero.",
  "que no se detiene.",
  "que se mide.",
];

interface Props {
  /** Palabra gancho principal (la primera que se escribe). */
  primera?: string;
}

export function HeroMaquina({ primera = "comercial" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [fase, setFase] = useState<"pausa" | "escribiendo" | "listo">("pausa");
  const [texto, setTexto] = useState(primera);
  const [alternativa, setAlternativa] = useState<string | null>(null);
  const [indiceAlt, setIndiceAlt] = useState(0);
  const [borrando, setBorrando] = useState(false);

  /* 1. Escribe el gancho cuando el hero entra en pantalla. */
  useEffect(() => {
    const nodo = ref.current;
    const sinMovimiento =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (sinMovimiento || typeof IntersectionObserver === "undefined" || !nodo) {
      setFase("listo");
      return;
    }

    setFase("pausa");
    setTexto("");

    let temporizador = 0;
    let escrito = 0;

    const escribir = () => {
      escrito += 1;
      setTexto(primera.slice(0, escrito));
      if (escrito >= primera.length) {
        setFase("listo");
        return;
      }
      temporizador = window.setTimeout(escribir, 78);
    };

    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((entrada) => entrada.isIntersecting)) return;
        observador.disconnect();
        setFase("escribiendo");
        temporizador = window.setTimeout(escribir, 420);
      },
      { threshold: 0.25 },
    );

    observador.observe(nodo);

    return () => {
      observador.disconnect();
      window.clearTimeout(temporizador);
    };
  }, [primera]);

  /* 2. Cuando el gancho está completo, alterna la segunda línea. */
  useEffect(() => {
    if (fase !== "listo") return;

    const sinMovimiento =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sinMovimiento) return;

    let temporizador = 0;
    let escrito = 0;
    let borrandoLocal = false;

    const paso = () => {
      const actual = ALTERNATIVAS[indiceAlt] ?? "";

      if (!borrandoLocal) {
        escrito += 1;
        setAlternativa(actual.slice(0, escrito));
        if (escrito >= actual.length) {
          borrandoLocal = true;
          setBorrando(true);
          temporizador = window.setTimeout(paso, 2100);
          return;
        }
        temporizador = window.setTimeout(paso, 58);
        return;
      }

      escrito -= 1;
      setAlternativa(actual.slice(0, Math.max(escrito, 0)));
      if (escrito <= 0) {
        borrandoLocal = false;
        setBorrando(false);
        setIndiceAlt((previo) => (previo + 1) % ALTERNATIVAS.length);
        temporizador = window.setTimeout(paso, 280);
        return;
      }
      temporizador = window.setTimeout(paso, 26);
    };

    temporizador = window.setTimeout(paso, 700);
    return () => window.clearTimeout(temporizador);
  }, [fase, indiceAlt]);

  const activo = fase !== "listo" || Boolean(alternativa) || borrando;

  return (
    <div ref={ref} className="hero-mq">
      {/* Línea 1: la palabra gancho, en rojo, se escribe letra por letra */}
      <span className="hero-mq__linea1">
        Lleva tu marca al{" "}
        <span className="hero-mq__gancho">
          <span aria-hidden="true">{texto}</span>
          <span className="sr-only">{primera}</span>
          {fase !== "listo" ? <Cursor /> : null}
        </span>
      </span>

      {/* Línea 2: alterna frases cuando la primera terminó */}
      <span className="hero-mq__linea2 mq-bloque">
        {fase === "listo" ? (
          <>
            <span aria-hidden="true">
              {alternativa}
              <Cursor oculto={!activo} />
            </span>
            <span className="sr-only">{ALTERNATIVAS.join(" · ")}</span>
          </>
        ) : (
          <span className="hero-mq__fantasma" aria-hidden="true">
            &nbsp;
          </span>
        )}
      </span>
    </div>
  );
}
