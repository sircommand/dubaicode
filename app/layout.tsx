import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StylePins Admin',
  description: 'Admin panel for StylePins',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {children}
      </body>
    </html>
  )
}