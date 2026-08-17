"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Coins, HandHeart, Timer, Download } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

import { API_BASE_URL, getImageUrl } from '../lib/config'

export default function DonasiSaya() {
  const { token, user, loading: authLoading } = useAuth()
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (token) {
        fetchMyDonations()
      } else {
        setLoading(false)
        window.location.href = '/' // Redirect to home if not logged in
      }
    }
  }, [token, authLoading])

  const fetchMyDonations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/my-donations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      const data = await res.json()
      if (data.success) {
        setDonations(data.data)
      }
    } catch (error) {
      console.error('Error fetching donations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || authLoading) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Memuat data donasi...</div>
  }

  // Calculate summaries
  const totalDonasi = donations.filter(d => d.status === 'success').reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
  const uniquePrograms = new Set(donations.map(d => d.program_id)).size

  // To avoid complex mock, assuming active programs are those that are not completed in db. For now just mock as 3 or calculate based on unique programs
  const activePrograms = uniquePrograms

  const summary = [
    { title: "Total Donasi", value: `RP ${new Intl.NumberFormat('id-ID').format(totalDonasi)}`, icon: <Coins size={28} color="var(--color-primary)" />, borderColor: 'var(--color-primary)' },
    { title: "Program Didukung", value: uniquePrograms.toString(), icon: <HandHeart size={28} color="var(--color-secondary)" />, borderColor: 'var(--color-secondary)' },
    { title: "Program Sedang Berjalan", value: activePrograms.toString(), icon: <Timer size={28} color="#2563eb" />, borderColor: '#2563eb' }
  ]

  // Map donations to programs cards
  const programs = donations.reduce((acc, donation) => {
    // Only one card per program, summing up amount if needed, but for simplicity let's just list recent programs
    const progId = donation.program_id
    if (!acc.find(p => p.id === progId)) {
      acc.push({
        id: progId,
        title: donation.program?.title || 'Donasi Umum',
        image: getImageUrl(donation.program?.image, "/pendidikan.jpg"),
        status: donation.status === 'success' ? 'Selesai' : (donation.status === 'pending' ? 'Menunggu' : 'Gagal'),
        statusColor: donation.status === 'success' ? '#6b7280' : '#eab308',
        donated: `RP ${new Intl.NumberFormat('id-ID').format(donation.amount)}`,
        totalDonasi: donation.status === 'success' ? 'Selesai' : 'Aktif',
        buttonText: donation.status === 'success' ? 'Detail Lengkap' : 'Perbarui Donasi',
        progress: donation.status === 'success' ? 100 : 50,
        distribution_date: donation.program?.distribution_date
      })
    }
    return acc
  }, []).slice(0, 3)

  // Map history
  const getStatusBg = (status) => {
    switch (status) {
      case 'success': return '#dcfce7'
      case 'pending': return '#fef08a'
      default: return '#fee2e2'
    }
  }
  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#166534'
      case 'pending': return '#854d0e'
      default: return '#991b1b'
    }
  }
  const getStatusText = (status) => {
    switch (status) {
      case 'success': return 'Berhasil'
      case 'pending': return 'Menunggu'
      default: return 'Gagal'
    }
  }

  const history = donations.map(d => ({
    id: d.id,
    date: new Date(d.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    name: d.program?.title || 'Donasi Umum',
    amount: `RP ${new Intl.NumberFormat('id-ID').format(d.amount)}`,
    method: d.payment_type === 'midtrans' ? 'Midtrans' : 'Transfer Manual',
    status: getStatusText(d.status),
    statusBg: getStatusBg(d.status),
    statusColor: getStatusColor(d.status),
    hasReceipt: d.proof_of_payment ? true : false,
    receiptUrl: d.proof_of_payment ? getImageUrl(d.proof_of_payment) : null
  }))

  return (
    <div style={{ padding: '2rem 0', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-text)', marginBottom: '2rem' }}>
          Jejak Kebaikan: Halaman Donasi Saya
        </h1>

        {/* Summary Dashboard */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-text)' }}>Summary Dashboard</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {summary.map((item, i) => (
              <div key={i} style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `2px solid ${item.borderColor}`,
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div>
                  <div style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{item.title}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-text)' }}>{item.value}</div>
                </div>
                <div style={{ padding: '0.8rem', borderRadius: '50%', background: 'var(--color-background)', border: `1px solid ${item.borderColor}` }}>
                  {item.icon}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Program Cards */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {programs.map((prog, i) => {
              let statusBadge = null;
              if (prog.distribution_date) {
                const distDate = new Date(prog.distribution_date);
                const today = new Date();
                distDate.setHours(0,0,0,0);
                today.setHours(0,0,0,0);
                
                if (distDate > today) {
                  const diffTime = distDate.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  statusBadge = <span style={{ background: '#f59e0b', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Akan disalurkan: {distDate.toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})} (H-{diffDays})</span>;
                } else if (distDate.getTime() === today.getTime()) {
                  statusBadge = <span style={{ background: '#3b82f6', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Proses penyaluran</span>;
                } else {
                  statusBadge = <span style={{ background: '#10b981', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>Selesai Disalurkan</span>;
                }
              }

              return (
              <div key={i} style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid var(--glass-border)',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ position: 'relative', height: '200px' }}>
                  <Image src={prog.image} alt={prog.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 33vw" />

                  {/* Progress Bar Overlay */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 1rem 0.5rem', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: '500' }}>Donasi Anda untuk Program Ini</span>
                      <span style={{ fontSize: '0.85rem', color: prog.statusColor, fontWeight: '700' }}>{prog.status}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${prog.progress}%`, height: '100%', background: prog.progress === 100 ? (prog.status === 'Selesai' ? '#6b7280' : 'var(--color-primary)') : 'var(--color-secondary)' }}></div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {statusBadge && <div style={{ marginBottom: '0.5rem' }}>{statusBadge}</div>}
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--color-text)' }}>{prog.donated}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', flexGrow: 1 }}>
                    Total donasi: <span style={{ fontWeight: '600', color: prog.status === 'Aktif' ? 'var(--color-secondary)' : 'inherit' }}>{prog.totalDonasi}</span>
                  </p>
                  <button className="btn-primary-glow" style={{
                    width: '100%',
                    padding: '0.8rem',
                    background: prog.status === 'Selesai' ? 'var(--color-card-border)' : 'var(--color-primary)',
                    color: prog.status === 'Selesai' ? 'var(--color-text)' : 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: prog.status === 'Selesai' ? 'none' : '0 4px 15px var(--color-btn-dynamic-shadow)'
                  }}>
                    {prog.buttonText}
                  </button>
                </div>
              </div>
            )})}
          </div>
        </section>

        {/* Donation History Table */}
        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-text)' }}>Complete Donation History</h2>
          <div style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-card-border)', color: 'var(--color-text)', fontWeight: '700', fontSize: '0.95rem' }}>
                    <th style={{ padding: '1rem 1.5rem' }}>Tanggal Donasi</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Nama Program</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Jumlah Donasi (RP)</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Metode Pembayaran</th>
                    <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row, i) => (
                    <tr key={i} style={{ borderBottom: i < history.length - 1 ? '1px solid var(--color-card-border)' : 'none', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>{row.date}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text)', fontWeight: '500' }}>{row.name}</td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{row.amount}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>{row.method}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{
                          background: row.statusBg,
                          color: row.statusColor,
                          padding: '0.4rem 0.8rem',
                          borderRadius: '20px',
                          fontWeight: '600',
                          fontSize: '0.8rem'
                        }}>
                          {row.status}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
