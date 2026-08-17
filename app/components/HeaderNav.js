'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import LoginButton from './LoginButton'

export default function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <header className="header">
      {/* Brand Logo */}
      <Link href="/" className="logo-container" onClick={() => setMobileMenuOpen(false)}>
        <div className="logo-img-wrapper">
          <Image src="/sehati.logo.png" alt="Sehati Peduli Sesama Logo" fill sizes="40px" style={{ objectFit: 'contain' }} priority />
        </div>
        <span className="logo-text">Sehati Peduli</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        <ul className="nav-links">
          <li><Link href="/" prefetch={false} className="nav-link active">Beranda</Link></li>
          <li><Link href="/program-kami" prefetch={false} className="nav-link">Program</Link></li>
          <li><Link href="/tentang-kami" prefetch={false} className="nav-link">Tentang Kami</Link></li>
          <li><Link href="/cara-berdonasi" prefetch={false} className="nav-link">Cara Berdonasi</Link></li>
          <li><Link href="/berita" prefetch={false} className="nav-link">Blog</Link></li>
        </ul>
      </nav>

      <div className="header-actions">
        <ThemeToggle />
        <LoginButton />
        <Link href="/donatur" className="btn-primary">
          Donasi Sekarang
        </Link>
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'var(--background)', zIndex: 50, padding: '2rem', display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <Link href="/" className="logo-container" onClick={() => setMobileMenuOpen(false)}>
              <span className="logo-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Sehati Peduli</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1.1rem', fontWeight: 500 }}>
            <li><Link href="/" onClick={() => setMobileMenuOpen(false)}>Beranda</Link></li>
            <li><Link href="/program-kami" onClick={() => setMobileMenuOpen(false)}>Program</Link></li>
            <li><Link href="/tentang-kami" onClick={() => setMobileMenuOpen(false)}>Tentang Kami</Link></li>
            <li><Link href="/cara-berdonasi" onClick={() => setMobileMenuOpen(false)}>Cara Berdonasi</Link></li>
            <li><Link href="/berita" onClick={() => setMobileMenuOpen(false)}>Blog</Link></li>
          </ul>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }} onClick={() => setMobileMenuOpen(false)}>
              <LoginButton />
            </div>
            <Link href="/donatur" className="btn-primary" style={{ width: '100%' }}>Donasi Sekarang</Link>
          </div>
        </div>
      )}
    </header>
  )
}
