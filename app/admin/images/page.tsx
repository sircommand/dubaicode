'use client'

import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import ImageForm from '@/components/admin/ImageForm'
import ImageList from '@/components/admin/ImageList'

interface Image {
  _id: string
  title: string
  url: string
  categoryId: string
  subcategoryId?: string
  code: string
  views: number
}

export default function ImagesPage() {
  const [images, setImages] = useState<Image[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/images')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setImages(data)
    } catch (error) {
      toast.error('Failed to load images')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const response = await fetch(`/api/images/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete')

      toast.success('Image deleted successfully!')
      fetchImages()
    } catch (error) {
      toast.error('Failed to delete image')
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Image Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Upload and manage your gallery images.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ImageForm onSuccess={fetchImages} />
          </div>

          <div className="lg:col-span-3">
            <ImageList images={images} isLoading={isLoading} onDelete={handleDeleteImage} />
          </div>
        </div>
      </div>
    </>
  )
}