import {
  STATUS_LABEL,
  STATUS_LETTER,
  type AttendanceStatus,
} from '../data/attendance'

/**
 * Warna status sengaja tidak memakai lima hue berbeda.
 *
 * Alasannya: hierarki yang perlu dibaca cuma dua, yaitu "tercatat baik" dan
 * "perlu perhatian". Hadir memakai accent tunggal halaman ini. Terlambat dan
 * izin/sakit turun ke netral. Hanya alpa yang memakai warna bahaya, karena itu
 * satu-satunya status yang memang menuntut tindakan.
 */
const GAYA: Record<AttendanceStatus, string> = {
  hadir: 'border-signal bg-signal text-white',
  terlambat: 'border-ink text-ink',
  izin: 'border-muted text-muted',
  sakit: 'border-muted text-muted',
  alpa: 'border-danger text-danger',
}

export function StatusMark({
  status,
  className,
}: {
  status: AttendanceStatus
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-mark border text-xs font-semibold ${GAYA[status]} ${className ?? ''}`}
    >
      {STATUS_LETTER[status]}
    </span>
  )
}

export function StatusPill({ status }: { status: AttendanceStatus }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-ink">
      <StatusMark status={status} />
      {STATUS_LABEL[status]}
    </span>
  )
}
