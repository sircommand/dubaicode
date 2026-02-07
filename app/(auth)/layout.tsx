import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StylePins - Admin Login',
  description: 'Admin Panel Login',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}