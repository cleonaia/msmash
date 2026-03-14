"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/config/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navBg = scrolled || !isHome
    ? "bg-virutes-cream-light/95 backdrop-blur-md shadow-sm border-b border-virutes-border"
    : "bg-transparent";

  const textColor = scrolled || !isHome ? "text-virutes-brown" : "text-white";
  const logoColor = scrolled || !isHome ? "text-virutes-red" : "text-white";

  return (
    <>
      {/* ── Desktop / Main navbar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              className={`font-display text-3xl transition-colors duration-300 hover:opacity-80 ${logoColor}`}
            >
              Virutes
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-sm font-medium tracking-wide transition-colors duration-200
                      after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-virutes-red
                      after:transition-all after:duration-300
                      ${active ? "after:w-full text-virutes-red" : `after:w-0 hover:after:w-full ${textColor} hover:text-virutes-red`}
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Link
                href="/reservas"
                className="hidden md:inline-flex btn-primary text-xs px-5 py-2.5"
              >
                Reserva ara
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                className={`md:hidden p-2 rounded-lg transition-colors ${textColor}`}
                aria-label="Obrir menú"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile overlay menu ── */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ease-in-out
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        <div className="absolute inset-0 bg-virutes-cream-light" />
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-virutes-cream opacity-60 -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-virutes-cream opacity-60 translate-y-1/3 -translate-x-1/3" />

        <div className="relative flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-7 pb-4">
            <span className="font-display text-3xl text-virutes-red">Virutes</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-virutes-brown hover:text-virutes-red transition-colors"
              aria-label="Tancar menú"
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col items-center justify-center flex-1 gap-6 -mt-8">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{ animationDelay: mobileOpen ? `${i * 60}ms` : "0ms" }}
                className={`font-serif italic text-4xl text-virutes-brown hover:text-virutes-red transition-colors
                  ${mobileOpen ? "animate-fade-up" : ""}
                `}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/reservas"
              onClick={() => setMobileOpen(false)}
              className="mt-4 btn-primary px-10 py-4 text-base"
            >
              Reserva ara
            </Link>
          </nav>

          {/* Footer */}
          <p className="text-center text-xs text-virutes-brown/40 pb-8">
            Focacceria Artesanal · Sabadell
          </p>
        </div>
      </div>
    </>
  );
}
