import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendWhatsAppOrderConfirmation, sendWhatsAppPaymentFailed } from '@/lib/whatsapp'
import { sendOrderConfirmationEmail, sendPaymentFailedEmail } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

/**
 * Webhook para eventos de Stripe
 * Confirma pagos y actualiza estado de órdenes
 */
export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature')
  const body = await request.text()

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    )
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const orderId = session.metadata?.orderId

        if (orderId) {
          // Obtener orden con items
          const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } } }
          })

          if (order) {
            // Actualizar estado de la orden
            await prisma.order.update({
              where: { id: orderId },
              data: {
                paymentStatus: 'COMPLETED',
                paymentMethod: 'STRIPE',
                status: 'CONFIRMED',
                stripePaymentId: session.payment_intent
              }
            })

            // 📧 Enviar email de confirmación
            await sendOrderConfirmationEmail({
              orderId: order.id,
              customerName: order.customerName,
              customerEmail: order.customerEmail,
              totalAmount: order.totalAmount,
              items: order.items.map((item: any) => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.unitPrice
              })),
              deliveryMethod: order.deliveryMethod,
              notes: order.notes || ''
            })

            // 📱 Enviar confirmación por WhatsApp
            await sendWhatsAppOrderConfirmation(order.customerPhone, {
              orderId: order.id,
              customerName: order.customerName,
              totalAmount: order.totalAmount,
              items: order.items.map((item: any) => ({
                name: item.product.name,
                quantity: item.quantity
              })),
              deliveryMethod: order.deliveryMethod
            })

            console.log(`✅ Pago confirmado para orden: ${orderId}`)
          }
        }
        break
      }

      case 'charge.failed': {
        const charge = event.data.object as any
        const metadata = charge.metadata
        const orderId = metadata?.orderId

        if (orderId) {
          const order = await prisma.order.findUnique({
            where: { id: orderId }
          })

          if (order) {
            await prisma.order.update({
              where: { id: orderId },
              data: {
                paymentStatus: 'FAILED',
                status: 'PAYMENT_FAILED'
              }
            })

            // 📧 Enviar email de error
            await sendPaymentFailedEmail(order.customerEmail, order.customerName, orderId)

            // 📱 Enviar WhatsApp de error
            await sendWhatsAppPaymentFailed(order.customerPhone, {
              orderId: order.id,
              customerName: order.customerName
            })

            console.log(`❌ Pago fallido para orden: ${orderId}`)
          }
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as any
        const metadata = charge.metadata
        const orderId = metadata?.orderId

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: 'REFUNDED',
              status: 'REFUNDED'
            }
          })

          console.log(`🔄 Reembolso procesado para orden: ${orderId}`)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
