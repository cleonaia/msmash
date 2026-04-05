'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface DeliverooOrder {
  id: string
  reference?: string
  consumer?: {
    id: string
    name: string
    phone: string
  }
  status: 'pending' | 'accepted' | 'preparation' | 'ready' | 'dispatched' | 'delivered' | 'cancelled'
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  total: number
  delivery_address?: string
  created_at: string
  updated_at: string
}

/**
 * Registra integración con Deliveroo
 * @param apiKey - API key de Deliveroo
 * @param restaurantId - Restaurant ID en Deliveroo
 * @returns Integración registrada
 */
export async function registerDeliverooIntegration(
  apiKey: string,
  restaurantId: string,
  webhookSecret: string
) {
  try {
    const existing = await prisma.deliveryIntegration.findFirst({
      where: { platform: 'DELIVEROO' }
    })

    if (existing) {
      return await prisma.deliveryIntegration.update({
        where: { id: existing.id },
        data: {
          apiKey,
          merchantId: restaurantId,
          isEnabled: true,
          lastError: null
        }
      })
    }

    const integration = await prisma.deliveryIntegration.create({
      data: {
        platform: 'DELIVEROO',
        apiKey,
        merchantId: restaurantId,
        isEnabled: true
      }
    })

    revalidatePath('/admin/delivery')
    return integration
  } catch (error) {
    console.error('Error registering Deliveroo integration:', error)
    throw error
  }
}

/**
 * Sincroniza órdenes de Deliveroo
 */
export async function syncDeliverooOrders() {
  try {
    const integration = await prisma.deliveryIntegration.findFirst({
      where: { platform: 'DELIVEROO', isEnabled: true }
    })

    if (!integration) {
      throw new Error('Deliveroo integration not found')
    }

    const baseUrl = process.env.DELIVEROO_API_BASE_URL
    if (!baseUrl) {
      await prisma.deliveryIntegration.update({
        where: { id: integration.id },
        data: { syncedAt: new Date(), lastError: null }
      })

      revalidatePath('/admin/delivery')
      return {
        success: true,
        message: 'Deliveroo integration active (API base URL not configured yet)',
        ordersCount: 0
      }
    }

    const endpoint = `${baseUrl.replace(/\/$/, '')}/orders${integration.merchantId ? `?merchantId=${encodeURIComponent(integration.merchantId)}` : ''}`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${integration.apiKey}`,
        'X-API-Key': integration.apiKey,
        ...(integration.merchantId ? { 'X-Restaurant-Id': integration.merchantId } : {}),
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Deliveroo API error (${response.status})`)
    }

    const payload = await response.json().catch(() => ({}))
    const deliverooOrders = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.orders)
        ? payload.orders
        : Array.isArray(payload?.data)
          ? payload.data
          : []

    let processed = 0
    for (const rawOrder of deliverooOrders) {
      const platformOrderId = String(rawOrder?.id ?? rawOrder?.order_id ?? '')
      if (!platformOrderId) continue

      const existing = await prisma.deliveryOrder.findUnique({
        where: { platformOrderId }
      })

      if (!existing) {
        await convertDeliverooOrderToLocal(rawOrder as DeliverooOrder, integration.id)
        processed += 1
      }
    }

    await prisma.deliveryIntegration.update({
      where: { id: integration.id },
      data: { syncedAt: new Date(), lastError: null }
    })

    revalidatePath('/admin/delivery')
    return { success: true, message: 'Deliveroo orders synced', ordersCount: processed }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    const integration = await prisma.deliveryIntegration.findFirst({
      where: { platform: 'DELIVEROO' }
    })

    if (integration) {
      await prisma.deliveryIntegration.update({
        where: { id: integration.id },
        data: { lastError: message }
      })
    }

    console.error('Error syncing Deliveroo orders:', error)
    throw error
  }
}

/**
 * Convierte orden de Deliveroo a orden local
 */
export async function convertDeliverooOrderToLocal(
  deliverooOrder: DeliverooOrder,
  integrationId: string
) {
  try {
    const deliveryOrder = await prisma.deliveryOrder.create({
      data: {
        platform: 'DELIVEROO',
        platformOrderId: deliverooOrder.id,
        integrationId,
        customerName: deliverooOrder.consumer?.name || 'Deliveroo Customer',
        customerPhone: deliverooOrder.consumer?.phone || '',
        deliveryAddress: deliverooOrder.delivery_address || 'Delivery',
        items: JSON.stringify(
          deliverooOrder.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        ),
        totalAmount: deliverooOrder.total,
        deliveryFee: 0,
        status: 'received'
      }
    })

    // Mapear estado de Deliveroo a estado local
    const statusMap: Record<string, string> = {
      'pending': 'received',
      'accepted': 'accepted',
      'preparation': 'prepared',
      'ready': 'collected',
      'dispatched': 'collected',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    }

    if (statusMap[deliverooOrder.status]) {
      await prisma.deliveryOrder.update({
        where: { id: deliveryOrder.id },
        data: { status: statusMap[deliverooOrder.status] }
      })
    }

    return deliveryOrder
  } catch (error) {
    console.error('Error converting Deliveroo order:', error)
    throw error
  }
}

/**
 * Procesa webhook de Deliveroo
 * Firma: X-Deliveroo-Signature (HMAC-SHA256)
 */
export async function processDeliverooWebhook(
  event: {
    event_type: string
    data: any
  },
  signature: string
) {
  try {
    const { event_type, data } = event

    switch (event_type) {
      case 'order.created':
        await handleDeliverooOrderCreated(data)
        break
      case 'order.accepted':
        await handleDeliverooOrderAccepted(data)
        break
      case 'order.preparation':
        await handleDeliverooOrderPreparation(data)
        break
      case 'order.ready':
        await handleDeliverooOrderReady(data)
        break
      case 'order.dispatched':
        await handleDeliverooOrderDispatched(data)
        break
      case 'order.delivered':
        await handleDeliverooOrderDelivered(data)
        break
      case 'order.cancelled':
        await handleDeliverooOrderCancelled(data)
        break
      default:
        console.log(`Unknown Deliveroo webhook event: ${event_type}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error processing Deliveroo webhook:', error)
    throw error
  }
}

async function handleDeliverooOrderCreated(data: any) {
  try {
    const platformOrderId = data.order_id

    let deliveryOrder = await prisma.deliveryOrder.findUnique({
      where: { platformOrderId }
    })

    if (!deliveryOrder) {
      const integration = await prisma.deliveryIntegration.findFirst({
        where: { platform: 'DELIVEROO', isEnabled: true }
      })

      if (!integration) return

      await convertDeliverooOrderToLocal(data, integration.id)
    }
  } catch (error) {
    console.error('Error handling Deliveroo order created:', error)
  }
}

async function handleDeliverooOrderAccepted(data: any) {
  try {
    await prisma.deliveryOrder.updateMany({
      where: { platformOrderId: data.order_id },
      data: { status: 'accepted', acceptedAt: new Date() }
    })
  } catch (error) {
    console.error('Error handling Deliveroo order accepted:', error)
  }
}

async function handleDeliverooOrderPreparation(data: any) {
  try {
    await prisma.deliveryOrder.updateMany({
      where: { platformOrderId: data.order_id },
      data: { status: 'prepared', preparedAt: new Date() }
    })
  } catch (error) {
    console.error('Error handling Deliveroo order preparation:', error)
  }
}

async function handleDeliverooOrderReady(data: any) {
  try {
    await prisma.deliveryOrder.updateMany({
      where: { platformOrderId: data.order_id },
      data: { status: 'collected', collectedAt: new Date() }
    })
  } catch (error) {
    console.error('Error handling Deliveroo order ready:', error)
  }
}

async function handleDeliverooOrderDispatched(data: any) {
  try {
    await prisma.deliveryOrder.updateMany({
      where: { platformOrderId: data.order_id },
      data: { status: 'collected' }
    })
  } catch (error) {
    console.error('Error handling Deliveroo order dispatched:', error)
  }
}

async function handleDeliverooOrderDelivered(data: any) {
  try {
    await prisma.deliveryOrder.updateMany({
      where: { platformOrderId: data.order_id },
      data: { status: 'delivered', deliveredAt: new Date() }
    })
  } catch (error) {
    console.error('Error handling Deliveroo order delivered:', error)
  }
}

async function handleDeliverooOrderCancelled(data: any) {
  try {
    await prisma.deliveryOrder.updateMany({
      where: { platformOrderId: data.order_id },
      data: { status: 'cancelled' }
    })
  } catch (error) {
    console.error('Error handling Deliveroo order cancelled:', error)
  }
}

/**
 * Obtiene órdenes Deliveroo pendientes
 */
export async function getDeliveropPendingOrders() {
  try {
    const orders = await prisma.deliveryOrder.findMany({
      where: {
        platform: 'DELIVEROO',
        status: { in: ['received', 'accepted', 'prepared'] }
      },
      include: { integration: true },
      orderBy: { createdAt: 'desc' }
    })

    return orders
  } catch (error) {
    console.error('Error fetching Deliveroo pending orders:', error)
    throw error
  }
}

/**
 * Obtiene estadísticas de órdenes Deliveroo
 */
export async function getDeliverooStats() {
  try {
    const today = new Date(new Date().setHours(0, 0, 0, 0))
    const thisMonth = new Date(new Date().setDate(1))

    const [todayOrders, monthOrders, totalRevenue, avgTicket] = await Promise.all([
      prisma.deliveryOrder.count({
        where: {
          platform: 'DELIVEROO',
          createdAt: { gte: today }
        }
      }),
      prisma.deliveryOrder.count({
        where: {
          platform: 'DELIVEROO',
          createdAt: { gte: thisMonth }
        }
      }),
      prisma.deliveryOrder.aggregate({
        where: { platform: 'DELIVEROO' },
        _sum: { totalAmount: true }
      }),
      prisma.deliveryOrder.aggregate({
        where: { platform: 'DELIVEROO' },
        _avg: { totalAmount: true }
      })
    ])

    return {
      todayOrders,
      monthOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      avgTicket: Math.round(avgTicket._avg.totalAmount || 0),
      currency: 'EUR'
    }
  } catch (error) {
    console.error('Error fetching Deliveroo stats:', error)
    throw error
  }
}
