"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ORIGENES = ["cartera_antigua", "base_propia", "ventas_perdidas", "cotizaciones", "otro"] as const;
const ESTADOS = ["pendiente", "contactado", "respondio", "cotizado", "recuperado", "descartado"] as const;

function texto(valor: FormDataEntryValue | null): string {
  return typeof valor === "string" ? valor.trim() : "";
}

function numero(valor: FormDataEntryValue | null): number | null {
  const crudo = texto(valor).replace(/\./g, "").replace(",", ".");
  if (!crudo) return null;
  const n = Number(crudo);
  return Number.isFinite(n) ? n : null;
}

function volver(ok: boolean, mensaje: string): never {
  const clave = ok ? "ok" : "error";
  redirect(`/admin/reactivacion?${clave}=${encodeURIComponent(mensaje)}`);
}

/* ------------------------------------------------------------ campañas */

export async function crearCampana(formData: FormData): Promise<void> {
  const { user, supabase } = await requireUser();

  const nombre = texto(formData.get("nombre"));
  if (!nombre) volver(false, "Ponle un nombre a la campaña.");

  const origen = ORIGENES.includes(texto(formData.get("origen")) as (typeof ORIGENES)[number])
    ? texto(formData.get("origen"))
    : "cartera_antigua";

  const { error } = await supabase.from("reactivation_campaigns").insert({
    nombre,
    origen,
    estado: "borrador",
    inactivos_desde_meses: Math.max(1, Math.min(120, numero(formData.get("meses")) ?? 6)),
    oferta: texto(formData.get("oferta")) || null,
    canal_principal: texto(formData.get("canal")) || "whatsapp",
    meta_contactos: Math.max(0, numero(formData.get("meta")) ?? 0),
    responsable_id: user.id,
  });

  if (error) volver(false, `No se pudo crear la campaña (${error.message}).`);

  revalidatePath("/admin/reactivacion");
  volver(true, `Campaña «${nombre}» creada.`);
}

export async function cambiarEstadoCampana(formData: FormData): Promise<void> {
  const { supabase } = await requireUser();

  const id = texto(formData.get("id"));
  const estado = texto(formData.get("estado"));
  if (!UUID_RE.test(id) || !["borrador", "en_curso", "pausada", "terminada"].includes(estado)) {
    volver(false, "Datos inválidos.");
  }

  const { error } = await supabase
    .from("reactivation_campaigns")
    .update({
      estado,
      fecha_inicio: estado === "en_curso" ? new Date().toISOString().slice(0, 10) : undefined,
    })
    .eq("id", id);

  if (error) volver(false, `No se pudo cambiar el estado (${error.message}).`);

  revalidatePath("/admin/reactivacion");
  volver(true, "Campaña actualizada.");
}

/* ------------------------------------------------------------ contactos */

export async function agregarContacto(formData: FormData): Promise<void> {
  const { supabase } = await requireUser();

  const campanaId = texto(formData.get("campaign_id"));
  if (!UUID_RE.test(campanaId)) volver(false, "Campaña inválida.");

  const nombre = texto(formData.get("nombre"));
  const empresa = texto(formData.get("empresa"));
  const telefono = texto(formData.get("telefono"));
  const email = texto(formData.get("email"));

  if (!nombre && !empresa && !telefono && !email) {
    volver(false, "Completa al menos un dato del contacto.");
  }

  const { error } = await supabase.from("reactivation_contacts").insert({
    campaign_id: campanaId,
    nombre: nombre || null,
    empresa: empresa || null,
    telefono: telefono || null,
    email: email || null,
    estado: "pendiente",
  });

  if (error) volver(false, `No se pudo agregar el contacto (${error.message}).`);

  revalidatePath("/admin/reactivacion");
  volver(true, "Contacto agregado.");
}

export async function marcarContacto(formData: FormData): Promise<void> {
  const { supabase } = await requireUser();

  const id = texto(formData.get("id"));
  const estado = texto(formData.get("estado"));
  if (!UUID_RE.test(id) || !ESTADOS.includes(estado as (typeof ESTADOS)[number])) {
    volver(false, "Datos inválidos.");
  }

  const valor = numero(formData.get("valor"));

  const { error } = await supabase
    .from("reactivation_contacts")
    .update({
      estado,
      valor_recuperado: estado === "recuperado" ? valor : null,
      ultimo_contacto: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) volver(false, `No se pudo actualizar el contacto (${error.message}).`);

  revalidatePath("/admin/reactivacion");
  volver(true, "Contacto actualizado.");
}
