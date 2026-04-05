'use client';

import { menuItems, categories } from '@/features/menu/data/menu';
import { siteConfig, contactInfo } from '@/config/site';

export function MenuPDFExport() {
  const generatePDF = async () => {
    try {
      const response = await fetch('/api/menu/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: menuItems, categories }),
      });

      if (!response.ok) throw new Error('Error generating PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `carta-${siteConfig.name}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error al generar PDF');
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={generatePDF}
        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
      >
        📥 Descargar Carta (PDF)
      </button>
      <button
        onClick={() => window.print()}
        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg"
      >
        🖨️ Imprimir
      </button>
    </div>
  );
}
