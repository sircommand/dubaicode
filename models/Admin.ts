import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

interface IAdmin extends mongoose.Document {
  username: string
  password: string
  whatsapp?: string
  instagram?: string
  telegram?: string
  youtube?: string
  pinterest?: string
  createdAt: Date
  updatedAt: Date
  comparePassword(password: string): Promise<boolean>
}

const adminSchema = new mongoose.Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    whatsapp: { type: String, default: '' },
    instagram: { type: String, default: '' },
    telegram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    pinterest: { type: String, default: '' },
  },
  { timestamps: true }
)

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

adminSchema.methods.comparePassword = async function (password: string) {
  return bcryptjs.compare(password, this.password)
}

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema)