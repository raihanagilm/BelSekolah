# Bel Sekolah Otomatis Mandiri (ESP32 Standalone Web App)

Sistem bel sekolah otomatis berbasis mikrokontroler **ESP32** mandiri dengan antarmuka web konfigurasi jadwal lokal. Sistem beroperasi secara penuh tanpa memerlukan komputer server terpusat.

---

## 1. Hubungan & Rantai Dokumen Proyek (Document Chain of Trust)

Setiap agen AI dan pengembang wajib memahami pembagian tanggung jawab dokumen markdown di repositori ini:

```
                  ┌───────────────────────────────┐
                  │           README.md           │
                  │   (Panduan Pengguna & Setup)  │
                  └───────────────┬───────────────┘
                                  │ mereferensikan
                                  ▼
                  ┌───────────────────────────────┐
                  │           AGENTS.md           │
                  │   (Ruler & Standar Koding AI) │
                  └───────────────┬───────────────┘
                                  │ mengimplementasikan
                                  ▼
                  ┌───────────────────────────────┐
                  │            SPEC.md            │
                  │   (Spesifikasi Teknis & API)  │
                  └───────────────────────────────┘
```

1. **[README.md](file:///d:/BelSekolah/README.md)** *(File ini)*:
   - **Peran**: Panduan orientasi umum, cara perakitan perangkat keras, cara flash firmware, dan petunjuk penggunaan antarmuka web bagi pengguna/operator sekolah.
2. **[AGENTS.md](file:///d:/BelSekolah/AGENTS.md)**:
   - **Peran**: Kontrak kerja dan ruler otomatis AI agent (Anti-Slop, Vibe Coding, aturan pembaruan dokumen bersamaan, checklist validasi, dan riwayat changelog).
3. **[SPEC.md](file:///d:/BelSekolah/SPEC.md)**:
   - **Peran**: Cetak biru teknis (Spesifikasi arsitektur data `schedule.json`, kontrak REST API, alur clock resilience, dan timing audio relay pre-roll).

---

## 2. Fitur Utama Sistem

- **100% Mandiri (Standalone Edge IoT)**: Web server dan penjadwal berjalan langsung di dalam chip ESP32. Tidak membutuhkan PC server yang harus menyala 24 jam.
- **Pengaturan Mudah via Browser**: Cukup buka `http://bel-sekolah.local` atau alamat IP ESP32 dari laptop, PC ruang piket, atau smartphone guru yang terhubung ke Wi-Fi sekolah.
- **Jadwal Multi-Preset**: Pilihan cepat antara mode *Reguler (Senin - Kamis)*, *Jumat Pendek*, dan *Mode Ujian (PTS/PAS)*.
- **Ketahanan Jam Presisi (Dual Clock Sync)**:
  - Didukung modul RTC DS3231 + baterai cadangan (akurasi tetap terjaga saat listrik padam).
  - Sinkronisasi otomatis ke internet (NTP) jika tersedia koneksi Wi-Fi.
  - Sinkronisasi instan satu klik dengan jam browser jika berada di jaringan intranet offline.
- **Peredam Dengung Otomatis (Relay Auto-Mute)**: Mengaktifkan jalur input amplifier 2 detik sebelum bel berbunyi dan mematikannya kembali setelah nada selesai untuk menghilangkan dengung konstan (*ground hum*).
- **Proteksi PIN Admin & Keamanan**: Panel pengaturan dan eksekusi manual dilindungi PIN admin guna mencegah perubahan jadwal oleh pihak yang tidak berwenang.
- **Kustomisasi Pustaka Audio Fleksibel**: Pemetaan nomor track DFPlayer dan penamaan judul nada bel dapat dikonfigurasi langsung melalui browser tanpa memodifikasi kode program.

---

## 3. Spesifikasi Perangkat Keras (BOM)

| Komponen | Spesifikasi / Model Rekomendasi | Jumlah | Fungsi |
|---|---|---|---|
| Mikrokontroler | ESP32-WROOM-32 / NodeMCU-32S | 1 unit | Otak pemroses web server, scheduler, dan pengontrol periferal |
| Modul Audio | DFPlayer Mini MP3 Player | 1 unit | Pemutar file MP3 dari MicroSD Card via serial UART |
| Real-Time Clock | Modul RTC DS3231 I2C + Baterai CR2032 | 1 unit | Sumber waktu akurat offline (akurasi tinggi dengan TCXO) |
| Modul Saklar | Relay Modul 5V 1-Channel (Active Low/High) | 1 unit | Memutus/menyambung sinyal audio ke amplifier sekolah |
| Media Simpan | MicroSD Card 2GB - 16GB (Format FAT32) | 1 unit | Tempat penyimpanan file suara nada bel |
| Resistor | Resistor 1kΩ 1/4W | 1 buah | Dipasang seri pada pin RX DFPlayer untuk meredam noise serial |
| Catu Daya | Adaptor 5V 2A - 3A DC | 1 unit | Catu daya stabil untuk ESP32 dan modul audio |

---

## 4. Panduan Struktur Folder Repositori

```
d:/BelSekolah/
├── README.md                  # [User Guide] Panduan umum dan petunjuk pengguna
├── AGENTS.md                  # [AI Ruler] Kontrak perilaku coding AI & anti-slop rules
├── SPEC.md                    # [Architecture Spec] Spesifikasi teknis, alur data & REST API
├── DAFTAR_BELANJA.md          # [Bill of Materials] Panduan belanja komponen & estimasi harga
├── docs/                      # Dokumentasi per domain pengerjaan
│   ├── ARDUINO.md             # Panduan lengkap firmware & skema rangkaian
│   └── WEB.md                 # Panduan arsitektur frontend LittleFS
├── simulation/                # Konfigurasi simulasi Wokwi
│   ├── diagram.json           # Sirkuit virtual simulasi ESP32 + RTC + Relay
│   └── wokwi.toml             # Konfigurasi simulator Wokwi
└── firmware/                  # Firmware dan data LittleFS ESP32
    ├── platformio.ini         # Konfigurasi dependensi PlatformIO
    ├── src/
    │   └── main.cpp           # Firmware C++ ESP32 (Web Server, Scheduler, DFPlayer UART)
    └── data/                  # File Web & Database yang diunggah ke flash LittleFS
        ├── schedule.json      # Database konfigurasi jadwal & track audio
        ├── index.html         # Dashboard utama (status jam & trigger manual)
        ├── schedule.html      # Halaman manajemen jadwal & switch preset
        ├── audio.html         # Pustaka audio DFPlayer & uji dengar
        ├── settings.html      # Sinkronisasi jam browser & setting hardware
        ├── style.css          # Desain UI clean, responsive & anti-slop
        └── app.js             # Client-side API fetch logic
```

---

## 5. Menjalankan & Menguji Proyek

### A. Membuka Aplikasi Desktop Langsung di PC (Semi-Offline)
Cukup klik ganda (double-click) file **[Aplikasi_Bel_Sekolah.bat](file:///d:/BelSekolah/Aplikasi_Bel_Sekolah.bat)**:
- Script otomatis mendeteksi koneksi: jika PC terhubung ke Wi-Fi ESP32 (`192.168.4.1`), aplikasi akan terhubung secara online.
- Jika sedang tidak terhubung ke ESP32, aplikasi otomatis berjalan dalam **Mode Semi-Offline Mandiri** dengan antarmuka native tanpa address bar browser, memungkinkan operator piket mengatur jadwal dan menguji simulasi secara lokal.

### B. Menguji Antarmuka Web Secara Lokal
Buka file `firmware/data/index.html` langsung di browser Anda untuk melihat tampilan dashboard responsif. Halaman dilengkapi fallback mock otomatis sehingga semua menu dan tombol dapat diuji sebelum ESP32 terpasang.

### B. Menjalankan di Simulator Virtual Wokwi
1. Buka [Wokwi ESP32 Simulator](https://wokwi.com/projects/new/esp32).
2. Salin diagram rangkaian dari `simulation/diagram.json`.
3. Buka serial monitor untuk memantau waktu scheduler dan status trigger bel virtual.