// Default data cadangan untuk preview offline / Live Server
const defaultFallbackData = {
  "active_preset": "auto",
  "presets": {
    "senin": {
      "name": "Senin (Upacara Bendera)",
      "schedules": [
        { "id": 1, "days": [1], "time": "06:45", "track": 1, "label": "Siswa Datang / Persiapan Upacara" },
        { "id": 2, "days": [1], "time": "07:00", "track": 1, "label": "Upacara Bendera Dimulai" },
        { "id": 3, "days": [1], "time": "07:45", "track": 2, "label": "Jam Pelajaran 01 (Setelah Upacara)" },
        { "id": 4, "days": [1], "time": "08:30", "track": 3, "label": "Jam Pelajaran 02" },
        { "id": 5, "days": [1], "time": "09:15", "track": 4, "label": "Jam Pelajaran 03" },
        { "id": 6, "days": [1], "time": "10:00", "track": 6, "label": "Istirahat Pertama" },
        { "id": 7, "days": [1], "time": "10:30", "track": 7, "label": "Jam Pelajaran 04" },
        { "id": 8, "days": [1], "time": "11:15", "track": 8, "label": "Jam Pelajaran 05" },
        { "id": 9, "days": [1], "time": "12:00", "track": 11, "label": "Istirahat Sholat Dzuhur" },
        { "id": 10, "days": [1], "time": "12:45", "track": 9, "label": "Jam Pelajaran 06" },
        { "id": 11, "days": [1], "time": "13:30", "track": 10, "label": "Jam Pelajaran 07" },
        { "id": 12, "days": [1], "time": "14:15", "track": 12, "label": "Jam Pelajaran 08" },
        { "id": 13, "days": [1], "time": "15:00", "track": 16, "label": "Siswa Pulang Sekolah" }
      ]
    },
    "selasa_kamis": {
      "name": "Selasa - Kamis (KBM Reguler)",
      "schedules": [
        { "id": 1, "days": [2, 3, 4], "time": "06:45", "track": 1, "label": "Siswa Datang / Bel Masuk" },
        { "id": 2, "days": [2, 3, 4], "time": "07:00", "track": 2, "label": "Jam Pelajaran 01 (Literasi/KBM)" },
        { "id": 3, "days": [2, 3, 4], "time": "07:45", "track": 3, "label": "Jam Pelajaran 02" },
        { "id": 4, "days": [2, 3, 4], "time": "08:30", "track": 4, "label": "Jam Pelajaran 03" },
        { "id": 5, "days": [2, 3, 4], "time": "09:15", "track": 5, "label": "Jam Pelajaran 04" },
        { "id": 6, "days": [2, 3, 4], "time": "10:00", "track": 6, "label": "Istirahat Pertama" },
        { "id": 7, "days": [2, 3, 4], "time": "10:30", "track": 7, "label": "Jam Pelajaran 05" },
        { "id": 8, "days": [2, 3, 4], "time": "11:15", "track": 8, "label": "Jam Pelajaran 06" },
        { "id": 9, "days": [2, 3, 4], "time": "12:00", "track": 11, "label": "Istirahat Sholat Dzuhur" },
        { "id": 10, "days": [2, 3, 4], "time": "12:45", "track": 9, "label": "Jam Pelajaran 07" },
        { "id": 11, "days": [2, 3, 4], "time": "13:30", "track": 10, "label": "Jam Pelajaran 08" },
        { "id": 12, "days": [2, 3, 4], "time": "14:15", "track": 12, "label": "Jam Pelajaran 09" },
        { "id": 13, "days": [2, 3, 4], "time": "15:00", "track": 16, "label": "Siswa Pulang Sekolah" }
      ]
    },
    "jumat": {
      "name": "Jumat (KBM Pendek)",
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
      "name": "Masa Penilaian / Ujian",
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

// Variabel data global berstatus awal fallback agar aman saat mode file://
let currentData = JSON.parse(JSON.stringify(defaultFallbackData));

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

// Pemeriksaan Status Koneksi & Hardware Nyata (ESP8266, RTC, dan Internet)
async function updateNetworkStatus() {
  const badgeWifi = document.getElementById('badgeWifi');
  const badgeRtc = document.getElementById('badgeRtc');

  let espConnected = false;
  let rtcHardwareOk = false;

  // Cek koneksi nyata ke ESP8266 secara akurat (tanpa false-positive onerror)
  const isDirectEspHost = (location.hostname === '192.168.4.1' || location.hostname === 'bel-sekolah.local');

  if (isDirectEspHost) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch('/api/status', { signal: controller.signal, cache: 'no-store' });
      clearTimeout(timeoutId);
      if (res.ok) {
        const stat = await res.json();
        espConnected = true;
        rtcHardwareOk = !!stat.rtc_ok;
      }
    } catch (err) {
      espConnected = false;
    }
  } else if (location.hostname !== '127.0.0.1' && location.hostname !== 'localhost') {
    // Jika dibuka dari file:// lokal di PC/Laptop
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch('http://192.168.4.1/api/status', {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const stat = await res.json();
        espConnected = true;
        rtcHardwareOk = !!stat.rtc_ok;
      }
    } catch (err) {
      espConnected = false;
    }
  } else {
    // Mode pengujian lokal di Live Server (127.0.0.1)
    espConnected = false;
  }

  // Update Status Hardware RTC
  if (badgeRtc) {
    if (espConnected && rtcHardwareOk) {
      badgeRtc.textContent = 'RTC DS3231 Aktif';
      badgeRtc.className = 'status-item';
    } else if (espConnected && !rtcHardwareOk) {
      badgeRtc.textContent = 'RTC Belum Terpasang';
      badgeRtc.className = 'status-item';
    } else {
      badgeRtc.textContent = 'Jam Komputer / Laptop';
      badgeRtc.className = 'status-item';
    }
  }

  // Update Status Jaringan / Hardware
  if (badgeWifi) {
    if (espConnected) {
      badgeWifi.textContent = 'Koneksi: ESP8266 Terhubung';
      badgeWifi.className = 'status-item';
    } else if (navigator.onLine) {
      badgeWifi.textContent = 'Koneksi: ESP8266 Belum Terhubung';
      badgeWifi.className = 'status-item';
    } else {
      badgeWifi.textContent = 'Koneksi: Mode Offline';
      badgeWifi.className = 'status-item';
    }
  }
}

let mqttClient = null;
function initMqtt() {
  updateNetworkStatus();
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  setInterval(updateNetworkStatus, 5000);

  // MQTT opsional hanya jika diakses di simulator atau cloud
  if (typeof Paho !== 'undefined' && !mqttClient && location.hostname !== '192.168.4.1') {
    try {
      const clientId = 'WebClient_' + Math.random().toString(16).substr(2, 8);
      mqttClient = new Paho.MQTT.Client('broker.hivemq.com', 8884, clientId);
      mqttClient.connect({
        useSSL: true,
        timeout: 4,
        onSuccess: () => {
          console.log('[MQTT] Terhubung ke Broker Cloud');
          const badgeWifi = document.getElementById('badgeWifi');
          if (badgeWifi && badgeWifi.innerText.includes('Internet')) {
            badgeWifi.textContent = 'Koneksi: Internet & Cloud Siap';
          }
        },
        onFailure: () => {}
      });
    } catch (e) {}
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
        await AppDialog.alert('Sinkronisasi Sukses', 'Jam RTC perangkat berhasil disinkronkan dengan browser!', 'success');
        location.reload();
        return;
      }
    }
  } catch (err) {
    // Mode offline / Live Server
  }

  // Simulasi jika di localhost / Live Server
  if (location.hostname === '127.0.0.1' || location.hostname === 'localhost' || location.protocol === 'file:') {
    AppToast.show(`Waktu disinkronkan ke ${new Date().toLocaleTimeString('id-ID')}`, 'success');
    return;
  }
  AppToast.show('Koneksi terputus saat sinkronisasi jam', 'danger');
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

// Mendapatkan kunci preset aktif secara dinamis (mendukung mode auto-calendar)
function getResolvedPresetKey(data) {
  if (!data || !data.presets) return 'selasa_kamis';
  const setting = data.active_preset || 'auto';
  if (setting !== 'auto' && data.presets[setting]) {
    return setting; // Override terkunci ke preset tertentu
  }
  // Mode otomatis berdasarkan hari kalender
  const day = new Date().getDay(); // 0: Minggu, 1: Senin, 2: Selasa, ... 5: Jumat, 6: Sabtu
  if (day === 1 && data.presets['senin']) return 'senin';
  if (day === 5 && data.presets['jumat']) return 'jumat';
  if ((day === 2 || day === 3 || day === 4) && data.presets['selasa_kamis']) return 'selasa_kamis';
  
  // Jika hari Sabtu/Minggu atau fallback pertama
  if (data.presets['selasa_kamis']) return 'selasa_kamis';
  const keys = Object.keys(data.presets);
  return keys.length > 0 ? keys[0] : 'senin';
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
    const activeKey = getResolvedPresetKey(currentData);
    const preset = currentData.presets && currentData.presets[activeKey];
    if (!preset || !preset.schedules) return;

    for (const item of preset.schedules) {
      if (item.time === timeStr && item.days.includes(currentDay)) {
        lastBellMinute = currentMin;
        lastBellDay = currentDay;
        console.log(`[JADWAL COCOK] (${activeKey}) ${timeStr} - Memutar Track #${item.track}: ${item.label}`);
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

/* ==========================================================================
   Komponen Dialog Modal & Toast UI Kustom (Anti-Slop Modern UI)
   ========================================================================== */
const AppToast = {
  container: null,
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'app-toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(message, type = 'info', duration = 3500) {
    this.init();
    const toast = document.createElement('div');
    toast.className = `app-toast ${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'danger') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    } else if (type === 'warning') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }
};

const AppDialog = {
  createBackdrop() {
    let backdrop = document.getElementById('appDialogBackdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'appDialogBackdrop';
      backdrop.className = 'app-dialog-backdrop';
      document.body.appendChild(backdrop);
    }
    return backdrop;
  },

  alert(title, message, type = 'info') {
    return new Promise((resolve) => {
      const backdrop = this.createBackdrop();
      let iconColor = type;
      let iconSvg = '';
      if (type === 'success') {
        iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      } else if (type === 'danger') {
        iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
      } else if (type === 'warning') {
        iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
      } else {
        iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
      }

      backdrop.innerHTML = `
        <div class="app-dialog-card" role="dialog" aria-modal="true">
          <div class="app-dialog-header">
            <div class="app-dialog-icon ${iconColor}">${iconSvg}</div>
            <h3 class="app-dialog-title">${title}</h3>
          </div>
          <div class="app-dialog-body">${message.replace(/\n/g, '<br>')}</div>
          <div class="app-dialog-footer">
            <button class="btn btn-primary" id="appDialogOkBtn" style="min-width: 90px;">Tutup</button>
          </div>
        </div>
      `;

      requestAnimationFrame(() => backdrop.classList.add('active'));

      const okBtn = backdrop.querySelector('#appDialogOkBtn');
      okBtn.focus();
      okBtn.onclick = () => {
        backdrop.classList.remove('active');
        setTimeout(() => {
          backdrop.innerHTML = '';
          resolve(true);
        }, 200);
      };
    });
  },

  confirm(title, message, options = {}) {
    return new Promise((resolve) => {
      const backdrop = this.createBackdrop();
      const isDanger = options.danger || false;
      const confirmText = options.confirmText || 'Lanjutkan';
      const cancelText = options.cancelText || 'Batal';
      const iconClass = isDanger ? 'danger' : 'warning';
      
      const iconSvg = isDanger 
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';

      backdrop.innerHTML = `
        <div class="app-dialog-card" role="dialog" aria-modal="true">
          <div class="app-dialog-header">
            <div class="app-dialog-icon ${iconClass}">${iconSvg}</div>
            <h3 class="app-dialog-title">${title}</h3>
          </div>
          <div class="app-dialog-body">${message.replace(/\n/g, '<br>')}</div>
          <div class="app-dialog-footer">
            <button class="btn btn-secondary" id="appDialogCancelBtn">${cancelText}</button>
            <button class="btn ${isDanger ? 'btn-danger' : 'btn-primary'}" id="appDialogConfirmBtn">${confirmText}</button>
          </div>
        </div>
      `;

      requestAnimationFrame(() => backdrop.classList.add('active'));

      const confirmBtn = backdrop.querySelector('#appDialogConfirmBtn');
      const cancelBtn = backdrop.querySelector('#appDialogCancelBtn');
      confirmBtn.focus();

      const close = (result) => {
        backdrop.classList.remove('active');
        setTimeout(() => {
          backdrop.innerHTML = '';
          resolve(result);
        }, 200);
      };

      confirmBtn.onclick = () => close(true);
      cancelBtn.onclick = () => close(false);
    });
  },

  prompt(title, message, options = {}) {
    return new Promise((resolve) => {
      const backdrop = this.createBackdrop();
      const placeholder = options.placeholder || '';
      const confirmText = options.confirmText || 'Konfirmasi';
      const cancelText = options.cancelText || 'Batal';
      const isDanger = options.danger || false;

      backdrop.innerHTML = `
        <div class="app-dialog-card" role="dialog" aria-modal="true">
          <div class="app-dialog-header">
            <div class="app-dialog-icon ${isDanger ? 'danger' : 'warning'}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h3 class="app-dialog-title">${title}</h3>
          </div>
          <div class="app-dialog-body">
            <div>${message.replace(/\n/g, '<br>')}</div>
            <input type="text" class="app-dialog-input" id="appDialogPromptInput" placeholder="${placeholder}" autocomplete="off" />
          </div>
          <div class="app-dialog-footer">
            <button class="btn btn-secondary" id="appDialogCancelBtn">${cancelText}</button>
            <button class="btn ${isDanger ? 'btn-danger' : 'btn-primary'}" id="appDialogConfirmBtn">${confirmText}</button>
          </div>
        </div>
      `;

      requestAnimationFrame(() => backdrop.classList.add('active'));

      const input = backdrop.querySelector('#appDialogPromptInput');
      const confirmBtn = backdrop.querySelector('#appDialogConfirmBtn');
      const cancelBtn = backdrop.querySelector('#appDialogCancelBtn');

      setTimeout(() => input.focus(), 100);

      const close = (val) => {
        backdrop.classList.remove('active');
        setTimeout(() => {
          backdrop.innerHTML = '';
          resolve(val);
        }, 200);
      };

      confirmBtn.onclick = () => close(input.value);
      cancelBtn.onclick = () => close(null);

      input.onkeydown = (e) => {
        if (e.key === 'Enter') close(input.value);
        if (e.key === 'Escape') close(null);
      };
    });
  }
};

// Polyfill window.alert, window.confirm, window.prompt agar tidak pernah muncul dialog bawaan browser
window.nativeAlert = window.alert;
window.alert = (msg) => {
  AppToast.show(msg, 'info');
};

/* ==========================================================================
   Smart Next-Bell Detector (Komputasi Jadwal Bel Berikutnya)
   ========================================================================== */
function calculateNextBell(schedules) {
  if (!schedules || schedules.length === 0) return null;

  const now = new Date();
  const currentTotalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  let nextItem = null;
  let minDiff = Infinity;

  for (const item of schedules) {
    const parts = item.time.split(':');
    const itemSec = parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60;
    const diff = itemSec - currentTotalSeconds;

    if (diff > 0 && diff < minDiff) {
      minDiff = diff;
      nextItem = { ...item, diffSeconds: diff, targetSec: itemSec };
    }
  }

  return nextItem;
}

function formatCountdown(totalSec) {
  if (totalSec <= 0) return 'Sedang Berbunyi';
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  if (hours > 0) {
    return `${hours} jam ${minutes} menit lagi`;
  }
  if (minutes > 0) {
    return `${minutes} menit ${seconds} detik lagi`;
  }
  return `${seconds} detik lagi`;
}
