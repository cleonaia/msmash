"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function IngressarPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputCls =
    "w-full rounded-xl border border-virutes-border bg-white/60 px-4 py-3 text-sm text-virutes-brown placeholder:text-virutes-brown/40 focus:outline-none focus:ring-2 focus:ring-virutes-red/30 transition";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: wire up real auth
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    alert("Autenticació pendent d'implementar.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-virutes-cream-light px-4 py-24">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="font-display text-4xl text-virutes-red">Virutes</Link>
          <p className="mt-1 text-sm text-virutes-brown/60">Focacceria Artesanal · Sabadell</p>
        </div>

        <div className="rounded-3xl border border-virutes-border bg-white p-8 shadow-sm">
          <h1 className="mb-6 font-serif text-2xl italic text-virutes-brown">Accedeix al teu compte</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-virutes-brown/60">
                Correu electrònic
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-virutes-brown/30" />
                <input
                  type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@exemple.com"
                  className={inputCls + " pl-10"}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-virutes-brown/60">
                Contrasenya
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-virutes-brown/30" />
                <input
                  type={showPwd ? "text" : "password"} required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className={inputCls + " pl-10 pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-virutes-brown/30 hover:text-virutes-brown"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading || !email || !password}
              className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading
                ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                : null}
              {loading ? "Accedint…" : "Accedir"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-virutes-brown/50">
            No tens compte?{" "}
            <Link href="/cliente/registro" className="font-semibold text-virutes-red hover:underline">
              Registra't
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
