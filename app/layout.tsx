import type { Metadata } from 'next'
import { Dancing_Script, Inter } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing-script' })

export const metadata: Metadata = {
  title: 'For You',
  description: 'A special message, just for you.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_inter.variable} ${_dancingScript.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
