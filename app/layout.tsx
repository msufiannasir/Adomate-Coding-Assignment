import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Image Text Composer',
  description: 'A desktop image editing tool for adding customizable text overlays to PNG images',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="hidden md:block">
          {children}
        </div>
        <div className="md:hidden flex items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Desktop Only</h1>
            <p className="text-gray-600">
              This application is designed for desktop use only. Please open it on a larger screen.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
