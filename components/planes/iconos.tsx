import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/**
 * Iconos propios de `/planes`. SVG inline, sin dependencias y decorativos
 * (`aria-hidden`): el texto cercano siempre nombra la acción o la idea.
 */
function base(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    width: 20,
    height: 20,
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

/** Marca de la comparación: ✓ */
export function IconCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m4.8 12.4 4.6 4.6 9.8-10.4" />
    </svg>
  );
}

/** Marca de la comparación: — */
export function IconDash(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5.4 12h13.2" />
    </svg>
  );
}

/** Avance al llamar a la acción */
export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h15.2" />
      <path d="m13.4 6.2 5.8 5.8-5.8 5.8" />
    </svg>
  );
}

/** Correo */
export function IconMail(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2.6" y="4.8" width="18.8" height="14.4" rx="2.8" />
      <path d="m3.8 6.8 8.2 5.8 8.2-5.8" />
    </svg>
  );
}

/** Pauta / canal de marketing */
export function IconTarget(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.4" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Búsqueda / WordPress en la comparación de plataformas */
export function IconSearch(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="7.1" />
      <path d="m16.2 16.2 4.2 4.2" />
    </svg>
  );
}

/** Sitio web / pantalla */
export function IconWindow(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2.8" y="4.4" width="18.4" height="15.2" rx="2.6" />
      <path d="M2.8 9.1h18.4" />
      <path d="M6.2 6.8h.01M8.8 6.8h.01" />
    </svg>
  );
}

/** App móvil */
export function IconPhone(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="6.4" y="2.8" width="11.2" height="18.4" rx="2.6" />
      <path d="M10.6 18.2h2.8" />
    </svg>
  );
}

/** Reemplazo / reconstrucción */
export function IconRefresh(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20.2 12a8.2 8.2 0 1 1-2.5-5.9" />
      <path d="M20.4 4.3v5.5H15" />
    </svg>
  );
}

/** Seguridad de los datos */
export function IconShield(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 2.9 4.8 5.8v5.5c0 4.4 3 8.1 7.2 9.8 4.2-1.7 7.2-5.4 7.2-9.8V5.8L12 2.9Z" />
      <path d="m8.9 11.9 2.2 2.2 4-4.3" />
    </svg>
  );
}
