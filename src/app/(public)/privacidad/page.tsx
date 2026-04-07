import { siteConfig, contactInfo } from "@/config/site";

export const metadata = {
  title: "Política de privacidad",
  description: "Cómo tratamos tus datos personales en M SMASH Burger."
};

export default function PrivacidadPage() {
  const updatedAt = "07/04/2026";

  return (
    <div className="min-h-screen bg-smash-black pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-smash-smoke border border-smash-border rounded-2xl p-6 sm:p-10">
        <h1 className="font-display text-4xl uppercase tracking-wide text-smash-cream mb-3">Política de privacidad</h1>
        <p className="text-smash-cream/50 text-sm mb-8">Última actualización: {updatedAt}</p>

        <div className="space-y-7 text-smash-cream/70 leading-relaxed">
          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">1. Responsable del tratamiento</h2>
            <p>
              Responsable: {siteConfig.name}. Dirección: {siteConfig.address}. Correo de contacto: {contactInfo.email}.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">2. Datos que recopilamos</h2>
            <p>Podemos tratar nombre, email, teléfono, dirección de entrega, datos del pedido y datos técnicos de navegación.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">3. Finalidades</h2>
            <p>Usamos los datos para gestionar pedidos, atención al cliente, facturación, comunicaciones operativas y mejora del servicio.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">4. Base legal</h2>
            <p>La base legal es la ejecución de la relación contractual del pedido, el cumplimiento de obligaciones legales y, cuando aplique, el consentimiento.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">5. Conservación</h2>
            <p>Conservamos los datos el tiempo necesario para prestar el servicio y cumplir obligaciones legales, fiscales y de seguridad.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">6. Destinatarios</h2>
            <p>Podemos compartir datos con proveedores tecnológicos y plataformas de pago/delivery estrictamente necesarios para operar el pedido.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">7. Derechos</h2>
            <p>Puedes ejercer derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a {contactInfo.email}.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">8. Seguridad</h2>
            <p>Aplicamos medidas técnicas y organizativas razonables para proteger tus datos personales frente a acceso no autorizado o pérdida.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
