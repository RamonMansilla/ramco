/* Tipos, etiquetas y formateadores compartidos por el panel */

export type Stage =
  | "nuevo"
  | "contactado"
  | "reunion"
  | "propuesta"
  | "negociacion"
  | "ganado"
  | "perdido";

export type ProjectStatus =
  | "planificacion"
  | "en_curso"
  | "pausado"
  | "entregado"
  | "cancelado";

export type QuoteStatus = "borrador" | "enviada" | "aceptada" | "rechazada";

export type TaskStatus = "pendiente" | "en_curso" | "hecha";

export type Priority = "baja" | "media" | "alta";

export type InteractionKind = "email" | "llamada" | "reunion" | "whatsapp" | "nota";

export interface Lead {
  id: string;
  company: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  industry: string | null;
  source: string | null;
  stage: Stage;
  estimated_value: number | null;
  owner_id: string | null;
  notes: string | null;
  last_contact_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  lead_id: string;
  kind: InteractionKind;
  subject: string | null;
  body: string | null;
  happened_at: string;
  author_id: string | null;
  created_at: string;
}

export interface Project {
  id: string;
  lead_id: string | null;
  name: string;
  client_name: string;
  status: ProjectStatus;
  description: string | null;
  budget: number | null;
  start_date: string | null;
  due_date: string | null;
  repo_url: string | null;
  deploy_url: string | null;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  lead_id: string | null;
  number: string | null;
  title: string;
  amount: number;
  currency: string;
  status: QuoteStatus;
  valid_until: string | null;
  sent_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  due_date: string | null;
  project_id: string | null;
  lead_id: string | null;
  assignee_id: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface Profile {
  id: string;
  full_name: string;
  role: "owner" | "admin" | "member";
  created_at: string;
}

/* ------------------------------------------------------------ etiquetas */

export const STAGE_LABELS: Record<Stage, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  reunion: "Reunión",
  propuesta: "Propuesta",
  negociacion: "Negociación",
  ganado: "Ganado",
  perdido: "Perdido",
};

export const STAGE_ORDER: Stage[] = [
  "nuevo",
  "contactado",
  "reunion",
  "propuesta",
  "negociacion",
  "ganado",
  "perdido",
];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planificacion: "Planificación",
  en_curso: "En curso",
  pausado: "Pausado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  borrador: "Borrador",
  enviada: "Enviada",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pendiente: "Pendiente",
  en_curso: "En curso",
  hecha: "Hecha",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
};

export const INTERACTION_LABELS: Record<InteractionKind, string> = {
  email: "Correo",
  llamada: "Llamada",
  reunion: "Reunión",
  whatsapp: "WhatsApp",
  nota: "Nota",
};

/** Clase de badge (CSS) según el estado. */
export function stageBadge(stage: Stage): string {
  switch (stage) {
    case "ganado":
      return "badge badge--verde";
    case "perdido":
      return "badge badge--rojo";
    case "propuesta":
    case "negociacion":
      return "badge badge--azul";
    case "reunion":
    case "contactado":
      return "badge badge--ambar";
    default:
      return "badge";
  }
}

export function projectBadge(status: ProjectStatus): string {
  switch (status) {
    case "entregado":
      return "badge badge--verde";
    case "cancelado":
      return "badge badge--rojo";
    case "en_curso":
      return "badge badge--azul";
    case "pausado":
      return "badge badge--ambar";
    default:
      return "badge";
  }
}

export function quoteBadge(status: QuoteStatus): string {
  switch (status) {
    case "aceptada":
      return "badge badge--verde";
    case "rechazada":
      return "badge badge--rojo";
    case "enviada":
      return "badge badge--azul";
    default:
      return "badge";
  }
}

export function priorityBadge(priority: Priority): string {
  switch (priority) {
    case "alta":
      return "badge badge--rojo";
    case "media":
      return "badge badge--ambar";
    default:
      return "badge";
  }
}

/* ------------------------------------------------------------ formato */

const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export function formatMoney(value: number | null | undefined, currency = "CLP"): string {
  if (value === null || value === undefined) return "—";
  if (currency === "CLP") return clp.format(value);
  return new Intl.NumberFormat("es-CL", { style: "currency", currency }).format(value);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** "hace 3 días" / "en 2 días" */
export function relativeDays(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const days = Math.round((d.getTime() - Date.now()) / 86_400_000);
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  return rtf.format(days, "day");
}
