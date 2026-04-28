"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag } from "lucide-react";
import { alfajorinaNavLinks } from "@/config/alfajorina";

export function AlfajorinaNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/alfajorina";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navBg =
    scrolled || !isHome
      ? "bg-alfe-cream/95 backdrop-blur-md shadow-sm border-b border-alfe-border"
      : "bg-transparent";

  const textColor = scrolled || !isHome ? "text-alfe-text" : "text-white";
  const logoColor = scrolled || !isHome ? "text-alfe-caramel" : "text-white";

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/alfajorina"
              className={`font-display text-3xl tracking-wide transition-colors duration-300 hover:opacity-80 ${logoColor}`}
            >
              Alfajorina
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7">
              {alfajorinaNavLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-sm font-medium tracking-wide transition-colors duration-200
                      after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-alfe-caramel
                      after:transition-all after:duration-300
                      ${
                        active
                          ? "after:w-full text-alfe-caramel"
                          : `after:w-0 hover:after:w-full ${textColor} hover:text-alfe-caramel`
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <Link
                href="/alfajorina/pedidos"
                className={`flex items-center justify-center w-10 h-10 rounded-full border transition-colors duration-200
                  ${
                    scrolled || !isHome
                      ? "border-alfe-border text-alfe-choco-mid hover:border-alfe-caramel hover:text-alfe-caramel"
                      : "border-white/40 text-white hover:border-white hover:bg-white/10"
                  }`}
                aria-label="Ver pedidos"
              >
                <ShoppingBag className="h-4 w-4" />
              </Link>

              <Link
                href="/alfajorina/pedidos"
                className="hidden md:inline-flex btn-alfe-primary text-xs px-5 py-2.5"
              >
                Pedir ahora
              </Link>

              <button
                onClick={() => setMobileOpen(true)}
                className={`md:hidden p-2 rounded-lg transition-colors ${textColor}`}
                aria-label="Abrir menú"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ease-in-out md:hidden
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="absolute inset-0 bg-alfe-cream" />
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-alfe-cream-dark opacity-70 -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-alfe-cream-dark opacity-70 translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/4 left-8 w-3 h-3 rounded-full bg-alfe-caramel/30" />
        <div className="absolute top-1/3 right-12 w-2 h-2 rounded-full bg-alfe-rosa/30" />
        <div className="absolute bottom-1/4 right-8 w-4 h-4 rounded-full bg-alfe-dulce/40" />

        <div className="relative flex flex-col h-full">
          <div className="flex items-center justify-between px-6 pt-7 pb-4">
            <span className="font-display text-3xl text-alfe-caramel">Alfajorina</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-alfe-choco-mid hover:text-alfe-caramel transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          <div className="alfe-divider mx-6" />

          <nav className="flex flex-col items-center justify-center flex-1 gap-5 -mt-8">
            {alfajorinaNavLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{ animationDelay: mobileOpen ? `${i * 60}ms` : "0ms" }}
                className={`font-display text-4xl text-alfe-choco hover:text-alfe-caramel transition-colors uppercase tracking-wide
                  ${mobileOpen ? "animate-fade-up" : ""}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/alfajorina/pedidos"
              onClick={() => setMobileOpen(false)}
              className="mt-4 btn-alfe-primary px-10 py-4 text-base"
            >
              Pedir ahora
            </Link>
          </nav>

          <div className="alfe-divider mx-6" />
          <p className="text-center text-xs text-alfe-choco-light pb-8 tracking-widest uppercase">
            Alfajores Artesanales · Barcelona
          </p>
        </div>
      </div>
    </>
  );
}
