"use client";

/* =====================================================================
   RAMNCO · "Recupera tu cartera" en la página de servicios.
   Calculadora honesta: la cifra sale de lo que el cliente ve y ajusta.
   ===================================================================== */

import { useMemo, useState } from "react";

import "./reactivacion.css";

const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const RANGOS = [
  {
    campo: "clientes",
    etiqueta: "Clientes en tu cartera antigua",
    ayuda: "Contactos que alguna vez te compraron o cotizaron.",
    min: 50,
    max: 10000,
    step: 50,
  },
  {
    campo: "ticket",
    etiqueta: "Valor promedio por venta",
    ayuda: "Cuánto deja un cliente en promedio cada vez.",
    min: 20000,
    max: 3000000,
    step: 10000,
  },
  {
    campo: "recuperacion",
    etiqueta: "Clientes que se pueden recuperar",
    ayuda: "Porcentaje conservador de reactivación esperada.",
    min: 2,
    max: 20,
    step: 1,
  },
] as const;

type Campo = (typeof RANGOS)[number]["campo"];

export function Reactivacion() {
  const [valores, setValores] = useState<Record<Campo, number>>({
    clientes: 800,
    ticket: 150000,
    recuperacion: 8,
  });

  const calculo = useMemo(() => {
    const recuperados = Math.round((valores.clientes * valores.recuperacion) / 100);
    const ingreso = recuperados * valores.ticket;
    /* costo estimado del servicio: 1% de la cartera, con piso y techo */
    const servicio = Math.min(Math.max(valores.clientes * 250, 180000), 2400000);
    const neto = ingreso - servicio;
    return { recuperados, ingreso, servicio, neto };
  }, [valores]);

  return (
    <div className="rx">
      <div className="rx__grid">
        <div className="rx__cards">
          <article className="rx__card">
            <h3>Clientes recuperados</h3>
            <p className="rx__num">{calculo.recuperados}</p>
            <p className="rx__hint">
              de {valores.clientes.toLocaleString("es-CL")} contactos al {valores.recuperacion}%
            </p>
          </article>
          <article className="rx__card rx__card--hot">
            <h3>Ingreso estimado</h3>
            <p className="rx__num rx__num--hot">{clp.format(calculo.ingreso)}</p>
            <p className="rx__hint">ventas recuperadas a {clp.format(valores.ticket)} promedio</p>
          </article>
          <article className="rx__card">
            <h3>Servicio</h3>
            <p className="rx__num">{clp.format(calculo.servicio)}</p>
            <p className="rx__hint">desde · se ajusta al tamaño de la cartera</p>
          </article>
        </div>

        <div className="rx__controles">
          <h3 className="rx__titulo">Ajusta tu cartera</h3>
          {RANGOS.map((rango) => {
            const valor = valores[rango.campo];
            const esClp = rango.campo === "ticket";
            const avance = ((valor - rango.min) / (rango.max - rango.min)) * 100;
            const id = `rx-${rango.campo}`;
            return (
              <div className="rx__control" key={rango.campo}>
                <div className="rx__control-head">
                  <label htmlFor={id}>{rango.etiqueta}</label>
                  <output htmlFor={id} className="rx__valor">
                    {esClp ? clp.format(valor) : rango.campo === "recuperacion" ? `${valor}%` : valor}
                  </output>
                </div>
                <input
                  id={id}
                  className="rx__slider"
                  type="range"
                  min={rango.min}
                  max={rango.max}
                  step={rango.step}
                  value={valor}
                  aria-describedby={`${id}-ayuda`}
                  style={{ ["--rx-avance" as string]: `${avance}%` }}
                  onChange={(evento) =>
                    setValores((previos) => ({
                      ...previos,
                      [rango.campo]: Number(evento.currentTarget.value),
                    }))
                  }
                />
                <p className="rx__ayuda" id={`${id}-ayuda`}>
                  {rango.ayuda}
                </p>
              </div>
            );
          })}

          <p className="rx__aviso">
            Estimación según tus supuestos, no una garantía. Parte siempre con un segmento
            pequeño y se mide contra una base sin contacto.
          </p>
        </div>
      </div>
    </div>
  );
}
