import './globals.css'
import { ReactNode } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export const metadata = {
  title: 'Next Supabase Internship',
  description: 'Basic Next.js + Supabase Starter',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="p-6 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  )
}
