import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

import { ThemeProvider } from './components/ThemeProvider'
import HeaderNav from './components/HeaderNav'
import Footer from './components/Footer'
import MobileCta from './components/MobileCta'
import { AuthProvider } from './context/AuthContext'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata = {
  title: 'Sehati Peduli Sesama - Bersama Kita Membangun Harapan',
  description: 'Misi Kami: Memberikan Bantuan dan Dukungan Bagi Anak Yatim, Korban Bencana, dan Masyarakat yang Membutuhkan.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning className={jakarta.variable}>
      <head>
        <link rel="icon" href="/sehati.logo.png" sizes="any" />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
            <div className="container">
              <HeaderNav />
              <main>{children}</main>
              <Footer />
              <MobileCta />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
