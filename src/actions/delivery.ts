'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

/**
 * Registra una integración de plataforma de delivery
 * @param platform - Plataforma (GLOVO, DELIVEROO, UBEREATS)
 * @param apiKey - API key de la plataforma
 * @param merchantId - ID del comercio en la plataforma
 * @returns Integración creada
 */
export async function createDeliveryIntegration(
  platform: 'DELIVEROO' | 'UBEREATS' | 'GLOVO' | 'JUSTEAT',
  apiKey: string,
  merchantId?: string
) {
  try {
    // Verificar si la integración ya existe
    const existing = await prisma.deliveryIntegration.findFirst({
      where: { platform }
    })

    if (existing) {
      // Actualizar si existe
      return await prisma.deliveryIntegration.update({
        where: { id: existing.id },
        data: { apiKey, merchantId, isEnabled: true }
      })
    }

    // Crear nueva integración
    const integration = await prisma.deliveryIntegration.create({
      data: {
        platform,
        apiKey,
        merchantId,
        isEnabled: true
      }
    })

    revalidatePath('/admin/delivery')
    return integration
  } catch (error) {
    console.error('Error creating delivery integration:', error)
    throw error
  }
}

/**
 * Obtiene todas las integraciones de delivery activas
 * @returns Lista de integraciones
 */
export async function getDeliveryIntegrations() {
  try {
    const integrations = await prisma.deliveryIntegration.findMany({
      where: { isEnabled: true },
      orderBy: { createdAt: 'desc' }
    })

    return integrations
  } catch (error) {
    console.error('Error fetching delivery integrations:', error)
    throw error
  }
}

/**
 * Obtiene órdenes de delivery recientes para el panel admin
 * @param days - Ventana en días (por defecto 30)
 */
export async function getDeliveryOrders(days = 30) {
  try {
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - days)

    const orders = await prisma.deliveryOrder.findMany({
      where: { createdAt: { gte: fromDate } },
      include: { integration: true },
      orderBy: { createdAt: 'desc' }
    })

    return orders.map((order) => {
      let parsedItems: Array<{ name: string; quantity: number; price: number }> = []

      try {
        const rawItems = JSON.parse(order.items || '[]')
        if (Array.isArray(rawItems)) {
          parsedItems = rawItems.map((item: any) => ({
            name: String(item?.name || item?.title || 'Producto'),
            quantity: Number(item?.quantity || 1),
            price: Number(item?.price || item?.unitPrice || 0)
          }))
        }
      } catch {
        parsedItems = []
      }

      return {
        id: order.id,
        platform: order.platform,
        externalOrderId: order.platformOrderId,
        merchantId: order.integration?.merchantId || '',
        status: order.status,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        deliveryAddress: order.deliveryAddress,
        items: parsedItems,
        totalPrice: order.totalAmount / 100,
        currency: 'EUR',
        receivedAt: order.createdAt,
        acceptedAt: order.acceptedAt,
        preparedAt: order.preparedAt,
        collectedAt: order.collectedAt,
        deliveredAt: order.deliveredAt,
        cancelledAt: null
      }
    })
  } catch (error) {
    console.error('Error fetching delivery orders:', error)
    return []
  }
}

/**
 * Sincroniza órdenes desde una plataforma de delivery
 * Nota: La implementación específica depende de cada API
 * @param platform - Plataforma a sincronizar
 * @returns Órdenes sincronizadas
 */
export async function syncDeliveryOrders(platform: 'DELIVEROO' | 'UBEREATS' | 'GLOVO' | 'JUSTEAT') {
  try {
    const integration = await prisma.deliveryIntegration.findFirst({
      where: { platform, isEnabled: true }
    })

    if (!integration) {
      throw new Error(`No integration found for ${platform}`)
    }

    // TODO: Implementar llamadas a APIs específicas
    // Ejemplo para GLOVO:
    // const glovoOrders = await glovoAPI.getOrders(integration.merchantId)
    // 
    // Mapear y crear órdenes locales:
    // for (const glovoOrder of glovoOrders) {
    //   const existingOrder = await prisma.deliveryOrder.findUnique({
    //     where: { platformOrderId: glovoOrder.id }
    //   })
    //   
    //   if (!existingOrder) {
    //     await convertDeliveryOrderToLocalOrder(glovoOrder, platform, integration.id)
    //   }
    // }

    // Actualizar sincronización timestamp
    await prisma.deliveryIntegration.update({
      where: { id: integration.id },
      data: { syncedAt: new Date(), lastError: null }
    })

    revalidatePath('/admin/delivery')
    return { success: true, platform, message: 'Orders synced successfully' }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    
    // Registrar error en integración
    const integration = await prisma.deliveryIntegration.findFirst({
      where: { platform, isEnabled: true }
    })

    if (integration) {
      await prisma.deliveryIntegration.update({
        where: { id: integration.id },
        data: { lastError: message }
      })
    }

    console.error(`Error syncing ${platform} orders:`, error)
    throw error
  }
}

/**
 * Convierte una orden de delivery en una orden local
 * @param deliveryOrderData - Datos de la orden del delivery
 * @param platform - Plataforma de origen
 * @param integrationId - ID de la integración
 * @returns Orden local creada
 */
export async function convertDeliveryOrderToLocalOrder(
  deliveryOrderData: any,
  platform: 'DELIVEROO' | 'UBEREATS' | 'GLOVO' | 'JUSTEAT',
  integrationId: string
) {
  try {
    // Crear la orden de delivery
    const deliveryOrder = await prisma.deliveryOrder.create({
      data: {
        platform,
        platformOrderId: deliveryOrderData.id,
        integrationId,
        customerName: deliveryOrderData.customer?.name || 'Delivery Customer',
        customerPhone: deliveryOrderData.customer?.phone || '',
        deliveryAddress: deliveryOrderData.delivery?.address || '',
        items: JSON.stringify(deliveryOrderData.items || []),
        totalAmount: deliveryOrderData.total || 0,
        deliveryFee: deliveryOrderData.deliveryFee || 0,
        notes: deliveryOrderData.notes,
        status: 'received'
      }
    })

    // TODO: Crear órdenes locales relacionadas si es necesario
    // const localOrder = await prisma.order.create({
    //   data: {
    //     customerName: deliveryOrder.customerName,
    //     customerEmail: 'delivery-' + deliveryOrderData.id + '@delivery.local',
    //     customerPhone: deliveryOrder.customerPhone,
    //     totalAmount: deliveryOrder.totalAmount,
    //     status: 'PENDING',
    //     paymentStatus: 'PENDING',
    //     paymentMethod: 'LOCAL',
    //     deliveryMethod: 'Delivery',
    //     items: {
    //       create: deliveryOrderData.items.map((item: any) => ({
    //         productId: item.productId,
    //         quantity: item.quantity,
    //         unitPrice: item.price,
    //         subtotal: item.price * item.quantity
    //       }))
    //     }
    //   }
    // })

    revalidatePath('/admin/delivery')
    return deliveryOrder
  } catch (error) {
    console.error('Error converting delivery order:', error)
    throw error
  }
}

/**
 * Obtiene órdenes de delivery pendientes
 * @param platform - Filtrar por plataforma (opcional)
 * @returns Lista de órdenes pendientes
 */
export async function getPendingDeliveryOrders(
  platform?: 'DELIVEROO' | 'UBEREATS' | 'GLOVO' | 'JUSTEAT'
) {
  try {
    const query = platform ? { status: 'received', platform } : { status: 'received' }

    const orders = await prisma.deliveryOrder.findMany({
      where: query,
      include: { integration: true },
      orderBy: { createdAt: 'desc' }
    })

    return orders
  } catch (error) {
    console.error('Error fetching pending delivery orders:', error)
    throw error
  }
}

/**
 * Actualiza el estado de una orden de delivery
 * @param deliveryOrderId - ID de la orden de delivery
 * @param status - Nuevo estado
 * @returns Orden actualizada
 */
export async function updateDeliveryOrderStatus(
  deliveryOrderId: string,
  status: string
) {
  try {
    const deliveryOrder = await prisma.deliveryOrder.update({
      where: { id: deliveryOrderId },
      data: {
        status,
        ...(status === 'accepted' && { acceptedAt: new Date() }),
        ...(status === 'prepared' && { preparedAt: new Date() }),
        ...(status === 'collected' && { collectedAt: new Date() }),
        ...(status === 'delivered' && { deliveredAt: new Date() })
      }
    })

    revalidatePath('/admin/delivery')
    return deliveryOrder
  } catch (error) {
    console.error('Error updating delivery order status:', error)
    throw error
  }
}

/**
 * Desabilita una integración de delivery
 * @param integrationId - ID de la integración
 * @returns Integración deshabilitada
 */
export async function disableDeliveryIntegration(integrationId: string) {
  try {
    const integration = await prisma.deliveryIntegration.update({
      where: { id: integrationId },
      data: { isEnabled: false }
    })

    revalidatePath('/admin/delivery')
    return integration
  } catch (error) {
    console.error('Error disabling delivery integration:', error)
    throw error
  }
}
