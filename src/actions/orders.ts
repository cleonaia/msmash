'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export interface CreateOrderData {
  customerName: string
 customerEmail?: string
  customerPhone: string
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
  }>
  totalAmount: number
  notes?: string
  deliveryMethod?: string
  paymentMethod?: 'STRIPE' | 'LOCAL'
}

export type CreateOrderResult =
  | {
      success: true
      order: {
        id: string
      }
    }
  | {
      success: false
      error: string
    }

/**
 * Crea una nueva orden en la base de datos
 */
export async function createOrder(data: CreateOrderData): Promise<CreateOrderResult> {
  try {
    if (!data.customerName || !data.customerPhone) {
      return {
        success: false,
        error: 'Faltan datos del cliente'
      }
    }

    if (data.paymentMethod && !['STRIPE', 'LOCAL'].includes(data.paymentMethod)) {
      return {
        success: false,
        error: 'Metodo de pago no valido'
      }
    }

    if (!data.items || data.items.length === 0) {
      return {
        success: false,
        error: 'El pedido no tiene productos'
      }
    }

    // Validar que los productos existan (id o slug) para soportar seeds antiguos
    const requestedProductIds = Array.from(new Set(data.items.map((item) => item.productId)))
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { id: { in: requestedProductIds } },
          { slug: { in: requestedProductIds } },
        ],
      },
    })

    const productLookup = new Map<string, (typeof products)[number]>()
    for (const product of products) {
      productLookup.set(product.id, product)
      productLookup.set(product.slug, product)
    }

    const missingProducts = requestedProductIds.filter((id) => !productLookup.has(id))
    if (missingProducts.length > 0) {
      return {
        success: false,
        error: 'Uno o mas productos no estan disponibles ahora'
      }
    }

    const toMinorUnits = (value: number) => Math.round(value * 100)

    // Crear la orden
    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
         customerEmail: data.customerEmail || '',
        customerPhone: data.customerPhone,
        totalAmount: toMinorUnits(data.totalAmount),
        deliveryMethod: data.deliveryMethod || 'Retiro en local',
        notes: data.notes,
        status: 'PENDING',
        paymentStatus: 'PENDING', // Pendiente de pago
        paymentMethod: data.paymentMethod || 'STRIPE',
        items: {
          create: data.items.map((item) => {
            const product = productLookup.get(item.productId)
            if (!product) {
              throw new Error('One or more products not found')
            }

            const unitPrice = product.price
            return {
              productId: product.id,
              quantity: item.quantity,
              unitPrice,
              subtotal: unitPrice * item.quantity,
            }
          }),
        }
      },
      include: { items: true }
    })

    revalidatePath('/pedidos')
    return {
      success: true,
      order: {
        id: order.id
      }
    }
  } catch (error) {
    console.error('Error creating order:', error)
    return {
      success: false,
      error: 'No se pudo crear el pedido. Intentalo de nuevo en unos segundos.'
    }
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
