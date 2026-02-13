import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Skaitch - Sketch meets AI',
  description: 'The first drawing platform where you and AI collaborate turn-by-turn',
  keywords: ['AI art', 'drawing', 'NFT', 'Solana', 'creative tools'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
