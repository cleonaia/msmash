'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface UberOrder {
  id: string
  eater_id?: string
  status: 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED'
  items: Array<{
    id: string
    title: string
    quantity: number
    price: number
  }>
  total_fees_money: {
    amount: number
    currency_code: string
  }
  subtotals_money: {
    amount: number
  }
  created_at: string
  pickup_location?: {
    address: string
  }
  delivery_location?: {
    address: string
  }
}

/**
 * Registra integración con UberEats
 * @param apiKey - API key de Uber
 * @param merchantId - Restaurant ID en Uber
 * @param webhookSecret - Secret para verificar webhooks
 * @returns Integración registrada
 */
export async function registerUberEatsIntegration(
  apiKey: string,
  merchantId: string,
  webhookSecret: string
) {
  try {
    // Verificar si ya existe integración Uber
    const existing = await prisma.deliveryIntegration.findFirst({
      where: { platform: 'UBEREATS' }
    })

    if (existing) {
      // Actualizar existente
      return await prisma.deliveryIntegration.update({
        where: { id: existing.id },
        data: {
          apiKey,
          merchantId,
          isEnabled: true,
          lastError: null
        }
      })
    }

    // Crear nueva
    const integration = await prisma.deliveryIntegration.create({
      data: {
        platform: 'UBEREATS',
        apiKey,
        merchantId,
        isEnabled: true
      }
    })

    revalidatePath('/admin/delivery')
    return integration
  } catch (error) {
    console.error('Error registering UberEats integration:', error)
    throw error
  }
}

/**
 * Sincroniza órdenes de UberEats
 * Nota: Implementar llamadas reales a Uber API
 */
export async function syncUberOrders() {
  try {
    const integration = await prisma.deliveryIntegration.findFirst({
      where: { platform: 'UBEREATS', isEnabled: true }
    })

    if (!integration) {
      throw new Error('UberEats integration not found')
    }

    const baseUrl = process.env.UBEREATS_API_BASE_URL || process.env.UBER_API_BASE_URL
    if (!baseUrl) {
      await prisma.deliveryIntegration.update({
        where: { id: integration.id },
        data: { syncedAt: new Date(), lastError: null }
      })

      revalidatePath('/admin/delivery')
      return {
        success: true,
        message: 'UberEats integration active (API base URL not configured yet)',
        ordersCount: 0
      }
    }

    const endpoint = `${baseUrl.replace(/\/$/, '')}/orders${integration.merchantId ? `?merchantId=${encodeURIComponent(integration.merchantId)}` : ''}`

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${integration.apiKey}`,
        'X-API-Key': integration.apiKey,
        ...(integration.merchantId ? { 'X-Merchant-Id': integration.merchantId } : {}),
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`UberEats API error (${response.status})`)
    }

    const payload = await response.json().catch(() => ({}))
    const uberOrders = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.orders)
        ? payload.orders
        : Array.isArray(payload?.data)
          ? payload.data
          : []

    let processed = 0
    for (const rawOrder of uberOrders) {
      const platformOrderId = String(rawOrder?.id ?? rawOrder?.order_id ?? '')
      if (!platformOrderId) continue

      const existing = await prisma.deliveryOrder.findUnique({
        where: { platformOrderId }
      })

      if (!existing) {
        await convertUberOrderToLocal(rawOrder as UberOrder, integration.id)
        processed += 1
      }
    }

    await prisma.deliveryIntegration.update({
      where: { id: integration.id },
      data: { syncedAt: new Date(), lastError: null }
    })

    revalidatePath('/admin/delivery')
    return { success: true, message: 'UberEats orders synced', ordersCount: processed }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    
    const integration = await prisma.deliveryIntegration.findFirst({
      where: { platform: 'UBEREATS' }
    })

    if (integration) {
      await prisma.deliveryIntegration.update({
        where: { id: integration.id },
        data: { lastError: message }
      })
    }

    console.error('Error syncing UberEats orders:', error)
    throw error
  }
}

/**
 * Convierte orden de Uber a orden local
 * @param uberOrder - Datos de Uber
 * @param integrationId - ID de integración
 * @returns Orden de delivery creada
 */
export async function convertUberOrderToLocal(
  uberOrder: UberOrder,
  integrationId: string
) {
  try {
    // Crear orden de delivery
    const deliveryOrder = await prisma.deliveryOrder.create({
      data: {
        platform: 'UBEREATS',
        platformOrderId: uberOrder.id,
        integrationId,
        customerName: `Uber Eater ${uberOrder.eater_id || 'Guest'}`,
        customerPhone: '', // Uber no proporciona número de cliente
        deliveryAddress: uberOrder.delivery_location?.address || 'Delivery',
        items: JSON.stringify(
          uberOrder.items.map((item) => ({
            name: item.title,
            quantity: item.quantity,
            price: item.price
          }))
        ),
        totalAmount: uberOrder.total_fees_money.amount,
        deliveryFee: uberOrder.subtotals_money.amount,
        status: 'received'
      }
    })

    // Mapear estado de Uber a estado local
    const statusMap: Record<string, string> = {
      'PENDING': 'received',
      'ACCEPTED': 'accepted',
      'PREPARING': 'prepared',
      'READY_FOR_PICKUP': 'collected',
      'COMPLETED': 'delivered',
      'CANCELLED': 'cancelled'
    }

    if (statusMap[uberOrder.status]) {
      await prisma.deliveryOrder.update({
        where: { id: deliveryOrder.id },
        data: { status: statusMap[uberOrder.status] }
      })
    }

    return deliveryOrder
  } catch (error) {
    console.error('Error converting Uber order:', error)
    throw error
  }
}

/**
 * Procesa webhook de Uber
 * @param event - Evento del webhook
 * @param signature - Firma para verificación
 * @returns Confirmación de procesamiento
 */
export async function processUberWebhook(
  event: {
    event_type: string
    data: any
  },
  signature: string
) {
  try {
    // TODO: Verificar firma del webhook con webhookSecret
    // if (!verifyUberWebhookSignature(JSON.stringify(event), signature, webhookSecret)) {
    //   throw new Error('Invalid webhook signature')
    // }

    const { event_type, data } = event

    switch (event_type) {
      case 'order.pending':
        await handleUberOrderPending(data)
        break
      case 'order.accepted':
        await handleUberOrderAccepted(data)
        break
      case 'order.status_changed':
        await handleUberOrderStatusChanged(data)
        break
      case 'order.ready_for_delivery':
        await handleUberOrderReadyForDelivery(data)
        break
      default:
        console.log(`Unknown Uber webhook event: ${event_type}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error processing Uber webhook:', error)
    throw error
  }
}

/**
 * Maneja evento: orden pendiente en Uber
 */
async function handleUberOrderPending(data: any) {
  try {
    const platformOrderId = data.order_id

    // Buscar o crear orden de delivery
    let deliveryOrder = await prisma.deliveryOrder.findUnique({
      where: { platformOrderId }
    })

    if (!deliveryOrder) {
      // Crear nueva
      const integration = await prisma.deliveryIntegration.findFirst({
        where: { platform: 'UBEREATS', isEnabled: true }
      })

      if (!integration) return

      await convertUberOrderToLocal(data, integration.id)
    }
  } catch (error) {
    console.error('Error handling Uber pending order:', error)
  }
}

/**
 * Maneja evento: orden aceptada en Uber
 */
async function handleUberOrderAccepted(data: any) {
  try {
    await prisma.deliveryOrder.updateMany({
      where: { platformOrderId: data.order_id },
      data: {
        status: 'accepted',
        acceptedAt: new Date()
      }
    })
  } catch (error) {
    console.error('Error handling Uber accepted order:', error)
  }
}

/**
 * Maneja evento: cambio de estado de orden
 */
async function handleUberOrderStatusChanged(data: any) {
  try {
    const statusMap: Record<string, string> = {
      'confirmed': 'accepted',
      'cooking': 'prepared',
      'ready_for_pickup': 'collected',
      'completed': 'delivered'
    }

    const newStatus = statusMap[data.status]
    if (!newStatus) return

    const updates: any = { status: newStatus }

    // Registrar timestamp según estado
    if (newStatus === 'accepted') updates.acceptedAt = new Date()
    if (newStatus === 'prepared') updates.preparedAt = new Date()
    if (newStatus === 'collected') updates.collectedAt = new Date()
    if (newStatus === 'delivered') updates.deliveredAt = new Date()

    await prisma.deliveryOrder.updateMany({
      where: { platformOrderId: data.order_id },
      data: updates
    })
  } catch (error) {
    console.error('Error handling Uber status change:', error)
  }
}

/**
 * Maneja evento: orden lista para entrega
 */
async function handleUberOrderReadyForDelivery(data: any) {
  try {
    await prisma.deliveryOrder.updateMany({
      where: { platformOrderId: data.order_id },
      data: {
        status: 'collected',
        collectedAt: new Date()
      }
    })
  } catch (error) {
    console.error('Error handling Uber ready for delivery:', error)
  }
}

/**
 * Obtiene estado de órdenes Uber pendientes
 */
export async function getUberPendingOrders() {
  try {
    const orders = await prisma.deliveryOrder.findMany({
      where: {
        platform: 'UBEREATS',
        status: { in: ['received', 'accepted', 'prepared'] }
      },
      include: { integration: true },
      orderBy: { createdAt: 'desc' }
    })

    return orders
  } catch (error) {
    console.error('Error fetching Uber pending orders:', error)
    throw error
  }
}

/**
 * Obtiene estadísticas de órdenes Uber
 */
export async function getUberStats() {
  try {
    const today = new Date(new Date().setHours(0, 0, 0, 0))
    const thisMonth = new Date(new Date().setDate(1))

    const [todayOrders, monthOrders, totalRevenue, avgTicket] = await Promise.all([
      prisma.deliveryOrder.count({
        where: {
          platform: 'UBEREATS',
          createdAt: { gte: today }
        }
      }),
      prisma.deliveryOrder.count({
        where: {
          platform: 'UBEREATS',
          createdAt: { gte: thisMonth }
        }
      }),
      prisma.deliveryOrder.aggregate({
        where: { platform: 'UBEREATS' },
        _sum: { totalAmount: true }
      }),
      prisma.deliveryOrder.aggregate({
        where: { platform: 'UBEREATS' },
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
    console.error('Error fetching Uber stats:', error)
    throw error
  }
}
