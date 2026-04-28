import type { Metadata } from "next";
import { AlfajorinaNavbar } from "@/components/alfajorina/Navbar";
import { AlfajorinaFooter } from "@/components/alfajorina/Footer";
import { AlfajorinaChatbot } from "@/components/alfajorina/ChatbotWidget";

export const metadata: Metadata = {
  title: {
    default: "Alfajorina — Alfajores Artesanales Barcelona",
    template: "%s | Alfajorina",
  },
  description:
    "Alfajorina: alfajores artesanales en Barcelona. Dulce de leche casero, cobertura de chocolate belga y sabores únicos. Pide online o visítanos.",
  keywords: [
    "alfajores barcelona",
    "alfajores artesanales",
    "alfajorina",
    "dulce de leche barcelona",
    "alfajores caseros",
    "repostería artesanal barcelona",
    "cajas regalo alfajores",
    "alfajores para eventos",
  ],
  authors: { name: "Alfajorina" },
  creator: "Alfajorina",
  openGraph: {
    title: "Alfajorina — Alfajores Artesanales Barcelona",
    description: "Alfajores artesanales con dulce de leche casero. Tradición, sabor y cariño en cada bocado.",
    type: "website",
    locale: "es_ES",
    siteName: "Alfajorina",
  },
};

export default function AlfajorinaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-alfe-cream text-alfe-text flex flex-col overflow-x-hidden">
      <AlfajorinaNavbar />
      <main className="flex-1">{children}</main>
      <AlfajorinaFooter />
      <AlfajorinaChatbot />
    </div>
  );
}
