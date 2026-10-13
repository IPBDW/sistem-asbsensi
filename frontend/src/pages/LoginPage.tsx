import { useId, useState, type FormEvent } from 'react'
import { LogoMark } from '../components/LogoMark'
import { Stamp } from '../components/Stamp'
import type { Student } from '../data/students'
import { saveSession, login } from '../lib/auth'

type FormState = {
  nis: string
  password: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const initialForm: FormState = {
  nis: '',
  password: '',
}

const NIS_PATTERN = /^[0-9]{4,20}$/

const CURRENT_YEAR = new Date().getFullYear()

function validateField(key: keyof FormState, value: string): string | undefined {
  if (key === 'nis') {
    if (!value.trim()) return 'NIS wajib diisi.'
    if (!NIS_PATTERN.test(value.trim())) return 'NIS berisi 4 sampai 20 angka.'
    return undefined
  }

  if (!value) return 'Password wajib diisi.'
  if (value.length < 6) return 'Password minimal 6 karakter.'
  return undefined
}

export default function LoginPage({ onSuccess }: { onSuccess: (session: Student) => void }) {
  const fieldId = useId()
  const nisId = `${fieldId}-nis`
  const nisHelpId = `${nisId}-help`
  const nisErrorId = `${nisId}-error`
  const passwordId = `${fieldId}-password`
  const passwordHelpId = `${passwordId}-help`
  const passwordErrorId = `${passwordId}-error`

  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    setNotice(null)
  }

  function handleBlur(key: keyof FormState) {
    const message = validateField(key, form[key])
    setErrors((prev) => ({ ...prev, [key]: message }))
  }

  function validate(): boolean {
    const next: FieldErrors = {
      nis: validateField('nis', form.nis),
      password: validateField('password', form.password),
    }
    setErrors(next)
    return !next.nis && !next.password
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setNotice(null)

    // Memeriksa ke daftar akun contoh di src/data/students.ts.
    // Ganti dengan POST /auth/login saat backend siap.
    await new Promise((resolve) => setTimeout(resolve, 400))

    const hasil = login(form.nis, form.password)

    setSubmitting(false)

    if (!hasil.ok) {
      setNotice(hasil.message)
      return
    }

    saveSession(hasil.session)
    onSuccess(hasil.session)
  }

  const fieldBase =
    'mt-2 w-full rounded-field border bg-paper px-3.5 py-3 text-base text-ink outline-none transition placeholder:text-muted focus:bg-white focus:ring-4'

  return (
    <div className="paper-rules flex min-h-[100dvh] flex-col bg-paper">
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-5 sm:py-12">
        <div className="w-full max-w-[26rem]">
          <section className="relative overflow-hidden rounded-field border border-line bg-surface shadow-[0_1px_0_rgba(14,28,51,0.04),0_18px_40px_-24px_rgba(14,28,51,0.35)]">
            {/* Punggung lembar: penanda margin buku presensi */}
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-signal/70"
            />

            <header className="relative border-b border-line py-5 pl-6 pr-20 sm:pl-7 sm:pr-24">
              <div className="flex items-center gap-3">
                <LogoMark className="h-9 w-9 shrink-0 text-signal sm:h-10 sm:w-10" />
                <div className="min-w-0">
                  <h1 className="font-brand text-base leading-tight tracking-tight text-ink sm:text-lg">
                    Absensi Sekolah
                  </h1>
                  <p className="mt-0.5 text-xs text-muted">Presensi harian</p>
                </div>
              </div>
              <Stamp className="absolute right-4 top-5 sm:right-6" />
            </header>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="px-6 py-6 sm:px-7"
              aria-busy={submitting}
            >
              {/* NIS */}
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <label
                    htmlFor={nisId}
                    className="text-sm font-medium text-ink"
                  >
                    NIS
                  </label>
                  <span className="text-xs text-muted">Nomor Induk Siswa</span>
                </div>
                <input
                  id={nisId}
                  name="nis"
                  type="text"
                  inputMode="numeric"
                  autoComplete="username"
                  enterKeyHint="next"
                  placeholder="Contoh: 20240012"
                  value={form.nis}
                  onChange={(e) => updateField('nis', e.target.value)}
                  onBlur={() => handleBlur('nis')}
                  aria-invalid={Boolean(errors.nis)}
                  aria-describedby={
                    errors.nis ? nisErrorId : nisHelpId
                  }
                  className={`${fieldBase} ${
                    errors.nis
                      ? 'border-danger focus:border-danger focus:ring-danger/15'
                      : 'border-field-line focus:border-signal focus:ring-signal/20'
                  }`}
                />
                {errors.nis ? (
                  <p
                    id={nisErrorId}
                    role="alert"
                    className="mt-1.5 text-xs font-medium text-danger"
                  >
                    {errors.nis}
                  </p>
                ) : (
                  <p id={nisHelpId} className="mt-1.5 text-xs text-muted">
                    Angka pada kartu pelajar.
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mt-5">
                <label htmlFor={passwordId} className="text-sm font-medium text-ink">
                  Password
                </label>
                <div className="relative">
                  <input
                    id={passwordId}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    enterKeyHint="go"
                    placeholder="Masukkan password"
                    value={form.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? passwordErrorId : passwordHelpId
                    }
                    className={`${fieldBase} pr-14 ${
                      errors.password
                        ? 'border-danger focus:border-danger focus:ring-danger/15'
                        : 'border-field-line focus:border-signal focus:ring-signal/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? 'Sembunyikan password' : 'Lihat password'
                    }
                    aria-pressed={showPassword}
                    className="absolute inset-y-0.5 right-0.5 flex w-11 items-center justify-center rounded-field text-muted transition hover:bg-signal-soft hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19M6.61 6.61A18.5 18.5 0 0 0 2 12s3 8 10 8a9.12 9.12 0 0 0 5.39-1.61" />
                        <path d="m2 2 20 20" />
                        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p
                    id={passwordErrorId}
                    role="alert"
                    className="mt-1.5 text-xs font-medium text-danger"
                  >
                    {errors.password}
                  </p>
                ) : (
                  <p id={passwordHelpId} className="mt-1.5 text-xs text-muted">
                    Minimal 6 karakter.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-field bg-signal px-4 py-3 text-base font-semibold text-white transition hover:bg-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-signal/30 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && (
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
                {submitting ? 'Memeriksa…' : 'Masuk'}
              </button>

              {notice && (
                <p
                  role="alert"
                  className="mt-4 rounded-field border border-danger/30 bg-danger-soft px-3.5 py-3 text-xs leading-relaxed font-medium text-danger"
                >
                  {notice}
                </p>
              )}
            </form>
          </section>

          <div className="mt-4 rounded-field border border-line bg-surface px-4 py-3">
            <p className="text-xs font-medium text-ink">Akun contoh untuk uji coba</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              NIS <span className="font-semibold tabular-nums text-ink">2024001</span>,
              password <span className="font-semibold tabular-nums text-ink">123456</span>.
              Akun ini hanya ada di browser, belum tersambung ke server sekolah.
            </p>
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-muted">
            Lupa password? Hubungi wali kelas atau admin sekolah.
          </p>
        </div>
      </main>

      <footer className="px-4 pb-6 text-center text-xs text-muted">
        © {CURRENT_YEAR} Absensi Sekolah
      </footer>
    </div>
  )
}
