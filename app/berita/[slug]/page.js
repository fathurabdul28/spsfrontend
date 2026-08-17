"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Calendar, User } from 'lucide-react'

import { API_BASE_URL, getImageUrl } from '../../lib/config'

function getImageSrc(image) {
  return getImageUrl(image, '/pendidikan.jpg')
}

export default function BeritaDetail() {
  const params = useParams()
  const slug = params?.slug
  const [post, setPost] = useState(null)
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return

    // Fetch current post
    fetch(`${API_BASE_URL}/news/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found')
        return r.json()
      })
      .then(data => {
        if (data.success) setPost(data.data)
        else setNotFound(true)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))

    // Fetch recent posts for sidebar
    fetch(`${API_BASE_URL}/news`)
      .then(r => r.json())
      .then(data => { if (data.success) setRecentPosts(data.data) })
      .catch(console.error)
  }, [slug])

  if (loading) {
    return (
      <div style={{ padding: '6rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
        Memuat berita...
      </div>
    )
  }

  if (notFound || !post) {
    return (
      <div style={{ padding: '6rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Berita tidak ditemukan.</p>
        <Link href="/berita" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>← Kembali ke Berita</Link>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>

        {/* Breadcrumb */}
        <Link href="/berita" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.9rem',
          marginBottom: '2rem', fontWeight: '500'
        }}>
          <ArrowLeft size={16} />
          Kembali ke Blog
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '3rem', alignItems: 'start' }}>

          {/* Main Article */}
          <article>
            {/* Hero Image */}
            <div style={{ position: 'relative', height: '420px', borderRadius: '20px', overflow: 'hidden', marginBottom: '2rem' }}>
              <Image
                src={getImageSrc(post.image)}
                alt={post.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              {/* Gradient overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
                <span style={{
                  background: 'var(--color-primary)', color: 'white',
                  padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700'
                }}>
                  Kegiatan & Donasi
                </span>
              </div>
            </div>

            {/* Title & Meta */}
            <h1 style={{
              fontSize: '2.2rem', fontWeight: '900', color: 'var(--color-text)',
              lineHeight: '1.3', marginBottom: '1rem'
            }}>
              {post.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={15} /> {post.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={15} /> By {post.author}
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: '2px', background: 'linear-gradient(to right, var(--color-primary), transparent)', marginBottom: '2rem', borderRadius: '2px' }} />

            {/* Content */}
            <div style={{
              fontSize: '1.05rem', lineHeight: '1.9', color: 'var(--color-text)',
              whiteSpace: 'pre-wrap'
            }}>
              {post.content}
            </div>

            {/* Footer */}
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--color-card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link href="/berita" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600'
              }}>
                <ArrowLeft size={16} /> Berita Lainnya
              </Link>
              <Link href="/donatur" className="btn-primary-glow" style={{ fontSize: '0.9rem' }}>
                Donasi Sekarang
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: '6rem' }}>
            {/* Recent Posts */}
            <div style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '1.5rem', paddingBottom: '0.8rem', borderBottom: '2px solid var(--color-primary)' }}>
                Berita Terkini
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {recentPosts.filter(p => p.slug !== slug).slice(0, 4).map((p, i) => (
                  <Link key={i} href={`/berita/${p.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '72px', height: '56px', borderRadius: '8px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      <Image src={getImageSrc(p.image)} alt={p.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '0.25rem', lineHeight: '1.3' }}>
                        {p.title}
                      </h4>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{p.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div style={{ background: 'linear-gradient(135deg, var(--color-primary), #e91e8c)', borderRadius: '16px', padding: '2rem', textAlign: 'center', color: 'white' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.8rem' }}>Yuk Ikut Berdonasi!</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '1.5rem', lineHeight: '1.5' }}>
                Setiap rupiah yang Anda berikan membawa harapan bagi mereka yang membutuhkan.
              </p>
              <Link href="/donatur" style={{
                display: 'block', background: 'white', color: 'var(--color-primary)',
                padding: '0.8rem', borderRadius: '12px', fontWeight: '700',
                textDecoration: 'none', fontSize: '0.9rem'
              }}>
                Donasi Sekarang ❤️
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
