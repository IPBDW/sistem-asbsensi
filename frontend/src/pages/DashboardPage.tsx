import { useEffect, useState } from 'react'
import { LogoMark } from '../components/LogoMark'
import { StatusMark } from '../components/StatusMark'
import {
  STATUS_LABEL,
  STATUS_ORDER,
  checkIn,
  fetchAttendance,
  type AttendanceData,
} from '../data/attendance'
import type { Student } from '../data/students'
import { formatTanggalLengkap, formatTanggalPendek } from '../lib/date'

type Props = {
  session: Student
  onLogout: () => void
}

type LoadState = 'loading' | 'ready' | 'error'

function KartuHariIni({
  data,
  onCheckIn,
  sedangPresensi,
}: {
  data: AttendanceData
  onCheckIn: () => void
  sedangPresensi: boolean
}) {
  const { today } = data
  const sudahPresensi = today.status !== null

  return (
    <section
      aria-labelledby="judul-hari-ini"
      className="relative mt-6 overflow-hidden rounded-field border border-line bg-surface"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 ${sudahPresensi ? 'bg-signal' : 'bg-line'}`}
      />

      <div className="py-5 pl-6 pr-5 sm:pl-7">
        {!today.isSchoolDay ? (
          <div>
            <p className="font-brand text-lg text-ink">Hari ini bukan hari sekolah</p>
            <p className="mt-1 text-sm text-muted">
              Presensi tidak dibuka pada akhir pekan.
            </p>
          </div>
        ) : sudahPresensi ? (
          <div className="flex items-center gap-4">
            <StatusMark
              status={today.status!}
              className="h-11 w-11 text-base"
            />
            <div>
              <p className="font-brand text-lg text-ink">
                {STATUS_LABEL[today.status!]}
              </p>
              <p className="mt-0.5 text-sm text-muted">
                {today.checkInAt
                  ? `Tercatat pukul ${today.checkInAt}.`
                  : 'Sudah tercatat untuk hari ini.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-brand text-lg text-ink">Belum presensi</p>
              <p className="mt-1 text-sm text-muted">
                Belum ada catatan kehadiran untuk hari ini.
              </p>
            </div>
            <button
              type="button"
              onClick={onCheckIn}
              disabled={sedangPresensi}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-field bg-signal px-5 py-3 text-base font-semibold text-white transition hover:bg-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-signal/30 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sedangPresensi && (
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
                  />
                </svg>
              )}
              {sedangPresensi ? 'Mencatat…' : 'Presensi sekarang'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function Kerangka() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="mt-6 h-24 rounded-field border border-line bg-surface" />
      <div className="mt-6 h-24 rounded-field border border-line bg-surface" />
      <div className="mt-6 h-64 rounded-field border border-line bg-surface" />
    </div>
  )
}

export default function DashboardPage({ session, onLogout }: Props) {
  const [state, setState] = useState<LoadState>('loading')
  const [data, setData] = useState<AttendanceData | null>(null)
  const [sedangPresensi, setSedangPresensi] = useState(false)
  // Dihitung sekali saat komponen dipasang, bukan setiap render.
  const [tanggalHariIni] = useState(() => new Date())
  // Menaikkan nilai ini memicu pengambilan ulang data.
  const [versiData, setVersiData] = useState(0)

  useEffect(() => {
    let dibatalkan = false

    async function ambil() {
      try {
        const hasil = await fetchAttendance()
        if (dibatalkan) return
        setData(hasil)
        setState('ready')
      } catch {
        if (dibatalkan) return
        setState('error')
      }
    }

    void ambil()

    return () => {
      dibatalkan = true
    }
  }, [versiData])

  async function tanganiPresensi() {
    setSedangPresensi(true)
    try {
      await checkIn()
      setVersiData((v) => v + 1)
    } catch {
      setState('error')
    } finally {
      setSedangPresensi(false)
    }
  }

  function cobaUlang() {
    setState('loading')
    setVersiData((v) => v + 1)
  }

  return (
    <div className="paper-rules flex min-h-[100dvh] flex-col bg-paper">      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <LogoMark className="h-7 w-7 shrink-0 text-signal" />
          <span className="font-brand text-sm text-ink sm:text-base">
            Absensi Sekolah
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="ml-auto inline-flex min-h-11 items-center rounded-field border border-field-line px-4 text-sm font-medium text-ink transition hover:bg-signal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          >
            Keluar
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1
                id="judul-hari-ini"
                className="font-brand text-xl leading-tight text-ink sm:text-2xl"
              >
                Presensi hari ini
              </h1>
              <p className="mt-1 text-sm text-muted">
                {formatTanggalLengkap(tanggalHariIni)}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm font-medium text-ink">{session.name}</p>
              <p className="text-xs text-muted">
                {session.className}, NIS {session.nis}
              </p>
            </div>
          </div>

          {state === 'loading' && <Kerangka />}

          {state === 'error' && (
            <section className="mt-6 rounded-field border border-danger/30 bg-danger-soft px-5 py-5">
              <p className="font-brand text-lg text-ink">Data gagal dimuat</p>
              <p className="mt-1 text-sm text-ink">
                Terjadi masalah saat mengambil data presensi.
              </p>
              <button
                type="button"
                onClick={cobaUlang}
                className="mt-4 rounded-field border border-danger px-4 py-2 text-sm font-semibold text-danger transition hover:bg-danger hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
              >
                Coba lagi
              </button>
            </section>
          )}

          {state === 'ready' && data && (
            <>
              <KartuHariIni
                data={data}
                onCheckIn={() => void tanganiPresensi()}
                sedangPresensi={sedangPresensi}
              />

              <section aria-labelledby="judul-rekap" className="mt-8">
                <h2
                  id="judul-rekap"
                  className="font-brand text-base text-ink sm:text-lg"
                >
                  {data.records.length === 0
                    ? 'Rekap kehadiran'
                    : `Rekap ${data.records.length} hari sekolah terakhir`}
                </h2>

                <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-field border border-line bg-surface sm:grid-cols-5">
                  {STATUS_ORDER.map((status) => (
                    <div
                      key={status}
                      className="flex items-center gap-3 border-line px-4 py-3 last:col-span-2 last:border-t sm:flex-col sm:items-start sm:gap-2 sm:border-l sm:px-4 sm:py-4 sm:last:col-span-1 sm:last:border-t-0 sm:first:border-l-0"
                    >
                      <StatusMark status={status} />
                      <div>
                        <p className="text-xl font-semibold tabular-nums text-ink">
                          {data.summary[status]}
                        </p>
                        <p className="text-xs text-muted">
                          {STATUS_LABEL[status]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section aria-labelledby="judul-riwayat" className="mt-8">
                <h2
                  id="judul-riwayat"
                  className="font-brand text-base text-ink sm:text-lg"
                >
                  Riwayat kehadiran
                </h2>

                {data.records.length === 0 ? (
                  <div className="mt-3 rounded-field border border-dashed border-field-line bg-surface px-5 py-8 text-center">
                    <p className="font-brand text-base text-ink">
                      Belum ada riwayat
                    </p>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
                      Catatan kehadiran akan muncul di sini setelah presensi
                      pertama tercatat.
                    </p>
                  </div>
                ) : (
                  <ul className="mt-3 divide-y divide-line overflow-hidden rounded-field border border-line bg-surface">
                    {data.records.map((record) => (
                      <li
                        key={record.date}
                        className="flex items-center gap-4 px-4 py-3 sm:px-5"
                      >
                        <StatusMark status={record.status} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-ink">
                            {formatTanggalPendek(record.date)}
                          </p>
                          {record.checkInAt && (
                            <p className="mt-0.5 text-xs text-muted">
                              Pukul {record.checkInAt}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 text-sm font-medium text-ink">
                          {STATUS_LABEL[record.status]}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <p className="mt-8 rounded-field border border-line bg-surface px-4 py-3 text-xs leading-relaxed text-muted">
                Riwayat di atas adalah <strong className="font-semibold text-ink">data contoh</strong> untuk
                pengembangan tampilan, belum tersambung ke server sekolah.
                Presensi yang kamu tekan hari ini hanya tersimpan di browser ini.
              </p>
            </>
          )}
        </div>
      </main>

      <footer className="px-4 pb-6 text-center text-xs text-muted">
        © {tanggalHariIni.getFullYear()} Absensi Sekolah
      </footer>
    </div>
  )
}
