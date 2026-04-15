'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { deleteOrderByAdmin, getAllOrders, updateOrderStatus } from '@/actions/orders'
import { processRefund } from '@/actions/refunds'
import { createInvoiceFromOrder } from '@/actions/invoices'
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  MoreVertical,
  DollarSign,
  Package,
  Zap,
  Loader,
  Printer
} from 'lucide-react'

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  status: string
  paymentStatus: string
  paymentMethod: string
  totalAmount: number
  items: Array<{ product: { name: string }; quantity: number }>
  invoice?: { id: string } | null
  createdAt: Date
  deliveryMethod: string
}

interface FilterState {
  status: string
  paymentStatus: string
  timeRange: string
}

function filterOrders(orderList: Order[], currentFilters: FilterState) {
  let filtered = [...orderList]

  if (currentFilters.status !== 'all') {
    filtered = filtered.filter(o => o.status === currentFilters.status)
  }

  if (currentFilters.paymentStatus !== 'all') {
    filtered = filtered.filter(o => o.paymentStatus === currentFilters.paymentStatus)
  }

  const now = new Date()
  if (currentFilters.timeRange === 'today') {
    filtered = filtered.filter(o => {
      const orderDate = new Date(o.createdAt)
      return orderDate.toDateString() === now.toDateString()
    })
  } else if (currentFilters.timeRange === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    filtered = filtered.filter(o => new Date(o.createdAt) >= weekAgo)
  }

  return filtered
}

function getOrderStats(orderList: Order[]) {
  const completed = orderList.filter(o => o.status === 'COMPLETED').length
  const pending = orderList.filter(o => o.paymentStatus === 'PENDING').length
  const revenue = orderList
    .filter(o => o.paymentStatus === 'COMPLETED')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  return {
    totalOrders: orderList.length,
    completedOrders: completed,
    pendingPayment: pending,
    totalRevenue: revenue
  }
}

export default function AdminOrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [autoPrintEnabled, setAutoPrintEnabled] = useState(false)
  const [autoPrintMode, setAutoPrintMode] = useState<'ALL' | 'PAID'>('PAID')
  const [printQueue, setPrintQueue] = useState<string[]>([])
  const [activePrintOrderId, setActivePrintOrderId] = useState<string | null>(null)
  const [activePrintSrc, setActivePrintSrc] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundReason, setRefundReason] = useState('')
  const [refundLoading, setRefundLoading] = useState(false)
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingPayment: 0,
    totalRevenue: 0
  })

  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    paymentStatus: 'all',
    timeRange: 'today'
  })

  const filtersRef = useRef(filters)
  const autoPrintEnabledRef = useRef(false)
  const autoPrintModeRef = useRef<'ALL' | 'PAID'>('PAID')
  const knownOrderIdsRef = useRef<Set<string>>(new Set())
  const initializedOrdersRef = useRef(false)

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const getPrintedOrderIds = () => {
    if (typeof window === 'undefined') return new Set<string>()

    try {
      const raw = window.localStorage.getItem('adminPrintedOrderIds')
      const parsed = raw ? JSON.parse(raw) : []
      return new Set<string>(Array.isArray(parsed) ? parsed : [])
    } catch {
      return new Set<string>()
    }
  }

  const markOrderPrinted = useCallback((orderId: string) => {
    if (typeof window === 'undefined') return

    const printed = getPrintedOrderIds()
    printed.add(orderId)
    window.localStorage.setItem('adminPrintedOrderIds', JSON.stringify(Array.from(printed).slice(-500)))
  }, [])

  // Cargar órdenes
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllOrders()
      const currentIds = new Set(data.map((o) => o.id))

      if (initializedOrdersRef.current && autoPrintEnabledRef.current) {
        const newOrders = data.filter((o) => !knownOrderIdsRef.current.has(o.id))
        const printed = getPrintedOrderIds()
        const eligible = newOrders.filter((o) => {
          if (printed.has(o.id)) return false
          if (autoPrintModeRef.current === 'PAID') return o.paymentStatus === 'COMPLETED'
          return true
        })

        if (eligible.length > 0) {
          setPrintQueue((prev) => {
            const dedup = new Set(prev)
            for (const order of eligible) dedup.add(order.id)
            return Array.from(dedup)
          })
        }
      }

      knownOrderIdsRef.current = currentIds
      initializedOrdersRef.current = true
      setOrders(data)
      setFilteredOrders(filterOrders(data, filtersRef.current))
      setStats(getOrderStats(data))
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  useEffect(() => {
    autoPrintEnabledRef.current = autoPrintEnabled
  }, [autoPrintEnabled])

  useEffect(() => {
    autoPrintModeRef.current = autoPrintMode
  }, [autoPrintMode])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedEnabled = window.localStorage.getItem('adminAutoPrintEnabled')
    const storedMode = window.localStorage.getItem('adminAutoPrintMode')

    if (storedEnabled === 'true') {
      setAutoPrintEnabled(true)
      autoPrintEnabledRef.current = true
    }

    if (storedMode === 'ALL' || storedMode === 'PAID') {
      setAutoPrintMode(storedMode)
      autoPrintModeRef.current = storedMode
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('adminAutoPrintEnabled', String(autoPrintEnabled))
  }, [autoPrintEnabled])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('adminAutoPrintMode', autoPrintMode)
  }, [autoPrintMode])

  useEffect(() => {
    const interval = window.setInterval(() => {
      fetchOrders()
    }, 15000)

    return () => {
      window.clearInterval(interval)
    }
  }, [fetchOrders])

  useEffect(() => {
    if (activePrintOrderId || printQueue.length === 0) return

    const [nextOrderId, ...rest] = printQueue
    setActivePrintOrderId(nextOrderId)
    setActivePrintSrc(`/admin/orders/print/${nextOrderId}?autoprint=1&ts=${Date.now()}`)
    setPrintQueue(rest)

    const releaseTimer = window.setTimeout(() => {
      markOrderPrinted(nextOrderId)
      setActivePrintOrderId(null)
      setActivePrintSrc(null)
    }, 2500)

    return () => {
      window.clearTimeout(releaseTimer)
    }
  }, [activePrintOrderId, printQueue, markOrderPrinted])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    filtersRef.current = newFilters
    setFilteredOrders(filterOrders(orders, newFilters))
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus as any)
      setOpenDropdown(null)
      fetchOrders()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleRefund = async () => {
    if (!selectedOrder) return

    setRefundLoading(true)
    try {
      await processRefund({
        orderId: selectedOrder.id,
        reason: refundReason
      })
      setShowRefundModal(false)
      setRefundReason('')
      fetchOrders()
    } catch (error) {
      console.error('Error processing refund:', error)
      alert('Error al procesar el reembolso')
    } finally {
      setRefundLoading(false)
    }
  }

  const handleGenerateInvoice = async (order: Order) => {
    try {
      const invoice = await createInvoiceFromOrder(order.id)
      alert('Factura generada correctamente')
      window.open(`/api/invoices/${invoice.id}/download`, '_blank', 'noopener,noreferrer')
      setOpenDropdown(null)
      fetchOrders()
    } catch (error) {
      console.error('Error creating invoice:', error)
      alert('No se pudo generar la factura')
    }
  }

  const handleDeleteOrder = async (order: Order) => {
    const confirmed = window.confirm(`¿Eliminar pedido #${order.id.slice(-8)} de ${order.customerName}? Esta acción no se puede deshacer.`)
    if (!confirmed) return

    try {
      await deleteOrderByAdmin(order.id)
      setOpenDropdown(null)
      await fetchOrders()
      alert('Pedido eliminado correctamente')
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('No se pudo eliminar el pedido')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PREPARING: 'bg-purple-100 text-purple-800',
      READY: 'bg-indigo-100 text-indigo-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentStatusIcon = (status: string) => {
    if (status === 'COMPLETED') return <CheckCircle className="w-4 h-4 text-green-600" />
    if (status === 'PENDING') return <Clock className="w-4 h-4 text-yellow-600" />
    if (status === 'FAILED') return <AlertCircle className="w-4 h-4 text-red-600" />
    return <RefreshCw className="w-4 h-4 text-gray-600" />
  }

  const getPaymentMethodLabel = (method: string) => {
    const normalized = String(method || '').toUpperCase()

    if (normalized === 'STRIPE') {
      return {
        label: 'Tarjeta online',
        classes: 'bg-cyan-50 text-cyan-700 border border-cyan-200'
      }
    }

    if (normalized === 'DATAPHONE' || normalized === 'TPV' || normalized === 'CARD_PRESENT') {
      return {
        label: 'Datáfono',
        classes: 'bg-blue-50 text-blue-700 border border-blue-200'
      }
    }

    if (normalized === 'CASH') {
      return {
        label: 'Efectivo',
        classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      }
    }

    if (normalized === 'LOCAL') {
      return {
        label: 'Pago local',
        classes: 'bg-amber-50 text-amber-700 border border-amber-200'
      }
    }

    return {
      label: normalized || 'Sin definir',
      classes: 'bg-gray-100 text-gray-700 border border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4" />
      case 'PREPARING':
        return <Zap className="w-4 h-4" />
      case 'READY':
        return <Package className="w-4 h-4" />
      case 'COMPLETED':
        return <ShoppingBag className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">📊 Panel de Órdenes</h1>
            <p className="text-gray-600">Gestiona y monitorea todos los pedidos</p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="min-h-[44px] rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total de órdenes</p>
                <p className="text-3xl font-extrabold text-blue-900">{stats.totalOrders}</p>
              </div>
              <ShoppingBag className="w-12 h-12 text-blue-700 opacity-70" />
            </div>
          </div>

          <div className="rounded-lg border border-green-200 bg-green-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Órdenes completadas</p>
                <p className="text-3xl font-extrabold text-green-900">{stats.completedOrders}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-700 opacity-70" />
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700">Pendiente de pago</p>
                <p className="text-3xl font-extrabold text-amber-900">{stats.pendingPayment}</p>
              </div>
              <Clock className="w-12 h-12 text-amber-700 opacity-70" />
            </div>
          </div>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Revenue total</p>
                <p className="text-3xl font-extrabold text-purple-900">€{(stats.totalRevenue / 100).toFixed(2)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-purple-700 opacity-70" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-gray-900 font-semibold mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.status}
              onChange={e => handleFilterChange('status', e.target.value)}
              className="min-h-[44px] rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="PENDING">Pendiente</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="PREPARING">Preparando</option>
              <option value="READY">Listo</option>
              <option value="COMPLETED">Completado</option>
              <option value="CANCELED">Cancelado</option>
              <option value="REFUNDED">Reembolsado</option>
            </select>

            <select
              value={filters.paymentStatus}
              onChange={e => handleFilterChange('paymentStatus', e.target.value)}
              className="min-h-[44px] rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los pagos</option>
              <option value="PENDING">Pendiente de pago</option>
              <option value="COMPLETED">Pagado</option>
              <option value="FAILED">Pago fallido</option>
              <option value="REFUNDED">Reembolsado</option>
            </select>

            <select
              value={filters.timeRange}
              onChange={e => handleFilterChange('timeRange', e.target.value)}
              className="min-h-[44px] rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todo el tiempo</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
            </select>
          </div>

          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Impresión automática TPV</p>
                <p className="text-xs text-gray-600">
                  Detecta pedidos nuevos y lanza impresión en este equipo (debe estar abierto aquí).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => window.open('/admin/orders/print/test-ticket?autoprint=1', '_blank', 'noopener,noreferrer')}
                  className="min-h-[44px] rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                >
                  Ticket de prueba
                </button>

                <label className="text-sm text-gray-700">Modo</label>
                <select
                  value={autoPrintMode}
                  onChange={(e) => setAutoPrintMode(e.target.value as 'ALL' | 'PAID')}
                  disabled={!autoPrintEnabled}
                  className="min-h-[44px] rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:opacity-50"
                >
                  <option value="PAID">Solo pagados</option>
                  <option value="ALL">Todos los pedidos</option>
                </select>

                <button
                  onClick={() => setAutoPrintEnabled((prev) => !prev)}
                  className={`min-h-[44px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    autoPrintEnabled
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {autoPrintEnabled ? 'ACTIVADO' : 'DESACTIVADO'}
                </button>
              </div>
            </div>

            {printQueue.length > 0 && (
              <p className="mt-3 text-xs text-amber-700">
                Cola de impresión: {printQueue.length} pedido(s) pendiente(s).
              </p>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Items</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Monto</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Pago</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Creado</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center">
                      <Loader className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No se encontraron órdenes
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                        {order.id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div>{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        €{(order.totalAmount / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span
                            className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${getPaymentMethodLabel(order.paymentMethod).classes}`}
                          >
                            {getPaymentMethodLabel(order.paymentMethod).label}
                          </span>

                          <div className="flex items-center gap-2">
                          {getPaymentStatusIcon(order.paymentStatus)}
                          <span className="text-sm text-gray-700">{order.paymentStatus}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenDropdown(openDropdown === order.id ? null : order.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>

                          {openDropdown === order.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
                              <div className="py-2">
                                <select
                                  onChange={e => handleStatusChange(order.id, e.target.value)}
                                  className="w-full px-4 py-2 text-sm text-gray-900 bg-white border-b border-gray-200"
                                >
                                  <option value="">Cambiar estado...</option>
                                  <option value="PREPARING">Preparando</option>
                                  <option value="READY">Listo</option>
                                  <option value="COMPLETED">Completado</option>
                                </select>

                                {order.paymentStatus === 'COMPLETED' && order.status !== 'COMPLETED' && (
                                  <button
                                    onClick={() => {
                                      setSelectedOrder(order)
                                      setShowRefundModal(true)
                                      setOpenDropdown(null)
                                    }}
                                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 text-left flex items-center gap-2 border-t border-gray-200"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                    Reembolsar
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    window.open(`/admin/orders/print/${order.id}`, '_blank', 'noopener,noreferrer')
                                    setOpenDropdown(null)
                                  }}
                                  className="w-full px-4 py-2 text-sm text-emerald-700 hover:bg-gray-50 text-left flex items-center gap-2 border-t border-gray-200"
                                >
                                  <Printer className="w-4 h-4" />
                                  Imprimir ticket
                                </button>

                                {!order.invoice && order.status !== 'CANCELED' && order.status !== 'REFUNDED' && (
                                  <button
                                    onClick={() => handleGenerateInvoice(order)}
                                    className="w-full px-4 py-2 text-sm text-amber-700 hover:bg-gray-50 text-left border-t border-gray-200"
                                  >
                                    🧾 Generar factura
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    window.location.href = `mailto:${order.customerEmail}?subject=Tu pedido #${order.id.slice(-8)}`
                                    setOpenDropdown(null)
                                  }}
                                  className="w-full px-4 py-2 text-sm text-blue-700 hover:bg-gray-50 text-left border-t border-gray-200"
                                >
                                  📧 Enviar email
                                </button>

                                <button
                                  onClick={() => handleDeleteOrder(order)}
                                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 text-left border-t border-gray-200"
                                >
                                  🗑 Eliminar pedido
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-md w-full border border-gray-200 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🔄 Procesar Reembolso</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orden: #{selectedOrder.id.slice(-8)}
                </label>
                <div className="bg-gray-100 px-4 py-2 rounded text-gray-800">
                  €{(selectedOrder.totalAmount / 100).toFixed(2)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo (opcional)
                </label>
                <textarea
                  value={refundReason}
                  onChange={e => setRefundReason(e.target.value)}
                  placeholder="Ej: Cliente solicitó cancelación"
                  rows={3}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowRefundModal(false)
                    setRefundReason('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRefund}
                  disabled={refundLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {refundLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Confirmar Reembolso
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePrintOrderId && activePrintSrc && (
        <iframe
          title="auto-print-ticket"
          src={activePrintSrc}
          className="hidden"
        />
      )}
    </div>
  )
}
