# DESIGN.md: Absensi Sekolah

Kontrak desain project. Semua halaman frontend tunduk pada file ini.
Diperbarui: halaman login (frontend).

## Design Read

Halaman login aplikasi absensi sekolah untuk siswa SMP/SMA di Indonesia.
Bahasa: utilitarian-tepercaya. Arah diturunkan dari **buku presensi kelas**
(kertas, garis kolom, tinta pulpen, stempel guru), bukan dari default
"gradient biru tech".

## Dials

| Dial | Nilai | Alasan |
|---|---|---|
| ENERGY | 1 | Layanan publik/sekolah, aksesibilitas kritis, audiens siswa |
| RHYTHM | 2 | Satu layar: konsisten, satu break (panel stempel) |
| MOTION | 1 | Hover/focus saja. Gerak harus punya alasan |

## Palet

Peran (bukan sekadar nama warna). Diambil dari material buku presensi.

| Token | Nilai | Peran |
|---|---|---|
| `--color-ink` | `#0E1C33` | Teks utama + panel gelap (tinta navy) |
| `--color-ink-2` | `#1B2E4B` | Garis/panel turunan |
| `--color-signal` | `#1D3FA8` | Satu accent: tinta pulpen/stempel |
| `--color-signal-soft` | `#E8ECFA` | Latar accent (fokus, notice) |
| `--color-paper` | `#F3F4F1` | Ground halaman (kertas) |
| `--color-surface` | `#FFFFFF` | Permukaan form |
| `--color-line` | `#D5DAD3` | Border/divider dekoratif |
| `--color-field-line` | `#858C83` | Batas input (butuh ≥3:1, WCAG 1.4.11) |
| `--color-muted` | `#56606E` | Teks sekunder |
| `--color-danger` | `#B42318` | Error (bukan accent) |
| `--color-danger-soft` | `#FEECEB` | Latar error |

Aturan: maksimal 2 warna inti (ink, paper) + 1 accent (signal). Danger
dipisah dari accent supaya error tidak ambigu.

## Tipografi

- UI: system sans stack (kecepatan, tanpa dependency jaringan).
- Brand/wordmark: serif (`Georgia, 'Times New Roman', serif`) untuk nuansa cetak.
- Tanpa eyebrow ALL-CAPS tracked (hindari tell template chrome).

## Radius

Satu skala: `0.625rem` (10px) untuk input/tombol/kartu. Tanpa pill.

## Motif tanda tangan

**Stempel "HADIR"** di panel brand. Satu elemen yang diingat; sisanya kalem.
Latar panel memakai garis kolom buku presensi (repeating rule) + satu garis margin.

## Halaman yang sudah dibangun

- `frontend/src/pages/LoginPage.tsx`: login siswa (NIS + password).
  Memeriksa ke daftar akun contoh, belum ke server.
- `frontend/src/pages/DashboardPage.tsx`: dashboard presensi siswa.
  Presensi hari ini, rekap 12 hari sekolah terakhir, dan riwayat kehadiran.

## Halaman dashboard (presensi siswa)

Arah: **rekap di buku presensi**. Halaman ini adalah lembar rekap yang biasanya
dipegang guru, bukan dasbor analitik.

Struktur:

1. Header: logo + nama aplikasi + tombol Keluar.
2. Identitas siswa + tanggal.
3. **Kartu hari ini**: satu aksi utama halaman ini (tombol Presensi sekarang).
4. **Rekap**: jumlah per status untuk 12 hari sekolah terakhir.
5. **Riwayat**: daftar tanggal dengan tanda status.
6. Catatan bahwa datanya contoh.

Keputusan dan alasannya:

- **Tanda status memakai huruf H/T/I/S/A**, singkatan yang memang dipakai guru
  di buku presensi. Huruf di dalam kotak kecil meniru tanda cetak, bukan ikon.
- **Lima status tidak memakai lima warna.** Hierarki yang perlu dibaca hanya dua:
  tercatat baik, dan perlu perhatian. Hadir memakai accent tunggal halaman ini.
  Terlambat turun ke netral gelap, izin dan sakit ke netral, hanya alpa memakai
  warna bahaya karena itu satu-satunya status yang menuntut tindakan.
- **Rekap berbentuk baris seragam**, bukan kartu beragam. Itemnya setara (semua
  hitungan jenis yang sama), jadi keseragaman di sini memang bentuk yang benar,
  bukan repetisi tanpa alasan.
- **Bar aksen di tepi kiri kartu** mengulang motif "punggung lembar" dari halaman
  login, supaya kedua halaman terbaca sebagai satu sistem.
- **Angka memakai `tabular-nums`** supaya kolom hitungan rata saat dibandingkan.

Skala radius halaman ini ada dua tingkat, keduanya token:

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `--radius-field` | 10px | Kartu, input, tombol, panel |
| `--radius-mark` | 4px | Kotak tanda status |

## Data

- `frontend/src/data/students.ts`: satu akun contoh (Santoso, NIS 2024001).
- `frontend/src/data/attendance.ts`: riwayat contoh 12 hari sekolah terakhir.
- `frontend/src/lib/auth.ts`: pemeriksaan kredensial di sisi klien.

**Batas yang disadari:** semua data ini hidup di bundle frontend, jadi bisa
dibaca siapa pun lewat DevTools, termasuk password. Ini hanya untuk mencoba
alur halaman. Ganti dengan backend sebelum dipakai sungguhan.
