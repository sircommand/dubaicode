import { connectDB } from '@/lib/db'
import { getSession } from '@/lib/auth'
import Image from '@/models/Image'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    await Image.findByIdAndDelete(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const image = await Image.findByIdAndUpdate(params.id, { $inc: { views: 1 } }, { new: true })

    return NextResponse.json(image)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 })
  }
}