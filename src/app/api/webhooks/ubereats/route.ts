import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Verifica la firma de Uber usando HMAC-SHA256
 * @param payload - Body raw del request
 * @param signature - Header X-Uber-Signature
 * @param secret - Webhook secret
 * @returns true si la firma es válida
 */
function verifyUberSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    // Comparación segura contra timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(`sha256=${expectedSignature}`)
    )
  } catch (error) {
    console.error('Error verifying Uber signature:', error)
    return false
  }
}

/**
 * POST /api/webhooks/ubereats
 * Recibe eventos de Uber (órdenes, cambios de estado)
 */
export async function POST(request: NextRequest) {
  try {
    // Obtener webhook secret de variables de entorno
    const webhookSecret = process.env.UBER_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('UBER_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    // Obtener headers de firma
    const signature = request.headers.get('X-Uber-Signature')
    const uberRequestId = request.headers.get('X-Uber-Request-Id')

    if (!signature) {
      console.warn('Missing X-Uber-Signature header')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      )
    }

    // Leer body raw para verificación
    const body = await request.text()

    // Verificar firma
    if (!verifyUberSignature(body, signature, webhookSecret)) {
      console.warn('Invalid Uber signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parsear evento
    const event = JSON.parse(body)

    // Registrar evento recibido
    console.log(`Received Uber webhook: ${event.event_type}`, {
      eventType: event.event_type,
      requestId: uberRequestId,
      timestamp: new Date().toISOString()
    })

    // Importar función server action de manera dinámica
    const { processUberWebhook } = await import('@/actions/uber')
    
    // Procesar evento
    await processUberWebhook(event, signature)

    // Responder con 200 OK (Uber espera confirmación rápida)
    return NextResponse.json(
      {
        success: true,
        event_type: event.event_type,
        request_id: uberRequestId
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing UberEats webhook:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/webhooks/ubereats
 * Health check para verificar que el webhook está activo
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      status: 'active',
      service: 'UberEats Webhook',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  )
}
