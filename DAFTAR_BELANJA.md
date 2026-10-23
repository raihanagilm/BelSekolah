# DAFTAR BELANJA & KEBUTUHAN KOMPONEN (BOM - BILL OF MATERIALS)
## Proyek Prototipe Bel Sekolah Otomatis Mandiri ESP32

Dokumen ini memuat rincian lengkap daftar belanja komponen elektronik, foto/referensi visual, estimasi harga pasaran e-commerce Indonesia (Tokopedia/Shopee), serta tips pemilihan agar tidak keliru saat membeli komponen.

---

### 1. Komponen Utama (Wajib)

| No | Referensi Visual | Nama Komponen & Spesifikasi | Estimasi Harga | Fungsi pada Sistem | Tips Pembelian / Rekomendasi |
|:---:|:---:|---|:---:|---|---|
| 1 | [![ESP32 DevKit](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/6/15/d4029471-c0aa-433b-8d14-38c2132d94cf.jpg)](https://www.google.com/search?tbm=isch&q=ESP32+DOIT+DevKit+V1+30+pin) | **ESP32 DOIT DevKit V1 (30 Pin / ESP-WROOM-32)**<br>*(Klik gambar untuk lihat detail)* | Rp 55.000 - Rp 70.000 | Otak pengendali, penyedia Web Server AP Wi-Fi mandiri, dan scheduler jadwal bel. | Pilih varian **30 Pin** karena menyisakan ruang kabel yang lebih lega di breadboard dibanding versi 38 pin. |
| 2 | [![RTC DS3231](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/11/17/74b77e80-d266-4e50-9d04-1b4d008bb42f.jpg)](https://www.google.com/search?tbm=isch&q=RTC+DS3231+module+with+CR2032+battery) | **Modul RTC DS3231 I2C + Baterai CR2032**<br>*(Klik gambar untuk lihat detail)* | Rp 18.000 - Rp 30.000 | Penjaga waktu real-time presisi tinggi (jam, menit, detik) agar jadwal tetap tepat waktu saat listrik padam. | Pastikan deskripsi produk mencantumkan **termasuk baterai CR2032/LIR2032**. |
| 3 | [![DFPlayer Mini](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/3/9/00feffba-a82f-4c54-9769-0523ec366223.jpg)](https://www.google.com/search?tbm=isch&q=DFPlayer+Mini+MP3+Module) | **DFPlayer Mini MP3 Module**<br>*(Klik gambar untuk lihat detail)* | Rp 18.000 - Rp 28.000 | Pemutar file audio MP3 nada bel dari kartu MicroSD lewat komunikasi Serial UART. | Pilih modul dengan chip asli berlogo/seri JL atau GD. Pin harus utuh dan lurus. |
| 4 | [![MicroSD Card](https://images.tokopedia.net/img/cache/700/VqbcmM/2022/4/22/e13fdf19-35a0-4ffb-873b-741ae0fdd98a.jpg)](https://www.google.com/search?tbm=isch&q=MicroSD+Card+Class+10+Sandisk) | **MicroSD Card 8GB / 16GB (Class 10)**<br>*(Klik gambar untuk lihat detail)* | Rp 25.000 - Rp 45.000 | Penyimpan file suara lagu, bel sekolah, dan instrumen upacara format `.mp3`. | Kapasitas 8GB atau 16GB sudah sangat cukup. Wajib diformat sistem berkas **FAT32**. |
| 5 | [![Relay 1 Channel](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/1/22/a3809633-8a39-445a-a309-8d19760927df.jpg)](https://www.google.com/search?tbm=isch&q=Relay+Module+1+Channel+5V+Optocoupler) | **Modul Relay 1 Channel 5V (Optocoupler)**<br>*(Klik gambar untuk lihat detail)* | Rp 8.000 - Rp 15.000 | Saklar switch amplifier otomatis (*Auto-Mute*) agar speaker tidak mendengung saat stand-by. | Pilih modul 5V yang dilengkapi isolasi optocoupler (terdapat jumper pengatur High/Low). |
| 6 | [![Resistor 1k](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/3/3/0388eb19-94fc-4bfa-9a5c-59df1f198c0b.jpg)](https://www.google.com/search?tbm=isch&q=Resistor+1k+ohm+1/4W) | **Resistor 1kΩ (Cokelat-Hitam-Merah) 1/4W**<br>*(Klik gambar untuk lihat detail)* | Rp 500 - Rp 1.000 | Peredam noise sinyal UART TX ESP32 ke pin RX DFPlayer Mini. | Komponen murah namun wajib dipasang demi kejelasan suara bel bebas *noise*. |

---

### 2. Jalur Daya & Pengujian Suara Meja

| No | Referensi Visual | Nama Komponen | Estimasi Harga | Fungsi pada Sistem | Tips Pembelian |
|:---:|:---:|---|:---:|---|---|
| 7 | [![Adaptor 5V 2A](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/8/23/1bb3dca0-2ff6-455b-99f6-fc75dd13b403.jpg)](https://www.google.com/search?tbm=isch&q=Adaptor+5V+2A+Micro+USB) | **Adaptor Power Supply 5V 2A (Micro USB)**<br>*(Klik gambar)* | Rp 20.000 - Rp 40.000 | Catu daya stabil untuk ESP32, DFPlayer, dan Relay. | Gunakan adaptor dengan arus stabil minimal 2 Ampere. Charger HP original juga sangat bagus. |
| 8 | [![Kabel Micro USB Data](https://images.tokopedia.net/img/cache/700/VqbcmM/2020/10/8/cf75704a-1dc5-4bf6-b514-469b2d6ffb4d.jpg)](https://www.google.com/search?tbm=isch&q=Kabel+Micro+USB+Data) | **Kabel Micro USB Data & Sync**<br>*(Klik gambar)* | Rp 10.000 - Rp 20.000 | Penghubung ESP32 ke laptop untuk proses upload kode program / firmware. | Wajib kabel yang mendukung **transfer data**, bukan kabel charging saja. |
| 9 | [![Speaker Mini 8 Ohm](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/4/29/7c638fa4-bbba-4672-8869-d6e30b3558c4.jpg)](https://www.google.com/search?tbm=isch&q=Mini+Speaker+8+Ohm+0.5W+3W) | **Speaker Pasif Mini 8Ω (0.5W - 3W)**<br>*(Klik gambar)* | Rp 5.000 - Rp 15.000 | Speaker uji dengar langsung di meja tanpa perlu amplifier sekolah. | Hubungkan langsung ke pin `SPK_1` dan `SPK_2` pada DFPlayer Mini. |
| 10 | [![Kabel Audio Jack 3.5mm](https://images.tokopedia.net/img/cache/700/VqbcmM/2020/12/3/9324021a-493d-4c3e-8c3e-8b656a2bb53c.jpg)](https://www.google.com/search?tbm=isch&q=Kabel+Jack+Audio+3.5mm+to+RCA) | **Kabel Audio Jack 3.5mm ke RCA / AUX**<br>*(Klik gambar)* | Rp 8.000 - Rp 20.000 | Menghubungkan output audio bel ke amplifier/mixer pengeras suara sekolah. | Digunakan saat tahap integrasi alat ke sistem tata suara sekolah. |

---

### 3. Papan Uji & Kabel Prototipe (Tanpa Solder)

| No | Referensi Visual | Nama Komponen | Estimasi Harga | Fungsi pada Sistem | Tips Pembelian |
|:---:|:---:|---|:---:|---|---|
| 11 | [![Breadboard MB-102](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/9/6/51ec6bc9-2fc5-4e31-8f64-8f041ff91b8a.jpg)](https://www.google.com/search?tbm=isch&q=Breadboard+MB-102+830+hole) | **Breadboard MB-102 (830 Lubang)**<br>*(Klik gambar)* | Rp 15.000 - Rp 25.000 | Papan tancap prototipe untuk merangkai seluruh modul tanpa perlu menyolder. | Pilih tipe panjang (830 titik) agar cukup menampung modul ESP32, RTC, dan DFPlayer. |
| 12 | [![Kabel Jumper Dupont](https://images.tokopedia.net/img/cache/700/VqbcmM/2021/5/7/ad5790be-a010-4822-ba30-58c35b801a6b.jpg)](https://www.google.com/search?tbm=isch&q=Kabel+Jumper+Dupont+Male+Female) | **Kabel Jumper Dupont (Male-to-Male & Male-to-Female)**<br>*(Klik gambar)* | Rp 10.000 - Rp 18.000 | Kabel koneksi lentur untuk menghubungkan antar modul pada breadboard. | Beli 1 set kombinasi isi 40 helai panjang 20cm (Male-to-Male dan Male-to-Female). |

---

### 4. Ringkasan Total Estimasi Biaya

- **Komponen Inti**: ~ **Rp 150.000**
- **Total Termasuk Aksesoris & Uji Meja (Lengkap)**: ~ **Rp 180.000 - Rp 240.000**

---

### 5. Panduan Singkat Saat Barang Diterima
1. Tancapkan ESP32 ke laptop menggunakan kabel Micro USB. Periksa apakah lampu indikator power merah menyala dan port COM terdeteksi di Device Manager / Arduino IDE.
2. Periksa modul RTC DS3231, pastikan baterai koin CR2032 terpasang pas pada slot belakangnya.
3. Masukkan MicroSD ke slot DFPlayer Mini, pastikan dapat mengunci dengan mekanisme klik (*push-push*).
4. Siapkan resistor 1k Ohm untuk dipasang pada jalur pin RX DFPlayer sebelum disambungkan ke ESP32.
