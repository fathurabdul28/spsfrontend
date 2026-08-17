"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Heart, Activity, HomeIcon, HeartHandshake, ChevronLeft, ChevronRight, ArrowRight, Play, Calendar, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react'

import { API_BASE_URL, getImageUrl } from './lib/config'

export default function Home() {
  const [dbPrograms, setDbPrograms] = useState([])
  const [dbNews, setDbNews] = useState([])
  const [webSettings, setWebSettings] = useState({
    about_us: 'Sehati Peduli Sesama adalah yayasan sosial dan kemanusiaan yang hadir sebagai wadah untuk menyalurkan kepedulian kepada masyarakat yang membutuhkan.',
    vision: 'Menjadi lembaga filantropi terpercaya dan berdampak luas bagi Indonesia.',
    mission: 'Menyelenggarakan program sosial, pendidikan, kesehatan, dan bencana secara transparan.'
  })
  const [activeSlide, setActiveSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/programs`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/news`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/web-settings`).then(res => res.json()).catch(() => ({}))
    ])
      .then(([programsData, newsData, settingsData]) => {
        if (Array.isArray(programsData)) setDbPrograms(programsData)
        
        const newsList = Array.isArray(newsData) ? newsData : (newsData?.data || [])
        if (Array.isArray(newsList)) setDbNews(newsList)

        if (settingsData && typeof settingsData === 'object') {
          setWebSettings(prev => ({ ...prev, ...settingsData }))
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (dbPrograms.length === 0) return
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % dbPrograms.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [dbPrograms.length])

  const getImageSrc = (imagePath) => getImageUrl(imagePath)

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center text-slate-400" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
        Memuat data...
      </div>
    )
  }

  const currentHeroProgram = dbPrograms.length > 0 ? dbPrograms[activeSlide % dbPrograms.length] : null;

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div style={{ position: 'absolute', inset: 0, borderRadius: '24px', overflow: 'hidden', zIndex: 0 }}>
          <div className="hero-overlay"></div>
          {dbPrograms.length > 0 ? (
            dbPrograms.map((prog, idx) => (
              <Image
                key={prog.id || idx}
                src={getImageSrc(prog.image)}
                alt={prog.title}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover', opacity: idx === activeSlide ? 1 : 0, transition: 'opacity 1s ease', zIndex: 0 }}
                priority={idx === 0}
                loading={idx === 0 ? "eager" : "lazy"}
              />
            ))
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: '#1e293b', zIndex: 0 }}></div>
          )}
        </div>
        
        <div className="hero-content" data-aos="fade-right">
          <h1 className="hero-title">Bersama kita wujudkan masa depan yang lebih baik</h1>
          <p className="hero-subtitle">Dukungan Anda hari ini, harapan mereka esok hari.</p>
          <div className="hero-buttons">
            <Link href="/donatur" className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>Donasi Sekarang</Link>
            {currentHeroProgram && (
              <Link href={`/program-kami/${currentHeroProgram.slug}`} className="btn-play" style={{ textDecoration: 'none' }}>
                <span className="play-icon"><Play size={20} style={{ marginLeft: '4px' }} /></span>
                Lihat Program
              </Link>
            )}
          </div>
        </div>

        {/* Floating Donasi Card */}
        {currentHeroProgram && (
          <div className="hero-floating-wrapper">
            <div className="hero-floating-card" data-aos="fade-up" data-aos-delay="200">
              <div className="hero-floating-stats">
                <div className="stat-item">
                  <h4>Terkumpul</h4>
                  <p>Rp {parseFloat(currentHeroProgram.collected_amount || 0).toLocaleString('id-ID')}</p>
                </div>
                <div className="stat-item">
                  <h4>Target</h4>
                  <p>Rp {parseFloat(currentHeroProgram.target_amount || 50000000).toLocaleString('id-ID')}</p>
                </div>
                <div className="stat-progress">
                  <div className="progress-text">{currentHeroProgram.progress || 0}% Terkumpul</div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${Math.min(currentHeroProgram.progress || 0, 100)}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="hero-donators">
                <div className="avatars">
                  <img src="/avatars/1.png" alt="User" onError={(e) => { e.target.style.display = 'none' }} />
                  <img src="/avatars/2.png" alt="User" onError={(e) => { e.target.style.display = 'none' }} />
                  <img src="/avatars/3.png" alt="User" onError={(e) => { e.target.style.display = 'none' }} />
                </div>
                <span className="donator-text">245+ Donatur telah bergabung</span>
                <Link href={`/program-kami/${currentHeroProgram.slug}`} className="btn-arrow" style={{ display: 'flex', textDecoration: 'none' }}>
                  <ChevronRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. PROGRAM KAMI */}
      <section className="section">
        <div className="section-header" data-aos="fade-up">
          <div>
            <div className="section-subtitle">Pilihan Kebaikan</div>
            <h2 className="section-title">Program Kami</h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Bersama kita wujudkan perubahan nyata untuk mereka yang membutuhkan.</p>
          </div>
          <Link href="/program-kami" className="btn-outline">Lihat Semua Program &rarr;</Link>
        </div>

        <div className="grid-cards">
          {dbPrograms.slice(0, 3).map((prog, idx) => (
            <div key={prog.id || idx} className="card" data-aos="fade-up" data-aos-delay={`${idx * 150}`}>
              <div className="card-img-wrapper">
                <Image src={getImageSrc(prog.image)} alt={prog.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                <div className="card-badge-overlay">
                  <div className="indicator"></div>
                  {prog.progress || 0}% terkumpul
                </div>
              </div>
              <div className="card-content">
                <div className="card-date">
                  <Calendar size={14} /> Akan disalurkan: 15 Agu 2026 (H-8)
                </div>
                <h3 className="card-title">{prog.title}</h3>
                <p className="card-desc">{prog.description}</p>
                <div className="card-footer">
                  <div>
                    <div className="card-target-label">Target: <span className="card-target-val">Rp {parseFloat(prog.target_amount || 50000000).toLocaleString('id-ID')}</span></div>
                  </div>
                  <Link href={`/program-kami/${prog.slug}`} className="btn-primary" style={{ padding: '0.4rem 1.2rem', fontSize: '0.8rem' }}>Selengkapnya &rarr;</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TENTANG KAMI */}
      <section className="section" style={{ borderTop: '1px solid var(--color-card-border)' }}>
        <div className="tentang-grid">
          <div className="tentang-text" data-aos="fade-right">
            <div className="section-subtitle">Mengenal Yayasan</div>
            <h2 className="section-title" style={{ marginBottom: '1.5rem', lineHeight: 1.2 }}>Tentang Sehati<br/>Peduli Sesama</h2>
            <p>{webSettings.about_us}</p>
            
            <div className="visi-misi">
              <div className="vm-item">
                <div className="vm-icon"><CheckCircle2 size={24} /></div>
                <h4>Visi Kami</h4>
                <p>{webSettings.vision}</p>
              </div>
              <div className="vm-item">
                <div className="vm-icon"><ShieldCheck size={24} /></div>
                <h4>Misi Kami</h4>
                <p>{webSettings.mission}</p>
              </div>
            </div>
            
            <Link href="/tentang-kami" className="btn-primary" style={{ marginTop: '1rem' }}>Baca Selengkapnya &rarr;</Link>
          </div>
          
          <div className="tentang-img-wrapper" data-aos="fade-left">
            <Image src="/tentangkami.png" alt="Tentang Kami" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
            <div className="tentang-badge">
              <h4>100%</h4>
              <p>Amanah & Transparan</p>
              <div className="hero-donators" style={{ gap: '0.5rem' }}>
                <div className="avatars">
                  <img src="/avatars/1.png" alt="User" onError={(e) => { e.target.style.display = 'none' }} />
                  <img src="/avatars/2.png" alt="User" onError={(e) => { e.target.style.display = 'none' }} />
                  <img src="/avatars/3.png" alt="User" onError={(e) => { e.target.style.display = 'none' }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>245+ Donatur percaya kami</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BERITA TERKINI */}
      <section className="section" style={{ borderTop: '1px solid var(--color-card-border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }} data-aos="fade-up">
          <div className="section-subtitle">Kabar & Berita Terkini</div>
          <h2 className="section-title">Ikuti perkembangan terbaru</h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', maxWidth: '500px', margin: '0.5rem auto 0' }}>
            Kisah inspiratif, laporan kegiatan, dan informasi terbaru program-program kami.
          </p>
        </div>

        <div className="grid-cards">
          {dbNews.slice(0, 3).map((item, idx) => (
            <div key={item.id || idx} className="card berita-card" data-aos="fade-up" data-aos-delay={`${idx * 150}`}>
              <div className="card-img-wrapper" style={{ height: '180px' }}>
                <Image src={getImageSrc(item.image)} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                <div className="card-date desktop-date">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '26 Jul 2026'}
                </div>
              </div>
              <div className="card-content">
                <div className="card-date mobile-date" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem', display: 'none' }}>
                  {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '26 Jul 2026'}
                </div>
                <h3 className="card-title" style={{ fontSize: '1.1rem' }}>{item.title}</h3>
                <p className="card-desc" style={{ fontSize: '0.8rem' }}>{item.excerpt || item.content?.replace(/<[^>]*>?/gm, '').slice(0, 100) + '...'}</p>
                <Link href={`/berita/${item.slug}`} className="berita-link">Baca Selengkapnya &rarr;</Link>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/berita" className="btn-primary">Lihat Semua Berita &rarr;</Link>
        </div>
      </section>
    </>
  )
}
