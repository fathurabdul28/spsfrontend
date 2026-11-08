"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, Share2 } from 'lucide-react'

import { API_BASE_URL, getImageUrl } from '../lib/config'

const CATEGORIES = ['Kegiatan & Donasi', 'Program', 'Tentang Kami', 'Donasi']

const getImageSrc = (image) => getImageUrl(image, '/pendidikan.jpg')

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/news`)
      .then(r => r.json())
      .then(data => { if (data.success) setPosts(data.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Memuat berita terbaru...</div>

  const featuredPost = posts[0] ?? null

  return (
    <section className="page-hero">
      {featuredPost && (
        <div className="news-featured">
          <div className="img">
            <Image src={getImageSrc(featuredPost.image)} alt={featuredPost.title} fill sizes="(max-width: 960px) 100vw, 50vw" priority />
          </div>
          <div className="body">
            <span className="eyebrow" style={{ marginBottom: 0 }}>Berita Terbaru</span>
            <h1>{featuredPost.title}</h1>
            <p>{featuredPost.excerpt}</p>
            <Link href={`/berita/${featuredPost.slug}`} className="btn-primary">Baca Selengkapnya →</Link>
          </div>
        </div>
      )}

      <div className="news-layout">
        <div className="news-list">
          {posts.length === 0 ? (
            <p className="empty" style={{ gridColumn: '1 / -1' }}>Belum ada berita tersedia.</p>
          ) : posts.map((post) => (
            <Link key={post.slug} href={`/berita/${post.slug}`} className="card">
              <div className="card-img-wrapper">
                <Image src={getImageSrc(post.image)} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="card-content">
                <span className="tag tag-today" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>Kegiatan & Donasi</span>
                <h3 className="card-title">{post.title}</h3>
                <p className="card-desc">{post.excerpt}</p>
                <div className="card-meta" style={{ marginTop: 'auto' }}>{post.date} | By {post.author}</div>
              </div>
            </Link>
          ))}
        </div>

        <aside className="aside">
          <div className="aside-box">
            <h3>Kategori Populer</h3>
            <div className="chips">
              {CATEGORIES.map(cat => <span key={cat} className="filter-chip">{cat}</span>)}
            </div>
          </div>

          <div className="aside-box">
            <h3>Berita Terbaru</h3>
            {posts.slice(0, 4).map((post) => (
              <Link key={post.slug} href={`/berita/${post.slug}`} className="recent">
                <div className="t"><Image src={getImageSrc(post.image)} alt={post.title} fill sizes="72px" /></div>
                <div>
                  <h4>{post.title}</h4>
                  <small>{post.date} | {post.author}</small>
                </div>
              </Link>
            ))}
          </div>

          <div className="aside-box">
            <h3>Kontak & Sosial</h3>
            <a className="contact-line" href="https://wa.me/6285862604177" target="_blank" rel="noopener noreferrer">
              <Phone size={15} /> +6285862604177
            </a>
            <a className="contact-line" href="https://www.tiktok.com/@papeha" target="_blank" rel="noopener noreferrer">
              <Share2 size={15} /> TikTok: <strong>@papeha</strong>
            </a>
            <a className="contact-line" href="https://www.instagram.com/sehatipedulisesama/" target="_blank" rel="noopener noreferrer">
              <Share2 size={15} /> Instagram: <strong>@sehatipedulisesama</strong>
            </a>
            <small style={{ display: 'block', marginTop: '0.75rem', color: 'var(--color-text-muted)' }}>© Sehati Peduli Sesama</small>
          </div>
        </aside>
      </div>
    </section>
  )
}
