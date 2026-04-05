import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Verifica la firma de Glovo usando HMAC-SHA256
 * Header: X-Glovo-Signature
 * Formato: sha256=<hex>
 */
function verifyGlovoSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature.replace('sha256=', '')),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    console.error('Error verifying Glovo signature:', error)
    return false
  }
}

/**
 * POST /api/webhooks/glovo
 * Recibe eventos de Glovo (órdenes, cambios de estado)
 */
export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.GLOVO_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('GLOVO_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    const signature = request.headers.get('X-Glovo-Signature')
    const glovoRequestId = request.headers.get('X-Glovo-Request-Id')

    if (!signature) {
      console.warn('Missing X-Glovo-Signature header')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      )
    }

    const body = await request.text()

    if (!verifyGlovoSignature(body, signature, webhookSecret)) {
      console.warn('Invalid Glovo signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)

    console.log(`Received Glovo webhook: ${event.type}`, {
      eventType: event.type,
      requestId: glovoRequestId,
      timestamp: new Date().toISOString()
    })

    // Importar función server action de manera dinámica
    const { processGlovoWebhook } = await import('@/actions/glovo')

    await processGlovoWebhook(event, signature)

    return NextResponse.json(
      {
        success: true,
        event_type: event.type,
        request_id: glovoRequestId
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing Glovo webhook:', error)

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
 * GET /api/webhooks/glovo
 * Health check
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      status: 'active',
      service: 'Glovo Webhook',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  )
}
