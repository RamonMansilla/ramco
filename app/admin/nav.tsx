"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Portada" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/proyectos", label: "Proyectos" },
  { href: "/admin/cotizaciones", label: "Cotizaciones" },
  { href: "/admin/tareas", label: "Tareas" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin__nav">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link key={link.href} href={link.href} data-active={active}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
