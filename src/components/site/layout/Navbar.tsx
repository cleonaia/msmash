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
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const scrolledOrNotHome = scrolled || !isHome;
  const navBg = scrolledOrNotHome
    ? "bg-smash-dark/95 backdrop-blur-md border-b border-smash-border shadow-fire-sm"
    : "bg-transparent";

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
        <div className="w-full">
          <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex items-center justify-center md:justify-between h-16 sm:h-20">
              {/* Desktop nav - centered */}
              <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link key={link.href} href={link.href}
                      className={`relative text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] lg:tracking-[0.35em] transition-colors duration-200
                        after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-smash-turquoise
                        after:transition-all after:duration-300
                        ${active
                          ? "after:w-full text-smash-turquoise"
                          : "after:w-0 hover:after:w-full text-smash-cream/60 hover:text-smash-turquoise"
                        }`}>
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              {/* Right - desktop social + mobile menu */}
              <div className="absolute right-3 sm:right-4 lg:right-8 flex items-center gap-2 sm:gap-3">
                <Link href="/auth/admin"
                  className="hidden md:inline-flex items-center justify-center px-4 sm:px-5 py-2 lg:py-2.5 border border-smash-cream/35 text-smash-cream text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:border-smash-turquoise hover:text-smash-turquoise active:scale-95 transition-all duration-200">
                  Admin
                </Link>
                <a href="https://www.instagram.com/msmashburguer/" target="_blank" rel="noreferrer"
                  className="hidden md:inline-flex inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 lg:py-2.5 border border-smash-turquoise/60 text-smash-turquoise text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-smash-turquoise hover:text-white active:scale-95 transition-all duration-200">
                  @msmashburguer
                </a>
                <button onClick={() => setMobileOpen(true)}
                  className="md:hidden p-2 text-smash-cream hover:text-smash-turquoise transition-colors active:scale-90"
                  aria-label="Abrir menú">
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 md:hidden
        ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-smash-black" />
        <div className="absolute inset-0 sky-bg opacity-15" />
        <div className="absolute top-0 right-0 w-64 sm:w-80 h-48 sm:h-60 overflow-hidden opacity-10 pointer-events-none">
          <svg width="320" viewBox="0 0 320 120" fill="white" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <ellipse cx="160" cy="80" rx="148" ry="36" />
            <ellipse cx="100" cy="70" rx="76" ry="46" />
            <ellipse cx="200" cy="66" rx="72" ry="42" />
            <ellipse cx="148" cy="55" rx="60" ry="48" />
          </svg>
        </div>
        <div className="relative flex flex-col h-full">
          <div className="flex items-center justify-between px-4 sm:px-6 pt-5 pb-3">
            <div />
            <button onClick={() => setMobileOpen(false)}
              className="p-2 text-smash-cream/60 hover:text-smash-cream transition-colors active:scale-90"
              aria-label="Cerrar menú">
              <X className="h-6 w-6 sm:h-7 sm:w-7" />
            </button>
          </div>
          <div className="fire-divider mx-4 sm:mx-6" />
          <nav className="flex flex-col items-center justify-center flex-1 gap-4 sm:gap-5 px-4">
            {navLinks.map((link, i) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                style={{ animationDelay: mobileOpen ? `${i * 70}ms` : "0ms" }}
                className={`font-display text-4xl sm:text-5xl text-smash-cream hover:text-smash-turquoise transition-colors tracking-widest uppercase
                  ${mobileOpen ? "animate-fade-up" : ""}`}>
                {link.label}
              </Link>
            ))}
            <Link
              href="/auth/admin"
              onClick={() => setMobileOpen(false)}
              className="mt-2 font-display text-2xl sm:text-3xl text-smash-turquoise hover:text-smash-cream transition-colors tracking-wider uppercase"
            >
              Admin
            </Link>
          </nav>
          <div className="fire-divider mx-4 sm:mx-6" />
          <p className="text-center text-[9px] sm:text-[10px] font-black text-smash-cream/25 uppercase tracking-[0.3em] sm:tracking-[0.4em] py-4 sm:py-6 px-4">
            Smash Burger · Carrer del Col·legi, 5
          </p>
        </div>
      </div>
    </>
  );
}
