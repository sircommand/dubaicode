'use client'

import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface Stats {
  totalImages: number
  todayViews: number
  yesterdayViews: number
  weekViews: number
  monthViews: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      toast.error('Failed to load statistics')
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Images',
      value: stats?.totalImages || 0,
      change: '+12%',
      changeType: 'positive',
      icon: 'image',
      color: 'blue',
    },
    {
      title: "Today's Visits",
      value: stats?.todayViews || 0,
      change: '+8.4%',
      changeType: 'positive',
      icon: 'today',
      color: 'primary',
    },
    {
      title: 'Yesterday',
      value: stats?.yesterdayViews || 0,
      change: '',
      changeType: 'neutral',
      icon: 'history',
      color: 'slate',
    },
    {
      title: 'Weekly Visits',
      value: stats?.weekViews || 0,
      change: '-2.1%',
      changeType: 'negative',
      icon: 'date_range',
      color: 'orange',
    },
    {
      title: 'Monthly Visits',
      value: stats?.monthViews || 0,
      change: '+18.3%',
      changeType: 'positive',
      icon: 'calendar_month',
      color: 'emerald',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="space-y-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Welcome back. Here is what's happening today.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {statCards.map((card, index) => (
            <div key={index} className="card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-2 rounded-lg ${
                    card.color === 'blue'
                      ? 'bg-blue-50 dark:bg-blue-900/30'
                      : card.color === 'primary'
                        ? 'bg-primary/10'
                        : card.color === 'orange'
                          ? 'bg-orange-50 dark:bg-orange-900/30'
                          : card.color === 'emerald'
                            ? 'bg-emerald-50 dark:bg-emerald-900/30'
                            : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  <span
                    className={`material-icons-outlined ${
                      card.color === 'blue'
                        ? 'text-blue-600 dark:text-blue-400'
                        : card.color === 'primary'
                          ? 'text-primary'
                          : card.color === 'orange'
                            ? 'text-orange-600 dark:text-orange-400'
                            : card.color === 'emerald'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {card.icon}
                  </span>
                </div>
                {card.change && (
                  <span
                    className={`text-xs font-semibold ${
                      card.changeType === 'positive'
                        ? 'text-green-500'
                        : card.changeType === 'negative'
                          ? 'text-red-500'
                          : 'text-slate-500'
                    }`}
                  >
                    {card.change}
                  </span>
                )}
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                {card.title}
              </h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {card.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}