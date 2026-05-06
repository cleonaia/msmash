import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/layout/Navbar";
import { Footer } from "@/components/site/layout/Footer";
import { CookieBanner } from "@/components/site/layout/CookieBanner";
import { ChatbotWidget } from "@/components/site/layout/ChatbotWidget";
import { SchemaMarkup } from "@/components/shared/SchemaMarkup";
import { AuthProvider } from "@/providers/AuthProvider";
import { CartProvider } from "@/providers/CartProvider";
import { siteConfig } from "@/config/site";

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
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
    shortcut: "/icon.png",
  },
  title: {
    default: "The M Smash Lab — Smash Burger Terrassa | Hamburguesería",
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "The M Smash Lab: Smash burgers auténticos de fuego en Terrassa. Carne aplastada al momento, queso fundido hasta los bordes. Ubicación: Carrer del Col·legi, 5. Sabor que no se olvida.",
  keywords: [
    "smash burger terrassa",
    "hamburguesa terrassa",
    "the m smash lab",
    "smash burger barcelona",
    "msmashburguer",
    "mejor hamburguesa terrassa",
    "burguer artesanal terrassa",
    "comida rápida calidad terrassa",
    "hamburguesería terrassa",
    "smash burger carrer col·legi",
  ],
  authors: { name: siteConfig.name },
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "msmashburger",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "The M Smash Lab — Smash Burger Terrassa",
    description: "Smash burgers auténticos de fuego. Carne aplastada, queso fundido, sabor inolvidable.",
    type: "website",
    locale: "es_ES",
    url: "https://msmashburger.page",
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image-social.png",
        width: 1200,
        height: 630,
        alt: "The M Smash Lab - Smash Burger Terrassa",
        type: "image/png",
      },
      {
        url: "/og-image.png",
        width: 1244,
        height: 1242,
        alt: "Logo The M Smash Lab",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The M Smash Lab — Smash Burger Terrassa",
    description: "Smash burgers auténticos de fuego. Carne aplastada, queso fundido, sabor inolvidable.",
    images: ["/og-image-social.png"],
    creator: "@smashburgerbcn",
    site: "@smashburgerbcn",
  },
  alternates: {
    canonical: "https://msmashburger.page",
    languages: {
      es: "https://msmashburger.page",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <SchemaMarkup />
      </head>
      <body
        className={`${bebasNeue.variable} ${inter.variable} font-sans bg-smash-black text-smash-cream antialiased min-h-screen`}
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
