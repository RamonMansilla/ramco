import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import {
  PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  formatDate,
  priorityBadge,
  relativeDays,
  type Lead,
  type Priority,
  type Project,
  type Task,
  type TaskStatus,
} from "@/lib/ui";
import { createTask, toggleTaskDone } from "../actions";

export const metadata: Metadata = { title: "Tareas" };

type SearchParams = { [key: string]: string | string[] | undefined };

const TASK_STATUSES = Object.keys(TASK_STATUS_LABELS) as TaskStatus[];
const PRIORITIES = Object.keys(PRIORITY_LABELS) as Priority[];
const STATUS_ORDER: TaskStatus[] = ["pendiente", "en_curso", "hecha"];

const FILTERS: Array<{ value: TaskStatus | "todas"; label: string; href: string }> = [
  { value: "todas", label: "Todas", href: "/admin/tareas" },
  { value: "pendiente", label: "Pendientes", href: "/admin/tareas?estado=pendiente" },
  { value: "en_curso", label: "En curso", href: "/admin/tareas?estado=en_curso" },
  { value: "hecha", label: "Hechas", href: "/admin/tareas?estado=hecha" },
];

function pick(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function taskFilter(raw: string | undefined): TaskStatus | "todas" {
  return raw === "pendiente" || raw === "en_curso" || raw === "hecha" ? raw : "todas";
}

function byStatusAndDue(a: Task, b: Task): number {
  const statusDelta = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
  if (statusDelta !== 0) return statusDelta;
  if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
  if (a.due_date) return -1;
  if (b.due_date) return 1;
  return a.created_at.localeCompare(b.created_at);
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const ok = pick(params.ok);
  const error = pick(params.error);
  const filter = taskFilter(pick(params.estado));

  const { supabase } = await requireUser();

  const [{ data: tasksData, error: tasksError }, { data: projectsData }, { data: leadsData }] =
    await Promise.all([
      supabase.from("tasks").select("*").order("created_at", { ascending: true }).limit(500),
      supabase.from("projects").select("id, name").order("name", { ascending: true }).limit(500),
      supabase.from("leads").select("id, company").order("company", { ascending: true }).limit(500),
    ]);

  const allTasks = (tasksData ?? []) as Task[];
  const projects = (projectsData ?? []) as Array<Pick<Project, "id" | "name">>;
  const leads = (leadsData ?? []) as Array<Pick<Lead, "id" | "company">>;
  const projectName = new Map(projects.map((project) => [project.id, project.name]));
  const leadName = new Map(leads.map((lead) => [lead.id, lead.company]));

  const counts: Record<TaskStatus, number> = {
    pendiente: allTasks.filter((task) => task.status === "pendiente").length,
    en_curso: allTasks.filter((task) => task.status === "en_curso").length,
    hecha: allTasks.filter((task) => task.status === "hecha").length,
  };

  const tasks = allTasks
    .filter((task) => filter === "todas" || task.status === filter)
    .sort(byStatusAndDue);

  const today = new Date().toISOString().slice(0, 10);
  const vista = filter === "todas" ? "todas" : filter;

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1>Tareas</h1>
          <p>
            {counts.pendiente} pendientes · {counts.en_curso} en curso · {counts.hecha} hechas
          </p>
        </div>
      </div>

      {ok ? <div className="alert alert--ok">{ok}</div> : null}
      {error ? <div className="alert alert--error">{error}</div> : null}
      {tasksError ? (
        <div className="alert alert--error">
          No se pudieron cargar las tareas ({tasksError.message}).
        </div>
      ) : null}

      <div className="card">
        <div className="row row--between" style={{ marginBottom: 16, gap: 10 }}>
          <div className="row" style={{ gap: 6 }}>
            {FILTERS.map((item) => (
              <Link
                key={item.value}
                className={filter === item.value ? "badge badge--verde" : "badge"}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <span className="dim">{tasks.length} en vista</span>
        </div>

        {tasks.length === 0 ? (
          <div className="empty">
            No hay tareas{filter !== "todas" ? " con este estado" : ""}. Crea una abajo.
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Tarea</th>
                  <th>Prioridad</th>
                  <th>Vencimiento</th>
                  <th>Proyecto / lead</th>
                  <th>Estado</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const overdue =
                    task.status !== "hecha" && task.due_date !== null && task.due_date < today;
                  const projectLabel = task.project_id ? projectName.get(task.project_id) : null;
                  const leadLabel = task.lead_id ? leadName.get(task.lead_id) : null;

                  return (
                    <tr key={task.id}>
                      <td>
                        <span
                          style={{
                            fontWeight: 600,
                            textDecoration: task.status === "hecha" ? "line-through" : "none",
                          }}
                        >
                          {task.title}
                        </span>
                        {task.description ? (
                          <div
                            className="dim"
                            style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis" }}
                          >
                            {task.description}
                          </div>
                        ) : null}
                      </td>
                      <td>
                        <span className={priorityBadge(task.priority)}>
                          {PRIORITY_LABELS[task.priority]}
                        </span>
                      </td>
                      <td>
                        {formatDate(task.due_date)}
                        {overdue ? (
                          <div>
                            <span className="badge badge--rojo">vencida</span>
                          </div>
                        ) : task.due_date ? (
                          <div className="dim">{relativeDays(task.due_date)}</div>
                        ) : null}
                      </td>
                      <td>
                        {projectLabel ? <div>{projectLabel}</div> : null}
                        {leadLabel ? <div className="dim">{leadLabel}</div> : null}
                        {!projectLabel && !leadLabel ? <span className="dim">—</span> : null}
                      </td>
                      <td>
                        <span
                          className={
                            task.status === "hecha"
                              ? "badge badge--verde"
                              : task.status === "en_curso"
                                ? "badge badge--azul"
                                : "badge"
                          }
                        >
                          {TASK_STATUS_LABELS[task.status]}
                        </span>
                        {task.completed_at ? (
                          <div className="dim">{formatDate(task.completed_at)}</div>
                        ) : null}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <form action={toggleTaskDone}>
                          <input type="hidden" name="id" value={task.id} />
                          <input type="hidden" name="vista" value={vista} />
                          <input
                            type="hidden"
                            name="done"
                            value={task.status === "hecha" ? "0" : "1"}
                          />
                          <button className="btn btn--ghost btn--sm" type="submit">
                            {task.status === "hecha" ? "Reabrir" : "Marcar hecha"}
                          </button>
                        </form>
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
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>Nueva tarea</summary>

        <form action={createTask} style={{ marginTop: 18 }}>
          <input type="hidden" name="vista" value={vista} />

          <div className="form-grid">
            <label className="field">
              <span className="label">Título *</span>
              <input className="input" name="title" required placeholder="Enviar propuesta a Andes" />
            </label>
            <label className="field">
              <span className="label">Prioridad</span>
              <select className="select" name="priority" defaultValue="media">
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {PRIORITY_LABELS[priority]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="label">Estado</span>
              <select className="select" name="status" defaultValue="pendiente">
                {TASK_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {TASK_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="label">Vencimiento</span>
              <input className="input" type="date" name="due_date" />
            </label>
            <label className="field">
              <span className="label">Proyecto</span>
              <select className="select" name="project_id" defaultValue="">
                <option value="">Sin proyecto</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="label">Lead</span>
              <select className="select" name="lead_id" defaultValue="">
                <option value="">Sin lead</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.company}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span className="label">Descripción</span>
            <textarea className="textarea" name="description" placeholder="Detalle, criterios de término…" />
          </label>

          <div className="row">
            <button className="btn btn--primary" type="submit">
              Crear tarea
            </button>
            <span className="dim">El título es obligatorio.</span>
          </div>
        </form>
      </details>
    </div>
  );
}
