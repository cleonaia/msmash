import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Verifica la firma de Deliveroo usando HMAC-SHA256
 * Header: X-Deliveroo-Signature
 * Formato: sha256=<hex>
 */
function verifyDeliverooSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('base64')

    return signature === expectedSignature
  } catch (error) {
    console.error('Error verifying Deliveroo signature:', error)
    return false
  }
}

/**
 * POST /api/webhooks/deliveroo
 * Recibe eventos de Deliveroo (órdenes, cambios de estado)
 */
export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.DELIVEROO_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('DELIVEROO_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    const signature = request.headers.get('X-Deliveroo-Signature')
    const deliverooRequestId = request.headers.get('X-Deliveroo-Request-Id')
    const timestamp = request.headers.get('X-Deliveroo-Timestamp')

    if (!signature) {
      console.warn('Missing X-Deliveroo-Signature header')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      )
    }

    const body = await request.text()

    // Deliveroo verifica: timestamp + body
    const signaturePayload = `${timestamp}${body}`

    if (!verifyDeliverooSignature(signaturePayload, signature, webhookSecret)) {
      console.warn('Invalid Deliveroo signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)

    console.log(`Received Deliveroo webhook: ${event.event_type}`, {
      eventType: event.event_type,
      requestId: deliverooRequestId,
      timestamp: new Date().toISOString()
    })

    // Importar función server action de manera dinámica
    const { processDeliverooWebhook } = await import('@/actions/deliveroo')

    await processDeliverooWebhook(event, signature)

    return NextResponse.json(
      {
        success: true,
        event_type: event.event_type,
        request_id: deliverooRequestId
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing Deliveroo webhook:', error)

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
 * GET /api/webhooks/deliveroo
 * Health check
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      status: 'active',
      service: 'Deliveroo Webhook',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  )
}
