'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { logout } = useAuthStore()
  const [isDark, setIsDark] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_token='))

      if (!token) {
        router.push('/login')
      } else {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark')
    setIsDark(!isDark)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    logout()
    router.push('/login')
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { href: '/admin/images', label: 'Images', icon: 'image' },
    { href: '/admin/categories', label: 'Categories', icon: 'category' },
    { href: '/admin/settings', label: 'Settings', icon: 'settings' },
  ]

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed h-full z-40">
        <div className="p-6 flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800">
          <span className="text-primary text-2xl font-bold tracking-tight">StylePins</span>
          <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 uppercase tracking-widest">
            Admin
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1 py-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <span className="material-icons-outlined text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 space-y-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
          >
            <span className="flex items-center">
              <span className="material-icons-outlined mr-2 text-lg">dark_mode</span>
              Dark Mode
            </span>
            <div className="w-8 h-4 bg-slate-300 dark:bg-primary rounded-full relative transition-colors">
              <div
                className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-transform transform ${isDark ? 'translate-x-4' : 'left-1'}`}
              />
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
          >
            <span className="material-icons-outlined text-lg">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}