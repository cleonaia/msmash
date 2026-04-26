import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { categories as fallbackCategories, menuItems as fallbackItems, type MenuCategory } from '@/features/menu/data/menu'

function mapCategoryToMenu(categorySlug?: string | null, categoryName?: string | null): MenuCategory {
  const slug = String(categorySlug || '').toLowerCase()
  const name = String(categoryName || '').toLowerCase()

  if (slug.includes('smash') || slug.includes('burger') || name.includes('burger')) return 'burguers'
  if (slug.includes('frank') || name.includes('frank')) return 'frankfurts'
  if (slug.includes('cerveza') || name.includes('cerveza')) return 'cervezas'
  if (slug.includes('bebida') || name.includes('bebida')) return 'bebidas'
  if (slug.includes('postre') || name.includes('postre')) return 'postres'

  return 'entrantres'
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
          take: 1
        }
      },
      orderBy: [
        { category: { name: 'asc' } },
        { name: 'asc' }
      ]
    })

    const productByKey = new Map<string, (typeof products)[number]>()
    for (const product of products) {
      productByKey.set(product.id, product)
      productByKey.set(product.slug, product)
    }

    const mergedItems = fallbackItems.map((fallbackItem) => {
      const product = productByKey.get(fallbackItem.id)

      if (!product) {
        return fallbackItem
      }

      return {
        ...fallbackItem,
        id: product.slug || fallbackItem.id,
        name: product.name || fallbackItem.name,
        description: product.description || fallbackItem.description,
        price: Number((product.price / 100).toFixed(2)),
        category: mapCategoryToMenu(product.category?.slug, product.category?.name),
        image: product.images[0]?.url || fallbackItem.image,
        featured: product.isFeatured || fallbackItem.featured,
        badge: product.badges || fallbackItem.badge
      }
    })

    const fallbackKeys = new Set(fallbackItems.map((item) => item.id))
    const extraProducts = products
      .filter((product) => !fallbackKeys.has(product.id) && !fallbackKeys.has(product.slug))
      .map((product) => ({
        id: product.slug || product.id,
        name: product.name,
        description: product.description || '',
        price: Number((product.price / 100).toFixed(2)),
        category: mapCategoryToMenu(product.category?.slug, product.category?.name),
        image: product.images[0]?.url || '/images/products/placeholder.svg',
        allergens: [],
        featured: product.isFeatured,
        badge: product.badges || undefined
      }))

    const items = [...mergedItems, ...extraProducts]

    return NextResponse.json({
      source: 'merged',
      categories: fallbackCategories,
      items
    })
  } catch (error) {
    console.error('Error loading menu catalog:', error)
    return NextResponse.json({
      source: 'fallback',
      categories: fallbackCategories,
      items: fallbackItems
    })
  }
}