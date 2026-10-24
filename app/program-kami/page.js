"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Users, GraduationCap, Activity, Home, HeartHandshake, Search, Heart, Share2, Calendar, MapPin } from 'lucide-react'
import { API_BASE_URL } from '../lib/config'

export default function ProgramKami() {
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [programs, setPrograms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [impactSlide, setImpactSlide] = useState(0)
  const itemsPerPage = 6

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/programs`)
        if (response.ok) {
          const data = await response.json()
          setPrograms(data)
        }
      } catch (error) {
        console.error('Error fetching programs:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPrograms()
  }, [])

  const filterConfig = [
    { label: 'Semua Program', key: 'Semua', icon: <Users size={15} /> },
    { label: 'Pendidikan', key: 'Pendidikan', icon: <GraduationCap size={15} /> },
    { label: 'Kesehatan', key: 'Kesehatan', icon: <Activity size={15} /> },
    { label: 'Bencana', key: 'Bencana', icon: <Home size={15} /> },
    { label: 'Pemberdayaan', key: 'Pemberdayaan', icon: <HeartHandshake size={15} /> },
  ]

  const sortedAllPrograms = [...programs].sort((a, b) => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const dateA = a.distribution_date ? new Date(a.distribution_date) : null
    const dateB = b.distribution_date ? new Date(b.distribution_date) : null
    if (dateA) dateA.setHours(0, 0, 0, 0)
    if (dateB) dateB.setHours(0, 0, 0, 0)
    const getStatus = d => { if (!d) return 4; if (d > today) return 1; if (d.getTime() === today.getTime()) return 2; return 3 }
    const sA = getStatus(dateA), sB = getStatus(dateB)
    if (sA !== sB) return sA - sB
    if (sA === 1) return dateA.getTime() - dateB.getTime()
    if (sA === 3) return dateB.getTime() - dateA.getTime()
    return 0
  })

  const featuredProgram = sortedAllPrograms[0] || null

  const filteredPrograms = (activeFilter === 'Semua' ? sortedAllPrograms : sortedAllPrograms.filter(p => p.category === activeFilter))
    .filter(p => searchQuery === '' || p.title?.toLowerCase().includes(searchQuery.toLowerCase()))

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage)
  const currentPrograms = filteredPrograms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleFilterClick = (key) => { setActiveFilter(key); setCurrentPage(1) }

  const getFeaturedBadge = (prog) => {
    if (!prog?.distribution_date) return null
    const distDate = new Date(prog.distribution_date)
    const isNov28 = distDate.getMonth() === 10 && (distDate.getDate() === 28 || distDate.getDate() === 29)
    const dateText = isNov28 ? '28-29 Nov 2026' : distDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    const today = new Date()
    distDate.setHours(0, 0, 0, 0); today.setHours(0, 0, 0, 0)
    if (distDate > today) {
      const diffDays = Math.ceil((distDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return { text: `Akan disalurkan: ${dateText} (H-${diffDays})`, color: '#1a9e5c', bg: '#e6f9f0' }
    } else if (distDate.getTime() === today.getTime()) {
      return { text: 'Proses penyaluran', color: '#2563eb', bg: '#eff6ff' }
    } else {
      return { text: 'Selesai Disalurkan', color: '#059669', bg: '#ecfdf5' }
    }
  }

  const getCardBadge = (prog) => {
    if (!prog.distribution_date) return null
    const distDate = new Date(prog.distribution_date)
    const isNov28 = distDate.getMonth() === 10 && (distDate.getDate() === 28 || distDate.getDate() === 29)
    const dateText = isNov28 ? '28-29 Nov 2026' : distDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    const today = new Date()
    distDate.setHours(0, 0, 0, 0); today.setHours(0, 0, 0, 0)
    if (distDate > today) {
      const diffDays = Math.ceil((distDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return { text: `Akan disalurkan: ${dateText} (H-${diffDays})`, type: 'upcoming' }
    } else if (distDate.getTime() === today.getTime()) {
      return { text: 'Proses penyaluran', type: 'today' }
    } else {
      return { text: 'Selesai Disalurkan', type: 'done' }
    }
  }

  const badgeColors = {
    upcoming: { bg: '#fff7e6', color: '#b45309' },
    today: { bg: '#eff6ff', color: '#2563eb' },
    done: { bg: '#ecfdf5', color: '#059669' }
  }

  const impactData = [
    {
      category: 'Pendidikan',
      image: '/pendidikan.jpg',
      description: 'Membuka akses belajar bagi anak-anak di daerah terpencil agar mereka meraih masa depan yang lebih baik.',
      badge: '120+ Anak Dibantu',
      badgeColor: '#1a9e5c',
      bgColor: '#e8f5e0',
      iconColor: '#1a9e5c',
      icon: <GraduationCap size={22} />,
    },
    {
      category: 'Pemberdayaan',
      image: '/campingceria.png',
      description: 'Memberdayakan masyarakat melalui pelatihan dan dukungan usaha berkelanjutan.',
      badge: '85+ Keluarga Terbantu',
      badgeColor: '#2563eb',
      bgColor: '#e8eeff',
      iconColor: '#2563eb',
      icon: <HeartHandshake size={22} />,
    },
    {
      category: 'Bencana',
      image: '/fotobencanalam.jpg',
      description: 'Memberikan bantuan cepat dan tepat untuk meringankan beban para korban bencana.',
      badge: '300+ Paket Disalurkan',
      badgeColor: '#d97706',
      bgColor: '#fff7ed',
      iconColor: '#d97706',
      icon: <Home size={22} />,
    },
  ]

  const featuredBadge = featuredProgram ? getFeaturedBadge(featuredProgram) : null

  return (
    <>
      {/* HERO: Featured Program */}
      {featuredProgram && (
        <section style={{ paddingTop: '1.5rem', paddingBottom: '2.5rem' }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#888', marginBottom: '1.5rem' }}>
            <Home size={13} style={{ color: '#888' }} />
            <Link href="/" style={{ color: '#888' }}>Beranda</Link>
            <span>›</span>
            <Link href="/program-kami" style={{ color: '#888' }}>Program</Link>
            <span>›</span>
            <span style={{ color: '#333' }}>{featuredProgram.title}</span>
          </nav>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem', alignItems: 'center' }}>
            {/* Left: Info */}
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', lineHeight: '1.25', color: 'var(--color-text)', marginBottom: '1rem' }}>
                {featuredProgram.title}
              </h1>
              <div style={{ width: '48px', height: '3px', background: 'var(--color-primary)', borderRadius: '2px', marginBottom: '1rem' }} />

              {featuredBadge && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  background: featuredBadge.bg, color: featuredBadge.color,
                  padding: '0.4rem 0.9rem', borderRadius: '6px',
                  fontSize: '0.82rem', fontWeight: '600', marginBottom: '1rem',
                  border: `1px solid ${featuredBadge.color}40`
                }}>
                  <Calendar size={13} />
                  {featuredBadge.text}
                </div>
              )}

              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '1.2rem', whiteSpace: 'pre-line' }}>
                {featuredProgram.description}
              </p>

              {(featuredProgram.location || featuredProgram.location_url) && (
                <div style={{ marginBottom: '1.6rem' }}>
                  <a
                    href={featuredProgram.location_url || 'https://maps.app.goo.gl/YiQUbcE6jamPasiT9'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: 'rgba(140, 21, 50, 0.08)',
                      color: 'var(--color-primary)',
                      padding: '0.4rem 0.95rem',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      fontWeight: '700',
                      textDecoration: 'none',
                      border: '1px solid rgba(140, 21, 50, 0.25)',
                      transition: 'all 0.2s'
                    }}
                    title="Buka lokasi di Google Maps"
                  >
                    <MapPin size={15} />
                    <span>Lokasi: {featuredProgram.location || 'Kampung Bamboe, Bandung'}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>↗</span>
                  </a>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link
                  href={`/donatur?program=${featuredProgram.slug}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: 'var(--color-primary)', color: '#fff',
                    padding: '0.7rem 1.5rem', borderRadius: '9999px',
                    fontWeight: '700', fontSize: '0.88rem', textDecoration: 'none',
                    boxShadow: '0 4px 15px rgba(140,21,50,0.25)',
                  }}
                >
                  Donasi Sekarang
                  <Heart size={14} fill="white" />
                </Link>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: 'transparent', color: 'var(--color-text)',
                  padding: '0.7rem 1.3rem', borderRadius: '9999px',
                  fontWeight: '600', fontSize: '0.88rem',
                  border: '1.5px solid var(--color-card-border)',
                  cursor: 'pointer'
                }}>
                  <Share2 size={14} />
                  Bagikan Program
                </button>
              </div>
            </div>

            {/* Right: Image with progress overlay */}
            <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', aspectRatio: '16/11' }}>
              <div style={{
                position: 'absolute', top: '1rem', left: '1rem', zIndex: 5,
                background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
                color: '#fff', padding: '0.3rem 0.85rem', borderRadius: '9999px',
                fontSize: '0.8rem', fontWeight: '700'
              }}>
                {featuredProgram.progress}% Terkumpul
              </div>

              <button style={{
                position: 'absolute', bottom: '3.5rem', right: '1rem', zIndex: 5,
                background: '#fff', border: 'none', borderRadius: '50%',
                width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <Heart size={15} color="#c14670" />
              </button>

              <Image
                src={featuredProgram.image}
                alt={featuredProgram.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />

              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                padding: '2rem 1.2rem 0.9rem'
              }}>
                <div style={{ height: '7px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px', marginBottom: '0.5rem', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${featuredProgram.progress}%`, background: '#fff', borderRadius: '4px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute', right: '-5px', top: '50%', transform: 'translateY(-50%)',
                      width: '12px', height: '12px', background: '#fff', borderRadius: '50%',
                      boxShadow: '0 0 6px rgba(255,255,255,0.9)'
                    }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>
                  <span>{featuredProgram.collected}</span>
                  <span>Target: {featuredProgram.target}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FILTER BAR */}
      <section style={{ paddingBottom: '2rem' }}>
        <div style={{
          display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center',
          background: 'var(--color-card-bg)', borderRadius: '14px',
          padding: '0.7rem 1rem',
          border: '1px solid var(--color-card-border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '160px', maxWidth: '260px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
            <input
              type="text"
              placeholder="Cari program..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              style={{
                width: '100%', padding: '0.58rem 0.9rem 0.58rem 2.3rem',
                borderRadius: '9999px', border: '1.5px solid var(--color-card-border)',
                outline: 'none', background: 'var(--background)',
                color: 'var(--color-text)', fontSize: '0.85rem'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {filterConfig.map(f => (
              <button
                key={f.key}
                onClick={() => handleFilterClick(f.key)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.52rem 1rem', borderRadius: '9999px',
                  border: activeFilter === f.key ? 'none' : '1.5px solid var(--color-card-border)',
                  background: activeFilter === f.key ? 'var(--color-primary)' : 'transparent',
                  color: activeFilter === f.key ? '#fff' : 'var(--color-text-muted)',
                  fontWeight: activeFilter === f.key ? '700' : '500',
                  fontSize: '0.83rem', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAM GRID */}
      {!isLoading && currentPrograms.length > 0 && (
        <section style={{ paddingBottom: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
            {currentPrograms.map((prog, idx) => {
              const badge = getCardBadge(prog)
              return (
                <div key={idx} style={{
                  background: 'var(--color-card-bg)', borderRadius: '16px',
                  border: '1px solid var(--color-card-border)',
                  overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ position: 'relative', height: '195px' }}>
                    <Image src={prog.image} alt={prog.title} fill
                      style={{ objectFit: prog.image === '/sehati.logo.png' ? 'contain' : 'cover' }}
                      sizes="(max-width: 768px) 100vw, 33vw" priority={idx === 0}
                    />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.72), transparent)',
                      padding: '1.5rem 1rem 0.55rem'
                    }}>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px', marginBottom: '0.4rem', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${prog.progress}%`, background: '#fff', borderRadius: '4px' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>
                        <span>{prog.progress}% Terkumpul</span>
                        <span>Target: {prog.target}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {badge && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        background: badgeColors[badge.type]?.bg, color: badgeColors[badge.type]?.color,
                        padding: '0.22rem 0.6rem', borderRadius: '4px',
                        fontSize: '0.7rem', fontWeight: '600', marginBottom: '0.5rem', width: 'fit-content'
                      }}>
                        <Calendar size={10} /> {badge.text}
                      </span>
                    )}
                    <h3 style={{ fontSize: '0.97rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--color-text)' }}>{prog.title}</h3>
                    {(prog.location || prog.location_url) && (
                      <div style={{ marginBottom: '0.85rem' }}>
                        <a
                          href={prog.location_url || 'https://maps.app.goo.gl/YiQUbcE6jamPasiT9'}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            color: 'var(--color-primary)',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            textDecoration: 'none'
                          }}
                          title="Buka lokasi di Google Maps"
                        >
                          <MapPin size={13} />
                          <span>{prog.location || 'Kampung Bamboe, Bandung'} ↗</span>
                        </a>
                      </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: 'auto' }}>
                      <Link href={`/donatur?program=${prog.slug}`} style={{
                        textAlign: 'center', background: 'var(--color-primary)', color: '#fff',
                        padding: '0.62rem 0.5rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem',
                        textDecoration: 'none'
                      }}>
                        Donasi
                      </Link>
                      <Link href={`/program-kami/${prog.slug}`} style={{
                        textAlign: 'center', background: 'transparent', color: 'var(--color-text)',
                        border: '1.5px solid var(--color-card-border)',
                        padding: '0.62rem 0.5rem', borderRadius: '8px', fontWeight: '600', fontSize: '0.85rem',
                        textDecoration: 'none'
                      }}>
                        Detail
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1.5px solid var(--color-card-border)', background: 'var(--color-card-bg)', color: currentPage === 1 ? '#aaa' : 'var(--color-text)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)}
                  style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: page === currentPage ? 'var(--color-primary)' : 'var(--color-card-bg)', color: page === currentPage ? '#fff' : 'var(--color-text)', fontWeight: page === currentPage ? '700' : '400', cursor: 'pointer' }}>
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1.5px solid var(--color-card-border)', background: 'var(--color-card-bg)', color: currentPage === totalPages ? '#aaa' : 'var(--color-text)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>
                Next
              </button>
            </div>
          )}
        </section>
      )}

      {/* DAMPAK PROGRAM SECTION */}
      <section style={{ padding: '2.5rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2.5rem', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', lineHeight: '1.25', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
              Dampak Program<br /><span style={{ color: 'var(--color-primary)' }}>Secara Menyeluruh</span>
            </h2>
            <div style={{ width: '40px', height: '3px', background: 'var(--color-primary)', borderRadius: '2px', marginBottom: '1rem' }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.65', marginBottom: '1.5rem' }}>
              Setiap langkah kecil kita, membawa perubahan besar bagi mereka yang membutuhkan.
            </p>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {impactData.map((_, i) => (
                <button key={i} onClick={() => setImpactSlide(i)} style={{
                  width: i === impactSlide ? '22px' : '8px', height: '8px',
                  borderRadius: '9999px', border: 'none',
                  background: i === impactSlide ? 'var(--color-primary)' : '#ddd',
                  cursor: 'pointer', padding: 0, transition: 'width 0.3s, background 0.3s'
                }} />
              ))}
            </div>
          </div>

          <div style={{ overflow: 'hidden' }}>
            <div style={{
              display: 'flex', gap: '1.2rem',
              transform: `translateX(calc(-${impactSlide * (100 / 3 + 100 / 3 * 0.04)}%))`,
              transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
            }}>
              {impactData.map((item, idx) => (
                <div key={idx} style={{
                  minWidth: 'calc(33.333% - 0.8rem)',
                  background: 'var(--color-card-bg)',
                  borderRadius: '16px',
                  border: '1px solid var(--color-card-border)',
                  padding: '1.2rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex', flexDirection: 'column', gap: '0.8rem'
                }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '46px', height: '46px', borderRadius: '12px',
                      background: item.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: item.iconColor, flexShrink: 0
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ position: 'relative', flex: 1, height: '78px', borderRadius: '10px', overflow: 'hidden' }}>
                      <Image src={item.image} alt={item.category} fill style={{ objectFit: 'cover' }} sizes="120px" />
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '0.25rem' }}>{item.category}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: '1.55' }}>{item.description}</p>
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center',
                    background: item.bgColor, color: item.badgeColor,
                    padding: '0.28rem 0.75rem', borderRadius: '9999px',
                    fontSize: '0.73rem', fontWeight: '700', width: 'fit-content'
                  }}>
                    {item.badge}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
