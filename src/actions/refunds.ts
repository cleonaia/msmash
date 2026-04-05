'use server'

import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendRefundEmail } from '@/lib/email'
import { revalidatePath } from 'next/cache'

interface RefundRequest {
  orderId: string
  reason?: string
  amount?: number // en centavos, si no se proporciona se reembolsa todo
}

/**
 * Procesa un reembolso de un pedido pagado con Stripe
 */
export async function processRefund({ orderId, reason, amount }: RefundRequest) {
  try {
    // Obtener la orden
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      throw new Error('Orden no encontrada')
    }

    // Verificar que fue pagada con Stripe
    if (order.paymentMethod !== 'STRIPE' || !order.stripePaymentId) {
      throw new Error('Esta orden no fue pagada con Stripe')
    }

    // Verificar que está completada o en preparación
    if (!['CONFIRMED', 'PREPARING', 'READY'].includes(order.status)) {
      throw new Error(`No se puede reembolsar una orden en estado: ${order.status}`)
    }

    const refundAmount = amount || order.totalAmount

    // Procesar reembolso en Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.stripePaymentId,
      amount: refundAmount,
      metadata: {
        orderId: order.id,
        reason: reason || 'Cliente solicitó reembolso'
      }
    })

    // Actualizar orden en BD
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'REFUNDED',
        paymentStatus: 'REFUNDED',
        notes: (order.notes ? order.notes + '\n' : '') + `[REEMBOLSO] ${reason || 'Solicitado por cliente - ' + new Date().toLocaleDateString('es-ES')}`
      }
    })

    // Enviar email de confirmación de reembolso
    await sendRefundEmail(order.customerEmail, order.customerName, orderId, refundAmount)

    console.log(`✅ Reembolso procesado - Orden: ${orderId}, Cantidad: €${(refundAmount / 100).toFixed(2)}`)

    revalidatePath('/admin/orders')
    return {
      success: true,
      refundId: refund.id,
      amount: refund.amount,
      status: refund.status
    }
  } catch (error) {
    console.error('❌ Error procesando reembolso:', error)
    throw error
  }
}

/**
 * Obtiene los reembolsos de una orden
 */
export async function getOrderRefunds(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order || !order.stripePaymentId) {
      throw new Error('Orden no encontrada o sin payment ID')
    }

    // Obtener reembolsos de Stripe
    const refunds = await stripe.refunds.list({
      payment_intent: order.stripePaymentId
    })

    return refunds.data.map(refund => ({
      id: refund.id,
      amount: refund.amount,
      currency: refund.currency,
      status: refund.status,
      created: new Date(refund.created * 1000),
      reason: refund.reason,
      metadata: refund.metadata
    }))
  } catch (error) {
    console.error('❌ Error obteniendo reembolsos:', error)
    throw error
  }
}

/**
 * Obtiene el estado total de reembolsos de una orden
 */
export async function getRefundStatus(orderId: string) {
  try {
    const refunds = await getOrderRefunds(orderId)
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      throw new Error('Orden no encontrada')
    }

    const totalRefunded = refunds
      .filter(r => r.status === 'succeeded')
      .reduce((sum, r) => sum + r.amount, 0)

    return {
      orderTotal: order.totalAmount,
      totalRefunded,
      pendingRefund: order.totalAmount - totalRefunded,
      refunds,
      canRefund: order.status !== 'COMPLETED' && order.paymentStatus === 'COMPLETED'
    }
  } catch (error) {
    console.error('❌ Error obteniendo estado de reembolso:', error)
    throw error
  }
}
