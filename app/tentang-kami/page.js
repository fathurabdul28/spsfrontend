import Image from 'next/image'
import Link from 'next/link'
import { Home, Users, Target, Telescope, ChevronRight, CheckCircle2 } from 'lucide-react'

const MISI_LIST = [
  'Menyelenggarakan program sosial, pendidikan, kesehatan, dan pemberdayaan masyarakat.',
  'Menyalurkan bantuan secara tepat sasaran dan berkelanjutan.',
  'Membangun transparansi dan akuntabilitas dalam setiap program yang dijalankan.',
  'Mengajak lebih banyak orang untuk peduli dan berkontribusi dalam kebaikan.',
]

export default function TentangKami() {
  return (
    <>
      <section className="page-hero">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Home size={13} />
          <Link href="/">Beranda</Link>
          <ChevronRight size={13} />
          <span className="current">Tentang Kami</span>
        </nav>

        <div className="split">
          <div>
            <span className="eyebrow">Mengenal Kami</span>
            <h1 className="page-title">Sehati Peduli Sesama</h1>
            <p style={{ fontWeight: 600, fontSize: '1.1rem', margin: '1rem 0 0.5rem' }}>
              Kisah, Visi, dan Misi Kami untuk Indonesia yang Lebih Baik.
            </p>
            <div className="prose">
              <p>
                Sehati Peduli Sesama adalah yayasan sosial dan kemanusiaan yang hadir sebagai
                wadah untuk menyalurkan kepedulian kepada masyarakat yang membutuhkan.
                Berlandaskan nilai kemanusiaan, keikhlasan, dan gotong royong, kami menghadirkan
                berbagai program sosial yang memberikan manfaat nyata serta mendorong
                terciptanya kehidupan yang lebih baik.
              </p>
            </div>
            <Link href="/donatur" className="btn-primary btn-lg" style={{ marginTop: '1.75rem' }}>
              <Users size={18} /> Bergabung Bersama Kami
            </Link>
          </div>

          <div className="split-img">
            <Image src="/tentangkami.png" alt="Sehati Peduli Sesama" fill sizes="(max-width: 960px) 100vw, 50vw" priority />
            <div className="split-badge">
              <span className="icon-box"><Users size={20} /></span>
              <span>Bersama kita, wujudkan Indonesia yang lebih baik.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="vm-grid">
          <div className="vm-card">
            <span className="icon-box"><Telescope size={22} /></span>
            <span className="eyebrow" style={{ display: 'block', marginTop: '1rem', marginBottom: 0 }}>Visi Kami</span>
            <h2 style={{ fontSize: '1.35rem', lineHeight: 1.35, margin: '0.5rem 0 0' }}>
              Menjadi lembaga filantropi terpercaya dan berdampak luas bagi Indonesia.
            </h2>
          </div>

          <div className="vm-card">
            <span className="icon-box"><Target size={22} /></span>
            <span className="eyebrow" style={{ display: 'block', marginTop: '1rem', marginBottom: 0 }}>Misi Kami</span>
            <ul className="check-list">
              {MISI_LIST.map((item) => (
                <li key={item}><CheckCircle2 size={18} /><span>{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
