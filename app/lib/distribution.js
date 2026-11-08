// Status penyaluran program berdasarkan tanggal distribusi.
// Return null jika tanggal tidak ada.
export function getDistributionInfo(dateValue) {
  if (!dateValue) return null

  const distDate = new Date(dateValue)
  const isNov21 = distDate.getMonth() === 10 && (distDate.getDate() === 21 || distDate.getDate() === 22)
  const dateText = isNov21
    ? '21-22 Nov 2026'
    : distDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

  const today = new Date()
  distDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  if (distDate > today) {
    const diffDays = Math.ceil((distDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return { text: `Akan disalurkan: ${dateText} (H-${diffDays})`, type: 'upcoming' }
  }
  if (distDate.getTime() === today.getTime()) return { text: 'Proses penyaluran', type: 'today' }
  return { text: 'Selesai Disalurkan', type: 'done' }
}
