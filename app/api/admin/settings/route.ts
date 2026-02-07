import { connectDB } from '@/lib/db'
import { getSession } from '@/lib/auth'
import Admin from '@/models/Admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const admin = await Admin.findById(session.id).select('-password')

    return NextResponse.json(admin)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const data = await request.json()
    const { password, ...updateData } = data

    const admin = await Admin.findByIdAndUpdate(session.id, updateData, { new: true }).select(
      '-password'
    )

    return NextResponse.json(admin)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { oldPassword, newPassword } = await request.json()

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const admin = await Admin.findById(session.id)

    const isPasswordValid = await admin.comparePassword(oldPassword)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid current password' }, { status: 401 })
    }

    admin.password = newPassword
    await admin.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
  }
}