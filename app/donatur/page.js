"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

import { API_BASE_URL } from '../lib/config'

export default function Donatur() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    amount: '',
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    payment_type: 'midtrans'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Auto-fill form with user data when logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        donor_name: user.name || '',
        donor_email: user.email || '',
        donor_phone: user.phone || '',
      }))
    }
  }, [user])

  const handlePresetAmount = (amount) => {
    setFormData({ ...formData, amount })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')

    try {
      // Panggil API Backend Laravel
      const token = localStorage.getItem('token')
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(`${API_BASE_URL}/donations`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Terjadi kesalahan pada server.')
      }

      if (formData.payment_type === 'midtrans' && data.snap_token) {
        // Panggil Snap JS
        window.snap.pay(data.snap_token, {
          onSuccess: function(result){
            alert("Donasi berhasil! Terima kasih atas kebaikan Anda.");
            router.push('/');
          },
          onPending: function(result){
            alert("Menunggu pembayaran Anda!");
          },
          onError: function(result){
            alert("Pembayaran gagal!");
          },
          onClose: function(){
            alert('Anda menutup jendela pembayaran tanpa menyelesaikannya');
          }
        })
      } else if (formData.payment_type === 'manual') {
        // Arahkan ke halaman upload
        router.push(`/donatur/upload?id=${data.donation.id}&amount=${formData.amount}`)
      }

    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Gagal terhubung ke server. Pastikan database backend sudah berjalan.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="detail-section" style={{ paddingTop: '5rem', minHeight: '100vh', background: 'var(--background)' }}>
      <div className="container">
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--color-card-bg)', padding: '3rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>Pilih Nominal Donasi</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Setiap rupiah yang Anda berikan sangat berarti bagi mereka.</p>
          
          {errorMsg && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <strong>Error:</strong> {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <button type="button" onClick={() => handlePresetAmount(50000)} className="btn-preset">Rp 50.000</button>
              <button type="button" onClick={() => handlePresetAmount(100000)} className="btn-preset">Rp 100.000</button>
              <button type="button" onClick={() => handlePresetAmount(250000)} className="btn-preset">Rp 250.000</button>
              <button type="button" onClick={() => handlePresetAmount(500000)} className="btn-preset">Rp 500.000</button>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>Atau Masukkan Nominal Lain</label>
              <input 
                type="number" 
                className="form-input"
                placeholder="Minimal Rp 10.000"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
                min="10000"
                style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-card-border)', borderRadius: '8px', fontSize: '1.1rem', background: 'var(--color-card-bg)', color: 'var(--color-text)' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>Nama Lengkap</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="Nama Anda"
                value={formData.donor_name}
                onChange={(e) => setFormData({...formData, donor_name: e.target.value})}
                required
                style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-card-border)', borderRadius: '8px', background: 'var(--color-card-bg)', color: 'var(--color-text)' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>Email</label>
              <input 
                type="email" 
                className="form-input"
                placeholder="Email Anda"
                value={formData.donor_email}
                onChange={(e) => setFormData({...formData, donor_email: e.target.value})}
                required
                style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-card-border)', borderRadius: '8px', background: 'var(--color-card-bg)', color: 'var(--color-text)' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>Nomor WhatsApp / HP</label>
              <input 
                type="tel" 
                className="form-input"
                placeholder="Contoh: 081234567890"
                value={formData.donor_phone}
                onChange={(e) => setFormData({...formData, donor_phone: e.target.value})}
                required
                style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-card-border)', borderRadius: '8px', background: 'var(--color-card-bg)', color: 'var(--color-text)' }}
              />
            </div>

            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: 'var(--color-text)' }}>Pilih Metode Pembayaran</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--color-card-border)', borderRadius: '8px', cursor: 'pointer', background: formData.payment_type === 'midtrans' ? 'var(--color-card-border)' : 'transparent' }}>
                <input 
                  type="radio" 
                  name="payment_type" 
                  value="midtrans"
                  checked={formData.payment_type === 'midtrans'}
                  onChange={(e) => setFormData({...formData, payment_type: e.target.value})}
                />
                <div>
                  <strong style={{ color: 'var(--color-text)' }}>Otomatis (GoPay, QRIS, Virtual Account)</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Terverifikasi seketika oleh sistem Midtrans</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--color-card-border)', borderRadius: '8px', cursor: 'pointer', background: formData.payment_type === 'manual' ? 'var(--color-card-border)' : 'transparent' }}>
                <input 
                  type="radio" 
                  name="payment_type" 
                  value="manual"
                  checked={formData.payment_type === 'manual'}
                  onChange={(e) => setFormData({...formData, payment_type: e.target.value})}
                />
                <div>
                  <strong style={{ color: 'var(--color-text)' }}>Transfer Bank Manual</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Bebas potongan biaya. Perlu unggah bukti transfer.</div>
                </div>
              </label>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }} disabled={isLoading}>
              {isLoading ? 'MEMPROSES...' : 'LANJUTKAN PEMBAYARAN'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
