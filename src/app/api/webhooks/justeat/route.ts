import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function verifyJustEatSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedHex = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    const normalized = signature.replace('sha256=', '')

    if (normalized.length !== expectedHex.length) return false

    return crypto.timingSafeEqual(Buffer.from(normalized), Buffer.from(expectedHex))
  } catch (error) {
    console.error('Error verifying Just Eat signature:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.JUSTEAT_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('JUSTEAT_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    const signature =
      request.headers.get('X-JustEat-Signature') ||
      request.headers.get('x-justeat-signature') ||
      ''

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
    }

    const body = await request.text()

    if (!verifyJustEatSignature(body, signature, webhookSecret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)

    const { processJustEatWebhook } = await import('@/actions/justeat')
    await processJustEatWebhook(event, signature)

    return NextResponse.json(
      {
        success: true,
        event_type: event?.event_type ?? event?.type,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing Just Eat webhook:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      status: 'active',
      service: 'Just Eat Webhook',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  )
}