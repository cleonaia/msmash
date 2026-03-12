"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const params = useSearchParams();
  const reason = params.get("reason");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(() => {
      signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/cliente",
      }).catch(() => {
        setError("No pudimos iniciar sesión. Verificá tus datos.");
      });
    });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[linear-gradient(150deg,rgba(18,2,0,0.9)_0%,rgba(45,6,0,0.86)_55%,rgba(18,2,0,0.94)_100%)] px-4 py-24">
      <div className="w-full max-w-md space-y-8 surface-card-strong gradient-border rounded-3xl p-8 shadow-[0_30px_140px_-60px_rgba(227,58,32,0.6)]">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Quebracho</p>
          <h1 className="text-3xl font-semibold text-white">Ingresá a tu cuenta</h1>
          <p className="text-sm text-white/60">Reservas, pedidos recientes y beneficios del Club Quebracho.</p>
          {reason === "forbidden" && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              Necesitás permisos de administrador para acceder a esa sección.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[rgba(18,2,0,0.6)] px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
              placeholder="tucorreo@email.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-white">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[rgba(18,2,0,0.6)] px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
              placeholder="••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</p>
          )}

          <Button type="submit" size="lg" disabled={isPending || !email || !password}>
            {isPending ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

        <p className="text-center text-xs text-white/50">
          ¿No tenés cuenta? <Link href="/cliente/registro" className="text-amber-400">Registrate</Link>
        </p>
      </div>
    </div>
  );
}
