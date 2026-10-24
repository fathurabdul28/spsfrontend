import Image from 'next/image'
import Link from 'next/link'
import { API_BASE_URL, getImageUrl } from '../lib/config'

export default async function CaraBerdonasi() {
  const res = await fetch(`${API_BASE_URL}/bank-accounts`, { cache: 'no-store' });
  const bankAccounts = await res.json();

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', paddingBottom: '6rem' }}>

      {/* Top Section */}
      <section style={{ position: 'relative', height: '300px', display: 'flex' }}>
        {/* Right side image background */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60%', zIndex: 1 }}>
          <Image
            src="/hero.png" // Reusing the smiling children image
            alt="Anak-anak"
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          {/* Gradient to blend the image seamlessly into the left background */}
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '400px', background: 'linear-gradient(to right, var(--background) 0%, transparent 100%)', zIndex: 2 }}></div>
        </div>

        {/* Left side content */}
        <div className="container" style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', width: '100%' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--color-text)' }}>
            Cara Berdonasi
          </h1>
        </div>
      </section>

      {/* Cards Section */}
      <section style={{ position: 'relative', zIndex: 11, marginTop: '-50px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>

            {/* Donation Steps Card */}
            <div style={{
              background: 'var(--color-card-bg)',
              borderRadius: '20px',
              padding: '3rem',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-card-border)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '3rem' }}>📝</div>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--color-text)', margin: 0 }}>Panduan Berdonasi</h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>Mudah, amanah & transparan</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '3rem', flexGrow: 1 }}>
                {[
                  { step: 'Pilih Program Kebaikan', desc: 'Tentukan program atau kegiatan sosial yang ingin Anda bantu.' },
                  { step: 'Isi Data & Nominal Donasi', desc: 'Masukkan nama, kontak, dan jumlah donasi yang ingin disalurkan.' },
                  { step: 'Transfer ke Rekening Resmi', desc: 'Kirimkan donasi sesuai nominal ke rekening resmi yayasan.' },
                  { step: 'Unggah Bukti Transfer', desc: 'Unggah struk/screenshot transfer untuk diverifikasi oleh admin.' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, marginTop: '2px' }}>
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ color: 'var(--color-text)', fontSize: '1.05rem', fontWeight: '600' }}>{item.step}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/donatur" style={{
                display: 'block',
                width: '100%',
                padding: '1rem',
                background: 'var(--color-primary)',
                color: 'white',
                textAlign: 'center',
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'opacity 0.2s'
              }}>
                Berdonasi Sekarang
              </Link>
            </div>

            {/* Manual Donation Card */}
            <div style={{
              background: 'var(--color-card-bg)',
              borderRadius: '20px',
              padding: '3rem',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--color-card-border)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '3rem' }}>🏦</div>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--color-text)', margin: 0 }}>Donasi Manual</h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>dengan Transfer Bank</p>
                </div>
              </div>

              {/* Bank Accounts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                {bankAccounts.length > 0 ? (
                  bankAccounts.map((account) => (
                    <div key={account.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                        {account.logo ? (
                          <img
                            src={getImageUrl(account.logo)}
                            alt={account.bank_name}
                            style={{ maxWidth: '100%', maxHeight: '40px', objectFit: 'contain' }}
                          />
                        ) : (
                          <span style={{ color: '#005AAA', fontSize: '1.2rem', fontWeight: 'bold' }}>{account.bank_name}</span>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', color: 'var(--color-text)' }}>{account.bank_name} {account.account_number}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>a.n. {account.account_name}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Belum ada data rekening bank tersedia.</div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem', flexGrow: 1 }}>
                {[
                  'Pilih Program.',
                  'Transfer ke Rekening Resmi.',
                  'Konfirmasi Transfer di Formulir.'
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--color-secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <span style={{ color: 'var(--color-text)', fontSize: '1.05rem' }}>{step}</span>
                  </div>
                ))}
              </div>

              <Link href="/donatur" style={{
                display: 'block',
                width: '100%',
                padding: '1rem',
                background: 'var(--color-secondary)',
                color: 'white',
                textAlign: 'center',
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'opacity 0.2s'
              }}>
                Donasi Sekarang Manual (Transfer)
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
