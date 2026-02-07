'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import toast, { Toaster } from 'react-hot-toast'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const router = useRouter()
  const { setAuth } = useAuthStore()

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark')
    setIsDark(!isDark)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Login failed')
        return
      }

      const data = await response.json()
      setAuth(true, data.admin.username)
      toast.success('Welcome back!')
      router.push('/admin/dashboard')
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className={`min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark transition-colors duration-200`}>
        <div className="w-full max-w-md px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">StylePins</h1>
            <p className="text-slate-500 dark:text-slate-400">Admin Panel Login</p>
          </div>

          <div className="card p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={isLoading}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="input-field"
                />
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <button
            onClick={toggleDarkMode}
            className="mx-auto mt-6 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors block"
          >
            <span className="material-icons-outlined block dark:hidden">dark_mode</span>
            <span className="material-icons-outlined hidden dark:block">light_mode</span>
          </button>
        </div>
      </div>
    </>
  )
}