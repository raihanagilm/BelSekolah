#include <Arduino.h>

#if defined(ESP8266)
  #include <ESP8266WiFi.h>
  #include <ESPAsyncTCP.h>
  #include <SoftwareSerial.h>
#elif defined(ESP32)
  #include <WiFi.h>
  #include <AsyncTCP.h>
#endif

#include <LittleFS.h>
#include <Wire.h>
#include <RTClib.h>
#include <DFRobotDFPlayerMini.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <AsyncJson.h>

// Definisi Pinout Fleksibel (ESP8266 NodeMCU & ESP32)
#if defined(ESP8266)
  // NodeMCU ESP8266 V3 Lolin Pinout
  #define PIN_RELAY_MUTE   D7 // GPIO 13 (Relay Channel 1: Mute Audio Jack)
  #define PIN_RELAY_POWER  D0 // GPIO 16 (Relay Channel 2: Saklar Daya Amplifier)
  #define PIN_DF_RX        D5 // GPIO 14 (Ke TX DFPlayer)
  #define PIN_DF_TX        D6 // GPIO 12 (Ke RX DFPlayer via Resistor 1k)
  #define PIN_I2C_SDA      D2 // GPIO 4 (SDA RTC DS3231)
  #define PIN_I2C_SCL      D1 // GPIO 5 (SCL RTC DS3231)
  #define PIN_LED          D4 // GPIO 2 (Built-in LED Active-Low)
#else
  // ESP32 DevKit Pinout
  #define PIN_RELAY_MUTE   4  // GPIO 4 (Relay Channel 1)
  #define PIN_RELAY_POWER  5  // GPIO 5 (Relay Channel 2)
  #define PIN_DF_RX        16 // GPIO 16 (RX2)
  #define PIN_DF_TX        17 // GPIO 17 (TX2)
  #define PIN_I2C_SDA      21 // GPIO 21 (SDA)
  #define PIN_I2C_SCL      22 // GPIO 22 (SCL)
  #define PIN_LED          2  // GPIO 2 (Built-in LED)
#endif

// Wi-Fi Access Point Konfigurasi Mandiri
const char* ap_ssid = "Bel-Sekolah-AP";
const char* ap_password = ""; // Open AP atau bisa diset password

// Objek Periferal & Server
AsyncWebServer server(80);
RTC_DS3231 rtc;
DFRobotDFPlayerMini dfplayer;

#if defined(ESP8266)
SoftwareSerial dfSerial(PIN_DF_RX, PIN_DF_TX);
#else
HardwareSerial dfSerial(2);
#endif

// Status Sistem
bool rtcFound = false;
bool dfFound = false;
String activePreset = "reguler";
String adminPin = "1234";
int speakerVolume = 25;
int relayPreRoll = 2;

// Flag pencegah double trigger pada menit yang sama
int lastTriggerMinute = -1;
int lastTriggerDay = -1;

// Prototipe Fungsi
void initFileSystem();
void loadSettings();
void checkScheduledBell();
void playBellTrack(int trackNumber);
void registerHttpRoutes();

void setup() {
  Serial.begin(115200);
  delay(1000);
#if defined(ESP8266)
  Serial.println("\n=== Memulai Bel Sekolah Otomatis Mandiri ESP8266 V3 ===");
#else
  Serial.println("\n=== Memulai Bel Sekolah Otomatis Mandiri ESP32 ===");
#endif

  // Inisialisasi Relay Dual-Channel
  pinMode(PIN_RELAY_MUTE, OUTPUT);
  pinMode(PIN_RELAY_POWER, OUTPUT);
  digitalWrite(PIN_RELAY_MUTE, LOW);  // Default Mute
  digitalWrite(PIN_RELAY_POWER, LOW); // Default Power Amp OFF

  pinMode(PIN_LED, OUTPUT);
#if defined(ESP8266)
  digitalWrite(PIN_LED, HIGH); // LED ESP8266 aktif LOW (HIGH = OFF)
#else
  digitalWrite(PIN_LED, LOW);
#endif

  // Inisialisasi LittleFS Flash
  initFileSystem();
  loadSettings();

  // Inisialisasi I2C & RTC DS3231
  Wire.begin(PIN_I2C_SDA, PIN_I2C_SCL);
  if (rtc.begin()) {
    rtcFound = true;
    Serial.println("[OK] Modul RTC DS3231 terdeteksi.");
    if (rtc.lostPower()) {
      Serial.println("[WARN] RTC sempat kehilangan daya. Mengatur waktu default.");
      rtc.adjust(DateTime(2026, 10, 21, 7, 0, 0));
    }
  } else {
    Serial.printf("[FAIL] RTC DS3231 tidak ditemukan! Cek koneksi pin SDA:%d / SCL:%d\n", PIN_I2C_SDA, PIN_I2C_SCL);
  }

  // Inisialisasi DFPlayer Mini Serial
#if defined(ESP8266)
  dfSerial.begin(9600);
#else
  dfSerial.begin(9600, SERIAL_8N1, PIN_DF_RX, PIN_DF_TX);
#endif

  if (dfplayer.begin(dfSerial, false, true)) {
    dfFound = true;
    dfplayer.volume(speakerVolume);
    Serial.println("[OK] DFPlayer Mini berhasil diinisialisasi.");
  } else {
    Serial.println("[WARN] DFPlayer Mini tidak merespons (Periksa MicroSD / Kabel Serial).");
  }

  // Aktifkan Wi-Fi Access Point
  WiFi.mode(WIFI_AP);
  WiFi.softAP(ap_ssid, ap_password);
  Serial.print("[OK] Wi-Fi AP Aktif: ");
  Serial.println(ap_ssid);
  Serial.print("[INFO] Alamat IP Web Server: ");
  Serial.println(WiFi.softAPIP());

  // Registrasi Rute REST API & Web Assets
  registerHttpRoutes();
  server.begin();
  Serial.println("[OK] HTTP Async Web Server berjalan pada port 80.");
}

unsigned long lastTick = 0;

void loop() {
  if (millis() - lastTick >= 1000) {
    lastTick = millis();
    checkScheduledBell();
  }
}

void initFileSystem() {
  if (!LittleFS.begin(true)) {
    Serial.println("[FAIL] Gagal mount LittleFS.");
  } else {
    Serial.println("[OK] LittleFS berhasil di-mount.");
  }
}

void loadSettings() {
  if (!LittleFS.exists("/schedule.json")) {
    Serial.println("[WARN] File /schedule.json tidak ditemukan di flash.");
    return;
  }
  File f = LittleFS.open("/schedule.json", "r");
  if (!f) return;

  JsonDocument doc;
  DeserializationError err = deserializeJson(doc, f);
  f.close();

  if (!err) {
    if (doc["active_preset"].is<const char*>()) {
      activePreset = doc["active_preset"].as<String>();
    }
    if (doc["settings"]["admin_pin"].is<const char*>()) {
      adminPin = doc["settings"]["admin_pin"].as<String>();
    }
    if (doc["settings"]["speaker_volume"].is<int>()) {
      speakerVolume = doc["settings"]["speaker_volume"].as<int>();
    }
    if (doc["settings"]["relay_pre_roll_sec"].is<int>()) {
      relayPreRoll = doc["settings"]["relay_pre_roll_sec"].as<int>();
    }
    Serial.println("[OK] Pengaturan sistem & preset berhasil dimuat dari LittleFS.");
  }
}

void checkScheduledBell() {
  if (!rtcFound) return;

  DateTime now = rtc.now();
  int currentDay = now.dayOfTheWeek(); // 0: Minggu, 1: Senin, dst.
  int currentHour = now.hour();
  int currentMinute = now.minute();
  int currentSecond = now.second();

  // Hanya periksa pada detik 0
  if (currentSecond != 0) return;

  // Hindari multiple trigger dalam menit yang sama
  if (currentMinute == lastTriggerMinute && currentDay == lastTriggerDay) {
    return;
  }

  char timeStr[6];
  sprintf(timeStr, "%02d:%02d", currentHour, currentMinute);

  if (!LittleFS.exists("/schedule.json")) return;
  File f = LittleFS.open("/schedule.json", "r");
  if (!f) return;

  JsonDocument doc;
  DeserializationError err = deserializeJson(doc, f);
  f.close();

  if (err) return;

  JsonArray schedList = doc["presets"][activePreset]["schedules"].as<JsonArray>();
  for (JsonObject item : schedList) {
    const char* schedTime = item["time"];
    if (schedTime && strcmp(schedTime, timeStr) == 0) {
      JsonArray days = item["days"].as<JsonArray>();
      bool dayMatch = false;
      for (int d : days) {
        if (d == currentDay) {
          dayMatch = true;
          break;
        }
      }
      if (dayMatch) {
        int trackId = item["track"] | 1;
        Serial.printf("[BELL] Waktu cocok: %s | Track: %d | Label: %s\n", timeStr, trackId, item["label"].as<const char*>());
        lastTriggerMinute = currentMinute;
        lastTriggerDay = currentDay;
        playBellTrack(trackId);
        break;
      }
    }
  }
}

void playBellTrack(int trackNumber) {
  Serial.printf("[AUDIO] Mengaktifkan Relay Pre-Roll (%d detik)...\n", relayPreRoll);
  
  // 1. Nyalakan Daya Amplifier (Relay Channel 2) & Unmute Jalur Audio (Relay Channel 1)
  digitalWrite(PIN_RELAY_POWER, HIGH);
  delay(500); // Beri waktu 500ms agar amplifier hidup tanpa pop noise
  digitalWrite(PIN_RELAY_MUTE, HIGH);

#if defined(ESP8266)
  digitalWrite(PIN_LED, LOW); // ESP8266 LED ON (Active LOW)
#else
  digitalWrite(PIN_LED, HIGH);
#endif

  delay(relayPreRoll * 1000);

  if (dfFound) {
    Serial.printf("[AUDIO] Memutar Track #%d pada DFPlayer Mini...\n", trackNumber);
    dfplayer.play(trackNumber);
  } else {
    Serial.println("[SIMULASI] Audio bel diputar (DFPlayer offline).");
  }

  // Waktu tunggu audio bel diputar (default aman: 15 detik untuk nada sekolah)
  delay(15000);

  Serial.println("[AUDIO] Mematikan Relay (Post-Roll / Mute).");
  digitalWrite(PIN_RELAY_MUTE, LOW);
  delay(1000); // Biarkan mute aktif sebelum memutus saklar listrik amplifier
  digitalWrite(PIN_RELAY_POWER, LOW);

#if defined(ESP8266)
  digitalWrite(PIN_LED, HIGH); // ESP8266 LED OFF
#else
  digitalWrite(PIN_LED, LOW);
#endif
}

void registerHttpRoutes() {
  // Static Files dari LittleFS
  server.serveStatic("/", LittleFS, "/").setDefaultFile("index.html");

  // REST API: Get Status
  server.on("/api/status", HTTP_GET, [](AsyncWebServerRequest *request) {
    JsonDocument res;
    res["status"] = "online";
    res["rtc_ok"] = rtcFound;
    res["df_ok"] = dfFound;
    res["active_preset"] = activePreset;
    res["uptime_sec"] = millis() / 1000;

    String out;
    serializeJson(res, out);
    request->send(200, "application/json", out);
  });

  // REST API: Manual Trigger
  server.on("/api/trigger", HTTP_POST, [](AsyncWebServerRequest *request) {
    int track = 1;
    if (request->hasParam("track")) {
      track = request->getParam("track")->value().toInt();
    }
    // Eksekusi trigger bel secara non-blocking via task atau run aman
    playBellTrack(track);

    request->send(200, "application/json", "{\"success\":true,\"message\":\"Bel sedang diputar\"}");
  });

  // REST API: Sync Time RTC
  server.on("/api/time/sync", HTTP_POST, [](AsyncWebServerRequest *request) {
    if (request->hasParam("epoch")) {
      uint32_t epoch = request->getParam("epoch")->value().toInt();
      if (rtcFound && epoch > 100000) {
        rtc.adjust(DateTime(epoch));
        Serial.printf("[RTC] Waktu berhasil disinkronkan ke Epoch: %u\n", epoch);
        request->send(200, "application/json", "{\"success\":true}");
        return;
      }
    }
    request->send(400, "application/json", "{\"success\":false,\"message\":\"Invalid epoch\"}");
  });

  // REST API: Auth Login
  AsyncCallbackJsonWebHandler *loginHandler = new AsyncCallbackJsonWebHandler("/api/auth/login", [](AsyncWebServerRequest *request, JsonVariant &json) {
    JsonObject body = json.as<JsonObject>();
    const char* pin = body["pin"];
    if (pin && strcmp(pin, adminPin.c_str()) == 0) {
      request->send(200, "application/json", "{\"success\":true}");
    } else {
      request->send(401, "application/json", "{\"success\":false,\"message\":\"PIN salah\"}");
    }
  });
  server.addHandler(loginHandler);

  // REST API: Change PIN
  AsyncCallbackJsonWebHandler *changePinHandler = new AsyncCallbackJsonWebHandler("/api/auth/change-pin", [](AsyncWebServerRequest *request, JsonVariant &json) {
    JsonObject body = json.as<JsonObject>();
    const char* oldPin = body["old_pin"];
    const char* newPin = body["new_pin"];

    if (oldPin && strcmp(oldPin, adminPin.c_str()) == 0 && newPin && strlen(newPin) >= 4) {
      adminPin = String(newPin);

      // Simpan perubahan PIN ke schedule.json
      if (LittleFS.exists("/schedule.json")) {
        File f = LittleFS.open("/schedule.json", "r");
        JsonDocument doc;
        deserializeJson(doc, f);
        f.close();

        doc["settings"]["admin_pin"] = adminPin;

        File fWrite = LittleFS.open("/schedule.json", "w");
        serializeJson(doc, fWrite);
        fWrite.close();
      }

      request->send(200, "application/json", "{\"success\":true}");
    } else {
      request->send(400, "application/json", "{\"success\":false,\"message\":\"PIN lama tidak cocok atau PIN baru kurang dari 4 digit\"}");
    }
  });
  server.addHandler(changePinHandler);

  // REST API: Save Full Schedule / Settings
  AsyncCallbackJsonWebHandler *saveScheduleHandler = new AsyncCallbackJsonWebHandler("/api/schedule/save", [](AsyncWebServerRequest *request, JsonVariant &json) {
    JsonObject body = json.as<JsonObject>();

    File f = LittleFS.open("/schedule.json", "w");
    if (!f) {
      request->send(500, "application/json", "{\"success\":false,\"message\":\"Gagal membuka LittleFS\"}");
      return;
    }
    serializeJson(body, f);
    f.close();

    loadSettings();
    request->send(200, "application/json", "{\"success\":true}");
  });
  server.addHandler(saveScheduleHandler);

  // REST API: Save Track Customizer
  AsyncCallbackJsonWebHandler *saveTracksHandler = new AsyncCallbackJsonWebHandler("/api/tracks/save", [](AsyncWebServerRequest *request, JsonVariant &json) {
    JsonArray tracks = json.as<JsonArray>();

    if (LittleFS.exists("/schedule.json")) {
      File f = LittleFS.open("/schedule.json", "r");
      JsonDocument doc;
      deserializeJson(doc, f);
      f.close();

      doc["audio_tracks"] = tracks;

      File fWrite = LittleFS.open("/schedule.json", "w");
      serializeJson(doc, fWrite);
      fWrite.close();
      request->send(200, "application/json", "{\"success\":true}");
    } else {
      request->send(500, "application/json", "{\"success\":false}");
    }
  });
  server.addHandler(saveTracksHandler);
}
