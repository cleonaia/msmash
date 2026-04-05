'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface CreateOrderData {
  customerName: string
  customerEmail: string
  customerPhone: string
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
  }>
  totalAmount: number
  notes?: string
  deliveryMethod?: string
}

/**
 * Crea una nueva orden en la base de datos
 */
export async function createOrder(data: CreateOrderData) {
  try {
    if (!data.customerName || !data.customerEmail || !data.customerPhone) {
      throw new Error('Customer information is required')
    }

    if (!data.items || data.items.length === 0) {
      throw new Error('Order must have at least one item')
    }

    // Validar que los productos existan
    const productIds = data.items.map(item => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    })

    if (products.length !== productIds.length) {
      throw new Error('One or more products not found')
    }

    const toMinorUnits = (value: number) => Math.round(value * 100)

    // Crear la orden
    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        totalAmount: toMinorUnits(data.totalAmount),
        deliveryMethod: data.deliveryMethod || 'Retiro en local',
        notes: data.notes,
        status: 'PENDING',
        paymentStatus: 'PENDING', // Pendiente de pago
        paymentMethod: 'STRIPE', // Será pagado por Stripe
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: toMinorUnits(item.unitPrice),
            subtotal: toMinorUnits(item.unitPrice * item.quantity)
          }))
        }
      },
      include: { items: true }
    })

    revalidatePath('/pedidos')
    return order
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

/**
 * Obtiene una orden por ID
 */
export async function getOrder(orderId: string) {
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
      throw new Error('Order not found')
    }

    return order
  } catch (error) {
    console.error('Error fetching order:', error)
    throw error
  }
}

/**
 * Obtiene todas las órdenes (para admin)
 */
export async function getAllOrders(filter?: {
  status?: string
  paymentStatus?: string
}) {
  try {
    const where: any = {}
    if (filter?.status) where.status = filter.status
    if (filter?.paymentStatus) where.paymentStatus = filter.paymentStatus

    const orders = await prisma.order.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    })

    return orders
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

/**
 * Actualiza el estado de una orden
 */
export async function updateOrderStatus(
  orderId: string,
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELED'
) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })

    revalidatePath('/pedidos')
    return order
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}
