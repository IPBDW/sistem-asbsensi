/**
 * Motif tanda tangan halaman ini: stempel kehadiran.
 * Dipakai di halaman login sebagai penanda identitas, bukan status data.
 */
export function Stamp({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-14 w-14 rotate-[-7deg] items-center justify-center rounded-full border-2 border-signal font-brand text-[0.625rem] font-bold uppercase tracking-[0.18em] text-signal sm:h-16 sm:w-16 ${className ?? ''}`}
    >
      Hadir
    </span>
  )
}
