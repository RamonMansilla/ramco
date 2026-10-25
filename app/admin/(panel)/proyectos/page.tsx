import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import {
  PROJECT_STATUS_LABELS,
  formatDate,
  formatMoney,
  projectBadge,
  relativeDays,
  type Lead,
  type Project,
  type ProjectStatus,
} from "@/lib/ui";
import { createProject, updateProjectStatus } from "../actions";

export const metadata: Metadata = { title: "Proyectos" };

type SearchParams = { [key: string]: string | string[] | undefined };

const PROJECT_STATUSES = Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[];

function pick(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Enlace seguro: solo http(s), agregando esquema si falta. */
function safeHttpUrl(value: string | null): string | null {
  if (!value) return null;
  const raw = value.trim();
  if (!raw) return null;
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const ok = pick(params.ok);
  const error = pick(params.error);

  const { supabase } = await requireUser();

  const [{ data: projectsData, error: projectsError }, { data: leadsData }] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }).limit(500),
    supabase.from("leads").select("id, company").order("company", { ascending: true }).limit(500),
  ]);

  const projects = (projectsData ?? []) as Project[];
  const leads = (leadsData ?? []) as Array<Pick<Lead, "id" | "company">>;

  const active = projects.filter(
    (project) => project.status === "planificacion" || project.status === "en_curso",
  ).length;
  const totalBudget = projects.reduce((sum, project) => sum + (project.budget ?? 0), 0);

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1>Proyectos</h1>
          <p>
            {projects.length} en total · {active} activos · {formatMoney(totalBudget)} presupuestados
          </p>
        </div>
      </div>

      {ok ? <div className="alert alert--ok">{ok}</div> : null}
      {error ? <div className="alert alert--error">{error}</div> : null}
      {projectsError ? (
        <div className="alert alert--error">
          No se pudieron cargar los proyectos ({projectsError.message}).
        </div>
      ) : null}

      <div className="card">
        {projects.length === 0 ? (
          <div className="empty">Todavía no hay proyectos. Crea el primero abajo.</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Proyecto</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Presupuesto</th>
                  <th>Vencimiento</th>
                  <th>Enlaces</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => {
                  const repo = safeHttpUrl(project.repo_url);
                  const deploy = safeHttpUrl(project.deploy_url);
                  return (
                    <tr key={project.id}>
                      <td>
                        <span style={{ fontWeight: 600 }}>{project.name}</span>
                        {project.description ? (
                          <div
                            className="dim"
                            style={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis" }}
                          >
                            {project.description}
                          </div>
                        ) : null}
                      </td>
                      <td>{project.client_name}</td>
                      <td>
                        <form action={updateProjectStatus} className="row" style={{ gap: 6 }}>
                          <input type="hidden" name="id" value={project.id} />
                          <span className={projectBadge(project.status)}>
                            {PROJECT_STATUS_LABELS[project.status]}
                          </span>
                          <select
                            className="select"
                            name="status"
                            defaultValue={project.status}
                            aria-label={`Estado de ${project.name}`}
                            style={{ width: "auto", padding: "5px 8px", fontSize: "0.82rem" }}
                          >
                            {PROJECT_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {PROJECT_STATUS_LABELS[status]}
                              </option>
                            ))}
                          </select>
                          <button className="btn btn--ghost btn--sm" type="submit">
                            Guardar
                          </button>
                        </form>
                      </td>
                      <td className="mono">{formatMoney(project.budget)}</td>
                      <td>
                        {formatDate(project.due_date)}
                        {project.due_date ? (
                          <div className="dim">{relativeDays(project.due_date)}</div>
                        ) : null}
                      </td>
                      <td>
                        <div className="row" style={{ gap: 8 }}>
                          {repo ? (
                            <a href={repo} target="_blank" rel="noreferrer">
                              Repo
                            </a>
                          ) : null}
                          {deploy ? (
                            <a href={deploy} target="_blank" rel="noreferrer">
                              Deploy
                            </a>
                          ) : null}
                          {!repo && !deploy ? <span className="dim">—</span> : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <details className="card">
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>Nuevo proyecto</summary>

        <form action={createProject} style={{ marginTop: 18 }}>
          <div className="form-grid">
            <label className="field">
              <span className="label">Nombre *</span>
              <input className="input" name="name" required placeholder="Sitio web Constructora Andes" />
            </label>
            <label className="field">
              <span className="label">Cliente *</span>
              <input className="input" name="client_name" required placeholder="Constructora Andes" />
            </label>
            <label className="field">
              <span className="label">Estado</span>
              <select className="select" name="status" defaultValue="planificacion">
                {PROJECT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {PROJECT_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="label">Presupuesto (CLP)</span>
              <input className="input" type="number" name="budget" min="0" step="1" placeholder="0" />
            </label>
            <label className="field">
              <span className="label">Inicio</span>
              <input className="input" type="date" name="start_date" />
            </label>
            <label className="field">
              <span className="label">Vencimiento</span>
              <input className="input" type="date" name="due_date" />
            </label>
            <label className="field">
              <span className="label">Lead asociado</span>
              <select className="select" name="lead_id" defaultValue="">
                <option value="">Sin lead</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.company}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="label">Repositorio</span>
              <input className="input" name="repo_url" placeholder="github.com/ramco/proyecto" />
            </label>
            <label className="field">
              <span className="label">Deploy</span>
              <input className="input" name="deploy_url" placeholder="proyecto.cl" />
            </label>
          </div>

          <label className="field">
            <span className="label">Descripción</span>
            <textarea className="textarea" name="description" placeholder="Alcance, entregables, notas…" />
          </label>

          <div className="row">
            <button className="btn btn--primary" type="submit">
              Crear proyecto
            </button>
            <span className="dim">Nombre y cliente son obligatorios.</span>
          </div>
        </form>
      </details>

      <p className="dim" style={{ margin: 0 }}>
        Los leads se crean desde <Link href="/admin/leads">Leads</Link>.
      </p>
    </div>
  );
}
