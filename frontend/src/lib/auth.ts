import { STUDENT_RECORDS, type Student } from '../data/students'

const SESSION_KEY = 'absensi.session'

export type LoginResult =
  | { ok: true; session: Student }
  | { ok: false; message: string }

/**
 * Pemeriksaan kredensial di sisi klien. Ini BUKAN autentikasi sungguhan:
 * tidak ada token, tidak ada server, dan seluruh daftar akun ikut terkirim
 * ke browser. Dipakai hanya supaya alur halaman bisa dicoba.
 */
export function login(nis: string, password: string): LoginResult {
  const record = STUDENT_RECORDS.find((s) => s.nis === nis.trim())

  if (!record || record.password !== password) {
    return { ok: false, message: 'NIS atau password salah.' }
  }

  return {
    ok: true,
    session: {
      nis: record.nis,
      name: record.name,
      className: record.className,
      academicYear: record.academicYear,
    },
  }
}

export function saveSession(session: Student): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // Mode privat bisa memblokir sessionStorage. Abaikan: sesi cukup di memori.
  }
}

export function readSession(): Student | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as Student).nis === 'string' &&
      typeof (parsed as Student).name === 'string'
    ) {
      return parsed as Student
    }
    return null
  } catch {
    return null
  }
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // Tidak ada yang perlu dibersihkan kalau storage memang tidak bisa diakses.
  }
}
