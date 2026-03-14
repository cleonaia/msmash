"use client";

import { useState } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      role="dialog"
      aria-label="Avís de cookies"
      className="fixed bottom-0 left-0 right-0 z-40 bg-virutes-brown/95 backdrop-blur-sm text-white border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white/80 text-center sm:text-left">
          Fem servir cookies per millorar la teva experiència a Virutes.{" "}
          <Link href="/cookies" className="underline text-virutes-cream hover:text-white transition-colors">
            Més informació
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => setDismissed(true)}
            className="px-4 py-2 text-sm text-white/60 hover:text-white border border-white/20 rounded-full transition-colors"
          >
            Rebutjar
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="btn-primary text-xs px-5 py-2"
          >
            Acceptar cookies
          </button>
        </div>
      </div>
    </div>
  );
}
