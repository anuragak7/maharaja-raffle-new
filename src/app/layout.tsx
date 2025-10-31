import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hicksville Farmers Market – Lucky Draw',
  description: 'Beer barrel raffle draw experience'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
