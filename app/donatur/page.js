"use client"

import { useState, useEffect, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL, getImageUrl } from '../lib/config'

const PRESET_AMOUNTS = [50000, 100000, 250000, 500000]

function DonaturForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const programParam = searchParams.get('program') || searchParams.get('program_id')

  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const [programs, setPrograms] = useState([])
  const [bankAccounts, setBankAccounts] = useState([])
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true)

  const [formData, setFormData] = useState({
    program_id: '',
    amount: '',
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    payment_type: 'manual'
  })

  // Bukti transfer states
  const [receiptFile, setReceiptFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [copiedBankId, setCopiedBankId] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Fetch daftar program & rekening bank
  useEffect(() => {
    async function fetchData() {
      try {
        const [progRes, bankRes] = await Promise.all([
          fetch(`${API_BASE_URL}/programs`).then(r => r.ok ? r.json() : []).catch(() => []),
          fetch(`${API_BASE_URL}/bank-accounts`).then(r => r.ok ? r.json() : []).catch(() => [])
        ])

        if (Array.isArray(progRes)) setPrograms(progRes)
        if (Array.isArray(bankRes)) setBankAccounts(bankRes)
      } catch (err) {
        console.error('Gagal mengambil data pendukung:', err)
      } finally {
        setIsLoadingPrograms(false)
      }
    }
    fetchData()
  }, [])

  // Otomatis pilih program jika terdapat parameter di URL
  useEffect(() => {
    if (programParam && programs.length > 0) {
      const cleanParam = decodeURIComponent(programParam).toLowerCase().trim()
      const matched = programs.find(
        p => p.slug?.toLowerCase() === cleanParam ||
             String(p.id) === cleanParam ||
             p.title?.toLowerCase().includes(cleanParam)
      )
      if (matched) {
        setFormData(prev => ({ ...prev, program_id: String(matched.id) }))
      }
    }
  }, [programParam, programs])

  // Auto-fill form dengan data user jika sudah login
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

  // Cleanup object url saat ganti gambar
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handlePresetAmount = (amount) => {
    setFormData(prev => ({ ...prev, amount }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WEBP).')
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 3MB.')
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setReceiptFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setReceiptFile(null)
    setPreviewUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCopyAccount = (number, id) => {
    navigator.clipboard.writeText(number)
    setCopiedBankId(id)
    setTimeout(() => setCopiedBankId(null), 2000)
  }

  const selectedProgram = programs.find(p => String(p.id) === String(formData.program_id))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    if (!formData.program_id) {
      setErrorMsg('Silakan pilih program donasi terlebih dahulu.')
      setIsLoading(false)
      return
    }

    if (!formData.amount || Number(formData.amount) < 10000) {
      setErrorMsg('Nominal donasi minimal Rp 10.000.')
      setIsLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Accept': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const submitData = new FormData()
      submitData.append('program_id', formData.program_id)
      submitData.append('amount', formData.amount)
      submitData.append('donor_name', formData.donor_name)
      submitData.append('donor_email', formData.donor_email)
      submitData.append('donor_phone', formData.donor_phone)
      submitData.append('payment_type', 'manual')

      if (receiptFile) {
        submitData.append('receipt', receiptFile)
      }

      const res = await fetch(`${API_BASE_URL}/donations`, {
        method: 'POST',
        headers: headers,
        body: submitData
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Terjadi kesalahan pada server saat memproses donasi.')
      }

      if (receiptFile) {
        setSuccessMsg('Alhamdulillah! Donasi dan bukti transfer Anda berhasil dikirim. Admin akan segera memverifikasinya.')
        setTimeout(() => {
          if (token) {
            router.push('/donasi-saya')
          } else {
            router.push('/')
          }
        }, 1800)
      } else {
        // Jika belum menyertakan bukti transfer di form ini, arahkan ke halaman upload
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
    <section className="detail-section" style={{ paddingTop: '3.5rem', paddingBottom: '5rem', minHeight: '100vh', background: 'var(--background)' }}>
      <div className="container">
        <div style={{
          maxWidth: '640px',
          margin: '0 auto',
          background: 'var(--color-card-bg)',
          padding: '2.5rem',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-card-border)'
        }}>
          
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <span style={{
              display: 'inline-block',
              padding: '0.35rem 1rem',
              borderRadius: '9999px',
              background: 'rgba(140, 21, 50, 0.08)',
              color: 'var(--color-primary)',
              fontSize: '0.85rem',
              fontWeight: '700',
              marginBottom: '0.75rem'
            }}>
              FORMULIR DONASI
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
              Salurkan Kebaikan Anda
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: '1.5' }}>
              Setiap rupiah yang Anda berikan sangat berarti bagi mereka yang membutuhkan.
            </p>
          </div>

          {errorMsg && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              background: '#dcfce7',
              color: '#15803d',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '600'
            }}>
              <span>✅</span>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* 1. Pilihan Program Donasi */}
            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label htmlFor="program_id" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--color-text)',
                fontSize: '0.92rem'
              }}>
                <span>Program Donasi <span style={{ color: 'var(--color-primary)' }}>*</span></span>
                {selectedProgram && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: '700' }}>
                    {selectedProgram.category}
                  </span>
                )}
              </label>

              <select
                id="program_id"
                name="program_id"
                className="form-select"
                value={formData.program_id}
                onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                required
                disabled={isLoadingPrograms}
              >
                <option value="">
                  {isLoadingPrograms ? 'Memuat daftar program...' : '-- Pilih Program Donasi --'}
                </option>
                {programs.map((prog) => (
                  <option key={prog.id} value={prog.id}>
                    {prog.title} {prog.category ? `[${prog.category}]` : ''}
                  </option>
                ))}
              </select>

              {selectedProgram && (
                <div style={{
                  marginTop: '0.6rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(140, 21, 50, 0.06)',
                  border: '1px solid rgba(140, 21, 50, 0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: '600' }}>
                    <span>🎯</span>
                    <span>{selectedProgram.title}</span>
                  </div>
                  <Link
                    href={`/program-kami/${selectedProgram.slug}`}
                    target="_blank"
                    style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textDecoration: 'underline' }}
                  >
                    Detail
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Nominal Donasi Preset & Input */}
            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.65rem', fontWeight: '600', color: 'var(--color-text)', fontSize: '0.92rem' }}>
                Pilih Nominal Donasi <span style={{ color: 'var(--color-primary)' }}>*</span>
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                {PRESET_AMOUNTS.map((amt) => {
                  const isSelected = Number(formData.amount) === amt
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handlePresetAmount(amt)}
                      className={`btn-preset ${isSelected ? 'active' : ''}`}
                    >
                      Rp {amt.toLocaleString('id-ID')}
                    </button>
                  )
                })}
              </div>

              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Atau Masukkan Nominal Lain (Minimal Rp 10.000)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '1.1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontWeight: '700',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.95rem'
                }}>
                  Rp
                </span>
                <input
                  type="number"
                  className="form-input"
                  placeholder="100000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="10000"
                  style={{ paddingLeft: '3rem', fontSize: '1.05rem', fontWeight: '600' }}
                />
              </div>
            </div>

            {/* 3. Data Donatur */}
            <div style={{
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--color-card-border)',
              marginBottom: '1.75rem'
            }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--color-text)', marginBottom: '1.25rem' }}>
                Informasi Donatur
              </h3>

              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.45rem', fontWeight: '500', color: 'var(--color-text)', fontSize: '0.9rem' }}>
                  Nama Lengkap <span style={{ color: 'var(--color-primary)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nama Lengkap Anda"
                  value={formData.donor_name}
                  onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.45rem', fontWeight: '500', color: 'var(--color-text)', fontSize: '0.9rem' }}>
                  Email <span style={{ color: 'var(--color-primary)' }}>*</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="contoh@email.com"
                  value={formData.donor_email}
                  onChange={(e) => setFormData({ ...formData, donor_email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.45rem', fontWeight: '500', color: 'var(--color-text)', fontSize: '0.9rem' }}>
                  Nomor WhatsApp / HP <span style={{ color: 'var(--color-primary)' }}>*</span>
                </label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="081234567890"
                  value={formData.donor_phone}
                  onChange={(e) => setFormData({ ...formData, donor_phone: e.target.value })}
                  required
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.35rem' }}>
                  Kami akan mengirimkan tanda terima & konfirmasi melalui WhatsApp.
                </span>
              </div>
            </div>

            {/* 4. Rekening Resmi Yayasan */}
            <div style={{
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--color-card-border)',
              marginBottom: '1.75rem'
            }}>
              <label style={{ display: 'block', marginBottom: '0.65rem', fontWeight: '700', fontSize: '1rem', color: 'var(--color-text)' }}>
                Rekening Tujuan Transfer
              </label>

              {formData.amount && Number(formData.amount) >= 10000 && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(140, 21, 50, 0.08)',
                  color: 'var(--color-primary)',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Nominal yang ditransfer:</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: '800' }}>
                    Rp {Number(formData.amount).toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(bankAccounts.length > 0 ? bankAccounts : [
                  { id: 1, bank_name: 'Mandiri', account_number: '1310023914981', account_name: 'Yayasan Sehati Peduli Sesama' }
                ]).map((acc) => (
                  <div key={acc.id} style={{
                    padding: '1rem 1.2rem',
                    border: '1.5px solid var(--color-card-border)',
                    borderRadius: '12px',
                    background: 'var(--color-card-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '8px',
                        background: 'rgba(140, 21, 50, 0.08)',
                        color: 'var(--color-primary)',
                        fontWeight: '800',
                        fontSize: '0.9rem'
                      }}>
                        {acc.bank_name}
                      </div>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '0.5px', color: 'var(--color-text)' }}>
                          {acc.account_number}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          a.n. {acc.account_name}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyAccount(acc.account_number, acc.id)}
                      style={{
                        padding: '0.45rem 0.9rem',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        borderRadius: '6px',
                        border: '1px solid var(--color-card-border)',
                        background: copiedBankId === acc.id ? 'var(--color-primary)' : 'transparent',
                        color: copiedBankId === acc.id ? '#fff' : 'var(--color-text)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {copiedBankId === acc.id ? 'Tersalin ✓' : 'Salin No. Rek'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Unggah Gambar Bukti Transfer */}
            <div style={{
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--color-card-border)',
              marginBottom: '2rem'
            }}>
              <label style={{ display: 'block', marginBottom: '0.45rem', fontWeight: '700', fontSize: '1rem', color: 'var(--color-text)' }}>
                Unggah Gambar Bukti Transfer
              </label>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.85rem' }}>
                Silakan lampirkan tangkapan layar (screenshot) atau foto bukti transfer Anda (JPG, PNG, WEBP maks 3MB).
              </p>

              <input
                ref={fileInputRef}
                type="file"
                id="receipt"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {!receiptFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed var(--color-card-border)',
                    borderRadius: '14px',
                    padding: '2rem 1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'rgba(140, 21, 50, 0.02)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)'
                    e.currentTarget.style.background = 'rgba(140, 21, 50, 0.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-card-border)'
                    e.currentTarget.style.background = 'rgba(140, 21, 50, 0.02)'
                  }}
                >
                  <div style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>📸</div>
                  <div style={{ fontWeight: '700', color: 'var(--color-text)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                    Klik untuk Pilih Bukti Transfer
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Mendukung file JPG, PNG, atau WEBP hingga 3MB
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '1.2rem',
                  borderRadius: '14px',
                  border: '1.5px solid var(--color-primary)',
                  background: 'rgba(140, 21, 50, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.2rem',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
                    {previewUrl && (
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        position: 'relative',
                        flexShrink: 0,
                        border: '1px solid var(--color-card-border)',
                        background: '#fff'
                      }}>
                        <img
                          src={previewUrl}
                          alt="Pratinjau Bukti Transfer"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        color: 'var(--color-text)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '220px'
                      }}>
                        {receiptFile.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {(receiptFile.size / 1024).toFixed(1)} KB • Siap dikirim
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '0.45rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        background: 'var(--color-card-bg)',
                        border: '1px solid var(--color-card-border)',
                        color: 'var(--color-text)',
                        cursor: 'pointer'
                      }}
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      style={{
                        padding: '0.45rem 0.8rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        background: '#fee2e2',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer'
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                padding: '1.15rem',
                fontSize: '1.05rem',
                fontWeight: '700',
                borderRadius: '12px',
                boxShadow: '0 6px 20px rgba(140, 21, 50, 0.28)'
              }}
              disabled={isLoading || isLoadingPrograms}
            >
              {isLoading
                ? 'MEMPROSES DONASI...'
                : receiptFile
                  ? 'KIRIM DONASI & BUKTI TRANSFER →'
                  : 'LANJUTKAN DONASI →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default function Donatur() {
  return (
    <Suspense fallback={
      <section style={{ paddingTop: '5rem', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Memuat formulir donasi...</div>
      </section>
    }>
      <DonaturForm />
    </Suspense>
  )
}
