/** Temas de color disponibles en el sitio. El id se guarda en una cookie. */

export const TEMA_COOKIE = "ramnco-tema";
export const TEMA_POR_DEFECTO = "nocturno";

export interface Tema {
  id: string;
  nombre: string;
  detalle: string;
  /** Colores de la muestra (fondo, acento, segundo acento). */
  muestra: [string, string, string];
  /** El texto de la muestra es claro (fondo oscuro). */
  oscuro: boolean;
}

export const TEMAS: Tema[] = [
  {
    id: "nocturno",
    nombre: "Noche creativa",
    detalle: "Púrpura y azul · la marca original",
    muestra: ["#07060F", "#B052FF", "#3D82FF"],
    oscuro: true,
  },
  {
    id: "corporativo",
    nombre: "Corporativo",
    detalle: "Azul institucional, sobrio y confiable",
    muestra: ["#070D1A", "#3B82F6", "#0EA5E9"],
    oscuro: true,
  },
  {
    id: "esmeralda",
    nombre: "Esmeralda",
    detalle: "Verde financiero sobre grafito",
    muestra: ["#06120F", "#10B981", "#34D399"],
    oscuro: true,
  },
  {
    id: "indigo",
    nombre: "Índigo",
    detalle: "Violeta serio y azul profundo",
    muestra: ["#080A1C", "#6366F1", "#8B5CF6"],
    oscuro: true,
  },
  {
    id: "grafito",
    nombre: "Grafito",
    detalle: "Neutro con acento dorado · premium",
    muestra: ["#101215", "#D4A853", "#B8935A"],
    oscuro: true,
  },
  {
    id: "claro",
    nombre: "Claro",
    detalle: "Fondo blanco para lectura ejecutiva",
    muestra: ["#F4F6F9", "#1D4ED8", "#0F766E"],
    oscuro: false,
  },
];

const IDS = new Set(TEMAS.map((tema) => tema.id));

/** Devuelve un id de tema válido. */
export function temaValido(valor: string | undefined | null): string {
  return valor && IDS.has(valor) ? valor : TEMA_POR_DEFECTO;
}

/** Devuelve el tema completo (o el de por defecto). */
export function buscarTema(valor: string | undefined | null): Tema {
  const id = temaValido(valor);
  return TEMAS.find((tema) => tema.id === id) ?? TEMAS[0];
}
