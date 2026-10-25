import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import {
  STAGE_LABELS,
  STAGE_ORDER,
  formatDate,
  formatMoney,
  stageBadge,
  type Lead,
  type Profile,
  type Stage,
} from "@/lib/ui";
import { createLead, importarLeads } from "../actions";

export const metadata: Metadata = { title: "Leads" };

type SearchParams = { [key: string]: string | string[] | undefined };

function pick(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function stageFromParam(raw: string | undefined): Stage | null {
  return STAGE_ORDER.find((stage) => stage === raw) ?? null;
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const ok = pick(params.ok);
  const error = pick(params.error);
  const stageFilter = stageFromParam(pick(params.etapa));

  const { supabase } = await requireUser();

  const baseQuery = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  const { data: leadsData, error: leadsError } = stageFilter
    ? await baseQuery.eq("stage", stageFilter)
    : await baseQuery;

  const leads = (leadsData ?? []) as Lead[];

  const { data: profilesData } = await supabase
    .from("profiles")
    .select("id, full_name")
    .order("full_name", { ascending: true });
  const profiles = (profilesData ?? []) as Array<Pick<Profile, "id" | "full_name">>;
  const ownerName = new Map(profiles.map((profile) => [profile.id, profile.full_name]));

  const totalValue = leads.reduce((sum, lead) => sum + (lead.estimated_value ?? 0), 0);
  const won = leads.filter((lead) => lead.stage === "ganado").length;

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1>Leads</h1>
          <p>
            {leads.length} {leads.length === 1 ? "lead" : "leads"}
            {stageFilter ? ` en «${STAGE_LABELS[stageFilter]}»` : ""} · {won} ganados ·{" "}
            {formatMoney(totalValue)} en pipeline
          </p>
        </div>
      </div>

      {ok ? <div className="alert alert--ok">{ok}</div> : null}
      {error ? <div className="alert alert--error">{error}</div> : null}
      {leadsError ? (
        <div className="alert alert--error">
          No se pudieron cargar los leads ({leadsError.message}).
        </div>
      ) : null}

      <div className="card">
        <div className="row row--between" style={{ marginBottom: 16, gap: 10 }}>
          <div className="row" style={{ gap: 6 }}>
            <Link
              className={stageFilter === null ? "badge badge--verde" : "badge"}
              href="/admin/leads"
            >
              Todas
            </Link>
            {STAGE_ORDER.map((stage) => (
              <Link
                key={stage}
                className={stageFilter === stage ? "badge badge--verde" : "badge"}
                href={`/admin/leads?etapa=${stage}`}
              >
                {STAGE_LABELS[stage]}
              </Link>
            ))}
          </div>
          <span className="dim">Orden: más recientes primero</span>
        </div>

        {leads.length === 0 ? (
          <div className="empty">
            No hay leads{stageFilter ? " en esta etapa" : ""}. Crea el primero en el formulario de
            abajo.
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Contacto</th>
                  <th>Etapa</th>
                  <th>Valor est.</th>
                  <th>Dueño · fecha</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <Link href={`/admin/leads/${lead.id}`} style={{ fontWeight: 600 }}>
                        {lead.company}
                      </Link>
                      {lead.industry ? <div className="dim">{lead.industry}</div> : null}
                    </td>
                    <td>
                      {lead.contact_name ?? "—"}
                      {lead.email ? (
                        <div className="dim" style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis" }}>
                          {lead.email}
                        </div>
                      ) : null}
                    </td>
                    <td>
                      <span className={stageBadge(lead.stage)}>{STAGE_LABELS[lead.stage]}</span>
                    </td>
                    <td className="mono">{formatMoney(lead.estimated_value)}</td>
                    <td>
                      {lead.owner_id ? ownerName.get(lead.owner_id) ?? "—" : "—"}
                      <div className="dim">{formatDate(lead.created_at)}</div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link className="btn btn--ghost btn--sm" href={`/admin/leads/${lead.id}`}>
                        Abrir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <details className="card">
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>Nuevo lead</summary>

        <form action={createLead} style={{ marginTop: 18 }}>
          <div className="form-grid">
            <label className="field">
              <span className="label">Empresa *</span>
              <input className="input" name="company" required placeholder="Constructora Andes" />
            </label>
            <label className="field">
              <span className="label">Contacto</span>
              <input className="input" name="contact_name" placeholder="María Pérez" />
            </label>
            <label className="field">
              <span className="label">Correo</span>
              <input className="input" type="email" name="email" placeholder="maria@empresa.cl" />
            </label>
            <label className="field">
              <span className="label">Teléfono</span>
              <input className="input" type="tel" name="phone" placeholder="+56 9 1234 5678" />
            </label>
            <label className="field">
              <span className="label">Web</span>
              <input className="input" name="website" placeholder="empresa.cl" />
            </label>
            <label className="field">
              <span className="label">Industria</span>
              <input className="input" name="industry" placeholder="Construcción" />
            </label>
            <label className="field">
              <span className="label">Origen</span>
              <input className="input" name="source" placeholder="manual, referido, web…" />
            </label>
            <label className="field">
              <span className="label">Etapa</span>
              <select className="select" name="stage" defaultValue="nuevo">
                {STAGE_ORDER.map((stage) => (
                  <option key={stage} value={stage}>
                    {STAGE_LABELS[stage]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="label">Valor estimado (CLP)</span>
              <input
                className="input"
                type="number"
                name="estimated_value"
                min="0"
                step="1"
                placeholder="0"
              />
            </label>
          </div>

          <label className="field">
            <span className="label">Notas</span>
            <textarea className="textarea" name="notes" placeholder="Contexto, referencias, próximos pasos…" />
          </label>

          <div className="row">
            <button className="btn btn--primary" type="submit">
              Crear lead
            </button>
            <span className="dim">Solo la empresa es obligatoria.</span>
          </div>
        </form>
      </details>

      <details className="card" style={{ marginTop: 18 }}>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>
          Importar prospectos (pegar lista)
        </summary>

        <form action={importarLeads} style={{ marginTop: 18 }}>
          <p className="dim" style={{ marginTop: 0 }}>
            Una empresa por línea. Columnas separadas por <b>tabulación</b> o <b>punto y coma</b>:
            <br />
            <span className="mono">
              empresa ; contacto ; correo ; teléfono ; web ; rubro ; notas
            </span>
            <br />
            Solo la empresa es obligatoria. Máximo 300 por carga. Las líneas duplicadas o vacías se
            ignoran.
          </p>

          <label className="field">
            <span className="label">Lista</span>
            <textarea
              className="textarea"
              name="lista"
              rows={8}
              placeholder={
                "Panadería Los Robles; Camila Soto; contacto@losrobles.cl; +56 9 1111 1111; losrobles.cl; Alimentos; tiene web vieja\nClínica Dental Aurora; Ignacio Pérez; ignacio@dentalaurora.cl; +56 9 2222 2222; dentalaurora.cl; Salud; compra recurrente"
              }
            />
          </label>

          <div className="row" style={{ gap: 12 }}>
            <label className="field" style={{ margin: 0, minWidth: 200 }}>
              <span className="label">Origen</span>
              <input className="input" name="source" defaultValue="prospeccion" />
            </label>
            <button className="btn btn--primary" type="submit" style={{ alignSelf: "end" }}>
              Importar prospectos
            </button>
          </div>
        </form>
      </details>
    </div>
  );
}
