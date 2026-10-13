import { useState, type FormEvent } from 'react'

type FormState = {
  nis: string
  password: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const initialForm: FormState = {
  nis: '',
  password: '',
}

export default function LoginPage() {
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

  function validate(): boolean {
    const next: FieldErrors = {}

    if (!form.nis.trim()) {
      next.nis = 'NIS wajib diisi'
    } else if (!/^[0-9]{4,20}$/.test(form.nis.trim())) {
      next.nis = 'NIS hanya boleh berisi angka (4-20 digit)'
    }

    if (!form.password) {
      next.password = 'Password wajib diisi'
    } else if (form.password.length < 6) {
      next.password = 'Password minimal 6 karakter'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setNotice(null)

    // TODO: hubungkan ke backend (POST /auth/login) pada fase berikutnya.
    await new Promise((resolve) => setTimeout(resolve, 800))

    setSubmitting(false)
    setNotice('Halaman login siap. Integrasi ke server akan dibuat pada tahap berikutnya.')
  }

  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <main className="flex flex-1 flex-col justify-center px-5 py-10">
        <div className="mx-auto w-full max-w-sm">
          {/* Brand */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
                aria-hidden="true"
              >
                <path d="M22 10 12 5 2 10l10 5 10-5Z" />
                <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Absensi Sekolah
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Masuk dengan NIS dan password kamu
            </p>
          </div>

          {/* Card */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/60 ring-1 ring-slate-100"
          >
            {/* NIS */}
            <div className="mb-4">
              <label
                htmlFor="nis"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                NIS
              </label>
              <input
                id="nis"
                name="nis"
                type="text"
                inputMode="numeric"
                autoComplete="username"
                placeholder="Contoh: 20240012"
                value={form.nis}
                onChange={(e) => updateField('nis', e.target.value)}
                aria-invalid={Boolean(errors.nis)}
                aria-describedby={errors.nis ? 'nis-error' : undefined}
                className={`w-full rounded-xl border bg-white px-3.5 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                  errors.nis
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {errors.nis && (
                <p id="nis-error" className="mt-1.5 text-sm text-red-600">
                  {errors.nis}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-5">
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`w-full rounded-xl border bg-white py-3 pl-3.5 pr-12 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                    errors.password
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-slate-600"
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
              {errors.password && (
                <p id="password-error" className="mt-1.5 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
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
              {submitting ? 'Memproses…' : 'Masuk'}
            </button>

            {notice && (
              <p className="mt-4 rounded-lg bg-blue-50 px-3 py-2.5 text-center text-sm text-blue-700">
                {notice}
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Lupa password? Hubungi guru atau admin sekolah.
          </p>
        </div>
      </main>

      <footer className="pb-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Absensi Sekolah
      </footer>
    </div>
  )
}
