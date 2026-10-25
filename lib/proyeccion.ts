/* =====================================================================
   RAMNCO · datos y cálculo de la proyección de ganancias
   ---------------------------------------------------------------------
   Todo es aritmética pura: sin `Date`, sin aleatoriedad, sin I/O.
   Así el HTML del servidor y el del cliente coinciden (no hay errores
   de hidratación) y la proyección se puede explicar línea por línea.

   La proyección NO usa porcentajes inventados: parte de cuatro
   supuestos que el visitante ve y puede mover con sliders.
   ===================================================================== */

/* ------------------------------------------------------------ parámetros */

/** Meses que cubre la proyección (mes 0 = hoy, mes 12 = cierre). */
export const MESES = 12;

/**
 * Crecimiento mensual que se asume SIN RAMNCO: compuesto y modesto.
 * Vender un poco más cada mes por inercia del negocio (boca a boca,
 * clientes que vuelven), sin ninguna acción de marketing nueva.
 */
export const CRECIMIENTO_SIN = 0.01;

/* ------------------------------------------------------------ tipos */

/** Los cuatro supuestos ajustables (ya saneados). */
export interface Supuestos {
  /** Ticket promedio por venta / proyecto, en CLP. */
  ticketClp: number;
  /** Ventas o consultas cerradas por mes hoy, en promedio. */
  ventasMes: number;
  /** Presupuesto de marketing mensual, en CLP. */
  presupuestoClp: number;
  /** Mejora esperada (%) en ventas atribuible a RAMNCO, sostenida 12 meses. */
  mejoraPct: number;
}

/** Un supuesto de texto con sus límites, para pintar los sliders. */
export interface RangoSupuesto {
  /** Campo de `Supuestos` que controla el slider. */
  campo: keyof Supuestos;
  /** Etiqueta visible. */
  etiqueta: string;
  /** Texto de apoyo corto (unidades, paso). */
  ayuda: string;
  min: number;
  max: number;
  step: number;
}

/** El supuesto `campo` en su valor mínimo se considera "inactivo". */
export type CampoSupuesto = RangoSupuesto["campo"];

/* ------------------------------------------------------------ rangos */

export const RANGOS: readonly RangoSupuesto[] = [
  {
    campo: "ticketClp",
    etiqueta: "Ticket promedio",
    ayuda: "Valor medio de una venta o proyecto (CLP).",
    min: 20_000,
    max: 2_000_000,
    step: 10_000,
  },
  {
    campo: "ventasMes",
    etiqueta: "Ventas actuales al mes",
    ayuda: "Transacciones o consultas cerradas por mes (0–80).",
    min: 0,
    max: 80,
    step: 1,
  },
  {
    campo: "presupuestoClp",
    etiqueta: "Inversión en marketing",
    ayuda: "Lo que inviertes por mes en publicidad y difusión (CLP).",
    min: 0,
    max: 2_000_000,
    step: 10_000,
  },
  {
    campo: "mejoraPct",
    etiqueta: "Mejora esperada en ventas",
    ayuda: "Puntos de venta extra que la estrategia RAMNCO debería sostener (%).",
    min: 0,
    max: 40,
    step: 1,
  },
];

/** Valores de partida: un negocio chico-mediano chileno con algo de inversión. */
export const SUPUESTOS_INICIALES: Supuestos = {
  ticketClp: 150_000,
  ventasMes: 10,
  presupuestoClp: 250_000,
  mejoraPct: 20,
};

/* ------------------------------------------------------------ saneo + formato */

/** Redondeo a peso: la proyección nunca muestra centavos. */
export function enClp(valor: number): number {
  return Math.round(valor);
}

/** Redondeo a 2 decimales para los valores de eje (p. ej. 1,23). */
export function redondear(valor: number, decimales = 2): number {
  const factor = 10 ** decimales;
  return Math.round(valor * factor) / factor;
}

/** Los cuatro supuestos siempre llegan como enteros (los sliders ya lo son). */
export function normalizar(supuestos: Supuestos): Supuestos {
  return {
    ticketClp: Math.round(supuestos.ticketClp),
    ventasMes: Math.round(supuestos.ventasMes),
    presupuestoClp: Math.round(supuestos.presupuestoClp),
    mejoraPct: Math.round(supuestos.mejoraPct),
  };
}

const formateadorClp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

/** "$150.000" */
export function formatoClp(valor: number): string {
  return formateadorClp.format(enClp(valor));
}

/**
 * Eje Y abreviado: "0", "500 mil", "2,5M", "10M". La unidad se ajusta al
 * valor para que nunca se lea como millones redondeados a cero.
 */
export function formatoMillones(valor: number): string {
  if (!Number.isFinite(valor) || valor <= 0) return "0";
  if (valor < 1_000_000) return `${Math.round(valor / 1000)} mil`;
  const millones = Math.round(valor / 100_000) / 10;
  return `${millones.toLocaleString("es-CL", { maximumFractionDigits: 1 })}M`;
}

/* ------------------------------------------------------------ proyección */

/** Una fila de la serie mensual. Todo en CLP enteros. */
export interface FilaProyeccion {
  /** 0 = hoy, 12 = fin del período. */
  mes: number;
  /** Ganancia acumulada del caso base, mes a mes. */
  acumuladoSin: number;
  /** Ganancia acumulada con RAMNCO. */
  acumuladoCon: number;
  /** Diferencia acumulada a este mes (nunca negativa). */
  diferencia: number;
  /** Ventas/mes que proyecta cada escenario en este mes. */
  ventasSin: number;
  ventasCon: number;
}

/** Resumen legible de un supuesto, ya aplicado. */
export interface DetalleProyeccion {
  /** Ventas por mes con las que arranca la proyección. */
  ventasBase: number;
  /** Ventas extra por mes que financian el presupuesto. */
  ventasFinanciadas: number;
  /** Costo fijo mensual de la estrategia (presupuesto + gestión). */
  costoEstrategia: number;
  /** Diferencia acumulada a los 12 meses (cifra destacada). */
  gananciaExtra: number;
  /** Inversión total en 12 meses. */
  inversionTotal: number;
}

export interface Proyeccion {
  filas: readonly FilaProyeccion[];
  detalle: DetalleProyeccion;
  /** Máximo de ganancia acumulada: techo del eje Y. */
  techo: number;
}

/**
 * Costo estimado por venta adicional que aporta la estrategia.
 * Sin ticket o sin mejora no hay costo (no hay campaña).
 */
function costoPorVenta(ticket: number, mejora: number): number {
  return mejora > 0 ? Math.max(20_000, Math.round(ticket * 0.12)) : 0;
}

/**
 * FÓRMULA (explícita, mes a mes, i = 1…12):
 *
 *   S(i) = ventasMes · 1,01^i                        ← sin RAMNCO
 *   C(i) = ventasMes · (1 + mejora/100)·1,01^i
 *
 *   gastoSin(i)   = 0
 *   gastoCon(i)   = presupuesto + ventasExtra(i) · costoPorVenta
 *   ventasExtra(i) = ventasMes · (mejora/100) · 1,01^i
 *
 *   ganancia(mes i) = ticket · ventas(i) − gasto(i)  → redondeada a CLP
 *   acumulado(i)    = acumulado(i−1) + ganancia(i)
 *   diferencia(i)   = max(0, acumuladoCon(i) − acumuladoSin(i))
 *
 * Sin RAMNCO: ingreso a 1% mensual compuesto, sin gastos.
 * Con RAMNCO: el mismo 1% de inercia MÁS la mejora esperada, con el
 * costo de la estrategia descontado mes a mes (no un ingreso bruto).
 * La cifra destacada es `acumuladoCon(12) − acumuladoSin(12)`.
 */
export function calcularProyeccion(supuestos: Supuestos): Proyeccion {
  const { ticketClp, ventasMes, presupuestoClp, mejoraPct } = normalizar(supuestos);
  const tasaMejora = mejoraPct / 100;
  const costo = costoPorVenta(ticketClp, mejoraPct);

  const ventasFinanciadas = tasaMejora > 0 ? Math.ceil(presupuestoClp / costo) : 0;
  const costoEstrategia = presupuestoClp + ventasFinanciadas * costo;

  const filas: FilaProyeccion[] = [];
  let acumuladoSin = 0;
  let acumuladoCon = 0;

  const mesCero: FilaProyeccion = {
    mes: 0,
    acumuladoSin: 0,
    acumuladoCon: 0,
    diferencia: 0,
    ventasSin: ventasMes,
    ventasCon: ventasMes,
  };
  filas.push(mesCero);

  for (let mes = 1; mes <= MESES; mes += 1) {
    const inercia = (1 + CRECIMIENTO_SIN) ** mes;
    const ventasSin = ventasMes * inercia;
    const ventasExtra = ventasMes * tasaMejora * inercia;
    const ventasCon = ventasSin + ventasExtra;

    const crecimientoVentas = Math.round(ventasCon - ventasMes);
    const gastoCon = presupuestoClp + crecimientoVentas * costo;

    const gananciaSin = enClp(ticketClp * ventasSin);
    const gananciaCon = enClp(ticketClp * ventasCon - gastoCon);

    acumuladoSin += gananciaSin;
    acumuladoCon += gananciaCon;

    filas.push({
      mes,
      acumuladoSin,
      acumuladoCon,
      diferencia: Math.max(0, acumuladoCon - acumuladoSin),
      ventasSin: Math.round(ventasSin),
      ventasCon: Math.round(ventasCon),
    });
  }

  const ultima = filas[filas.length - 1];

  return {
    filas,
    detalle: {
      ventasBase: ventasMes,
      ventasFinanciadas,
      costoEstrategia,
      gananciaExtra: ultima.diferencia,
      inversionTotal: presupuestoClp * MESES,
    },
    /* 1.16 deja aire arriba para que el área de la brecha no se salga del
       lienzo; en el gráfico se usa el mismo factor para la escala. */
    techo: Math.max(ultima.acumuladoSin, ultima.acumuladoCon, 1) * 1.16,
  };
}
