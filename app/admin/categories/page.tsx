'use client'

import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import CategoryForm from '@/components/admin/CategoryForm'
import CategoryList from '@/components/admin/CategoryList'

interface Category {
  _id: string
  name: string
  icon: string
  parentId: string | null
  subCategoryCount: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [parentId, setParentId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [parentId])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const url = parentId
        ? `/api/categories?parentId=${parentId}`
        : '/api/categories?parentId=root'
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      toast.error('Failed to load categories')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCategory = async (data: {
    name: string
    icon: string
    parentId?: string
  }) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          icon: data.icon,
          parentId: data.parentId || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to create')

      toast.success('Category created successfully!')
      fetchCategories()
    } catch (error) {
      toast.error('Failed to create category')
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete')

      toast.success('Category deleted successfully!')
      fetchCategories()
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  const handleViewSubcategories = (id: string) => {
    setParentId(id)
  }

  const handleBackToParent = () => {
    setParentId(null)
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Category Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Organize your platform content by managing categories and hierarchies.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CategoryForm
              onSubmit={handleCreateCategory}
              parentId={parentId}
              categories={categories.filter((c) => !c.parentId)}
            />
          </div>

          <div className="lg:col-span-2">
            <CategoryList
              categories={categories}
              isLoading={isLoading}
              onDelete={handleDeleteCategory}
              onViewSubcategories={handleViewSubcategories}
              onBack={parentId ? handleBackToParent : undefined}
            />
          </div>
        </div>
      </div>
    </>
  )
}