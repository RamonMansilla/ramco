import type { Metadata } from "next";
import { login } from "./actions";

export const metadata: Metadata = { title: "Ingresar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "40px 20px",
        background:
          "radial-gradient(800px 400px at 20% 0%, rgba(19,211,167,.16), transparent 60%), radial-gradient(700px 400px at 90% 20%, rgba(37,99,235,.18), transparent 60%), var(--noche)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div className="row" style={{ marginBottom: 22 }}>
          <span className="admin__dot" />
          <strong style={{ letterSpacing: "0.18em", fontSize: ".95rem" }}>RAMCO</strong>
          <span className="dim">· panel interno</span>
        </div>

        <div className="card stack">
          <div>
            <h1 style={{ fontSize: "1.5rem", marginBottom: 4 }}>Ingresar</h1>
            <p className="dim" style={{ margin: 0 }}>
              Acceso solo para el equipo RAMCO.
            </p>
          </div>

          {params.error ? <div className="alert alert--error">{params.error}</div> : null}

          <form action={login} className="stack">
            <input type="hidden" name="next" value={params.next ?? "/admin"} />

            <label className="field" style={{ margin: 0 }}>
              <span className="label">Correo</span>
              <input
                className="input"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="ramcochile@gmail.com"
                required
              />
            </label>

            <label className="field" style={{ margin: 0 }}>
              <span className="label">Contraseña</span>
              <input
                className="input"
                type="password"
                name="password"
                autoComplete="current-password"
                required
              />
            </label>

            <button className="btn btn--primary" type="submit" style={{ width: "100%" }}>
              Entrar
            </button>
          </form>

          <p className="dim" style={{ margin: 0, textAlign: "center" }}>
            ¿Problemas para entrar? Escribe a <a href="mailto:ramcochile@gmail.com">ramcochile@gmail.com</a>
          </p>
        </div>

        <p className="dim" style={{ textAlign: "center", marginTop: 18 }}>
          <a href="/">← Volver al sitio</a>
        </p>
      </div>
    </main>
  );
}
