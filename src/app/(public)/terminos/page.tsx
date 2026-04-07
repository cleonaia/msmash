export const metadata = {
  title: "Términos y condiciones",
  description: "Condiciones de compra y uso de la web de M SMASH Burger."
};

export default function TerminosPage() {
  const updatedAt = "07/04/2026";

  return (
    <div className="min-h-screen bg-smash-black pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-smash-smoke border border-smash-border rounded-2xl p-6 sm:p-10">
        <h1 className="font-display text-4xl uppercase tracking-wide text-smash-cream mb-3">Términos y condiciones</h1>
        <p className="text-smash-cream/50 text-sm mb-8">Última actualización: {updatedAt}</p>

        <div className="space-y-7 text-smash-cream/70 leading-relaxed">
          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">1. Ámbito</h2>
            <p>Estas condiciones regulan el uso de la web y la compra de productos ofrecidos por M SMASH Burger.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">2. Pedidos</h2>
            <p>El cliente debe facilitar datos veraces. El pedido se considera recibido tras confirmación del sistema.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">3. Precios y pagos</h2>
            <p>Los precios se muestran en EUR e incluyen impuestos aplicables salvo indicación expresa. Los pagos online se gestionan mediante proveedor externo autorizado.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">4. Entrega y recogida</h2>
            <p>Los tiempos son estimados y pueden variar por volumen de pedidos o causas operativas. El cliente debe revisar dirección y teléfono antes de confirmar.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">5. Cancelaciones y devoluciones</h2>
            <p>Por tratarse de productos perecederos y preparados al momento, no se admiten devoluciones una vez iniciado el proceso de cocina, salvo incidencia acreditada.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">6. Incidencias y reembolsos</h2>
            <p>Las incidencias deben comunicarse lo antes posible por los canales de contacto. En caso procedente, se tramitará reembolso total o parcial.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">7. Alergias e intolerancias</h2>
            <p>Consulta siempre la sección de alérgenos y notifícanos cualquier alergia antes de confirmar pedido. Puede existir contaminación cruzada en cocina.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
