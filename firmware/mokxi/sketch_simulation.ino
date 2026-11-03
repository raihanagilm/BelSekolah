#include <Arduino.h>
#include <Wire.h>
#include <RTClib.h>
#include <DFRobotDFPlayerMini.h>

/*
 * ====================================================================
 * SKETCH SIMULASI BEL SEKOLAH OTOMATIS (MOKXI & WOKWI SIMULATOR)
 * ====================================================================
 * Kompatibel langsung dengan:
 * - ESP32 DevKit (board-esp32-devkit-c-v4)
 * - ESP8266 NodeMCU (wokwi-esp8266-nodemcu)
 * 
 * Fitur Simulasi:
 * 1. Deteksi RTC (DS1307/DS3231) & cetak waktu real-time
 * 2. Deteksi DFPlayer Mini MP3 Player
 * 3. Sekuens Relay Auto-Mute 2-Channel:
 *    - Power TOA ON
 *    - Audio Mute Delay (Pre-roll 2 detik)
 *    - Play MP3 Track Bel
 *    - Audio Post-roll & Auto-Mute OFF
 * 4. Input Serial Monitor Interaktif:
 *    - Ketik "BELL" atau "B" -> memicu bunyi bel simulasi
 *    - Ketik "TIME" atau "T" -> membaca jam RTC
 *    - Ketik "1" s/d "21"     -> memutar track audio tertentu
 * ====================================================================
 */

// Konfigurasi Pinout Otomatis Berdasarkan Arsitektur Board
#if defined(ESP8266)
  #include <SoftwareSerial.h>
  #define PIN_RELAY_MUTE   13 // D7 (Relay Channel 1: Mute Audio Jack)
  #define PIN_RELAY_POWER  16 // D0 (Relay Channel 2: Saklar Daya Amplifier TOA)
  #define PIN_DF_RX        14 // D5 (Ke TX DFPlayer)
  #define PIN_DF_TX        12 // D6 (Ke RX DFPlayer via Resistor 1k)
  #define PIN_I2C_SDA       4 // D2 (SDA RTC)
  #define PIN_I2C_SCL       5 // D1 (SCL RTC)
  #define PIN_LED           2 // D4 (Built-in LED)
  SoftwareSerial dfSerial(PIN_DF_RX, PIN_DF_TX);
#else
  // Default: ESP32 DevKit V1 / V4
  #define PIN_RELAY_MUTE   4  // GPIO 4 (Relay Channel 1)
  #define PIN_RELAY_POWER  5  // GPIO 5 (Relay Channel 2)
  #define PIN_DF_RX        16 // GPIO 16 (RX2)
  #define PIN_DF_TX        17 // GPIO 17 (TX2)
  #define PIN_I2C_SDA      21 // GPIO 21 (SDA)
  #define PIN_I2C_SCL      22 // GPIO 22 (SCL)
  #define PIN_LED          2  // GPIO 2 (LED Indikator)
  HardwareSerial dfSerial(2);
#endif

RTC_DS1307 rtc; // Di simulator Mokxi/Wokwi modul RTC menggunakan emulasi DS1307/DS3231 I2C
DFRobotDFPlayerMini dfplayer;

bool isBellActive = false;
unsigned long bellStartTime = 0;
unsigned long bellDuration = 8000; // 8 detik simulasi durasi audio bel

void setupRelays() {
  pinMode(PIN_RELAY_MUTE, OUTPUT);
  pinMode(PIN_RELAY_POWER, OUTPUT);
  pinMode(PIN_LED, OUTPUT);

  // Relay Active-LOW: Default HIGH (Mati / Standby)
  digitalWrite(PIN_RELAY_MUTE, HIGH);
  digitalWrite(PIN_RELAY_POWER, HIGH);
  digitalWrite(PIN_LED, LOW);
}

void triggerBellSequence(int trackNumber = 1) {
  if (isBellActive) {
    Serial.println(F("[!] Bel sedang berjalan, mohon tunggu..."));
    return;
  }

  Serial.println(F("========================================"));
  Serial.print(F("[ACTION] Memicu Bel Sekolah - Track: "));
  Serial.println(trackNumber);
  Serial.println(F("========================================"));

  // 1. Nyalakan Daya Amplifier TOA (Relay Channel 2)
  Serial.println(F("[1/4] Saklar Daya Amplifier TOA: ON"));
  digitalWrite(PIN_RELAY_POWER, LOW); // Active-Low ON
  digitalWrite(PIN_LED, HIGH);

  // 2. Pre-roll delay (Menghindari suara desis/thump saat relay amplifier menyala)
  Serial.println(F("[2/4] Pre-roll delay (1.5 detik)..."));
  delay(1500);

  // 3. Buka Jalur Audio Mute (Relay Channel 1)
  Serial.println(F("[3/4] Relay Audio Mute: UNMUTE (Jalur Suara Terbuka)"));
  digitalWrite(PIN_RELAY_MUTE, LOW); // Active-Low ON

  // 4. Putar Audio di DFPlayer Mini
  Serial.print(F("[4/4] Memutar audio MP3 nomor "));
  Serial.print(trackNumber);
  Serial.println(F(" di DFPlayer Mini..."));
  dfplayer.play(trackNumber);

  isBellActive = true;
  bellStartTime = millis();
}

void checkBellTimeout() {
  if (isBellActive && (millis() - bellStartTime >= bellDuration)) {
    Serial.println(F("----------------------------------------"));
    Serial.println(F("[FINISH] Audio Bel selesai diputar."));
    
    // Matikan Jalur Audio terlebih dahulu (Mute)
    digitalWrite(PIN_RELAY_MUTE, HIGH); // Standby / MUTE
    Serial.println(F("[OFF] Relay Audio Mute: MUTED"));
    
    delay(500); // Jeda transisi
    
    // Matikan Daya Amplifier TOA
    digitalWrite(PIN_RELAY_POWER, HIGH); // Standby / POWER OFF
    digitalWrite(PIN_LED, LOW);
    Serial.println(F("[OFF] Saklar Daya Amplifier TOA: OFF (Standby)"));
    Serial.println(F("========================================\n"));
    
    isBellActive = false;
  }
}

void printCurrentTime() {
  DateTime now = rtc.now();
  char buffer[32];
  snprintf(buffer, sizeof(buffer), "%04d-%02d-%02d %02d:%02d:%02d", 
           now.year(), now.month(), now.day(), now.hour(), now.minute(), now.second());
  Serial.print(F("[RTC TIME] "));
  Serial.println(buffer);
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println(F("\n\n========================================"));
  Serial.println(F(" SISTEM SIMULASI BEL SEKOLAH OTOMATIS   "));
  Serial.println(F(" Platform: Mokxi (https://app.mokxi.com/)"));
  Serial.println(F("========================================"));

  setupRelays();

  // Inisialisasi I2C & RTC
  Wire.begin(PIN_I2C_SDA, PIN_I2C_SCL);
  if (!rtc.begin()) {
    Serial.println(F("[ERROR] Modul RTC tidak terdeteksi pada pin I2C!"));
  } else {
    Serial.println(F("[OK] Modul RTC terhubung normal."));
    if (!rtc.isrunning()) {
      Serial.println(F("[INFO] Menyetel waktu RTC ke waktu kompilasi..."));
      rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
    }
    printCurrentTime();
  }

  // Inisialisasi Serial DFPlayer Mini
  #if defined(ESP8266)
    dfSerial.begin(9600);
  #else
    dfSerial.begin(9600, SERIAL_8N1, PIN_DF_RX, PIN_DF_TX);
  #endif

  Serial.println(F("[INFO] Menginisialisasi DFPlayer Mini..."));
  if (!dfplayer.begin(dfSerial)) {
    Serial.println(F("[WARN] DFPlayer Mini offline / sedang proses handshake..."));
  } else {
    Serial.println(F("[OK] DFPlayer Mini siap digunakan."));
    dfplayer.volume(25); // Volume level 25 (0-30)
  }

  Serial.println(F("\n[KONTROL SERIAL INTERAKTIF]:"));
  Serial.println(F(" - Ketik 'BELL' atau 'B'  : Memicu simulasi bel sekolah"));
  Serial.println(F(" - Ketik 'TIME' atau 'T'  : Membaca jam RTC waktu nyata"));
  Serial.println(F(" - Ketik angka (misal '2'): Memutar track nomor tersebut"));
  Serial.println(F("========================================\n"));
}

unsigned long lastTick = 0;

void loop() {
  // Cek timeout simulasi bel
  checkBellTimeout();

  // Tampilkan waktu berkala tiap 10 detik
  if (millis() - lastTick >= 10000) {
    lastTick = millis();
    if (!isBellActive) {
      printCurrentTime();
    }
  }

  // Baca input interaktif dari Serial Monitor di browser Mokxi
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();
    input.toUpperCase();

    if (input == "BELL" || input == "B") {
      triggerBellSequence(1);
    } else if (input == "TIME" || input == "T") {
      printCurrentTime();
    } else if (input.toInt() > 0) {
      triggerBellSequence(input.toInt());
    } else if (input.length() > 0) {
      Serial.println(F("[?] Perintah tidak dikenal. Ketik 'BELL' atau 'TIME'."));
    }
  }
}
