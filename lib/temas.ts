/** Temas de color disponibles en el sitio. El id se guarda en una cookie. */

export const TEMA_COOKIE = "ramnco-tema-consultoria";
export const TEMA_POR_DEFECTO = "consultoria";

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
    id: "consultoria",
    nombre: "Consultoría clara",
    detalle: "Blanco, azul marino y tonos neutros",
    muestra: ["#F5F7FA", "#234563", "#53748A"],
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
