// Default data cadangan untuk preview offline / Live Server
const defaultFallbackData = {
  "active_preset": "reguler",
  "presets": {
    "reguler": {
      "name": "Jadwal Reguler (Senin - Kamis)",
      "schedules": [
        { "id": 1, "days": [1, 2, 3, 4], "time": "07:00", "track": 1, "label": "Bel Masuk Kelas" },
        { "id": 2, "days": [1, 2, 3, 4], "time": "09:40", "track": 2, "label": "Istirahat Pertama" },
        { "id": 3, "days": [1, 2, 3, 4], "time": "10:00", "track": 3, "label": "Masuk Setelah Istirahat" },
        { "id": 4, "days": [1, 2, 3, 4], "time": "11:45", "track": 5, "label": "Istirahat Ishoma" },
        { "id": 5, "days": [1, 2, 3, 4], "time": "12:30", "track": 3, "label": "Masuk Siang" },
        { "id": 6, "days": [1, 2, 3, 4], "time": "15:00", "track": 6, "label": "Bel Pulang Sekolah" }
      ]
    },
    "jumat": {
      "name": "Jadwal Khusus Hari Jumat",
      "schedules": [
        { "id": 1, "days": [5], "time": "07:00", "track": 1, "label": "Bel Masuk Kelas" },
        { "id": 2, "days": [5], "time": "11:15", "track": 6, "label": "Bel Pulang Jumat" }
      ]
    },
    "ujian": {
      "name": "Jadwal Penilaian / Ujian (PTS/PAS)",
      "schedules": []
    }
  },
  "audio_tracks": [
    { "track": 1, "name": "0001.mp3", "title": "Bel Masuk Kelas" },
    { "track": 2, "name": "0002.mp3", "title": "Bel Istirahat Pertama" },
    { "track": 3, "name": "0003.mp3", "title": "Bel Masuk Setelah Istirahat" },
    { "track": 4, "name": "0004.mp3", "title": "Bel Pergantian Jam Pelajaran" },
    { "track": 5, "name": "0005.mp3", "title": "Bel Istirahat Ishoma" },
    { "track": 6, "name": "0006.mp3", "title": "Bel Pulang Sekolah" },
    { "track": 7, "name": "0007.mp3", "title": "Lagu Indonesia Raya / Upacara" },
    { "track": 8, "name": "0008.mp3", "title": "Nada Panggilan Darurat" }
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
  // Cek apakah ada data lokal tersimpan di browser
  const saved = localStorage.getItem('bell_schedule_local');
  if (saved) {
    try {
      currentData = JSON.parse(saved);
    } catch (e) {}
  }

  // Coba ambil dari server (mendukung path relatif ./schedule.json dan root /schedule.json)
  const paths = ['./schedule.json', '/schedule.json', 'schedule.json'];
  for (const p of paths) {
    try {
      const res = await fetch(p);
      if (res.ok) {
        currentData = await res.json();
        localStorage.setItem('bell_schedule_local', JSON.stringify(currentData));
        return currentData;
      }
    } catch (err) {
      // Lanjut ke path berikutnya
    }
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

async function triggerBell(trackId) {
  try {
    const res = await fetch(`/api/trigger?track=${trackId}`, { method: 'POST' });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Mode offline / Live Server
  }
  // Simulasi sukses jika di localhost / Live Server
  if (location.hostname === '127.0.0.1' || location.hostname === 'localhost') {
    alert(`[Simulasi Audio] Memutar Track #${trackId} (Relay ON -> Audio 15 dtk -> Relay OFF)`);
    return { success: true };
  }
  alert('Gagal menghubungi ESP32');
  return { success: false };
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
    // Mode offline / Live Server
  }

  // Validasi fallback terhadap PIN di schedule.json
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
}
