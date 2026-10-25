"use server";

import { createClient } from "@/lib/supabase/server";

export interface InviteState {
  ok: boolean;
  message: string;
}

const ROLES = new Set(["admin", "member"]);

function texto(valor: FormDataEntryValue | null): string {
  return typeof valor === "string" ? valor.trim() : "";
}

/**
 * Invita a una persona al panel.
 * Usa la API de administración de Supabase, que necesita la service_role key:
 * por eso esta acción solo se ejecuta en el servidor y solo para el dueño.
 */
export async function invitarUsuario(
  _estado: InviteState,
  formData: FormData,
): Promise<InviteState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sesión expirada. Vuelve a entrar." };

  const { data: perfil } = await supabase
    .from("profiles")
    .select("is_owner")
    .eq("id", user.id)
    .maybeSingle();

  if (!perfil?.is_owner) {
    return { ok: false, message: "Solo el dueño de la cuenta puede invitar." };
  }

  const email = texto(formData.get("email")).toLowerCase();
  const nombre = texto(formData.get("full_name"));
  const rol = ROLES.has(texto(formData.get("role"))) ? texto(formData.get("role")) : "member";

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, message: "Escribe un correo válido." };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return {
      ok: false,
      message:
        "Falta SUPABASE_SERVICE_ROLE_KEY en las variables de entorno del servidor. Agrégala en Vercel y vuelve a intentar.",
    };
  }

  // 1. Crear la invitación (la API envía el correo de acceso).
  const respuesta = await fetch(`${url}/auth/v1/invite`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      data: nombre ? { full_name: nombre } : {},
      redirect_to: "https://ramnco.vercel.app/admin/login",
    }),
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    const yaExiste = detalle.includes("already been registered") || detalle.includes("already registered");
    return {
      ok: false,
      message: yaExiste
        ? `${email} ya tiene cuenta. Pídele que entre y cambia su rol desde la lista.`
        : `No se pudo invitar: ${detalle.slice(0, 200)}`,
    };
  }

  const creado = (await respuesta.json()) as { id?: string };

  // 2. Ajustar el perfil con el rol elegido.
  if (creado.id) {
    await supabase.from("profiles").update({ role: rol, full_name: nombre || email }).eq("id", creado.id);
  }

  // 3. Registrar la invitación.
  await supabase.from("invitations").upsert(
    {
      email,
      full_name: nombre || null,
      role: rol,
      status: "enviada",
      invited_by: user.id,
      sent_at: new Date().toISOString(),
    },
    { onConflict: "email" },
  );

  return { ok: true, message: `Invitación enviada a ${email}. Revisa la bandeja (y el spam).` };
}
