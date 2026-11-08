"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowRight, Calendar, CheckCircle2, ShieldCheck, MapPin, Heart, GraduationCap, Activity, Home as HomeIcon, HeartHandshake, Users, Search, Wallet, Upload } from 'lucide-react'
import Reveal from './components/Reveal'

import { API_BASE_URL, getImageUrl } from './lib/config'
import { getDistributionInfo } from './lib/distribution'

const DEFAULT_MAPS_URL = 'https://maps.app.goo.gl/YiQUbcE6jamPasiT9'
const DEFAULT_LOCATION = 'Kampung Bamboe, Bandung'
const DEFAULT_DISTRIBUTION_TEXT = 'Akan disalurkan: 21-22 Nov 2026'

const formatRupiah = (value) => `Rp ${parseFloat(value || 0).toLocaleString('id-ID')}`
const FOCUS_AREAS = [
  { label: 'Pendidikan', icon: GraduationCap },
  { label: 'Kesehatan', icon: Activity },
  { label: 'Tanggap Bencana', icon: HomeIcon },
  { label: 'Pemberdayaan UMKM', icon: HeartHandshake },
  { label: 'Santunan Anak Yatim', icon: Heart },
]

const HOW_TO = [
  { icon: Search, title: 'Pilih Program', desc: 'Tentukan program kebaikan yang ingin Anda bantu.' },
  { icon: Wallet, title: 'Transfer Donasi', desc: 'Kirim ke rekening resmi yayasan sesuai nominal.' },
  { icon: Upload, title: 'Unggah Bukti', desc: 'Unggah bukti transfer untuk diverifikasi admin.' },
]

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '26 Jul 2026')

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

  if (isLoading) return <div className="loading">Memuat data...</div>

  const currentHeroProgram = dbPrograms.length > 0 ? dbPrograms[activeSlide % dbPrograms.length] : null
  const heroProgress = Math.min(currentHeroProgram?.progress || 0, 100)
  const totalCollected = dbPrograms.reduce((sum, p) => sum + parseFloat(p.collected_amount ?? p.collected_raw ?? 0), 0)

  return (
    <>
      {/* 1. HERO */}
      <div className="hero-wrap">
        <section className="hero">
          <div>
            <span className="hero-badge"><span className="live-dot" /> Yayasan Sosial & Kemanusiaan</span>
            <h1 className="hero-title">Bersama kita wujudkan <em>masa depan</em> yang lebih baik</h1>
            <p className="hero-subtitle">Dukungan Anda hari ini, harapan mereka esok hari.</p>

            {currentHeroProgram && (currentHeroProgram.location || currentHeroProgram.location_url) && (
              <a
                className="pill-link"
                href={currentHeroProgram.location_url || DEFAULT_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka lokasi di Google Maps"
                style={{ marginBottom: '1.5rem' }}
              >
                <MapPin size={15} />
                Lokasi: {currentHeroProgram.location || DEFAULT_LOCATION} ↗
              </a>
            )}

            <div className="hero-buttons">
              <Link href={currentHeroProgram ? `/donatur?program=${currentHeroProgram.slug}` : '/donatur'} className="btn-primary btn-lg">
                <Heart size={18} /> Donasi Sekarang
              </Link>
              {currentHeroProgram && (
                <Link href={`/program-kami/${currentHeroProgram.slug}`} className="btn-outline btn-lg">
                  Lihat Program
                </Link>
              )}
            </div>

            <div className="trust-row">
              <div className="avatars" aria-hidden="true"><span>S</span><span>P</span><span>S</span></div>
              <span><strong>245+ donatur</strong> sudah bergabung</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-img">
              {dbPrograms.map((prog, idx) => (
                <Image
                  key={prog.id || idx}
                  src={getImageUrl(prog.image)}
                  alt={prog.title}
                  fill
                  sizes="(max-width: 960px) 100vw, 50vw"
                  style={{ opacity: idx === activeSlide ? 1 : 0 }}
                  priority={idx === 0}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              ))}
            </div>

            <div className="float-chip">
              <span className="icon-box" style={{ width: 34, height: 34, borderRadius: 10 }}><ShieldCheck size={18} /></span>
              <span>100% Transparan<small>Amanah & terpercaya</small></span>
            </div>

            {currentHeroProgram && (
              <div className="hero-card">
                <div className="hero-card-title">{currentHeroProgram.title}</div>
                <div className="progress" role="progressbar" aria-valuenow={heroProgress} aria-valuemin={0} aria-valuemax={100}>
                  <div className="progress-fill" style={{ width: `${heroProgress}%` }} />
                </div>
                <div className="progress-meta">
                  <span><strong>{formatRupiah(currentHeroProgram.collected_amount ?? currentHeroProgram.collected_raw)}</strong> terkumpul</span>
                  <span>{currentHeroProgram.progress || 0}%</span>
                </div>
                <div className="progress-meta" style={{ marginTop: '0.15rem' }}>
                  <span>Target {formatRupiah(currentHeroProgram.target_amount ?? currentHeroProgram.target_raw ?? 35000000)}</span>
                </div>
                {dbPrograms.length > 1 && (
                  <div className="dots">
                    {dbPrograms.map((_, i) => (
                      <button key={i} className={`dot${i === activeSlide ? ' active' : ''}`} onClick={() => setActiveSlide(i)} aria-label={`Program ${i + 1}`} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* STATISTIK */}
      <Reveal className="stats">
        <div className="stat"><b>{dbPrograms.length}</b><span>Program Berjalan</span></div>
        <div className="stat"><b>{formatRupiah(totalCollected)}</b><span>Dana Terkumpul</span></div>
        <div className="stat"><b>245+</b><span>Donatur</span></div>
        <div className="stat"><b>100%</b><span>Amanah & Transparan</span></div>
      </Reveal>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...FOCUS_AREAS, ...FOCUS_AREAS, ...FOCUS_AREAS, ...FOCUS_AREAS].map((item, i) => (
            <span key={i} className="marquee-item"><item.icon size={16} /> {item.label}</span>
          ))}
        </div>
      </div>

      {/* 2. PROGRAM */}
      <section className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Pilihan Kebaikan</span>
            <h2 className="section-title">Program Kami</h2>
            <p className="section-lead">Bersama kita wujudkan perubahan nyata untuk mereka yang membutuhkan.</p>
          </div>
          <Link href="/program-kami" className="btn-outline">Lihat Semua Program <ArrowRight size={16} /></Link>
        </div>

        <div className="grid-cards">
          {dbPrograms.slice(0, 3).map((prog, idx) => {
            const dist = getDistributionInfo(prog.distribution_date)
            return (
              <Reveal as="article" key={prog.id || idx} delay={idx * 100} className="card hoverable">
                <div className="card-img-wrapper">
                  <Image src={getImageUrl(prog.image)} alt={prog.title} fill sizes="(max-width: 768px) 100vw, 33vw" />
                  <span className="chip">{prog.progress || 0}% terkumpul</span>
                </div>
                <div className="card-content">
                  <div className="card-meta">
                    <span><Calendar size={13} /> {dist ? dist.text : DEFAULT_DISTRIBUTION_TEXT}</span>
                    {(prog.location || prog.location_url) && (
                      <a href={prog.location_url || DEFAULT_MAPS_URL} target="_blank" rel="noopener noreferrer" title="Buka lokasi di Google Maps">
                        <MapPin size={13} />{prog.location || DEFAULT_LOCATION} ↗
                      </a>
                    )}
                  </div>
                  <h3 className="card-title">{prog.title}</h3>
                  <p className="card-desc">{prog.description}</p>
                  <div className="progress-meta"><span>Target: <strong>{formatRupiah(prog.target_amount || 50000000)}</strong></span></div>
                  <div className="card-footer">
                    <Link href={`/donatur?program=${prog.slug}`} className="btn-primary">Donasi</Link>
                    <Link href={`/program-kami/${prog.slug}`} className="btn-outline">Detail</Link>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* CARA BERDONASI */}
      <section className="section">
        <Reveal className="section-header">
          <div>
            <span className="eyebrow">Mudah & Cepat</span>
            <h2 className="section-title">Berdonasi hanya dalam 3 langkah</h2>
          </div>
          <Link href="/cara-berdonasi" className="btn-outline">Panduan Lengkap <ArrowRight size={16} /></Link>
        </Reveal>
        <div className="steps-grid">
          {HOW_TO.map((step, i) => (
            <Reveal key={step.title} delay={i * 100} className="step-card">
              <span className="icon-box"><step.icon size={22} /></span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3. TENTANG KAMI */}
      <section className="section">
        <div className="split">
          <div>
            <span className="eyebrow">Mengenal Yayasan</span>
            <h2 className="section-title">Tentang Sehati Peduli Sesama</h2>
            <div className="prose"><p>{webSettings.about_us}</p></div>

            <div className="vm-grid" style={{ margin: '1.75rem 0' }}>
              <div className="vm-card">
                <span className="icon-box"><CheckCircle2 size={22} /></span>
                <h3>Visi Kami</h3>
                <p>{webSettings.vision}</p>
              </div>
              <div className="vm-card">
                <span className="icon-box"><ShieldCheck size={22} /></span>
                <h3>Misi Kami</h3>
                <p>{webSettings.mission}</p>
              </div>
            </div>

            <Link href="/tentang-kami" className="btn-primary">Baca Selengkapnya <ArrowRight size={16} /></Link>
          </div>

          <div className="split-img">
            <Image src="/tentangkami.png" alt="Tentang Kami" fill sizes="(max-width: 960px) 100vw, 50vw" />
            <div className="split-badge">
              <span className="icon-box"><ShieldCheck size={22} /></span>
              <span>100% Amanah & Transparan<br /><small style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>245+ Donatur percaya kami</small></span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BERITA */}
      <section className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Kabar & Berita Terkini</span>
            <h2 className="section-title">Ikuti perkembangan terbaru</h2>
            <p className="section-lead">Kisah inspiratif, laporan kegiatan, dan informasi terbaru program-program kami.</p>
          </div>
          <Link href="/berita" className="btn-outline">Lihat Semua Berita <ArrowRight size={16} /></Link>
        </div>

        <div className="grid-cards">
          {dbNews.slice(0, 3).map((item, idx) => (
            <Link key={item.id || idx} href={`/berita/${item.slug}`} className="card reveal in">
              <div className="card-img-wrapper">
                <Image src={getImageUrl(item.image)} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="card-content">
                <div className="card-meta"><span><Calendar size={13} /> {formatDate(item.created_at)}</span></div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-desc">{item.excerpt || item.content?.replace(/<[^>]*>?/gm, '').slice(0, 100) + '...'}</p>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.88rem' }}>Baca Selengkapnya →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
