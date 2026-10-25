"use client";

import type { ReactNode } from "react";

import { EscribeTitulo } from "@/components/landing/escribe-titulo";

/* =====================================================================
   Cabecera de sección con el título escrito por una máquina de escribir.
   Recibe texto simple (no componentes) para poder escribirlo letra a letra
   y resaltar una palabra gancho en rojo.
   ===================================================================== */

interface Props {
  index: string;
  label: string;
  /** Primera parte del título, en color normal. */
  antes: string;
  /** Palabra(s) resaltada(s) en rojo. */
  gancho?: string;
  /** Resto del título después del gancho. */
  despues?: string;
  lead?: ReactNode;
  titleId: string;
  /** Milisegundos por letra. */
  velocidad?: number;
}

export function SectionHead({
  index,
  label,
  antes,
  gancho,
  despues,
  lead,
  titleId,
  velocidad = 26,
}: Props) {
  const completo = [antes, gancho, despues].filter(Boolean).join(" ");
  const corteAntes = antes.length;
  const corteGancho = antes.length + (gancho ? gancho.length + 1 : 0);

  return (
    <header className="lp-sec__head" data-reveal data-delay="0">
      <div className="lp-sec__intro">
        <p className="lp-kicker">
          <span className="lp-kicker__num">{index}</span>
          <span className="lp-kicker__sep" aria-hidden="true">
            /
          </span>
          <span className="lp-kicker__label">{label}</span>
        </p>
        <h2 className="lp-h2" id={titleId}>
          <EscribeTitulo
            completo={completo}
            corteAntes={corteAntes}
            corteGancho={corteGancho}
            velocidad={velocidad}
          />
        </h2>
      </div>
      {lead ? <p className="lp-sec__lead">{lead}</p> : null}
    </header>
  );
}
