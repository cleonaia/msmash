import Image from 'next/image';

export const metadata = {
  title: 'QR Codes - M SMASH BURGER',
  description: 'Códigos QR de la carta digital y reseñas en Google Maps',
};

export default function QRPage() {
  const cartUrl = 'https://www.msmashburger.page/menu';
  const reviewsUrl = 'https://www.google.com/maps/place/M+SMASH+BURGER/@41.5633,1.9900,17z/reviews';
  
  // Generate QR codes using qr-server API
  const cartQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(cartUrl)}`;
  const reviewsQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(reviewsUrl)}`;

  return (
    <main className="min-h-screen bg-smash-black pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Título */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wide text-smash-cream mb-4">
            Códigos QR
          </h1>
          <p className="text-smash-cream/60 text-lg">Descubre nuestra carta y reseñas con un clic</p>
        </div>

        {/* Grid de QRs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* QR Carta Digital */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <Image
                src={cartQrUrl}
                alt="QR Carta Digital"
                width={400}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <div>
              <h2 className="font-display text-2xl uppercase tracking-wide text-smash-cream mb-2">
                La Carta
              </h2>
              <p className="text-smash-cream/60 mb-4">
                Escanea para ver nuestro menú completo
              </p>
              <p className="text-smash-turquoise text-sm font-semibold break-all">
                {cartUrl}
              </p>
            </div>
          </div>

          {/* QR Reseñas */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <Image
                src={reviewsQrUrl}
                alt="QR Reseñas Google"
                width={400}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <div>
              <h2 className="font-display text-2xl uppercase tracking-wide text-smash-cream mb-2">
                Reseñas Google
              </h2>
              <p className="text-smash-cream/60 mb-4">
                Mira qué dicen nuestros clientes
              </p>
              <p className="text-smash-turquoise text-sm font-semibold break-all">
                5.0 ⭐ Maps Reviews
              </p>
            </div>
          </div>

        </div>

        {/* Instrucciones */}
        <div className="mt-16 bg-smash-smoke border border-smash-border rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <h3 className="font-display text-xl uppercase tracking-wide text-smash-cream mb-4">
            Cómo usar
          </h3>
          <ol className="text-smash-cream/70 space-y-2 text-sm">
            <li>1. Abre esta página en tu móvil o tablet</li>
            <li>2. Haz screenshot de los QR que necesites</li>
            <li>3. Comparte las imágenes en redes o imprime para el local</li>
          </ol>
        </div>

      </div>
    </main>
  );
}
