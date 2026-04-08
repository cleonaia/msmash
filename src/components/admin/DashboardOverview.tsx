'use client'

import { useState } from 'react'
import { AnalyticsDashboard } from './AnalyticsDashboard'
import { EmployeeManager } from './EmployeeManager'
import { DeliveryIntegration } from './DeliveryIntegration'
import { OrderManagement } from './OrderManagement'
import { AdvancedAnalyticsDashboard } from './AdvancedAnalytics'
import { InvoiceManager } from './InvoiceManager'
import { QRManager } from './QRManager'

type TabType = 'dashboard' | 'orders' | 'advanced-analytics' | 'delivery' | 'invoices' | 'employees' | 'scheduler' | 'qr'

export function DashboardOverview() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')

  const tabs: Array<{ id: TabType; label: string; icon: string; badge?: string }> = [
    { id: 'dashboard', label: 'Panel Principal', icon: '📊' },
    { id: 'orders', label: 'Órdenes', icon: '📦' },
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">🍔 Panel de Control M SMASH</h1>
              <p className="text-gray-300 mt-2">Centro de operaciones integral para tu pizzería</p>
            </div>
            <div className="text-5xl">⚙️</div>
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
  const [isRunning, setIsRunning] = useState(true)
  const [syncInterval, setSyncInterval] = useState(5)
  const [lastSync, setLastSync] = useState(new Date(Date.now() - 3 * 60 * 1000))

  const handleManualSync = () => {
    setLastSync(new Date())
  }

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
                Hace {Math.round((Date.now() - lastSync.getTime()) / 60000)}m
              </p>
              <p className="text-xs text-blue-600 mt-1">{lastSync.toLocaleTimeString('es-ES')}</p>
            </div>
            <div className="text-5xl">🔄</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Intervalo</p>
              <p className="text-3xl font-bold mt-2 text-purple-900">{syncInterval} min</p>
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
              Intervalo de Sincronización: <span className="font-bold text-black">{syncInterval} minutos</span>
            </label>
            <input
              type="range"
              min="1"
              max="60"
              value={syncInterval}
              onChange={(e) => setSyncInterval(parseInt(e.target.value))}
              className="w-full cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-2">⚠️ Mínimo 1 minuto (máxima sincronía), máximo 60 minutos (menor carga)</p>
          </div>

          {/* Scheduler Status Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Control del Scheduler</label>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`w-full py-3 rounded-lg font-bold transition text-lg ${
                isRunning
                  ? 'bg-red-50 border-2 border-red-200 text-red-700 hover:bg-red-100'
                  : 'bg-green-50 border-2 border-green-200 text-green-700 hover:bg-green-100'
              }`}
            >
              {isRunning ? '⏸️ Pausar Sincronización' : '▶️ Reanudar Sincronización'}
            </button>
          </div>
        </div>

        {/* Manual Sync Button */}
        <div>
          <button
            onClick={handleManualSync}
            className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-4 rounded-lg font-bold hover:from-gray-800 hover:to-gray-900 transition flex items-center justify-center gap-2 text-lg"
          >
            🔄 Sincronizar Ahora (UberEats + Glovo + Deliveroo + Just Eat)
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>ℹ️ ¿Cómo funciona?</strong><br />
            El scheduler sincroniza automáticamente todas tus órdenes desde UberEats, Glovo, Deliveroo y Just Eat cada X minutos. 
            Si una sincronización falla, se reintentar automáticamente hasta 3 veces.
          </p>
        </div>

        {/* Sync Log */}
        <div>
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">📋 Historial de Sincronizaciones (últimas 5)</h4>
          <div className="space-y-2">
            {[
              { time: '14:30', status: '✓ Exitosa', duration: '2.4s', orders: '12' },
              { time: '14:25', status: '✓ Exitosa', duration: '2.1s', orders: '8' },
              { time: '14:20', status: '✓ Exitosa', duration: '2.8s', orders: '15' },
              { time: '14:15', status: '✓ Exitosa', duration: '2.2s', orders: '5' },
              { time: '14:10', status: '✓ Exitosa', duration: '2.5s', orders: '10' }
            ].map((log, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-900 font-medium">{log.time}</span>
                <span className="text-sm text-green-600 font-bold">{log.status}</span>
                <span className="text-xs text-gray-500">{log.orders} órdenes | {log.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
