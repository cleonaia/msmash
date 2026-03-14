import { PageHeader } from "@/components/shared/PageHeader";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function TiendaPage() {
  return (
    <div>
      <PageHeader
        title="Botiga"
        subtitle="Encàrrecs especials i productes artesanals de Virutes"
        backgroundImage="https://images.unsplash.com/photo-1549931319-a545dcf3bc7c?w=1600&q=80"
      />

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-virutes-red/10">
          <ShoppingBag className="h-9 w-9 text-virutes-red" />
        </div>
        <h2 className="mt-6 font-serif text-3xl italic text-virutes-brown">Pròximament</h2>
        <p className="mx-auto mt-4 max-w-md text-virutes-brown/70">
          La botiga en línia s&apos;obrirà aviat. Mentre tant, pots fer encàrrecs especials directament per WhatsApp o correu electrònic.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contacto" className="btn-primary">Fer un encàrrec</Link>
          <Link href="/menu" className="btn-ghost">Veure la carta</Link>
        </div>
      </section>
    </div>
  );
}
