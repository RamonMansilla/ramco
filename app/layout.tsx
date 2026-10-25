import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const display = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RAMNCO · Publicidad que convierte en ventas",
    template: "%s · RAMNCO",
  },
  description:
    "RAMNCO es una asesoría de publicidad estratégica: estrategia, pauta y optimización en Google Ads y Meta Ads para hacer crecer tu negocio, con reportes claros y control real de la inversión.",
  metadataBase: new URL("https://ramnco.cl"),
  openGraph: {
    title: "RAMNCO · Publicidad que convierte en ventas",
    description:
      "Estrategia, pauta y optimización para hacer crecer tu negocio. Google Ads + Meta Ads con reportes simples y métricas claras.",
    locale: "es_CL",
    type: "website",
    siteName: "RAMNCO",
  },
  twitter: {
    card: "summary_large_image",
    title: "RAMNCO · Publicidad que convierte en ventas",
    description: "Estrategia, pauta y optimización para hacer crecer tu negocio.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-CL" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
