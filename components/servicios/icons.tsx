import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/**
 * Iconos del catálogo de servicios.
 * Mismo lenguaje visual que `components/landing/icons.tsx`: SVG inline con
 * trazo de 1.7 sobre una grilla de 24, decorativos (`aria-hidden`) y sin
 * dependencias. Se mapean por la clave `icono` de cada categoría.
 */
function base(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    width: 22,
    height: 22,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

/** Aplicaciones: ventana con barra superior */
function IconApps(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2.8" y="3.6" width="18.4" height="16.8" rx="3" />
      <path d="M2.8 8.6h18.4" />
      <path d="M6.4 6.1h.01M9 6.1h.01" />
      <path d="M6.6 12.2h4.2v4.6H6.6zM13.8 12.2h3.6" />
    </svg>
  );
}

/** Páginas web: navegador */
function IconWeb(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.2 12h17.6" />
      <path d="M12 3c2.4 2.5 3.7 5.6 3.7 9s-1.3 6.5-3.7 9c-2.4-2.5-3.7-5.6-3.7-9S9.6 5.5 12 3Z" />
    </svg>
  );
}

/** Comercio electrónico: bolsa de compra */
function IconTienda(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.4 7.6h15.2l-1.3 11.2a1.9 1.9 0 0 1-1.9 1.6H7.6a1.9 1.9 0 0 1-1.9-1.6L4.4 7.6Z" />
      <path d="M8.6 10.1V6.4a3.4 3.4 0 1 1 6.8 0v3.7" />
    </svg>
  );
}

/** Paneles y gestión: tablero con tarjetas */
function IconPanel(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3.6" width="7.6" height="8" rx="2" />
      <rect x="13.4" y="3.6" width="7.6" height="5.2" rx="2" />
      <rect x="3" y="14.4" width="7.6" height="6" rx="2" />
      <rect x="13.4" y="11.6" width="7.6" height="8.8" rx="2" />
    </svg>
  );
}

/** Automatización: rayo */
function IconAuto(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M13.2 2.8 4.9 13.5h6L10.8 21l8.3-10.7h-6L13.2 2.8Z" />
    </svg>
  );
}

/** Kapso y WhatsApp: globo de conversación */
function IconChat(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20.4 11.4c0 4.2-3.8 7.6-8.4 7.6a9.7 9.7 0 0 1-2.7-.4l-4.1 1.9 1.2-3.8a7.2 7.2 0 0 1-2.8-5.3c0-4.2 3.8-7.6 8.4-7.6s8.4 3.4 8.4 7.6Z" />
      <path d="M9.2 11.5h.01M12 11.5h.01M14.8 11.5h.01" />
    </svg>
  );
}

/** Publicidad: megáfono */
function IconAds(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 10.2v3.6a2 2 0 0 0 2 2h1.6L17 20.4V3.6L7.6 8.2H6a2 2 0 0 0-2 2Z" />
      <path d="M7.6 15.8v3.4a1.8 1.8 0 0 0 3.6 0v-1.7" />
      <path d="M19.8 9.2a4.4 4.4 0 0 1 0 5.6" />
    </svg>
  );
}

/** Extractores y datos: base de datos */
function IconDatos(props: IconProps) {
  return (
    <svg {...base(props)}>
      <ellipse cx="12" cy="5.8" rx="7.4" ry="2.9" />
      <path d="M4.6 5.8v12.4c0 1.6 3.3 2.9 7.4 2.9s7.4-1.3 7.4-2.9V5.8" />
      <path d="M4.6 12c0 1.6 3.3 2.9 7.4 2.9s7.4-1.3 7.4-2.9" />
    </svg>
  );
}

/** APIs e integraciones: nodos conectados */
function IconApi(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="6" cy="6" r="2.6" />
      <circle cx="18" cy="6" r="2.6" />
      <circle cx="12" cy="18" r="2.6" />
      <path d="M7.8 7.9 10.7 15.6M16.2 7.9 13.3 15.6M8.6 6h6.8" />
    </svg>
  );
}

/** Soluciones especializadas: estrella de destello */
function IconEspecial(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
      <path d="M18.4 15.6l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8.8-2.1Z" />
    </svg>
  );
}

/** Publicación y soporte: escudo con check */
function IconSoporte(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 2.8 4.8 5.8v5.6c0 4.4 2.9 8.3 7.2 9.8 4.3-1.5 7.2-5.4 7.2-9.8V5.8L12 2.8Z" />
      <path d="m8.9 11.8 2.2 2.2 4-4.4" />
    </svg>
  );
}

/** Manzana (iOS): dibujo simple de contorno */
function IconApple(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M15.4 3.2c.2 1.6-.5 3-1.4 3.9-.9.9-2.1 1.5-3.4 1.4-.2-1.5.6-3 1.5-3.9.9-.9 2.3-1.5 3.3-1.4Z" />
      <path d="M18.1 8.8a4.3 4.3 0 0 0-2.4 1.1 3.9 3.9 0 0 0-1.6 3.2 4.4 4.4 0 0 0 2.3 3.6c.5.2.9.5 1.5.5M9.7 8.5c-2.7 0-4.9 2.2-4.9 5.5 0 4.3 2.9 6.8 4.6 6.8.9 0 1.4-.5 2.3-.5s1.4.5 2.3.5c1.4 0 3.5-1.7 4.2-4.6" />
    </svg>
  );
}

/** Robot Android: dibujo simple de contorno */
function IconAndroid(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5.4 10.6h13.2v6.2a2.4 2.4 0 0 1-2.4 2.4H7.8a2.4 2.4 0 0 1-2.4-2.4v-6.2Z" />
      <path d="m7.4 7.2-1.7-2.6M16.6 7.2l1.7-2.6" />
      <path d="M8.4 10.6a3.6 3.6 0 0 1 7.2 0" />
      <path d="M3.4 11.6v5M20.6 11.6v5" />
    </svg>
  );
}

/** Buscador: lupa */
function IconLupa(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10.8" cy="10.8" r="6.6" />
      <path d="m15.7 15.7 4.5 4.5" />
    </svg>
  );
}

/** Flecha hacia el final de la sección */
function IconArrowRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h15.2" />
      <path d="m13.4 6.2 5.8 5.8-5.8 5.8" />
    </svg>
  );
}

/** Destello pequeño para separar datos */
function IconSpark(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m12 3.2 2 5.4 5.4 2-5.4 2-2 5.4-2-5.4-5.4-2 5.4-2 2-5.4Z" />
    </svg>
  );
}

const ICONOS = {
  apps: IconApps,
  web: IconWeb,
  tienda: IconTienda,
  panel: IconPanel,
  auto: IconAuto,
  chat: IconChat,
  ads: IconAds,
  datos: IconDatos,
  api: IconApi,
  especial: IconEspecial,
  soporte: IconSoporte,
} as const;

export type ClaveIcono = keyof typeof ICONOS;

/** Devuelve el icono de una categoría; si la clave no existe, cae en `especial`. */
export function iconoDe(clave: string) {
  return ICONOS[clave as ClaveIcono] ?? ICONOS.especial;
}

export {
  IconApps,
  IconWeb,
  IconTienda,
  IconPanel,
  IconAuto,
  IconChat,
  IconAds,
  IconDatos,
  IconApi,
  IconEspecial,
  IconSoporte,
  IconApple,
  IconAndroid,
  IconLupa,
  IconArrowRight,
  IconSpark,
};
