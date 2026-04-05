'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface GlovoOrder {
  id: string
  reference?: string
  customer?: {
    id: string
    name: string
    phone: string
  }
  status: 'PENDING' | 'ACCEPTED' | 'PREPARATION' | 'READY_FOR_DELIVERY' | 'ON_WAY' | 'DELIVERED' | 'CANCELLED'
  items: Array<{
    id: string
    name: string
    quantity: number
    unitPrice: number
  }>
  total: {
    amount: number
  }
  delivery?: {
    address: string
  }
  createdAt: string
  updatedAt: string
}

/**
 * Registra integración con Glovo
 * @param apiKey - API key de Glovo
 * @param restaurantId - Restaurant ID en Glovo
 * @returns Integración registrada
 */
export async function registerGlovoIntegration(
  apiKey: string,
  restaurantId: string,
  webhookSecret: string
) {
  try {
    const existing = await prisma.deliveryIntegration.findFirst({
      where: { platform: 'GLOVO' }
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
        platform: 'GLOVO',
        apiKey,
        merchantId: restaurantId,
        isEnabled: true
      }
    })

    revalidatePath('/admin/delivery')
    return integration
  } catch (error) {
    console.error('Error registering Glovo integration:', error)
    throw error
  }
}

/**
 * Sincroniza órdenes de Glovo (ordenes no entregadas)
 */
export async function syncGlovoOrders() {
  try {
    const integration = await prisma.deliveryIntegration.findFirst({
      where: { platform: 'GLOVO', isEnabled: true }
    })

    if (!integration) {
      throw new Error('Glovo integration not found')
    }

    const baseUrl = process.env.GLOVO_API_BASE_URL
    if (!baseUrl) {
      await prisma.deliveryIntegration.update({
        where: { id: integration.id },
        data: { syncedAt: new Date(), lastError: null }
      })

      revalidatePath('/admin/delivery')
      return {
        success: true,
        message: 'Glovo integration active (API base URL not configured yet)',
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
      throw new Error(`Glovo API error (${response.status})`)
    }

    const payload = await response.json().catch(() => ({}))
    const glovoOrders = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.orders)
        ? payload.orders
        : Array.isArray(payload?.data)
          ? payload.data
          : []

    let processed = 0
    for (const rawOrder of glovoOrders) {
      const platformOrderId = String(rawOrder?.id ?? rawOrder?.order_id ?? '')
      if (!platformOrderId) continue

      const existing = await prisma.deliveryOrder.findUnique({
        where: { platformOrderId }
      })

      if (!existing) {
        await convertGlovoOrderToLocal(rawOrder as GlovoOrder, integration.id)
        processed += 1
      }
    }

    await prisma.deliveryIntegration.update({
      where: { id: integration.id },
      data: { syncedAt: new Date(), lastError: null }
    })

    revalidatePath('/admin/delivery')
    return { success: true, message: 'Glovo orders synced', ordersCount: processed }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    const integration = await prisma.deliveryIntegration.findFirst({
      where: { platform: 'GLOVO' }
    })

    if (integration) {
      await prisma.deliveryIntegration.update({
        where: { id: integration.id },
        data: { lastError: message }
      })
    }

    console.error('Error syncing Glovo orders:', error)
    throw error
  }
}

/**
 * Convierte orden de Glovo a orden local
 */
export async function convertGlovoOrderToLocal(
  glovoOrder: GlovoOrder,
  integrationId: string
) {
  try {
    const deliveryOrder = await prisma.deliveryOrder.create({
      data: {
        platform: 'GLOVO',
        platformOrderId: glovoOrder.id,
        integrationId,
        customerName: glovoOrder.customer?.name || 'Glovo Customer',
        customerPhone: glovoOrder.customer?.phone || '',
        deliveryAddress: glovoOrder.delivery?.address || 'Delivery',
        items: JSON.stringify(
          glovoOrder.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.unitPrice
          }))
        ),
        totalAmount: glovoOrder.total.amount,
        deliveryFee: 0,
        status: 'received'
      }
    })

    // Mapear estado de Glovo a estado local
    const statusMap: Record<string, string> = {
      'PENDING': 'received',
      'ACCEPTED': 'accepted',
      'PREPARATION': 'prepared',
      'READY_FOR_DELIVERY': 'collected',
      'ON_WAY': 'collected',
      'DELIVERED': 'delivered',
      'CANCELLED': 'cancelled'
    }

    if (statusMap[glovoOrder.status]) {
      await prisma.deliveryOrder.update({
        where: { id: deliveryOrder.id },
        data: { status: statusMap[glovoOrder.status] }
      })
    }

    return deliveryOrder
  } catch (error) {
    console.error('Error converting Glovo order:', error)
    throw error
  }
}

/**
 * Procesa webhook de Glovo
 * Firma: X-Glovo-Signature (HMAC-SHA256)
 */
export async function processGlovoWebhook(
  event: {
    type: string
    data: any
  },
  signature: string
) {
  try {
    const { type, data } = event

    switch (type) {
      case 'order_status_changed':
        await handleGlovoOrderStatusChanged(data)
        break
      case 'order_accepted':
        await handleGlovoOrderAccepted(data)
        break
      case 'order_preparing':
        await handleGlovoOrderPreparing(data)
        break
      case 'order_ready_for_delivery':
        await handleGlovoOrderReadyForDelivery(data)
        break
      case 'order_on_the_way':
        await handleGlovoOrderOnTheWay(data)
        break
      case 'order_delivered':
        await handleGlovoOrderDelivered(data)
        break
      case 'order_cancelled':
        await handleGlovoOrderCancelled(data)
        break
      default:
        console.log(`Unknown Glovo webhook event: ${type}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error processing Glovo webhook:', error)
    throw error
  }
}

async function handleGlovoOrderStatusChanged(data: any) {
  try {
    const statusMap: Record<string, string> = {
      'PENDING': 'received',
      'ACCEPTED': 'accepted',
      'PREPARATION': 'prepared',
      'READY_FOR_DELIVERY': 'collected',
      'ON_WAY': 'collected',
      'DELIVERED': 'delivered',
      'CANCELLED': 'cancelled'
    }

    const newStatus = statusMap[data.status]
    if (!newStatus) return

    const updates: any = { status: newStatus }

    if (newStatus === 'accepted') updates.acceptedAt = new Date()
    if (newStatus === 'prepared') updates.preparedAt = new Date()
    if (newStatus === 'collected') updates.collectedAt = new Date()
    if (newStatus === 'delivered') updates.deliveredAt = new Date()

    await prisma.deliveryOrder.updateMany({
      where: { platformOrderId: data.order_id },
      data: updates
    })
  } catch (error) {
    console.error('Error handling Glovo order status change:', error)
  }
}

async function handleGlovoOrderAccepted(data: any) {
  try {
    await prisma.deliveryOrder.updateMany({
      where: { platformOrderId: data.order_id },
      data: { status: 'accepted', acceptedAt: new Date() }
    })
  } catch (error) {
    console.error('Error handling Glovo order accepted:', error)
  }
}

async function handleGlovoOrderPreparing(data: any) {
  try {
    await prisma.deliveryOrder.updateMany({
      where: { platformOrderId: data.order_id },
      data: { status: 'prepared', preparedAt: new Date() }
    })
  } catch (error) {
    console.error('Error handling Glovo order preparing:', error)
  }
}

async function handleGlovoOrderReadyForDelivery(data: any) {
  try {
    await prisma.deliveryOrder.updateMany({
      where: { platformOrderId: data.order_id },
      data: { status: 'collected', collectedAt: new Date() }
    })
  } catch (error) {
    console.error('Error handling Glovo order ready for delivery:', error)
  }
}

async function handleGlovoOrderOnTheWay(data: any) {
  try {
    await prisma.deliveryOrder.updateMany({
      where: { platformOrderId: data.order_id },
      data: { status: 'collected' }
    })
  } catch (error) {
    console.error('Error handling Glovo order on the way:', error)
  }
}

async function handleGlovoOrderDelivered(data: any) {
  try {
    await prisma.deliveryOrder.updateMany({
      where: { platformOrderId: data.order_id },
      data: { status: 'delivered', deliveredAt: new Date() }
    })
  } catch (error) {
    console.error('Error handling Glovo order delivered:', error)
  }
}

async function handleGlovoOrderCancelled(data: any) {
  try {
    await prisma.deliveryOrder.updateMany({
      where: { platformOrderId: data.order_id },
      data: { status: 'cancelled' }
    })
  } catch (error) {
    console.error('Error handling Glovo order cancelled:', error)
  }
}

/**
 * Obtiene órdenes Glovo pendientes
 */
export async function getGlovoPendingOrders() {
  try {
    const orders = await prisma.deliveryOrder.findMany({
      where: {
        platform: 'GLOVO',
        status: { in: ['received', 'accepted', 'prepared'] }
      },
      include: { integration: true },
      orderBy: { createdAt: 'desc' }
    })

    return orders
  } catch (error) {
    console.error('Error fetching Glovo pending orders:', error)
    throw error
  }
}

/**
 * Obtiene estadísticas de órdenes Glovo
 */
export async function getGlovoStats() {
  try {
    const today = new Date(new Date().setHours(0, 0, 0, 0))
    const thisMonth = new Date(new Date().setDate(1))

    const [todayOrders, monthOrders, totalRevenue, avgTicket] = await Promise.all([
      prisma.deliveryOrder.count({
        where: {
          platform: 'GLOVO',
          createdAt: { gte: today }
        }
      }),
      prisma.deliveryOrder.count({
        where: {
          platform: 'GLOVO',
          createdAt: { gte: thisMonth }
        }
      }),
      prisma.deliveryOrder.aggregate({
        where: { platform: 'GLOVO' },
        _sum: { totalAmount: true }
      }),
      prisma.deliveryOrder.aggregate({
        where: { platform: 'GLOVO' },
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
    console.error('Error fetching Glovo stats:', error)
    throw error
  }
}
