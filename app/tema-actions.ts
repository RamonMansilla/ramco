"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { TEMA_COOKIE, temaValido } from "@/lib/temas";

const UN_ANIO = 60 * 60 * 24 * 365;

/** Guarda el tema elegido en una cookie y vuelve a pintar la página. */
export async function guardarTema(formData: FormData): Promise<void> {
  const tema = temaValido(String(formData.get("tema") ?? ""));

  const store = await cookies();
  store.set(TEMA_COOKIE, tema, {
    path: "/",
    maxAge: UN_ANIO,
    sameSite: "lax",
  });

  revalidatePath("/", "layout");
}
