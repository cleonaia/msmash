import { NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'
import { prisma } from '@/lib/prisma'
import { contactInfo, legalInfo, siteConfig } from '@/config/site'

export const runtime = 'nodejs'

function formatMoneyFromCents(cents: number) {
  return (cents / 100).toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  })
}

export async function GET(
  _request: Request,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.invoiceId },
      include: {
        items: true,
        order: true,
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 })
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const margin = 14
    let y = 16

    // Header
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(18)
    pdf.text(siteConfig.name, margin, y)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    y += 6
    pdf.text(siteConfig.address, margin, y)
    y += 5
    pdf.text(`Email: ${contactInfo.email}`, margin, y)
    y += 5
    pdf.text(`Teléfono: ${contactInfo.phonePretty}`, margin, y)

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    pdf.text(`NIF/CIF: ${legalInfo.taxId}`, pageWidth - margin, 22, { align: 'right' })
    pdf.text(`Factura: ${invoice.invoiceNumber}`, pageWidth - margin, 27, { align: 'right' })
    pdf.setFont('helvetica', 'normal')
    pdf.text(
      `Fecha: ${new Date(invoice.createdAt).toLocaleDateString('es-ES')}`,
      pageWidth - margin,
      32,
      { align: 'right' }
    )

    y += 12
    pdf.setDrawColor(210, 210, 210)
    pdf.line(margin, y, pageWidth - margin, y)
    y += 8

    // Customer data
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(11)
    pdf.text('Datos del cliente', margin, y)
    y += 6

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.text(`Nombre: ${invoice.customerName}`, margin, y)
    y += 5
    pdf.text(`Email: ${invoice.customerEmail}`, margin, y)
    y += 5
    pdf.text(`Teléfono: ${invoice.customerPhone}`, margin, y)
    y += 5
    pdf.text(`NIF/CIF: ${invoice.customerTaxId || '-'}`, margin, y)

    y += 8

    // Table header
    const tableX = margin
    const colDesc = tableX
    const colQty = tableX + 100
    const colUnit = tableX + 120
    const colTotal = tableX + 156

    pdf.setFont('helvetica', 'bold')
    pdf.setFillColor(245, 245, 245)
    pdf.rect(tableX, y, pageWidth - margin * 2, 8, 'F')
    pdf.text('Descripción', colDesc + 1, y + 5.3)
    pdf.text('Cant.', colQty, y + 5.3)
    pdf.text('Precio', colUnit, y + 5.3)
    pdf.text('Subtotal', colTotal, y + 5.3)

    y += 10
    pdf.setFont('helvetica', 'normal')

    for (const item of invoice.items) {
      if (y > 250) {
        pdf.addPage()
        y = 20
      }

      const descriptionLines = pdf.splitTextToSize(item.description, 92)
      const rowHeight = Math.max(7, descriptionLines.length * 4)

      pdf.text(descriptionLines, colDesc + 1, y + 4)
      pdf.text(String(item.quantity), colQty + 2, y + 4)
      pdf.text(formatMoneyFromCents(item.unitPrice), colUnit, y + 4)
      pdf.text(formatMoneyFromCents(item.subtotal), colTotal, y + 4)

      y += rowHeight + 1
      pdf.setDrawColor(235, 235, 235)
      pdf.line(tableX, y, pageWidth - margin, y)
      y += 3
    }

    y += 4
    const totalsX = pageWidth - margin

    pdf.setFont('helvetica', 'normal')
    pdf.text(`Base imponible: ${formatMoneyFromCents(invoice.subtotal)}`, totalsX, y, { align: 'right' })
    y += 6
    pdf.text(`IVA: ${formatMoneyFromCents(invoice.taxAmount)}`, totalsX, y, { align: 'right' })
    y += 6
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(12)
    pdf.text(`TOTAL: ${formatMoneyFromCents(invoice.totalAmount)}`, totalsX, y, { align: 'right' })

    y += 10
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(110, 110, 110)
    pdf.text(
      `Emisor: ${legalInfo.taxName} (${legalInfo.taxId}) · ${legalInfo.address}`,
      margin,
      y
    )

    const pdfBytes = pdf.output('arraybuffer')

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error al generar PDF de factura:', error)
    return NextResponse.json(
      { error: 'No se pudo generar la factura PDF' },
      { status: 500 }
    )
  }
}
