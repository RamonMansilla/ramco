"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = "[data-reveal]";
const REVEAL_CLASS = "lp-reveal";
const VISIBLE_CLASS = "lp-is-in";

/** Duración total de la transición (0.9s) + el mayor retardo (0.18s). */
const SETTLE_MS = 1300;

/**
 * Animaciones de entrada al hacer scroll.
 *
 * Estrategia:
 * - El HTML llega visible desde el servidor (funciona sin JavaScript).
 * - Al montar, sólo los bloques que aún están fuera de pantalla se ocultan
 *   (`lp-reveal`) y un `IntersectionObserver` los revela al entrar.
 * - Si el bloque ya se ve, no se toca: cero parpadeo.
 * - Al terminar, se retiran las clases para devolver a cada tarjeta sus
 *   propias transiciones de hover.
 * - Con `prefers-reduced-motion: reduce` no se oculta nada.
 */
export function ScrollReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    if (nodes.length === 0) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canObserve = typeof IntersectionObserver !== "undefined";

    if (reducedMotion || !canObserve) return;

    const timers = new Set<number>();

    const settle = (node: HTMLElement) => {
      node.classList.add(VISIBLE_CLASS);
      const timer = window.setTimeout(() => {
        node.classList.remove(REVEAL_CLASS);
        node.classList.remove(VISIBLE_CLASS);
        timers.delete(timer);
      }, SETTLE_MS);
      timers.add(timer);
    };

    const pending: HTMLElement[] = [];

    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const alreadyVisible = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;

      if (alreadyVisible) return;

      node.classList.add(REVEAL_CLASS);
      pending.push(node);
    });

    if (pending.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          settle(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.1 },
    );

    pending.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return null;
}
