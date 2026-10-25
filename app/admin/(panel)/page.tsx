import Link from "next/link";
import { requireUser } from "@/lib/auth";
import {
  STAGE_LABELS,
  STAGE_ORDER,
  PROJECT_STATUS_LABELS,
  TASK_STATUS_LABELS,
  formatMoney,
  formatDate,
  relativeDays,
  stageBadge,
  projectBadge,
  priorityBadge,
  type Lead,
  type Project,
  type Quote,
  type Task,
  type Stage,
} from "@/lib/ui";

export const metadata = { title: "Portada" };

const ACTIVE_STAGES: Stage[] = ["nuevo", "contactado", "reunion", "propuesta", "negociacion"];

export default async function DashboardPage() {
  const { supabase, user } = await requireUser();

  const [{ data: leadsRaw }, { data: projectsRaw }, { data: tasksRaw }, { data: quotesRaw }] =
    await Promise.all([
      supabase
        .from("leads")
        .select("id, company, contact_name, stage, estimated_value, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("projects").select("id, name, client_name, status, due_date").order("created_at", { ascending: false }),
      supabase
        .from("tasks")
        .select("id, title, status, priority, due_date")
        .neq("status", "hecha")
        .order("due_date", { ascending: true, nullsFirst: false })
        .limit(6),
      supabase.from("quotes").select("id, title, amount, status, valid_until").order("created_at", { ascending: false }),
    ]);

  const leads = (leadsRaw ?? []) as Pick<
    Lead,
    "id" | "company" | "contact_name" | "stage" | "estimated_value" | "created_at"
  >[];
  const projects = (projectsRaw ?? []) as Pick<Project, "id" | "name" | "client_name" | "status" | "due_date">[];
  const tasks = (tasksRaw ?? []) as Pick<Task, "id" | "title" | "status" | "priority" | "due_date">[];
  const quotes = (quotesRaw ?? []) as Pick<Quote, "id" | "title" | "amount" | "status" | "valid_until">[];

  const activeLeads = leads.filter((lead) => ACTIVE_STAGES.includes(lead.stage));
  const pipeline = activeLeads.reduce((sum, lead) => sum + Number(lead.estimated_value ?? 0), 0);
  const won = leads.filter((lead) => lead.stage === "ganado");
  const wonValue = won.reduce((sum, lead) => sum + Number(lead.estimated_value ?? 0), 0);
  const runningProjects = projects.filter((project) => project.status === "en_curso");
  const today = new Date().toISOString().slice(0, 10);
  const overdue = tasks.filter((task) => task.due_date && task.due_date < today);
  const openQuotes = quotes.filter((quote) => quote.status === "enviada" || quote.status === "borrador");
  const openQuoteValue = openQuotes.reduce((sum, quote) => sum + Number(quote.amount ?? 0), 0);

  const byStage = STAGE_ORDER.map((stage) => ({
    stage,
    count: leads.filter((lead) => lead.stage === stage).length,
  }));

  const firstName = (user.email ?? "").split("@")[0];
  const isEmpty = leads.length === 0 && projects.length === 0 && quotes.length === 0 && tasks.length === 0;

  return (
    <div className="stack" style={{ gap: 22 }}>
      <div className="page-head">
        <div>
          <h1>Portada</h1>
          <p>
            Hola {firstName}. Este es el estado de RAMCO hoy{" "}
            {new Intl.DateTimeFormat("es-CL", { dateStyle: "long" }).format(new Date())}.
          </p>
        </div>
        <div className="row">
          <Link href="/admin/leads" className="btn btn--primary btn--sm">
            + Lead
          </Link>
          <Link href="/admin/tareas" className="btn btn--ghost btn--sm">
            + Tarea
          </Link>
        </div>
      </div>

      {isEmpty ? (
        <div className="card stack">
          <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Primeros pasos</h2>
          <p className="muted" style={{ margin: 0 }}>
            La base está vacía y lista. Este es el orden que recomiendo para arrancar:
          </p>
          <ol className="muted" style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
            <li>
              <Link href="/admin/leads">Carga tus primeros 20 prospectos</Link> desde{" "}
              <span className="mono">devting/prospectos.csv</span>.
            </li>
            <li>Define el pipeline: Nuevo → Contactado → Reunión → Propuesta → Negociación → Ganado.</li>
            <li>
              <Link href="/admin/cotizaciones">Arma 2 plantillas de cotización</Link>: web/landing y
              pack mensual de marketing.
            </li>
            <li>Invita a los otros 3 integrantes desde el panel de Supabase (Authentication → Users).</li>
          </ol>
        </div>
      ) : null}

      <div className="grid grid--4">
        <div className="kpi">
          <div className="kpi__label">Leads activos</div>
          <div className="kpi__value">{activeLeads.length}</div>
          <div className="kpi__hint">{leads.length} en total</div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Pipeline</div>
          <div className="kpi__value">{formatMoney(pipeline)}</div>
          <div className="kpi__hint">valor estimado en juego</div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Ganado</div>
          <div className="kpi__value">{formatMoney(wonValue)}</div>
          <div className="kpi__hint">{won.length} leads cerrados</div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Tareas abiertas</div>
          <div className="kpi__value">{tasks.length}</div>
          <div className="kpi__hint" style={{ color: overdue.length ? "var(--rojo)" : undefined }}>
            {overdue.length ? `${overdue.length} vencidas` : "sin vencidas"}
          </div>
        </div>
      </div>

      <div className="grid grid--2" style={{ alignItems: "start" }}>
        <section className="card stack">
          <div className="row row--between">
            <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Pipeline por etapa</h2>
            <Link href="/admin/leads" className="dim">
              ver leads →
            </Link>
          </div>
          <div className="stack" style={{ gap: 8 }}>
            {byStage.map(({ stage, count }) => {
              const max = Math.max(...byStage.map((item) => item.count), 1);
              return (
                <Link
                  key={stage}
                  href={`/admin/leads?etapa=${stage}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <div className="row row--between" style={{ marginBottom: 4 }}>
                    <span className={`badge ${stageBadge(stage).replace("badge ", "")}`}>
                      {STAGE_LABELS[stage]}
                    </span>
                    <span className="dim">{count}</span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      borderRadius: 999,
                      background: "rgba(248,250,252,.08)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(count / max) * 100}%`,
                        height: "100%",
                        background: stage === "perdido" ? "var(--rojo)" : "var(--verde)",
                        opacity: count ? 1 : 0,
                      }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="card stack">
          <div className="row row--between">
            <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Proyectos en curso</h2>
            <Link href="/admin/proyectos" className="dim">
              ver todos →
            </Link>
          </div>
          {runningProjects.length === 0 ? (
            <div className="empty">Sin proyectos en curso todavía.</div>
          ) : (
            <div className="stack" style={{ gap: 12 }}>
              {runningProjects.slice(0, 4).map((project) => (
                <div key={project.id} className="row row--between">
                  <div>
                    <div style={{ fontWeight: 600 }}>{project.name}</div>
                    <div className="dim">{project.client_name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className={projectBadge(project.status)}>
                      {PROJECT_STATUS_LABELS[project.status]}
                    </span>
                    {project.due_date ? (
                      <div className="dim" style={{ marginTop: 4 }}>
                        {relativeDays(project.due_date)}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="row row--between" style={{ borderTop: "1px solid var(--borde)", paddingTop: 14 }}>
            <div>
              <div className="dim">Cotizaciones abiertas</div>
              <div style={{ fontWeight: 700 }}>
                {openQuotes.length} · {formatMoney(openQuoteValue)}
              </div>
            </div>
            <Link href="/admin/cotizaciones" className="btn btn--ghost btn--sm">
              Ver
            </Link>
          </div>
        </section>
      </div>

      <section className="card stack">
        <div className="row row--between">
          <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Tareas que vienen</h2>
          <Link href="/admin/tareas" className="dim">
            ver todas →
          </Link>
        </div>
        {tasks.length === 0 ? (
          <div className="empty">Nada pendiente. Buen momento para prospectar.</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Tarea</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Vence</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>
                      <span className={priorityBadge(task.priority)}>{task.priority}</span>
                    </td>
                    <td className="dim">{TASK_STATUS_LABELS[task.status]}</td>
                    <td className={task.due_date && task.due_date < today ? "mono" : "dim"} style={task.due_date && task.due_date < today ? { color: "var(--rojo)" } : undefined}>
                      {task.due_date ? `${formatDate(task.due_date)} · ${relativeDays(task.due_date)}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
