import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { formatDateTime, formatMoney } from "@/lib/ui";
import { agregarContacto, cambiarEstadoCampana, crearCampana, marcarContacto } from "./actions";

export const metadata = { title: "Reactivación" };

const ORIGENES = [
  { id: "cartera_antigua", label: "Cartera antigua" },
  { id: "base_propia", label: "Base propia" },
  { id: "ventas_perdidas", label: "Ventas perdidas" },
  { id: "cotizaciones", label: "Cotizaciones vencidas" },
  { id: "otro", label: "Otro origen" },
] as const;

const CANALES = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Correo" },
  { id: "llamada", label: "Llamada" },
  { id: "instagram", label: "Instagram" },
  { id: "mixto", label: "Mixto" },
] as const;

const ESTADOS_CONTACTO = [
  { id: "pendiente", label: "Pendiente" },
  { id: "contactado", label: "Contactado" },
  { id: "respondio", label: "Respondió" },
  { id: "cotizado", label: "Cotizado" },
  { id: "recuperado", label: "Recuperado" },
  { id: "descartado", label: "Descartado" },
] as const;

interface Campana {
  id: string;
  nombre: string;
  origen: string;
  estado: string;
  inactivos_desde_meses: number;
  canal_principal: string;
  meta_contactos: number;
  oferta: string | null;
  fecha_inicio: string | null;
  created_at: string;
}

interface Contacto {
  id: string;
  campaign_id: string;
  nombre: string | null;
  empresa: string | null;
  telefono: string | null;
  email: string | null;
  estado: string;
  ultimo_contacto: string | null;
  valor_recuperado: number | null;
}

function badgeEstado(estado: string): string {
  switch (estado) {
    case "recuperado":
      return "badge badge--verde";
    case "descartado":
      return "badge badge--rojo";
    case "cotizado":
    case "respondio":
      return "badge badge--azul";
    case "en_curso":
    case "contactado":
      return "badge badge--ambar";
    default:
      return "badge";
  }
}

const ETIQUETA_ESTADO: Record<string, string> = {
  borrador: "Borrador",
  en_curso: "En curso",
  pausada: "Pausada",
  terminada: "Terminada",
  pendiente: "Pendiente",
  contactado: "Contactado",
  respondio: "Respondió",
  cotizado: "Cotizado",
  recuperado: "Recuperado",
  descartado: "Descartado",
};

export default async function ReactivacionPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string; campana?: string }>;
}) {
  const params = await searchParams;
  const { supabase } = await requireUser();

  const [{ data: campanasRaw }, { data: contactosRaw }] = await Promise.all([
    supabase
      .from("reactivation_campaigns")
      .select("id, nombre, origen, estado, inactivos_desde_meses, canal_principal, meta_contactos, oferta, fecha_inicio, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("reactivation_contacts")
      .select("id, campaign_id, nombre, empresa, telefono, email, estado, ultimo_contacto, valor_recuperado")
      .order("created_at", { ascending: false }),
  ]);

  const campanas = (campanasRaw ?? []) as Campana[];
  const contactos = (contactosRaw ?? []) as Contacto[];

  const seleccionada =
    campanas.find((campana) => campana.id === params.campana) ?? campanas[0] ?? null;

  const contactosDeCampana = seleccionada
    ? contactos.filter((contacto) => contacto.campaign_id === seleccionada.id)
    : [];

  const recuperados = contactosDeCampana.filter((contacto) => contacto.estado === "recuperado");
  const ingresoRecuperado = recuperados.reduce(
    (suma, contacto) => suma + Number(contacto.valor_recuperado ?? 0),
    0,
  );
  const respondieron = contactosDeCampana.filter((contacto) =>
    ["respondio", "cotizado", "recuperado"].includes(contacto.estado),
  ).length;
  const contactados = contactosDeCampana.filter(
    (contacto) => contacto.estado !== "pendiente",
  ).length;

  const tasaRespuesta =
    contactados > 0 ? Math.round((respondieron / contactados) * 100) : 0;

  return (
    <div className="stack" style={{ gap: 22 }}>
      <div className="page-head">
        <div>
          <h1>Reactivación de clientes</h1>
          <p>
            Recupera clientes de carteras antiguas: ordena la base, contacta por segmento y mide
            cuánto ingreso vuelve.
          </p>
        </div>
      </div>

      {params.ok ? <div className="alert alert--ok">{params.ok}</div> : null}
      {params.error ? <div className="alert alert--error">{params.error}</div> : null}

      <div className="grid grid--4">
        <div className="kpi">
          <div className="kpi__label">Campañas</div>
          <div className="kpi__value">{campanas.length}</div>
          <div className="kpi__hint">
            {campanas.filter((campana) => campana.estado === "en_curso").length} en curso
          </div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Contactos trabajados</div>
          <div className="kpi__value">{contactados}</div>
          <div className="kpi__hint">{contactosDeCampana.length} en la campaña activa</div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Tasa de respuesta</div>
          <div className="kpi__value">{tasaRespuesta}%</div>
          <div className="kpi__hint">{respondieron} respondieron</div>
        </div>
        <div className="kpi">
          <div className="kpi__label">Ingreso recuperado</div>
          <div className="kpi__value">{formatMoney(ingresoRecuperado)}</div>
          <div className="kpi__hint">{recuperados.length} clientes recuperados</div>
        </div>
      </div>

      {campanas.length === 0 ? (
        <section className="card stack">
          <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Cómo se trabaja una cartera antigua</h2>
          <ol className="muted" style={{ margin: 0, paddingLeft: 20, lineHeight: 1.9 }}>
            <li>Creas la campaña (origen, antigüedad de los clientes y oferta).</li>
            <li>Cargas los contactos: nombre, empresa, teléfono o correo.</li>
            <li>
              Cada vez que alguien responde, marcas el estado: contactado, respondió, cotizó o
              recuperado con su valor.
            </li>
            <li>La tasa de respuesta y el ingreso recuperado se calculan solos.</li>
          </ol>
        </section>
      ) : null}

      <section className="card stack">
        <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Nueva campaña</h2>
        <form action={crearCampana} className="stack">
          <div className="form-grid">
            <label className="field">
              <span className="label">Nombre</span>
              <input className="input" name="nombre" placeholder="Clientes 2023 sin recompra" required />
            </label>
            <label className="field">
              <span className="label">Origen de la cartera</span>
              <select className="select" name="origen" defaultValue="cartera_antigua">
                {ORIGENES.map((origen) => (
                  <option key={origen.id} value={origen.id}>
                    {origen.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="label">Sin comprar desde (meses)</span>
              <input className="input" name="meses" type="number" min={1} max={120} defaultValue={6} />
            </label>
            <label className="field">
              <span className="label">Canal principal</span>
              <select className="select" name="canal" defaultValue="whatsapp">
                {CANALES.map((canal) => (
                  <option key={canal.id} value={canal.id}>
                    {canal.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="label">Meta de contactos</span>
              <input className="input" name="meta" type="number" min={0} defaultValue={100} />
            </label>
          </div>
          <label className="field">
            <span className="label">Oferta o mensaje base</span>
            <textarea
              className="textarea"
              name="oferta"
              placeholder="Ej: 20% de descuento en tu reposición habitual hasta fin de mes."
            />
          </label>
          <button className="btn btn--primary" type="submit">
            Crear campaña
          </button>
        </form>
      </section>

      {campanas.length > 0 ? (
        <>
          <section className="card stack">
            <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Campañas</h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Campaña</th>
                    <th>Origen</th>
                    <th>Estado</th>
                    <th>Contactos</th>
                    <th>Recuperados</th>
                    <th>Ingreso</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {campanas.map((campana) => {
                    const suyos = contactos.filter((contacto) => contacto.campaign_id === campana.id);
                    const recuperadosSuyos = suyos.filter(
                      (contacto) => contacto.estado === "recuperado",
                    );
                    const ingreso = recuperadosSuyos.reduce(
                      (suma, contacto) => suma + Number(contacto.valor_recuperado ?? 0),
                      0,
                    );
                    return (
                      <tr key={campana.id}>
                        <td>
                          <Link href={`/admin/reactivacion?campana=${campana.id}`}>
                            {campana.nombre}
                          </Link>
                          <div className="dim">desde {campana.inactivos_desde_meses} meses</div>
                        </td>
                        <td className="dim">
                          {ORIGENES.find((origen) => origen.id === campana.origen)?.label ??
                            campana.origen}
                        </td>
                        <td>
                          <span className={badgeEstado(campana.estado)}>
                            {ETIQUETA_ESTADO[campana.estado] ?? campana.estado}
                          </span>
                        </td>
                        <td>{suyos.length}</td>
                        <td>{recuperadosSuyos.length}</td>
                        <td>{formatMoney(ingreso)}</td>
                        <td>
                          <form action={cambiarEstadoCampana} className="row" style={{ gap: 6 }}>
                            <input type="hidden" name="id" value={campana.id} />
                            <select
                              className="select"
                              name="estado"
                              defaultValue={campana.estado}
                              style={{ width: "auto" }}
                            >
                              <option value="borrador">Borrador</option>
                              <option value="en_curso">En curso</option>
                              <option value="pausada">Pausada</option>
                              <option value="terminada">Terminada</option>
                            </select>
                            <button className="btn btn--ghost btn--sm" type="submit">
                              Guardar
                            </button>
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {seleccionada ? (
            <>
              <section className="card stack">
                <div className="row row--between">
                  <h2 style={{ fontSize: "1.1rem", margin: 0 }}>
                    Contactos de «{seleccionada.nombre}»
                  </h2>
                  <span className="dim">
                    {contactosDeCampana.length} / meta {seleccionada.meta_contactos || "—"}
                  </span>
                </div>

                <form action={agregarContacto} className="stack">
                  <input type="hidden" name="campaign_id" value={seleccionada.id} />
                  <div className="form-grid">
                    <label className="field">
                      <span className="label">Nombre</span>
                      <input className="input" name="nombre" placeholder="Nombre y apellido" />
                    </label>
                    <label className="field">
                      <span className="label">Empresa</span>
                      <input className="input" name="empresa" placeholder="Empresa" />
                    </label>
                    <label className="field">
                      <span className="label">Teléfono</span>
                      <input className="input" name="telefono" placeholder="+56 9 …" />
                    </label>
                    <label className="field">
                      <span className="label">Correo</span>
                      <input className="input" name="email" type="email" placeholder="correo@empresa.cl" />
                    </label>
                  </div>
                  <button className="btn btn--primary btn--sm" type="submit" style={{ alignSelf: "flex-start" }}>
                    Agregar contacto
                  </button>
                </form>

                {contactosDeCampana.length === 0 ? (
                  <div className="empty">Todavía no hay contactos en esta campaña.</div>
                ) : (
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Contacto</th>
                          <th>Estado</th>
                          <th>Último contacto</th>
                          <th>Recuperado</th>
                          <th>Marcar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contactosDeCampana.map((contacto) => (
                          <tr key={contacto.id}>
                            <td>
                              <div style={{ fontWeight: 600 }}>
                                {contacto.nombre || contacto.empresa || "Sin nombre"}
                              </div>
                              <div className="dim">
                                {[contacto.telefono, contacto.email].filter(Boolean).join(" · ") || "—"}
                              </div>
                            </td>
                            <td>
                              <span className={badgeEstado(contacto.estado)}>
                                {ETIQUETA_ESTADO[contacto.estado] ?? contacto.estado}
                              </span>
                            </td>
                            <td className="dim">
                              {contacto.ultimo_contacto
                                ? formatDateTime(contacto.ultimo_contacto)
                                : "—"}
                            </td>
                            <td>
                              {contacto.valor_recuperado
                                ? formatMoney(Number(contacto.valor_recuperado))
                                : "—"}
                            </td>
                            <td>
                              <form action={marcarContacto} className="row" style={{ gap: 6 }}>
                                <input type="hidden" name="id" value={contacto.id} />
                                <select
                                  className="select"
                                  name="estado"
                                  defaultValue={contacto.estado}
                                  style={{ width: "auto" }}
                                >
                                  {ESTADOS_CONTACTO.map((estado) => (
                                    <option key={estado.id} value={estado.id}>
                                      {estado.label}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  className="input"
                                  name="valor"
                                  type="number"
                                  min={0}
                                  placeholder="Valor"
                                  style={{ width: 110 }}
                                />
                                <button className="btn btn--ghost btn--sm" type="submit">
                                  OK
                                </button>
                              </form>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
