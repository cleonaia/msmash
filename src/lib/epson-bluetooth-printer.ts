export type EpsonPrinterStatus = 'unsupported' | 'idle' | 'connecting' | 'connected' | 'error'

export type EpsonPaperWidth = '58mm' | '80mm'
export type EpsonPrintDensity = 'normal' | 'dark' | 'darker'

export interface EpsonPrinterConfig {
  paperWidth: EpsonPaperWidth
  density: EpsonPrintDensity
  cutEnabled: boolean
  headerLine: string
}

export interface ReceiptItemLine {
  label: string
  quantity: number
  amount?: number | null
}

export interface ReceiptData {
  title: string
  subtitle?: string
  referenceLabel?: string
  referenceValue?: string
  dateLabel?: string
  dateValue?: string
  customerLines?: string[]
  itemLines?: ReceiptItemLine[]
  summaryLines?: string[]
  footerLines?: string[]
}

export interface BluetoothSupportInfo {
  supported: boolean
  reason: string | null
  recommendation: string | null
}

interface PrinterState {
  status: EpsonPrinterStatus
  deviceName: string | null
  lastError: string | null
  config: EpsonPrinterConfig
}

const textEncoder = new TextEncoder()
const ESC_INIT = Uint8Array.of(0x1b, 0x40)
const CUT_COMMAND = Uint8Array.of(0x1d, 0x56, 0x42, 0x00)
const BOLD_ON = Uint8Array.of(0x1b, 0x45, 0x01)
const BOLD_OFF = Uint8Array.of(0x1b, 0x45, 0x00)
const DOUBLE_STRIKE_ON = Uint8Array.of(0x1b, 0x47, 0x01)
const DOUBLE_STRIKE_OFF = Uint8Array.of(0x1b, 0x47, 0x00)

const CONFIG_STORAGE_KEY = 'epsonBluetoothPrinterConfig'

const DEFAULT_CONFIG: EpsonPrinterConfig = {
  paperWidth: '80mm',
  density: 'normal',
  cutEnabled: true,
  headerLine: '',
}

function getLineWidth(config: EpsonPrinterConfig) {
  return config.paperWidth === '58mm' ? 32 : 42
}

function getDensityPrefix(config: EpsonPrinterConfig) {
  if (config.density === 'dark') {
    return concatBytes(BOLD_ON)
  }

  if (config.density === 'darker') {
    return concatBytes(BOLD_ON, DOUBLE_STRIKE_ON)
  }

  return new Uint8Array(0)
}

function getDensitySuffix(config: EpsonPrinterConfig) {
  if (config.density === 'dark') {
    return concatBytes(BOLD_OFF)
  }

  if (config.density === 'darker') {
    return concatBytes(DOUBLE_STRIKE_OFF, BOLD_OFF)
  }

  return new Uint8Array(0)
}

function readStoredConfig(): EpsonPrinterConfig {
  if (typeof window === 'undefined') {
    return DEFAULT_CONFIG
  }

  try {
    const raw = window.localStorage.getItem(CONFIG_STORAGE_KEY)
    if (!raw) return DEFAULT_CONFIG

    const parsed = JSON.parse(raw) as Partial<EpsonPrinterConfig>
    return {
      paperWidth: parsed.paperWidth === '58mm' ? '58mm' : '80mm',
      density: parsed.density === 'dark' || parsed.density === 'darker' ? parsed.density : 'normal',
      cutEnabled: parsed.cutEnabled !== false,
      headerLine: typeof parsed.headerLine === 'string' ? parsed.headerLine : '',
    }
  } catch {
    return DEFAULT_CONFIG
  }
}

function storeConfig(config: EpsonPrinterConfig) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config))
}

function getInitialState(): PrinterState {
  const config = readStoredConfig()

  return {
    status: typeof navigator !== 'undefined' && 'bluetooth' in navigator ? 'idle' : 'unsupported',
    deviceName: null,
    lastError: null,
    config,
  }
}

function stripAccents(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function sanitizeForPrinter(value: string) {
  return stripAccents(value)
    .replace(/€/g, 'EUR')
    .replace(/[–—]/g, '-')
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '?')
}

function wrapLine(value: string, width: number) {
  const words = sanitizeForPrinter(value).split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    if (!current) {
      current = word
      continue
    }

    if ((current + ' ' + word).length <= width) {
      current += ` ${word}`
    } else {
      lines.push(current)
      current = word
    }
  }

  if (current) {
    lines.push(current)
  }

  return lines.length > 0 ? lines : ['']
}

function centerLine(value: string, width: number) {
  const text = sanitizeForPrinter(value)
  if (text.length >= width) return text
  const left = Math.floor((width - text.length) / 2)
  return `${' '.repeat(left)}${text}`
}

function moneyFromCents(cents: number) {
  return `${(cents / 100).toFixed(2)} EUR`
}

function paymentMethodLabel(method?: string | null) {
  const normalized = String(method || '').toUpperCase()

  if (normalized === 'STRIPE') return 'Tarjeta online'
  if (normalized === 'DATAPHONE' || normalized === 'TPV' || normalized === 'CARD_PRESENT') return 'Datáfono'
  if (normalized === 'CASH') return 'Efectivo'
  if (normalized === 'LOCAL') return 'Pago local'

  return normalized || 'Sin definir'
}

function buildReceiptLines(receipt: ReceiptData, config: EpsonPrinterConfig) {
  const lineWidth = getLineWidth(config)
  const lines: string[] = []

  lines.push(centerLine(receipt.title, lineWidth))
  if (config.headerLine.trim()) {
    lines.push(centerLine(config.headerLine.trim(), lineWidth))
  }
  if (receipt.subtitle) {
    lines.push(centerLine(receipt.subtitle, lineWidth))
  }

  lines.push('-'.repeat(lineWidth))

  if (receipt.referenceLabel && receipt.referenceValue) {
    lines.push(`${receipt.referenceLabel}: ${receipt.referenceValue}`)
  }

  if (receipt.dateLabel && receipt.dateValue) {
    lines.push(`${receipt.dateLabel}: ${receipt.dateValue}`)
  }

  lines.push('-'.repeat(lineWidth))

  if (receipt.customerLines?.length) {
    lines.push('CLIENTE')
    for (const line of receipt.customerLines) {
      lines.push(...wrapLine(line, lineWidth))
    }
    lines.push('-'.repeat(lineWidth))
  }

  if (receipt.itemLines?.length) {
    lines.push('ARTICULOS')
    for (const item of receipt.itemLines) {
      lines.push(...wrapLine(`${item.quantity}x ${item.label}`, lineWidth))
      if (typeof item.amount === 'number') {
        lines.push(`  ${moneyFromCents(item.amount)}`)
      }
    }
    lines.push('-'.repeat(lineWidth))
  }

  if (receipt.summaryLines?.length) {
    for (const line of receipt.summaryLines) {
      lines.push(...wrapLine(line, lineWidth))
    }
    lines.push('-'.repeat(lineWidth))
  }

  if (receipt.footerLines?.length) {
    for (const line of receipt.footerLines) {
      lines.push(...wrapLine(line, lineWidth))
    }
  }

  return lines.join('\n')
}

function concatBytes(...chunks: Uint8Array[]) {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
  const output = new Uint8Array(totalLength)
  let offset = 0

  for (const chunk of chunks) {
    output.set(chunk, offset)
    offset += chunk.length
  }

  return output
}

type BluetoothRemoteGATTCharacteristicLike = {
  properties: {
    write?: boolean
    writeWithoutResponse?: boolean
  }
  writeValue(data: Uint8Array): Promise<void>
  writeValueWithoutResponse?(data: Uint8Array): Promise<void>
}

type BluetoothRemoteGATTServiceLike = {
  getCharacteristics(): Promise<BluetoothRemoteGATTCharacteristicLike[]>
}

type BluetoothRemoteGATTServerLike = {
  getPrimaryServices(): Promise<BluetoothRemoteGATTServiceLike[]>
  connect(): Promise<BluetoothRemoteGATTServerLike>
  disconnect(): void
}

type BluetoothDeviceLike = {
  name?: string | null
  gatt?: BluetoothRemoteGATTServerLike | null
  addEventListener(event: string, handler: () => void): void
  removeEventListener(event: string, handler: () => void): void
}

type BluetoothAdapterLike = {
  requestDevice(options: {
    acceptAllDevices?: boolean
    filters?: Array<{ name?: string; namePrefix?: string; services?: Array<string | number> }>
    optionalServices?: Array<string | number>
  }): Promise<BluetoothDeviceLike>
}

const EPSON_SERVICE_UUIDS: Array<string | number> = [
  0x18f0,
  0x1812,
  0xff00,
  0xffe0,
  0xfff0,
  '49535343-fe7d-4ae5-8fa9-9fafd205e455',
  '0000ff00-0000-1000-8000-00805f9b34fb',
  '0000ffe0-0000-1000-8000-00805f9b34fb',
  '0000fff0-0000-1000-8000-00805f9b34fb',
  'generic_access',
  'device_information',
]

function detectBrowserSupport(): BluetoothSupportInfo {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      supported: false,
      reason: 'No se detecta entorno de navegador.',
      recommendation: null,
    }
  }

  if (!window.isSecureContext) {
    return {
      supported: false,
      reason: 'La conexion Bluetooth requiere HTTPS.',
      recommendation: 'Abre el panel desde https:// o desde localhost en local.',
    }
  }

  if (!('bluetooth' in navigator)) {
    return {
      supported: false,
      reason: 'Este navegador no soporta Web Bluetooth.',
      recommendation: 'Usa Google Chrome o Microsoft Edge en escritorio para conectar la Epson por Bluetooth.',
    }
  }

  return {
    supported: true,
    reason: null,
    recommendation: null,
  }
}

export function getBluetoothSupportInfo() {
  return detectBrowserSupport()
}

async function findWritableCharacteristic(server: BluetoothRemoteGATTServerLike) {
  const services = await server.getPrimaryServices()

  for (const service of services) {
    const characteristics = await service.getCharacteristics()

    for (const characteristic of characteristics) {
      const { write, writeWithoutResponse } = characteristic.properties
      if (write || writeWithoutResponse) {
        return characteristic
      }
    }
  }

  return null
}

class EpsonBluetoothPrinter {
  private listeners = new Set<(state: PrinterState) => void>()
  private state: PrinterState = getInitialState()
  private device: BluetoothDeviceLike | null = null
  private characteristic: BluetoothRemoteGATTCharacteristicLike | null = null

  subscribe(listener: (state: PrinterState) => void) {
    this.listeners.add(listener)
    listener(this.state)

    return () => {
      this.listeners.delete(listener)
    }
  }

  getState() {
    return this.state
  }

  getConfig() {
    return this.state.config
  }

  updateConfig(next: Partial<EpsonPrinterConfig>) {
    const config: EpsonPrinterConfig = {
      ...this.state.config,
      ...next,
      headerLine: typeof next.headerLine === 'string' ? next.headerLine.slice(0, 64) : this.state.config.headerLine,
    }

    storeConfig(config)
    this.setState({ config })
  }

  private setState(next: Partial<PrinterState>) {
    this.state = { ...this.state, ...next }
    this.listeners.forEach((listener) => {
      listener(this.state)
    })
  }

  private resetConnectionState(status: EpsonPrinterStatus, lastError: string | null = null) {
    this.characteristic = null
    this.setState({
      status,
      deviceName: this.device?.name || null,
      lastError,
    })
  }

  private handleDisconnected = () => {
    this.characteristic = null
    this.setState({
      status: 'idle',
      lastError: null,
    })
  }

  async connect() {
    const support = detectBrowserSupport()

    if (!support.supported) {
      const lastError = support.recommendation ? `${support.reason} ${support.recommendation}` : support.reason
      this.setState({ status: 'unsupported', lastError })
      throw new Error(lastError || 'No se pudo iniciar la conexion Bluetooth.')
    }

    this.setState({ status: 'connecting', lastError: null })

    try {
      const bluetooth = (navigator as Navigator & { bluetooth: BluetoothAdapterLike }).bluetooth
      const device = await bluetooth.requestDevice({
        filters: [{ namePrefix: 'TM' }, { namePrefix: 'Epson' }, { namePrefix: 'EPSON' }],
        optionalServices: EPSON_SERVICE_UUIDS,
      })

      this.device = device
      device.removeEventListener('gattserverdisconnected', this.handleDisconnected)
      device.addEventListener('gattserverdisconnected', this.handleDisconnected)

      const server = await device.gatt?.connect()

      if (!server) {
        throw new Error('No se pudo abrir la conexion Bluetooth del dispositivo seleccionado.')
      }

      const characteristic = await findWritableCharacteristic(server)

      if (!characteristic) {
        throw new Error('No se encontro una caracteristica de escritura BLE compatible.')
      }

      this.characteristic = characteristic
      this.setState({
        status: 'connected',
        deviceName: device.name || 'Impresora Bluetooth',
        lastError: null,
      })
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === 'NotFoundError'
          ? 'No se selecciono ningun dispositivo Bluetooth.'
          : error instanceof Error
            ? error.message
            : 'No se pudo conectar a la impresora Bluetooth.'
      this.device = null
      this.resetConnectionState('error', message)
      throw error
    }
  }

  disconnect() {
    try {
      this.device?.gatt?.disconnect()
    } finally {
      this.device = null
      this.characteristic = null
      this.setState({
        status: typeof navigator !== 'undefined' && 'bluetooth' in navigator ? 'idle' : 'unsupported',
        deviceName: null,
        lastError: null,
      })
    }
  }

  async printReceipt(receipt: ReceiptData) {
    if (!this.characteristic) {
      throw new Error('Conecta primero la impresora Epson Bluetooth.')
    }

    const config = this.state.config
    const text = buildReceiptLines(receipt, config)
    const encoded = textEncoder.encode(`${text}\n\n\n`)
    const densityPrefix = getDensityPrefix(config)
    const densitySuffix = getDensitySuffix(config)
    const cut = config.cutEnabled ? CUT_COMMAND : new Uint8Array(0)
    const payload = concatBytes(ESC_INIT, densityPrefix, encoded, densitySuffix, cut)

    const chunkSize = 180
    for (let index = 0; index < payload.length; index += chunkSize) {
      const chunk = payload.slice(index, index + chunkSize)
      if (this.characteristic.properties.writeWithoutResponse) {
        await this.characteristic.writeValueWithoutResponse?.(chunk)
      } else {
        await this.characteristic.writeValue(chunk)
      }
    }
  }
}

export const epsonBluetoothPrinter = new EpsonBluetoothPrinter()

export function formatOrderReceipt(order: {
  id: string
  createdAt: Date | string
  customerName: string
  customerPhone?: string | null
  paymentStatus: string
  paymentMethod: string
  status: string
  totalAmount: number
  discountAmount?: number | null
  items: Array<{ quantity: number; product?: { name?: string | null } }>
}) {
  return {
    title: 'The M Smash Lab',
    subtitle: 'TICKET TPV',
    referenceLabel: 'Pedido',
    referenceValue: `#${order.id.slice(-8)}`,
    dateLabel: 'Fecha',
    dateValue: new Date(order.createdAt).toLocaleString('es-ES'),
    customerLines: [
      `Cliente: ${order.customerName}`,
      `Telefono: ${order.customerPhone || '-'}`,
      `Pago: ${order.paymentStatus} (${paymentMethodLabel(order.paymentMethod)})`,
      `Estado: ${order.status}`,
    ],
    itemLines: order.items.map((item) => ({
      label: item.product?.name || 'Producto',
      quantity: item.quantity,
    })),
    summaryLines: [
      ...(order.discountAmount && order.discountAmount > 0 ? [`DESCUENTO: -${moneyFromCents(order.discountAmount)}`] : []),
      `TOTAL: ${moneyFromCents(order.totalAmount)}`,
    ],
    footerLines: ['Gracias por tu compra', 'www.msmashburger.page'],
  } satisfies ReceiptData
}

export function formatInvoiceReceipt(invoice: {
  invoiceNumber: string
  createdAt: Date | string
  customerName: string
  customerEmail?: string | null
  customerPhone?: string | null
  customerTaxId?: string | null
  subtotal: number
  taxAmount: number
  totalAmount: number
  discountAmount?: number | null
  items: Array<{ description: string; quantity: number; subtotal: number }>
}) {
  return {
    title: 'The M Smash Lab',
    subtitle: 'FACTURA',
    referenceLabel: 'Factura',
    referenceValue: invoice.invoiceNumber,
    dateLabel: 'Fecha',
    dateValue: new Date(invoice.createdAt).toLocaleString('es-ES'),
    customerLines: [
      `Cliente: ${invoice.customerName}`,
      `Email: ${invoice.customerEmail || '-'}`,
      `Telefono: ${invoice.customerPhone || '-'}`,
      `NIF/CIF: ${invoice.customerTaxId || '-'}`,
    ],
    itemLines: invoice.items.map((item) => ({
      label: item.description || 'Producto',
      quantity: item.quantity,
      amount: item.subtotal,
    })),
    summaryLines: [
      `Base: ${moneyFromCents(invoice.subtotal)}`,
      `IVA: ${moneyFromCents(invoice.taxAmount)}`,
      ...(invoice.discountAmount && invoice.discountAmount > 0 ? [`DESCUENTO: -${moneyFromCents(invoice.discountAmount)}`] : []),
      `TOTAL: ${moneyFromCents(invoice.totalAmount)}`,
      'Datos bancarios',
      'Titular: Pablo Edelmer Marin Sierra',
      'IBAN: ES65 2100 0087 6902 0210 0294',
      'BIC/SWIFT: CAIXESBBXXX',
    ],
    footerLines: ['Factura generada desde The M Smash Lab'],
  } satisfies ReceiptData
}