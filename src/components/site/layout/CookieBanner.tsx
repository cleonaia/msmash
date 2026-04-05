"use client";

import { useState } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 left-0 right-0 z-[80] bg-smash-dark/98 backdrop-blur-lg text-white border-t-2 border-smash-fire/30 shadow-[0_-18px_50px_rgba(0,0,0,0.45)] rounded-t-3xl sm:rounded-t-none"
    >
      <div className="fire-divider" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <p className="text-sm sm:text-[15px] leading-relaxed text-smash-cream/75 text-center sm:text-left max-w-3xl">
          Usamos cookies para mejorar tu experiencia en M SMASH.{" "}
          <Link href="/cookies" className="underline text-smash-sky-light hover:text-white transition-colors">
            Más información
          </Link>
        </p>
        <div className="flex shrink-0 gap-3 w-full sm:w-auto justify-center sm:justify-end">
          <button
            onClick={() => setDismissed(true)}
            className="px-5 py-2.5 text-sm font-medium text-smash-cream/70 hover:text-white border border-smash-border rounded-full transition-colors bg-smash-smoke/40"
          >
            Rechazar
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="btn-smash text-xs px-6 py-2.5 shadow-fire-sm"
          >
            Aceptar cookies
          </button>
        </div>
      </div>
    </div>
  );
}
