# PANDUAN PENGEMBANGAN WEB DASHBOARD (WEB.md)
## Bel Sekolah Otomatis Mandiri ESP32

> **KONTRAK KETERIKATAN DOKUMEN (DOCUMENT BINDING CONTRACT)**:
> File ini adalah spesifikasi resmi domain **Frontend Web App**.
> - Induk Kontrak AI: [AGENTS.md](file:///d:/BelSekolah/AGENTS.md) (Wajib dibaca sebelum coding frontend).
> - Kontrak Data & API: [SPEC.md](file:///d:/BelSekolah/SPEC.md) (Rujukan schema JSON dan endpoint REST API).
> - Domain Hardware: [docs/ARDUINO.md](file:///d:/BelSekolah/docs/ARDUINO.md) (Spesifikasi mikrokontroler & audio player).
> - Panduan Pengguna: [README.md](file:///d:/BelSekolah/README.md).
>
> **ATURAN UPDATE BERSAMAAN**: Jika terjadi penambahan endpoint baru atau perubahan struktur halaman di file ini, agen AI wajib memperbarui [SPEC.md](file:///d:/BelSekolah/SPEC.md), [README.md](file:///d:/BelSekolah/README.md), dan mencatatnya di changelog [AGENTS.md](file:///d:/BelSekolah/AGENTS.md).

---

## 1. Arsitektur Frontend & Batasan Hardware ESP32
1. **Penyimpanan Flash Terbatas**: Seluruh aset web disimpan dalam flash internal ESP32 (LittleFS).
   - Batas ukuran aset: Total file HTML, CSS, dan JS wajib **< 150 KB**.
   - Tidak menggunakan framework runtime besar (React, Vue, Angular, atau dependensi node_modules) di runtime ESP32.
2. **Teknologi**:
   - **HTML5 Semantik**: Struktur dokumen bersih dengan header, nav, main, table, dan form.
   - **Vanilla CSS3 Modern**: Sistem token terpusat (`style.css`), `@container` query untuk tabel responsif, tanpa utility class sembarangan.
   - **Vanilla JavaScript (ES6+)**: `app.js` sebagai HTTP client async fetch yang ringan dan non-blocking.

---

## 2. Struktur Halaman & Tanggung Jawab
Frontend dibagi menjadi 4 halaman terpisah untuk menjaga kejelasan alur kerja:

| File Halaman | Nama Menu | Tanggung Jawab & Fitur Utama |
|---|---|---|
| `index.html` | Beranda / Dashboard | - Live Clock ticker (Jam:Menit:Detik)<br>- Indikator status koneksi ESP32 & RTC DS3231<br>- Panel trigger manual bel darurat / pengumuman (dengan konfirmasi modal PIN)<br>- Agenda tabel bel yang berbunyi hari ini |
| `schedule.html` | Kelola Jadwal | - Switch preset aktif (`reguler`, `jumat`, `ujian`)<br>- Form tambah jadwal bel baru (jam, menit, track, hari)<br>- Tabel jadwal aktif dengan tombol Uji Coba & Hapus per baris |
| `audio.html` | Pustaka Audio | - Daftar pemetaan file MP3 MicroSD (`0001.mp3` s/d `0008.mp3`)<br>- Form edit judul nada bel dan penambahan pemetaan track baru<br>- Tombol uji dengar per track langsung ke speaker/amplifier |
| `settings.html` | Pengaturan | - Tombol 1-klik sinkronisasi jam RTC DS3231 dengan jam browser<br>- Konfigurasi volume nada dering (0-30)<br>- Pengaturan jeda waktu pre-roll relay amplifier<br>- Form ganti PIN Admin keamanan sistem<br>- Panduan visual pinout ESP32 |

---

## 3. Standar UI/UX & Anti-Slop (Frontend Web)
- **FE-01 (Render Order)**: Render komponen waktu dan ringkasan utama terlebih dahulu, notifikasi atau modal belakangan.
- **FE-02 (Komponen Terpusat)**: Pola navbar, header, card, modal PIN dialog, dan tombol memakai kelas seragam yang didefinisikan di `style.css`.
- **FE-03 (Design Tokens)**:
  - Warna dominan: Deep Navy `#1e3a8a`
  - Warna aksen: Royal Blue `#2563eb`
  - Warna status: Hijau `#15803d` (sukses), Merah `#b91c1c` (danger/manual trigger)
  - Background: Slate `#f8fafc` & Kartu `#ffffff`
- **UX-04 (No Keyboard Emoji)**: Gunakan simbol teks standar atau ikon SVG bersih untuk tombol aksi.
- **UX-09 (Kontras WCAG AA)**: Seluruh teks pada tombol dan tabel wajib memiliki rasio kontras $\ge 4.5:1$.
- **UX-10 & UX-11 (Responsiveness)**: Tata letak responsif penuh dari layar smartphone (320px) hingga layar monitor ruang piket (1920px).

---

## 4. Alur Integrasi REST API (`app.js`)
Frontend berkomunikasi secara asynchronous dengan firmware ESP32 melalui endpoint:
- `GET /schedule.json`: Membaca database jadwal.
- `POST /api/schedule/save`: Menyimpan perubahan jadwal atau pergantian preset ke flash.
- `POST /api/trigger?track={id}`: Membunyikan bel secara manual.
- `POST /api/time/sync?epoch={seconds}`: Mengirim timestamp browser ke RTC.
- `GET /api/status`: Mengambil status koneksi hardware secara live.
- `POST /api/auth/login`: Verifikasi PIN admin (disimpan di `sessionStorage`).
- `POST /api/auth/change-pin`: Mengganti PIN admin di pengaturan.
- `POST /api/tracks/save`: Menyimpan pembaruan daftar dan judul track audio.

---

## 5. Checklist Verifikasi Frontend Sebelum Rilis
- [ ] Semua tombol dapat diklik dan menjalankan fungsi fetch/validasi (tidak ada dead controls).
- [ ] Tidak ada scroll horizontal yang bocor pada tampilan mobile (< 600px).
- [ ] Sinkronisasi jam browser berhasil mengirim timestamp valid ke ESP32.
- [ ] Preset yang diubah langsung memperbarui daftar agenda bel di beranda.
