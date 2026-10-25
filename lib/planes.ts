/* =====================================================================
   RAMNCO · planes, precios y modelo de trabajo
   Fuente única de `/planes`. Solo datos y formateadores: este módulo no
   importa React para que también se pueda usar desde cualquier server code.
   Todos los precios están en pesos chilenos, sin decimales.
   ===================================================================== */

/** Correo comercial de RAMNCO. */
export const CORREO = "ramcochile@gmail.com";

/** Enlace de contacto comercial. */
export const MAILTO = `mailto:${CORREO}`;

const PRECIO_CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

/** 150000 → "$150.000" (formato chileno, sin decimales). */
export function clp(monto: number): string {
  return PRECIO_CLP.format(monto);
}

/* ------------------------------------------------------------ marketing */

export type IdPlan = "esencial" | "crecimiento" | "premium";

export interface PlanMarketing {
  id: IdPlan;
  numero: string;
  nombre: string;
  /** Frase corta: para quién es el plan. */
  paraQuien: string;
  /** Inversión del servicio, en CLP por mes. */
  desde: number;
  /** El plan aparece destacado en la grilla y en el comparador. */
  destacado: boolean;
  incluyeWeb?: {
    titulo: string;
    detalle: string;
  };
  caracteristicas: string[];
}

export const PLANES_MARKETING: PlanMarketing[] = [
  {
    id: "esencial",
    numero: "Plan 1",
    nombre: "Esencial",
    paraQuien: "Para partir con pauta ordenada.",
    desde: 150_000,
    destacado: false,
    caracteristicas: [
      "1 canal: Google Ads o Meta Ads",
      "Configuración inicial de campañas",
      "Hasta 2 anuncios",
      "Optimización mensual",
      "Reporte mensual simple",
    ],
  },
  {
    id: "crecimiento",
    numero: "Plan 2",
    nombre: "Crecimiento",
    paraQuien: "Para escalar con dos canales y medir cada peso invertido.",
    desde: 280_000,
    destacado: true,
    incluyeWeb: {
      titulo: "Página web intermedia incluida",
      detalle: "Sin soporte mensual. Se trabaja y se entrega junto con la pauta.",
    },
    caracteristicas: [
      "2 canales: Google Ads + Meta Ads",
      "Calendario de contenido",
      "4 anuncios al mes",
      "Landing con captación de prospectos",
      "Panel de métricas",
      "Reporte mensual con recomendaciones",
    ],
  },
  {
    id: "premium",
    numero: "Plan 3",
    nombre: "Premium",
    paraQuien: "Para marcas que necesitan todos los canales y seguimiento fino.",
    desde: 450_000,
    destacado: false,
    incluyeWeb: {
      titulo: "Página web premium incluida",
      detalle: "Con SEO técnico y soporte gratis por 1 mes.",
    },
    caracteristicas: [
      "3 canales: Google Ads, Meta Ads y TikTok",
      "Remarketing",
      "A/B testing continuo",
      "CRM de seguimiento",
      "SEO on-page",
      "Reporte quincenal",
      "Reunión mensual",
    ],
  },
];

/** Nota obligatoria de los planes de marketing: la inversión publicitaria es aparte. */
export const NOTA_PAUTA =
  "La inversión publicitaria (el presupuesto que pagas directamente a Google, Meta o TikTok) se paga aparte y siempre queda a tu nombre.";

/* ------------------------------------------------- universidad de web */

export type IdSitio = "intermedia" | "premium" | "ecommerce";

export interface SitioWeb {
  id: IdSitio;
  nombre: string;
  /** Precio de referencia; `null` = cotización según alcance. */
  desde: number | null;
  resumen: string;
  caracteristicas: string[];
  /** Aviso destacado dentro de la tarjeta. */
  gancho?: string;
  /** Dominio del trabajo: plataforma propia o solución a medida. */
  entrega: string;
}

export const SITIOS_WEB: SitioWeb[] = [
  {
    id: "intermedia",
    nombre: "Web Intermedia",
    desde: 280_000,
    resumen: "La presencia ordenada para vender y recibir consultas.",
    caracteristicas: [
      "Hasta 6 secciones",
      "Diseño adaptado a tu marca",
      "Formulario y WhatsApp",
      "Optimización móvil",
    ],
    entrega: "Entrega en 2–3 semanas",
  },
  {
    id: "premium",
    nombre: "Web Premium",
    desde: 520_000,
    resumen: "Un sitio completo, rápido y pensado para captar.",
    caracteristicas: [
      "Secciones ilimitadas dentro del alcance",
      "Diseño a medida",
      "SEO técnico y de contenido",
      "Velocidad optimizada",
      "Blog o catálogo",
    ],
    gancho: "Soporte gratis 1 mes",
    entrega: "Entrega en 3–5 semanas",
  },
  {
    id: "ecommerce",
    nombre: "E-commerce / a medida",
    desde: null,
    resumen: "Tienda o sistema propio cuando el sitio estándar no alcanza.",
    caracteristicas: [
      "Tienda o sistema propio",
      "Pasarela de pago",
      "Gestión de productos y stock",
      "Integraciones: CRM, WhatsApp, ERP",
    ],
    entrega: "Se reemplaza WordPress/WooCommerce cuando conviene",
  },
];

/* --------------------------------------------------------- fases de pago */

export interface FasePago {
  nombre: string;
  porcentaje: number;
}

export const FASES_PAGO: FasePago[] = [
  { nombre: "Inicio", porcentaje: 33 },
  { nombre: "Piloto", porcentaje: 34 },
  { nombre: "Entrega", porcentaje: 33 },
];

/** Total de las fases: siempre 100%. */
export const FASES_PAGO_TOTAL = FASES_PAGO.reduce(
  (suma, fase) => suma + fase.porcentaje,
  0,
);

/* -------------------------------------------------- reemplazo de WordPress */

export const WORDPRESS = {
  titulo: "¿Tu sitio corre en WordPress/WooCommerce?",
  intro:
    "RAMNCO puede mejorarlo o reemplazarlo por una solución a medida. Sin cambiar de plataforma por cambiar: te mostramos qué se puede recuperar y qué conviene reconstruir.",
  beneficios: [
    {
      titulo: "Carga en milisegundos",
      detalle:
        "Las páginas se sirven construidas de antemano; dejan de depender de consultas a la base de datos en cada visita.",
    },
    {
      titulo: "Menos mantenimiento y parches",
      detalle:
        "Sin actualizaciones de núcleo, tema y decenas de plugins que hay que revisar cada mes.",
    },
    {
      titulo: "Menos brechas de seguridad",
      detalle:
        "Al no exponer un panel de administración público ni plugins de terceros, la superficie de ataque baja.",
    },
    {
      titulo: "Sin plugins de pago acumulados",
      detalle:
        "Los formularios, el SEO o la analítica se integran como parte del sitio, no como suscripciones nuevas.",
    },
    {
      titulo: "Tus datos son tuyos",
      detalle:
        "El sitio, el dominio y los contenidos quedan a tu nombre y se pueden exportar cuando quieras.",
    },
  ],
  cta: "Revisamos tu WordPress",
} as const;

/* ------------------------------------------------------------ apps */

export const APPS = {
  titulo: "Apps iOS y Android",
  intro:
    "Desarrollamos y publicamos aplicaciones para iPhone y Android: desde la primera versión hasta las actualizaciones.",
  etapas: [
    {
      titulo: "Desarrollo",
      detalle: "Alcance, diseño y desarrollo de la app para iOS y Android.",
    },
    {
      titulo: "Publicación",
      detalle: "Publicación en App Store y Google Play, con la cuenta y la ficha a tu nombre.",
    },
    {
      titulo: "ASO",
      detalle: "Título, descripción, palabras clave y capturas para aparecer en las búsquedas de las tiendas.",
    },
    {
      titulo: "Actualizaciones",
      detalle: "Cambios, correcciones y nuevas versiones cuando el producto lo necesite.",
    },
  ],
  cta: "Cotizar una app",
} as const;

/* ---------------------------------------------------- modelo de trabajo */

export interface EtapaTrabajo {
  numero: string;
  nombre: string;
  detalle: string;
}

export const ETAPAS_TRABAJO: EtapaTrabajo[] = [
  {
    numero: "01",
    nombre: "Inicio",
    detalle: "Reunión, diagnóstico, alcance, propuesta y planificación.",
  },
  {
    numero: "02",
    nombre: "Proyecto",
    detalle: "Diseño, desarrollo, revisiones, pruebas y aceptación.",
  },
  {
    numero: "03",
    nombre: "Entrega",
    detalle: "Publicación, capacitación y documentación.",
  },
  {
    numero: "04",
    nombre: "Post proyecto",
    detalle: "Garantía correctiva, soporte mensual, bolsa de horas o nuevos hitos.",
  },
];

/* --------------------------------------------------------- comparador */

/** La celda ✓ deja el detalle en `nota`, que se muestra bajo el plan en móvil. */
export interface CeldaPlan {
  incluido: boolean;
  nota?: string;
}

export interface FilaComparador {
  etiqueta: string;
  esencial: CeldaPlan;
  crecimiento: CeldaPlan;
  premium: CeldaPlan;
}

const NO: CeldaPlan = { incluido: false };

function si(nota?: string): CeldaPlan {
  return nota ? { incluido: true, nota } : { incluido: true };
}

export const FILAS_COMPARADOR: FilaComparador[] = [
  {
    etiqueta: "Canales",
    esencial: si("1 canal"),
    crecimiento: si("2 canales"),
    premium: si("3 canales"),
  },
  {
    etiqueta: "Anuncios al mes",
    esencial: si("Hasta 2"),
    crecimiento: si("4 al mes"),
    premium: si("A/B testing continuo"),
  },
  {
    etiqueta: "Landing con captación",
    esencial: NO,
    crecimiento: si(),
    premium: si(),
  },
  {
    etiqueta: "Calendario de contenido",
    esencial: NO,
    crecimiento: si(),
    premium: NO,
  },
  {
    etiqueta: "Panel de métricas",
    esencial: NO,
    crecimiento: si(),
    premium: si(),
  },
  {
    etiqueta: "Reportes",
    esencial: si("Mensual simple"),
    crecimiento: si("Mensual con recomendaciones"),
    premium: si("Quincenal + reunión mensual"),
  },
  {
    etiqueta: "Web incluida",
    esencial: NO,
    crecimiento: si("Web intermedia, sin soporte mensual"),
    premium: si("Web premium + SEO técnico"),
  },
  {
    etiqueta: "Soporte",
    esencial: NO,
    crecimiento: NO,
    premium: si("1 mes gratis con la web premium"),
  },
];

/* ---------------------------------------------------------------- FAQ */

export interface Pregunta {
  pregunta: string;
  respuesta: string;
}

export const FAQ: Pregunta[] = [
  {
    pregunta: "¿La inversión publicitaria está incluida?",
    respuesta: `${NOTA_PAUTA} En la cotización separamos siempre dos líneas: honorarios de RAMNCO e inversión en la plataforma.`,
  },
  {
    pregunta: "¿En cuánto tiempo veo resultados?",
    respuesta:
      "Depende del rubro, la competencia y el presupuesto. Lo que sí es constante: los primeros 30 días ordenamos cuentas, medición y campañas; desde ahí el reporte mensual o quincenal muestra crecimiento o desgaste, y con eso decidimos.",
  },
  {
    pregunta: "¿Puedo contratar solo la web?",
    respuesta:
      "Sí. El proyecto web se contrata solo, sin plan de marketing, y se paga en 3 fases: inicio, piloto y entrega. Si luego sumas pauta, la web ya queda lista para recibir tráfico y conversiones.",
  },
  {
    pregunta: "¿Qué pasa si tengo WordPress?",
    respuesta:
      "Revisamos el sitio actual y te decimos con honestidad si conviene mejorarlo o rehacerlo. Si la plataforma te frena, lo reemplazamos por una solución a medida, sin plugins acumulados y con los datos a tu nombre.",
  },
  {
    pregunta: "¿Hay contrato mínimo?",
    respuesta:
      "La pauta parte con una etapa mínima de 2 meses, que es el tiempo necesario para configurar, medir y ajustar con datos reales. Después seguimos mes a mes, en formato mensual.",
  },
];
