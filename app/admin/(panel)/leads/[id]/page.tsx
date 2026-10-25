import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import {
  INTERACTION_LABELS,
  STAGE_LABELS,
  STAGE_ORDER,
  formatDate,
  formatDateTime,
  formatMoney,
  relativeDays,
  stageBadge,
  type Interaction,
  type InteractionKind,
  type Lead,
  type Profile,
} from "@/lib/ui";
import { createInteraction, updateLeadStage } from "../../actions";

export const metadata: Metadata = { title: "Ficha de lead" };

type SearchParams = { [key: string]: string | string[] | undefined };

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

export default async function LeadDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const ok = pick(query.ok);
  const error = pick(query.error);

  const { supabase } = await requireUser();

  const { data: leadData, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (leadError || !leadData) notFound();
  const lead = leadData as Lead;

  const [{ data: interactionsData }, { data: profilesData }] = await Promise.all([
    supabase
      .from("interactions")
      .select("*")
      .eq("lead_id", id)
      .order("happened_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name").order("full_name", { ascending: true }),
  ]);

  const interactions = (interactionsData ?? []) as Interaction[];
  const profiles = (profilesData ?? []) as Array<Pick<Profile, "id" | "full_name">>;
  const people = new Map(profiles.map((profile) => [profile.id, profile.full_name]));

  const website = safeHttpUrl(lead.website);
  const email = lead.email;
  const phone = lead.phone;

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <div className="row" style={{ gap: 10, marginBottom: 6 }}>
            <Link className="dim" href="/admin/leads">
              ← Leads
            </Link>
            <span className={stageBadge(lead.stage)}>{STAGE_LABELS[lead.stage]}</span>
          </div>
          <h1>{lead.company}</h1>
          <p>
            {[lead.contact_name, lead.industry].filter(Boolean).join(" · ") ||
              "Sin contacto registrado"}
          </p>
        </div>
        <div className="dim" style={{ textAlign: "right" }}>
          <div>Creado {formatDate(lead.created_at)}</div>
          <div>Actualizado {formatDateTime(lead.updated_at)}</div>
        </div>
      </div>

      {ok ? <div className="alert alert--ok">{ok}</div> : null}
      {error ? <div className="alert alert--error">{error}</div> : null}

      <div className="grid grid--2">
        <div className="card">
          <h2 style={{ fontSize: "1.05rem" }}>Datos</h2>
          <dl
            style={{
              margin: 0,
              display: "grid",
              gridTemplateColumns: "minmax(110px, auto) 1fr",
              gap: "10px 16px",
              fontSize: "0.92rem",
            }}
          >
            <dt className="dim">Contacto</dt>
            <dd style={{ margin: 0 }}>{lead.contact_name ?? "—"}</dd>

            <dt className="dim">Correo</dt>
            <dd style={{ margin: 0 }}>
              {email ? <a href={`mailto:${email}`}>{email}</a> : "—"}
            </dd>

            <dt className="dim">Teléfono</dt>
            <dd style={{ margin: 0 }}>
              {phone ? <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a> : "—"}
            </dd>

            <dt className="dim">Web</dt>
            <dd style={{ margin: 0 }}>
              {website ? (
                <a href={website} target="_blank" rel="noreferrer">
                  {lead.website}
                </a>
              ) : (
                lead.website ?? "—"
              )}
            </dd>

            <dt className="dim">Industria</dt>
            <dd style={{ margin: 0 }}>{lead.industry ?? "—"}</dd>

            <dt className="dim">Origen</dt>
            <dd style={{ margin: 0 }}>{lead.source ?? "—"}</dd>

            <dt className="dim">Valor estimado</dt>
            <dd className="mono" style={{ margin: 0 }}>
              {formatMoney(lead.estimated_value)}
            </dd>

            <dt className="dim">Dueño</dt>
            <dd style={{ margin: 0 }}>
              {lead.owner_id ? people.get(lead.owner_id) ?? "—" : "—"}
            </dd>

            <dt className="dim">Último contacto</dt>
            <dd style={{ margin: 0 }}>
              {lead.last_contact_at
                ? `${formatDateTime(lead.last_contact_at)} · ${relativeDays(lead.last_contact_at)}`
                : "—"}
            </dd>
          </dl>

          {lead.notes ? (
            <div style={{ marginTop: 18 }}>
              <div className="label">Notas</div>
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{lead.notes}</p>
            </div>
          ) : null}
        </div>

        <div className="card">
          <h2 style={{ fontSize: "1.05rem" }}>Etapa y valor</h2>
          <form action={updateLeadStage}>
            <input type="hidden" name="id" value={lead.id} />

            <label className="field">
              <span className="label">Etapa</span>
              <select className="select" name="stage" defaultValue={lead.stage}>
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
                defaultValue={lead.estimated_value ?? ""}
                placeholder="0"
              />
            </label>

            <button className="btn btn--primary" type="submit">
              Guardar cambios
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="row row--between" style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: "1.05rem", margin: 0 }}>Historial de interacciones</h2>
          <span className="dim">{interactions.length} registradas</span>
        </div>

        {interactions.length === 0 ? (
          <div className="empty">Sin interacciones registradas todavía.</div>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 14 }}>
            {interactions.map((interaction) => (
              <li
                key={interaction.id}
                style={{ borderTop: "1px solid var(--borde)", paddingTop: 14 }}
              >
                <div className="row" style={{ gap: 8 }}>
                  <span className="badge">
                    {INTERACTION_LABELS[interaction.kind as InteractionKind] ?? interaction.kind}
                  </span>
                  <strong style={{ fontSize: "0.95rem" }}>
                    {interaction.subject ?? "Sin asunto"}
                  </strong>
                  <span className="dim">
                    {formatDateTime(interaction.happened_at)} · {relativeDays(interaction.happened_at)}
                  </span>
                </div>

                {interaction.body ? (
                  <p style={{ margin: "8px 0 0", whiteSpace: "pre-wrap" }}>{interaction.body}</p>
                ) : null}

                <div className="dim" style={{ marginTop: 6 }}>
                  Registró {interaction.author_id ? people.get(interaction.author_id) ?? "—" : "—"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h2 style={{ fontSize: "1.05rem" }}>Nueva interacción</h2>
        <form action={createInteraction}>
          <input type="hidden" name="lead_id" value={lead.id} />

          <div className="form-grid">
            <label className="field">
              <span className="label">Tipo</span>
              <select className="select" name="kind" defaultValue="nota">
                {(Object.keys(INTERACTION_LABELS) as InteractionKind[]).map((kind) => (
                  <option key={kind} value={kind}>
                    {INTERACTION_LABELS[kind]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="label">Asunto</span>
              <input className="input" name="subject" placeholder="Llamada de seguimiento" />
            </label>
          </div>

          <label className="field">
            <span className="label">Detalle</span>
            <textarea
              className="textarea"
              name="body"
              placeholder="Qué se conversó, acuerdos, próximos pasos…"
            />
          </label>

          <div className="row">
            <button className="btn btn--primary" type="submit">
              Registrar interacción
            </button>
            <span className="dim">Se guarda con fecha y hora actual.</span>
          </div>
        </form>
      </div>
    </div>
  );
}
