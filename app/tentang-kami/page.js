"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Home, Users, Target, ChevronRight } from 'lucide-react'

export default function TentangKami() {
  const misiList = [
    'Menyelenggarakan program sosial, pendidikan, kesehatan, dan pemberdayaan masyarakat.',
    'Menyalurkan bantuan secara tepat sasaran dan berkelanjutan.',
    'Membangun transparansi dan akuntabilitas dalam setiap program yang dijalankan.',
    'Mengajak lebih banyak orang untuk peduli dan berkontribusi dalam kebaikan.',
  ]

  return (
    <>
      {/* ========== HERO SECTION ========== */}
      <section style={{ paddingTop: '1.5rem', paddingBottom: '2.5rem' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#999', marginBottom: '2rem' }}>
          <Home size={12} />
          <Link href="/" style={{ color: '#999' }}>Beranda</Link>
          <ChevronRight size={12} />
          <span style={{ color: '#333' }}>Tentang Kami</span>
        </nav>

        {/* 2-column layout: Left info + Right image */}
        <div className="tentang-grid tentang-hero-grid">

          {/* LEFT: Content */}
          <div>
            <p style={{
              fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1.5px',
              color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.75rem'
            }}>
              MENGENAL KAMI
            </p>

            <h1 style={{
              fontSize: '2.4rem', fontWeight: '900', lineHeight: '1.15',
              color: 'var(--color-text)', marginBottom: '0.75rem'
            }}>
              Sehati Peduli Sesama
            </h1>

            {/* Decorative double dot line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1rem' }}>
              <div style={{ width: '28px', height: '3px', background: 'var(--color-primary)', borderRadius: '2px' }} />
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--color-primary)' }} />
            </div>

            <p style={{
              fontSize: '1rem', fontWeight: '600', color: 'var(--color-text)',
              marginBottom: '1.2rem', lineHeight: '1.5'
            }}>
              Kisah, Visi, dan Misi Kami untuk Indonesia yang Lebih Baik.
            </p>

            <p style={{
              fontSize: '0.87rem', color: 'var(--color-text-muted)',
              lineHeight: '1.75', marginBottom: '2rem'
            }}>
              Sehati Peduli Sesama adalah yayasan sosial dan kemanusiaan yang hadir sebagai
              wadah untuk menyalurkan kepedulian kepada masyarakat yang membutuhkan.
              Berlandaskan nilai kemanusiaan, keikhlasan, dan gotong royong, kami menghadirkan
              berbagai program sosial yang memberikan manfaat nyata serta mendorong
              terciptanya kehidupan yang lebih baik.
            </p>

            <Link
              href="/donatur"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                background: 'var(--color-primary)', color: '#fff',
                padding: '0.78rem 1.8rem', borderRadius: '9999px',
                fontWeight: '700', fontSize: '0.9rem', textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(140,21,50,0.28)',
              }}
            >
              <Users size={16} />
              Bergabung Bersama Kami
              <ChevronRight size={15} />
            </Link>
          </div>

          {/* RIGHT: Image with floating card */}
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
              <Image
                src="/tentangkami.png"
                alt="Sehati Peduli Sesama"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 55vw"
                priority
                loading="eager"
              />
            </div>

            {/* Floating card bottom-left */}
            <div style={{
              position: 'absolute', bottom: '-1.2rem', left: '1.5rem',
              background: 'var(--color-card-bg)',
              borderRadius: '14px', padding: '1rem 1.4rem',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              border: '1px solid var(--color-card-border)',
              display: 'flex', alignItems: 'center', gap: '0.85rem',
              maxWidth: '260px'
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: '#fce8ef', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#c14670', flexShrink: 0
              }}>
                <Users size={20} />
              </div>
              <p style={{ fontSize: '0.83rem', fontWeight: '600', color: 'var(--color-text)', lineHeight: '1.4' }}>
                Bersama kita, wujudkan Indonesia yang lebih baik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== VISI & MISI SECTION ========== */}
      <section style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <div className="tentang-grid" style={{ gap: '1.5rem', alignItems: 'stretch' }}>

          {/* VISI Card */}
          <div style={{
            background: 'var(--color-card-bg)',
            borderRadius: '18px',
            padding: '2.5rem',
            border: '1px solid var(--color-card-border)',
            boxShadow: 'var(--shadow-sm)',
            borderLeft: '5px solid #1a9e5c',
            display: 'flex', alignItems: 'flex-start', gap: '1.8rem',
            position: 'relative', overflow: 'hidden'
          }}>
            {/* Background watermark icon */}
            <div style={{
              position: 'absolute', right: '-20px', bottom: '-20px',
              opacity: 0.06, color: '#1a9e5c'
            }}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.5 6.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5S14.93 3 13 3 9.5 4.57 9.5 6.5zM10 21h2v-3h2v3h2v-6.18c.62.11 1.25.18 1.9.18 1.28 0 2.5-.26 3.6-.73V21h2V13c0-3.87-3.13-7-7-7-.57 0-1.13.07-1.67.18C15.27 5.03 14.21 4 13 4c-1.1 0-2 .9-2 2v.27C9.61 7.14 8.5 8.96 8.5 11v2.5A2.5 2.5 0 006 16v5h4v-5.5c0-.28.22-.5.5-.5s.5.22.5.5V21z" />
              </svg>
            </div>

            {/* Telescope icon circle */}
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: '#e8f5e0', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#1a9e5c', flexShrink: 0
            }}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.5 6.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5S14.93 3 13 3 9.5 4.57 9.5 6.5zM13 8c-0.83 0-1.5-0.67-1.5-1.5S12.17 5 13 5s1.5.67 1.5 1.5S13.83 8 13 8zM5 21l3-8h2l-3 8H5zm14-8h-4l-2 8h4l2-8z"/>
              </svg>
            </div>

            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: '0.72rem', fontWeight: '700', letterSpacing: '1.5px',
                color: '#1a9e5c', textTransform: 'uppercase', marginBottom: '0.6rem'
              }}>
                VISI KAMI
              </p>
              <h2 style={{
                fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-text)',
                lineHeight: '1.3'
              }}>
                Menjadi lembaga filantropi terpercaya dan berdampak luas bagi Indonesia.
              </h2>
            </div>
          </div>

          {/* MISI Card */}
          <div style={{
            background: 'var(--color-card-bg)',
            borderRadius: '18px',
            padding: '2.5rem',
            border: '1px solid var(--color-card-border)',
            boxShadow: 'var(--shadow-sm)',
            borderLeft: '5px solid var(--color-primary)',
            display: 'flex', gap: '1.8rem', alignItems: 'flex-start'
          }}>
            {/* Target icon circle */}
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: '#fce8ef', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0
            }}>
              <Target size={36} />
            </div>

            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: '0.72rem', fontWeight: '700', letterSpacing: '1.5px',
                color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.9rem'
              }}>
                MISI KAMI
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {misiList.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: 'var(--color-primary)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0, marginTop: '1px'
                    }}>
                      <ChevronRight size={12} color="#fff" />
                    </div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: '1.55' }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
