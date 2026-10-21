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
- **Framework**: Arduino Core for ESP32 (via PlatformIO / Arduino IDE)
- **Target Chip**: ESP32-WROOM-32 / NodeMCU-32S (Dual-Core 240MHz, 4MB Flash)
- **Partisi Flash**: `default_16MB.csv` atau minimal `minimal_spiffs.csv` (Partisi Data LittleFS minimal 1.5MB untuk web assets & database JSON)

### Dependensi Library Utama:
1. `ESPAsyncWebServer` & `AsyncTCP`: Web server non-blocking asynchronous agar eksekusi web tidak mengganggu ketepatan detik scheduler.
2. `ArduinoJson` (v6/v7): Parsing dan serialisasi konfigurasi `schedule.json` dengan static/filter memory guard.
3. `RTClib` (by Adafruit): Driver komunikasi I2C untuk RTC DS3231.
4. `DFRobotDFPlayerMini`: Driver UART kontrol track audio pada DFPlayer Mini.
5. `LittleFS`: Driver file system flash internal ESP32.

---

## 2. Pemetaan Pinout Hardware (Pin Assignment)

| Kaki ESP32 | Komponen | Tipe Pin | Keterangan & Catatan Perakitan |
|---|---|---|---|
| **VIN (5V)** | VCC DFPlayer & RTC | Power Input | Gunakan adaptor 5V 2A-3A berkualitas baik |
| **GND** | Ground Seluruh Komponen | Power | Wajib Common Ground (satu jalur ground bersama) |
| **GPIO 17 (TX2)** | RX DFPlayer Mini | UART TX | Pasang **resistor 1kΩ seri** untuk meredam noise tegangan |
| **GPIO 16 (RX2)** | TX DFPlayer Mini | UART RX | Jalur baca status modul pemutar audio |
| **GPIO 21** | SDA RTC DS3231 | I2C Data | Jalur komunikasi data waktu presisi |
| **GPIO 22** | SCL RTC DS3231 | I2C Clock | Jalur clock bus waktu |
| **GPIO 4** | Signal Modul Relay | Output Digital | Kontrol daya/input amplifier (*Active High/Low*) |
| **GPIO 2** | Built-in LED / Buzzer | Output Digital | Indikator visual/buzzer saat simulasi bel |
| **DAC_R / DAC_L** | Jack Audio 3.5mm / RCA | Audio Line-Out | Dihubungkan ke input mixer/amplifier sekolah |

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
