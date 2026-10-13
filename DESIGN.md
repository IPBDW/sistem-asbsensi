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
  Belum tersambung ke server (placeholder, lihat TODO di kode).
