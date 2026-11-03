# Mokxi Simulation Package - Bel Sekolah Otomatis Mandiri

Paket simulasi ini dirancang khusus untuk dijalankan langsung di platform simulator online modern **[Mokxi](https://app.mokxi.com/)** (atau [Wokwi](https://wokwi.com/)).

Mokxi mendukung impor langsung file standar `diagram.json`, `libraries.txt`, dan sketch Arduino (`sketch.ino` / `firmware.ino`).

---

## 📁 Berkas Simulasi yang Tersedia

1. **`mokxi_diagram_esp32.json`**  
   Simulasi dengan mikrokontroler **ESP32 DevKit V1 / V4**:
   - ESP32 Board
   - RTC DS1307 / DS3231 (I2C: SDA GPIO 21, SCL GPIO 22)
   - DFPlayer Mini MP3 (UART2: TX2 GPIO 17 -> Resistor 1k -> RX DFPlayer, RX2 GPIO 16 <- TX DFPlayer)
   - Modul Relay Channel 1: Mute Audio Jack (GPIO 4)
   - Modul Relay Channel 2: Saklar Daya Amplifier TOA (GPIO 5)
   - LED Indikator Status (GPIO 2) + Resistor 220Ω

2. **`mokxi_diagram_esp8266.json`**  
   Simulasi dengan mikrokontroler **ESP8266 NodeMCU V3 (Lolin Type-C)**:
   - NodeMCU ESP8266 Board
   - RTC DS1307 / DS3231 (I2C: SDA D2/GPIO 4, SCL D1/GPIO 5)
   - DFPlayer Mini MP3 (SoftwareSerial: D6/GPIO 12 -> Resistor 1k -> RX DFPlayer, D5/GPIO 14 <- TX DFPlayer)
   - Modul Relay Channel 1: Mute Audio Jack (D7/GPIO 13)
   - Modul Relay Channel 2: Saklar Daya Amplifier TOA (D0/GPIO 16)
   - Built-in LED (D4/GPIO 2)

3. **`libraries.txt`**  
   Daftar dependensi pustaka Arduino untuk simulasi Mokxi/Wokwi.

4. **`sketch_simulation.ino`**  
   Sketch firmware khusus simulasi yang sudah dioptimalkan untuk simulator browser (disertai pembacaan RTC, simulasi DFPlayer serial feedback, auto-mute sequence relay ganda, dan Serial Monitor interaktif).

---

## 🚀 Cara Menjalankan Simulasi di https://app.mokxi.com/

### Metode 1: Buka Proyek Langsung & Paste Diagram (Paling Cepat)
1. Buka browser dan kunjungi: **[https://app.mokxi.com/](https://app.mokxi.com/)**
2. Pilih board baru: **ESP32** (atau **ESP8266 NodeMCU** sesuai preferensi).
3. Di tab editor Mokxi:
   - Klik tab **`diagram.json`**, hapus isinya dan salin isi dari `mokxi_diagram_esp32.json` (atau `mokxi_diagram_esp8266.json`).
   - Klik tab kode utama (`sketch.ino`), salin isi dari `sketch_simulation.ino` (atau `firmware/firmware.ino`).
   - Buat file baru bernama `libraries.txt` jika belum ada, dan salin isi dari `libraries.txt`.
4. Tekan tombol **▶ Play / Run Simulation**.
5. Buka tab **Serial Monitor** di Mokxi:
   - Anda akan melihat inisialisasi boot sistem, pendeteksian RTC, DFPlayer Mini, dan status relay.
   - Anda dapat mengetikkan perintah uji coba langsung di Serial Monitor:
     - Ketik `BELL` lalu Enter -> memicu simulasi bel sekolah (menyalakan relay amplifier, menyalakan relay audio mute, memutar track MP3 bel, dan auto-mute kembali).
     - Ketik `TIME` lalu Enter -> membaca jam dan detik waktu nyata saat ini dari RTC.

---

## 🔌 Detail Koneksi Pinout (ESP32)

| Modul | Pin Modul | Terhubung ke ESP32 | Keterangan |
|---|---|---|---|
| **RTC DS3231 / DS1307** | VCC | 5V / VIN | Daya 5V |
| | GND | GND | Ground |
| | SDA | GPIO 21 | I2C Data |
| | SCL | GPIO 22 | I2C Clock |
| **DFPlayer Mini** | VCC | 5V / VIN | Daya 5V |
| | GND | GND | Ground |
| | RX | Resistor 1kΩ ke GPIO 17 (TX2) | Serial TX ESP ke RX DFPlayer |
| | TX | GPIO 16 (RX2) | Serial RX ESP ke TX DFPlayer |
| **Relay Channel 1 (Mute)** | VCC | 5V / VIN | Daya 5V Koil |
| | GND | GND | Ground |
| | IN | GPIO 4 | Kontrol Mute Audio Jack |
| **Relay Channel 2 (Power)** | VCC | 5V / VIN | Daya 5V Koil |
| | GND | GND | Ground |
| | IN | GPIO 5 | Kontrol Saklar Daya TOA |
| **LED Indikator** | Anoda (+) | GPIO 2 | Indikator Bel Aktif |
| | Katoda (-) | Resistor 220Ω ke GND | Resistor Pembatas Arus |
