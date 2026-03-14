import Link from "next/link";
import { LayoutDashboard, CalendarCheck, ShoppingBag, MessageSquare, ArrowRight } from "lucide-react";

const stats = [
  { icon: CalendarCheck, label: "Reserves pendents",  value: "–", color: "bg-virutes-red/10 text-virutes-red" },
  { icon: ShoppingBag,   label: "Comandes avui",      value: "–", color: "bg-virutes-olive/10 text-virutes-olive" },
  { icon: MessageSquare, label: "Missatges nous",     value: "–", color: "bg-blue-50 text-blue-600" },
];

export default function AdminDashboardPage() {
  // TODO: connect to real data source when auth + DB are wired up
  return (
    <div className="min-h-screen bg-virutes-cream-light">
      {/* Header */}
      <div className="border-b border-virutes-border bg-white px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <LayoutDashboard className="h-5 w-5 text-virutes-red" />
          <h1 className="font-serif text-2xl italic text-virutes-brown">Àrea d'administració — Virutes</h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-10 px-6 py-12">
        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-virutes-border bg-white p-6">
              <div className={`mb-3 inline-flex rounded-xl p-3 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <p className="text-3xl font-bold text-virutes-brown">{s.value}</p>
              <p className="mt-1 text-sm text-virutes-brown/60">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-virutes-border bg-white p-6">
            <h2 className="mb-2 font-semibold text-virutes-brown">Properes reserves</h2>
            <p className="text-sm text-virutes-brown/60">Aquí apareixeran les reserves confirmades quan el sistema de reserves estigui connectat.</p>
          </div>
          <div className="rounded-2xl border border-virutes-border bg-white p-6">
            <h2 className="mb-2 font-semibold text-virutes-brown">Darreres comandes</h2>
            <p className="text-sm text-virutes-brown/60">Aquí apareixeran les comandes Click &amp; Collect quan la botiga estigui activa.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-virutes-red/30 bg-virutes-red/5 p-6">
          <p className="text-sm font-medium text-virutes-red">⚠️ Panell en construcció</p>
          <p className="mt-1 text-sm text-virutes-brown/70">
            L'autenticació i la base de dades s'integraran en la propera fase. Mentre tant,{" "}
            <Link href="/reservas" className="underline">pots veure la pàgina de reserves</Link> directament.
          </p>
        </div>
      </div>
    </div>
  );
}
