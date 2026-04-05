'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface JustEatOrder {
  id: string
  reference?: string
  customer?: {
    id?: string
    name?: string
    phone?: string
  }
  status:
    | 'PLACED'
    | 'ACCEPTED'
    | 'IN_KITCHEN'
    | 'READY_FOR_PICKUP'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED'
  items: Array<{
    id?: string
    name: string
    quantity: number
    unitPrice?: number
    price?: number
  }>
  totals?: {
    orderTotal?: number
    deliveryFee?: number
  }
  total?: number
  delivery?: {
    address?: string
  }
  createdAt?: string
  updatedAt?: string
}

function toMinorUnits(value: number) {
  if (!Number.isFinite(value)) return 0
  if (value >= 1000) return Math.round(value)
  return Math.round(value * 100)
}

function normalizeJustEatOrder(raw: any): JustEatOrder {
  return {
    id: String(raw?.id ?? raw?.orderId ?? raw?.order_id ?? raw?.reference ?? ''),
    reference: raw?.reference,
    customer: {
      id: raw?.customer?.id,
      name: raw?.customer?.name ?? raw?.consumer?.name,
      phone: raw?.customer?.phone ?? raw?.consumer?.phone
    },
    status: String(raw?.status ?? 'PLACED').toUpperCase() as JustEatOrder['status'],
    items: Array.isArray(raw?.items)
      ? raw.items.map((item: any) => ({
          id: item?.id,
          name: item?.name ?? item?.title ?? 'Producto',
          quantity: Number(item?.quantity ?? 1),
          unitPrice: item?.unitPrice,
          price: item?.price
        }))
      : [],
    totals: {
      orderTotal: raw?.totals?.orderTotal,
      deliveryFee: raw?.totals?.deliveryFee
    },
    total: raw?.total,
    delivery: {
      address: raw?.delivery?.address ?? raw?.deliveryAddress
    },
    createdAt: raw?.createdAt,
    updatedAt: raw?.updatedAt
  }
}

export async function registerJustEatIntegration(
  apiKey: string,
  restaurantId: string,
  webhookSecret: string
) {
  try {
    const existing = await prisma.deliveryIntegration.findFirst({
      where: { platform: 'JUSTEAT' }
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
        platform: 'JUSTEAT',
        apiKey,
        merchantId: restaurantId,
        isEnabled: true
      }
    })

    revalidatePath('/admin/delivery')
    return integration
  } catch (error) {
    console.error('Error registering Just Eat integration:', error)
    throw error
  }
}

export async function syncJustEatOrders() {
  try {
    const integration = await prisma.deliveryIntegration.findFirst({
      where: { platform: 'JUSTEAT', isEnabled: true }
    })

    if (!integration) {
      throw new Error('Just Eat integration not found')
    }

    const baseUrl = process.env.JUSTEAT_API_BASE_URL
    if (!baseUrl) {
      await prisma.deliveryIntegration.update({
        where: { id: integration.id },
        data: { syncedAt: new Date(), lastError: null }
      })
      return { success: true, message: 'Just Eat integration active (API base URL not configured yet)', ordersCount: 0 }
    }

    const endpoint = `${baseUrl.replace(/\/$/, '')}/orders?merchantId=${encodeURIComponent(integration.merchantId ?? '')}`
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${integration.apiKey}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Just Eat API error (${response.status})`)
    }

    const payload = await response.json().catch(() => ({}))
    const ordersRaw = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.orders)
        ? payload.orders
        : Array.isArray(payload?.data)
          ? payload.data
          : []

    let processed = 0

    for (const orderRaw of ordersRaw) {
      const order = normalizeJustEatOrder(orderRaw)
      if (!order.id) continue

      const existing = await prisma.deliveryOrder.findUnique({
        where: { platformOrderId: order.id }
      })

      if (!existing) {
        await convertJustEatOrderToLocal(order, integration.id)
        processed += 1
      }
    }

    await prisma.deliveryIntegration.update({
      where: { id: integration.id },
      data: { syncedAt: new Date(), lastError: null }
    })

    revalidatePath('/admin/delivery')
    return { success: true, message: 'Just Eat orders synced', ordersCount: processed }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    const integration = await prisma.deliveryIntegration.findFirst({
      where: { platform: 'JUSTEAT' }
    })

    if (integration) {
      await prisma.deliveryIntegration.update({
        where: { id: integration.id },
        data: { lastError: message }
      })
    }

    console.error('Error syncing Just Eat orders:', error)
    throw error
  }
}

export async function convertJustEatOrderToLocal(
  justEatOrder: JustEatOrder,
  integrationId: string
) {
  try {
    const totalAmount = toMinorUnits(
      Number(justEatOrder?.totals?.orderTotal ?? justEatOrder?.total ?? 0)
    )
    const deliveryFee = toMinorUnits(Number(justEatOrder?.totals?.deliveryFee ?? 0))

    const deliveryOrder = await prisma.deliveryOrder.create({
      data: {
        platform: 'JUSTEAT',
        platformOrderId: justEatOrder.id,
        integrationId,
        customerName: justEatOrder.customer?.name || 'Just Eat Customer',
        customerPhone: justEatOrder.customer?.phone || '',
        deliveryAddress: justEatOrder.delivery?.address || 'Delivery',
        items: JSON.stringify(
          justEatOrder.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: toMinorUnits(Number(item.unitPrice ?? item.price ?? 0))
          }))
        ),
        totalAmount,
        deliveryFee,
        status: 'received'
      }
    })

    const statusMap: Record<string, string> = {
      PLACED: 'received',
      ACCEPTED: 'accepted',
      IN_KITCHEN: 'prepared',
      READY_FOR_PICKUP: 'collected',
      OUT_FOR_DELIVERY: 'collected',
      DELIVERED: 'delivered',
      CANCELLED: 'cancelled'
    }

    const mappedStatus = statusMap[justEatOrder.status]
    if (mappedStatus) {
      await prisma.deliveryOrder.update({
        where: { id: deliveryOrder.id },
        data: { status: mappedStatus }
      })
    }

    return deliveryOrder
  } catch (error) {
    console.error('Error converting Just Eat order:', error)
    throw error
  }
}

export async function processJustEatWebhook(
  event: {
    event_type?: string
    type?: string
    data?: any
  },
  signature: string
) {
  try {
    const eventType = String(event.event_type ?? event.type ?? '').toLowerCase()
    const data = event.data ?? {}

    switch (eventType) {
      case 'order.created':
      case 'order.placed':
        await handleJustEatOrderCreated(data)
        break
      case 'order.accepted':
        await updateJustEatOrderStatus(data, 'accepted', { acceptedAt: new Date() })
        break
      case 'order.preparing':
      case 'order.in_kitchen':
        await updateJustEatOrderStatus(data, 'prepared', { preparedAt: new Date() })
        break
      case 'order.ready':
      case 'order.ready_for_pickup':
      case 'order.out_for_delivery':
        await updateJustEatOrderStatus(data, 'collected', { collectedAt: new Date() })
        break
      case 'order.delivered':
        await updateJustEatOrderStatus(data, 'delivered', { deliveredAt: new Date() })
        break
      case 'order.cancelled':
      case 'order.canceled':
        await updateJustEatOrderStatus(data, 'cancelled')
        break
      default:
        console.log(`Unknown Just Eat webhook event: ${eventType}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error processing Just Eat webhook:', error)
    throw error
  }
}

async function handleJustEatOrderCreated(data: any) {
  try {
    const normalizedOrder = normalizeJustEatOrder(data)
    const platformOrderId = normalizedOrder.id
    if (!platformOrderId) return

    const existing = await prisma.deliveryOrder.findUnique({
      where: { platformOrderId }
    })

    if (!existing) {
      const integration = await prisma.deliveryIntegration.findFirst({
        where: { platform: 'JUSTEAT', isEnabled: true }
      })
      if (!integration) return
      await convertJustEatOrderToLocal(normalizedOrder, integration.id)
    }
  } catch (error) {
    console.error('Error handling Just Eat order created:', error)
  }
}

async function updateJustEatOrderStatus(
  data: any,
  status: string,
  extraData: Record<string, any> = {}
) {
  try {
    const platformOrderId = String(data?.order_id ?? data?.id ?? data?.orderId ?? '')
    if (!platformOrderId) return

    await prisma.deliveryOrder.updateMany({
      where: { platformOrderId },
      data: {
        status,
        ...extraData
      }
    })
  } catch (error) {
    console.error('Error updating Just Eat order status:', error)
  }
}

export async function getJustEatPendingOrders() {
  try {
    return await prisma.deliveryOrder.findMany({
      where: {
        platform: 'JUSTEAT',
        status: { in: ['received', 'accepted', 'prepared'] }
      },
      include: { integration: true },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching Just Eat pending orders:', error)
    throw error
  }
}

export async function getJustEatStats() {
  try {
    const today = new Date(new Date().setHours(0, 0, 0, 0))
    const thisMonth = new Date(new Date().setDate(1))

    const [todayOrders, monthOrders, totalRevenue, avgTicket] = await Promise.all([
      prisma.deliveryOrder.count({
        where: {
          platform: 'JUSTEAT',
          createdAt: { gte: today }
        }
      }),
      prisma.deliveryOrder.count({
        where: {
          platform: 'JUSTEAT',
          createdAt: { gte: thisMonth }
        }
      }),
      prisma.deliveryOrder.aggregate({
        where: { platform: 'JUSTEAT' },
        _sum: { totalAmount: true }
      }),
      prisma.deliveryOrder.aggregate({
        where: { platform: 'JUSTEAT' },
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
    console.error('Error fetching Just Eat stats:', error)
    throw error
  }
}