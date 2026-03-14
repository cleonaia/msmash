import Link from "next/link";
import { CalendarCheck, Package, Star, ArrowRight } from "lucide-react";

const features = [
  {
    icon: CalendarCheck,
    title: "Les meves reserves",
    description: "Consulta i gestiona les teves reserves al restaurant.",
    color: "bg-virutes-red/10 text-virutes-red",
  },
  {
    icon: Package,
    title: "Comandes Click & Collect",
    description: "Historial de comandes i estats de recollida.",
    color: "bg-virutes-olive/10 text-virutes-olive",
  },
  {
    icon: Star,
    title: "Avantatges de client",
    description: "Pròximament: descomptes, tastings i novetats exclusives.",
    color: "bg-amber-50 text-amber-600",
  },
];

export default function ClientePage() {
  // TODO: wire up real auth / session
  return (
    <div className="min-h-screen bg-virutes-cream-light">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-10 text-center">
          <p className="section-label">Àrea de client</p>
          <h1 className="section-title mt-2">El teu espai a Virutes</h1>
          <p className="mx-auto mt-4 max-w-md text-virutes-brown/70">
            Accedeix al teu compte per gestionar reserves, veure comandes i gaudir de les avantatges exclusives.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/auth/ingresar" className="btn-primary">Accedir</Link>
            <Link href="/cliente/registro" className="btn-ghost">Crear compte</Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-virutes-border bg-white p-6">
              <div className={`mb-3 inline-flex rounded-xl p-3 ${f.color}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h2 className="font-semibold text-virutes-brown">{f.title}</h2>
              <p className="mt-2 text-sm text-virutes-brown/60">{f.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-virutes-brown/40">
          L'autenticació s'integrarà en la propera fase del projecte.
        </p>
      </div>
    </div>
  );
}
