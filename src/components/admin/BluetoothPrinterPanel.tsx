'use client'

import { useEffect, useState } from 'react'
import {
  epsonBluetoothPrinter,
  getBluetoothSupportInfo,
  type EpsonPrinterConfig,
  type EpsonPrinterStatus,
} from '@/lib/epson-bluetooth-printer'

interface BluetoothPrinterPanelProps {
  title: string
  description: string
  testLabel?: string
  onTestPrint: () => Promise<void>
}

const STATUS_STYLE: Record<EpsonPrinterStatus, string> = {
  unsupported: 'bg-rose-50 text-rose-700',
  idle: 'bg-slate-100 text-slate-700',
  connecting: 'bg-amber-50 text-amber-700',
  connected: 'bg-emerald-50 text-emerald-700',
  error: 'bg-rose-50 text-rose-700',
}

const STATUS_LABEL: Record<EpsonPrinterStatus, string> = {
  unsupported: 'Navegador no compatible',
  idle: 'Desconectada',
  connecting: 'Conectando...',
  connected: 'Conectada',
  error: 'Error de conexion',
}

export function BluetoothPrinterPanel({ title, description, testLabel = 'Ticket de prueba', onTestPrint }: BluetoothPrinterPanelProps) {
  const supportInfo = getBluetoothSupportInfo()
  const [status, setStatus] = useState<EpsonPrinterStatus>(epsonBluetoothPrinter.getState().status)
  const [deviceName, setDeviceName] = useState<string | null>(epsonBluetoothPrinter.getState().deviceName)
  const [lastError, setLastError] = useState<string | null>(epsonBluetoothPrinter.getState().lastError)
  const [config, setConfig] = useState<EpsonPrinterConfig>(epsonBluetoothPrinter.getConfig())
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    return epsonBluetoothPrinter.subscribe((state) => {
      setStatus(state.status)
      setDeviceName(state.deviceName)
      setLastError(state.lastError)
      setConfig(state.config)
    })
  }, [])

  const patchConfig = (next: Partial<EpsonPrinterConfig>) => {
    epsonBluetoothPrinter.updateConfig(next)
  }

  const handleConnect = async () => {
    if (!supportInfo.supported) {
      const message = supportInfo.recommendation
        ? `${supportInfo.reason} ${supportInfo.recommendation}`
        : supportInfo.reason || 'No se pudo iniciar la conexion Bluetooth.'
      alert(message)
      return
    }

    try {
      setBusy(true)
      await epsonBluetoothPrinter.connect()
    } catch (error) {
      console.error('Error connecting Epson Bluetooth printer:', error)
      alert('No se pudo conectar la Epson Bluetooth')
    } finally {
      setBusy(false)
    }
  }

  const handleDisconnect = () => {
    epsonBluetoothPrinter.disconnect()
  }

  const handleTestPrint = async () => {
    try {
      setBusy(true)
      await onTestPrint()
    } catch (error) {
      console.error('Error printing Epson Bluetooth test:', error)
      alert('No se pudo imprimir el ticket de prueba')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-600">{description}</p>
          <div className="pt-1">
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}>
              {STATUS_LABEL[status]}
            </span>
            {deviceName ? <span className="ml-2 text-xs text-gray-600">{deviceName}</span> : null}
          </div>
          {lastError ? <p className="text-xs text-rose-600">{lastError}</p> : null}
          {!supportInfo.supported ? (
            <p className="text-xs text-amber-700">
              {supportInfo.reason} {supportInfo.recommendation}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {status !== 'connected' ? (
            <button
              onClick={handleConnect}
              disabled={busy || status === 'unsupported' || status === 'connecting'}
              className="min-h-[40px] rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
            >
              Conectar Epson
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              disabled={busy}
              className="min-h-[40px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Desconectar
            </button>
          )}

          <button
            onClick={handleTestPrint}
            disabled={busy || status !== 'connected'}
            className="min-h-[40px] rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
          >
            {testLabel}
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-1">
          <span className="block text-xs font-semibold text-gray-700">Ancho papel</span>
          <select
            value={config.paperWidth}
            onChange={(e) => patchConfig({ paperWidth: e.target.value === '58mm' ? '58mm' : '80mm' })}
            className="min-h-[40px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
          >
            <option value="58mm">58mm</option>
            <option value="80mm">80mm</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="block text-xs font-semibold text-gray-700">Intensidad</span>
          <select
            value={config.density}
            onChange={(e) => patchConfig({ density: e.target.value as EpsonPrinterConfig['density'] })}
            className="min-h-[40px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
          >
            <option value="normal">Normal</option>
            <option value="dark">Oscura</option>
            <option value="darker">Muy oscura</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="block text-xs font-semibold text-gray-700">Cabecera extra</span>
          <input
            type="text"
            maxLength={64}
            value={config.headerLine}
            onChange={(e) => patchConfig({ headerLine: e.target.value })}
            placeholder="Ej: TERRASSA"
            className="min-h-[40px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
          />
        </label>

        <label className="flex min-h-[40px] items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <input
            type="checkbox"
            checked={config.cutEnabled}
            onChange={(e) => patchConfig({ cutEnabled: e.target.checked })}
            className="h-4 w-4"
          />
          <span className="text-xs font-semibold text-gray-700">Corte automático</span>
        </label>
      </div>
    </div>
  )
}