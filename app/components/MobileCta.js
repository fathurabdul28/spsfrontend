import Link from 'next/link'
import { Heart } from 'lucide-react'

// Bar donasi tetap di bawah layar, hanya tampil di mobile (diatur CSS).
export default function MobileCta() {
  return (
    <div className="mobile-cta">
      <Link href="/program-kami" className="btn-outline">Program</Link>
      <Link href="/donatur" className="btn-primary"><Heart size={16} /> Donasi Sekarang</Link>
    </div>
  )
}
