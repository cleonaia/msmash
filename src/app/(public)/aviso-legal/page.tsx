import Link from "next/link";
import { siteConfig, contactInfo } from "@/config/site";

export const metadata = {
  title: "Aviso legal",
  description: "Información legal del sitio web de M SMASH Burger."
};

export default function AvisoLegalPage() {
  const updatedAt = "07/04/2026";

  return (
    <div className="min-h-screen bg-smash-black pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-smash-smoke border border-smash-border rounded-2xl p-6 sm:p-10">
        <h1 className="font-display text-4xl uppercase tracking-wide text-smash-cream mb-3">Aviso legal</h1>
        <p className="text-smash-cream/50 text-sm mb-8">Última actualización: {updatedAt}</p>

        <div className="space-y-7 text-smash-cream/70 leading-relaxed">
          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">1. Titular de la web</h2>
            <p>{siteConfig.name}. Dirección comercial: {siteConfig.address}. Contacto: {contactInfo.email} · {contactInfo.phonePretty}.</p>
            <p className="text-smash-cream/50 mt-2">Nota: completa el NIF/CIF y razón social definitiva del titular antes de apertura pública.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">2. Objeto</h2>
            <p>Este sitio informa sobre productos y servicios de restauración y permite la realización de pedidos online según disponibilidad.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">3. Propiedad intelectual</h2>
            <p>Los contenidos de esta web (textos, imágenes, logotipos y diseño) están protegidos por derechos de propiedad intelectual.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">4. Responsabilidad</h2>
            <p>Se realizan esfuerzos razonables para mantener información actualizada y disponibilidad del servicio, sin garantizar ausencia total de errores o interrupciones.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">5. Condiciones relacionadas</h2>
            <p>
              Consulta también las <Link href="/terminos" className="text-smash-sky hover:underline">condiciones de compra</Link>,
              la <Link href="/privacidad" className="text-smash-sky hover:underline"> política de privacidad</Link>,
              la <Link href="/cookies" className="text-smash-sky hover:underline"> política de cookies</Link> y
              la <Link href="/alergenos" className="text-smash-sky hover:underline"> información de alérgenos</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
