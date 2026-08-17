import { Montserrat } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import './globals.css'

import { ThemeProvider } from './components/ThemeProvider'
import HeaderNav from './components/HeaderNav'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'

import AOSInit from './components/AOSInit'

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600'] })

export const metadata = {
  title: 'Sehati Peduli Sesama - Bersama Kita Membangun Harapan',
  description: 'Misi Kami: Memberikan Bantuan dan Dukungan Bagi Anak Yatim, Korban Bencana, dan Masyarakat yang Membutuhkan.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/sehati.logo.png" sizes="any" />
      </head>
      <body className={montserrat.className}>
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key="SB-Mid-client-miZxRK0ORngEupw3"
          strategy="beforeInteractive"
        />
        <AOSInit />
        <AuthProvider>
          <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
            <div className="container">
              <HeaderNav />

              <main style={{ position: 'relative', zIndex: 1, paddingTop: '1rem' }}>{children}</main>

              <Footer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
