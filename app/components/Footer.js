'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Heart, ChevronDown } from 'lucide-react'

export default function Footer() {
  const [openSection, setOpenSection] = useState(null)
  
  const toggleSection = (sec) => {
    setOpenSection(openSection === sec ? null : sec)
  }

  return (
    <footer style={{ marginTop: '2rem' }}>
      {/* CTA Banner */}
      <div className="footer-cta">
        <Heart className="footer-cta-icon" size={60} strokeWidth={1.5} />
        <div className="footer-cta-content">
          <h3>Yuk, jadi bagian dari kebaikan</h3>
          <p>Setiap donasi Anda, membawa harapan baru.</p>
        </div>
        <Link href="/donatur" className="btn-primary btn-light" style={{ padding: '0.8rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
          Donasi Sekarang <span style={{ fontSize: '1.2rem' }}>&rarr;</span>
        </Link>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        {/* Brand Col */}
        <div className="footer-col brand-col">
          <Link href="/" className="logo-container" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div className="logo-img-wrapper" style={{ width: '32px', height: '32px', position: 'relative' }}>
              <Image src="/sehati.logo.png" alt="Logo" fill sizes="32px" style={{ objectFit: 'contain' }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-text)' }}>Sehati Peduli</span>
          </Link>
          <p className="footer-desc">
            Sehati Peduli Sesama - Memberikan Bantuan dan dukungan bagi anak yatim, korban bencana, dan masyarakat yang membutuhkan.
          </p>
          <div className="social-links" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
            <a href="#" className="social-link" aria-label="Instagram">IG</a>
            <a href="#" className="social-link" aria-label="Facebook">FB</a>
            <a href="#" className="social-link" aria-label="YouTube">YT</a>
          </div>
        </div>

        {/* Accordion Container for mobile, regular cols for desktop */}
        <div className="footer-accordions">
          {/* Contact Col */}
          <div className="footer-col">
            <h4 onClick={() => toggleSection('kantor')} className="footer-heading">Kantor Pusat <ChevronDown className={`accordion-icon ${openSection === 'kantor' ? 'open' : ''}`} size={18} /></h4>
            <div className={`footer-content ${openSection === 'kantor' ? 'show' : ''}`}>
              <div className="contact-item">
                <MapPin size={18} />
                <div>
                  Jl. Babakan Garut, Kelurahan<br />
                  Cisempong, Kecamatan<br />
                  Batununggal, Kota Bandung,<br />
                  Jawa Barat 40286, Indonesia
                </div>
              </div>
              <div className="contact-item">
                <Phone size={18} />
                <div>+62 (022) 1234567</div>
              </div>
              <div className="contact-item">
                <Mail size={18} />
                <div>info@sehatipeduli.org</div>
              </div>
            </div>
          </div>

          {/* Program Links */}
          <div className="footer-col">
            <h4 onClick={() => toggleSection('program')} className="footer-heading">Program Donasi <ChevronDown className={`accordion-icon ${openSection === 'program' ? 'open' : ''}`} size={18} /></h4>
            <div className={`footer-content ${openSection === 'program' ? 'show' : ''}`}>
              <ul className="footer-links">
                <li><Link href="/program-kami">› Beasiswa Yatim</Link></li>
                <li><Link href="/program-kami">› Layanan Kesehatan</Link></li>
                <li><Link href="/program-kami">› Tanggap Bencana</Link></li>
                <li><Link href="/program-kami">› Pemberdayaan UMKM</Link></li>
              </ul>
            </div>
          </div>

          {/* Other Links */}
          <div className="footer-col">
            <h4 onClick={() => toggleSection('tautan')} className="footer-heading">Tautan Lainnya <ChevronDown className={`accordion-icon ${openSection === 'tautan' ? 'open' : ''}`} size={18} /></h4>
            <div className={`footer-content ${openSection === 'tautan' ? 'show' : ''}`}>
              <ul className="footer-links">
                <li><Link href="/">› Beranda</Link></li>
                <li><Link href="/tentang-kami">› Tentang Kami</Link></li>
                <li><Link href="/cara-berdonasi">› Cara Berdonasi</Link></li>
                <li><Link href="/berita">› Blog & Berita</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div>© 2026 Sehati Peduli Sesama. All rights reserved.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text)' }}>
          Kepedulian kecil, perubahan besar. <Heart size={14} />
        </div>
      </div>
    </footer>
  )
}
