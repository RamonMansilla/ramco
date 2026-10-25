import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/ui";
import { InvitarForm } from "./invitar-form";

export const metadata = { title: "Usuarios" };

interface Perfil {
  id: string;
  full_name: string;
  role: string;
  is_owner: boolean;
  disabled: boolean;
  created_at: string;
}

interface Invitacion {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  status: string;
  sent_at: string | null;
  created_at: string;
}

const ROL_LABEL: Record<string, string> = {
  owner: "Dueño",
  admin: "Administrador",
  member: "Miembro",
};

const ESTADO_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  enviada: "Enviada",
  aceptada: "Aceptada",
  cancelada: "Cancelada",
};

export default async function UsuariosPage() {
  const { supabase, user } = await requireUser();

  const [{ data: perfilesRaw }, { data: invitacionesRaw }, { data: miPerfil }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, role, is_owner, disabled, created_at")
      .order("created_at", { ascending: true }),
    supabase
      .from("invitations")
      .select("id, email, full_name, role, status, sent_at, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("is_owner").eq("id", user.id).maybeSingle(),
  ]);

  const perfiles = (perfilesRaw ?? []) as Perfil[];
  const invitaciones = (invitacionesRaw ?? []) as Invitacion[];
  const esDueno = Boolean(miPerfil?.is_owner);

  return (
    <div className="stack" style={{ gap: 22 }}>
      <div className="page-head">
        <div>
          <h1>Usuarios</h1>
          <p>Quién puede entrar al panel y con qué rol.</p>
        </div>
      </div>

      {esDueno ? (
        <section className="card stack">
          <div>
            <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Invitar a alguien</h2>
            <p className="dim" style={{ margin: "6px 0 0" }}>
              Le llega un correo con un enlace para crear su contraseña. Después entra a{" "}
              <span className="mono">ramnco.vercel.app/admin</span> con su propio correo.
            </p>
          </div>
          <InvitarForm />
        </section>
      ) : (
        <div className="alert">
          Solo el dueño de la cuenta puede invitar personas. Pídele que lo haga desde su sesión.
        </div>
      )}

      <section className="card stack">
        <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Personas con acceso</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Desde</th>
              </tr>
            </thead>
            <tbody>
              {perfiles.map((perfil) => (
                <tr key={perfil.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{perfil.full_name || "Sin nombre"}</div>
                    {perfil.id === user.id ? <span className="dim">eres tú</span> : null}
                  </td>
                  <td>
                    <span className={perfil.is_owner ? "badge badge--verde" : "badge"}>
                      {ROL_LABEL[perfil.role] ?? perfil.role}
                    </span>
                  </td>
                  <td>
                    {perfil.disabled ? (
                      <span className="badge badge--rojo">Desactivado</span>
                    ) : (
                      <span className="badge badge--azul">Activo</span>
                    )}
                  </td>
                  <td className="dim">{formatDateTime(perfil.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card stack">
        <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Invitaciones</h2>
        {invitaciones.length === 0 ? (
          <div className="empty">Todavía no has invitado a nadie.</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Enviada</th>
                </tr>
              </thead>
              <tbody>
                {invitaciones.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{inv.email}</div>
                      {inv.full_name ? <span className="dim">{inv.full_name}</span> : null}
                    </td>
                    <td className="dim">{ROL_LABEL[inv.role] ?? inv.role}</td>
                    <td>
                      <span className={inv.status === "aceptada" ? "badge badge--verde" : "badge badge--ambar"}>
                        {ESTADO_LABEL[inv.status] ?? inv.status}
                      </span>
                    </td>
                    <td className="dim">{inv.sent_at ? formatDateTime(inv.sent_at) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card stack">
        <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Cómo funciona</h2>
        <ol className="muted" style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
          <li>Invitas con el correo de la persona. Le llega un enlace para crear su contraseña.</li>
          <li>Entra a <span className="mono">ramnco.vercel.app/admin</span> con su correo y la clave que eligió.</li>
          <li>Aparece automáticamente en la lista de arriba, como <strong>Miembro</strong>.</li>
          <li>Si necesitas más control, se cambia su rol a <strong>Administrador</strong>.</li>
        </ol>
      </section>
    </div>
  );
}
