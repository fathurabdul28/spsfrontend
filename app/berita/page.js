"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { API_BASE_URL, getImageUrl } from '../lib/config'

function getImageSrc(image) {
  return getImageUrl(image, '/pendidikan.jpg')
}

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [featuredPost, setFeaturedPost] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/news`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setPosts(data.data)
          setFeaturedPost(data.data[0] ?? null)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const categories = ["Kegiatan & Donasi", "Program", "Tentang Kami", "Donasi"]

  if (loading) {
    return (
      <div style={{ padding: '6rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
        Memuat berita terbaru...
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container" style={{ paddingTop: '3rem' }}>

        {/* Banner Section — Latest News */}
        {featuredPost && (
          <section className="berita-featured-section" style={{
            background: 'var(--color-card-border)',
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '3rem',
            position: 'relative'
          }}>
            {/* Watermark */}
            <div style={{ position: 'absolute', right: '-5%', top: '-20%', opacity: 0.1, zIndex: 0, transform: 'scale(1.5)', width: '400px', height: '400px' }}>
              <Image src="/sehati.logo.png" alt="Watermark" fill sizes="400px" style={{ objectFit: 'contain' }} priority loading="eager" />
            </div>

            <div className="berita-featured-img" style={{ width: '40%', position: 'relative', height: '300px', zIndex: 1 }}>
              <Image
                src={getImageSrc(featuredPost.image)}
                alt={featuredPost.title}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectFit: 'contain', objectPosition: 'bottom left', padding: '1rem' }}
              />
            </div>
            <div className="berita-featured-content">
              <p style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Berita Terbaru
              </p>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-text)', lineHeight: '1.2', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                {featuredPost.title}
              </h1>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                {featuredPost.excerpt}
              </p>
              <Link href={`/berita/${featuredPost.slug}`} style={{
                display: 'inline-block',
                padding: '0.8rem 1.5rem',
                background: 'var(--color-primary)',
                color: 'white',
                borderRadius: '30px',
                fontWeight: '600',
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}>
                BACA SELENGKAPNYA →
              </Link>
            </div>
          </section>
        )}

        {/* Main Content Layout */}
        <div className="berita-main-grid">

          {/* Left Column - Blog Grid */}
          <div className="berita-list-grid">
            {posts.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', gridColumn: '1/-1' }}>Belum ada berita tersedia.</p>
            ) : posts.map((post, i) => (
              <Link key={i} href={`/berita/${post.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--color-card-bg)',
                  borderRadius: '16px',
                  border: `2px solid var(--color-primary)30`,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)',
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
                >
                  <div style={{ position: 'relative', height: '220px', width: '100%', padding: '1rem', background: 'var(--color-card-bg)' }}>
                    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden' }}>
                      <Image src={getImageSrc(post.image)} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                    </div>
                  </div>

                  <div style={{ padding: '0 1.5rem 1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '0.8rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.4rem 1rem',
                        background: 'var(--color-primary)',
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        Kegiatan & Donasi
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-text)', marginBottom: '0.8rem', lineHeight: '1.4' }}>
                      {post.title}
                    </h3>

                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1.5rem', flexGrow: 1 }}>
                      {post.excerpt}
                    </p>

                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>
                      {post.date} | By {post.author}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Column - Sidebar */}
          <div>

            {/* Categories */}
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '1rem' }}>Popular Kategories</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {categories.map(cat => (
                  <span key={cat} style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid var(--color-card-border)',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer'
                  }}>
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '1.5rem' }}>Recent Posts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {posts.slice(0, 4).map((post, i) => (
                  <Link key={i} href={`/berita/${post.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                      <Image src={getImageSrc(post.image)} alt={post.title} fill sizes="80px" style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '0.3rem', lineHeight: '1.3' }}>
                        {post.title}
                      </h4>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {post.date} | {post.author}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div style={{ background: 'var(--color-card-border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '0.5rem' }}>Newsletter</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: '1.5' }}>
                Daftarkan email Anda untuk mendapatkan berita terbaru.
              </p>
              <div style={{ display: 'flex' }}>
                <input
                  type="email"
                  placeholder="Email address"
                  style={{
                    flexGrow: 1,
                    padding: '0.6rem 1rem',
                    border: '1px solid var(--color-card-border)',
                    background: 'var(--color-card-bg)',
                    color: 'var(--color-text)',
                    borderRadius: '20px 0 0 20px',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                />
                <button style={{
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  padding: '0 1.2rem',
                  borderRadius: '0 20px 20px 0',
                  cursor: 'pointer'
                }}>
                  ➔
                </button>
              </div>
            </div>

            {/* Contact */}
            <div style={{ background: 'var(--color-card-border)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.8rem', color: 'var(--color-text)' }}>Contact</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <a
                      href="https://wa.me/6285862604177"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                    >
                      <span>📞</span> +6285862604177
                    </a>
                    <span>🌐 Follow us</span>
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.8rem', color: 'var(--color-text)' }}>Social</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <a
                      href="https://www.tiktok.com/@papeha"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                    >
                      TikTok: <span style={{ fontWeight: '600' }}>@papeha</span>
                    </a>
                    <a
                      href="https://www.instagram.com/sehatipedulisesama/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                    >
                      Instagram: <span style={{ fontWeight: '600' }}>@sehatipedulisesama</span>
                    </a>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-text-muted)', fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                © Sehati Peduli Sesama
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
