// Default data cadangan untuk preview offline / Live Server
const defaultFallbackData = {
  "active_preset": "reguler",
  "presets": {
    "reguler": {
      "name": "Jadwal Reguler (Senin - Kamis)",
      "schedules": [
        { "id": 1, "days": [1, 2, 3, 4], "time": "06:45", "track": 1, "label": "Siswa Datang / Bel Masuk" },
        { "id": 2, "days": [1, 2, 3, 4], "time": "07:00", "track": 2, "label": "Jam Pelajaran 01" },
        { "id": 3, "days": [1, 2, 3, 4], "time": "07:45", "track": 3, "label": "Jam Pelajaran 02" },
        { "id": 4, "days": [1, 2, 3, 4], "time": "08:30", "track": 4, "label": "Jam Pelajaran 03" },
        { "id": 5, "days": [1, 2, 3, 4], "time": "09:15", "track": 5, "label": "Jam Pelajaran 04" },
        { "id": 6, "days": [1, 2, 3, 4], "time": "10:00", "track": 6, "label": "Istirahat Pertama" },
        { "id": 7, "days": [1, 2, 3, 4], "time": "10:30", "track": 7, "label": "Jam Pelajaran 05" },
        { "id": 8, "days": [1, 2, 3, 4], "time": "11:15", "track": 8, "label": "Jam Pelajaran 06" },
        { "id": 9, "days": [1, 2, 3, 4], "time": "12:00", "track": 11, "label": "Istirahat Kedua / Dzuhur" },
        { "id": 10, "days": [1, 2, 3, 4], "time": "12:45", "track": 9, "label": "Jam Pelajaran 07" },
        { "id": 11, "days": [1, 2, 3, 4], "time": "13:30", "track": 10, "label": "Jam Pelajaran 08" },
        { "id": 12, "days": [1, 2, 3, 4], "time": "14:15", "track": 12, "label": "Jam Pelajaran 09" },
        { "id": 13, "days": [1, 2, 3, 4], "time": "15:00", "track": 16, "label": "Siswa Pulang / Akhir Pelajaran" }
      ]
    },
    "jumat": {
      "name": "Jadwal Khusus Hari Jumat",
      "schedules": [
        { "id": 1, "days": [5], "time": "06:45", "track": 1, "label": "Siswa Datang / Bel Masuk" },
        { "id": 2, "days": [5], "time": "07:00", "track": 2, "label": "Jam Pelajaran 01" },
        { "id": 3, "days": [5], "time": "07:45", "track": 3, "label": "Jam Pelajaran 02" },
        { "id": 4, "days": [5], "time": "08:30", "track": 4, "label": "Jam Pelajaran 03" },
        { "id": 5, "days": [5], "time": "09:15", "track": 5, "label": "Jam Pelajaran 04" },
        { "id": 6, "days": [5], "time": "09:45", "track": 6, "label": "Istirahat Pertama" },
        { "id": 7, "days": [5], "time": "10:15", "track": 7, "label": "Jam Pelajaran 05" },
        { "id": 8, "days": [5], "time": "11:00", "track": 16, "label": "Siswa Pulang Jumat (Persiapan Sholat)" }
      ]
    },
    "ujian": {
      "name": "Jadwal Penilaian / Ujian (UNAS/PTS/PAS)",
      "schedules": [
        { "id": 1, "days": [1, 2, 3, 4, 5], "time": "07:15", "track": 17, "label": "Ujian: Masuk Ruang Ujian" },
        { "id": 2, "days": [1, 2, 3, 4, 5], "time": "07:20", "track": 18, "label": "Ujian: Mulai Dalam 10 Menit" },
        { "id": 3, "days": [1, 2, 3, 4, 5], "time": "07:30", "track": 19, "label": "Ujian: Mulai Ujian" },
        { "id": 4, "days": [1, 2, 3, 4, 5], "time": "09:20", "track": 20, "label": "Ujian: Selesai Dalam 10 Menit" },
        { "id": 5, "days": [1, 2, 3, 4, 5], "time": "09:30", "track": 21, "label": "Ujian: Selesai Ujian / Istirahat" }
      ]
    }
  },
  "audio_tracks": [
    { "track": 1, "name": "0001.mp3", "title": "Siswa Datang / Bel Masuk" },
    { "track": 2, "name": "0002.mp3", "title": "Jam Pelajaran 01" },
    { "track": 3, "name": "0003.mp3", "title": "Jam Pelajaran 02" },
    { "track": 4, "name": "0004.mp3", "title": "Jam Pelajaran 03" },
    { "track": 5, "name": "0005.mp3", "title": "Jam Pelajaran 04" },
    { "track": 6, "name": "0006.mp3", "title": "Istirahat Pertama" },
    { "track": 7, "name": "0007.mp3", "title": "Jam Pelajaran 05" },
    { "track": 8, "name": "0008.mp3", "title": "Jam Pelajaran 06" },
    { "track": 9, "name": "0009.mp3", "title": "Jam Pelajaran 07" },
    { "track": 10, "name": "0010.mp3", "title": "Jam Pelajaran 08" },
    { "track": 11, "name": "0011.mp3", "title": "Istirahat Kedua / Dzuhur" },
    { "track": 12, "name": "0012.mp3", "title": "Jam Pelajaran 09" },
    { "track": 13, "name": "0013.mp3", "title": "Jam Pelajaran 10" },
    { "track": 14, "name": "0014.mp3", "title": "Jam Pelajaran 11" },
    { "track": 15, "name": "0015.mp3", "title": "Jam Pelajaran 12" },
    { "track": 16, "name": "0016.mp3", "title": "Siswa Pulang / Akhir Pelajaran" },
    { "track": 17, "name": "0017.mp3", "title": "Ujian: Masuk Ruang Ujian" },
    { "track": 18, "name": "0018.mp3", "title": "Ujian: Mulai Dalam 10 Menit" },
    { "track": 19, "name": "0019.mp3", "title": "Ujian: Mulai Ujian" },
    { "track": 20, "name": "0020.mp3", "title": "Ujian: Selesai Dalam 10 Menit" },
    { "track": 21, "name": "0021.mp3", "title": "Ujian: Selesai Ujian" }
  ],
  "settings": {
    "admin_pin": "1234",
    "ntp_server": "pool.ntp.org",
    "timezone_offset_sec": 25200,
    "relay_pre_roll_sec": 2,
    "speaker_volume": 25
  }
};

async function fetchSchedule() {
  // Coba ambil dari server terlebih dahulu (selalu gunakan versi terbaru)
  const paths = ['./schedule.json', '/schedule.json', 'schedule.json'];
  for (const p of paths) {
    try {
      const res = await fetch(p + '?v=' + Date.now());
      if (res.ok) {
        currentData = await res.json();
        localStorage.setItem('bell_schedule_local', JSON.stringify(currentData));
        return currentData;
      }
    } catch (err) {
      // Lanjut ke path berikutnya
    }
  }

  // Cek apakah ada data lokal tersimpan di browser jika server offline
  const saved = localStorage.getItem('bell_schedule_local');
  if (saved) {
    try {
      currentData = JSON.parse(saved);
      return currentData;
    } catch (e) {}
  }

  // Jika diakses via file:// atau Live Server tanpa koneksi backend ESP32 aktif
  if (!currentData) {
    console.warn('[Mode Demo / Simulasi] Menggunakan data lokal default.');
    currentData = JSON.parse(JSON.stringify(defaultFallbackData));
  }
  return currentData;
}

async function fetchStatus() {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Gagal mengambil status');
    return await res.json();
  } catch (err) {
    console.error('Error fetchStatus:', err);
    return null;
  }
}

let mqttClient = null;
function initMqtt() {
  if (typeof Paho !== 'undefined' && !mqttClient) {
    try {
      const clientId = 'WebClient_' + Math.random().toString(16).substr(2, 8);
      const isHttps = location.protocol === 'https:';
      const brokerPort = isHttps ? 8884 : 8000;
      const useSsl = isHttps;

      mqttClient = new Paho.MQTT.Client('broker.hivemq.com', brokerPort, clientId);
      mqttClient.connect({
        useSSL: useSsl,
        timeout: 5,
        onSuccess: () => {
          console.log('[MQTT] Web Terhubung ke Broker Cloud HiveMQ!');
          const badgeWifi = document.getElementById('badgeWifi');
          if (badgeWifi) {
            badgeWifi.innerHTML = '<span class="badge-dot"></span>Simulasi Wokwi Terhubung!';
            badgeWifi.className = 'badge badge-success';
          }
        },
        onFailure: (err) => {
          console.warn('[MQTT] Gagal konek ke broker port ' + brokerPort + ':', err);
          // Fallback coba SSL jika port non-ssl gagal
          if (!useSsl) {
            mqttClient = new Paho.MQTT.Client('broker.hivemq.com', 8884, clientId);
            mqttClient.connect({
              useSSL: true,
              timeout: 5,
              onSuccess: () => {
                console.log('[MQTT] SSL Terhubung!');
                const badgeWifi = document.getElementById('badgeWifi');
                if (badgeWifi) {
                  badgeWifi.innerHTML = '<span class="badge-dot"></span>Simulasi Wokwi Terhubung!';
                  badgeWifi.className = 'badge badge-success';
                }
              }
            });
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
}
window.addEventListener('load', initMqtt);

async function triggerBell(trackId) {
  // 1. Coba kirim trigger ke ESP8266 fisik (192.168.4.1 atau IP saat ini) untuk aktifkan Relay Amplifier
  try {
    const espUrl = (location.hostname === '192.168.4.1') 
      ? `/api/trigger?track=${trackId}` 
      : `http://192.168.4.1/api/trigger?track=${trackId}`;
    
    fetch(espUrl, { method: 'GET', mode: 'no-cors' })
      .then(() => console.log('[ESP8266] Sinyal pemicu relay terkirim!'))
      .catch(() => console.log('[ESP8266] Offline / Tidak terhubung Wi-Fi ESP'));
  } catch (err) {}

  // 2. Kirim sinyal MQTT jika terhubung ke cloud/Wokwi
  if (mqttClient && mqttClient.isConnected()) {
    try {
      const message = new Paho.MQTT.Message(String(trackId));
      message.destinationName = 'belsekolah/trigger';
      mqttClient.send(message);
    } catch (e) {}
  }

  // 3. Putar suara audio MP3 asli langsung di speaker/soundcard Laptop atau Komputer
  const trackFile = `./audio/${String(trackId).padStart(4, '0')}.mp3`;
  const audioObj = new Audio(trackFile);
  audioObj.play()
    .then(() => console.log('[Audio] Memutar suara asli lokal laptop:', trackFile))
    .catch(e => {
      console.warn('Audio auto-play dicegat browser, mencoba fallback:', e);
    });

  return { success: true };
}

async function syncTimeWithBrowser() {
  const epochSec = Math.floor(Date.now() / 1000);
  try {
    const res = await fetch(`/api/time/sync?epoch=${epochSec}`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        alert('Jam RTC ESP32 berhasil disinkronkan dengan browser!');
        location.reload();
        return;
      }
    }
  } catch (err) {
    // Mode offline / Live Server
  }

  // Simulasi jika di localhost / Live Server
  if (location.hostname === '127.0.0.1' || location.hostname === 'localhost') {
    alert(`[Simulasi RTC] Waktu disinkronkan ke Epoch ${epochSec} (${new Date().toLocaleTimeString('id-ID')})`);
    return;
  }
  alert('Koneksi terputus saat sinkronisasi jam');
}

function verifyAdminSession() {
  return sessionStorage.getItem('bell_admin_auth') === 'true';
}

function setAdminSession(status) {
  if (status) {
    sessionStorage.setItem('bell_admin_auth', 'true');
  } else {
    sessionStorage.removeItem('bell_admin_auth');
  }
}

async function loginAdmin(pin) {
  // Jika sedang berjalan di Live Server / Localhost (bukan ESP32 asli)
  const isLocalServer = location.hostname === '127.0.0.1' || location.hostname === 'localhost' || location.protocol === 'file:';
  
  if (!isLocalServer) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAdminSession(true);
          return true;
        }
      }
    } catch (err) {
      // Mode offline / fallback
    }
  }

  // Validasi fallback terhadap PIN di schedule.json (default: 1234)
  const expectedPin = (currentData && currentData.settings && currentData.settings.admin_pin) || '1234';
  if (pin === expectedPin) {
    setAdminSession(true);
    return true;
  }
  return false;
}

function formatDayName(dayNum) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[dayNum] || 'Hari ' + dayNum;
}

// Background Scheduler di Browser (Mode Offline / Hybrid)
let lastBellMinute = -1;
let lastBellDay = -1;

function startLocalScheduler() {
  setInterval(async () => {
    if (!currentData) return;
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentSec = now.getSeconds();

    // Hanya evaluasi pada detik 0
    if (currentSec !== 0) return;
    if (currentMin === lastBellMinute && currentDay === lastBellDay) return;

    const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    const activeKey = currentData.active_preset || 'reguler';
    const preset = currentData.presets && currentData.presets[activeKey];
    if (!preset || !preset.schedules) return;

    for (const item of preset.schedules) {
      if (item.time === timeStr && item.days.includes(currentDay)) {
        lastBellMinute = currentMin;
        lastBellDay = currentDay;
        console.log(`[JADWAL COCOK] ${timeStr} - Memutar Track #${item.track}: ${item.label}`);
        await triggerBell(item.track);
        break;
      }
    }
  }, 1000);
}

function startClock(timeElementId, dateElementId) {
  function update() {
    const now = new Date();
    const timeEl = document.getElementById(timeElementId);
    const dateEl = document.getElementById(dateElementId);
    if (timeEl) {
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      timeEl.textContent = `${h}:${m}:${s}`;
    }
    if (dateEl) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dateEl.textContent = now.toLocaleDateString('id-ID', options);
    }
  }
  update();
  setInterval(update, 1000);
  startLocalScheduler();
}
