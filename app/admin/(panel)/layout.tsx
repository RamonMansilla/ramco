import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "../nav";
import { requireUser } from "@/lib/auth";
import { logout } from "../login/actions";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel RAMCO" },
  robots: { index: false, follow: false },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireUser();

  return (
    <div className="admin">
      <header className="admin__bar">
        <div className="row">
          <Link href="/admin" className="admin__brand">
            <span className="admin__dot" />
            RAMCO
          </Link>
          <span className="dim" style={{ marginLeft: 4 }}>
            panel interno
          </span>
        </div>

        <AdminNav />

        <div className="row" style={{ gap: 10 }}>
          <span
            className="dim"
            style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {user.email}
          </span>
          <form action={logout}>
            <button className="btn btn--ghost btn--sm" type="submit">
              Salir
            </button>
          </form>
        </div>
      </header>

      <main className="admin__main">{children}</main>
    </div>
  );
}
