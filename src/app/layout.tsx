import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { AuthProvider } from "@/providers/AuthProvider";
import { CartProvider } from "@/providers/CartProvider";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://quebracho-demo.vercel.app"),
  title: {
    default: "Quebracho Carnes Barcelona",
    template: "%s | Quebracho Carnes Barcelona",
  },
  description:
    "Carnicería argentina en L'Hospitalet de Llobregat con cortes importados, elaborados caseros y reservas para eventos.",
  keywords: [
    "carne argentina barcelona",
    "carnicería argentina",
    "chorizo criollo",
    "asado en barcelona",
    "fiambres artesanales",
    "tienda argentina",
  ],
  authors: { name: "Quebracho Carnes Barcelona" },
  openGraph: {
    title: "Quebracho Carnes Barcelona",
    description:
      "Carnicería argentina en Barcelona con cortes importados, elaborados caseros y reservas personalizadas.",
    type: "website",
    locale: "es_ES",
    url: "https://quebracho-demo.vercel.app",
    siteName: "Quebracho Carnes Barcelona",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quebracho Carnes Barcelona",
    description:
      "Carnicería argentina en Barcelona con tienda online, reservas y productos caseros.",
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
        className={`${sans.variable} ${display.variable} bg-[#120200] text-[#f9f4ee] antialiased min-h-screen overflow-x-hidden`}
      >
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#1c0400]/95 via-[#0f0200]/92 to-[#1c0400]/95">
              <Navbar />
              <main className="flex-1 pt-20 sm:pt-24">{children}</main>
              <Footer />
              <CookieBanner />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
