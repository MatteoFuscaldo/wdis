import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Why did I start?',
  description: 'Daily reminder of why you started',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
