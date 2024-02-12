import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bus track ALCANTE',
  description: 'Track your alicante bus stops easily',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap')
      </style>
      <body className={inter.className}>{children}</body> 
    </html>
  )
}
