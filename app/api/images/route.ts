import { connectDB } from '@/lib/db'
import { getSession } from '@/lib/auth'
import Image from '@/models/Image'
import { generateImageCode } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const categoryId = request.nextUrl.searchParams.get('categoryId')
    const subcategoryId = request.nextUrl.searchParams.get('subcategoryId')

    const query: any = {}
    if (categoryId) query.categoryId = categoryId
    if (subcategoryId) query.subcategoryId = subcategoryId

    const images = await Image.find(query).sort({ createdAt: -1 })

    return NextResponse.json(images)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const categoryId = formData.get('categoryId') as string
    const subcategoryId = formData.get('subcategoryId') as string
    const price = formData.get('price') as string

    if (!file || !title || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // برای Vercel: آپلود به Cloudinary
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!)

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    )

    if (!uploadResponse.ok) {
      throw new Error('Upload failed')
    }

    const uploadData = await uploadResponse.json()
    const imageUrl = uploadData.secure_url

    const image = new Image({
      title,
      url: imageUrl,
      categoryId,
      subcategoryId: subcategoryId || undefined,
      price: price ? parseFloat(price) : undefined,
      code: generateImageCode(),
    })

    await image.save()

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Upload image error:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}