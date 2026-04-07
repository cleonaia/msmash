export const metadata = {
  title: "Política de cookies",
  description: "Información sobre cookies y tecnologías similares en M SMASH Burger."
};

export default function CookiesPage() {
  const updatedAt = "07/04/2026";

  return (
    <div className="min-h-screen bg-smash-black pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-smash-smoke border border-smash-border rounded-2xl p-6 sm:p-10">
        <h1 className="font-display text-4xl uppercase tracking-wide text-smash-cream mb-3">Política de cookies</h1>
        <p className="text-smash-cream/50 text-sm mb-8">Última actualización: {updatedAt}</p>

        <div className="space-y-7 text-smash-cream/70 leading-relaxed">
          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">1. Qué son las cookies</h2>
            <p>Son archivos pequeños que se almacenan en tu dispositivo para permitir funciones técnicas, recordar preferencias y medir uso del sitio.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">2. Tipos de cookies que usamos</h2>
            <p>Cookies técnicas necesarias, cookies de preferencias y, cuando aplique, cookies analíticas para entender el uso de la web.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">3. Gestión del consentimiento</h2>
            <p>Puedes aceptar o rechazar cookies no esenciales desde el banner de cookies. También puedes cambiarlas desde la configuración del navegador.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">4. Conservación</h2>
            <p>La duración de cada cookie depende de su finalidad y configuración técnica. Las cookies de sesión se eliminan al cerrar el navegador.</p>
          </section>

          <section>
            <h2 className="text-xl text-smash-cream font-semibold mb-2">5. Más información</h2>
            <p>Si necesitas más información sobre cookies y privacidad, escríbenos desde la sección de contacto de la web.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
