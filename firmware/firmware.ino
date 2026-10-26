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

// State Machine Non-Blocking untuk Play Bell (mencegah WDT crash pada ESP8266)
enum BellState { BELL_IDLE, BELL_PREROLL, BELL_PLAYING, BELL_POSTROLL };
BellState currentBellState = BELL_IDLE;
unsigned long bellStateTimer = 0;
int pendingTrackNumber = 1;

// Prototipe Fungsi
void initFileSystem();
void loadSettings();
void checkScheduledBell();
void triggerBellAsync(int trackNumber);
void updateBellStateMachine();
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
  // Update state-machine audio bel non-blocking
  updateBellStateMachine();

  if (millis() - lastTick >= 1000) {
    lastTick = millis();
    checkScheduledBell();
  }
}

void triggerBellAsync(int trackNumber) {
  if (currentBellState != BELL_IDLE) {
    Serial.println("[BELL] Bel sedang berbunyi, abaikan request trigger ganda.");
    return;
  }
  pendingTrackNumber = trackNumber;
  currentBellState = BELL_PREROLL;
  bellStateTimer = millis();

  Serial.printf("[AUDIO] Mengaktifkan Relay Pre-Roll (%d detik)...\n", relayPreRoll);
  digitalWrite(PIN_RELAY_POWER, HIGH);
  digitalWrite(PIN_RELAY_MUTE, HIGH);

#if defined(ESP8266)
  digitalWrite(PIN_LED, LOW); // LED ESP8266 ON
#else
  digitalWrite(PIN_LED, HIGH);
#endif
}

void updateBellStateMachine() {
  if (currentBellState == BELL_IDLE) return;

  unsigned long elapsed = millis() - bellStateTimer;

  switch (currentBellState) {
    case BELL_PREROLL:
      if (elapsed >= (unsigned long)(relayPreRoll * 1000)) {
        currentBellState = BELL_PLAYING;
        bellStateTimer = millis();

        if (dfFound) {
          Serial.printf("[AUDIO] Memutar Track #%d pada DFPlayer Mini...\n", pendingTrackNumber);
          dfplayer.play(pendingTrackNumber);
        } else {
          Serial.println("[SIMULASI] Audio bel diputar (DFPlayer offline).");
        }
      }
      break;

    case BELL_PLAYING:
      // Simulasi durasi putar audio 15 detik
      if (elapsed >= 15000) {
        currentBellState = BELL_POSTROLL;
        bellStateTimer = millis();
        Serial.println("[AUDIO] Mematikan Relay Mute (Post-Roll).");
        digitalWrite(PIN_RELAY_MUTE, LOW);
      }
      break;

    case BELL_POSTROLL:
      if (elapsed >= 1000) {
        currentBellState = BELL_IDLE;
        digitalWrite(PIN_RELAY_POWER, LOW);
#if defined(ESP8266)
        digitalWrite(PIN_LED, HIGH); // LED ESP8266 OFF
#else
        digitalWrite(PIN_LED, LOW);
#endif
        Serial.println("[AUDIO] Siklus bel tuntas, kembali ke IDLE.");
      }
      break;
  }
}

void initFileSystem() {
#if defined(ESP8266)
  if (!LittleFS.begin()) {
#else
  if (!LittleFS.begin(true)) {
#endif
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
        triggerBellAsync(trackId);
        break;
      }
    }
  }
}

void registerHttpRoutes() {
  // 1. Cek apakah file LittleFS tersedia, jika ada layani langsung
  server.serveStatic("/", LittleFS, "/").setDefaultFile("index.html");

  // 2. Fallback Root HTML Bawaan jika LittleFS belum di-upload
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    if (LittleFS.exists("/index.html")) {
      request->send(LittleFS, "/index.html", "text/html");
      return;
    }

    // Antarmuka responsif darurat langsung dari Flash Program
    String html = F("<!DOCTYPE html><html lang='id'><head><meta charset='UTF-8'>"
      "<meta name='viewport' content='width=device-width,initial-scale=1.0'>"
      "<title>Bel Sekolah Otomatis Mandiri</title>"
      "<style>"
      ":root{--primary:#1e3a8a;--accent:#2563eb;--bg:#f8fafc;--card:#ffffff;--text:#0f172a;}"
      "body{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);margin:0;padding:20px;}"
      ".container{max-width:600px;margin:0 auto;background:var(--card);border-radius:12px;padding:24px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);}"
      "h1{color:var(--primary);margin-top:0;font-size:22px;border-bottom:2px solid #e2e8f0;padding-bottom:12px;}"
      ".status-box{background:#f1f5f9;border-radius:8px;padding:12px 16px;margin-bottom:20px;font-size:14px;line-height:1.6;}"
      ".badge{display:inline-block;padding:3px 8px;border-radius:12px;font-size:12px;font-weight:600;margin-right:6px;}"
      ".badge-ok{background:#dcfce7;color:#166534;}"
      ".badge-warn{background:#fef9c3;color:#854d0e;}"
      ".grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-top:15px;}"
      "button{background:var(--accent);color:#fff;border:none;border-radius:8px;padding:12px 8px;font-size:13px;font-weight:600;cursor:pointer;transition:background 0.2s;}"
      "button:hover{background:var(--primary);}"
      ".btn-sync{background:#0d9488;margin-top:15px;width:100%;padding:12px;}"
      "#msg{margin-top:15px;padding:10px;border-radius:6px;font-size:13px;display:none;font-weight:600;}"
      "</style></head><body>"
      "<div class='container'>"
      "<h1>Bel Sekolah Mandiri (ESP8266)</h1>"
      "<div class='status-box' id='statBox'>Memuat telemetri...</div>"
      "<h3>Uji Pemicu Bel Manual:</h3>"
      "<div class='grid'>"
      "<button onclick='playTrack(1)'>Bel Masuk (01)</button>"
      "<button onclick='playTrack(2)'>Istirahat (02)</button>"
      "<button onclick='playTrack(3)'>Masuk Kelas (03)</button>"
      "<button onclick='playTrack(6)'>Bel Pulang (06)</button>"
      "</div>"
      "<button class='btn-sync' onclick='syncClock()'>Sinkronkan Jam Browser ke ESP</button>"
      "<div id='msg'></div>"
      "</div>"
      "<script>"
      "function loadStat(){"
      "fetch('/api/status').then(r=>r.json()).then(d=>{"
      "document.getElementById('statBox').innerHTML="
      "'<span class=\"badge badge-ok\">Wi-Fi Online</span> '+"
      "'<span class=\"badge '+(d.df_ok?'badge-ok':'badge-warn')+'\">DFPlayer: '+(d.df_ok?'Siap':'Offline')+'</span> '+"
      "'<span class=\"badge '+(d.rtc_ok?'badge-ok':'badge-warn')+'\">RTC: '+(d.rtc_ok?'Siap':'Belum Ada')+'</span>'+"
      "'<br>Preset Aktif: <b>'+d.active_preset+'</b> | Uptime: <b>'+d.uptime_sec+'s</b>';"
      "});}"
      "function playTrack(t){"
      "const m=document.getElementById('msg');m.style.display='block';m.style.background='#dbeafe';m.style.color='#1e40af';m.innerText='Mengirim perintah bel...';"
      "fetch('/api/trigger?track='+t).then(r=>r.json()).then(res=>{"
      "m.style.background='#dcfce7';m.style.color='#166534';m.innerText=res.message;"
      "loadStat();"
      "});}"
      "function syncClock(){"
      "const ep=Math.floor(Date.now()/1000);"
      "fetch('/api/time/sync?epoch='+ep,{method:'POST'}).then(r=>r.json()).then(d=>{"
      "alert(d.success?'Jam berhasil disinkronkan!':'Gagal sinkron jam (RTC offline).');"
      "});}"
      "loadStat();setInterval(loadStat,3000);"
      "</script></body></html>");

    request->send(200, "text/html", html);
  });

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

  // REST API: Manual Trigger (Mendukung GET dan POST agar bisa diuji via address bar browser)
  auto handleTrigger = [](AsyncWebServerRequest *request) {
    int track = 1;
    if (request->hasParam("track")) {
      track = request->getParam("track")->value().toInt();
    }
    // Eksekusi trigger bel secara non-blocking
    triggerBellAsync(track);

    request->send(200, "application/json", "{\"success\":true,\"message\":\"Bel sedang diputar\"}");
  };

  server.on("/api/trigger", HTTP_POST, handleTrigger);
  server.on("/api/trigger", HTTP_GET, handleTrigger);

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
