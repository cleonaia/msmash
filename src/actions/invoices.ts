'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

/**
 * Crea una factura desde una orden existente
 * @param orderId - ID de la orden
 * @param customerTaxId - ID fiscal del cliente (RUC, DNI, etc)
 * @returns Factura creada
 */
export async function createInvoiceFromOrder(
  orderId: string,
  customerTaxId?: string
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true }
        }
      }
    })

    if (!order) {
      throw new Error(`Orden ${orderId} no encontrada`)
    }

    // Calcular impuestos (IVA 21% - ajustar según país)
    const ivaTax = Math.round(order.totalAmount * 0.21)
    const subtotal = order.totalAmount - ivaTax

    // Generar número de factura único
    const invoiceCount = await prisma.invoice.count()
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(5, '0')}`

    // Crear factura
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerTaxId,
        subtotal,
        taxAmount: ivaTax,
        totalAmount: order.totalAmount,
        status: 'DRAFT',
        items: {
          create: order.items.map((item: any) => ({
            description: item.product.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
            productId: item.productId
          }))
        }
      },
      include: { items: true }
    })

    // Actualizar la orden con referencia a factura
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' }
    })

    revalidatePath('/admin')
    return invoice
  } catch (error) {
    console.error('Error creating invoice:', error)
    throw error
  }
}

/**
 * Envía una factura por email
 * @param invoiceId - ID de la factura
 * @param pdfUrl - URL del PDF generado (opcional)
 * @returns Estado de envío
 */
export async function sendInvoiceEmail(
  invoiceId: string,
  pdfUrl?: string
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    })

    if (!invoice) {
      throw new Error(`Factura ${invoiceId} no encontrada`)
    }

    // TODO: Integrar con servicio de email (SendGrid, Resend, etc)
    // const response = await emailService.send({
    //   to: invoice.customerEmail,
    //   subject: `Factura ${invoice.invoiceNumber}`,
    //   template: 'invoice',
    //   data: invoice,
    //   attachments: [{ url: pdfUrl }]
    // })

    // Actualizar factura con timestamp de envío
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        pdfUrl: pdfUrl || invoice.pdfUrl
      }
    })

    revalidatePath('/admin')
    return { success: true, invoice: updatedInvoice }
  } catch (error) {
    console.error('Error sending invoice:', error)
    throw error
  }
}

/**
 * Marca una factura como pagada
 * @param invoiceId - ID de la factura
 * @returns Factura actualizada
 */
export async function markInvoiceAsPaid(invoiceId: string) {
  try {
    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin')
    return invoice
  } catch (error) {
    console.error('Error marking invoice as paid:', error)
    throw error
  }
}

/**
 * Obtiene todas las facturas de un cliente
 * @param customerEmail - Email del cliente
 * @returns Lista de facturas
 */
export async function getCustomerInvoices(customerEmail: string) {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { customerEmail },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    })

    return invoices
  } catch (error) {
    console.error('Error fetching customer invoices:', error)
    throw error
  }
}

/**
 * Obtiene el estado de facturación de una orden
 * @param orderId - ID de la orden
 * @returns Información de factura o null
 */
export async function getOrderInvoiceStatus(orderId: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { orderId },
      include: { items: true }
    })

    return invoice
  } catch (error) {
    console.error('Error fetching invoice status:', error)
    throw error
  }
}

/**
 * Obtiene todas las facturas para el panel admin
 */
export async function getAllInvoices() {
  try {
    return await prisma.invoice.findMany({
      include: {
        items: true,
        order: true
      },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching all invoices:', error)
    throw error
  }
}

/**
 * Obtiene órdenes pagadas que aún no tienen factura
 */
export async function getPaidOrdersWithoutInvoice() {
  try {
    return await prisma.order.findMany({
      where: {
        paymentStatus: 'COMPLETED',
        invoice: null
      },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching paid orders without invoice:', error)
    throw error
  }
}
