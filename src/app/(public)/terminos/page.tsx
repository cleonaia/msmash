import { legalInfo } from "@/config/site";

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
            <p>
              Todos los precios se muestran en EUR e incluyen IVA. En producto de comida se aplica el tipo reducido (10%) y en bebidas
              el tipo general (21%), ambos ya incluidos en el precio final mostrado en carta y web. Los pagos online se gestionan mediante
              proveedor externo autorizado.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">4. Entrega y recogida</h2>
            <p>
              Ofrecemos recogida en local (takeaway) y, cuando esté disponible, entrega a domicilio por plataformas de delivery.
              Los tiempos son estimados y pueden variar por volumen de pedidos, tráfico, climatología o incidencias operativas.
              El cliente debe revisar dirección, teléfono y franja horaria antes de confirmar.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">5. Cancelaciones y devoluciones</h2>
            <p>
              Por tratarse de productos perecederos y preparados al momento, no se admiten devoluciones una vez iniciado el proceso de cocina,
              salvo incidencia acreditada (pedido incompleto, error imputable al servicio o producto en mal estado).
              Si la preparación no ha comenzado, puedes solicitar cancelación por los canales de contacto.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">6. Incidencias y reembolsos</h2>
            <p>
              Las incidencias deben comunicarse lo antes posible por los canales de contacto y, cuando sea posible, con evidencia (foto y número de pedido).
              En caso procedente, se tramitará reposición del producto o reembolso total/parcial por el mismo método de pago utilizado.
            </p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">7. Alergias e intolerancias</h2>
            <p>Consulta siempre la sección de alérgenos y notifícanos cualquier alergia antes de confirmar pedido. Puede existir contaminación cruzada en cocina.</p>
          </section>

          <hr className="border-smash-border my-8" />

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-4">8. Información legal de la empresa</h2>
            <div className="bg-smash-dark/40 border border-smash-border/50 rounded-lg p-5 space-y-3 text-sm">
              <div>
                <p className="text-smash-cream/35 text-xs uppercase tracking-wide mb-1">Nombre fiscal</p>
                <p className="text-smash-cream/80 font-semibold">{legalInfo.taxName}</p>
              </div>
              <div>
                <p className="text-smash-cream/35 text-xs uppercase tracking-wide mb-1">NIF/CIF</p>
                <p className="text-smash-cream/80 font-semibold">{legalInfo.taxId}</p>
              </div>
              <div>
                <p className="text-smash-cream/35 text-xs uppercase tracking-wide mb-1">Nombre comercial</p>
                <p className="text-smash-cream/80 font-semibold">{legalInfo.commercialName}</p>
              </div>
              <div>
                <p className="text-smash-cream/35 text-xs uppercase tracking-wide mb-1">Tipo de entidad</p>
                <p className="text-smash-cream/80 font-semibold capitalize">{legalInfo.typeEntity}</p>
              </div>
              <div>
                <p className="text-smash-cream/35 text-xs uppercase tracking-wide mb-1">Domicilio fiscal</p>
                <p className="text-smash-cream/80 font-semibold">{legalInfo.address}</p>
              </div>
              <div>
                <p className="text-smash-cream/35 text-xs uppercase tracking-wide mb-1">Titular / Representante legal</p>
                <p className="text-smash-cream/80 font-semibold">{legalInfo.owner.name} ({legalInfo.owner.role})</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-4">9. Datos bancarios</h2>
            <div className="bg-smash-dark/40 border border-smash-border/50 rounded-lg p-5 space-y-3 text-sm">
              <div>
                <p className="text-smash-cream/35 text-xs uppercase tracking-wide mb-1">IBAN</p>
                <p className="text-smash-cream/80 font-mono font-semibold">{legalInfo.iban}</p>
              </div>
              <div>
                <p className="text-smash-cream/35 text-xs uppercase tracking-wide mb-1">BIC/SWIFT</p>
                <p className="text-smash-cream/80 font-mono font-semibold">{legalInfo.bic}</p>
              </div>
              <div>
                <p className="text-smash-cream/35 text-xs uppercase tracking-wide mb-1">Titular de la cuenta</p>
                <p className="text-smash-cream/80 font-semibold">{legalInfo.bankAccountHolder}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
