import mongoose from 'mongoose'

interface ICategory extends mongoose.Document {
  name: string
  icon: string
  parentId?: string | null
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { timestamps: true }
)

export default mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema)