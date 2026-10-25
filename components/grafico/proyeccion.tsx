"use client";

/* =====================================================================
   RAMNCO · gráfico de proyección de ganancias
   ---------------------------------------------------------------------
   Dos curvas a 12 meses ("Sin RAMNCO" / "Con RAMNCO") construidas a
   partir de supuestos que el propio visitante ajusta con sliders.

   Animación:
   - `IntersectionObserver`: al entrar al viewport las líneas se dibujan
     una sola vez (trazo progresivo), los puntos aparecen y los números
     hacen count-up desde 0.
   - Después de ese primer dibujo no se vuelve a animar: mover un slider
     sólo actualiza valores (sin parpadeo ni trazo reiniciado).
   - `prefers-reduced-motion: reduce` o navegador sin
     IntersectionObserver: todo visible de inmediato.

   Los cálculos viven en `lib/proyeccion.ts` y se memoizan con `useMemo`.
   ===================================================================== */

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  MESES,
  RANGOS,
  SUPUESTOS_INICIALES,
  calcularProyeccion,
  formatoClp,
  formatoMillones,
  redondear,
} from "@/lib/proyeccion";
import type { CampoSupuesto, FilaProyeccion, Supuestos } from "@/lib/proyeccion";

import "./proyeccion.css";

/* ------------------------------------------------------------ geometría */

/** Lienzo del SVG: se escala con el ancho vía `viewBox`. */
const ANCHO = 760;
const ALTO = 380;

const PADDING = { arriba: 34, derecha: 28, abajo: 46, izquierda: 64 } as const;

/** Caja útil donde viven las curvas. */
const CAJA = {
  x: PADDING.izquierda,
  y: PADDING.arriba,
  ancho: ANCHO - PADDING.izquierda - PADDING.derecha,
  alto: ALTO - PADDING.arriba - PADDING.abajo,
} as const;

interface Punto {
  x: number;
  y: number;
}

const xDe = (mes: number): number => CAJA.x + (CAJA.ancho * mes) / MESES;

/** Estado del trazo para un paso de animación (índice de mes). */
interface PasoAnimacion {
  /** Largo acumulado del trazo hasta ese mes. */
  largo: number;
  /** Índice del punto que corresponde a ese paso. */
  punto: number;
}

/**
 * Largo del trazo hasta cada mes. Un `largo` un pelo mayor que el real deja
 * el primer trazo fuera de vista; al final se suma 1 para cubrir cualquier
 * error de la aproximación poligonal.
 */
function construirPasos(puntos: readonly Punto[]): PasoAnimacion[] {
  const pasos: PasoAnimacion[] = [];
  let largo = 0;

  puntos.forEach((punto, indice) => {
    if (indice > 0) {
      const anterior = puntos[indice - 1];
      largo += Math.hypot(punto.x - anterior.x, punto.y - anterior.y);
    }
    pasos.push({ largo, punto: indice });
  });

  return pasos;
}

/** `path` de una línea de datos con las esquinas redondeadas. */
function trazoRedondo(puntos: readonly Punto[]): string {
  if (puntos.length === 0) return "";

  const radio = 9;
  let d = `M ${redondear(puntos[0].x)} ${redondear(puntos[0].y)}`;

  for (let i = 1; i < puntos.length - 1; i += 1) {
    const anterior = puntos[i - 1];
    const actual = puntos[i];
    const siguiente = puntos[i + 1];

    const antes = Math.hypot(actual.x - anterior.x, actual.y - anterior.y) || 1;
    const despues = Math.hypot(siguiente.x - actual.x, siguiente.y - actual.y) || 1;
    const r = Math.min(radio, antes / 2, despues / 2);

    const entraX = actual.x - ((actual.x - anterior.x) / antes) * r;
    const entraY = actual.y - ((actual.y - anterior.y) / antes) * r;
    const saleX = actual.x + ((siguiente.x - actual.x) / despues) * r;
    const saleY = actual.y + ((siguiente.y - actual.y) / despues) * r;

    d += ` L ${redondear(entraX)} ${redondear(entraY)}`;
    d += ` Q ${redondear(actual.x)} ${redondear(actual.y)} ${redondear(saleX)} ${redondear(saleY)}`;
  }

  const fin = puntos[puntos.length - 1];
  return `${d} L ${redondear(fin.x)} ${redondear(fin.y)}`;
}

/** Marcas del eje Y con valores "redondos" (1, 2, 2,5, 5 × 10^n) hasta el techo. */
function marcasY(techo: number, divisiones = 4): number[] {
  /* piso de seguridad: con una proyección en cero no hay logaritmo que tomar */
  const tope = Math.max(techo, 100_000);
  const bruto = tope / divisiones;
  const potencia = 10 ** Math.floor(Math.log10(bruto));
  const normalizado = bruto / potencia;
  const paso =
    (normalizado <= 1 ? 1 : normalizado <= 2 ? 2 : normalizado <= 2.5 ? 2.5 : normalizado <= 5 ? 5 : 10) *
    potencia;

  const marcas: number[] = [];
  for (let valor = 0; valor <= tope + paso * 0.001; valor += paso) {
    marcas.push(Math.round(valor));
  }
  return marcas;
}

/* ------------------------------------------------------------ count-up */

/**
 * Crecimiento mínimo que se le asume a la escena "Sin RAMNCO" para que la
 * curva no se confunda con el guion de la leyenda: gráficamente tiene que
 * verse más plana que gastando lo mismo en gastos fijos.
 */
const CURVA_SIN_MINIMA = -0.09;

/**
 * Lleva un número de 0 hasta `valor` con `requestAnimationFrame`.
 * - `activar === false` → muestra 0 mientras la sección no se ha visto.
 * - Si la animación inicial ya ocurrió (`yaAnimado`), los cambios se
 *   aplican al instante: ajustar un slider no vuelve a contar desde cero.
 */
function useContador(valor: number, activar: boolean, yaAnimado: boolean, duracion = 900): number {
  const [mostrado, setMostrado] = useState(0);

  useEffect(() => {
    if (!activar) {
      setMostrado(0);
      return;
    }

    if (yaAnimado) {
      setMostrado(valor);
      return;
    }

    let frame = 0;
    const inicio = performance.now();

    const paso = (ahora: number) => {
      const t = Math.min(1, (ahora - inicio) / duracion);
      const suave = 1 - (1 - t) ** 3;
      setMostrado(valor * suave);
      if (t < 1) frame = requestAnimationFrame(paso);
    };

    frame = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(frame);
  }, [activar, yaAnimado, valor, duracion]);

  return activar ? (yaAnimado ? valor : mostrado) : 0;
}

/**
 * Igual que `useContador`, pero arranca a contar en cuanto el componente
 * se monta en el navegador. Sirve para las cifras, que quedan visibles
 * aunque el visitante ya esté mirando esa parte de la página al cargar.
 * En el servidor devuelve 0 para que el HTML coincida al hidratar.
 */
function useContadorVisible(valor: number, duracion = 900): number {
  const [mostrado, setMostrado] = useState(0);

  useEffect(() => {
    let frame = 0;
    const inicio = performance.now();

    const paso = (ahora: number) => {
      const t = Math.min(1, (ahora - inicio) / duracion);
      const suave = 1 - (1 - t) ** 3;
      setMostrado(valor * suave);
      if (t < 1) frame = requestAnimationFrame(paso);
    };

    frame = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(frame);
  }, [valor, duracion]);

  return mostrado;
}

/* ------------------------------------------------------------ componente */

export function Proyeccion() {
  const [supuestos, setSupuestos] = useState<Supuestos>(SUPUESTOS_INICIALES);
  const [activo, setActivo] = useState(false);
  const seccionRef = useRef<HTMLElement | null>(null);

  /* --- entrada al viewport --- */

  useEffect(() => {
    const nodo = seccionRef.current;
    const sinMovimiento =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Sin observer o sin animación: mostrar todo ya. */
    if (!nodo || sinMovimiento || typeof IntersectionObserver === "undefined") {
      setActivo(true);
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((entrada) => entrada.isIntersecting)) return;
        setActivo(true);
        observador.disconnect();
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  /* --- cálculos puros, memoizados --- */

  const proyeccion = useMemo(() => calcularProyeccion(supuestos), [supuestos]);

  const curvas = useMemo(() => {
    const { filas, techo } = proyeccion;
    const alto = Math.max(techo, 1);

    /*
     * Escala del gráfico, en "ganancia equivalente del escenario con RAMNCO".
     * Las dos curvas parten del mismo punto (hoy). La curva "Con RAMNCO" usa
     * su acumulado real; la curva "Sin RAMNCO" se dibuja por debajo para que
     * la separación entre ambas sea visible: eso ES la ganancia adicional.
     * La escala se estira para que el área quepa completa en el lienzo.
     */
    const valorCon = filas.map((fila) => Math.max(fila.acumuladoCon, 0));
    const valorSin = filas.map((fila) => Math.max(fila.acumuladoSin, 0));
    const puntoCero = valorCon[0] ?? 0;

    const superiores = valorCon.map((valor, indice) => {
      const con = valor > puntoCero ? valor : puntoCero;
      const sin = valorSin[indice] ?? valor;
      /* La inferior siempre queda por debajo de la superior, con un mínimo
         de 1% de brecha para que jamás se superpongan. */
      const inferior = Math.min(sin, con * 0.985);
      return { con, sin: inferior };
    });

    const recorre = superiores.map((par) => par.con - par.sin);
    const totalRecorre = recorre.reduce((suma, valor) => suma + Math.max(valor, 0), 0);
    const maxSuperior = Math.max(...superiores.map((par) => par.con), 1);
    const altoNecesario = maxSuperior + totalRecorre;

    const y = (valor: number): number => CAJA.y + CAJA.alto - (CAJA.alto * valor) / altoNecesario;
    /** Cuánto hay que dividir los valores del eje para leerlos en esta escala. */
    const escalaY = altoNecesario / alto;

    const con: Punto[] = superiores.map((par, indice) => ({
      x: xDe(filas[indice]?.mes ?? indice),
      y: y(par.con),
    }));
    const sin: Punto[] = superiores.map((par, indice) => ({
      x: xDe(filas[indice]?.mes ?? indice),
      y: y(par.sin),
    }));

    const puntosSin = sin.map((p) => `${redondear(p.x)} ${redondear(p.y)}`).join(" L ");
    const puntosCon = con.map((p) => `${redondear(p.x)} ${redondear(p.y)}`).join(" L ");
    const puntosSinInvertidos = sin
      .slice()
      .reverse()
      .map((p) => `${redondear(p.x)} ${redondear(p.y)}`)
      .join(" L ");

    return {
      sin,
      con,
      trazoSin: trazoRedondo(sin),
      trazoCon: trazoRedondo(con),
      /* Área entre las dos curvas: la "ganancia adicional" dibujada. */
      areaEntre: `M ${puntosCon} L ${puntosSinInvertidos} Z`,
      pasosSin: construirPasos(sin),
      pasosCon: construirPasos(con),
      escalaY,
    };
  }, [proyeccion]);

  const marcas = useMemo(() => marcasY(proyeccion.techo / curvas.escalaY), [proyeccion.techo, curvas.escalaY]);
  const techoEje = marcas[marcas.length - 1] ?? 1;
  const yMarcas = (valor: number): number => CAJA.y + CAJA.alto - (CAJA.alto * valor) / techoEje;

  /* --- valores que animan --- */

  const final = proyeccion.filas[MESES] ?? proyeccion.filas[proyeccion.filas.length - 1];

  /*
   * `activar` llega a `true` por dos caminos: el observer (cuando la
   * sección entra en pantalla) o directamente en el efecto cuando no hay
   * animación posible. En ese segundo caso los valores salen ya animados
   * (`yaAnimado = true`), así el primer render coincide con el servidor.
   */
  const [yaAnimado, setYaAnimado] = useState(
    () => typeof window !== "undefined" && typeof IntersectionObserver === "undefined",
  );

  /* Si la sección es visible al cargar y nunca llega a "salir", el observer
     no se vuelve a disparar: este temporizador garantiza que los números
     muestren su valor aunque la observación inicial se haya perdido. */
  useEffect(() => {
    if (!activo) return;
    const temporizador = window.setTimeout(() => setYaAnimado(true), 1800);
    return () => window.clearTimeout(temporizador);
  }, [activo]);

  const gananciaExtra = useContadorVisible(proyeccion.detalle.gananciaExtra, 1100);
  const acumuladoCon = useContadorVisible(final.acumuladoCon, 1400);
  const acumuladoSin = useContadorVisible(final.acumuladoSin, 1400);
  const faseSin = useContador(MESES, activo, yaAnimado, 1500);
  const faseCon = useContador(MESES, activo, yaAnimado, 1700);

  const pasoCon = curvas.pasosCon[Math.min(MESES, Math.max(0, Math.round(faseCon)))] ?? curvas.pasosCon[0];
  const pasoSin = curvas.pasosSin[Math.min(MESES, Math.max(0, Math.round(faseSin)))] ?? curvas.pasosSin[0];

  /* --- interacción --- */

  const actualizar = (campo: CampoSupuesto, valor: number): void => {
    setSupuestos((previos) => ({ ...previos, [campo]: valor }));
  };

  const soltar = (evento: ReactPointerEvent<HTMLInputElement>): void => {
    evento.currentTarget.blur();
  };

  const detalle = (fila: FilaProyeccion): string =>
    fila.mes === 0
      ? `Hoy · ${formatoClp(fila.acumuladoSin)} acumulados`
      : `Mes ${fila.mes} · Con RAMNCO ${formatoClp(fila.acumuladoCon)} · Sin RAMNCO ${formatoClp(
          fila.acumuladoSin,
        )} · Ganancia extra ${formatoClp(fila.diferencia)}`;

  return (
    <section
      ref={seccionRef}
      className="py-proyeccion"
      data-listo={activo ? "si" : "no"}
      aria-labelledby="py-proyeccion-titulo"
    >
      <header className="py-cabecera">
        <p className="py-eyebrow">Proyección de ganancias</p>
        <h2 className="py-titulo" id="py-proyeccion-titulo">
          Lo que ya haces hoy, <span className="py-titulo-marca">con más ventas</span>.
        </h2>
        <p className="py-bajada">
          Mueve los supuestos y mira la diferencia entre seguir igual y trabajar la estrategia
          con RAMNCO. Todo es aritmética a la vista: ni un porcentaje de folleto.
        </p>
      </header>

      <div className="py-cifra">
        <p className="py-cifra-etiqueta">Ganancia adicional estimada en 12 meses</p>
        <p className="py-cifra-valor">{formatoClp(gananciaExtra)}</p>
        <p className="py-cifra-nota">
          Ganancia acumulada con RAMNCO {formatoClp(acumuladoCon)} menos la del escenario sin
          RAMNCO {formatoClp(acumuladoSin)}. Ya descuenta la inversión de{" "}
          {formatoClp(proyeccion.detalle.inversionTotal)} en 12 meses.
        </p>
      </div>

      <div className="py-tablero">
        <div className="py-grafico">
          <div className="py-leyenda" aria-hidden="true">
            <span className="py-leyenda-item py-leyenda-item--sin">
              <span className="py-leyenda-linea" />
              <span className="py-leyenda-nombre py-leyenda-nombre--sin">Sin RAMNCO</span>
            </span>
            <span className="py-leyenda-item py-leyenda-item--con">
              <span className="py-leyenda-linea" />
              <span className="py-leyenda-nombre py-leyenda-nombre--con">Con RAMNCO</span>
            </span>
          </div>

          <svg
            className="py-svg"
            viewBox={`0 0 ${ANCHO} ${ALTO}`}
            role="img"
            preserveAspectRatio="xMidYMid meet"
            aria-labelledby="py-svg-titulo py-svg-desc"
          >
            <title id="py-svg-titulo">Proyección de ganancia acumulada a 12 meses</title>
            <desc id="py-svg-desc">
              Sin RAMNCO al mes 12: {formatoClp(final.acumuladoSin)}. Con RAMNCO:{" "}
              {formatoClp(final.acumuladoCon)}. Diferencia acumulada: {formatoClp(final.diferencia)}.
            </desc>

            <defs>
              <linearGradient id="py-grad-entre" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--py-con)" stopOpacity="0.3" />
                <stop offset="55%" stopColor="var(--py-con)" stopOpacity="0.13" />
                <stop offset="100%" stopColor="var(--py-con)" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            <g className="py-grilla" aria-hidden="true">
              {marcas.map((valor) => {
                const y = yMarcas(valor);
                return (
                  <g key={valor}>
                    <line
                      x1={CAJA.x}
                      x2={CAJA.x + CAJA.ancho}
                      y1={y}
                      y2={y}
                      vectorEffect="non-scaling-stroke"
                    />
                    <text x={CAJA.x - 12} y={y + 4} textAnchor="end">
                      {formatoMillones(valor)}
                    </text>
                  </g>
                );
              })}
            </g>

            <path className="py-area" d={curvas.areaEntre} fill="url(#py-grad-entre)" />

            <g className="py-meses" aria-hidden="true">
              {proyeccion.filas.map((fila) => (
                <text key={fila.mes} x={xDe(fila.mes)} y={CAJA.y + CAJA.alto + 22} textAnchor="middle">
                  {fila.mes}
                </text>
              ))}
              <text
                className="py-meses-titulo"
                x={CAJA.x + CAJA.ancho / 2}
                y={CAJA.y + CAJA.alto + 40}
                textAnchor="middle"
              >
                meses
              </text>
            </g>

            {/*
              La línea "Sin RAMNCO" va por el punto medio de la brecha: se ve
              siempre separada de la curva "Con RAMNCO" (que es la cifra real).
            */}
            <path
              className="py-linea py-linea--sin"
              d={curvas.trazoSin}
              vectorEffect="non-scaling-stroke"
              style={{
                strokeDasharray: pasoSin.largo * 1.4,
                strokeDashoffset: pasoSin.largo * 1.4 - pasoSin.largo,
              }}
            />

            <path
              className="py-linea py-linea--con"
              d={curvas.trazoCon}
              vectorEffect="non-scaling-stroke"
              style={{
                strokeDasharray: pasoCon.largo * 1.4,
                strokeDashoffset: pasoCon.largo * 1.4 - pasoCon.largo,
              }}
            />

            <g className="py-puntos">
              {proyeccion.filas.map((fila, indice) => {
                const puntoSin = curvas.sin[indice];
                const puntoCon = curvas.con[indice];
                const ultimo = fila.mes === MESES;

                return (
                  <g key={fila.mes}>
                    {/* los puntos del escenario "sin" viven en el punto medio de la brecha */}
                    <circle
                      className="py-punto py-punto--sin"
                      cx={puntoSin.x}
                      cy={puntoSin.y}
                      r={ultimo ? 5 : 3.2}
                      data-visible={faseSin >= indice - 0.35 ? "si" : "no"}
                    >
                      <title>{`Sin RAMNCO · ${detalle(fila)}`}</title>
                    </circle>
                    <circle
                      className="py-punto py-punto--con"
                      cx={puntoCon.x}
                      cy={puntoCon.y}
                      r={ultimo ? 5.6 : 3.6}
                      data-visible={faseCon >= indice - 0.35 ? "si" : "no"}
                    >
                      <title>{`Con RAMNCO · ${detalle(fila)}`}</title>
                    </circle>
                  </g>
                );
              })}
            </g>
          </svg>

          <p className="py-svg-nota">
            Ganancia acumulada en pesos. Pasa el cursor por un punto para ver el detalle del mes.
          </p>
        </div>

        <div className="py-controles">
          <h3 className="py-controles-titulo">Ajusta tus supuestos</h3>

          {RANGOS.map((rango) => {
            const valor = supuestos[rango.campo];
            const esClp = rango.campo === "ticketClp" || rango.campo === "presupuestoClp";
            const id = `py-slider-${rango.campo}`;
            const avance = ((valor - rango.min) / (rango.max - rango.min)) * 100;

            return (
              <div className="py-control" key={rango.campo}>
                <div className="py-control-cabeza">
                  <label htmlFor={id}>{rango.etiqueta}</label>
                  <output htmlFor={id} className="py-control-valor">
                    {esClp
                      ? formatoClp(valor)
                      : rango.campo === "mejoraPct"
                        ? `+${valor}%`
                        : `${valor} al mes`}
                  </output>
                </div>
                <input
                  id={id}
                  className="py-slider"
                  type="range"
                  min={rango.min}
                  max={rango.max}
                  step={rango.step}
                  value={valor}
                  onChange={(evento) => actualizar(rango.campo, Number(evento.target.value))}
                  onPointerUp={soltar}
                  aria-describedby={`${id}-ayuda`}
                  style={{ ["--py-avance" as string]: `${avance}%` }}
                />
                <p className="py-control-ayuda" id={`${id}-ayuda`}>
                  {rango.ayuda}
                </p>
              </div>
            );
          })}

          <p className="py-aviso">
            Proyección estimada; no es una garantía de resultados. Ajusta los supuestos a tu
            negocio.
          </p>
        </div>
      </div>

      <dl className="py-desglose">
        <div>
          <dt>Ventas extra al mes (mes 12)</dt>
          <dd>{Math.max(0, final.ventasCon - final.ventasSin)} ventas</dd>
        </div>
        <div>
          <dt>Costo fijo mensual de la estrategia</dt>
          <dd>{formatoClp(proyeccion.detalle.costoEstrategia)}</dd>
        </div>
        <div>
          <dt>Inversión total en 12 meses</dt>
          <dd>{formatoClp(proyeccion.detalle.inversionTotal)}</dd>
        </div>
      </dl>
    </section>
  );
}
