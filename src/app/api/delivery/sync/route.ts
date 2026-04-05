import { NextRequest, NextResponse } from 'next/server'
import { syncUberOrders } from '@/actions/uber'
import { syncGlovoOrders } from '@/actions/glovo'
import { syncDeliverooOrders } from '@/actions/deliveroo'
import { syncJustEatOrders } from '@/actions/justeat'
import { getPendingDeliveryOrders, updateDeliveryOrderStatus } from '@/actions/delivery'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * GET /api/delivery/sync
 * Obtiene estado de todas las integraciones y órdenes
 */
export async function GET(request: NextRequest) {
  try {
    // Importar Prisma dinámicamente dentro de la función
    const { prisma } = await import('@/lib/prisma')
    
    const searchParams = request.nextUrl.searchParams
    const platform = searchParams.get('platform') // Filter by platform (GLOVO, UBEREATS, DELIVEROO, JUSTEAT)

    // Obtener integraciones
    let integrations = await prisma.deliveryIntegration.findMany({
      orderBy: { createdAt: 'desc' }
    })

    if (platform) {
      integrations = integrations.filter((i: any) => i.platform === platform)
    }

    // Obtener órdenes pendientes
    const pendingOrders = await getPendingDeliveryOrders()

    // Estadísticas por platform
    const stats = await Promise.all(
      ['GLOVO', 'DELIVEROO', 'UBEREATS', 'JUSTEAT'].map(async (p) => {
        const pending = await prisma.deliveryOrder.count({
          where: {
            platform: p,
            status: { in: ['received', 'accepted', 'prepared'] }
          }
        })

        const completed = await prisma.deliveryOrder.count({
          where: {
            platform: p,
            status: 'delivered'
          }
        })

        return {
          platform: p,
          pending,
          completed
        }
      })
    )

    return NextResponse.json(
      {
        integrations,
        pendingOrders,
        stats,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching delivery sync status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch delivery sync status' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/delivery/sync
 * Ejecuta sincronización manual de órdenes desde todas las plataformas
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const platform = searchParams.get('platform') // Sync specific platform

    const results: any = {}

    // Sincronizar Uber
    if (!platform || platform === 'UBEREATS') {
      try {
        const uberResult = await syncUberOrders()
        results.ubereats = { success: true, message: uberResult.message }
      } catch (error) {
        results.ubereats = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    if (!platform || platform === 'GLOVO') {
      try {
        const glovoResult = await syncGlovoOrders()
        results.glovo = { success: true, message: glovoResult.message }
      } catch (error) {
        results.glovo = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    if (!platform || platform === 'DELIVEROO') {
      try {
        const deliverooResult = await syncDeliverooOrders()
        results.deliveroo = { success: true, message: deliverooResult.message }
      } catch (error) {
        results.deliveroo = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    // Sincronizar Just Eat
    if (!platform || platform === 'JUSTEAT') {
      try {
        const justEatResult = await syncJustEatOrders()
        results.justeat = { success: true, message: justEatResult.message }
      } catch (error) {
        results.justeat = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        results,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error syncing deliveries:', error)
    return NextResponse.json(
      { error: 'Failed to sync deliveries' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/delivery/sync
 * Actualiza estado de orden de delivery
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status, trackedAt } = body

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Missing orderId or status' },
        { status: 400 }
      )
    }

    const updated = await updateDeliveryOrderStatus(orderId, status)

    return NextResponse.json(
      {
        success: true,
        order: updated,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating delivery order:', error)
    return NextResponse.json(
      { error: 'Failed to update delivery order' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/delivery/sync
 * Desactiva una integración de delivery
 */
export async function DELETE(request: NextRequest) {
  try {
    // Importar Prisma dinámicamente
    const { prisma } = await import('@/lib/prisma')
    
    const searchParams = request.nextUrl.searchParams
    const integrationId = searchParams.get('id')

    if (!integrationId) {
      return NextResponse.json(
        { error: 'Missing integration id' },
        { status: 400 }
      )
    }

    await prisma.deliveryIntegration.update({
      where: { id: integrationId },
      data: { isEnabled: false }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Integration disabled',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error disabling integration:', error)
    return NextResponse.json(
      { error: 'Failed to disable integration' },
      { status: 500 }
    )
  }
}
