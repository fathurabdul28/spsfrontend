import Link from 'next/link'
import { ClipboardList, Landmark } from 'lucide-react'
import { API_BASE_URL, getImageUrl } from '../lib/config'

const DONATION_STEPS = [
  { step: 'Pilih Program Kebaikan', desc: 'Tentukan program atau kegiatan sosial yang ingin Anda bantu.' },
  { step: 'Isi Data & Nominal Donasi', desc: 'Masukkan nama, kontak, dan jumlah donasi yang ingin disalurkan.' },
  { step: 'Transfer ke Rekening Resmi', desc: 'Kirimkan donasi sesuai nominal ke rekening resmi yayasan.' },
  { step: 'Unggah Bukti Transfer', desc: 'Unggah struk/screenshot transfer untuk diverifikasi oleh admin.' },
]

const MANUAL_STEPS = ['Pilih Program.', 'Transfer ke Rekening Resmi.', 'Konfirmasi Transfer di Formulir.']

export default async function CaraBerdonasi() {
  const res = await fetch(`${API_BASE_URL}/bank-accounts`, { cache: 'no-store' })
  const bankAccounts = await res.json()

  return (
    <>
      <section className="page-hero">
        <span className="eyebrow">Panduan</span>
        <h1 className="page-title">Cara Berdonasi</h1>
        <p className="section-lead">Mudah, amanah, dan transparan. Pilih cara yang paling nyaman untuk Anda.</p>
      </section>

      <section className="section" style={{ paddingTop: '1.5rem' }}>
        <div className="two-col">
          <div className="panel">
            <div className="panel-head">
              <span className="icon-box"><ClipboardList size={22} /></span>
              <div>
                <h2>Panduan Berdonasi</h2>
                <p>Mudah, amanah & transparan</p>
              </div>
            </div>

            <ol className="steps">
              {DONATION_STEPS.map((item, i) => (
                <li key={item.step}>
                  <span className="step-num">{i + 1}</span>
                  <div><strong>{item.step}</strong><span className="d">{item.desc}</span></div>
                </li>
              ))}
            </ol>

            <Link href="/donatur" className="btn-primary btn-lg btn-block">Berdonasi Sekarang</Link>
          </div>

          <div className="panel">
            <div className="panel-head">
              <span className="icon-box"><Landmark size={22} /></span>
              <div>
                <h2>Donasi Manual</h2>
                <p>dengan Transfer Bank</p>
              </div>
            </div>

            <div className="bank-list">
              {bankAccounts.length > 0 ? (
                bankAccounts.map((account) => (
                  <div key={account.id} className="bank-item">
                    <div className="bank-logo">
                      {account.logo ? (
                        <img src={getImageUrl(account.logo)} alt={account.bank_name} />
                      ) : (
                        <strong>{account.bank_name}</strong>
                      )}
                    </div>
                    <div>
                      <div className="name">{account.bank_name} {account.account_number}</div>
                      <div className="owner">a.n. {account.account_name}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty" style={{ padding: '1rem' }}>Belum ada data rekening bank tersedia.</p>
              )}
            </div>

            <ol className="steps">
              {MANUAL_STEPS.map((step, i) => (
                <li key={step} style={{ alignItems: 'center' }}>
                  <span className="step-num alt">{i + 1}</span>
                  <strong style={{ fontWeight: 500 }}>{step}</strong>
                </li>
              ))}
            </ol>

            <Link href="/donatur" className="btn-outline btn-lg btn-block">Donasi Sekarang Manual (Transfer)</Link>
          </div>
        </div>
      </section>
    </>
  )
}
