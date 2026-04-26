import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { categories as fallbackCategories, menuItems as fallbackItems, type MenuCategory } from '@/features/menu/data/menu'

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

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

    const fallbackKeys = new Set(fallbackItems.map((item) => item.id))
    const fallbackNames = new Set(fallbackItems.map((item) => normalizeName(item.name)))
    const extraProducts = products
      .filter((product) => {
        if (fallbackKeys.has(product.id) || fallbackKeys.has(product.slug)) {
          return false
        }

        // Evita mostrar variantes antiguas del mismo producto con slug distinto.
        return !fallbackNames.has(normalizeName(product.name))
      })
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

    return NextResponse.json({
      source: 'fallback-plus-extras',
      categories: fallbackCategories,
      items: [...fallbackItems, ...extraProducts]
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