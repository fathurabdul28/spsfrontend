"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, Suspense } from 'react'
import { API_BASE_URL } from '../../lib/config'

function UploadContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const id = searchParams.get('id')
  const amount = searchParams.get('amount')
  
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) {
      alert("Pilih file bukti transfer terlebih dahulu.")
      return
    }
    
    setIsLoading(true)
    const formData = new FormData()
    formData.append('receipt', file)
    
    try {
      const res = await fetch(`${API_BASE_URL}/donations/${id}/upload-receipt`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      
      if (res.ok && data.success) {
        alert("Bukti transfer berhasil diunggah! Admin kami akan segera memverifikasi donasi Anda.")
        router.push('/')
      } else {
        throw new Error(data.message || 'Gagal mengunggah file')
      }
    } catch (err) {
      console.error(err)
      alert("Error: " + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#111' }}>Konfirmasi Transfer</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Silakan transfer tepat sebesar <strong>Rp {Number(amount).toLocaleString('id-ID')}</strong> ke salah satu rekening berikut:</p>
      
      <div style={{ padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #ddd' }}>
        <h3 style={{ marginBottom: '1rem', color: '#333' }}>Rekening Yayasan SPS</h3>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>Bank BCA</div>
          <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>123-456-7890</div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>a/n Yayasan Sehati Peduli Sesama</div>
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>Bank BSI</div>
          <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>700-800-9000</div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>a/n Yayasan Sehati Peduli Sesama</div>
        </div>
      </div>

      <form onSubmit={handleUpload}>
        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Unggah Bukti Transfer (JPG/PNG)</label>
          <input 
            type="file" 
            accept="image/jpeg, image/png, image/jpg"
            onChange={(e) => setFile(e.target.files[0])}
            required
            style={{ width: '100%', padding: '1rem', border: '1px dashed #ccc', borderRadius: '8px', cursor: 'pointer' }}
          />
        </div>
        
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }} disabled={isLoading}>
          {isLoading ? 'MENGUNGGAH...' : 'KIRIM BUKTI TRANSFER'}
        </button>
      </form>
    </div>
  )
}

export default function UploadManual() {
  return (
    <section className="detail-section" style={{ paddingTop: '5rem' }}>
      <div className="container">
        <Suspense fallback={<div>Loading...</div>}>
          <UploadContent />
        </Suspense>
      </div>
    </section>
  )
}
