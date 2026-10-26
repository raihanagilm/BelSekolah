# SPESIFIKASI TEKNIS & ARSITEKTUR SISTEM (SPEC.md)
## Bel Sekolah Otomatis Mandiri Berbasis ESP32

- **Nama Proyek:** BelSekolah
- **Tipe Sistem:** Standalone Embedded Web Application (IoT Edge Device)
- **Target Hardware:** ESP8266 (NodeMCU V3 Lolin Type-C) & ESP32 (NodeMCU-32S / ESP32-WROOM-32)
> **KONTRAK KETERIKATAN DOKUMEN (DOCUMENT BINDING CONTRACT)**:
> File ini adalah spesifikasi arsitektur data, pinout, dan kontrak REST API sistem.
> - Induk Kontrak AI: [AGENTS.md](file:///d:/BelSekolah/AGENTS.md)
> - Panduan Frontend: [docs/WEB.md](file:///d:/BelSekolah/docs/WEB.md)
> - Panduan Firmware: [docs/ARDUINO.md](file:///d:/BelSekolah/docs/ARDUINO.md)
> - Panduan Pengguna: [README.md](file:///d:/BelSekolah/README.md)
>
> **ATURAN UPDATE BERSAMAAN**: Dokumen ini adalah jembatan data antara Frontend dan Firmware. Segala perubahan skema `schedule.json` atau penambahan endpoint REST API wajib disinkronkan ke [docs/WEB.md](file:///d:/BelSekolah/docs/WEB.md) dan [docs/ARDUINO.md](file:///d:/BelSekolah/docs/ARDUINO.md).

---

## 1. Arsitektur Komunikasi & Hierarki Hardware

ESP8266 / ESP32 beroperasi mandiri tanpa server PC perantara. Seluruh konfigurasi dan jadwal dikelola langsung oleh mikrokontroler melalui antarmuka web browser.

```
                    JARINGAN WI-FI LOKAL SEKOLAH
                                 │
     ┌───────────────────────────┼───────────────────────────┐
     ▼                           ▼                           ▼
[ Laptop Operator ]       [ Smartphone Guru ]         [ PC Tata Usaha ]
(http://bel-sekolah.local atau http://192.168.4.1 atau IP Jaringan Sekolah)
                                 │
                                 │ HTTP GET/POST (REST API & Web Assets)
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   MIKROKONTROLER (ESP8266 / ESP32)                     │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │               ESPAsyncWebServer & AsyncTCP Engine              │   │
│   │  - Melayani file web statis dari flash LittleFS (HTML/CSS/JS)   │   │
│   │  - Menyediakan endpoint REST API (/api/status, /api/trigger,..)│   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │                                    │
│   ┌───────────────────────────────┴────────────────────────────────┐   │
│   │                     LITTLEFS FLASH STORAGE                     │   │
│   │  - /schedule.json : Database preset, jadwal, dan konfigurasi   │   │
│   │  - /index.html, /schedule.html, /audio.html, /settings.html    │   │
│   │  - /style.css, /app.js                                         │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │                                    │
│   ┌───────────────────────────────┴────────────────────────────────┐   │
│   │                    CORE SCHEDULER & DISPATCHER                 │   │
│   │  - Polling waktu tiap detik non-blocking                       │   │
│   │  - Pencocokan hari & jam aktif terhadap preset terpilih        │   │
│   │  - Flag anti-double trigger dalam rentang menit yang sama      │   │
│   └───────────────┬────────────────────────────────┬───────────────┘   │
└───────────────────┼────────────────────────────────┼───────────────────┘
                    │                                │
        I2C Bus (RTC DS3231)              Serial UART (DFPlayer Mini)
        ESP8266: D2(SDA), D1(SCL)         ESP8266: D5(RX), D6(TX)
        ESP32  : 21(SDA), 22(SCL)         ESP32  : 16(RX), 17(TX)
                    ▼                                ▼
       ┌────────────────────────┐       ┌────────────────────────┐
       │   RTC Modul DS3231     │       │  DFPlayer Mini MP3     │
       │ (Waktu Akurat Offline) │       │ (MicroSD: /mp3/000x)   │
       └────────────────────────┘       └───────────┬────────────┘
                                                    │ Output Audio
                                                    ▼
                                        ┌────────────────────────┐
                                        │ Modul Relay 5V 2-CH    │
                                        │ CH1: Mute Audio Line   │
                                        │ CH2: Power Listrik Amp │
                                        └───────────┬────────────┘
                                                    │
                                                    ▼
                                        ┌────────────────────────┐
                                        │ Amplifier & Speaker    │
                                        │ Sentral Ruang Piket    │
                                        └────────────────────────┘
```

---

## 2. Diagram Pinout & Pengkabelan

### A. Pinout ESP8266 NodeMCU V3 Lolin Type-C
| Pin NodeMCU | Pin GPIO | Komponen Target | Fungsi / Keterangan |
|---|---|---|---|
| **VIN (5V)** | - | VCC Relay, DFPlayer, RTC | Sumber daya 5V dari kabel Type-C / adaptor |
| **GND** | GND | Common Ground | Ground bersama untuk seluruh modul |
| **D1** | GPIO 5 | SCL RTC DS3231 | I2C Clock Bus waktu real-time |
| **D2** | GPIO 4 | SDA RTC DS3231 | I2C Data Bus waktu real-time |
| **D5** | GPIO 14 | TX DFPlayer Mini | Jalur SoftwareSerial RX mikrokontroler |
| **D6** | GPIO 12 | RX DFPlayer Mini | Jalur SoftwareSerial TX (**wajib resistor 1kΩ seri**) |
| **D7** | GPIO 13 | IN 1 Relay | Relay Channel 1: Saklar Mute Audio Line |
| **D0** | GPIO 16 | IN 2 Relay | Relay Channel 2: Saklar Daya Listrik Amplifier |
| **D4** | GPIO 2 | Built-in LED Biru | Indikator visual aktivitas (Active-LOW) |

### B. Pinout Alternatif ESP32 DevKit
| Kaki ESP32 | Komponen / Pin Target | Keterangan & Standar Pengkabelan |
|---|---|---|
| **VIN (5V)** | VCC DFPlayer & RTC | Catu daya adaptor 5V 2A-3A stabil |
| **GND** | GND Semua Komponen | Wajib satu jalur ground bersama (Common Ground) |
| **GPIO 17 (TX2)** | RX DFPlayer Mini | Diberi resistor 1kΩ seri (peredam noise) |
| **GPIO 16 (RX2)** | TX DFPlayer Mini | Jalur data status modul pemutar audio |
| **GPIO 21 (SDA)** | SDA RTC DS3231 | I2C Data bus untuk RTC |
| **GPIO 22 (SCL)** | SCL RTC DS3231 | I2C Clock bus untuk RTC |
| **GPIO 4** | IN 1 Relay | Relay Channel 1: Mute Audio (*Pre-Roll*) |
| **GPIO 5** | IN 2 Relay | Relay Channel 2: Saklar Power Amplifier |
| **GPIO 2** | Built-in LED | Indikator visual sistem |

---

## 3. Alur Kerja Logika & Timing (System Logic & Timing Flow)

### A. Hierarki Sinkronisasi Jam (Clock Resilience Flow)
1. **Prioritas 1 (Offline)**: Modul RTC DS3231 dengan baterai CR2032 menjadi rujukan waktu utama saat ESP32 dinyalakan.
2. **Prioritas 2 (Online)**: Jika Wi-Fi terkoneksi ke internet, NTP pool (`pool.ntp.org`) memperbarui jam internal dan mengoreksi RTC DS3231 secara otomatis setiap 12 jam.
3. **Prioritas 3 (Intranet Manual)**: Pengguna dapat menekan tombol sinkronisasi jam di halaman pengaturan web untuk menyamakan waktu RTC dengan browser perangkat dalam hitungan milidetik.

### B. Timing Kontrol Relay Amplifier & DFPlayer
```
[ Detik == 00 & Jadwal Cocok ]
              │
              ▼
    1. GPIO 4 = HIGH (Relay ON)
       Menghubungkan jalur audio mixer amplifier
              │
              ▼ (Jeda Pre-Roll: 2 Detik)
    2. Kirim UART: 0x7E 0xFF 0x06 0x03 0x00 0x00 0x01 ... (Play Track)
       DFPlayer memutar nada bel
              │
              ▼ (Menunggu Audio Selesai / Pin BUSY Low -> High)
    3. Jeda Post-Roll: 1 Detik
              │
              ▼
    4. GPIO 4 = LOW (Relay OFF)
       Memutus jalur input agar amplifier sekolah tidak berdengung
```

---

## 4. Spesifikasi Kontrak REST API (API Contract)

Endpoint REST API yang disediakan oleh ESPAsyncWebServer:

| Method | Endpoint | Parameter / Body | Deskripsi |
|---|---|---|---|
| `GET` | `/schedule.json` | - | Mengambil seluruh basis data jadwal dan konfigurasi dari flash LittleFS |
| `POST` | `/api/schedule/save` | JSON lengkap struktur data | Menyimpan perubahan preset atau jadwal baru ke flash LittleFS |
| `POST` | `/api/trigger` | `?track={1..999}` | Membunyikan nada bel seketika (manual trigger atau pengujian) |
| `POST` | `/api/time/sync` | `?epoch={timestamp_detik}` | Mengupdate waktu RTC DS3231 menggunakan timestamp browser |
| `GET` | `/api/status` | - | Mengambil telemetri mikrokontroler (uptime, status RTC, sinyal Wi-Fi, preset aktif, auth status) |
| `POST` | `/api/auth/login` | `{"pin": "1234"}` | Validasi PIN admin untuk sesi modifikasi jadwal dan pengaturan |
| `POST` | `/api/auth/change-pin` | `{"old_pin": "1234", "new_pin": "5678"}` | Mengganti PIN admin keamanan sistem |
| `POST` | `/api/tracks/save` | `[{"track": 1, "name": "0001.mp3", "title": "..."}]` | Memperbarui daftar dan label judul nada bel audio |

---

## 5. Skema Data `schedule.json`

Format data non-volatil yang disimpan pada partisi LittleFS:

```json
{
  "active_preset": "reguler",
  "presets": {
    "reguler": {
      "name": "Jadwal Reguler (Senin - Kamis)",
      "schedules": [
        { "id": 1, "days": [1, 2, 3, 4], "time": "07:00", "track": 1, "label": "Bel Masuk Kelas" },
        { "id": 2, "days": [1, 2, 3, 4], "time": "09:40", "track": 2, "label": "Istirahat Pertama" },
        { "id": 3, "days": [1, 2, 3, 4], "time": "10:00", "track": 3, "label": "Masuk Setelah Istirahat" },
        { "id": 4, "days": [1, 2, 3, 4], "time": "11:45", "track": 5, "label": "Istirahat Ishoma" },
        { "id": 5, "days": [1, 2, 3, 4], "time": "12:30", "track": 3, "label": "Masuk Siang" },
        { "id": 6, "days": [1, 2, 3, 4], "time": "15:00", "track": 6, "label": "Bel Pulang Sekolah" }
      ]
    },
    "jumat": {
      "name": "Jadwal Khusus Hari Jumat",
      "schedules": [
        { "id": 1, "days": [5], "time": "07:00", "track": 1, "label": "Bel Masuk Kelas" },
        { "id": 2, "days": [5], "time": "11:15", "track": 6, "label": "Bel Pulang Jumat" }
      ]
    },
    "ujian": {
      "name": "Jadwal Penilaian / Ujian (PTS/PAS)",
      "schedules": []
    }
  },
  "audio_tracks": [
    { "track": 1, "name": "0001.mp3", "title": "Siswa Datang / Bel Masuk" },
    { "track": 2, "name": "0002.mp3", "title": "Jam Pelajaran 01" },
    { "track": 3, "name": "0003.mp3", "title": "Jam Pelajaran 02" },
    { "track": 4, "name": "0004.mp3", "title": "Jam Pelajaran 03" },
    { "track": 5, "name": "0005.mp3", "title": "Jam Pelajaran 04" },
    { "track": 6, "name": "0006.mp3", "title": "Istirahat Pertama" },
    { "track": 7, "name": "0007.mp3", "title": "Jam Pelajaran 05" },
    { "track": 8, "name": "0008.mp3", "title": "Jam Pelajaran 06" },
    { "track": 9, "name": "0009.mp3", "title": "Jam Pelajaran 07" },
    { "track": 10, "name": "0010.mp3", "title": "Jam Pelajaran 08" },
    { "track": 11, "name": "0011.mp3", "title": "Istirahat Kedua / Dzuhur" },
    { "track": 12, "name": "0012.mp3", "title": "Jam Pelajaran 09" },
    { "track": 13, "name": "0013.mp3", "title": "Jam Pelajaran 10" },
    { "track": 14, "name": "0014.mp3", "title": "Jam Pelajaran 11" },
    { "track": 15, "name": "0015.mp3", "title": "Jam Pelajaran 12" },
    { "track": 16, "name": "0016.mp3", "title": "Siswa Pulang / Akhir Pelajaran" },
    { "track": 17, "name": "0017.mp3", "title": "Ujian: Masuk Ruang Ujian" },
    { "track": 18, "name": "0018.mp3", "title": "Ujian: Mulai Dalam 10 Menit" },
    { "track": 19, "name": "0019.mp3", "title": "Ujian: Mulai Ujian" },
    { "track": 20, "name": "0020.mp3", "title": "Ujian: Selesai Dalam 10 Menit" },
    { "track": 21, "name": "0021.mp3", "title": "Ujian: Selesai Ujian" }
  ],
  "settings": {
    "admin_pin": "1234",
    "ntp_server": "pool.ntp.org",
    "timezone_offset_sec": 25200,
    "relay_pre_roll_sec": 2,
    "speaker_volume": 25
  }
}
```

---

## 6. Struktur File Audio MicroSD DFPlayer Mini
DFPlayer Mini membaca file audio dari folder khusus bernama `mp3` pada partisi kartu memori FAT32 dengan format nama 4 digit angka:
- `SD-CARD-ROOT/mp3/0001.mp3` : Bel Masuk Kelas
- `SD-CARD-ROOT/mp3/0002.mp3` : Bel Istirahat Pertama
- `SD-CARD-ROOT/mp3/0003.mp3` : Bel Masuk Setelah Istirahat
- `SD-CARD-ROOT/mp3/0004.mp3` : Bel Pergantian Jam Pelajaran
- `SD-CARD-ROOT/mp3/0005.mp3` : Bel Istirahat Ishoma
- `SD-CARD-ROOT/mp3/0006.mp3` : Bel Pulang Sekolah
- `SD-CARD-ROOT/mp3/0007.mp3` : Lagu Kebangsaan / Upacara
- `SD-CARD-ROOT/mp3/0008.mp3` : Nada Panggilan Darurat / Pengumuman
