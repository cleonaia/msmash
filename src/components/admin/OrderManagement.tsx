'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { getDeliveryOrders } from '@/actions/delivery'
import { deleteOrderByAdmin, getAllOrders, markOrderAsPaid, updateOrderStatus } from '@/actions/orders'
import { epsonBluetoothPrinter, formatOrderReceipt } from '@/lib/epson-bluetooth-printer'
import { BluetoothPrinterPanel } from './BluetoothPrinterPanel'

interface DeliveryOrder {
  id: string
  platform: string
  externalOrderId: string
  merchantId: string
  status: string
  paymentStatus?: string | null
  customerName: string
  customerPhone?: string | null
  deliveryAddress?: string | null
  items: Array<{ name: string; quantity: number; price: number }>
  totalPrice: number
  currency: string
  receivedAt: Date | string
  acceptedAt?: Date | string | null
  preparedAt?: Date | string | null
  collectedAt?: Date | string | null
  deliveredAt?: Date | string | null
  cancelledAt?: Date | string | null
}

function buildEpsonReceiptFromOrder(order: DeliveryOrder) {
  return formatOrderReceipt({
    id: order.id,
    createdAt: order.receivedAt,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    paymentStatus: order.platform === 'WEB' ? 'PAGADO' : 'DELIVERY',
    paymentMethod: order.platform === 'WEB' ? 'LOCAL' : order.platform,
    status: order.status,
    totalAmount: Math.round(order.totalPrice * 100),
    items: order.items.map((item) => ({
      quantity: item.quantity,
      product: { name: item.name || 'Producto' },
    })),
  })
}

interface LocalOrder {
  id: string
  status: string
  customerName: string
  customerPhone: string
  paymentMethod: string
  paymentStatus: string
  totalAmount: number
  createdAt: Date | string
  items: Array<{ product?: { name: string }; quantity: number; unitPrice: number }>
}

type SortField = 'date' | 'price' | 'status' | 'platform'
type SortOrder = 'asc' | 'desc'

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  received: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '📥' },
  accepted: { bg: 'bg-cyan-50', text: 'text-cyan-700', icon: '✅' },
  prepared: { bg: 'bg-amber-50', text: 'text-amber-700', icon: '👨‍🍳' },
  collected: { bg: 'bg-purple-50', text: 'text-purple-700', icon: '📦' },
  delivered: { bg: 'bg-green-50', text: 'text-green-700', icon: '✓' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', icon: '✗' },
  PENDING: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: '⏳' },
  CONFIRMED: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '✅' },
  PREPARING: { bg: 'bg-amber-50', text: 'text-amber-700', icon: '👨‍🍳' },
  READY: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: '📦' },
  COMPLETED: { bg: 'bg-green-50', text: 'text-green-700', icon: '✓' },
  CANCELED: { bg: 'bg-red-50', text: 'text-red-700', icon: '✗' },
  PAYMENT_FAILED: { bg: 'bg-rose-50', text: 'text-rose-700', icon: '⚠' },
  REFUNDED: { bg: 'bg-gray-100', text: 'text-gray-700', icon: '↩' }
}

const PLATFORM_COLORS: Record<string, string> = {
  UBEREATS: 'bg-black text-white',
  GLOVO: 'bg-yellow-400 text-black',
  DELIVEROO: 'bg-cyan-400 text-black',
  WEB: 'bg-emerald-600 text-white'
}

const WEB_ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELED'] as const

function isCompletedStatus(status: string) {
  return status === 'delivered' || status === 'COMPLETED'
}

function isClosedStatus(status: string) {
  return ['delivered', 'cancelled', 'COMPLETED', 'CANCELED', 'REFUNDED', 'PAYMENT_FAILED'].includes(status)
}

function getDisplayedStatus(order: DeliveryOrder) {
  if (order.paymentStatus === 'COMPLETED') return 'CONFIRMED'
  return order.status
}

function getPaymentLabel(paymentStatus?: string | null) {
  if (paymentStatus === 'COMPLETED') return 'Pagado'
  if (paymentStatus === 'PENDING') return 'Pendiente'
  if (paymentStatus === 'FAILED') return 'Fallido'
  if (paymentStatus === 'REFUNDED') return 'Reembolsado'
  return 'Sin estado'
}

export function OrderManagement() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [autoPrintEnabled, setAutoPrintEnabled] = useState(false)
  const [autoBluetoothPrintEnabled, setAutoBluetoothPrintEnabled] = useState(false)
  const [epsonConnected, setEpsonConnected] = useState(
    epsonBluetoothPrinter.getState().status === 'connected'
  )
  const [printQueue, setPrintQueue] = useState<string[]>([])
  const [activePrintOrderId, setActivePrintOrderId] = useState<string | null>(null)
  const [activePrintSrc, setActivePrintSrc] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const autoPrintEnabledRef = useRef(false)
  const autoBluetoothPrintEnabledRef = useRef(false)
  const knownOrderIdsRef = useRef<Set<string>>(new Set())
  const initializedOrdersRef = useRef(false)
  const filterControlClass =
    'admin-filter-control w-full min-h-[48px] rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm appearance-none [color-scheme:light] transition focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100 placeholder:text-slate-400'
  const lightFieldStyle = {
    backgroundColor: '#ffffff',
    backgroundImage: 'none',
    color: '#0f172a',
    WebkitTextFillColor: '#0f172a',
    WebkitAppearance: 'none',
    appearance: 'none',
    colorScheme: 'light',
    boxShadow: '0 0 0 1000px #ffffff inset',
  } as const

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      const [deliveryData, localData] = await Promise.all([
        getDeliveryOrders(30),
        getAllOrders()
      ])

      const deliveryOrders = (deliveryData as DeliveryOrder[]) || []
      const websiteOrders: DeliveryOrder[] = ((localData as LocalOrder[]) || []).map((order) => ({
        id: order.id,
        platform: 'WEB',
        externalOrderId: `WEB-${order.id.slice(-8).toUpperCase()}`,
        merchantId: 'WEB',
        status: order.status,
        paymentStatus: order.paymentStatus,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        deliveryAddress: null,
        items: order.items.map((item) => ({
          name: item.product?.name || 'Producto',
          quantity: item.quantity,
          price: (item.unitPrice || 0) / 100
        })),
        totalPrice: order.totalAmount / 100,
        currency: 'EUR',
        receivedAt: order.createdAt,
        acceptedAt: null,
        preparedAt: null,
        collectedAt: null,
        deliveredAt: null,
        cancelledAt: null
      }))

      const nextOrders = [...websiteOrders, ...deliveryOrders]
      const currentIds = new Set(nextOrders.map((o) => o.id))

      if (initializedOrdersRef.current && autoPrintEnabledRef.current) {
        const newOrders = nextOrders.filter((o) => !knownOrderIdsRef.current.has(o.id))

        if (newOrders.length > 0) {
          setPrintQueue((prev) => {
            const dedup = new Set(prev)
            for (const order of newOrders) dedup.add(order.id)
            return Array.from(dedup)
          })
        }
      }

      knownOrderIdsRef.current = currentIds
      initializedOrdersRef.current = true
      setOrders(nextOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  useEffect(() => {
    autoPrintEnabledRef.current = autoPrintEnabled
  }, [autoPrintEnabled])

  useEffect(() => {
    autoBluetoothPrintEnabledRef.current = autoBluetoothPrintEnabled
  }, [autoBluetoothPrintEnabled])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedEnabled = window.localStorage.getItem('deliveryAutoPrintEnabled')
    if (storedEnabled === 'true') {
      setAutoPrintEnabled(true)
      autoPrintEnabledRef.current = true
    }

    const storedBluetoothEnabled = window.localStorage.getItem('deliveryAutoBluetoothPrintEnabled')
    if (storedBluetoothEnabled === 'true') {
      setAutoBluetoothPrintEnabled(true)
      autoBluetoothPrintEnabledRef.current = true
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('deliveryAutoPrintEnabled', String(autoPrintEnabled))
  }, [autoPrintEnabled])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('deliveryAutoBluetoothPrintEnabled', String(autoBluetoothPrintEnabled))
  }, [autoBluetoothPrintEnabled])

  useEffect(() => {
    return epsonBluetoothPrinter.subscribe((state) => {
      setEpsonConnected(state.status === 'connected')
    })
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      loadOrders()
    }, 15000)

    return () => {
      window.clearInterval(interval)
    }
  }, [loadOrders])

  useEffect(() => {
    if (activePrintOrderId || printQueue.length === 0) return

    const [nextOrderId, ...rest] = printQueue
    const nextOrder = orders.find((o) => o.id === nextOrderId)

    if (nextOrder && autoBluetoothPrintEnabledRef.current && epsonBluetoothPrinter.getState().status === 'connected') {
      setActivePrintOrderId(nextOrderId)

      let cancelled = false

      ;(async () => {
        try {
          await epsonBluetoothPrinter.printReceipt(buildEpsonReceiptFromOrder(nextOrder))
        } catch (error) {
          console.error('Error auto printing order on Epson Bluetooth:', error)
        } finally {
          if (!cancelled) {
            setPrintQueue(rest)
            setActivePrintOrderId(null)
          }
        }
      })()

      return () => {
        cancelled = true
      }
    }

    const printSrc = nextOrder?.platform === 'WEB'
      ? `/admin/orders/print/${nextOrderId}?autoprint=1&ts=${Date.now()}`
      : `/admin/delivery/print/${nextOrderId}?autoprint=1&ts=${Date.now()}`

    setActivePrintOrderId(nextOrderId)
    setActivePrintSrc(printSrc)
    setPrintQueue(rest)

    const releaseTimer = window.setTimeout(() => {
      setActivePrintOrderId(null)
      setActivePrintSrc(null)
    }, 2500)

    return () => {
      window.clearTimeout(releaseTimer)
    }
  }, [activePrintOrderId, printQueue, orders, epsonConnected])

  // Filtrar órdenes
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchLower) ||
        order.externalOrderId.toLowerCase().includes(searchLower) ||
        order.customerPhone?.includes(searchTerm)

      const matchesPlatform = selectedPlatform === 'all' || order.platform === selectedPlatform
      const matchesStatus = selectedStatus === 'all' || getDisplayedStatus(order) === selectedStatus || order.status === selectedStatus

      const orderDate = new Date(order.receivedAt)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      endDate.setHours(23, 59, 59)
      const matchesDate = orderDate >= startDate && orderDate <= endDate

      return matchesSearch && matchesPlatform && matchesStatus && matchesDate
    })
  }, [orders, searchTerm, selectedPlatform, selectedStatus, dateRange])

  // Ordenar órdenes
  const sortedOrders = useMemo(() => {
    const sorted = [...filteredOrders].sort((a, b) => {
      let aVal: any = a[sortField === 'date' ? 'receivedAt' : sortField === 'price' ? 'totalPrice' : sortField]
      let bVal: any = b[sortField === 'date' ? 'receivedAt' : sortField === 'price' ? 'totalPrice' : sortField]

      if (sortField === 'date') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [filteredOrders, sortField, sortOrder])

  const stats = {
    total: orders.length,
    active: orders.filter((o) => !isClosedStatus(o.status)).length,
    completed: orders.filter((o) => isCompletedStatus(o.status)).length,
    revenue: orders.reduce((sum, o) => sum + o.totalPrice, 0)
  }

  const handleDeleteOrder = async (order: DeliveryOrder) => {
    const confirmed = window.confirm(`¿Eliminar la orden ${order.externalOrderId} de ${order.customerName}?`)
    if (!confirmed) return

    try {
      await deleteOrderByAdmin(order.id)
      await loadOrders()
      alert('Orden eliminada correctamente')
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('No se pudo eliminar la orden')
    }
  }

  const handleBluetoothPrintOrder = async (order: DeliveryOrder) => {
    try {
      if (epsonBluetoothPrinter.getState().status !== 'connected') {
        alert('Conecta primero la Epson Bluetooth')
        return
      }

      await epsonBluetoothPrinter.printReceipt(buildEpsonReceiptFromOrder(order))
    } catch (error) {
      console.error('Error printing order on Epson Bluetooth:', error)
      alert('No se pudo imprimir el ticket por Epson Bluetooth')
    }
  }

  const handleMarkAsPaid = async (order: DeliveryOrder) => {
    try {
      await markOrderAsPaid(order.id)
      await loadOrders()
      alert('Pedido marcado como pagado y confirmado')
    } catch (error) {
      console.error('Error marking order as paid:', error)
      alert('No se pudo marcar el pedido como pagado')
    }
  }

  const handleWebStatusChange = async (order: DeliveryOrder, status: string) => {
    if (order.platform !== 'WEB' || !WEB_ORDER_STATUSES.includes(status as (typeof WEB_ORDER_STATUSES)[number])) {
      return
    }

    try {
      await updateOrderStatus(order.id, status as 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELED')
      await loadOrders()
    } catch (error) {
      console.error('Error updating web order status:', error)
      alert('No se pudo actualizar el estado del pedido')
    }
  }

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
  }

  return (
    <div className="space-y-6">
      <BluetoothPrinterPanel
        title="Epson Bluetooth TPV"
        description="Conexion manual para imprimir tickets de pedidos directamente en Epson Bluetooth."
        testLabel="Ticket de prueba TPV"
        onTestPrint={async () => {
          await epsonBluetoothPrinter.printReceipt(
            formatOrderReceipt({
              id: 'TPV-TEST-0001',
              createdAt: new Date(),
              customerName: 'Cliente TPV',
              customerPhone: '600 000 000',
              paymentStatus: 'PAGADO',
              paymentMethod: 'TPV',
              status: 'COMPLETED',
              totalAmount: 1890,
              items: [
                { quantity: 1, product: { name: 'The M Smash' } },
                { quantity: 1, product: { name: 'Patatas' } },
                { quantity: 1, product: { name: 'Bebida' } },
              ],
            })
          )
        }}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: '📊', color: 'bg-blue-50' },
          { label: 'Activas', value: stats.active, icon: '⚡', color: 'bg-amber-50' },
          { label: 'Completadas', value: stats.completed, icon: '✓', color: 'bg-green-50' },
          { label: 'Ingresos', value: `€${stats.revenue.toFixed(2)}`, icon: '💰', color: 'bg-purple-50' }
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-lg p-4 border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-sm font-medium">{stat.label}</p>
                <p className="mt-1 text-3xl font-extrabold text-gray-900 leading-none">{stat.value}</p>
              </div>
              <div className="text-3xl text-gray-700">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Nombre, ID de orden, teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={filterControlClass}
              style={lightFieldStyle}
            />
          </div>

          {/* Platform Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className={`${filterControlClass} pr-10 bg-white text-gray-900`}
              style={lightFieldStyle}
            >
              <option value="all">Todas</option>
              <option value="WEB">Web</option>
              <option value="UBEREATS">UberEats</option>
              <option value="GLOVO">Glovo</option>
              <option value="DELIVEROO">Deliveroo</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`${filterControlClass} pr-10 bg-white text-gray-900`}
              style={lightFieldStyle}
            >
              <option value="all">Todos</option>
              <option value="PENDING">⏳ Pendiente</option>
              <option value="CONFIRMED">✅ Confirmado</option>
              <option value="PREPARING">👨‍🍳 Preparando</option>
              <option value="READY">📦 Listo</option>
              <option value="COMPLETED">✓ Completado</option>
              <option value="CANCELED">✗ Cancelado</option>
              <option value="received">📥 Recibida</option>
              <option value="accepted">✅ Aceptada</option>
              <option value="prepared">👨‍🍳 Preparando</option>
              <option value="collected">📦 Lista para recoger</option>
              <option value="delivered">✓ Entregada</option>
              <option value="cancelled">✗ Cancelada</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 md:min-w-[360px]">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className={filterControlClass}
              style={lightFieldStyle}
            />
            <span className="pb-3 text-gray-500">-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className={filterControlClass}
              style={lightFieldStyle}
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            {(['table', 'cards'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`min-h-[44px] px-4 py-2 rounded-lg font-medium text-sm ${
                  viewMode === mode
                      ? 'bg-sky-100 text-slate-900 border border-sky-300 shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {mode === 'table' ? '📋' : '📇'}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Impresión automática TPV (navegador)</p>
                <p className="text-xs text-gray-600">Detecta pedidos nuevos y abre ticket de impresión en este equipo.</p>
              </div>

              <button
                onClick={() => setAutoPrintEnabled((prev) => !prev)}
                className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  autoPrintEnabled
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {autoPrintEnabled ? 'ACTIVADO' : 'DESACTIVADO'}
              </button>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Autoimpresión Epson Bluetooth</p>
                <p className="text-xs text-gray-600">
                  Imprime nuevos pedidos por Bluetooth cuando la Epson este conectada.
                </p>
              </div>

              <button
                onClick={() => setAutoBluetoothPrintEnabled((prev) => !prev)}
                className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  autoBluetoothPrintEnabled
                    ? 'bg-sky-600 text-white hover:bg-sky-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {autoBluetoothPrintEnabled ? 'ACTIVADO' : 'DESACTIVADO'}
              </button>
            </div>

            {autoBluetoothPrintEnabled && !epsonConnected ? (
              <p className="text-xs text-amber-700">Autoimpresión Bluetooth activa, pero Epson desconectada.</p>
            ) : null}
          </div>

          {printQueue.length > 0 && (
            <p className="mt-3 text-xs text-amber-700">
              Cola de impresión: {printQueue.length} pedido(s) pendiente(s).
            </p>
          )}
        </div>
      </div>

      {/* Results Counter */}
      <div className="text-sm text-gray-600">
        Mostrando <span className="font-bold">{sortedOrders.length}</span> de{' '}
        <span className="font-bold">{orders.length}</span> órdenes
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Plataforma</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Productos</th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    if (sortField === 'price') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    } else {
                      setSortField('price')
                      setSortOrder('desc')
                    }
                  }}
                >
                  Precio {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    if (sortField === 'status') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    } else {
                      setSortField('status')
                      setSortOrder('asc')
                    }
                  }}
                >
                  Estado {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    if (sortField === 'date') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    } else {
                      setSortField('date')
                      setSortOrder('desc')
                    }
                  }}
                >
                  Fecha {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedOrders.map((order) => {
                const displayStatus = getDisplayedStatus(order)
                const statusInfo = STATUS_COLORS[displayStatus]
                const paymentLabel = getPaymentLabel(order.paymentStatus)
                const isPaid = order.paymentStatus === 'COMPLETED'
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{order.externalOrderId}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${PLATFORM_COLORS[order.platform]}`}>
                        {order.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">€{order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-block w-fit px-2 py-1 rounded text-xs font-medium ${statusInfo?.bg} ${statusInfo?.text}`}>
                          {statusInfo?.icon} {displayStatus}
                        </span>
                        <span className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          Pago: {paymentLabel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.receivedAt).toLocaleString('es-ES', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.platform === 'WEB' ? (
                        <select
                          value={order.status}
                          onChange={(e) => handleWebStatusChange(order, e.target.value)}
                          className="mb-2 min-h-[40px] rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900"
                          style={lightFieldStyle}
                        >
                          <option value="PENDING">⏳ Pendiente</option>
                          <option value="CONFIRMED">✅ Confirmado</option>
                          <option value="PREPARING">👨‍🍳 Preparando</option>
                          <option value="READY">📦 Listo</option>
                          <option value="COMPLETED">✓ Completado</option>
                          <option value="CANCELED">✗ Cancelado</option>
                        </select>
                      ) : null}

                      <button
                        onClick={() => {
                          const printUrl =
                            order.platform === 'WEB'
                              ? `/admin/orders/print/${order.id}`
                              : `/admin/delivery/print/${order.id}`
                          window.open(printUrl, '_blank', 'noopener,noreferrer')
                        }}
                        className="min-h-[40px] rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                        style={lightFieldStyle}
                      >
                        Imprimir
                      </button>
                      <button
                        onClick={() => handleBluetoothPrintOrder(order)}
                        className="ml-2 min-h-[40px] rounded border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-800 hover:bg-sky-100"
                      >
                        Epson BT
                      </button>
                      {!isPaid && (
                        <button
                          onClick={() => handleMarkAsPaid(order)}
                          className="ml-2 min-h-[40px] rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                          Marcar pagado
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteOrder(order)}
                        className="ml-2 min-h-[40px] rounded bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedOrders.map((order) => {
            const displayStatus = getDisplayedStatus(order)
            const statusInfo = STATUS_COLORS[displayStatus]
            const paymentLabel = getPaymentLabel(order.paymentStatus)
            const isPaid = order.paymentStatus === 'COMPLETED'
            return (
              <div key={order.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition">
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-sm text-gray-900">{order.externalOrderId}</p>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${PLATFORM_COLORS[order.platform]}`}>
                      {order.platform}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-1">Productos:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.quantity}x {item.name} - €{item.price.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between">
                    <p className="font-bold text-lg">€{order.totalPrice.toFixed(2)}</p>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo?.bg} ${statusInfo?.text}`}>
                        {statusInfo?.icon} {displayStatus}
                      </span>
                      <p className={`mt-1 text-[10px] font-semibold ${isPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                        Pago: {paymentLabel}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const printUrl =
                        order.platform === 'WEB'
                          ? `/admin/orders/print/${order.id}`
                          : `/admin/delivery/print/${order.id}`
                      window.open(printUrl, '_blank', 'noopener,noreferrer')
                    }}
                    className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    style={lightFieldStyle}
                  >
                    Imprimir ticket
                  </button>
                  {order.platform === 'WEB' ? (
                    <select
                      value={order.status}
                      onChange={(e) => handleWebStatusChange(order, e.target.value)}
                      className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900"
                      style={lightFieldStyle}
                    >
                      <option value="PENDING">⏳ Pendiente</option>
                      <option value="CONFIRMED">✅ Confirmado</option>
                      <option value="PREPARING">👨‍🍳 Preparando</option>
                      <option value="READY">📦 Listo</option>
                      <option value="COMPLETED">✓ Completado</option>
                      <option value="CANCELED">✗ Cancelado</option>
                    </select>
                  ) : null}
                  <button
                    onClick={() => handleBluetoothPrintOrder(order)}
                    className="w-full rounded border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-800 hover:bg-sky-100"
                  >
                    Epson Bluetooth
                  </button>
                  {!isPaid && (
                    <button
                      onClick={() => handleMarkAsPaid(order)}
                      className="w-full rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      Marcar pagado
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteOrder(order)}
                    className="w-full rounded bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    Eliminar pedido
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {sortedOrders.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No se encontraron órdenes con los filtros seleccionados</p>
        </div>
      )}

      {activePrintOrderId && activePrintSrc && (
        <iframe
          title="auto-print-delivery-ticket"
          src={activePrintSrc}
          className="hidden"
        />
      )}
    </div>
  )
}
