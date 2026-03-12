"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export default function ClienteDashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-white/60">
        Cargando tu cuenta...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-3xl font-semibold text-white">Accedé a tu área de cliente</h1>
        <p className="max-w-md text-sm text-white/60">
          Consultá tus reservas, pedidos y beneficios. Ingresá con tu email y contraseña o registrate para ser parte del Club Quebracho.
        </p>
        <div className="flex gap-4">
          <Button href="/auth/ingresar">Ingresar</Button>
          <Button href="/cliente/registro" variant="secondary">
            Crear cuenta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] px-4 py-16 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(18,2,0,0.9)_0%,rgba(45,6,0,0.86)_55%,rgba(18,2,0,0.94)_100%)]" aria-hidden />
      <div className="relative surface-card-strong gradient-border rounded-3xl p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Hola {session.user?.name ?? session.user?.email}</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Resumen de tu cuenta</h1>
        <p className="mt-2 text-sm text-white/70">
          En breve podrás ver tus reservas confirmadas, pedidos de la tienda y beneficios exclusivos. Estamos preparando una experiencia completa para fidelizar clientes.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="surface-card gradient-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white">Reservas</h2>
            <p className="mt-2 text-sm text-white/60">Seguimiento de reservas confirmadas y listas de espera.</p>
          </div>
          <div className="surface-card gradient-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white">Pedidos</h2>
            <p className="mt-2 text-sm text-white/60">Historial de compras, estados y notas de entregas.</p>
          </div>
          <div className="surface-card gradient-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white">Beneficios</h2>
            <p className="mt-2 text-sm text-white/60">Próximamente: puntos, degustaciones privadas y más.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
