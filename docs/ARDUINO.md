# PANDUAN PENGEMBANGAN FIRMWARE & HARDWARE (ARDUINO.md)
## Bel Sekolah Otomatis Mandiri ESP32

> **KONTRAK KETERIKATAN DOKUMEN (DOCUMENT BINDING CONTRACT)**:
> File ini adalah spesifikasi resmi domain **Firmware & Hardware ESP32**.
> - Induk Kontrak AI: [AGENTS.md](file:///d:/BelSekolah/AGENTS.md) (Wajib dibaca sebelum coding C++).
> - Kontrak Data & API: [SPEC.md](file:///d:/BelSekolah/SPEC.md) (Rujukan schema JSON dan alur timing UART/Relay).
> - Domain Frontend: [docs/WEB.md](file:///d:/BelSekolah/docs/WEB.md) (Antarmuka web LittleFS).
> - Panduan Pengguna: [README.md](file:///d:/BelSekolah/README.md).
>
> **ATURAN UPDATE BERSAMAAN**: Jika terjadi perubahan nomor pin GPIO, timing jeda relay, atau fungsi firmware di file ini, agen AI wajib memperbarui [SPEC.md](file:///d:/BelSekolah/SPEC.md), [README.md](file:///d:/BelSekolah/README.md), dan mencatatnya di changelog [AGENTS.md](file:///d:/BelSekolah/AGENTS.md).

---

## 1. Lingkungan Pengembangan & Framework
- **Framework**: Arduino Core for ESP8266 & ESP32 (via PlatformIO / Arduino IDE)
- **Target Chip**:
  - **ESP8266**: NodeMCU V3 Lolin Type-C (ESP-12E/F, 4MB Flash - Partisi 2MB Flash / 2MB LittleFS `eagle.flash.4m2m.ld`)
  - **ESP32**: ESP32-WROOM-32 / NodeMCU-32S (Dual-Core 240MHz, 4MB Flash)
- **Partisi LittleFS**: Minimal 1MB untuk menampung UI web (HTML/CSS/JS) & database JSON.

### Dependensi Library Utama:
1. `ESPAsyncWebServer` & `ESPAsyncTCP` (atau `AsyncTCP` di ESP32): Web server non-blocking asynchronous.
2. `ArduinoJson` (v7): Parsing dan serialisasi konfigurasi `schedule.json`.
3. `RTClib` (by Adafruit): Driver komunikasi I2C untuk RTC DS3231.
4. `DFRobotDFPlayerMini`: Driver kontrol track audio pada DFPlayer Mini.
5. `SoftwareSerial` (ESP8266) / `HardwareSerial UART2` (ESP32): Komunikasi serial modul MP3.
6. `LittleFS`: Driver file system flash internal mikrokontroler.

---

## 2. Pemetaan Pinout Hardware

### A. Tabel Pinout ESP8266 V3 CH340 (Lolin Type-C)
| Label Pin NodeMCU | GPIO Chip | Komponen / Pin Target | Keterangan & Catatan Perakitan |
|---|---|---|---|
| **VIN (5V / VUSB)** | - | VCC Relay, DFPlayer, RTC | Catu daya adaptor 5V 2A-3A via Type-C / VIN |
| **GND** | GND | Ground Seluruh Komponen | Wajib Common Ground (satu ground bersama) |
| **D1** | GPIO 5 | SCL RTC DS3231 | I2C Clock Bus waktu offline |
| **D2** | GPIO 4 | SDA RTC DS3231 | I2C Data Bus waktu offline |
| **D5** | GPIO 14 | TX DFPlayer Mini | Jalur SoftwareSerial RX ESP8266 |
| **D6** | GPIO 12 | RX DFPlayer Mini | Jalur SoftwareSerial TX ESP8266 (**Wajib pasang R 1kΩ seri**) |
| **D7** | GPIO 13 | IN 1 Modul Relay | **Relay Channel 1: Mute Audio Line** (Memutus jalur speaker saat diam) |
| **D0** | GPIO 16 | IN 2 Modul Relay | **Relay Channel 2: Saklar Daya Amplifier** (Otomatis ON saat bel, OFF saat selesai) |
| **D4** | GPIO 2 | Built-in Blue LED | Indikator visual aktivitas (Active-LOW di ESP8266) |
| **SPK_1/2 / DAC_R/L** | - | Jack Audio / Speaker | Output audio ke pengeras suara / amplifier |

### B. Tabel Pinout ESP32 (Alternatif Target)
| Kaki ESP32 | Komponen | Tipe Pin | Keterangan & Catatan Perakitan |
|---|---|---|---|
| **VIN (5V)** | VCC DFPlayer & RTC | Power Input | Adaptor 5V 2A-3A berkualitas baik |
| **GND** | Ground Seluruh Komponen | Power | Wajib Common Ground |
| **GPIO 17 (TX2)** | RX DFPlayer Mini | UART TX | Pasang **resistor 1kΩ seri** |
| **GPIO 16 (RX2)** | TX DFPlayer Mini | UART RX | Jalur baca status modul MP3 |
| **GPIO 21** | SDA RTC DS3231 | I2C Data | Jalur data I2C |
| **GPIO 22** | SCL RTC DS3231 | I2C Clock | Jalur clock I2C |
| **GPIO 4** | IN 1 Relay | Output Digital | Relay Channel 1: Mute Audio |
| **GPIO 5** | IN 2 Relay | Output Digital | Relay Channel 2: Power Amplifier |
| **GPIO 2** | Built-in LED | Output Digital | Indikator visual |

---

## 3. Logika & Alur Eksekusi Firmware (`main.cpp`)

### A. Inisialisasi Sistem (`setup()`)
1. Mulai Serial Debug (115200 baud).
2. Inisialisasi LittleFS; baca `schedule.json` ke memory struct.
3. Inisialisasi RTC DS3231; periksa apakah baterai cadangan masih aktif.
4. Inisialisasi Hardware Serial 2 (`Serial2.begin(9600, SERIAL_8N1, 16, 17)`) untuk DFPlayer Mini.
5. Konfigurasi GPIO 4 (Relay) sebagai `OUTPUT` dengan status awal `LOW` (Mute).
6. Nyalakan Wi-Fi (Mode AP `Bel-Sekolah-AP` atau Station konek ke router sekolah).
7. Daftarkan rute REST API dan static file handler pada `ESPAsyncWebServer`.

### B. Scheduler Loop Utama (`loop()`)
Pemeriksaan waktu wajib bersifat non-blocking:
```cpp
unsigned long lastTick = 0;
void loop() {
  if (millis() - lastTick >= 1000) {
    lastTick = millis();
    checkSchedule(); // Cek jam & menit saat ini terhadap preset aktif
  }
}
```

### C. Prosedur Trigger Bel (Pre-Roll & Anti-Hum)
1. **Langkah 1**: Aktifkan Relay (`digitalWrite(PIN_RELAY, HIGH)`).
2. **Langkah 2**: Tunggu jeda pre-roll (default: 2000 ms) agar amplifier stabil dan terhindar dari *pop noise*.
3. **Langkah 3**: Perintahkan DFPlayer memainkan track audio (`myDFPlayer.play(trackNumber)`).
4. **Langkah 4**: Monitor status pemutaran sampai audio selesai.
5. **Langkah 5**: Beri jeda post-roll (1000 ms), lalu matikan Relay (`digitalWrite(PIN_RELAY, LOW)`).

### D. Penanganan Keamanan & Modifikasi Track
1. **Verifikasi PIN Admin**: Validasi request mutasi (`/api/schedule/save`, `/api/tracks/save`, `/api/auth/change-pin`) dengan memeriksa kecocokan `admin_pin` yang tersimpan di `schedule.json`.
2. **Serialisasi Track Audio**: Endpoint `/api/tracks/save` memperbarui array `audio_tracks` pada `schedule.json` di LittleFS secara aman tanpa merusak struktur jadwal utama.

---

## 4. Checklist Verifikasi Firmware Sebelum Flashing
- [ ] LittleFS terformat dan file web (`index.html`, `style.css`, dll.) terunggah ke flash.
- [ ] Resistor 1kΩ terpasang pada jalur UART RX DFPlayer Mini.
- [ ] Waktu RTC DS3231 berjalan akurat detik demi detik di Serial Monitor.
- [ ] Relay mengunci ON sebelum nada bel diputar dan kembali OFF setelah audio tuntas.
