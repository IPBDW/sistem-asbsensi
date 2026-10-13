/**
 * "Database" contoh, BUKAN database sungguhan.
 *
 * Data ini hidup di dalam bundle JavaScript frontend. Artinya siapa pun yang
 * membuka situs bisa membacanya lewat DevTools, termasuk kolom password.
 *
 * Sengaja dibiarkan apa adanya supaya jelas bahwa ini belum aman. Kalau di-hash
 * di sini pun tidak menolong: password 6 karakter bisa dibongkar dalam hitungan
 * detik, dan hasil hash-nya tetap ikut terkirim ke browser. Itu keamanan palsu.
 *
 * Ganti seluruh modul ini dengan panggilan ke backend (POST /auth/login) sebelum
 * dipakai sungguhan.
 */

export type Student = {
  nis: string
  name: string
  className: string
  academicYear: string
}

type StudentRecord = Student & {
  /** DEMO SAJA. Jangan pernah simpan password di sisi klien untuk produksi. */
  password: string
}

export const STUDENT_RECORDS: StudentRecord[] = [
  {
    nis: '2024001',
    name: 'Santoso',
    className: 'XI IPA 1',
    academicYear: '2026/2027',
    password: '123456',
  },
]
