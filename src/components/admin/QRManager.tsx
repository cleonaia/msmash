'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, Share2, Copy, QrCode } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface QRCode {
  id: string;
  name: string;
  url: string;
  description: string;
  icon: string;
}

const qrCodes: QRCode[] = [
  {
    id: 'carta',
    name: 'Carta Digital',
    url: 'https://msmashburger.page/menu',
    description: 'Código QR que enlaza a la carta digital del menú',
    icon: '📋'
  },
  {
    id: 'resenas',
    name: 'Reseñas Google',
    url: siteConfig.googleReviewsUrl,
    description: 'Código QR que enlaza a las reseñas en Google Maps (5.0 ⭐)',
    icon: '⭐'
  },
  {
    id: 'ubicacion',
    name: 'Ubicación',
    url: siteConfig.googleMapsUrl,
    description: 'Código QR que abre la ubicación en Google Maps',
    icon: '📍'
  },
  {
    id: 'pedidos',
    name: 'Realizar Pedido',
    url: 'https://msmashburger.page/pedidos',
    description: 'Código QR para acceder directamente a la página de pedidos',
    icon: '🛒'
  }
];

export function QRManager() {
  const [copied, setCopied] = useState<string | null>(null);

  const getQrImageUrl = (url: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}`;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = async (qr: QRCode) => {
    const link = document.createElement('a');
    link.href = getQrImageUrl(qr.url);
    link.download = `qr-${qr.id}.png`;
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <QrCode className="w-6 h-6" />
          Gestor de Códigos QR
        </h2>
        <p className="text-gray-600">
          Gestiona los códigos QR de la web. Puedes descargarlos, copiar las URLs o compartirlos.
        </p>
      </div>

      {/* QR Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {qrCodes.map((qr) => (
          <div
            key={qr.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            {/* QR Preview */}
            <div className="mb-6 flex justify-center bg-gray-50 p-4 rounded-lg">
              <Image
                src={getQrImageUrl(qr.url)}
                alt={qr.name}
                width={200}
                height={200}
                className="rounded-md"
              />
            </div>

            {/* Info */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{qr.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900">{qr.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">{qr.description}</p>
              <p className="text-xs text-gray-500 break-all font-mono bg-gray-100 p-2 rounded">
                {qr.url}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(qr)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                title="Descargar QR"
              >
                <Download className="w-4 h-4" />
                Descargar
              </button>
              <button
                onClick={() => handleCopy(qr.url, qr.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 text-sm font-medium rounded-lg transition-colors ${
                  copied === qr.id
                    ? 'border-green-500 bg-green-50 text-green-600'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
                title="Copiar URL"
              >
                <Copy className="w-4 h-4" />
                {copied === qr.id ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Cómo usar los QR codes</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Descarga los QR y úsalos en tus redes sociales, materiales impresos o mostrador</li>
          <li>✓ Los QR se actualizan automáticamente con los cambios en la web</li>
          <li>✓ Puedes compartir los URLs directamente sin necesidad de QR</li>
          <li>✓ Accede a https://www.msmashburger.page/qr para ver todos los QR desde móvil</li>
        </ul>
      </div>
    </div>
  );
}
