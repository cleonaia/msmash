import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import { MenuItem } from '@/features/menu/data/menu';

type CategoryInput = { id: string; label: string };
type GroupedCategory = { label: string; items: MenuItem[] };

export async function POST(request: NextRequest) {
  try {
    const { items, categories } = await request.json();

    // Crear PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    // Título
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('M SMASH BURGER', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Aplastado. Dorado. Perfecto.', pageWidth / 2, yPosition, {
      align: 'center',
    });

    yPosition += 15;

    // Agrupar items por categoría
    const groupedByCategory = (categories as CategoryInput[]).reduce<Record<string, GroupedCategory>>(
      (acc, cat) => {
        acc[cat.id] = {
          label: cat.label,
          items: (items as MenuItem[]).filter((item) => item.category === cat.id),
        };
        return acc;
      },
      {}
    );

    // Renderizar cada categoría
    Object.entries(groupedByCategory).forEach(([categoryId, categoryData]: any) => {
      if (categoryData.items.length === 0) return;

      // Verificar si necesita nueva página
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }

      // Título de categoría
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(220, 38, 38); // Red
      pdf.text(categoryData.label.toUpperCase(), margin, yPosition);
      yPosition += 8;

      pdf.setTextColor(0, 0, 0);

      // Items de la categoría
      categoryData.items.forEach((item: MenuItem) => {
        // Verificar página nueva
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }

        // Nombre + Precio
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        const priceText = `${item.price.toFixed(2)}€`;
        const titleWidth = pageWidth - 2 * margin - 20;
        const textSize = pdf.getTextWidth(item.name);

        pdf.text(item.name, margin, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(priceText, pageWidth - margin - pdf.getTextWidth(priceText), yPosition, {
          align: 'right',
        });

        yPosition += 5;

        // Descripción (con wrap)
        pdf.setFontSize(9);
        const descLines = pdf.splitTextToSize(item.description, contentWidth);
        pdf.text(descLines, margin, yPosition);
        yPosition += descLines.length * 4 + 2;

        // Alérgenos
        if (item.allergens.length > 0) {
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(180, 83, 9); // Orange
          const allergenText = `Alérgenos: ${item.allergens.join(', ')}`;
          const allergenLines = pdf.splitTextToSize(allergenText, contentWidth);
          pdf.text(allergenLines, margin, yPosition);
          yPosition += allergenLines.length * 3 + 3;
          pdf.setTextColor(0, 0, 0);
        }

        yPosition += 2;
      });

      yPosition += 5;
    });

    // Footer
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      `Carta actualizada: ${new Date().toLocaleDateString('es-ES')}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // Generar PDF como blob
    const pdfBlob = pdf.output('blob');

    return new NextResponse(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename="carta-msmash.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Error al generar PDF' },
      { status: 500 }
    );
  }
}
