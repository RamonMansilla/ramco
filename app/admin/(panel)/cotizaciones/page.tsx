import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import {
  QUOTE_STATUS_LABELS,
  formatDate,
  formatMoney,
  quoteBadge,
  relativeDays,
  type Lead,
  type Quote,
  type QuoteStatus,
} from "@/lib/ui";
import { createQuote, updateQuoteStatus } from "../actions";

export const metadata: Metadata = { title: "Cotizaciones" };

type SearchParams = { [key: string]: string | string[] | undefined };

const QUOTE_STATUSES = Object.keys(QUOTE_STATUS_LABELS) as QuoteStatus[];

function pick(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const ok = pick(params.ok);
  const error = pick(params.error);

  const { supabase } = await requireUser();

  const [{ data: quotesData, error: quotesError }, { data: leadsData }] = await Promise.all([
    supabase.from("quotes").select("*").order("created_at", { ascending: false }).limit(500),
    supabase.from("leads").select("id, company").order("company", { ascending: true }).limit(500),
  ]);

  const quotes = (quotesData ?? []) as Quote[];
  const leads = (leadsData ?? []) as Array<Pick<Lead, "id" | "company">>;
  const leadName = new Map(leads.map((lead) => [lead.id, lead.company]));

  const accepted = quotes.filter((quote) => quote.status === "aceptada");
  const acceptedTotal = accepted.reduce((sum, quote) => sum + quote.amount, 0);

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1>Cotizaciones</h1>
          <p>
            {quotes.length} en total · {accepted.length} aceptadas ·{" "}
            {formatMoney(acceptedTotal)} cerrados
          </p>
        </div>
      </div>

      {ok ? <div className="alert alert--ok">{ok}</div> : null}
      {error ? <div className="alert alert--error">{error}</div> : null}
      {quotesError ? (
        <div className="alert alert--error">
          No se pudieron cargar las cotizaciones ({quotesError.message}).
        </div>
      ) : null}

      <div className="card">
        {quotes.length === 0 ? (
          <div className="empty">Todavía no hay cotizaciones. Crea la primera abajo.</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Título</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Validez</th>
                  <th>Lead</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => (
                  <tr key={quote.id}>
                    <td className="mono">{quote.number ?? "—"}</td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{quote.title}</span>
                      {quote.notes ? (
                        <div
                          className="dim"
                          style={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis" }}
                        >
                          {quote.notes}
                        </div>
                      ) : null}
                    </td>
                    <td className="mono">{formatMoney(quote.amount, quote.currency)}</td>
                    <td>
                      <form action={updateQuoteStatus} className="row" style={{ gap: 6 }}>
                        <input type="hidden" name="id" value={quote.id} />
                        <span className={quoteBadge(quote.status)}>
                          {QUOTE_STATUS_LABELS[quote.status]}
                        </span>
                        <select
                          className="select"
                          name="status"
                          defaultValue={quote.status}
                          aria-label={`Estado de ${quote.number ?? quote.title}`}
                          style={{ width: "auto", padding: "5px 8px", fontSize: "0.82rem" }}
                        >
                          {QUOTE_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {QUOTE_STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                        <button className="btn btn--ghost btn--sm" type="submit">
                          Guardar
                        </button>
                      </form>
                    </td>
                    <td>
                      {formatDate(quote.valid_until)}
                      {quote.valid_until ? (
                        <div className="dim">{relativeDays(quote.valid_until)}</div>
                      ) : null}
                    </td>
                    <td>
                      {quote.lead_id ? (
                        <Link href={`/admin/leads/${quote.lead_id}`}>
                          {leadName.get(quote.lead_id) ?? "Ver lead"}
                        </Link>
                      ) : (
                        <span className="dim">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <details className="card">
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>Nueva cotización</summary>

        <form action={createQuote} style={{ marginTop: 18 }}>
          <div className="form-grid">
            <label className="field">
              <span className="label">Título *</span>
              <input
                className="input"
                name="title"
                required
                placeholder="Sitio web corporativo + landing"
              />
            </label>
            <label className="field">
              <span className="label">Número</span>
              <input className="input" name="number" placeholder="Automático: COT-AAAA-NNN" />
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
              <span className="label">Monto (CLP)</span>
              <input className="input" type="number" name="amount" min="0" step="1" placeholder="0" />
            </label>
            <label className="field">
              <span className="label">Estado</span>
              <select className="select" name="status" defaultValue="borrador">
                {QUOTE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {QUOTE_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="label">Válida hasta</span>
              <input className="input" type="date" name="valid_until" />
            </label>
          </div>

          <label className="field">
            <span className="label">Notas</span>
            <textarea className="textarea" name="notes" placeholder="Alcance, condiciones, descuentos…" />
          </label>

          <div className="row">
            <button className="btn btn--primary" type="submit">
              Crear cotización
            </button>
            <span className="dim">Si dejas el número vacío se genera el correlativo del año.</span>
          </div>
        </form>
      </details>
    </div>
  );
}
