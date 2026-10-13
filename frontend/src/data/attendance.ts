import { formatJam, isWeekend, toISODate } from '../lib/date'

export type AttendanceStatus = 'hadir' | 'terlambat' | 'izin' | 'sakit' | 'alpa'

export type AttendanceRecord = {
  /** YYYY-MM-DD */
  date: string
  status: AttendanceStatus
  /** HH:mm, atau null untuk izin/sakit/alpa yang tidak punya jam datang. */
  checkInAt: string | null
}

export type AttendanceData = {
  today: {
    date: string
    status: AttendanceStatus | null
    checkInAt: string | null
    isSchoolDay: boolean
  }
  summary: Record<AttendanceStatus, number>
  /** Terbaru lebih dulu. */
  records: AttendanceRecord[]
}

export const STATUS_ORDER: AttendanceStatus[] = [
  'hadir',
  'terlambat',
  'izin',
  'sakit',
  'alpa',
]

export const STATUS_LABEL: Record<AttendanceStatus, string> = {
  hadir: 'Hadir',
  terlambat: 'Terlambat',
  izin: 'Izin',
  sakit: 'Sakit',
  alpa: 'Alpa',
}

/** Singkatan yang biasa dipakai guru di buku presensi. */
export const STATUS_LETTER: Record<AttendanceStatus, string> = {
  hadir: 'H',
  terlambat: 'T',
  izin: 'I',
  sakit: 'S',
  alpa: 'A',
}

/** Berapa hari sekolah terakhir yang ditampilkan di riwayat. */
const RIWAYAT_HARI = 12

const CHECK_IN_KEY = 'absensi.checkin'

/**
 * Pola status contoh. Sengaja tetap (bukan acak) supaya tampilan tidak berubah
 * setiap kali halaman dimuat ulang.
 */
const POLA: AttendanceStatus[] = [
  'hadir',
  'hadir',
  'terlambat',
  'hadir',
  'izin',
  'hadir',
  'hadir',
  'sakit',
  'hadir',
  'hadir',
  'terlambat',
  'hadir',
  'hadir',
  'alpa',
  'hadir',
]

function jamDatang(status: AttendanceStatus, urutan: number): string | null {
  if (status === 'hadir') {
    const menit = 38 + ((urutan * 7) % 18)
    return `06:${String(menit).padStart(2, '0')}`
  }
  if (status === 'terlambat') {
    const menit = 5 + ((urutan * 5) % 25)
    return `07:${String(menit).padStart(2, '0')}`
  }
  return null
}

function readCheckIn(): AttendanceRecord | null {
  try {
    const raw = sessionStorage.getItem(CHECK_IN_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as AttendanceRecord).date === 'string' &&
      typeof (parsed as AttendanceRecord).status === 'string'
    ) {
      return parsed as AttendanceRecord
    }
    return null
  } catch {
    return null
  }
}

function saveCheckIn(record: AttendanceRecord): void {
  try {
    sessionStorage.setItem(CHECK_IN_KEY, JSON.stringify(record))
  } catch {
    // Kalau storage diblokir, presensi tetap jalan untuk sesi berjalan.
  }
}

function jeda(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Mengambil data presensi.
 *
 * Datanya masih dibuat di sisi klien. Bentuk fungsinya sudah async supaya nanti
 * tinggal diganti dengan pemanggilan API tanpa mengubah komponen.
 */
export async function fetchAttendance(
  today: Date = new Date(),
): Promise<AttendanceData> {
  await jeda(250)

  const todayISO = toISODate(today)
  const hariSekolah = !isWeekend(today)
  const checkIn = readCheckIn()
  const checkInHariIni = checkIn?.date === todayISO ? checkIn : null

  const records: AttendanceRecord[] = []

  if (checkInHariIni) {
    records.push(checkInHariIni)
  }

  const cursor = new Date(today)
  let urutan = 0

  while (records.length < RIWAYAT_HARI) {
    cursor.setDate(cursor.getDate() - 1)
    if (isWeekend(cursor)) continue

    const status = POLA[urutan % POLA.length]
    records.push({
      date: toISODate(cursor),
      status,
      checkInAt: jamDatang(status, urutan),
    })
    urutan++
  }

  const summary: Record<AttendanceStatus, number> = {
    hadir: 0,
    terlambat: 0,
    izin: 0,
    sakit: 0,
    alpa: 0,
  }

  for (const record of records) {
    summary[record.status]++
  }

  return {
    today: {
      date: todayISO,
      status: checkInHariIni?.status ?? null,
      checkInAt: checkInHariIni?.checkInAt ?? null,
      isSchoolDay: hariSekolah,
    },
    summary,
    records,
  }
}

/** Mencatat kehadiran hari ini. Lokal saja, belum dikirim ke server. */
export async function checkIn(today: Date = new Date()): Promise<void> {
  await jeda(400)

  saveCheckIn({
    date: toISODate(today),
    status: 'hadir',
    checkInAt: formatJam(today),
  })
}
