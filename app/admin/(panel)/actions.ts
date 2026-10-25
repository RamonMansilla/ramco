"use server";

/* Server Actions del panel interno RAMNCO.
   Un único archivo para las 4 secciones CRUD. Cada action:
   requireUser() → valida/normaliza → mutación Supabase → revalidatePath() → redirect con ?ok / ?error. */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import {
  INTERACTION_LABELS,
  PRIORITY_LABELS,
  PROJECT_STATUS_LABELS,
  QUOTE_STATUS_LABELS,
  STAGE_ORDER,
  TASK_STATUS_LABELS,
  type InteractionKind,
  type Priority,
  type ProjectStatus,
  type QuoteStatus,
  type TaskStatus,
} from "@/lib/ui";

type Supabase = Awaited<ReturnType<typeof requireUser>>["supabase"];

const PROJECT_STATUSES = Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[];
const QUOTE_STATUSES = Object.keys(QUOTE_STATUS_LABELS) as QuoteStatus[];
const TASK_STATUSES = Object.keys(TASK_STATUS_LABELS) as TaskStatus[];
const PRIORITIES = Object.keys(PRIORITY_LABELS) as Priority[];
const INTERACTION_KINDS = Object.keys(INTERACTION_LABELS) as InteractionKind[];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/* ------------------------------------------------------------ helpers */

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function nonEmpty(formData: FormData, key: string): string | null {
  const value = str(formData, key);
  return value.length > 0 ? value : null;
}

/** Número desde un <input type="number">; vacío → null. */
function toAmount(formData: FormData, key: string): number | null {
  const raw = str(formData, key);
  if (!raw) return null;
  const parsed = Number(raw.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

/** Fecha YYYY-MM-DD desde un <input type="date">; vacía o inválida → null. */
function toDate(formData: FormData, key: string): string | null {
  const raw = str(formData, key);
  return raw && DATE_RE.test(raw) ? raw : null;
}

function oneOf<T extends string>(
  raw: FormDataEntryValue | null,
  allowed: readonly T[],
): T | null {
  const value = typeof raw === "string" ? raw : "";
  return (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

function uuidOrNull(formData: FormData, key: string): string | null {
  const value = str(formData, key);
  return UUID_RE.test(value) ? value : null;
}

/** Preserva el filtro de tareas al volver desde una action. */
function tasksPath(formData: FormData): string {
  const vista = str(formData, "vista");
  return vista === "pendiente" || vista === "en_curso" || vista === "hecha"
    ? `/admin/tareas?estado=${vista}`
    : "/admin/tareas";
}

function goOk(path: string, message: string): never {
  const sep = path.includes("?") ? "&" : "?";
  redirect(`${path}${sep}ok=${encodeURIComponent(message)}`);
}

function goError(path: string, message: string): never {
  const sep = path.includes("?") ? "&" : "?";
  redirect(`${path}${sep}error=${encodeURIComponent(message)}`);
}

/** Correlativo COT-AAAA-NNN calculado en la action. */
async function nextQuoteNumber(supabase: Supabase): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `COT-${year}-`;

  const { data } = await supabase
    .from("quotes")
    .select("number")
    .like("number", `${prefix}%`);

  let max = 0;
  for (const row of (data ?? []) as Array<{ number: string | null }>) {
    const suffix = row.number ? row.number.slice(prefix.length) : "";
    const parsed = Number.parseInt(suffix, 10);
    if (Number.isInteger(parsed) && parsed > max) max = parsed;
  }

  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

/* ------------------------------------------------------------ leads */

export async function createLead(formData: FormData): Promise<void> {
  const { user, supabase } = await requireUser();

  const company = str(formData, "company");
  if (!company) goError("/admin/leads", "La empresa es obligatoria.");

  const estimatedValue = toAmount(formData, "estimated_value");
  if (estimatedValue !== null && estimatedValue < 0) {
    goError("/admin/leads", "El valor estimado no puede ser negativo.");
  }

  const stage = oneOf(formData.get("stage"), STAGE_ORDER) ?? "nuevo";

  const { error } = await supabase.from("leads").insert({
    company,
    contact_name: nonEmpty(formData, "contact_name"),
    email: nonEmpty(formData, "email"),
    phone: nonEmpty(formData, "phone"),
    website: nonEmpty(formData, "website"),
    industry: nonEmpty(formData, "industry"),
    source: nonEmpty(formData, "source") ?? "manual",
    stage,
    estimated_value: estimatedValue,
    owner_id: user.id,
    notes: nonEmpty(formData, "notes"),
  });

  if (error) goError("/admin/leads", `No se pudo crear el lead (${error.message}).`);

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  goOk("/admin/leads", `Lead «${company}» creado.`);
}

export async function updateLeadStage(formData: FormData): Promise<void> {
  const { supabase } = await requireUser();

  const id = str(formData, "id");
  if (!UUID_RE.test(id)) goError("/admin/leads", "Lead inválido.");
  const path = `/admin/leads/${id}`;

  const stage = oneOf(formData.get("stage"), STAGE_ORDER);
  if (!stage) goError(path, "Etapa inválida.");

  const estimatedValue = toAmount(formData, "estimated_value");
  if (estimatedValue !== null && estimatedValue < 0) {
    goError(path, "El valor estimado no puede ser negativo.");
  }

  const { error } = await supabase
    .from("leads")
    .update({ stage, estimated_value: estimatedValue })
    .eq("id", id);

  if (error) goError(path, `No se pudo actualizar el lead (${error.message}).`);

  revalidatePath(path);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  goOk(path, "Lead actualizado.");
}

export async function createInteraction(formData: FormData): Promise<void> {
  const { user, supabase } = await requireUser();

  const leadId = str(formData, "lead_id");
  if (!UUID_RE.test(leadId)) goError("/admin/leads", "Lead inválido.");
  const path = `/admin/leads/${leadId}`;

  const kind = oneOf(formData.get("kind"), INTERACTION_KINDS);
  if (!kind) goError(path, "Tipo de interacción inválido.");

  const subject = nonEmpty(formData, "subject");
  const body = nonEmpty(formData, "body");
  if (!subject && !body) goError(path, "Escribe un asunto o un detalle.");

  const { error } = await supabase.from("interactions").insert({
    lead_id: leadId,
    kind,
    subject,
    body,
    author_id: user.id,
  });

  if (error) goError(path, `No se pudo guardar la interacción (${error.message}).`);

  revalidatePath(path);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  goOk(path, "Interacción registrada.");
}

/* ------------------------------------------------------------ proyectos */

export async function createProject(formData: FormData): Promise<void> {
  const { user, supabase } = await requireUser();

  const name = str(formData, "name");
  if (!name) goError("/admin/proyectos", "El nombre del proyecto es obligatorio.");

  const clientName = str(formData, "client_name");
  if (!clientName) goError("/admin/proyectos", "El cliente es obligatorio.");

  const budget = toAmount(formData, "budget");
  if (budget !== null && budget < 0) goError("/admin/proyectos", "El presupuesto no puede ser negativo.");

  const status = oneOf(formData.get("status"), PROJECT_STATUSES) ?? "planificacion";

  const { error } = await supabase.from("projects").insert({
    lead_id: uuidOrNull(formData, "lead_id"),
    name,
    client_name: clientName,
    status,
    description: nonEmpty(formData, "description"),
    budget,
    start_date: toDate(formData, "start_date"),
    due_date: toDate(formData, "due_date"),
    repo_url: nonEmpty(formData, "repo_url"),
    deploy_url: nonEmpty(formData, "deploy_url"),
    owner_id: user.id,
  });

  if (error) goError("/admin/proyectos", `No se pudo crear el proyecto (${error.message}).`);

  revalidatePath("/admin/proyectos");
  revalidatePath("/admin");
  goOk("/admin/proyectos", `Proyecto «${name}» creado.`);
}

export async function updateProjectStatus(formData: FormData): Promise<void> {
  const { supabase } = await requireUser();

  const id = str(formData, "id");
  if (!UUID_RE.test(id)) goError("/admin/proyectos", "Proyecto inválido.");

  const status = oneOf(formData.get("status"), PROJECT_STATUSES);
  if (!status) goError("/admin/proyectos", "Estado inválido.");

  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", id);

  if (error) goError("/admin/proyectos", `No se pudo cambiar el estado (${error.message}).`);

  revalidatePath("/admin/proyectos");
  revalidatePath("/admin");
  goOk("/admin/proyectos", `Estado actualizado a «${PROJECT_STATUS_LABELS[status]}».`);
}

/* ------------------------------------------------------------ cotizaciones */

export async function createQuote(formData: FormData): Promise<void> {
  const { supabase } = await requireUser();

  const title = str(formData, "title");
  if (!title) goError("/admin/cotizaciones", "El título es obligatorio.");

  const amount = toAmount(formData, "amount") ?? 0;
  if (amount < 0) goError("/admin/cotizaciones", "El monto no puede ser negativo.");

  const status = oneOf(formData.get("status"), QUOTE_STATUSES) ?? "borrador";

  const manualNumber = nonEmpty(formData, "number");
  const automaticNumber = manualNumber === null;
  const number = manualNumber ?? (await nextQuoteNumber(supabase));

  const payload = {
    lead_id: uuidOrNull(formData, "lead_id"),
    number,
    title,
    amount,
    currency: "CLP",
    status,
    valid_until: toDate(formData, "valid_until"),
    sent_at: status === "enviada" ? new Date().toISOString() : null,
    notes: nonEmpty(formData, "notes"),
  };

  let { error } = await supabase.from("quotes").insert(payload);

  // Si el correlativo automático chocó con otra cotización, reintenta una vez.
  if (error && automaticNumber && error.code === "23505") {
    const retry = await supabase
      .from("quotes")
      .insert({ ...payload, number: await nextQuoteNumber(supabase) });
    error = retry.error;
  }

  if (error) goError("/admin/cotizaciones", `No se pudo crear la cotización (${error.message}).`);

  revalidatePath("/admin/cotizaciones");
  revalidatePath("/admin");
  goOk("/admin/cotizaciones", `Cotización ${number} creada.`);
}

export async function updateQuoteStatus(formData: FormData): Promise<void> {
  const { supabase } = await requireUser();

  const id = str(formData, "id");
  if (!UUID_RE.test(id)) goError("/admin/cotizaciones", "Cotización inválida.");

  const status = oneOf(formData.get("status"), QUOTE_STATUSES);
  if (!status) goError("/admin/cotizaciones", "Estado inválido.");

  const patch: { status: QuoteStatus; sent_at?: string } = { status };
  if (status === "enviada") patch.sent_at = new Date().toISOString();

  const { error } = await supabase.from("quotes").update(patch).eq("id", id);
  if (error) goError("/admin/cotizaciones", `No se pudo cambiar el estado (${error.message}).`);

  revalidatePath("/admin/cotizaciones");
  revalidatePath("/admin");
  goOk("/admin/cotizaciones", `Estado actualizado a «${QUOTE_STATUS_LABELS[status]}».`);
}

/* ------------------------------------------------------------ tareas */

export async function createTask(formData: FormData): Promise<void> {
  const { user, supabase } = await requireUser();

  const path = tasksPath(formData);
  const title = str(formData, "title");
  if (!title) goError(path, "El título de la tarea es obligatorio.");

  const status = oneOf(formData.get("status"), TASK_STATUSES) ?? "pendiente";
  const priority = oneOf(formData.get("priority"), PRIORITIES) ?? "media";
  const done = status === "hecha";

  const { error } = await supabase.from("tasks").insert({
    title,
    description: nonEmpty(formData, "description"),
    status,
    priority,
    due_date: toDate(formData, "due_date"),
    project_id: uuidOrNull(formData, "project_id"),
    lead_id: uuidOrNull(formData, "lead_id"),
    assignee_id: user.id,
    completed_at: done ? new Date().toISOString() : null,
  });

  if (error) goError(path, `No se pudo crear la tarea (${error.message}).`);

  revalidatePath("/admin/tareas");
  revalidatePath("/admin");
  goOk(path, `Tarea «${title}» creada.`);
}

export async function toggleTaskDone(formData: FormData): Promise<void> {
  const { supabase } = await requireUser();

  const path = tasksPath(formData);
  const id = str(formData, "id");
  if (!UUID_RE.test(id)) goError(path, "Tarea inválida.");

  const done = str(formData, "done") === "1";

  const { error } = await supabase
    .from("tasks")
    .update({
      status: done ? "hecha" : "pendiente",
      completed_at: done ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) goError(path, `No se pudo actualizar la tarea (${error.message}).`);

  revalidatePath("/admin/tareas");
  revalidatePath("/admin");
  goOk(path, done ? "Tarea marcada como hecha." : "Tarea reabierta.");
}
