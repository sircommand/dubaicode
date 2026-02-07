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
        