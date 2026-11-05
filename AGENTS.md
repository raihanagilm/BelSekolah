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

## 2. Aturan Global (User Global Rules & Protocols)

Berikut aturan global (Better Design, Discovery Protocol, dan Standar Desain/Pengujian) yang telah dipindahkan dan diberlakukan penuh pada workspace ini:

### A. Better Design Protocol
1. **Design system**: Pertahankan desain asli sistem bel sekolah. Gunakan token warna, tipografi, dan radius yang konsisten.
2. **Principles**: Terapkan prinsip hierarki visual sebelum styling, dan fungsionalitas alur sebelum behavior interaktif.
3. **Build**: Layar aplikasi berada di dalam app shell yang rapi dengan data waktu nyata dan indikator status akurat.
4. **Review**: Pastikan kontras teks lulus WCAG AA, kerapian spacing, dan hilangkan potensi ambiguitas antarmuka.

### B. Discovery & Anti-Assumption Protocol
1. **Evaluasi Prompt**: Cek apakah permintaan ambigu atau kurang spesifik. Jangan menebak asumsi sendiri jika konteks kritis belum jelas.
2. **End-to-End Workflow Mapping**: Petakan alur operasional bel (mode hybrid laptop vs IoT ESP8266/ESP32, trigger manual vs otomatis, sinkronisasi waktu, relay auto-mute).
3. **Anti-AI Clichés**: Dilarang keras menggunakan bullet dekoratif mentah, badge hiasan tanpa fungsi, atau emoji keyboard berlebihan pada elemen formal.
4. **Sistem 1 Warna Dominan & Shade Ramp (Anti-Rainbow Slop)**: Gunakan satu identitas warna utama (Deep Navy `#1e3a8a` & Royal Blue `#2563eb`) dengan variasi shade ramp. Hindari tombol/kartu warna-warni pelangi.
5. **Anti Box-in-Box**: Hindari pembungkusan kotak/border bertingkat berlebihan. Biarkan tipografi bernapas.
6. **Strict Text Casing**: Konsisten dalam penggunaan huruf kapital/kecil pada teks keterangan selevel.
7. **Isolasi Warna Semantik**: Warna hijau (sukses/terhubung), merah (bahaya/putus/habis), kuning/amber (peringatan/transisi) hanya untuk status fungsional.
8. **Test Relevancy & Data Freshness**: Seluruh simulasi dan skenario pengujian wajib mencerminkan logika firmware dan hardware aktif terkini.

---

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
- **2026-10-21**:
  - Penyempurnaan spesifikasi dan dokumen arsitektur:
    - Penambahan sistem **Autentikasi PIN Keamanan Admin** (`admin_pin`) pada skema `schedule.json`, endpoint REST API `/api/auth/login` & `/api/auth/change-pin`.
    - Penambahan fitur **Kustomisasi Pustaka Audio** melalui endpoint `/api/tracks/save` dan form interaktif di `audio.html`.
    - Sinkronisasi rantai dokumen: [README.md](file:///d:/BelSekolah/README.md), [SPEC.md](file:///d:/BelSekolah/SPEC.md), [docs/WEB.md](file:///d:/BelSekolah/docs/WEB.md), dan [docs/ARDUINO.md](file:///d:/BelSekolah/docs/ARDUINO.md).
  - Implementasi penuh kode firmware dan frontend berbasis arsitektur teruji `Schop/esp32-rfid-jukebox`:
    - Membuat konfigurasi [firmware/platformio.ini](file:///d:/BelSekolah/firmware/platformio.ini) untuk ESP32 dengan dependensi DFRobotDFPlayerMini, RTClib, ArduinoJson v7, dan ESPAsyncWebServer.
    - Mengimplementasikan seluruh aset frontend LittleFS: [index.html](file:///d:/BelSekolah/firmware/data/index.html), [schedule.html](file:///d:/BelSekolah/firmware/data/schedule.html), [audio.html](file:///d:/BelSekolah/firmware/data/audio.html), [settings.html](file:///d:/BelSekolah/firmware/data/settings.html), [style.css](file:///d:/BelSekolah/firmware/data/style.css), [app.js](file:///d:/BelSekolah/firmware/data/app.js), dan [schedule.json](file:///d:/BelSekolah/firmware/data/schedule.json).
    - Mengimplementasikan firmware inti di [firmware/src/main.cpp](file:///d:/BelSekolah/firmware/src/main.cpp) (Wi-Fi AP mandiri, scheduler RTC non-blocking, relay amplifier auto-mute, dan REST API handlers).
  - Pembuatan dokumen panduan belanja & prototipe:
    - Membuat [DAFTAR_BELANJA.md](file:///d:/BelSekolah/DAFTAR_BELANJA.md) (BOM lengkap, estimasi harga pasaran e-commerce, spesifikasi dan tips pemilihan modul).
    - Menyiapkan sketch Arduino IDE [firmware/firmware.ino](file:///d:/BelSekolah/firmware/firmware.ino) untuk kemudahan kompilasi dan upload langsung dari Arduino IDE.
- **2026-10-23**:
  - Sinkronisasi sirkuit & BOM hardware: memperbarui [DAFTAR_BELANJA.md](file:///d:/BelSekolah/DAFTAR_BELANJA.md) dengan penambahan item LED indikator 5mm dan Resistor 220Ω (GPIO 2) agar 100% identik dengan rangkaian simulasi visual Wokwi.
  - Perbaikan kompatibilitas compiler: patching `WebAuthentication.cpp` ESPAsyncWebServer untuk ESP32 Arduino Core v3 (mbedtls 3.x) dan penambahan header `<AsyncJson.h>`.
  - Penataan dan integrasi 21 rekaman audio asli dari repositori `cimo95/delphi-belsekolah` ke folder kartu memori [microsd_audio/mp3/](file:///d:/BelSekolah/microsd_audio/mp3/) dan frontend [firmware/data/audio/](file:///d:/BelSekolah/firmware/data/audio/).
  - Pembaruan konfigurasi diagram simulasi Wokwi [firmware/wokwi_diagram.json](file:///d:/BelSekolah/firmware/wokwi_diagram.json) dan penyediaan panduan Wokwi IoT Gateway / Web Server simulator.
  - Penyusunan dokumen komparasi dan langkah perakitan fisik: [PANDUAN_TRANSISI.md](file:///d:/BelSekolah/PANDUAN_TRANSISI.md) (perbandingan mendalam simulasi vs perangkat nyata, panduan flash LittleFS, wiring breadboard DFPlayer/RTC/Relay, dan pengoperasian perdana).
- **2026-10-26**:
  - Migrasi target hardware & porting firmware ke **ESP8266 V3 CH340 (Lolin Type-C)** dan **Modul Relay 5V 2-Channel**:
    - [firmware/firmware.ino](file:///d:/BelSekolah/firmware/firmware.ino): Menambahkan dukungan multi-platform (`#if defined(ESP8266)` / `ESP32`), `SoftwareSerial` (D5/D6) untuk DFPlayer Mini, I2C Wire (D1/D2) untuk RTC DS3231, dan kontrol Relay Dual-Channel (D7 untuk Mute Audio, D0 untuk Saklar Daya Listrik Amplifier).
    - [firmware/platformio.ini](file:///d:/BelSekolah/firmware/platformio.ini): Menambahkan environment `[env:esp8266]` dengan konfigurasi partisi 4MB (2MB code / 2MB LittleFS) serta dependensi `ESPAsyncWebServer-esphome` & `ESPAsyncTCP-esphome`.
    - [SPEC.md](file:///d:/BelSekolah/SPEC.md) & [docs/ARDUINO.md](file:///d:/BelSekolah/docs/ARDUINO.md): Memperbarui diagram pinout, skema wiring D1-D7, dan hierarki kontrol relay ganda.
    - [DAFTAR_BELANJA.md](file:///d:/BelSekolah/DAFTAR_BELANJA.md): Memperbarui status kepemilikan komponen pengguna (ESP8266 & Relay 2-CH sudah ada, memfokuskan daftar belanja hanya pada DFPlayer Mini, RTC DS3231, MicroSD FAT32, dan Resistor 1kΩ).
    - [PANDUAN_TEST_ESP8266.md](file:///d:/BelSekolah/PANDUAN_TEST_ESP8266.md): Panduan mandiri pengujian langsung modul ESP8266 V3 Lolin Type-C (Driver CH340, flashing Arduino IDE, upload LittleFS, dan pengujian Web AP Wi-Fi tanpa menunggu modul lain).
    - **Mode Hybrid & Audio Laptop Lokal**:
      - [firmware/data/app.js](file:///d:/BelSekolah/firmware/data/app.js): Menambahkan background scheduler jam lokal browser dan dispatcher audio ganda (memutar file `.mp3` langsung dari folder lokal laptop via HTML5 Audio API sekaligus memicu relay ESP8266 secara hybrid).
      - [Aplikasi_Bel_Sekolah.bat](file:///d:/BelSekolah/Aplikasi_Bel_Sekolah.bat): Otomasi peluncuran aplikasi desktop Chromium (`--app`) langsung ke file web lokal laptop dengan pendeteksian otomatis koneksi Wi-Fi ESP8266.
      - [firmware/firmware.ino](file:///d:/BelSekolah/firmware/firmware.ino): Penambahan fallback antarmuka dashboard darurat tersemat (Embedded Web) dan pemicu bel non-blocking berbasis state-machine (mencegah watchdog timeout / HTTP 500 error).
- **2026-11-03**:
  - Penataan struktur proyek dan migrasi aturan global:
    - Membuat folder `.gemini/GEMINI.md` lokal di workspace untuk menampung rule global (`Better Design` & `Discovery / Anti-Assumption Protocol`).
    - Mengintegrasikan aturan global ke dalam dokumen kontrak kerja [AGENTS.md](file:///d:/BelSekolah/AGENTS.md) pada Bagian 2 (Aturan Global).
    - Memperbaiki kelengkapan direktori workspace:
      - Menambahkan folder `firmware/src/` berisi `main.cpp` (sinkron dengan `firmware.ino`) untuk kompatibilitas build PlatformIO.
      - Menambahkan folder `simulation/` berisi `diagram.json` untuk konfigurasi simulator Wokwi.
      - Merelokasi skrip utilitas `organize_audio.ps1` ke folder `tools/`.
      - Menambahkan `.gitignore` di root untuk merapikan artefak binary (`.bin`, `.exe`, `.pcap`) dan file build cache.
  - Perbaikan antarmuka web anti-slop & implementasi sistem reset:
    - Menghilangkan elemen badge khas AI (`.badge-dot`, background berkapsul pastel ganda) dan merapikan status menjadi `.status-item` yang bersih.
    - Menghapus tabel pinout hardware yang tidak relevan bagi operator dari halaman `settings.html`.
    - Mengimplementasikan **Zona Pemeliharaan & Reset** di `settings.html`:
      - **Mulai Ulang Sistem (Soft Reboot)**: Endpoint `/api/system/reboot`.
      - **Reset PIN & Parameter**: Endpoint `/api/system/reset-settings` (kembali ke PIN 1234, tanpa menghapus jadwal).
      - **Reset Data Pabrik (Factory Reset)**: Endpoint `/api/system/factory-reset` dengan konfirmasi pengetikan kata kunci `RESET`.
    - Sinkronisasi firmware C++ di `firmware.ino` dan `main.cpp` serta kontrak REST API di `SPEC.md`.
  - Pembuatan launcher desktop native dan installer Windows (.exe):
    - Dibuat icon resmi resolusi tinggi [launcher/app.ico](file:///d:/BelSekolah/launcher/app.ico).
    - Dibuat launcher native Windows C# [BelSekolah.exe](file:///d:/BelSekolah/BelSekolah.exe) tanpa jendela CMD hitam console, dengan pendeteksi otomatis browser Chromium (--app mode).
    - Dibuat skrip compiler Inno Setup [launcher/installer.iss](file:///d:/BelSekolah/launcher/installer.iss).
    - Dikompilasi paket installer resmi [dist/Setup_BelSekolah_v1.2.0.exe](file:///d:/BelSekolah/dist/Setup_BelSekolah_v1.2.0.exe) dengan wizard instalasi, pembuatan shortcut Desktop & Start Menu, serta registrasi uninstaller sistem.
- **2026-10-27**:
  - Dokumentasi integrasi perangkat nyata (Real Hardware):
    - [PANDUAN_TRANSISI.md](file:///d:/BelSekolah/PANDUAN_TRANSISI.md): Menambahkan panduan wiring komprehensif untuk **Modul Relay 5V 2-Channel** yang dimiliki pengguna (VCC ke VU/VIN, GND, IN1 ke D7, IN2 ke D0).
    - Menambahkan panduan sambungan ke **Mixer Amplifier TOA ZA-2120** (Input RCA AUX 1/2, isolasi audio anti-dengung via Relay Channel 1, otomasi daya 220V via Relay Channel 2, dan terminal speaker trafo matching 100V vs 4Ω).
    - Sinkronisasi diagram simulasi [firmware/wokwi_diagram.json](file:///d:/BelSekolah/firmware/wokwi_diagram.json): Menambahkan seluruh visual komponen lengkap di Wokwi: Board ESP, Modul RTC DS3231, Modul DFPlayer Mini MP3, Resistor 1kΩ, dan Modul Dual Relay (Mute & Power).
  - Pembuatan paket simulasi online mandiri untuk **Mokxi** (https://app.mokxi.com/):
    - Dibuat folder [firmware/mokxi/](file:///d:/BelSekolah/firmware/mokxi/) berisi [README.md](file:///d:/BelSekolah/firmware/mokxi/README.md), [mokxi_diagram_esp32.json](file:///d:/BelSekolah/firmware/mokxi/mokxi_diagram_esp32.json), [mokxi_diagram_esp8266.json](file:///d:/BelSekolah/firmware/mokxi/mokxi_diagram_esp8266.json), [libraries.txt](file:///d:/BelSekolah/firmware/mokxi/libraries.txt), dan sketch interaktif [sketch_simulation.ino](file:///d:/BelSekolah/firmware/mokxi/sketch_simulation.ino) yang siap diimpor atau disalin langsung ke browser Mokxi.
  - Penyesuaian dokumen belanja [DAFTAR_BELANJA.md](file:///d:/BelSekolah/DAFTAR_BELANJA.md):
    - Memperbarui status kepemilikan pengguna: ESP8266, Relay 2-Channel, dan MicroSD sudah dimiliki.
    - Menghitung ulang estimasi belanja riil yang perlu dibeli menjadi hanya DFPlayer Mini, RTC DS3231, dan Resistor 1kΩ (total sekitar Rp 43.000). Menambahkan rincian modul display LCD 1602 I2C opsional.
- **2026-11-05**:
  - Penghapusan seluruh dialog bawaan peramban (*native browser alert, confirm, prompt* "This page says") pada antarmuka web:
    - Diimplementasikan modul dialog kustom `AppDialog` (`alert`, `confirm`, `prompt`) berbasis Promise dengan backdrop blur, icon semantik, dan token desain resmi di [firmware/data/app.js](file:///d:/BelSekolah/firmware/data/app.js) & [firmware/data/style.css](file:///d:/BelSekolah/firmware/data/style.css).
    - Ditambahkan sistem notifikasi melayang non-intrusif `AppToast` untuk konfirmasi sukses/info/peringatan.
    - Dimutakhirkan alur konfirmasi pada [settings.html](file:///d:/BelSekolah/firmware/data/settings.html), [schedule.html](file:///d:/BelSekolah/firmware/data/schedule.html), [index.html](file:///d:/BelSekolah/firmware/data/index.html), dan [audio.html](file:///d:/BelSekolah/firmware/data/audio.html).

