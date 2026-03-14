import type { Metadata } from "next";
import { Dancing_Script, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/layout/Navbar";
import { Footer } from "@/components/site/layout/Footer";
import { CookieBanner } from "@/components/site/layout/CookieBanner";
import { WhatsAppButton } from "@/components/site/layout/WhatsAppButton";
import { AuthProvider } from "@/providers/AuthProvider";
import { CartProvider } from "@/providers/CartProvider";

// ── Google Fonts ─────────────────────────────────────────────────────────────
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://virutes.com"),
  title: {
    default: "Virutes — Focacceria Artesanal Sabadell",
    template: "%s | Virutes",
  },
  description:
    "Focacceria artesanal al cor de Sabadell. Focaccies, pinses i plats del dia fets amb massa mare i ingredients de proximitat.",
  keywords: [
    "focacceria sabadell",
    "focaccia artesanal",
    "focaccia sabadell",
    "pinsa sabadell",
    "virutes",
    "restaurant sabadell",
    "pa artesà",
  ],
  authors: { name: "Virutes Focacceria Artesanal" },
  openGraph: {
    title: "Virutes — Focacceria Artesanal Sabadell",
    description:
      "Focaccia feta amb ànima. Artesanal, honest i de Sabadell.",
    type: "website",
    locale: "ca_ES",
    url: "https://virutes.com",
    siteName: "Virutes",
  },
  twitter: {
    card: "summary_large_image",
    title: "Virutes — Focacceria Artesanal Sabadell",
    description:
      "Focaccia feta amb ànima. Artesanal, honest i de Sabadell.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca" suppressHydrationWarning>
      <body
        className={`${dancingScript.variable} ${dmSans.variable} ${playfair.variable} font-sans bg-virutes-cream-light text-virutes-brown antialiased min-h-screen overflow-x-hidden`}
      >
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <WhatsAppButton />
              <CookieBanner />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
