'use client'

import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'

interface Category {
  _id: string
  name: string
}

interface ImageFormProps {
  onSuccess: () => void
}

export default function ImageForm({ onSuccess }: ImageFormProps) {
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [subcategoryId, setSubcategoryId] = useState('')
  const [price, setPrice] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchRootCategories()
  }, [])

  const fetchRootCategories = async () => {
    try {
      const response = await fetch('/api/categories?parentId=root')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    setCategoryId(id)
    setSubcategoryId('')

    if (!id) {
      setSubcategories([])
      return
    }

    try {
      const response = await fetch(`/api/categories?parentId=${id}`)
      if (!response.ok) throw new Error('Failed to fetch subcategories')
      const data = await response.json()
      setSubcategories(data)
    } catch (error) {
      toast.error('Failed to load subcategories')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Only JPEG and PNG files are allowed')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      setImageFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !imageFile || !categoryId || !subcategoryId) {
      toast.error('Please fill all required fields')
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('title', title)
      formData.append('categoryId', categoryId)
      formData.append('subcategoryId', subcategoryId)
      formData.append('price', price)

      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload')

      toast.success('Image uploaded successfully!')
      setTitle('')
      setCategoryId('')
      setSubcategoryId('')
      setPrice('')
      setImageFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''

      onSuccess()
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card p-6 rounded-2xl sticky top-24 h-fit">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <span className="material-icons-outlined text-primary">add_photo_alternate</span>
        Add New Image
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-semibold">Image Upload</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
            <span className="material-icons-outlined text-4xl text-slate-400 group-hover:text-primary mb-2 block">
              cloud_upload
            </span>
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-500 mt-1">
              {imageFile ? imageFile.name : 'JPEG, PNG up to 10MB'}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Emerald Stone Necklace"
            disabled={isLoading}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Category</label>
          <select
            value={categoryId}
            onChange={handleCategoryChange}
            disabled={isLoading}
            className="input-field"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Sub-category</label>
          <select
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            disabled={isLoading || subcategories.length === 0}
            className="input-field"
          >
            <option value="">
              {subcategories.length === 0 ? 'Select a category first' : 'Select sub-category'}
            </option>
            {subcategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">Price (Optional)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              disabled={isLoading}
              className="pl-8 input-field"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full">
          {isLoading ? 'Uploading...' : 'Add Image to Gallery'}
        </button>
      </form>
    </div>
  )
}