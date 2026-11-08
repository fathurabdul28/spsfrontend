'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import LoginButton from './LoginButton'

const NAV_ITEMS = [
  { href: '/', label: 'Beranda' },
  { href: '/program-kami', label: 'Program' },
  { href: '/tentang-kami', label: 'Tentang Kami' },
  { href: '/cara-berdonasi', label: 'Cara Berdonasi' },
  { href: '/berita', label: 'Blog' },
]

export default function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href))
  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <header className="header">
      <Link href="/" className="logo-container" onClick={closeMenu}>
        <div className="logo-img-wrapper">
          <Image src="/sehati.logo.png" alt="Sehati Peduli Sesama Logo" fill sizes="36px" style={{ objectFit: 'contain' }} priority />
        </div>
        <span>Sehati Peduli</span>
      </Link>

      <nav className="desktop-nav" aria-label="Navigasi utama">
        <ul className="nav-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} prefetch={false} className={`nav-link${isActive(item.href) ? ' active' : ''}`}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="header-actions">
        <ThemeToggle />
        <span className="login-slot"><LoginButton /></span>
        <Link href="/donatur" className="btn-primary">Donasi Sekarang</Link>
        <button className="icon-btn mobile-menu-btn" onClick={() => setMobileMenuOpen(true)} aria-label="Buka menu">
          <Menu size={24} />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-top">
            <Link href="/" className="logo-container" onClick={closeMenu}>Sehati Peduli</Link>
            <button className="icon-btn" onClick={closeMenu} aria-label="Tutup menu"><X size={24} /></button>
          </div>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}><Link href={item.href} onClick={closeMenu}>{item.label}</Link></li>
            ))}
          </ul>
          <div className="mobile-menu-bottom">
            <div style={{ display: 'flex', justifyContent: 'center' }} onClick={closeMenu}>
              <LoginButton />
            </div>
            <Link href="/donatur" className="btn-primary btn-lg btn-block" onClick={closeMenu}>Donasi Sekarang</Link>
          </div>
        </div>
      )}
    </header>
  )
}
