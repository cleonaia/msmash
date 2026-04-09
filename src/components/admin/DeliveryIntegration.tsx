'use client'

import { useState, useEffect } from 'react'
import {
  registerUberEatsIntegration,
  getUberStats,
  syncUberOrders
} from '@/actions/uber'
import {
  registerGlovoIntegration,
  getGlovoStats,
  syncGlovoOrders
} from '@/actions/glovo'
import {
  registerDeliverooIntegration,
  getDeliverooStats,
  syncDeliverooOrders
} from '@/actions/deliveroo'
import {
  registerJustEatIntegration,
  getJustEatStats,
  syncJustEatOrders
} from '@/actions/justeat'
import { getDeliveryIntegrations } from '@/actions/delivery'

interface Integration {
  id: string
  platform: string
  merchantId?: string | null
  isEnabled: boolean
  syncedAt?: Date | null
  lastError?: string | null
  createdAt: Date
  updatedAt: Date
}

interface PlatformStats {
  todayOrders: number
  monthOrders: number
  totalRevenue: number
  avgTicket: number
  currency: string
}

type PlatformType = 'UBEREATS' | 'GLOVO' | 'DELIVEROO' | 'JUSTEAT'

const PLATFORMS: Array<{ id: PlatformType; name: string; color: string; bgColor: string }> = [
  { id: 'UBEREATS', name: 'UberEats', color: 'black', bgColor: 'bg-black' },
  { id: 'GLOVO', name: 'Glovo', color: '#FFD000', bgColor: 'bg-yellow-400' },
  { id: 'DELIVEROO', name: 'Deliveroo', color: '#00C8DE', bgColor: 'bg-cyan-400' },
  { id: 'JUSTEAT', name: 'Just Eat', color: '#ff6d00', bgColor: 'bg-orange-500' }
]

const PLATFORM_LABELS = {
  UBEREATS: 'UberEats',
  GLOVO: 'Glovo',
  DELIVEROO: 'Deliveroo',
  JUSTEAT: 'Just Eat'
}

export function DeliveryIntegration() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [stats, setStats] = useState<Record<PlatformType, PlatformStats | null>>({
    UBEREATS: null,
    GLOVO: null,
    DELIVEROO: null,
    JUSTEAT: null
  })
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<PlatformType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state for each platform
  const [formState, setFormState] = useState<Record<PlatformType, { apiKey: string; merchantId: string }>>({
    UBEREATS: { apiKey: '', merchantId: '' },
    GLOVO: { apiKey: '', merchantId: '' },
    DELIVEROO: { apiKey: '', merchantId: '' },
    JUSTEAT: { apiKey: '', merchantId: '' }
  })

  const [showForm, setShowForm] = useState<PlatformType | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadIntegrations()
  }, [])

  const loadIntegrations = async () => {
    try {
      setLoading(true)
      const data = await getDeliveryIntegrations()
      setIntegrations(data)

      // Cargar stats para cada plataforma activa
      await Promise.all([
        data.some((i: any) => i.platform === 'UBEREATS' && i.isEnabled)
          ? getUberStats()
              .then((s) => setStats((prev) => ({ ...prev, UBEREATS: s })))
              .catch(() => {})
          : Promise.resolve(),
        data.some((i: any) => i.platform === 'GLOVO' && i.isEnabled)
          ? getGlovoStats()
              .then((s) => setStats((prev) => ({ ...prev, GLOVO: s })))
              .catch(() => {})
          : Promise.resolve(),
        data.some((i: any) => i.platform === 'DELIVEROO' && i.isEnabled)
          ? getDeliverooStats()
              .then((s) => setStats((prev) => ({ ...prev, DELIVEROO: s })))
              .catch(() => {})
          : Promise.resolve(),
        data.some((i: any) => i.platform === 'JUSTEAT' && i.isEnabled)
          ? getJustEatStats()
              .then((s) => setStats((prev) => ({ ...prev, JUSTEAT: s })))
              .catch(() => {})
          : Promise.resolve()
      ])

      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load integrations')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (platform: PlatformType, e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      setError(null)

      const { apiKey, merchantId } = formState[platform]

      if (!apiKey.trim() || !merchantId.trim()) {
        setError('API Key and Merchant ID are required')
        return
      }

      const webhookSecret = 'webhook-secret'

      if (platform === 'UBEREATS') {
        await registerUberEatsIntegration(apiKey, merchantId, webhookSecret)
      } else if (platform === 'GLOVO') {
        await registerGlovoIntegration(apiKey, merchantId, webhookSecret)
      } else if (platform === 'DELIVEROO') {
        await registerDeliverooIntegration(apiKey, merchantId, webhookSecret)
      } else if (platform === 'JUSTEAT') {
        await registerJustEatIntegration(apiKey, merchantId, webhookSecret)
      }

      setSuccess(`${platform} integration registered successfully!`)
      setFormState((prev) => ({ ...prev, [platform]: { apiKey: '', merchantId: '' } }))
      setShowForm(null)

      await loadIntegrations()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to register ${platform}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSync = async (platform: PlatformType) => {
    try {
      setSyncing(platform)
      setError(null)

      if (platform === 'UBEREATS') {
        await syncUberOrders()
      } else if (platform === 'GLOVO') {
        await syncGlovoOrders()
      } else if (platform === 'DELIVEROO') {
        await syncDeliverooOrders()
      } else if (platform === 'JUSTEAT') {
        await syncJustEatOrders()
      }

      setSuccess(`${platform} orders synced successfully!`)
      await loadIntegrations()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to sync ${platform} orders`)
    } finally {
      setSyncing(null)
    }
  }

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
  }

  return (
    <div className="space-y-6">
      {/* Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          ✓ {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          ✗ {error}
        </div>
      )}

      {/* Platform Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {PLATFORMS.map((platform) => {
          const integration = integrations.find((i) => i.platform === platform.id)
          const platformStats = stats[platform.id]
          const isActive = integration?.isEnabled
          const webhookUrl = `https://yourdomain.com/api/webhooks/${platform.id.toLowerCase()}`

          return (
            <div key={platform.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className={`${platform.bgColor} text-white p-4 flex items-center justify-between`}>
                <div>
                  <h3 className="font-bold">{platform.name}</h3>
                  <p className="text-xs opacity-75 mt-1">Delivery Partner</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-300' : 'bg-gray-300'}`} />
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Stats */}
                {isActive && platformStats && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-gray-50 rounded text-center">
                      <p className="text-xs text-gray-600">Hoy</p>
                      <p className="text-lg font-bold">{platformStats.todayOrders}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded text-center">
                      <p className="text-xs text-gray-600">Mes</p>
                      <p className="text-lg font-bold">{platformStats.monthOrders}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded text-center">
                      <p className="text-xs text-gray-600">Ingresos</p>
                      <p className="text-sm font-bold">€{platformStats.totalRevenue.toFixed(0)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded text-center">
                      <p className="text-xs text-gray-600">Ticket</p>
                      <p className="text-sm font-bold">€{platformStats.avgTicket}</p>
                    </div>
                  </div>
                )}

                {/* Info */}
                {integration && (
                  <div className="text-xs space-y-1 pb-2 border-b">
                    <p>
                      <span className="text-gray-600">Merchant:</span>{' '}
                      <span className="font-mono">{integration.merchantId || '-'}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Sync:</span>{' '}
                      <span>
                        {integration.syncedAt
                          ? new Date(integration.syncedAt).toLocaleString('es-ES')
                          : 'Nunca'}
                      </span>
                    </p>
                    {integration.lastError && (
                      <p className="text-red-600">
                        <span>Error:</span> {integration.lastError.substring(0, 40)}...
                      </p>
                    )}
                  </div>
                )}

                {/* Form */}
                {showForm === platform.id && (
                  <form onSubmit={(e) => handleRegister(platform.id, e)} className="space-y-2 bg-gray-50 p-3 rounded">
                    <input
                      type="password"
                      placeholder="API Key"
                      value={formState[platform.id].apiKey}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          [platform.id]: { ...prev[platform.id], apiKey: e.target.value }
                        }))
                      }
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Merchant ID"
                      value={formState[platform.id].merchantId}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          [platform.id]: { ...prev[platform.id], merchantId: e.target.value }
                        }))
                      }
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-black text-white text-xs py-1 rounded font-medium hover:bg-gray-800 disabled:opacity-50"
                      >
                        {submitting ? 'Registrando...' : 'Registrar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(null)}
                        className="flex-1 border border-gray-300 text-xs py-1 rounded hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}

                {/* Buttons */}
                <div className="space-y-2 pt-2">
                  {isActive ? (
                    <>
                      <button
                        onClick={() => handleSync(platform.id)}
                        disabled={syncing === platform.id}
                        className="w-full bg-black text-white text-sm py-2 rounded font-medium hover:bg-gray-800 disabled:opacity-50"
                      >
                        {syncing === platform.id ? 'Sincronizando...' : 'Sincronizar'}
                      </button>
                      <button
                        onClick={() => setShowForm(platform.id)}
                        className="w-full border border-gray-300 text-sm py-2 rounded hover:bg-gray-50"
                      >
                        Actualizar Keys
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowForm(platform.id)}
                      className="w-full bg-black text-white text-sm py-2 rounded font-medium hover:bg-gray-800"
                    >
                      Conectar
                    </button>
                  )}
                </div>

                {/* Webhook URL */}
                {isActive && (
                  <div className="mt-4 pt-4 border-t text-xs bg-blue-50 p-2 rounded">
                    <p className="font-medium text-blue-900 mb-1">Webhook URL:</p>
                    <code className="block break-all bg-white p-1 rounded border border-blue-200 text-blue-900 font-mono text-xs">
                      {webhookUrl}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">📊 Resumen de Integraciones</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {PLATFORMS.map((platform) => {
            const integration = integrations.find((i) => i.platform === platform.id)
            return (
              <div key={platform.id}>
                <span className="text-gray-600">{platform.name}:</span>{' '}
                <span className="font-semibold">{integration?.isEnabled ? '✓ Activo' : '○ Inactivo'}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
