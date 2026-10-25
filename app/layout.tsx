import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RAMCO · Marketing y desarrollo digital",
    template: "%s · RAMCO",
  },
  description:
    "RAMCO es una empresa chilena de servicios digitales: marketing que convierte y desarrollo web que vende. Sitios, landing pages, automatización y contenido.",
  metadataBase: new URL("https://ramco.cl"),
  openGraph: {
    title: "RAMCO · Marketing y desarrollo digital",
    description:
      "Marketing que vende. Tecnología que convierte. Sitios web, landing pages, automatización y contenido para pymes chilenas.",
    locale: "es_CL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-CL">
      <body>{children}</body>
    </html>
  );
}
