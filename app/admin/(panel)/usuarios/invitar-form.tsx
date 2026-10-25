"use client";

import { useActionState } from "react";
import { invitarUsuario, type InviteState } from "./actions";

const INICIAL: InviteState = { ok: false, message: "" };

export function InvitarForm() {
  const [estado, accion, pendiente] = useActionState(invitarUsuario, INICIAL);

  return (
    <form action={accion} className="stack">
      <div className="form-grid">
        <label className="field">
          <span className="label">Correo</span>
          <input
            className="input"
            type="email"
            name="email"
            placeholder="nombre@correo.cl"
            required
          />
        </label>

        <label className="field">
          <span className="label">Nombre</span>
          <input className="input" name="full_name" placeholder="Nombre y apellido" />
        </label>

        <label className="field">
          <span className="label">Rol</span>
          <select className="select" name="role" defaultValue="member">
            <option value="member">Miembro · usar el panel</option>
            <option value="admin">Administrador · gestionar todo</option>
          </select>
        </label>
      </div>

      {estado.message ? (
        <div className={estado.ok ? "alert alert--ok" : "alert alert--error"}>{estado.message}</div>
      ) : null}

      <button className="btn btn--primary" type="submit" disabled={pendiente}>
        {pendiente ? "Enviando…" : "Enviar invitación"}
      </button>
    </form>
  );
}
