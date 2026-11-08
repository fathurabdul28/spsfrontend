"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Users, GraduationCap, Activity, Home, HeartHandshake, Search, Heart, Share2, Calendar, MapPin, ChevronRight } from 'lucide-react'
import { API_BASE_URL } from '../lib/config'
import { getDistributionInfo } from '../lib/distribution'

const DEFAULT_MAPS_URL = 'https://maps.app.goo.gl/YiQUbcE6jamPasiT9'
const DEFAULT_LOCATION = 'Kampung Bamboe, Bandung'

const IMPACT_DATA = [
  { category: 'Pendidikan', image: '/pendidikan.jpg', description: 'Membuka akses belajar bagi anak-anak di daerah terpencil agar mereka meraih masa depan yang lebih baik.', badge: '120+ Anak Dibantu', icon: <GraduationCap size={22} /> },
  { category: 'Pemberdayaan', image: '/campingceria.png', description: 'Memberdayakan masyarakat melalui pelatihan dan dukungan usaha berkelanjutan.', badge: '85+ Keluarga Terbantu', icon: <HeartHandshake size={22} /> },
  { category: 'Bencana', image: '/fotobencanalam.jpg', description: 'Memberikan bantuan cepat dan tepat untuk meringankan beban para korban bencana.', badge: '300+ Paket Disalurkan', icon: <Home size={22} /> },
]

export default function ProgramKami() {
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [programs, setPrograms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
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

  const featuredBadge = featuredProgram ? getDistributionInfo(featuredProgram.distribution_date) : null
  const featuredProgress = Math.min(featuredProgram?.progress || 0, 100)

  return (
    <>
      {featuredProgram && (
        <section className="page-hero">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Home size={13} />
            <Link href="/">Beranda</Link>
            <ChevronRight size={13} />
            <Link href="/program-kami">Program</Link>
            <ChevronRight size={13} />
            <span className="current">{featuredProgram.title}</span>
          </nav>

          <div className="featured">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
              <h1>{featuredProgram.title}</h1>

              {featuredBadge && (
                <span className={`tag tag-${featuredBadge.type}`}><Calendar size={13} /> {featuredBadge.text}</span>
              )}

              <p style={{ color: 'var(--color-text-muted)', whiteSpace: 'pre-line' }}>{featuredProgram.description}</p>

              {(featuredProgram.location || featuredProgram.location_url) && (
                <a className="pill-link" href={featuredProgram.location_url || DEFAULT_MAPS_URL} target="_blank" rel="noopener noreferrer" title="Buka lokasi di Google Maps">
                  <MapPin size={15} /> Lokasi: {featuredProgram.location || DEFAULT_LOCATION} ↗
                </a>
              )}

              <div style={{ width: '100%' }}>
                <div className="progress"><div className="progress-fill" style={{ width: `${featuredProgress}%` }} /></div>
                <div className="progress-meta">
                  <span><strong>{featuredProgram.collected}</strong> terkumpul ({featuredProgram.progress}%)</span>
                  <span>Target: {featuredProgram.target}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href={`/donatur?program=${featuredProgram.slug}`} className="btn-primary btn-lg">
                  Donasi Sekarang <Heart size={16} />
                </Link>
                <button className="btn-outline btn-lg" type="button"><Share2 size={16} /> Bagikan Program</button>
              </div>
            </div>

            <div className="featured-img">
              <Image src={featuredProgram.image} alt={featuredProgram.title} fill sizes="(max-width: 960px) 100vw, 55vw" priority />
              <span className="chip">{featuredProgram.progress}% Terkumpul</span>
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: '1.5rem' }}>
        <div className="toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              className="form-input"
              placeholder="Cari program..."
              aria-label="Cari program"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            />
          </div>
          <div className="chips">
            {filterConfig.map(f => (
              <button key={f.key} onClick={() => handleFilterClick(f.key)} className={`filter-chip${activeFilter === f.key ? ' active' : ''}`}>
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading && <div className="loading">Memuat program...</div>}
        {!isLoading && currentPrograms.length === 0 && <div className="empty">Program tidak ditemukan.</div>}

        {!isLoading && currentPrograms.length > 0 && (
          <>
            <div className="grid-cards">
              {currentPrograms.map((prog, idx) => {
                const badge = getDistributionInfo(prog.distribution_date)
                const progress = Math.min(prog.progress || 0, 100)
                return (
                  <article key={prog.slug || idx} className="card hoverable">
                    <div className="card-img-wrapper">
                      <Image src={prog.image} alt={prog.title} fill
                        style={{ objectFit: prog.image === '/sehati.logo.png' ? 'contain' : 'cover' }}
                        sizes="(max-width: 768px) 100vw, 33vw" priority={idx === 0} />
                    </div>
                    <div className="card-content">
                      {badge && <span className={`tag tag-${badge.type}`}><Calendar size={12} /> {badge.text}</span>}
                      <h3 className="card-title">{prog.title}</h3>
                      {(prog.location || prog.location_url) && (
                        <div className="card-meta">
                          <a href={prog.location_url || DEFAULT_MAPS_URL} target="_blank" rel="noopener noreferrer" title="Buka lokasi di Google Maps">
                            <MapPin size={13} />{prog.location || DEFAULT_LOCATION} ↗
                          </a>
                        </div>
                      )}
                      <div>
                        <div className="progress"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                        <div className="progress-meta"><span><strong>{prog.progress}%</strong> terkumpul</span><span>Target: {prog.target}</span></div>
                      </div>
                      <div className="card-footer">
                        <Link href={`/donatur?program=${prog.slug}`} className="btn-primary">Donasi</Link>
                        <Link href={`/program-kami/${prog.slug}`} className="btn-outline">Detail</Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} className={`page-btn${page === currentPage ? ' active' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>
                ))}
                <button className="page-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
              </div>
            )}
          </>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Dampak</span>
            <h2 className="section-title">Dampak Program Secara Menyeluruh</h2>
            <p className="section-lead">Setiap langkah kecil kita, membawa perubahan besar bagi mereka yang membutuhkan.</p>
          </div>
        </div>
        <div className="impact-grid">
          {IMPACT_DATA.map((item) => (
            <div key={item.category} className="card impact-card">
              <div className="impact-thumb"><Image src={item.image} alt={item.category} fill sizes="(max-width: 768px) 100vw, 33vw" /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="icon-box">{item.icon}</span>
                <h3 className="card-title">{item.category}</h3>
              </div>
              <p className="card-desc">{item.description}</p>
              <span className="tag tag-done">{item.badge}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
