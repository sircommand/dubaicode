'use client'

import { useState, useRef } from 'react'
import toast from 'react-hot-toast'

interface CategoryFormProps {
  onSubmit: (data: { name: string; icon: string; parentId?: string }) => Promise<void>
  parentId: string | null
  categories: Array<{ _id: string; name: string }>
}

export default function CategoryForm({ onSubmit, parentId, categories }: CategoryFormProps) {
  const [name, setName] = useState('')
  const [selectedParent, setSelectedParent] = useState(parentId || 'root')
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!['image/svg+xml', 'image/png'].includes(file.type)) {
        toast.error('Only SVG and PNG files are allowed')
        return
      }
      if (file.size > 1024 * 1024) {
        toast.error('File size must be less than 1MB')
        return
      }
      setIconFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !iconFile) {
      toast.error('Please fill all fields')
      return
    }

    setIsLoading(true)

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64 = event.target?.result as string
        await onSubmit({
          name,
          icon: base64,
          parentId: selectedParent !== 'root' ? selectedParent : undefined,
        })

        setName('')
        setIconFile(null)
        setSelectedParent('root')
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
      reader.readAsDataURL(iconFile)
    } catch (error) {
      toast.error('Failed to create category')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card p-6 rounded-2xl sticky top-24 h-fit">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <span className="material-icons-outlined text-primary">add_circle_outline</span>
        Create New Category
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Streetwear"
            disabled={isLoading}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Parent Category</label>
          <select
            value={selectedParent}
            onChange={(e) => setSelectedParent(e.target.value)}
            disabled={isLoading}
            className="input-field"
          >
            <option value="root">Root (None)</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Category Icon (SVG/PNG)</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl hover:border-primary transition-colors cursor-pointer group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,.png"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
            <div className="space-y-1 text-center">
              <span className="material-icons-outlined text-slate-400 group-hover:text-primary transition-colors text-3xl block">
                upload_file
              </span>
              <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                <p className="font-medium text-primary">Upload a file</p>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500">
                {iconFile ? iconFile.name : 'PNG, SVG up to 1MB'}
              </p>
            </div>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full">
          {isLoading ? 'Creating...' : 'Create Category'}
        </button>
      </form>
    </div>
  )
}