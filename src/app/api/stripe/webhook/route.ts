import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendWhatsAppOrderConfirmation, sendWhatsAppPaymentFailed, sendWhatsAppRestaurantOrderAlert } from '@/lib/whatsapp'
import { sendOrderConfirmationEmail, sendPaymentFailedEmail } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

/**
 * Webhook para eventos de Stripe
 * Confirma pagos y actualiza estado de órdenes
 */
export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 503 }
    )
  }

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
            include: {
              items: {
                include: {
                  product: {
                    include: { category: true }
                  }
                }
              }
            }
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

            // Crear factura automática si aún no existe
            const existingInvoice = await prisma.invoice.findUnique({
              where: { orderId: order.id }
            })

            if (!existingInvoice) {
              const taxBreakdown = order.items.reduce(
                (acc, item) => {
                  const categorySlug = item.product.category?.slug?.toLowerCase() || ''
                  const categoryName = item.product.category?.name?.toLowerCase() || ''
                  const isDrink = categorySlug === 'bebidas' || categoryName.includes('bebida')
                  const vatRate = isDrink ? 0.21 : 0.1

                  const lineSubtotal = Math.round(item.subtotal / (1 + vatRate))
                  const lineTax = item.subtotal - lineSubtotal

                  acc.subtotal += lineSubtotal
                  acc.tax += lineTax
                  return acc
                },
                { subtotal: 0, tax: 0 }
              )

              const roundingDiff = order.totalAmount - (taxBreakdown.subtotal + taxBreakdown.tax)
              const subtotal = taxBreakdown.subtotal
              const taxAmount = taxBreakdown.tax + roundingDiff

              const invoiceCount = await prisma.invoice.count()
              const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(5, '0')}`

              await prisma.invoice.create({
                data: {
                  invoiceNumber,
                  orderId: order.id,
                  customerName: order.customerName,
                  customerEmail: order.customerEmail,
                  customerPhone: order.customerPhone,
                  subtotal,
                  taxAmount,
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
                }
              })
            }

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

            // 📱 Aviso interno al restaurante
            await sendWhatsAppRestaurantOrderAlert({
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
