import { MapPin, Phone, Mail } from 'lucide-react'

export default function Kontak() {
  return (
    <section className="page-hero">
      <span className="eyebrow">Kontak</span>
      <h1 className="page-title">Hubungi Kami</h1>
      <p className="section-lead">
        Punya pertanyaan atau ingin bekerja sama? Jangan ragu untuk menghubungi tim Sehati Peduli Sesama.
      </p>

      <div className="panel" style={{ marginTop: '2rem', maxWidth: 560 }}>
        <div className="contact-item">
          <MapPin size={18} />
          <div>
            Jl. Babakan Garut, Kelurahan Cibangkong, Kecamatan Batununggal,<br />
            Kota Bandung, Jawa Barat 40286, Indonesia
          </div>
        </div>
        <div className="contact-item">
          <Phone size={18} />
          <a href="https://wa.me/6285862604177" target="_blank" rel="noopener noreferrer">+6285862604177</a>
        </div>
        <div className="contact-item">
          <Mail size={18} />
          <div>info@sehatipeduli.org</div>
        </div>
      </div>
    </section>
  )
}
