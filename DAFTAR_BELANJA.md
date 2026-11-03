# DAFTAR BELANJA & KEBUTUHAN KOMPONEN (BOM - BILL OF MATERIALS)
## Proyek Prototipe Bel Sekolah Otomatis Mandiri ESP8266 & ESP32

Dokumen ini memuat rincian lengkap daftar belanja komponen elektronik, foto/referensi visual, estimasi harga pasaran e-commerce Indonesia (Tokopedia/Shopee), serta tips pemilihan komponen.

---

### 1. Status Kepemilikan & Komponen Inti

| No | Referensi Visual | Nama Komponen & Spesifikasi | Estimasi Harga | Status / Kepemilikan | Fungsi pada Sistem | Tips & Catatan |
|:---:|:---:|---|:---:|:---:|---|---|
| 1 | [![ESP8266 NodeMCU V3](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/15/d4029471-c0aa-433b-8d14-38c2132d94cf.jpg)](https://www.google.com/search?tbm=isch&q=ESP8266+NodeMCU+V3+Lolin+Type+C) | **NodeMCU ESP8266 V3 CH340 (Lolin Type-C)**<br>*(Klik gambar)* | Rp 28.000 - Rp 38.000 | **SUDAH DIMILIKI** | Otak pengendali, Web Server AP Wi-Fi mandiri, dan background scheduler jadwal bel. | Menggunakan port USB Type-C modern, flash 4MB (2MB Program / 2MB LittleFS UI). |
| 2 | [![Relay 2 Channel](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/1/22/a3809633-8a39-445a-a309-8d19760927df.jpg)](https://www.google.com/search?tbm=isch&q=Relay+Module+2+Channel+5V+Optocoupler) | **Modul Relay 5V 2-Channel (Optocoupler)**<br>*(Klik gambar)* | Rp 12.000 - Rp 20.000 | **SUDAH DIMILIKI** | Saklar ganda: Channel 1 untuk Mute Audio Jack (D7), Channel 2 untuk Saklar Daya Listrik PLN Amplifier (D0). | Dapat juga difungsikan sebagai Relay 1-Channel terpisah bila diperlukan. |
| 3 | [![MicroSD Card](https://images.tokopedia.net/img/cache/700/VqbcmM/2022/4/22/e13fdf19-35a0-4ffb-873b-741ae0fdd98a.jpg)](https://www.google.com/search?tbm=isch&q=MicroSD+Card+Class+10+Sandisk) | **MicroSD Card (Format FAT32)**<br>*(Klik gambar)* | Rp 25.000 - Rp 45.000 | **SUDAH DIMILIKI** | Penyimpan file suara lagu dan bel sekolah format `.mp3`. | Wajib diformat dengan sistem berkas **FAT32**. Buat folder `/mp3/` berisi file `0001.mp3` s/d `0021.mp3`. |
| 4 | [![DFPlayer Mini](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/3/9/00feffba-a82f-4c54-9769-0523ec366223.jpg)](https://www.google.com/search?tbm=isch&q=DFPlayer+Mini+MP3+Module) | **DFPlayer Mini MP3 Module**<br>*(Klik gambar)* | Rp 18.000 - Rp 28.000 | **PERLU DIBELI** | Pemutar file audio MP3 nada bel dari MicroSD via serial (Pin D5 TX & D6 RX). | Pilih modul dengan chip bertuliskan JL / GD / YX5200. Pin utuh dan lurus. |
| 5 | [![RTC DS3231](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/11/17/74b77e80-d266-4e50-9d04-1b4d008bb42f.jpg)](https://www.google.com/search?tbm=isch&q=RTC+DS3231+module+with+CR2032+battery) | **Modul RTC DS3231 I2C + Baterai CR2032**<br>*(Klik gambar)* | Rp 18.000 - Rp 30.000 | **PERLU DIBELI** | Penjaga waktu real-time presisi tinggi agar jadwal bel akurat meski listrik sekolah padam. | Hubungkan ke Pin D1 (SCL) dan D2 (SDA). Pastikan sepaket dengan baterai koin CR2032. |
| 6 | [![Resistor 1k](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/3/3/0388eb19-94fc-4bfa-9a5c-59df1f198c0b.jpg)](https://www.google.com/search?tbm=isch&q=Resistor+1k+ohm+1/4W) | **Resistor 1kΩ (Cokelat-Hitam-Merah) 1/4W**<br>*(Klik gambar)* | Rp 500 - Rp 1.000 | **PERLU DISIAPKAN** | Peredam noise sinyal serial TX ESP8266 (D6) ke pin RX DFPlayer Mini. | Wajib dipasang di antara pin D6 ESP8266 dan RX DFPlayer agar suara bebas desis/noise. |
| 7 | [![Kabel USB Type-C](https://images.tokopedia.net/img/cache/700/VqbcmM/2020/10/8/cf75704a-1dc5-4bf6-b514-469b2d6ffb4d.jpg)](https://www.google.com/search?tbm=isch&q=Kabel+Data+USB+Type+C) | **Kabel USB Type-C Data & Sync**<br>*(Klik gambar)* | Rp 10.000 - Rp 25.000 | **PERLU DISIAPKAN** | Penghubung ESP8266 Lolin Type-C ke laptop untuk upload kode program & catu daya. | Gunakan kabel data charger HP Type-C yang bisa deteksi COM port di komputer. |

---

### 2. Komponen Tambahan Opsional (Layar Display Fisik)

Jika ingin menambahkan tampilan layar fisik di kotak alat (selain tampilan Web Dashboard di HP/Laptop):

| No | Referensi Visual | Nama Komponen | Estimasi Harga | Status | Fungsi pada Sistem | Tips Pembelian |
|:---:|:---:|---|:---:|:---:|---|---|
| A | [![LCD 1602 I2C](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/4/20/df46bf0f-7b70-4fc7-802c-fc02a90da307.jpg)](https://www.google.com/search?tbm=isch&q=LCD+1602+I2C+Module) | **LCD 1602 + I2C Backpack (PCF8574)**<br>*(Klik gambar)* | Rp 22.000 - Rp 32.000 | *Opsional* | Menampilkan jam real-time dan teks status jadwal bel secara langsung di kotak perangkat. | Pastikan beli yang sudah tersolder modul backpack I2C hitam (cukup 4 kabel: VCC, GND, SDA, SCL). |

---

### 3. Jalur Audio, Pengujian Suara Meja & Aksesoris

| No | Referensi Visual | Nama Komponen | Estimasi Harga | Status | Fungsi pada Sistem | Tips Pembelian |
|:---:|:---:|---|:---:|:---:|---|---|
| 8 | [![Speaker Mini 8 Ohm](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/4/29/7c638fa4-bbba-4672-8869-d6e30b3558c4.jpg)](https://www.google.com/search?tbm=isch&q=Mini+Speaker+8+Ohm+0.5W+3W) | **Speaker Pasif Mini 8Ω (0.5W - 3W)**<br>*(Klik gambar)* | Rp 5.000 - Rp 15.000 | *Opsional Meja* | Speaker uji dengar langsung di meja tanpa perlu menyalakan amplifier TOA sekolah. | Hubungkan langsung ke pin `SPK_1` dan `SPK_2` pada DFPlayer Mini. |
| 9 | [![Kabel Audio Jack 3.5mm](https://images.tokopedia.net/img/cache/700/VqbcmM/2020/12/3/9324021a-493d-4c3e-8c3e-8b656a2bb53c.jpg)](https://www.google.com/search?tbm=isch&q=Kabel+Jack+Audio+3.5mm+to+RCA) | **Kabel Audio Jack 3.5mm ke RCA / AUX**<br>*(Klik gambar)* | Rp 8.000 - Rp 20.000 | *Perlu Disiapkan* | Menghubungkan output audio bel ke amplifier TOA / mixer sekolah. | Dihubungkan ke port RCA AUX 1 / AUX 2 di panel belakang mixer amplifier. |
| 10 | [![Breadboard MB-102](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/9/6/51ec6bc9-2fc5-4e31-8f64-8f041ff91b8a.jpg)](https://www.google.com/search?tbm=isch&q=Breadboard+MB-102+830+hole) | **Breadboard MB-102 (830 Lubang)**<br>*(Klik gambar)* | Rp 15.000 - Rp 25.000 | *Perlu Disiapkan* | Papan tancap prototipe untuk merangkai seluruh modul tanpa solder. | Tipe 830 titik cukup menampung ESP8266, RTC, dan DFPlayer sekaligus. |
| 11 | [![Kabel Jumper Dupont](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/5/7/ad5790be-a010-4822-ba30-58c35b801a6b.jpg)](https://www.google.com/search?tbm=isch&q=Kabel+Jumper+Dupont+Male+Female) | **Kabel Jumper Dupont (Male-Female & Male-Male)**<br>*(Klik gambar)* | Rp 10.000 - Rp 18.000 | *Perlu Disiapkan* | Menghubungkan modul relay, RTC, dan DFPlayer ke pin ESP8266. | Beli 1 papan kombinasi isi 40 helai panjang 20cm. |

---

### 4. Ringkasan Pengeluaran Belanja

Karena **ESP8266**, **Modul Relay 2-Channel**, dan **MicroSD Card** sudah Anda miliki:

- **Komponen yang Wajib Dibeli**:
  - Modul DFPlayer Mini MP3: ~ Rp 20.000
  - Modul RTC DS3231 + Baterai CR2032: ~ Rp 22.000
  - Resistor 1kΩ: ~ Rp 1.000
  - **Total Komponen Inti yang Perlu Dibeli**: **± Rp 43.000**
- **Jika Menambah Kabel Jumper & Breadboard (untuk uji coba)**: **± Rp 30.000**
- **Jika Menambah Layar LCD 1602 I2C (Opsional)**: **± Rp 25.000**

---

### 5. Panduan Singkat Persiapan MicroSD yang Sudah Ada
1. Sambungkan kartu MicroSD ke komputer/laptop menggunakan card reader.
2. Format kartu MicroSD dengan pilihan **File System: FAT32** (Allocation unit size: Default).
3. Buat folder baru bernama **`mp3`** di dalam MicroSD.
4. Salin file nada bel dari folder proyek komputer: `d:\BelSekolah\microsd_audio\mp3\` (file `0001.mp3`, `0002.mp3`, ..., `0021.mp3`) ke dalam folder `mp3` di MicroSD tersebut.
