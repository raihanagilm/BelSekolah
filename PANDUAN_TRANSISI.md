# PANDUAN TRANSISI: DARI SIMULASI KE IMPLEMENTASI NYATA (PANDUAN_TRANSISI.md)
## Bel Sekolah Otomatis Mandiri Berbasis ESP32

Dokumen ini memuat perbandingan mendalam antara **Simulasi (Wokwi & Localhost)** dengan **Implementasi Perangkat Fisik (Real Hardware)**, panduan langkah demi langkah saat barang belanjaan Anda tiba, serta hal-hal teknis yang wajib diperhatikan.

---

## 1. Tabel Perbandingan: Simulasi vs Real Hardware

| Aspek Sistem | Mode Simulasi (Saat Ini) | Implementasi Fisik (Hardware Asli) | Catatan Transisi |
|---|---|---|---|
| **Koneksi Wi-Fi** | Konek ke internet virtual `Wokwi-GUEST` + Cloud Broker HiveMQ untuk jembatan cloud. | ESP32 memancarkan sinyal Wi-Fi Access Point sendiri: **`Bel-Sekolah-AP`** (IP `192.168.4.1`) secara mandiri offline. | Di hardware asli, sistem tidak butuh internet sama sekali. Guru/Operator cukup sambungkan Wi-Fi laptop/HP ke `Bel-Sekolah-AP`. |
| **Penyimpanan File Web** | Dijalankan lewat server lokal komputer (`http://localhost:8080`). | Disimpan langsung di dalam chip memori flash internal ESP32 (**LittleFS**). | File HTML, CSS, JS, dan JSON di-upload ke partisi flash ESP32 sehingga web server berjalan mandiri di dalam chip. |
| **Pemutar Audio (MP3)** | Suara diputar oleh browser komputer via Web Audio API HTML5. | Suara diputar oleh modul keras **DFPlayer Mini MP3** membaca kartu **MicroSD FAT32**. | Kualitas audio fisik ditentukan oleh keaslian IC DFPlayer dan pemasangan resistor 1kΩ pada jalur RX. |
| **Modul Waktu (RTC)** | Modul virtual Wokwi (`0x68`). Waktu otomatis mengikuti jam komputer. | Modul fisik **RTC DS3231 I2C** dilengkapi baterai koin **CR2032**. | Jam tetap berjalan tepat detik demi detik meskipun listrik sekolah mati/saklar dicabut berbulan-bulan. |
| **Relay Saklar Amplifier** | Lampu indikator virtual merah/hijau di layar Wokwi. | Saklar mekanis relay 5V dengan kontak **COM** dan **NO** terhubung ke amplifier sekolah. | Berfungsi sebagai saklar *Auto-Mute* otomatis (pre-roll 2 detik sebelum bel berbunyi dan mati setelah lagu selesai agar bebas dengung). |
| **Lampu Indikator (LED)** | Komponen LED biru virtual Wokwi pada pin GPIO 2. | LED 5mm fisik + Resistor 220Ω (atau LED bawaan board ESP32). | Indikator visual instan bahwa perintah bel sedang aktif dieksekusi. |

---

## 2. Pemetaan Pinout Fisik (Kabel & Breadboard)

Gunakan tabel pemetaan ini saat menancapkan kabel jumper pada papan roti (Breadboard):

```
       ┌─────────────────────────────┐
       │     ESP32 DEVKIT V1 (30P)   │
       │                             │
       │ [VIN (5V)] ───┬──────────── │ ───> VCC Modul Relay (5V) & VCC RTC (5V)
       │ [GND]      ───┼──────────── │ ───> Jalur Bersama (Common GND Seluruh Modul)
       │ [GPIO 21]  ───┼──────────── │ ───> Pin SDA pada RTC DS3231
       │ [GPIO 22]  ───┼──────────── │ ───> Pin SCL pada RTC DS3231
       │ [GPIO 17]  ───┼─[Resistor 1kΩ]──> Pin RX pada DFPlayer Mini (TX2 ESP32)
       │ [GPIO 16]  ───┼──────────── │ ───> Pin TX pada DFPlayer Mini (RX2 ESP32)
       │ [GPIO 4]   ───┼──────────── │ ───> Pin IN / Signal pada Modul Relay
       │ [GPIO 2]   ───┼──────────── │ ───> Anoda (+) LED 5mm ──>[Resistor 220Ω]──> GND
       └─────────────────────────────┘
```

> **PERHATIAN KHUSUS DFPLAYER MINI & AUDIO AMPLIFIER**:
> - Jangan lupa memasang **Resistor 1kΩ seri** antara pin **D6 ESP8266** ke **RX DFPlayer Mini**. Tegangan logika ESP8266 adalah 3.3V sementara RX DFPlayer rentan noise tegangan 5V. Resistor ini meredam desis dan bunyi *kresek*.
> - Hubungkan kaki **SPK_1** dan **SPK_2** DFPlayer langsung ke speaker kecil meja saat uji coba.
> - **Integrasi ke Mixer Amplifier TOA ZA-2120**: Hubungkan pin **DAC_R** (atau **DAC_L**) dan **GND** melalui Relay Channel 1 menuju input **AUX 1** atau **AUX 2** di panel belakang amplifier TOA menggunakan kabel Jack 3.5mm ke RCA.

---

## 3. Integrasi Fisik Modul Relay 5V 2-Channel & TOA ZA-2120

Sistem menggunakan **Modul Relay 5V 2-Channel (Optocoupler)** dengan pembagian peran:

### A. Pengkabelan Kontrol Sinyal (ESP8266 ke Modul Relay)
| Pin Modul Relay | Sambungkan ke Pin ESP8266 | Keterangan |
|---|---|---|
| **VCC** | **VIN / VU** (5V USB) | Sumber daya 5V untuk koil elektromagnet relay |
| **GND** | **GND** | Ground bersama (*common ground*) |
| **IN 1** | **D7** (GPIO 13) | Sinyal kendali Relay Channel 1 (*Mute Audio Jack*) |
| **IN 2** | **D0** (GPIO 16) | Sinyal kendali Relay Channel 2 (*Saklar Daya Listrik PLN Amplifier*) |

*(Biarkan jumper biru **VCC - JD-VCC** tetap terpasang jika menggunakan catu daya 5V USB yang sama).*

### B. Pengkabelan Terminal Baut Biru Relay (Sisi Beban)
1. **Channel 1 (Mute Jalur Audio AUX TOA - Mencegah Suara Dengung):**
   - Kabel sinyal inti audio dari pin **DAC_R** DFPlayer $\rightarrow$ masuk ke terminal **COM 1**.
   - Kabel sinyal inti menuju ujung **Jack RCA (AUX 1 / AUX 2 Ampli TOA)** $\rightarrow$ masuk ke terminal **NO 1** (*Normally Open*).
   - Kabel ground (serabut) dari pin **GND** DFPlayer $\rightarrow$ sambung langsung ke *outer shield* Jack RCA tanpa melewati relay.
   - *Prinsip kerja*: Relay hanya menutup saat ada nada bel berbunyi. Ketika diam, jalur audio terputus total sehingga speaker sekolah hening tanpa desis/humming.

2. **Channel 2 (Saklar Otomatis Daya Listrik PLN Amplifier TOA ZA-2120):**
   - Kabel fasa listrik PLN 220V $\rightarrow$ masuk ke terminal **COM 2**.
   - Kabel fasa menuju colokan kabel power ampli TOA $\rightarrow$ masuk ke terminal **NO 2**.
   - *Prinsip kerja*: Otomatis menyalakan ampli 2-3 detik sebelum audio mulai (*pre-roll*) dan mematikannya kembali setelah nada selesai. Jika ampli ingin dinyalakan manual secara kontinu, Channel 2 boleh dibiarkan kosong tanpa kabel.

3. **Output TOA ZA-2120 Menuju Speaker Sekolah:**
   - Gunakan kabel speaker 2-core (NYZ/NYMHY).
   - **Sistem Trafo Matching 100V (Umum Sekolah):** Sambungkan ke terminal baut **`COM`** dan **`100V`** di panel belakang TOA ZA-2120.
   - **Sistem Low Impedance (4-16 Ohm):** Sambungkan ke terminal baut **`COM`** dan **`4Ω`**.

---

## 3. Langkah Demi Langkah Saat Barang Belanjaan Tiba

### Tahap 1: Persiapan Kartu MicroSD
1. Ambil kartu MicroSD (8GB atau 16GB).
2. Format kartu memori di komputer dengan tipe berkas **FAT32** (bukan exFAT / NTFS).
3. Buat folder baru bernama persis: `mp3` di direktori utama kartu MicroSD.
4. Salin seluruh 21 file audio yang sudah kita siapkan dari komputer Anda di:
   `D:\BelSekolah\microsd_audio\mp3\`
   ke dalam folder `mp3` di MicroSD tersebut (`0001.mp3`, `0002.mp3`, s.d. `0021.mp3`).
5. Tancapkan kartu MicroSD ke slot DFPlayer Mini hingga terdengar bunyi klik.

### Tahap 2: Pasang Baterai RTC DS3231
1. Pasang baterai koin **CR2032** pada slot dudukan baterai modul RTC DS3231.
2. Baterai ini memastikan jadwal jam sekolah tidak akan pernah meleset atau ter-reset meskipun kabel power dicabut.

### Tahap 3: Upload Firmware dari Arduino IDE
1. Buka aplikasi **Arduino IDE** di laptop Anda.
2. Buka file proyek: `D:\BelSekolah\firmware\firmware.ino`.
3. Tancapkan board ESP32 ke laptop menggunakan kabel data USB.
4. Di Arduino IDE:
   - Pilih menu **Tools -> Board -> ESP32 Arduino -> ESP32 Dev Module**.
   - Pilih menu **Tools -> Port -> COMx** (pilih nomor COM ESP32 Anda).
5. Klik tombol **Upload** (tanda panah `->`).
6. Tunggu hingga proses upload selesai 100% (*Done uploading*).

### Tahap 4: Upload File Web ke Flash ESP32 (LittleFS Data Upload)
Agar web dashboard, jadwal, dan tampilan tidak membutuhkan server laptop lagi:
1. File web statis berada di folder `D:\BelSekolah\firmware\data\`.
2. Gunakan plugin **ESP32 LittleFS Data Upload** pada Arduino IDE (atau kompilasi PlatformIO `pio run -t uploadfs`).
3. Seluruh file HTML/CSS/JS akan tersimpan permanen di memori flash internal ESP32.

### Tahap 5: Pengujian Operasional Pertama Kali
1. Nyalakan ESP32 menggunakan adaptor 5V 2A.
2. Buka Wi-Fi di HP atau laptop guru/operator, Anda akan melihat sinyal Wi-Fi baru:
   **`Bel-Sekolah-AP`**
3. Hubungkan ke Wi-Fi tersebut (tanpa password).
4. Buka browser (Chrome/Safari) lalu ketik alamat IP default:
   👉 **`http://192.168.4.1`**
5. Dashboard Bel Sekolah akan langsung muncul dari dalam chip ESP32!
6. Buka menu **Pengaturan**, klik tombol **"Sinkronkan Jam RTC Sekarang"** untuk mencocokkan jam RTC dengan jam HP/Laptop Anda dalam satu detik.
7. Coba tekan tombol **"Bel Masuk"** di beranda: Relay akan berbunyi klik, lampu LED menyala, dan nada bel sekolah berkumandang dari speaker sekolah!

---

## 4. Keuntungan Sistem Fisik Nyata Dibandingkan Simulasi
1. **100% Mandiri (Offline)**: Tidak memerlukan koneksi internet sekolah sama sekali.
2. **Bebas Virus & Tanpa PC Nyala 24 Jam**: Menggantikan komputer desktop sekolah yang boros listrik. ESP32 hanya memakan daya sekitar 1-2 Watt.
3. **Presisi Tinggi**: Modul RTC DS3231 memiliki kristal osilator internal dengan kompensasi suhu (*Temperature Compensated Crystal Oscillator*) sehingga deviasi waktu kurang dari 1 menit dalam setahun.
