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

function formatDateTime(value: Date) {
  return new Date(value).toLocaleString('es-ES')
}

function getCustomerAddressFromInvoiceNotes(notes?: string | null) {
  if (!notes) return null
  const prefix = 'Direccion cliente:'
  if (!notes.startsWith(prefix)) return null
  return notes.slice(prefix.length).trim() || null
}

function renderA4Invoice(pdf: jsPDF, invoice: any, paidAt: Date, customerAddress: string | null) {
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 16
  const contentWidth = pageWidth - margin * 2

  let y = 20

  // Header
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(24)
  pdf.text(siteConfig.name, margin, y)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10.5)
  y += 6
  pdf.text(siteConfig.address, margin, y)
  y += 5
  pdf.text(`Tel: ${contactInfo.phonePretty}`, margin, y)

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.text('FACTURA', pageWidth - margin, 24, { align: 'right' })

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.text(`Numero: ${invoice.invoiceNumber}`, pageWidth - margin, 31, { align: 'right' })
  pdf.text(`Fecha: ${formatDateTime(invoice.createdAt)}`, pageWidth - margin, 36, { align: 'right' })
  pdf.text(`Pago cliente: ${formatDateTime(paidAt)}`, pageWidth - margin, 41, { align: 'right' })

  y = 50
  pdf.setDrawColor(220, 220, 220)
  pdf.line(margin, y, pageWidth - margin, y)

  // Issuer and customer boxes
  y += 8
  const leftBoxX = margin
  const rightBoxX = margin + contentWidth / 2 + 4
  const boxWidth = contentWidth / 2 - 4

  pdf.setFillColor(248, 248, 248)
  pdf.rect(leftBoxX, y, boxWidth, 34, 'F')
  pdf.rect(rightBoxX, y, boxWidth, 34, 'F')

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.text('EMISOR', leftBoxX + 3, y + 6)
  pdf.text('CLIENTE', rightBoxX + 3, y + 6)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9.5)
  pdf.text(legalInfo.taxName, leftBoxX + 3, y + 12)
  pdf.text(`NIF/CIF: ${legalInfo.taxId}`, leftBoxX + 3, y + 17)
  pdf.text(legalInfo.address, leftBoxX + 3, y + 22, { maxWidth: boxWidth - 6 })

  let cy = y + 12
  pdf.text(`Nombre: ${invoice.customerName || '-'}`, rightBoxX + 3, cy, { maxWidth: boxWidth - 6 })
  cy += 5
  pdf.text(`Email: ${invoice.customerEmail || '-'}`, rightBoxX + 3, cy, { maxWidth: boxWidth - 6 })
  cy += 5
  pdf.text(`Tel: ${invoice.customerPhone || '-'}`, rightBoxX + 3, cy, { maxWidth: boxWidth - 6 })
  cy += 5
  pdf.text(`NIF/CIF: ${invoice.customerTaxId || '-'}`, rightBoxX + 3, cy, { maxWidth: boxWidth - 6 })
  if (customerAddress) {
    cy += 5
    pdf.text(`Calle: ${customerAddress}`, rightBoxX + 3, cy, { maxWidth: boxWidth - 6 })
  }

  // Table
  y += 44
  const tableX = margin
  const tableWidth = contentWidth
  const colDescX = tableX + 3
  const colQtyRight = tableX + 120
  const colUnitRight = tableX + 154
  const colTotalRight = tableX + tableWidth - 3

  const drawTableHeader = () => {
    pdf.setFillColor(238, 238, 238)
    pdf.rect(tableX, y, tableWidth, 8, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    pdf.text('Descripcion', colDescX, y + 5.5)
    pdf.text('Cant', colQtyRight, y + 5.5, { align: 'right' })
    pdf.text('P.Unit', colUnitRight, y + 5.5, { align: 'right' })
    pdf.text('Subtotal', colTotalRight, y + 5.5, { align: 'right' })
    y += 9
  }

  drawTableHeader()

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9.5)

  for (const item of invoice.items) {
    const description = item.description || 'Producto'
    const descLines = pdf.splitTextToSize(description, colQtyRight - colDescX - 8)
    const rowHeight = Math.max(7, descLines.length * 4.2)

    if (y + rowHeight + 35 > pageHeight) {
      pdf.addPage()
      y = 20
      drawTableHeader()
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9.5)
    }

    pdf.text(descLines, colDescX, y + 4.5)
    pdf.text(String(item.quantity), colQtyRight, y + 4.5, { align: 'right' })
    pdf.text(formatMoneyFromCents(item.unitPrice), colUnitRight, y + 4.5, { align: 'right' })
    pdf.text(formatMoneyFromCents(item.subtotal), colTotalRight, y + 4.5, { align: 'right' })

    y += rowHeight
    pdf.setDrawColor(228, 228, 228)
    pdf.line(tableX, y, tableX + tableWidth, y)
    y += 2
  }

  // Totals box
  const totalsBoxWidth = 74
  const totalsBoxX = pageWidth - margin - totalsBoxWidth
  const totalsBoxY = y + 4

  pdf.setFillColor(250, 250, 250)
  pdf.rect(totalsBoxX, totalsBoxY, totalsBoxWidth, 25, 'F')

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.text(`Base: ${formatMoneyFromCents(invoice.subtotal)}`, totalsBoxX + totalsBoxWidth - 3, totalsBoxY + 7, { align: 'right' })
  pdf.text(`IVA: ${formatMoneyFromCents(invoice.taxAmount)}`, totalsBoxX + totalsBoxWidth - 3, totalsBoxY + 13, { align: 'right' })

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(13)
  pdf.text(`TOTAL: ${formatMoneyFromCents(invoice.totalAmount)}`, totalsBoxX + totalsBoxWidth - 3, totalsBoxY + 21, { align: 'right' })

  // Footer
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(110, 110, 110)
  pdf.text(
    `Emisor: ${legalInfo.taxName} (${legalInfo.taxId})`,
    pageWidth / 2,
    pageHeight - 12,
    { align: 'center' }
  )
}

function renderTicketInvoice(pdf: jsPDF, invoice: any, paidAt: Date, customerAddress: string | null) {
  const maxDescriptionLines = 2
  const compactRows = invoice.items.map((item: any) => {
    const description = item.description || 'Producto'
    const roughLines = Math.ceil(description.length / 20)
    const visibleLines = Math.max(1, Math.min(maxDescriptionLines, roughLines))
    return {
      ...item,
      visibleLines,
    }
  })

  const estimatedHeight = 114 + compactRows.reduce((sum: number, item: any) => sum + 7 + item.visibleLines * 3.4, 0)
  const pageHeight = Math.max(140, Math.min(220, estimatedHeight))

  pdf.deletePage(1)
  pdf.addPage([80, pageHeight], 'portrait')

  const pageWidth = pdf.internal.pageSize.getWidth()
  const margin = 5
  let y = 8

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
  pdf.text(`Fecha factura: ${formatDateTime(invoice.createdAt)}`, margin, y)
  y += 3.8
  pdf.text(`Pago cliente: ${formatDateTime(paidAt)}`, margin, y)

  y += 3.5
  pdf.setDrawColor(200, 200, 200)
  pdf.line(margin, y, pageWidth - margin, y)
  y += 4.5

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
  const tableX = margin
  const tableWidth = pageWidth - margin * 2
  const colDesc = tableX + 1
  const colQtyRight = tableX + 46
  const colUnitRight = tableX + 58
  const colTotalRight = tableX + tableWidth - 1

  pdf.setFont('helvetica', 'bold')
  pdf.setFillColor(245, 245, 245)
  pdf.setFontSize(7)
  pdf.rect(tableX, y, tableWidth, 6, 'F')
  pdf.text('Descripcion', colDesc, y + 4.2)
  pdf.text('Cant', colQtyRight, y + 4.2, { align: 'right' })
  pdf.text('P.Unit', colUnitRight, y + 4.2, { align: 'right' })
  pdf.text('Subt', colTotalRight, y + 4.2, { align: 'right' })

  y += 7.2
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(6.9)

  for (const item of compactRows) {
    const descText = item.description || 'Producto'
    const descriptionLines = pdf.splitTextToSize(descText, 37)
    const trimmedLines = descriptionLines.slice(0, maxDescriptionLines)
    const rowHeight = Math.max(6.1, trimmedLines.length * 3.4)

    pdf.text(trimmedLines, colDesc, y + 3)
    pdf.text(String(item.quantity), colQtyRight, y + 3, { align: 'right' })
    pdf.text(formatMoneyFromCents(item.unitPrice), colUnitRight, y + 3, { align: 'right' })
    pdf.text(formatMoneyFromCents(item.subtotal), colTotalRight, y + 3, { align: 'right' })

    y += rowHeight + 0.8
    pdf.setDrawColor(225, 225, 225)
    pdf.line(tableX, y, tableX + tableWidth, y)
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
}

export async function GET(
  request: Request,
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

    const searchParams = new URL(request.url).searchParams
    const layout = searchParams.get('layout')
    const channel = searchParams.get('channel')
    const useTicketLayout = layout === 'ticket' && channel === 'tpv'

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    if (useTicketLayout) {
      renderTicketInvoice(pdf, invoice, paidAt, customerAddress)
    } else {
      renderA4Invoice(pdf, invoice, paidAt, customerAddress)
    }

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
