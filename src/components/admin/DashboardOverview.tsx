'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnalyticsDashboard } from './AnalyticsDashboard'
import { EmployeeManager } from './EmployeeManager'
import { DeliveryIntegration } from './DeliveryIntegration'
import { OrderManagement } from './OrderManagement'
import { AdvancedAnalyticsDashboard } from './AdvancedAnalytics'
import { InvoiceManager } from './InvoiceManager'
import { QRManager } from './QRManager'
import { AdminComandero } from './AdminComandero'
import { executeSyncCycle, getSyncHistory, getSyncStats, setSyncInterval } from '@/actions/scheduler'
import { getDeliveryIntegrations } from '@/actions/delivery'

type TabType = 'dashboard' | 'orders' | 'comandero' | 'advanced-analytics' | 'delivery' | 'invoices' | 'employees' | 'scheduler' | 'qr'

export function DashboardOverview() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')

  const tabs: Array<{ id: TabType; label: string; icon: string; badge?: string }> = [
    { id: 'dashboard', label: 'Panel Principal', icon: '📊' },
    { id: 'orders', label: 'Órdenes', icon: '📦' },
    { id: 'comandero', label: 'Comandero', icon: '🧑‍🍳' },
    { id: 'invoices', label: 'Facturas', icon: '🧾' },
    { id: 'advanced-analytics', label: 'Análitica', icon: '📈', badge: 'PRO' },
    { id: 'delivery', label: 'Integraciones', icon: '🚗' },
    { id: 'employees', label: 'Empleados', icon: '👥' },
    { id: 'scheduler', label: 'Sincronización', icon: '⏰', badge: 'AUTO' },
    { id: 'qr', label: 'Códigos QR', icon: '📱' }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">🍔 Panel de Control M SMASH</h1>
              <p className="text-gray-300 mt-2 text-sm sm:text-base leading-relaxed">
                Centro de operaciones integral para tu smash burger y gestión de pedidos.
              </p>
            </div>
            <div className="text-4xl sm:text-5xl shrink-0">⚙️</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow mb-8 overflow-x-auto">
          <div className="flex border-b border-gray-200 min-w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-6 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-black text-black bg-gray-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {tab.badge && (
                  <span className="ml-1 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">📊 Resumen General</h2>
                <AnalyticsDashboard />
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">📦 Gestión de Órdenes</h2>
                <OrderManagement />
              </div>
            )}

            {activeTab === 'comandero' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">🧑‍🍳 Comandero</h2>
                <p className="text-gray-600">Crea pedidos en local para clientes de mostrador y dispara ticket automático.</p>
                <AdminComandero />
              </div>
            )}

            {activeTab === 'advanced-analytics' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">📈 Análitica Avanzada</h2>
                <p className="text-gray-600">Comparativa de desempeño entre UberEats, Glovo, Deliveroo y Just Eat con métricas detalladas</p>
                <AdvancedAnalyticsDashboard />
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">🧾 Facturación</h2>
                <p className="text-gray-600">Genera facturas desde órdenes pagadas y gestiona su estado</p>
                <InvoiceManager />
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">🚗 Integraciones de Delivery</h2>
                <DeliveryIntegration />
              </div>
            )}

            {activeTab === 'employees' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">👥 Gestión de Empleados</h2>
                <EmployeeManager />
              </div>
            )}

            {activeTab === 'scheduler' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">⏰ Sincronización Automática</h2>
                <p className="text-gray-600">Configura la sincronización automática de órdenes desde todas tus plataformas</p>
                <SchedulerPanel />
              </div>
            )}

            {activeTab === 'qr' && (
              <div className="space-y-6">
                <QRManager />
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">
              ✓ Última actualización: <span className="font-bold">{new Date().toLocaleString('es-ES')}</span>
            </p>
            <p className="text-gray-500 text-xs mt-1">M SMASH v1.0 - FASE 4: Email, Scheduler, Órdenes, RBAC, Análitica</p>
          </div>
          <div className="text-right">
            <p className="text-3xl">✅</p>
            <p className="text-xs text-gray-600 mt-1">Todos los sistemas activos</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Scheduler Panel Component
function SchedulerPanel() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncIntervalMinutes, setSyncIntervalMinutes] = useState(5)
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null)
  const [enabledIntegrations, setEnabledIntegrations] = useState(0)
  const [successfulSyncs, setSuccessfulSyncs] = useState(0)
  const [failedSyncs, setFailedSyncs] = useState(0)
  const [avgDurationMs, setAvgDurationMs] = useState(0)
  const [history, setHistory] = useState<
    Array<{
      id: string
      timestamp: string | Date
      totalDuration: number
      successCount: number
      failureCount: number
    }>
  >([])

  const loadSchedulerData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [stats, syncHistory, integrations] = await Promise.all([
        getSyncStats(),
        getSyncHistory(5),
        getDeliveryIntegrations()
      ])

      const normalizedStats = (stats as any) || {}
      const normalizedHistory = Array.isArray(syncHistory) ? syncHistory : []
      const normalizedIntegrations = Array.isArray(integrations) ? integrations : []

      setSyncIntervalMinutes(Number(normalizedStats.nextSyncInterval || 5))
      setSuccessfulSyncs(Number(normalizedStats.successfulSyncs || 0))
      setFailedSyncs(Number(normalizedStats.failedSyncs || 0))
      setAvgDurationMs(Number(normalizedStats.averageDuration || 0))
      setLastSyncAt(normalizedStats.lastSync ? new Date(normalizedStats.lastSync) : null)
      setEnabledIntegrations(normalizedIntegrations.length)

      setHistory(
        normalizedHistory.map((entry: any) => ({
          id: String(entry.id || `${entry.timestamp}`),
          timestamp: entry.timestamp,
          totalDuration: Number(entry.totalDuration || 0),
          successCount: Number(entry.successCount || 0),
          failureCount: Number(entry.failureCount || 0)
        }))
      )
    } catch (error) {
      console.error('Error loading scheduler data:', error)
      setHistory([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSchedulerData()
  }, [loadSchedulerData])

  const handleManualSync = async () => {
    try {
      setIsSyncing(true)
      await executeSyncCycle()
      await loadSchedulerData()
    } catch (error) {
      console.error('Error running manual sync:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleIntervalChange = async (value: number) => {
    setSyncIntervalMinutes(value)
    try {
      await setSyncInterval(value)
    } catch (error) {
      console.error('Error setting sync interval:', error)
    }
  }

  const isRunning = enabledIntegrations > 0

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Estado del Scheduler</p>
              <p className={`text-3xl font-bold mt-2 ${isRunning ? 'text-green-700' : 'text-gray-700'}`}>
                {isRunning ? '⚡ ACTIVO' : '⏸️ PAUSADO'}
              </p>
              <p className="text-xs text-green-600 mt-1">Sincronizando automáticamente</p>
            </div>
            <div className="text-5xl">{isRunning ? '⚡' : '⏸️'}</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Última Sincronización</p>
              <p className="text-2xl font-bold mt-2 text-blue-900">
                {lastSyncAt ? `Hace ${Math.round((Date.now() - lastSyncAt.getTime()) / 60000)}m` : 'Sin datos'}
              </p>
              <p className="text-xs text-blue-600 mt-1">{lastSyncAt ? lastSyncAt.toLocaleTimeString('es-ES') : '---'}</p>
            </div>
            <div className="text-5xl">🔄</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Intervalo</p>
              <p className="text-3xl font-bold mt-2 text-purple-900">{syncIntervalMinutes} min</p>
              <p className="text-xs text-purple-600 mt-1">Entre sincronizaciones</p>
            </div>
            <div className="text-5xl">⏱️</div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">⚙️ Configuración</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Interval Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Intervalo de Sincronización: <span className="font-bold text-black">{syncIntervalMinutes} minutos</span>
            </label>
            <input
              type="range"
              min="1"
              max="60"
              value={syncIntervalMinutes}
              onChange={(e) => handleIntervalChange(parseInt(e.target.value, 10))}
              className="w-full cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-2">⚠️ Mínimo 1 minuto (máxima sincronía), máximo 60 minutos (menor carga)</p>
          </div>

          {/* Scheduler Status Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Control del Scheduler</label>
            <div className={`w-full py-3 rounded-lg font-bold text-lg text-center border-2 ${
              isRunning
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
              {isRunning ? '⚡ Integraciones activas' : '⏸️ Sin integraciones activas'}
            </div>
            <p className="text-xs text-gray-500 mt-2">Integraciones habilitadas: {enabledIntegrations}</p>
          </div>
        </div>

        {/* Manual Sync Button */}
        <div>
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-4 rounded-lg font-bold hover:from-gray-800 hover:to-gray-900 transition flex items-center justify-center gap-2 text-lg"
          >
            {isSyncing ? '⏳ Sincronizando...' : '🔄 Sincronizar Ahora (UberEats + Glovo + Deliveroo + Just Eat)'}
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>ℹ️ ¿Cómo funciona?</strong><br />
            Esta sección usa datos reales de sincronización y del historial guardado en base de datos.
            Si una plataforma falla, el error se registra en la integración correspondiente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500">Sincronizaciones OK</p>
            <p className="text-2xl font-bold text-green-700">{successfulSyncs}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500">Sincronizaciones con fallo</p>
            <p className="text-2xl font-bold text-red-700">{failedSyncs}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500">Duración media</p>
            <p className="text-2xl font-bold text-gray-800">{(avgDurationMs / 1000).toFixed(1)}s</p>
          </div>
        </div>

        {/* Sync Log */}
        <div>
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">📋 Historial de Sincronizaciones (últimas 5)</h4>
          {isLoading ? (
            <p className="text-sm text-gray-500">Cargando historial...</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-gray-500">Aún no hay sincronizaciones registradas.</p>
          ) : (
            <div className="space-y-2">
              {history.map((log) => {
                const ok = log.failureCount === 0
                return (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-900 font-medium">
                      {new Date(log.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`text-sm font-bold ${ok ? 'text-green-600' : 'text-amber-700'}`}>
                      {ok ? '✓ Exitosa' : '⚠ Con incidencias'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {log.successCount} ok / {log.failureCount} fallos | {(log.totalDuration / 1000).toFixed(1)}s
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
