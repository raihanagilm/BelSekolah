<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read `antislop.md` (core) and then the skill for the task:
- UI / visual: `skills/antislop-ui/SKILL.md`
- Copy & text: `skills/antislop-copywriting/SKILL.md`
- People: `skills/antislop-human/SKILL.md`
- Mobile / responsive: `skills/antislop-layoutmobile/SKILL.md`
- Code comments: `skills/antislop-code/SKILL.md`
Before starting, ask the user when antislop applies: during the work, or after it is done.
<!-- antislop:end -->

# AGENTS.md: KONTRAK PERILAKU & ATURAN KERJA AI AGENT

> **STATUS MODE ANTI-SLOP**: DITERAPKAN SELAMA PENGERJAAN (Mode 1 - During work).
> Seluruh UI, copy teks, struktur kode, dan skema divalidasi langsung tanpa generic slop.

---

## 1. Rantai Integritas Dokumen (Document Chain & Separation)

Struktur dokumen dipisahkan berdasarkan fokus domain agar setiap pengerjaan memiliki panduan mandiri:

```
                    ┌───────────────────────────────┐
                    │           README.md           │
                    │   (Panduan Pengguna Sekolah)  │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │           AGENTS.md           │
                    │  (Kontrak Perilaku & Ruler AI)│
                    └───────────────┬───────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌───────────────────────────────┐             ┌───────────────────────────────┐
│          docs/WEB.md          │             │        docs/ARDUINO.md        │
│   (Fokus Frontend Web App)    │             │ (Fokus Firmware & Hardware)   │
└────────┬──────────────────────┘             └────────────────┬──────────────┘
         │                                                     │
         └──────────────────────────┬──────────────────────────┘
                                    ▼
                    ┌───────────────────────────────┐
                    │            SPEC.md            │
                    │ (Spesifikasi Teknis & API)    │
                    └───────────────────────────────┘
```

1. **BACA SESUAI FOKUS PENGERJAAN**:
   - Jika fokus mengerjakan **Frontend / Web**: Wajib baca [AGENTS.md](file:///d:/BelSekolah/AGENTS.md) $\rightarrow$ [docs/WEB.md](file:///d:/BelSekolah/docs/WEB.md) $\rightarrow$ [SPEC.md](file:///d:/BelSekolah/SPEC.md).
   - Jika fokus mengerjakan **Firmware / Hardware**: Wajib baca [AGENTS.md](file:///d:/BelSekolah/AGENTS.md) $\rightarrow$ [docs/ARDUINO.md](file:///d:/BelSekolah/docs/ARDUINO.md) $\rightarrow$ [SPEC.md](file:///d:/BelSekolah/SPEC.md).
2. **UPDATE BERSAMAAN DI AKHIR SESI**:
   - Jika ada perubahan tampilan/fitur web $\rightarrow$ update [docs/WEB.md](file:///d:/BelSekolah/docs/WEB.md).
   - Jika ada perubahan pinout/firmware logic $\rightarrow$ update [docs/ARDUINO.md](file:///d:/BelSekolah/docs/ARDUINO.md).
   - Jika ada perubahan kontrak data/REST API $\rightarrow$ update [SPEC.md](file:///d:/BelSekolah/SPEC.md).
   - Catat riwayat pengerjaan pada Bagian 5 di file [AGENTS.md](file:///d:/BelSekolah/AGENTS.md).

---

## 3. Aturan Coding & Anti-Slop Khusus Proyek Ini

Menggabungkan panduan `antislop`, `antislop-vibecoding`, `antislop-ui`, dan `modern-web-guidance`:

### A. Frontend Web Standards (LittleFS ESP32)
1. **FE-01 (Render Order)**: Render konten esensial dashboard terlebih dahulu (Jam & status sistem), elemen sekunder menyusul.
2. **FE-02 & FE-03 (Token Terpusat & No Hardcoding)**: Seluruh warna, ukuran font, dan border-radius wajib memanggil CSS variables di `style.css` (Design Tokens terpusat). Dilarang menyebarkan inline styling sembarangan.
3. **UX-02 (Anti-Slop Visual)**: Desain wajib terasa seperti buatan desainer manusia:
   - Palette maksimal 1 warna dominan (Deep Navy `#1e3a8a`) + 1 warna aksen (Royal Blue `#2563eb`) + warna status fungsional.
   - DILARANG menggunakan neon-glow, rainbow gradient, atau glassmorphism berlebihan yang memberatkan rendering browser mobile.
4. **UX-04 (No Keyboard Emoji as Icons)**: Dilarang menggunakan emoji mentah (seperti 🔥, 🚀, 📈) sebagai icon resmi UI. Gunakan teks semantik atau SVG bersih.
5. **UX-09 (Kontras WCAG AA)**: Seluruh teks wajib lulus rasio kontras $\ge 4.5:1$ (teks normal) dan $\ge 3:1$ (teks besar/icon).
6. **UX-10 & UX-11 (Mobile-First & Breakpoints)**: Antarmuka harus rapi dan responsif dari layar smartphone (320px) hingga layar laptop TU (1920px), tanpa ada horizontal scroll yang bocor.
7. **R-02 (No Em-Dash)**: Dilarang menggunakan tanda baca em-dash (`—`) dalam copy teks bahasa Indonesia. Gunakan tanda hubung `-` atau tanda baca natural lainnya.
8. **R-26 (No Dead Controls)**: Setiap tombol wajib memiliki fungsi aktif nyata (API fetch atau validasi form). Dilarang membuat tombol hiasan semata.

### B. Backend & Firmware Standards (ESP32 C++)
1. **BE-01 & BE-02 (Input Validation & Buffer Guard)**:
   - Parsing JSON menggunakan `ArduinoJson` dengan buffer statis terukur (`StaticJsonDocument` atau `DeserializationOption::Filter`) untuk mencegah *heap fragmentation*.
   - Seluruh input jam (`HH:MM`) dan nomor track audio divalidasi ketat sebelum ditulis ke flash.
2. **Non-Blocking Operation**:
   - Web server wajib menggunakan `ESPAsyncWebServer` agar request HTTP dari browser tidak pernah membuat pembacaan jam bel di `loop()` tersendat.
3. **Audio Pre-Roll & Post-Roll**:
   - Jalur relay amplifier wajib diberi jeda minimal 2 detik sebelum UART DFPlayer aktif dan dimatikan kembali setelah audio selesai guna mencegah *ground loop hum*.

---

## 4. Checklist Rilis Sebelum Pekerjaan Dinyatakan Selesai (Release Gate)

Setiap agen AI wajib memverifikasi checklist berikut sebelum menyerahkan tugas:
- [ ] Ketiga file dokumen ([README.md](file:///d:/BelSekolah/README.md), [SPEC.md](file:///d:/BelSekolah/SPEC.md), [AGENTS.md](file:///d:/BelSekolah/AGENTS.md)) telah diperbarui dan saling sinkron.
- [ ] Tidak ada em-dash (`—`) dalam teks copy yang dibuat.
- [ ] Semua tombol antarmuka web memiliki fungsi nyata (tidak ada kontrol mati).
- [ ] Kontras warna memenuhi standar WCAG AA.
- [ ] Skema database `schedule.json` sesuai dengan spesifikasi di `SPEC.md`.
- [ ] Tabel data responsif pada breakpoint mobile tanpa merusak tata letak.

---

## 5. Log Riwayat Perubahan (Changelog AI)

- **2026-10-20**:
  - Pemisahan fokus domain dokumen: dibuat [docs/WEB.md](file:///d:/BelSekolah/docs/WEB.md) (Frontend LittleFS) dan [docs/ARDUINO.md](file:///d:/BelSekolah/docs/ARDUINO.md) (Firmware C++ & Wiring) agar pengerjaan web dan mikrokontroler memiliki dokumen acuan mandiri.
  - Inisialisasi kontrak dokumen tripartit: `README.md` (User Guide), `SPEC.md` (Teknis & Data), `AGENTS.md` (Ruler AI).
  - Mode Anti-Slop diaktifkan secara permanen selama pengerjaan berlangsung.
  - Dokumentasi spesifikasi hardware DFPlayer Mini, RTC DS3231, dan Auto-Mute Relay.
  - Implementasi frontend web responsif Vanilla HTML/CSS/JS di folder `firmware/data/`:
    - `index.html`: Dashboard operasional, live clock ticker, manual bell trigger, dan jadwal hari ini.
    - `schedule.html`: Multi-preset selector, form penambahan jadwal, dan CRUD tabel jadwal.
    - `audio.html`: Pustaka audio DFPlayer MicroSD dan uji putar track.
    - `settings.html`: Sinkronisasi satu-klik jam RTC dengan browser dan setting relay pre-roll.
    - `style.css`: Design tokens bersih, anti-slop, dan responsive table container query.
    - `app.js`: REST API client async fetch.
