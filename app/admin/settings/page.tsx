'use client'

import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

interface AdminSettings {
  whatsapp: string
  instagram: string
  telegram: string
  youtube: string
  pinterest: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AdminSettings>({
    whatsapp: '',
    instagram: '',
    telegram: '',
    youtube: '',
    pinterest: '',
  })
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setSettings({
        whatsapp: data.whatsapp || '',
        instagram: data.instagram || '',
        telegram: data.telegram || '',
        youtube: data.youtube || '',
        pinterest: data.pinterest || '',
      })
    } catch (error) {
      toast.error('Failed to load settings')
    } finally {
      setIsLoadingSettings(false)
    }
  }

  const handleSettingsChange = (field: keyof AdminSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error('Failed to update')

      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to change password')
      }

      toast.success('Password changed successfully!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingSettings) {
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
        <header>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Platform Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your platform social links and security credentials.
          </p>
        </header>

        <div className="max-w-2xl space-y-8">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <section className="card p-6 rounded-xl">
              <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="material-icons-outlined text-primary">share</span>
                <h2 className="text-xl font-semibold">Social Media Connections</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">WhatsApp Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <span className="material-icons-outlined text-sm">call</span>
                    </span>
                    <input
                      type="text"
                      value={settings.whatsapp}
                      onChange={(e) => handleSettingsChange('whatsapp', e.target.value)}
                      placeholder="+1234567890"
                      className="pl-10 input-field"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Instagram ID</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <span className="material-icons-outlined text-sm">alternate_email</span>
                    </span>
                    <input
                      type="text"
                      value={settings.instagram}
                      onChange={(e) => handleSettingsChange('instagram', e.target.value)}
                      placeholder="stylepins_official"
                      className="pl-10 input-field"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Telegram ID</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <span className="material-icons-outlined text-sm">send</span>
                    </span>
                    <input
                      type="text"
                      value={settings.telegram}
                      onChange={(e) => handleSettingsChange('telegram', e.target.value)}
                      placeholder="@stylepins_channel"
                      className="pl-10 input-field"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">YouTube ID</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <span className="material-icons-outlined text-sm">smart_display</span>
                    </span>
                    <input
                      type="text"
                      value={settings.youtube}
                      onChange={(e) => handleSettingsChange('youtube', e.target.value)}
                      placeholder="StylePins"
                      className="pl-10 input-field"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium">Pinterest ID</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <span className="material-icons-outlined text-sm">push_pin</span>
                    </span>
                    <input
                      type="text"
                      value={settings.pinterest}
                      onChange={(e) => handleSettingsChange('pinterest', e.target.value)}
                      placeholder="stylepins_app"
                      className="pl-10 input-field"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full mt-6">
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </section>
          </form>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <section className="card p-6 rounded-xl">
              <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="material-icons-outlined text-primary">lock_reset</span>
                <h2 className="text-xl font-semibold">Update Password</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium">Current Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <span className="material-icons-outlined text-sm">password</span>
                    </span>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="pl-10 input-field"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">New Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <span className="material-icons-outlined text-sm">password</span>
                    </span>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="pl-10 input-field"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <span className="material-icons-outlined text-sm">verified_user</span>
                    </span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="pl-10 input-field"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full mt-6">
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </section>
          </form>
        </div>
      </div>
    </>
  )
}