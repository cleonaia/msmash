import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/layout/Navbar";
import { Footer } from "@/components/site/layout/Footer";
import { CookieBanner } from "@/components/site/layout/CookieBanner";
import { ChatbotWidget } from "@/components/site/layout/ChatbotWidget";
import { AuthProvider } from "@/providers/AuthProvider";
import { CartProvider } from "@/providers/CartProvider";

// ── Google Fonts ──────────────────────────────────────────────────────────────
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://msmashburger.page"),
  title: {
    default: "M SMASH — Smash Burger Terrassa",
    template: "%s | M SMASH",
  },
  description:
    "Smash burgers de fuego en Carrer del Col·legi, 5 (Terrassa). Carne aplastada al momento, queso fundido hasta los bordes y sabores que no se olvidan.",
  keywords: [
    "smash burger terrassa",
    "hamburguesa terrassa",
    "m smash",
    "smash burger barcelona",
    "msmashburguer",
    "mejor hamburguesa terrassa",
  ],
  authors: { name: "M SMASH Burger" },
  openGraph: {
    title: "M SMASH — Smash Burger Terrassa",
    description: "Aplastado. Dorado. Perfecto. El smash burger definitivo de Terrassa.",
    type: "website",
    locale: "es_ES",
    url: "https://msmashburger.page",
    siteName: "M SMASH",
  },
  twitter: {
    card: "summary_large_image",
    title: "M SMASH — Smash Burger Terrassa",
    description: "Aplastado. Dorado. Perfecto.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${bebasNeue.variable} ${inter.variable} font-sans bg-smash-black text-smash-cream antialiased min-h-screen overflow-x-hidden`}
      >
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <div className="site-shell">
                <Navbar />
              </div>
              <main className="flex-1">{children}</main>
              <div className="site-shell">
                <Footer />
                <ChatbotWidget />
                <CookieBanner />
              </div>
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
