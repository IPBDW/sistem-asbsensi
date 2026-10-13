const NAMA_HARI = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
]

const NAMA_HARI_PENDEK = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const NAMA_BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

const NAMA_BULAN_PENDEK = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
]

/**
 * Format YYYY-MM-DD memakai komponen tanggal lokal.
 * Sengaja tidak memakai toISOString(), karena itu mengonversi ke UTC dan bisa
 * menggeser tanggal satu hari untuk zona waktu Indonesia.
 */
export function toISODate(date: Date): string {
  const tahun = date.getFullYear()
  const bulan = String(date.getMonth() + 1).padStart(2, '0')
  const hari = String(date.getDate()).padStart(2, '0')
  return `${tahun}-${bulan}-${hari}`
}

/** Contoh: "Senin, 13 Oktober 2026" */
export function formatTanggalLengkap(date: Date): string {
  return `${NAMA_HARI[date.getDay()]}, ${date.getDate()} ${NAMA_BULAN[date.getMonth()]} ${date.getFullYear()}`
}

/**
 * Contoh: "Senin, 13 Oktober 2026" dari string YYYY-MM-DD.
 * Dipakai kalau tanggalnya sudah berbentuk string, supaya tidak perlu
 * memanggil `new Date()` saat render.
 */
export function formatTanggalLengkapDariISO(isoDate: string): string {
  const [tahun, bulan, hari] = isoDate.split('-').map(Number)
  const date = new Date(tahun, bulan - 1, hari)
  return `${NAMA_HARI[date.getDay()]}, ${hari} ${NAMA_BULAN[bulan - 1]} ${tahun}`
}

/** Contoh: "Sen, 13 Okt 2026". Menerima string YYYY-MM-DD. */
export function formatTanggalPendek(isoDate: string): string {
  const [tahun, bulan, hari] = isoDate.split('-').map(Number)
  const date = new Date(tahun, bulan - 1, hari)
  return `${NAMA_HARI_PENDEK[date.getDay()]}, ${date.getDate()} ${NAMA_BULAN_PENDEK[date.getMonth()]} ${date.getFullYear()}`
}

/** Contoh: "06:45" */
export function formatJam(date: Date): string {
  const jam = String(date.getHours()).padStart(2, '0')
  const menit = String(date.getMinutes()).padStart(2, '0')
  return `${jam}:${menit}`
}

export function isWeekend(date: Date): boolean {
  const hari = date.getDay()
  return hari === 0 || hari === 6
}
