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

function getCustomerAddressFromInvoiceNotes(notes?: string | null) {
  if (!notes) return null
  const prefix = 'Direccion cliente:'
  if (!notes.startsWith(prefix)) return null
  return notes.slice(prefix.length).trim() || null
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

    const paidAt =
      invoice.order?.paymentStatus === 'COMPLETED'
        ? invoice.order.updatedAt
        : invoice.order?.createdAt || invoice.createdAt

    const customerAddress = getCustomerAddressFromInvoiceNotes(invoice.notes)

    const maxDescriptionLines = 2
    const compactRows = invoice.items.map((item) => {
      const description = item.description || 'Producto'
      const roughLines = Math.ceil(description.length / 24)
      const visibleLines = Math.max(1, Math.min(maxDescriptionLines, roughLines))
      return {
        ...item,
        visibleLines,
      }
    })

    const estimatedHeight = 110 + compactRows.reduce((sum, item) => sum + 6 + item.visibleLines * 3.2, 0)
    const pageHeight = Math.max(140, Math.min(220, estimatedHeight))

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, pageHeight],
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const margin = 5
    let y = 8

    // Header compacto (ticket/factura en una sola hoja)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(11)
    pdf.text(siteConfig.name, pageWidth / 2, y, { align: 'center' })

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7.8)
    y += 4.6
    pdf.text(siteConfig.address, pageWidth / 2, y, { align: 'center', maxWidth: pageWidth - margin * 2 })
    y += 3.8
    pdf.text(`Tel: ${contactInfo.phonePretty}`, pageWidth / 2, y, { align: 'center' })

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(8)
    y += 5
    pdf.text(`Factura: ${invoice.invoiceNumber}`, margin, y)
    y += 3.8
    pdf.text(`NIF/CIF: ${legalInfo.taxId}`, margin, y)
    pdf.setFont('helvetica', 'normal')
    y += 3.8
    pdf.text(`Fecha factura: ${new Date(invoice.createdAt).toLocaleString('es-ES')}`, margin, y)
    y += 3.8
    pdf.text(`Pago cliente: ${new Date(paidAt).toLocaleString('es-ES')}`, margin, y)

    y += 3.5
    pdf.setDrawColor(200, 200, 200)
    pdf.line(margin, y, pageWidth - margin, y)
    y += 4.5

    // Customer data
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(8.2)
    pdf.text('Datos del cliente', margin, y)
    y += 3.8

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7.6)
    pdf.text(`Nombre: ${invoice.customerName}`, margin, y, { maxWidth: pageWidth - margin * 2 })
    y += 3.4
    pdf.text(`Email: ${invoice.customerEmail || '-'}`, margin, y, { maxWidth: pageWidth - margin * 2 })
    y += 3.4
    pdf.text(`Tel: ${invoice.customerPhone || '-'}`, margin, y)
    y += 3.4
    pdf.text(`NIF/CIF: ${invoice.customerTaxId || '-'}`, margin, y)
    if (customerAddress) {
      y += 3.4
      pdf.text(`Calle: ${customerAddress}`, margin, y, { maxWidth: pageWidth - margin * 2 })
    }

    y += 4.2

    // Table header
    const tableX = margin
    const colDesc = tableX
    const colQty = tableX + 43
    const colUnit = tableX + 50
    const colTotal = tableX + 64

    pdf.setFont('helvetica', 'bold')
    pdf.setFillColor(245, 245, 245)
    pdf.setFontSize(7)
    pdf.rect(tableX, y, pageWidth - margin * 2, 5.8, 'F')
    pdf.text('Descripcion', colDesc + 1, y + 4)
    pdf.text('Cant', colQty, y + 4)
    pdf.text('P.Unit', colUnit, y + 4)
    pdf.text('Subt', colTotal, y + 4)

    y += 7
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(6.8)

    for (const item of compactRows) {
      const descText = item.description || 'Producto'
      const descriptionLines = pdf.splitTextToSize(descText, 40)
      const trimmedLines = descriptionLines.slice(0, maxDescriptionLines)
      const rowHeight = Math.max(5.8, trimmedLines.length * 3.2)

      pdf.text(trimmedLines, colDesc + 1, y + 2.8)
      pdf.text(String(item.quantity), colQty + 0.8, y + 2.8)
      pdf.text(formatMoneyFromCents(item.unitPrice), colUnit, y + 2.8, { align: 'right' })
      pdf.text(formatMoneyFromCents(item.subtotal), colTotal, y + 2.8, { align: 'right' })

      y += rowHeight + 0.8
      pdf.setDrawColor(225, 225, 225)
      pdf.line(tableX, y, pageWidth - margin, y)
      y += 1.2
    }

    y += 2
    const totalsX = pageWidth - margin

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7.4)
    pdf.text(`Base: ${formatMoneyFromCents(invoice.subtotal)}`, totalsX, y, { align: 'right' })
    y += 4
    pdf.text(`IVA: ${formatMoneyFromCents(invoice.taxAmount)}`, totalsX, y, { align: 'right' })
    y += 4
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9.4)
    pdf.text(`TOTAL: ${formatMoneyFromCents(invoice.totalAmount)}`, totalsX, y, { align: 'right' })

    y += 5
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(6.5)
    pdf.setTextColor(110, 110, 110)
    pdf.text(
      `Emisor: ${legalInfo.taxName} (${legalInfo.taxId})`,
      pageWidth / 2,
      y,
      { align: 'center', maxWidth: pageWidth - margin * 2 }
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
