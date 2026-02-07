import { connectDB } from '@/lib/db'
import { getSession } from '@/lib/auth'
import Image from '@/models/Image'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const monthAgo = new Date(today)
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    const totalImages = await Image.countDocuments()

    const todayViews = await Image.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$views' } } },
    ])

    const yesterdayViews = await Image.aggregate([
      {
        $match: {
          createdAt: { $gte: yesterday, $lt: today },
        },
      },
      { $group: { _id: null, total: { $sum: '$views' } } },
    ])

    const weekViews = await Image.aggregate([
      { $match: { createdAt: { $gte: weekAgo } } },
      { $group: { _id: null, total: { $sum: '$views' } } },
    ])

    const monthViews = await Image.aggregate([
      { $match: { createdAt: { $gte: monthAgo } } },
      { $group: { _id: null, total: { $sum: '$views' } } },
    ])

    const stats = {
      totalImages,
      todayViews: todayViews[0]?.total || 0,
      yesterdayViews: yesterdayViews[0]?.total || 0,
      weekViews: weekViews[0]?.total || 0,
      monthViews: monthViews[0]?.total || 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
  }
}