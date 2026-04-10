'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { menuItems } from '@/features/menu/data/menu'

const MENU_CATEGORY_TO_DB_SLUG: Record<string, string> = {
  burguers: 'smash-singles',
  entrantres: 'extras',
  frankfurts: 'extras',
  cervezas: 'bebidas',
  bebidas: 'bebidas',
  postres: 'extras'
}

async function ensureMenuBackedProducts(productIds: string[]) {
  if (productIds.length === 0) return

  const currentCategories = await prisma.productCategory.findMany({
    select: { id: true, slug: true, name: true }
  })
  const categoryBySlug = new Map(currentCategories.map((c) => [c.slug, c]))

  for (const productId of productIds) {
    const menuItem = menuItems.find((item) => item.id === productId)
    if (!menuItem) continue

    const desiredCategorySlug = MENU_CATEGORY_TO_DB_SLUG[menuItem.category] || 'extras'
    let category = categoryBySlug.get(desiredCategorySlug)

    if (!category) {
      category = await prisma.productCategory.create({
        data: {
          name: desiredCategorySlug === 'bebidas' ? 'Bebidas' : 'Extras',
          slug: desiredCategorySlug,
          description: `Categoria auto-creada para ${menuItem.category}`,
          channel: 'RESTAURANT'
        },
        select: { id: true, slug: true, name: true }
      })
      categoryBySlug.set(category.slug, category)
    }

    await prisma.product.upsert({
      where: { slug: menuItem.id },
      update: {
        name: menuItem.name,
        description: menuItem.description,
        price: Math.round(menuItem.price * 100),
        categoryId: category.id,
        // Recupera stock por defecto si estaba agotado para evitar bloqueos en web.
        stock: { increment: 100 }
      },
      create: {
        id: menuItem.id,
        slug: menuItem.id,
        name: menuItem.name,
        description: menuItem.description,
        price: Math.round(menuItem.price * 100),
        unit: 'unidad',
        stock: 100,
        categoryId: category.id,
        isFeatured: !!menuItem.featured
      }
    })
  }
}

export interface CreateOrderData {
  customerName: string
 customerEmail?: string
  customerPhone: string
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
  }>
  totalAmount: number
  notes?: string
  deliveryMethod?: string
  paymentMethod?: 'STRIPE' | 'LOCAL'
}

export type CreateOrderResult =
  | {
      success: true
      order: {
        id: string
      }
    }
  | {
      success: false
      error: string
    }

/**
 * Crea una nueva orden en la base de datos
 */
export async function createOrder(data: CreateOrderData): Promise<CreateOrderResult> {
  try {
    if (!data.customerName || !data.customerPhone) {
      return {
        success: false,
        error: 'Faltan datos del cliente'
      }
    }

    if (data.paymentMethod && !['STRIPE', 'LOCAL'].includes(data.paymentMethod)) {
      return {
        success: false,
        error: 'Metodo de pago no valido'
      }
    }

    if (!data.items || data.items.length === 0) {
      return {
        success: false,
        error: 'El pedido no tiene productos'
      }
    }

    // Validar que los productos existan (id o slug) para soportar seeds antiguos
    const requestedProductIds = Array.from(new Set(data.items.map((item) => item.productId)))
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { id: { in: requestedProductIds } },
          { slug: { in: requestedProductIds } },
        ],
      },
    })

    const productLookup = new Map<string, (typeof products)[number]>()
    for (const product of products) {
      productLookup.set(product.id, product)
      productLookup.set(product.slug, product)
    }

    let missingProducts = requestedProductIds.filter((id) => !productLookup.has(id))
    if (missingProducts.length > 0) {
      await ensureMenuBackedProducts(missingProducts)

      const recoveredProducts = await prisma.product.findMany({
        where: {
          OR: [{ id: { in: missingProducts } }, { slug: { in: missingProducts } }]
        }
      })

      for (const product of recoveredProducts) {
        productLookup.set(product.id, product)
        productLookup.set(product.slug, product)
      }

      missingProducts = requestedProductIds.filter((id) => !productLookup.has(id))
    }

    if (missingProducts.length > 0) {
      return {
        success: false,
        error: 'Uno o mas productos no estan disponibles ahora'
      }
    }

    const toMinorUnits = (value: number) => Math.round(value * 100)

    const normalizedItems = data.items.map((item) => {
      const product = productLookup.get(item.productId)
      if (!product) {
        throw new Error('One or more products not found')
      }

      const unitPrice = product.price
      return {
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        subtotal: unitPrice * item.quantity
      }
    })

    // Crear la orden
    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
         customerEmail: data.customerEmail || '',
        customerPhone: data.customerPhone,
        totalAmount: toMinorUnits(data.totalAmount),
        deliveryMethod: data.deliveryMethod || 'Retiro en local',
        notes: data.notes,
        status: 'PENDING',
        paymentStatus: 'PENDING', // Pendiente de pago
        paymentMethod: data.paymentMethod || 'STRIPE',
        items: {
          create: normalizedItems
        }
      },
      include: { items: true }
    })

    for (const item of normalizedItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    revalidatePath('/pedidos')
    return {
      success: true,
      order: {
        id: order.id
      }
    }
  } catch (error) {
    console.error('Error creating order:', error)
    return {
      success: false,
      error: 'No se pudo crear el pedido. Intentalo de nuevo en unos segundos.'
    }
  }
}

/**
 * Obtiene una orden por ID
 */
export async function getOrder(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true }
        }
      }
    })

    if (!order) {
      throw new Error('Order not found')
    }

    return order
  } catch (error) {
    console.error('Error fetching order:', error)
    throw error
  }
}

/**
 * Obtiene todas las órdenes (para admin)
 */
export async function getAllOrders(filter?: {
  status?: string
  paymentStatus?: string
}) {
  try {
    const where: any = {}
    if (filter?.status) where.status = filter.status
    if (filter?.paymentStatus) where.paymentStatus = filter.paymentStatus

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: { include: { product: true } },
        invoice: { select: { id: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return orders
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

/**
 * Actualiza el estado de una orden
 */
export async function updateOrderStatus(
  orderId: string,
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELED'
) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })

    revalidatePath('/pedidos')
    return order
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}

/**
 * Confirma una orden con pago en efectivo
 */
export async function confirmCashOrder(orderId: string): Promise<CreateOrderResult> {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentMethod: 'LOCAL',
        paymentStatus: 'PENDING',
        status: 'CONFIRMED'
      }
    })

    revalidatePath('/pedidos')
    return {
      success: true,
      order: {
        id: order.id
      }
    }
  } catch (error) {
    console.error('Error confirming cash order:', error)
    return {
      success: false,
      error: 'No se pudo confirmar el pago en efectivo. Intentalo de nuevo.'
    }
  }
}

export interface CreateCounterOrderData {
  customerName: string
  customerPhone: string
  customerEmail?: string
  notes?: string
  paymentMethod: 'DATAPHONE' | 'CASH'
  items: Array<{
    productId: string
    quantity: number
  }>
  totalAmount: number
}

export async function createCounterOrder(data: CreateCounterOrderData): Promise<CreateOrderResult> {
  try {
    if (!data.customerName || !data.customerPhone) {
      return {
        success: false,
        error: 'Faltan datos del cliente'
      }
    }

    if (!data.items || data.items.length === 0) {
      return {
        success: false,
        error: 'El pedido no tiene productos'
      }
    }

    const requestedProductIds = Array.from(new Set(data.items.map((item) => item.productId)))
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { id: { in: requestedProductIds } },
          { slug: { in: requestedProductIds } },
        ],
      },
    })

    const productLookup = new Map<string, (typeof products)[number]>()
    for (const product of products) {
      productLookup.set(product.id, product)
      productLookup.set(product.slug, product)
    }

    let missingProducts = requestedProductIds.filter((id) => !productLookup.has(id))
    if (missingProducts.length > 0) {
      await ensureMenuBackedProducts(missingProducts)

      const recoveredProducts = await prisma.product.findMany({
        where: {
          OR: [{ id: { in: missingProducts } }, { slug: { in: missingProducts } }]
        }
      })

      for (const product of recoveredProducts) {
        productLookup.set(product.id, product)
        productLookup.set(product.slug, product)
      }

      missingProducts = requestedProductIds.filter((id) => !productLookup.has(id))
    }

    if (missingProducts.length > 0) {
      return {
        success: false,
        error: 'Uno o mas productos no estan disponibles ahora'
      }
    }

    const normalizedItems = data.items.map((item) => {
      const product = productLookup.get(item.productId)
      if (!product) {
        throw new Error('One or more products not found')
      }

      const unitPrice = product.price
      return {
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        subtotal: unitPrice * item.quantity
      }
    })

    const notes = data.notes?.trim()
    const counterNotes = notes ? `[COMANDERO] ${notes}` : '[COMANDERO] Pedido creado en el local'

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          customerName: data.customerName,
          customerEmail: data.customerEmail || '',
          customerPhone: data.customerPhone,
          totalAmount: Math.round(data.totalAmount * 100),
          deliveryMethod: 'Retiro en local',
          notes: counterNotes,
          status: 'CONFIRMED',
          paymentStatus: 'COMPLETED',
          paymentMethod: data.paymentMethod,
          items: {
            create: normalizedItems
          }
        }
      })

      for (const item of normalizedItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      }

      return createdOrder
    })

    revalidatePath('/admin')
    revalidatePath('/pedidos')

    return {
      success: true,
      order: {
        id: order.id
      }
    }
  } catch (error) {
    console.error('Error creating counter order:', error)
    return {
      success: false,
      error: 'No se pudo crear el pedido desde comandero. Intentalo de nuevo.'
    }
  }
}

export async function deleteOrderByAdmin(orderId: string) {
  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          items: true,
          invoice: { select: { id: true } }
        }
      })

      if (!order) {
        throw new Error('Orden no encontrada')
      }

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        })
      }

      if (order.invoice?.id) {
        await tx.invoice.delete({
          where: { id: order.invoice.id }
        })
      }

      await tx.order.delete({
        where: { id: orderId }
      })
    })

    revalidatePath('/admin')
    revalidatePath('/pedidos')
    return { success: true }
  } catch (error) {
    console.error('Error deleting order:', error)
    throw error
  }
}
