export const metadata = {
  title: "Información de alérgenos",
  description: "Información orientativa sobre alérgenos en los productos de M SMASH Burger."
};

const alergenoBase = [
  { nombre: "Gluten", ejemplo: "Pan de burger, rebozados, algunas salsas" },
  { nombre: "Lácteos", ejemplo: "Quesos, salsas cremosas" },
  { nombre: "Huevo", ejemplo: "Mayonesas y salsas derivadas" },
  { nombre: "Mostaza", ejemplo: "Salsas y aderezos" },
  { nombre: "Sésamo", ejemplo: "Semillas en pan" },
  { nombre: "Soja", ejemplo: "Algunas salsas y marinados" }
];

export default function AlergenosPage() {
  const updatedAt = "07/04/2026";

  return (
    <div className="min-h-screen bg-smash-black pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-smash-smoke border border-smash-border rounded-2xl p-6 sm:p-10">
        <h1 className="font-display text-4xl uppercase tracking-wide text-smash-cream mb-3">Información de alérgenos</h1>
        <p className="text-smash-cream/50 text-sm mb-8">Última actualización: {updatedAt}</p>

        <div className="space-y-7 text-smash-cream/70 leading-relaxed">
          <section>
            <p>
              Esta información es orientativa. Si tienes alergias o intolerancias, avísanos antes de confirmar el pedido para revisar ingredientes y procesos en cocina.
            </p>
            <p className="text-smash-cream/50 mt-2">
              En una cocina con manipulación compartida no se puede garantizar ausencia total de trazas (contaminación cruzada).
            </p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-3">Alérgenos más habituales</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border border-smash-border rounded-lg overflow-hidden">
                <thead className="bg-smash-black/40 text-smash-cream">
                  <tr>
                    <th className="text-left px-4 py-3 border-b border-smash-border">Alérgeno</th>
                    <th className="text-left px-4 py-3 border-b border-smash-border">Puede estar presente en</th>
                  </tr>
                </thead>
                <tbody>
                  {alergenoBase.map((a) => (
                    <tr key={a.nombre} className="border-b border-smash-border/60 last:border-b-0">
                      <td className="px-4 py-3 font-semibold text-smash-cream">{a.nombre}</td>
                      <td className="px-4 py-3">{a.ejemplo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">Cómo pedir con seguridad</h2>
            <p>Indica siempre tu alergia al hacer pedido online y vuelve a confirmarla al recoger o recibir el pedido.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
