"use client";

/* =====================================================================
   RAMNCO · vista previa del panel de reactivación.
   Es una maqueta de presentación: los datos son de ejemplo y así se
   declara en pantalla. Al hacer scroll, el panel se anima como si
   estuviera procesando la campaña.
   ===================================================================== */

import { useEffect, useRef, useState } from "react";

import "./demo-panel.css";

interface Fila {
  nombre: string;
  empresa: string;
  estado: string;
  valor: string | null;
}

const FILAS: Fila[] = [
  { nombre: "Camila Soto", empresa: "Panadería Los Robles", estado: "recuperado", valor: "$186.000" },
  { nombre: "Ignacio Pérez", empresa: "Clínica Dental Aurora", estado: "cotizado", valor: null },
  { nombre: "María José Rivas", empresa: "Constructora Andes", estado: "respondio", valor: null },
  { nombre: "Luis Vega", empresa: "Transportes Vega", estado: "contactado", valor: null },
  { nombre: "Ana Muñoz", empresa: "Veterinaria San Bernardo", estado: "recuperado", valor: "$92.500" },
  { nombre: "Felipe Contreras", empresa: "Taller El Motor", estado: "pendiente", valor: null },
  { nombre: "Rocío Salinas", empresa: "Óptica Central", estado: "recuperado", valor: "$143.200" },
  { nombre: "Diego Fuentes", empresa: "Gimnasio Forma", estado: "descartado", valor: null },
];

const ETIQUETA: Record<string, string> = {
  pendiente: "Pendiente",
  contactado: "Contactado",
  respondio: "Respondió",
  cotizado: "Cotizó",
  recuperado: "Recuperado",
  descartado: "Descartado",
};

const PASOS = ["pendiente", "contactado", "respondio", "cotizado", "recuperado", "descartado"];

export function DemoPanel() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visibles, setVisibles] = useState(FILAS.length);
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    const nodo = ref.current;
    const sinMovimiento =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (sinMovimiento || typeof IntersectionObserver === "undefined" || !nodo) {
      setActivo(true);
      return;
    }

    setVisibles(0);
    let temporizador = 0;
    let indice = 0;

    const avanzar = () => {
      indice += 1;
      setVisibles(indice);
      if (indice >= FILAS.length) return;
      temporizador = window.setTimeout(avanzar, 220);
    };

    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((entrada) => entrada.isIntersecting)) return;
        observador.disconnect();
        setActivo(true);
        temporizador = window.setTimeout(avanzar, 380);
      },
      { threshold: 0.28 },
    );

    observador.observe(nodo);
    return () => {
      observador.disconnect();
      window.clearTimeout(temporizador);
    };
  }, []);

  return (
    <div ref={ref} className="dp" data-activo={activo ? "si" : "no"}>
      <div className="dp__marco">
        <div className="dp__barra">
          <span className="dp__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="dp__titulo">Panel RAMNCO · Campaña «Clientes 2024 sin recompra»</span>
          <span className="dp__ejemplo">EJEMPLO</span>
        </div>

        <div className="dp__kpis">
          <div className="dp__kpi">
            <span>Cartera</span>
            <strong>800</strong>
            <small>contactos con datos útiles</small>
          </div>
          <div className="dp__kpi">
            <span>Trabajados</span>
            <strong>{Math.min(480, visibles * 60)}</strong>
            <small>con intento registrado</small>
          </div>
          <div className="dp__kpi">
            <span>Respondieron</span>
            <strong>{Math.min(112, visibles * 14)}</strong>
            <small>tasa de respuesta 23%</small>
          </div>
          <div className="dp__kpi dp__kpi--hot">
            <span>Ingreso recuperado</span>
            <strong>$421.700</strong>
            <small>3 clientes de vuelta</small>
          </div>
        </div>

        <div className="dp__tabla">
          <div className="dp__fila dp__fila--head" aria-hidden="true">
            <span>Contacto</span>
            <span>Estado</span>
            <span>Valor</span>
          </div>

          {FILAS.map((fila, indice) => {
            const visible = indice < visibles;
            return (
              <div
                key={fila.nombre}
                className="dp__fila"
                data-visible={visible ? "si" : "no"}
              >
                <span className="dp__contacto">
                  <strong>{fila.nombre}</strong>
                  <small>{fila.empresa}</small>
                </span>
                <span className={`dp__estado dp__estado--${fila.estado}`}>
                  {ETIQUETA[fila.estado] ?? fila.estado}
                </span>
                <span className={fila.valor ? "dp__valor" : "dp__valor dp__valor--vacio"}>
                  {fila.valor ?? "—"}
                </span>
              </div>
            );
          })}
        </div>

        <ol className="dp__flujo" aria-label="Estados por los que pasa cada contacto">
          {PASOS.map((paso) => (
            <li key={paso} className={`dp__paso dp__paso--${paso}`}>
              {ETIQUETA[paso]}
            </li>
          ))}
        </ol>

        <p className="dp__nota">
          Vista de ejemplo con datos ilustrativos. En la campaña real cada fila es un cliente
          tuyo, con el resultado de su contacto y el monto recuperado.
        </p>
      </div>
    </div>
  );
}
