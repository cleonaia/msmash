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
      lines.push(...wrapLine(line))
    }
    lines.push('-'.repeat(lineWidth))
  }

  if (receipt.itemLines?.length) {
    lines.push('ARTICULOS')
    for (const item of receipt.itemLines) {
      lines.push(...wrapLine(`${item.quantity}x ${item.label}`))
      if (typeof item.amount === 'number') {
        lines.push(`  ${moneyFromCents(item.amount)}`)
      }
    }
    lines.push('-'.repeat(lineWidth))
  }

  if (receipt.summaryLines?.length) {
    for (const line of receipt.summaryLines) {
      lines.push(...wrapLine(line))
    }
    lines.push('-'.repeat(lineWidth))
  }

  if (receipt.footerLines?.length) {
    for (const line of receipt.footerLines) {
      lines.push(...wrapLine(line))
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

async function findWritableCharacteristic(server: BluetoothRemoteGATTServer) {
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
  private device: BluetoothDevice | null = null
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null

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
    for (const listener of this.listeners) {
      listener(this.state)
    }
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
    if (typeof navigator === 'undefined' || !('bluetooth' in navigator)) {
      this.setState({ status: 'unsupported', lastError: 'Este navegador no soporta Web Bluetooth.' })
      throw new Error('Este navegador no soporta Web Bluetooth')
    }

    this.setState({ status: 'connecting', lastError: null })

    try {
      const bluetooth = navigator.bluetooth as Bluetooth
      const device = await bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['generic_access', 'device_information'],
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
      const message = error instanceof Error ? error.message : 'No se pudo conectar a la impresora Bluetooth.'
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
        await this.characteristic.writeValueWithoutResponse(chunk)
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
  items: Array<{ quantity: number; product?: { name?: string | null } }>
}) {
  return {
    title: 'M SMASH BURGER',
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
    summaryLines: [`TOTAL: ${moneyFromCents(order.totalAmount)}`],
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
  items: Array<{ description: string; quantity: number; subtotal: number }>
}) {
  return {
    title: 'M SMASH BURGER',
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
      `TOTAL: ${moneyFromCents(invoice.totalAmount)}`,
      'Datos bancarios',
      'Titular: Pablo Edelmer Marin Sierra',
      'IBAN: ES65 2100 0087 6902 0210 0294',
      'BIC/SWIFT: CAIXESBBXXX',
    ],
    footerLines: ['Factura generada desde M SMASH'],
  } satisfies ReceiptData
}