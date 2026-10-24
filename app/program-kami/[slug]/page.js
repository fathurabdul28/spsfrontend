"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Home, Calendar, Heart, Share2, Search, Users, Shield, Target, ChevronDown, ArrowRight, MapPin, ExternalLink } from 'lucide-react'

import { API_BASE_URL, getImageUrl } from '../../lib/config'

export default function ProgramDetail() {
  const params = useParams()
  const slug = params?.slug

  const [program, setProgram] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAllDonors, setShowAllDonors] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  useEffect(() => {
    if (slug) {
      const fetchProgramDetail = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/programs/${slug}`)
          if (response.ok) {
            const data = await response.json()
            setProgram(data)
          }
        } catch (error) {
          console.error('Error fetching program detail:', error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchProgramDetail()
    }
  }, [slug])

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTop: '3px solid #8c1532', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Memuat program...</p>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#888' }}>Program tidak ditemukan</p>
      </div>
    )
  }

  const programDonors = program?.recent_donations || []

  const filteredDonors = programDonors.filter(d =>
    d.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const visibleDonors = showAllDonors ? filteredDonors : filteredDonors.slice(0, 2)

  // Status badge
  let statusBadge = null
  let isFinished = false
  if (program.distribution_date) {
    const distDate = new Date(program.distribution_date)
    const isNov21 = distDate.getMonth() === 10 && (distDate.getDate() === 21 || distDate.getDate() === 22)
    const dateText = isNov21 ? '21-22 Nov 2026' : distDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    const today = new Date()
    distDate.setHours(0, 0, 0, 0); today.setHours(0, 0, 0, 0)
    if (distDate > today) {
      const diffDays = Math.ceil((distDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      statusBadge = {
        text: `Akan disalurkan: ${dateText} (H-${diffDays})`,
        color: '#1a9e5c', bg: '#e6f9f0'
      }
    } else if (distDate.getTime() === today.getTime()) {
      statusBadge = { text: 'Proses penyaluran', color: '#2563eb', bg: '#eff6ff' }
    } else {
      isFinished = true
      statusBadge = { text: 'Selesai Disalurkan', color: '#059669', bg: '#ecfdf5' }
    }
  }

  const whyReasons = [
    {
      icon: <Heart size={22} />,
      bg: '#fce8ef',
      iconColor: '#c14670',
      title: 'Bantuan Langsung',
      desc: 'Donasi Anda akan disalurkan langsung kepada penerima manfaat.'
    },
    {
      icon: <Shield size={22} />,
      bg: '#e8f5e0',
      iconColor: '#1a9e5c',
      title: 'Transparan',
      desc: 'Kami memastikan setiap rupiah yang Anda donasikan tercatat dengan jelas.'
    },
    {
      icon: <Target size={22} />,
      bg: '#fff7e6',
      iconColor: '#d97706',
      title: 'Tepat Sasaran',
      desc: 'Program ini telah melalui proses verifikasi dan seleksi secara ketat.'
    },
  ]

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ========== MAIN HERO: 3-column layout ========== */}
      <section style={{ paddingTop: '1.5rem', paddingBottom: '2.5rem' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#999', marginBottom: '1.5rem' }}>
          <Home size={12} />
          <Link href="/" style={{ color: '#999' }}>Beranda</Link>
          <span>›</span>
          <Link href="/program-kami" style={{ color: '#999' }}>Program</Link>
          <span>›</span>
          <span style={{ color: '#333' }}>{program.title}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>

          {/* ---- LEFT: Info ---- */}
          <div>
            {/* Status Badge */}
            {statusBadge && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: statusBadge.bg, color: statusBadge.color,
                padding: '0.38rem 0.85rem', borderRadius: '6px',
                fontSize: '0.78rem', fontWeight: '600', marginBottom: '1rem',
                border: `1px solid ${statusBadge.color}30`
              }}>
                <Calendar size={12} />
                {statusBadge.text}
              </div>
            )}

            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', lineHeight: '1.25', color: 'var(--color-text)', marginBottom: '0.75rem' }}>
              {program.title}
            </h1>
            <div style={{ width: '40px', height: '3px', background: 'var(--color-primary)', borderRadius: '2px', marginBottom: '1rem' }} />

            {/* Lokasi Camping / Kegiatan */}
            {(program.location || program.location_url) && (
              <div style={{ marginBottom: '1.2rem' }}>
                <a
                  href={program.location_url || 'https://maps.app.goo.gl/YiQUbcE6jamPasiT9'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(140, 21, 50, 0.08)',
                    color: 'var(--color-primary)',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    textDecoration: 'none',
                    border: '1.5px solid rgba(140, 21, 50, 0.25)',
                    transition: 'all 0.2s ease'
                  }}
                  title="Buka lokasi di Google Maps"
                >
                  <MapPin size={16} />
                  <span>Lokasi: {program.location || 'Kampung Bamboe, Bandung'}</span>
                  <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                </a>
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '1.6rem', whiteSpace: 'pre-line' }}>
              {program.description}
            </p>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <Link
                href={`/donatur?program=${slug}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                  background: 'var(--color-primary)', color: '#fff',
                  padding: '0.65rem 1.4rem', borderRadius: '9999px',
                  fontWeight: '700', fontSize: '0.85rem', textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(140,21,50,0.28)',
                }}
              >
                Donasi Sekarang <ArrowRight size={14} />
              </Link>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: 'transparent', color: 'var(--color-text)',
                padding: '0.65rem 1.2rem', borderRadius: '9999px',
                fontWeight: '600', fontSize: '0.85rem',
                border: '1.5px solid var(--color-card-border)', cursor: 'pointer'
              }}>
                <Share2 size={13} /> Bagikan Program
              </button>
            </div>

            {/* Foto penyaluran button if finished */}
            {isFinished && program.distribution_photos && program.distribution_photos.length > 0 && (
              <button onClick={() => setIsModalOpen(true)} style={{
                marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                background: '#111', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '8px',
                cursor: 'pointer', border: 'none', fontWeight: '600', fontSize: '0.85rem'
              }}>
                Lihat Foto Penyaluran
              </button>
            )}
          </div>

          {/* ---- CENTER: Image ---- */}
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3' }}>
            {/* % Terkumpul badge */}
            <div style={{
              position: 'absolute', top: '0.85rem', left: '0.85rem', zIndex: 5,
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
              color: '#fff', padding: '0.28rem 0.8rem', borderRadius: '9999px',
              fontSize: '0.78rem', fontWeight: '700'
            }}>
              {program.progress}% Terkumpul
            </div>

            <Image
              src={program.image}
              alt={program.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 45vw"
              priority
            />

            {/* Bottom progress overlay */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 100%)',
              padding: '2rem 1rem 0.85rem'
            }}>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.28)', borderRadius: '4px', marginBottom: '0.45rem', overflow: 'visible', position: 'relative' }}>
                <div style={{ height: '100%', width: `${program.progress}%`, background: '#c14670', borderRadius: '4px', position: 'relative' }}>
                  <div style={{
                    position: 'absolute', right: '-5px', top: '50%', transform: 'translateY(-50%)',
                    width: '12px', height: '12px', background: '#fff', borderRadius: '50%',
                    boxShadow: '0 0 5px rgba(255,255,255,0.9)'
                  }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>
                <span>{program.collected} Terkumpul</span>
                <span>Target: {program.target}</span>
              </div>
            </div>
          </div>

          {/* ---- RIGHT: Sidebar card ---- */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <div style={{
              background: 'var(--color-card-bg)',
              borderRadius: '16px', padding: '1.5rem',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              border: '1px solid var(--color-card-border)',
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-text)', marginBottom: '1.1rem', lineHeight: '1.3' }}>
                Dukung Program Ini Sekarang
              </h3>

              {/* Progress bar */}
              <div style={{ height: '7px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.85rem' }}>
                <div style={{ height: '100%', width: `${program.progress}%`, background: 'linear-gradient(90deg, var(--color-primary), #e05c7a)', borderRadius: '4px' }} />
              </div>

              {/* Dana Terkumpul + Target */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.1rem', paddingBottom: '1.1rem', borderBottom: '1px solid var(--color-card-border)' }}>
                <div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>Dana Terkumpul</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--color-primary)' }}>{program.collected}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>Target</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1a9e5c' }}>{program.target}</p>
                </div>
              </div>

              {/* Total Donatur */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#fce8ef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c14670', flexShrink: 0 }}>
                  <Users size={16} />
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Total Donatur</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-text)' }}>{program.donors} Orang</p>
                </div>
              </div>

              {/* Kategori */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#e8f5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a9e5c', flexShrink: 0 }}>
                  <Target size={16} />
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Kategori</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-text)' }}>{program.category}</p>
                </div>
              </div>

              {/* Lokasi Camping */}
              {(program.location || program.location_url) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.4rem' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(140, 21, 50, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Lokasi Camping</p>
                    <a
                      href={program.location_url || 'https://maps.app.goo.gl/YiQUbcE6jamPasiT9'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      {program.location || 'Kampung Bamboe, Bandung'} ↗
                    </a>
                  </div>
                </div>
              )}

              {/* Donasi Button */}
              <Link href={`/donatur?program=${slug}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                background: 'var(--color-primary)', color: '#fff',
                padding: '0.85rem', borderRadius: '10px',
                fontWeight: '700', fontSize: '0.92rem', textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(140,21,50,0.25)',
              }}>
                Donasi Sekarang <ArrowRight size={16} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ========== MENGAPA BERDONASI ========== */}
      <section style={{ paddingBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-text)', marginBottom: '1.2rem' }}>
          Mengapa Berdonasi?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {whyReasons.map((r, i) => (
            <div key={i} style={{
              background: 'var(--color-card-bg)', borderRadius: '14px', padding: '1.2rem',
              border: '1px solid var(--color-card-border)', boxShadow: 'var(--shadow-sm)',
              display: 'flex', gap: '0.9rem', alignItems: 'flex-start'
            }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: r.bg, color: r.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {r.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '0.3rem' }}>{r.title}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: '1.55' }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== DAFTAR DONATUR + SIDE CARD ========== */}
      <section style={{ paddingBottom: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem', alignItems: 'start' }}>

          {/* Donor Table */}
          <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-text)' }}>
                Daftar Donatur {program.title}
              </h2>
              {programDonors.length > 0 && (
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                  <input
                    type="text"
                    placeholder="Cari nama donatur..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                      padding: '0.52rem 2.4rem 0.52rem 1rem',
                      borderRadius: '9999px',
                      border: '1.5px solid var(--color-card-border)',
                      outline: 'none', fontSize: '0.82rem',
                      background: 'var(--background)', color: 'var(--color-text)',
                      width: '200px'
                    }}
                  />
                </div>
              )}
            </div>

            {programDonors.length === 0 ? (
              <div style={{
                background: 'var(--color-card-bg)',
                borderRadius: '14px',
                border: '1px solid var(--color-card-border)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(140, 21, 50, 0.08)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem'
                }}>
                  <Heart size={20} />
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '0.3rem' }}>
                  Belum Ada Donatur
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1.2rem', maxWidth: '340px', margin: '0 auto 1.2rem' }}>
                  Dana terkumpul masih Rp 0. Jadilah orang pertama yang berdonasi dan ikut serta dalam kegiatan {program.title}!
                </p>
                <Link
                  href={`/donatur?program=${slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: 'var(--color-primary)',
                    color: '#fff',
                    padding: '0.6rem 1.4rem',
                    borderRadius: '9999px',
                    fontWeight: '700',
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(140,21,50,0.25)'
                  }}
                >
                  Donasi Sekarang <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              /* Table */
              <div style={{ background: 'var(--color-card-bg)', borderRadius: '14px', border: '1px solid var(--color-card-border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--background)' }}>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-card-border)' }}>Nama Donatur</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-card-border)' }}>Jumlah Donasi</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-card-border)' }}>Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleDonors.length > 0 ? visibleDonors.map((donor, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < visibleDonors.length - 1 ? '1px solid var(--color-card-border)' : 'none' }}>
                        <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: idx % 2 === 0 ? '#fce8ef' : '#e8f5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: idx % 2 === 0 ? '#c14670' : '#1a9e5c', flexShrink: 0, fontSize: '0.75rem', fontWeight: '700' }}>
                            {donor.name.charAt(0)}
                          </div>
                          {donor.name}
                        </td>
                        <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: 'var(--color-text)' }}>{donor.amount}</td>
                        <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{donor.date}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', fontSize: '0.85rem', color: '#aaa' }}>Donatur tidak ditemukan</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Lihat Semua button */}
                {filteredDonors.length > 2 && (
                  <div style={{ borderTop: '1px solid var(--color-card-border)', padding: '0.7rem', textAlign: 'center' }}>
                    <button
                      onClick={() => setShowAllDonors(!showAllDonors)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        background: 'transparent', border: '1.5px solid var(--color-card-border)',
                        borderRadius: '9999px', padding: '0.45rem 1.2rem',
                        fontSize: '0.82rem', fontWeight: '600', color: 'var(--color-text)',
                        cursor: 'pointer'
                      }}
                    >
                      {showAllDonors ? 'Sembunyikan' : 'Lihat Semua Donatur'}
                      <ChevronDown size={14} style={{ transform: showAllDonors ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Ajakan card */}
          <div style={{
            background: 'var(--color-card-bg)', borderRadius: '16px',
            border: '1px solid var(--color-card-border)', overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ padding: '1.3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fce8ef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c14670', flexShrink: 0 }}>
                  <Users size={17} />
                </div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--color-text)', lineHeight: '1.3' }}>
                  Ingin menjadi bagian dari perubahan?
                </h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
                Setiap donasi kecil Anda, membawa harapan besar untuk mereka yang membutuhkan.
              </p>
            </div>
            {/* Image */}
            <div style={{ position: 'relative', height: '140px' }}>
              <Image
                src={program.image}
                alt="Dampak program"
                fill
                style={{ objectFit: 'cover' }}
                sizes="250px"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Modal foto penyaluran */}
      {isModalOpen && program.distribution_photos && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '90%', maxWidth: '800px', background: '#fff', borderRadius: '16px', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ alignSelf: 'flex-end', background: 'transparent', border: 'none', fontSize: '2rem', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
            <div style={{ position: 'relative', width: '100%', height: '60vh', minHeight: '300px' }}>
              <Image src={getImageUrl(program.distribution_photos[currentPhotoIndex])} alt={`Foto Penyaluran ${currentPhotoIndex + 1}`} fill style={{ objectFit: 'contain' }} sizes="80vw" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <button disabled={currentPhotoIndex === 0} onClick={() => setCurrentPhotoIndex(p => p - 1)} style={{ padding: '0.5rem 1rem', background: '#eee', border: 'none', borderRadius: '4px', cursor: currentPhotoIndex === 0 ? 'not-allowed' : 'pointer' }}>Prev</button>
              <span style={{ fontWeight: 'bold' }}>{currentPhotoIndex + 1} / {program.distribution_photos.length}</span>
              <button disabled={currentPhotoIndex === program.distribution_photos.length - 1} onClick={() => setCurrentPhotoIndex(p => p + 1)} style={{ padding: '0.5rem 1rem', background: '#eee', border: 'none', borderRadius: '4px', cursor: currentPhotoIndex === program.distribution_photos.length - 1 ? 'not-allowed' : 'pointer' }}>Next</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
