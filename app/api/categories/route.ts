import { connectDB } from '@/lib/db'
import { getSession } from '@/lib/auth'
import Category from '@/models/Category'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const parentId = request.nextUrl.searchParams.get('parentId')

    const query = parentId ? { parentId: parentId === 'root' ? null : parentId } : { parentId: null }
    const categories = await Category.find(query).sort({ createdAt: -1 })

    const categoriesWithSubCount = await Promise.all(
      categories.map(async (cat: any) => {
        const subCount = await Category.countDocuments({ parentId: cat._id })
        return {
          ...cat.toObject(),
          subCategoryCount: subCount,
        }
      })
    )

    return NextResponse.json(categoriesWithSubCount)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { name, icon, parentId } = await request.json()

    if (!name || !icon) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const category = new Category({
      name,
      icon,
      parentId: parentId && parentId !== 'root' ? parentId : null,
    })

    await category.save()

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}