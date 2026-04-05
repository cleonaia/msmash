import { NextRequest, NextResponse } from 'next/server'
import {
  getRevenueKPIs,
  getOrdersByChannel,
  getTopProducts,
  getRevenueTrend,
  getConversionMetrics,
  getOrdersByStatus,
  getPaymentMethodStats,
  trackEvent
} from '@/actions/analytics'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * GET /api/analytics/dashboard
 * Obtiene todos los KPIs para el dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const metric = searchParams.get('metric') // Specific metric (kpis, channel, products, trend, conversion, status, payment)
    const days = searchParams.get('days') // For trend (default: 7)

    // Si se especifica una métrica, obtenerla solamente
    if (metric) {
      switch (metric) {
        case 'kpis':
          const kpis = await getRevenueKPIs()
          return NextResponse.json({ data: kpis }, { status: 200 })

        case 'channel':
          const channels = await getOrdersByChannel()
          return NextResponse.json({ data: channels }, { status: 200 })

        case 'products':
          const products = await getTopProducts()
          return NextResponse.json({ data: products }, { status: 200 })

        case 'trend':
          const trendDays = days ? parseInt(days) : 7
          const trend = await getRevenueTrend(trendDays)
          return NextResponse.json({ data: trend }, { status: 200 })

        case 'conversion':
          const conversion = await getConversionMetrics()
          return NextResponse.json({ data: conversion }, { status: 200 })

        case 'status':
          const status = await getOrdersByStatus()
          return NextResponse.json({ data: status }, { status: 200 })

        case 'payment':
          const payment = await getPaymentMethodStats()
          return NextResponse.json({ data: payment }, { status: 200 })

        default:
          return NextResponse.json(
            { error: 'Unknown metric' },
            { status: 400 }
          )
      }
    }

    // Si no especifica métrica, obtener todas
    const [kpis, channels, products, trend, conversion, statusData, payment] = await Promise.all([
      getRevenueKPIs(),
      getOrdersByChannel(),
      getTopProducts(),
      getRevenueTrend(7),
      getConversionMetrics(),
      getOrdersByStatus(),
      getPaymentMethodStats()
    ])

    return NextResponse.json(
      {
        dashboard: {
          kpis,
          channels,
          topProducts: products,
          revenueTrend: trend,
          conversion,
          orderStatus: statusData,
          paymentMethods: payment
        },
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/analytics/dashboard
 * Registra eventos de usuario (página vista, checkout, etc)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, userId, orderId, name } = body

    if (!type) {
      return NextResponse.json(
        { error: 'Missing event type' },
        { status: 400 }
      )
    }

    // Registrar evento (no-blocking)
    trackEvent(type, {
      userId,
      orderId,
      metadata: { eventName: name }
    }).catch((err) => {
      console.error('Error tracking event:', err)
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Event tracked',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error tracking analytics event:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}
