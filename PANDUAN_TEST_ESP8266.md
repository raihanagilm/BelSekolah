# PANDUAN PENGUJIAN AWAL ESP8266 (STANDALONE TEST)
## Proyek Bel Sekolah Otomatis Mandiri

Panduan langkah demi langkah untuk menguji modul **NodeMCU ESP8266 V3 Lolin Type-C** yang Anda miliki saat ini, langsung dari laptop/PC tanpa perlu menunggu modul DFPlayer Mini atau RTC DS3231 datang.

---

### Tahap 1: Persiapan Driver & Koneksi Fisik

1. **Sambungkan Modul**:
   - Hubungkan ESP8266 ke port USB laptop menggunakan **Kabel USB Type-C Data**.
   - Pastikan kabel yang digunakan adalah kabel data (bisa transfer file), bukan sekadar kabel charger HP.
2. **Periksa COM Port**:
   - Buka menu Windows: tekan tombol `Windows + X` $\rightarrow$ pilih **Device Manager**.
   - Buka bagian **Ports (COM & LPT)**.
   - Pastikan terdeteksi perangkat: **`USB-SERIAL CH340 (COM...)`** (misal COM3, COM4, atau COM5).
   - *Jika belum terdeteksi*: Unduh dan pasang [Driver CH340 Resmi Windows](https://www.wch.cn/downloads/CH341SER_EXE.html), lalu pasang ulang kabel USB.

---

### Tahap 2: Pengaturan Lingkungan Arduino IDE

1. **Tambahkan URL Board ESP8266**:
   - Buka Arduino IDE.
   - Masuk ke menu **File** $\rightarrow$ **Preferences**.
   - Pada kolom *Additional boards manager URLs*, tempel URL berikut:
     ```text
     http://arduino.esp8266.com/stable/package_esp8266com_index.json
     ```
   - Klik **OK**.
2. **Pasang Board ESP8266**:
   - Buka menu **Tools** $\rightarrow$ **Board** $\rightarrow$ **Boards Manager...**.
   - Ketik `esp8266` di kolom pencarian.
   - Pilih **esp8266 by ESP8266 Community**, lalu klik **Install**.
3. **Instal Library yang Dibutuhkan**:
   - Buka menu **Tools** $\rightarrow$ **Manage Libraries...**.
   - Cari dan instal library berikut satu per satu:
     1. **`ArduinoJson`** (Pilih versi 7 terbaru by Benoit Blanchon).
     2. **`RTClib`** (by Adafruit).
     3. **`DFRobotDFPlayerMini`** (by DFRobot).
     4. **`ESPAsyncWebServer`** (by me-no-dev / ESP32Async / ESPHome).
     5. **`ESPAsyncTCP`** (by me-no-dev / ESPHome).
4. **Pilih Konfigurasi Board**:
   - Masuk ke menu **Tools** dan sesuaikan opsi berikut:
     - **Board**: `NodeMCU 1.0 (ESP-12E Module)`
     - **Upload Speed**: `115200` atau `921600`
     - **CPU Frequency**: `80 MHz` (atau `160 MHz` untuk performa lebih responsif)
     - **Flash Size**: `4MB (FS:2MB OTA:~1019KB)` *(Penting agar ruang LittleFS cukup untuk web)*
     - **Port**: Pilih port COM CH340 Anda (misal `COM4`).

---

### Tahap 3: Upload Firmware ke ESP8266

1. Buka file proyek: [firmware/firmware.ino](file:///d:/BelSekolah/firmware/firmware.ino).
2. Klik tombol **Upload** (ikon tanda panah kanan di pojok kiri atas Arduino IDE).
3. Tunggu hingga proses kompilasi dan upload selesai (*Writing at 100%... Done uploading*).
4. Buka **Serial Monitor** di Arduino IDE (*Tools* $\rightarrow$ *Serial Monitor*):
   - Atur baud rate di pojok kanan bawah ke **115200 baud**.
   - Anda akan melihat output log sistem:
     ```text
     === Memulai Bel Sekolah Otomatis Mandiri ESP8266 V3 ===
     [OK] LittleFS berhasil di-mount.
     [FAIL] RTC DS3231 tidak ditemukan! Cek koneksi pin SDA:4 / SCL:5
     [WARN] DFPlayer Mini tidak merespons (Periksa MicroSD / Kabel Serial).
     [OK] Wi-Fi AP Aktif: Bel-Sekolah-AP
     [INFO] Alamat IP Web Server: 192.168.4.1
     [OK] HTTP Async Web Server berjalan pada port 80.
     ```
   *(Peringatan RTC & DFPlayer adalah wajar karena modul fisik belum dipasang).*

---

### Tahap 4: Upload File Web UI ke Flash LittleFS

Agar tampilan dashboard web (`index.html`, `style.css`, `app.js`, dll.) dapat diakses dari browser:

1. Pastikan folder data berisi file web: [firmware/data/](file:///d:/BelSekolah/firmware/data/).
2. Pasang plugin **Arduino ESP8266 LittleFS Filesystem Uploader** pada Arduino IDE (atau gunakan ekstensi PlatformIO **Upload Filesystem Image** jika menggunakan VS Code).
3. Jalankan menu **Tools** $\rightarrow$ **ESP8266 LittleFS Data Upload**.
4. Tunggu hingga seluruh aset web terunggah ke chip flash ESP8266.

---

### Tahap 5: Pengujian Melalui HP / Laptop

1. Ambil Smartphone atau Laptop Anda.
2. Cari dan sambungkan ke jaringan Wi-Fi:
   - **Nama Wi-Fi (SSID)**: `Bel-Sekolah-AP`
   - **Password**: *(Kosong / Open)*
3. Buka browser (Google Chrome, Safari, atau Microsoft Edge).
4. Masukkan alamat IP:
   ```text
   http://192.168.4.1
   ```
5. **Fitur yang Langsung Bisa Anda Uji**:
   - **Dashboard**: Tampilan antarmuka modern responsif dengan status sistem.
   - **Tombol Tes Bel Manual**: Tekan tombol bunyikan bel di web $\rightarrow$ perhatikan **LED biru di modul ESP8266 akan menyala/berkedip** (menandakan sinyal trigger bel berhasil dieksekusi).
   - **Kelola Jadwal**: Anda bisa mencoba menambah, mengubah jadwal pelajaran, atau mengganti preset (Reguler / Jumat / Ujian).
   - **Keamanan PIN**: Menguji proteksi PIN admin (PIN bawaan: `1234`).
