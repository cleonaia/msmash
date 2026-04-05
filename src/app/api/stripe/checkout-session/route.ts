'use server'

import { stripe, STRIPE_PUBLIC_KEY } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Crea una sesión de Stripe Checkout para una orden
 */
export async function POST(request: NextRequest) {
  try {
    if (!stripe || !STRIPE_PUBLIC_KEY) {
      return NextResponse.json(
        { error: 'Online payments are not configured' },
        { status: 503 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Obtener la orden de la base de datos
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Verificar que la orden no haya sido pagada ya
    if (order.paymentStatus === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Order already paid' },
        { status: 400 }
      )
    }

    // Crear lineas de items para Stripe
    const lineItems = order.items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.product.name,
          description: `Cantidad: ${item.quantity}`,
          metadata: {
            productId: item.product.id
          }
        },
        unit_amount: item.unitPrice
      },
      quantity: item.quantity
    }))

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      ui_mode: 'embedded',
      return_url: `${appUrl}/pedidos?success=true&orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      customer_email: order.customerEmail,
      metadata: {
        orderId: order.id,
        customerName: order.customerName,
        customerPhone: order.customerPhone
      },
      billing_address_collection: 'auto'
    })

    // Guardar el stripeSessionId en la orden
    await prisma.order.update({
      where: { id: orderId },
      data: {
        stripePaymentId: session.id
      }
    })

    return NextResponse.json({
      sessionId: session.id,
      clientSecret: session.client_secret,
      publishableKey: STRIPE_PUBLIC_KEY
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
