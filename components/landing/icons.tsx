import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/**
 * Base de todos los iconos: SVG inline, trazo de 1.7, sin dependencias.
 * Son decorativos por defecto (`aria-hidden`); el texto cercano da el nombre.
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

/* ---------------------------------------------------------------- navegación */

export function IconMenu(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.6 7.2h16.8M3.6 12h16.8M3.6 16.8h16.8" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6.4 6.4 11.2 11.2M17.6 6.4 6.4 17.6" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h15.2" />
      <path d="m13.4 6.2 5.8 5.8-5.8 5.8" />
    </svg>
  );
}

export function IconArrowDown(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4.2v15.4" />
      <path d="m5.9 13.6 6.1 6.1 6.1-6.1" />
    </svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2.6" y="4.8" width="18.8" height="14.4" rx="2.8" />
      <path d="m3.8 6.8 8.2 5.8 8.2-5.8" />
    </svg>
  );
}

/* ------------------------------------------------------------------- desafío */

/** Visibilidad */
export function IconEye(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2.6 12S6.1 5.6 12 5.6 21.4 12 21.4 12 17.9 18.4 12 18.4 2.6 12 2.6 12Z" />
      <circle cx="12" cy="12" r="3.1" />
    </svg>
  );
}

/** Inversión */
export function IconWallet(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="6" width="18" height="13" rx="3" />
      <path d="M3 10.4h18" />
      <circle cx="17" cy="14.8" r="1.2" />
    </svg>
  );
}

/** Ejecución */
export function IconGauge(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.9 18.4a9.1 9.1 0 1 1 16.2 0" />
      <path d="m12 14.1 3.7-4.7" />
      <circle cx="12" cy="16.3" r="1.5" />
    </svg>
  );
}

/* -------------------------------------------------------------------- método */

/** Estrategia */
export function IconCompass(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.9" />
      <path d="m15.6 8.4-2.2 5.1-5.1 2.2 2.2-5.1 5.1-2.2Z" />
    </svg>
  );
}

/** Campañas */
export function IconLayers(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m12 3.2 8.7 4.6-8.7 4.6-8.7-4.6L12 3.2Z" />
      <path d="m3.6 12.2 8.4 4.5 8.4-4.5" />
      <path d="m3.6 16.5 8.4 4.5 8.4-4.5" />
    </svg>
  );
}

/** Mejora / revisión constante */
export function IconRefresh(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20.3 12a8.3 8.3 0 1 1-2.6-6" />
      <path d="M20.5 4.2v5.6h-5.6" />
    </svg>
  );
}

/* ------------------------------------------------------------------- canales */

/** Google Ads: intención de búsqueda */
export function IconSearch(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="7.2" />
      <path d="m16.4 16.4 4.1 4.1" />
      <path d="M8.2 11h5.6" />
    </svg>
  );
}

/** Meta Ads: audiencias que se cruzan */
export function IconAudience(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="8.6" cy="12" r="5.2" />
      <circle cx="15.4" cy="12" r="5.2" />
    </svg>
  );
}

/* ------------------------------------------------------------------ medición */

/** Leads */
export function IconUserPlus(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9.6" cy="8.2" r="3.4" />
      <path d="M3.1 20a6.5 6.5 0 0 1 13 0" />
      <path d="M18.6 6.8v6M15.6 9.8h6" />
    </svg>
  );
}

/** Conversión */
export function IconTarget(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.6" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Inversión / resultados */
export function IconChart(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.4 19.6h17.2" />
      <path d="m5.6 15.5 4.2-4.3 3.2 3 5.4-6.1" />
      <path d="M14.2 8.1h4.2v4.2" />
    </svg>
  );
}

/* --------------------------------------------------------------------- extra */

/** Diagnóstico inicial */
export function IconClipboard(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4.8" y="4.6" width="14.4" height="16" rx="2.8" />
      <path d="M9.2 4.6V3.2h5.6v1.4" />
      <path d="m9.1 13.1 2.2 2.2 4-4.4" />
    </svg>
  );
}

/** Destello decorativo */
export function IconSpark(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m12 3.2 2 5.4 5.4 2-5.4 2-2 5.4-2-5.4-5.4-2 5.4-2 2-5.4Z" />
    </svg>
  );
}
