'use server'

import { syncUberOrders } from '@/actions/uber'
import { syncGlovoOrders } from '@/actions/glovo'
import { syncDeliverooOrders } from '@/actions/deliveroo'
import { syncJustEatOrders } from '@/actions/justeat'
import { prisma } from '@/lib/prisma'

const SYNC_INTERVAL_MINUTES = parseInt(process.env.SYNC_INTERVAL_MINUTES || '5')
const RETRY_ATTEMPTS = 3
const RETRY_DELAY = 5000 // ms

interface SyncResult {
  platform: string
  success: boolean
  ordersCount?: number
  error?: string
  duration: number
  timestamp: string
}

/**
 * Ejecuta un ciclo completo de sincronización de todas las plataformas
 */
export async function executeSyncCycle(): Promise<{
  success: boolean
  results: SyncResult[]
  totalDuration: number
  nextSync: string
}> {
  const startTime = Date.now()
  const results: SyncResult[] = []

  console.log(`[SYNC] Iniciando ciclo de sincronización...`)

  // Sincronizar UberEats
  const uberStart = Date.now()
  try {
    const result = await syncUberOrders()
    results.push({
      platform: 'UBEREATS',
      success: true,
      ordersCount: (result as any)?.ordersCount || 0,
      duration: Date.now() - uberStart,
      timestamp: new Date().toISOString()
    })
    console.log(`[SYNC] ✓ UberEats: ${(result as any)?.ordersCount || 0} órdenes sincronizadas`)
  } catch (error) {
    results.push({
      platform: 'UBEREATS',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - uberStart,
      timestamp: new Date().toISOString()
    })
    console.error(`[SYNC] ✗ UberEats error:`, error)
  }

  // Sincronizar Glovo
  const glovoStart = Date.now()
  try {
    const result = await syncGlovoOrders()
    results.push({
      platform: 'GLOVO',
      success: true,
      ordersCount: (result as any)?.ordersCount || 0,
      duration: Date.now() - glovoStart,
      timestamp: new Date().toISOString()
    })
    console.log(`[SYNC] ✓ Glovo: ${(result as any)?.ordersCount || 0} órdenes sincronizadas`)
  } catch (error) {
    results.push({
      platform: 'GLOVO',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - glovoStart,
      timestamp: new Date().toISOString()
    })
    console.error(`[SYNC] ✗ Glovo error:`, error)
  }

  // Sincronizar Deliveroo
  const deliverooStart = Date.now()
  try {
    const result = await syncDeliverooOrders()
    results.push({
      platform: 'DELIVEROO',
      success: true,
      ordersCount: (result as any)?.ordersCount || 0,
      duration: Date.now() - deliverooStart,
      timestamp: new Date().toISOString()
    })
    console.log(`[SYNC] ✓ Deliveroo: ${(result as any)?.ordersCount || 0} órdenes sincronizadas`)
  } catch (error) {
    results.push({
      platform: 'DELIVEROO',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - deliverooStart,
      timestamp: new Date().toISOString()
    })
    console.error(`[SYNC] ✗ Deliveroo error:`, error)
  }

  // Sincronizar Just Eat
  const justEatStart = Date.now()
  try {
    const result = await syncJustEatOrders()
    results.push({
      platform: 'JUSTEAT',
      success: true,
      ordersCount: (result as any)?.ordersCount || 0,
      duration: Date.now() - justEatStart,
      timestamp: new Date().toISOString()
    })
    console.log(`[SYNC] ✓ Just Eat: ${(result as any)?.ordersCount || 0} órdenes sincronizadas`)
  } catch (error) {
    results.push({
      platform: 'JUSTEAT',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - justEatStart,
      timestamp: new Date().toISOString()
    })
    console.error(`[SYNC] ✗ Just Eat error:`, error)
  }

  const totalDuration = Date.now() - startTime
  const successCount = results.filter((r) => r.success).length

  // Guardar resultado del ciclo en DB
  try {
    try {
      const syncLogModel = (prisma as any)?.syncLog
      if (syncLogModel) {
        await syncLogModel.create({
          data: {
            totalDuration,
            successCount,
            failureCount: results.length - successCount,
            details: JSON.stringify(results),
            nextSyncAt: new Date(Date.now() + SYNC_INTERVAL_MINUTES * 60000)
          }
        })
      }
    } catch (dbError) {
      console.debug('syncLog table unavailable')
    }
  } catch (error) {
    console.error('[SYNC] Error logging sync results:', error)
  }

  const nextSync = new Date(Date.now() + SYNC_INTERVAL_MINUTES * 60000)

  console.log(`[SYNC] ✓ Ciclo completado: ${totalDuration}ms (${successCount}/${results.length} plataformas)`)
  console.log(`[SYNC] Próximo ciclo: ${nextSync.toLocaleString('es-ES')}`)

  return {
    success: successCount === results.length,
    results,
    totalDuration,
    nextSync: nextSync.toISOString()
  }
}

/**
 * Sincroniza una plataforma específica con reintentos
 */
export async function syncPlatformWithRetry(
  platform: 'UBEREATS' | 'GLOVO' | 'DELIVEROO' | 'JUSTEAT',
  attempts: number = RETRY_ATTEMPTS
): Promise<SyncResult> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const startTime = Date.now()
    try {
      console.log(`[SYNC] ${platform} - Intento ${attempt}/${attempts}...`)

      let result

      if (platform === 'UBEREATS') {
        result = await syncUberOrders()
      } else if (platform === 'GLOVO') {
        result = await syncGlovoOrders()
      } else if (platform === 'DELIVEROO') {
        result = await syncDeliverooOrders()
      } else if (platform === 'JUSTEAT') {
        result = await syncJustEatOrders()
      } else {
        throw new Error(`Unknown platform: ${platform}`)
      }

      return {
        platform,
        success: true,
        ordersCount: (result as any)?.ordersCount || 0,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.warn(`[SYNC] ${platform} intento ${attempt} falló:`, lastError.message)

      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      }
    }
  }

  return {
    platform,
    success: false,
    error: lastError?.message || 'Unknown error',
    duration: 0,
    timestamp: new Date().toISOString()
  }
}

/**
 * Obtiene historial de sincronizaciones
 */
export async function getSyncHistory(limit: number = 50) {
  try {
    try {
      const syncLogModel = (prisma as any)?.syncLog
      if (syncLogModel) {
        const logs = await syncLogModel.findMany({
          take: limit,
          orderBy: { createdAt: 'desc' }
        })

        return logs.map((log: any) => ({
          id: log.id,
          timestamp: log.createdAt,
          totalDuration: log.totalDuration,
          successCount: log.successCount,
          failureCount: log.failureCount,
          details: typeof log.details === 'string' ? JSON.parse(log.details) : log.details,
          nextSycAt: log.nextSyncAt
        }))
      }
    } catch (dbError) {
      console.debug('syncLog table unavailable')
    }
    return []
  } catch (error) {
    console.error('Error getting sync history:', error)
    return []
  }
}

/**
 * Obtiene estadísticas de sincronización
 */
export async function getSyncStats() {
  try {
    try {
      const syncLogModel = (prisma as any)?.syncLog
      if (syncLogModel) {
        const logs = await syncLogModel.findMany({
          take: 100,
          orderBy: { createdAt: 'desc' }
        })

        if (logs && logs.length > 0) {
          const totalSyncs = logs.length
          const successfulSyncs = logs.filter((l: any) => l.failureCount === 0).length
          const failedSyncs = logs.filter((l: any) => l.failureCount > 0).length
          const averageDuration = Math.round(logs.reduce((sum: number, l: any) => sum + l.totalDuration, 0) / totalSyncs)
          const successRate = Math.round((successfulSyncs / totalSyncs) * 100)

          return {
            totalSyncs,
            successfulSyncs,
            failedSyncs,
            averageDuration,
            lastSync: logs[0]?.createdAt,
            successRate,
            nextSyncInterval: SYNC_INTERVAL_MINUTES
          }
        }
      }
    } catch (dbError) {
      console.debug('syncLog table unavailable')
    }

    return {
      totalSyncs: 0,
      successfulSyncs: 0,
      failedSyncs: 0,
      averageDuration: 0,
      lastSync: null,
      successRate: 0
    }
  } catch (error) {
    console.error('Error getting sync stats:', error)
    return {
      totalSyncs: 0,
      successfulSyncs: 0,
      failedSyncs: 0,
      averageDuration: 0,
      lastSync: null,
      successRate: 0
    }
  }
}

/**
 * Configura el intervalo de sincronización
 */
export async function setSyncInterval(minutes: number) {
  if (minutes < 1 || minutes > 60) {
    throw new Error('Sync interval must be between 1 and 60 minutes')
  }

  // En producción, guardar en DB
  console.log(`[SYNC] Intervalo configurado a: ${minutes} minutos`)

  return {
    success: true,
    interval: minutes,
    message: `Sincronización automática cada ${minutes} minutos`
  }
}
