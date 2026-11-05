const CACHE_NAME = 'bel-sekolah-cache-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './schedule.html',
  './audio.html',
  './settings.html',
  './style.css',
  './app.js',
  './schedule.json',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Hanya proses request GET yang berasal dari protokol http/https
  if (e.request.method !== 'GET' || !e.request.url.startsWith('http')) return;

  // Lewatkan panggilan API mikrokontroler agar tidak pernah macet di cache
  if (e.request.url.includes('/api/')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => {
      return fetch(e.request)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
          }
          return networkRes;
        })
        .catch(() => {
          if (cached) return cached;
          // Kembalikan Response kosong yang valid agar tidak melempar Uncaught TypeError
          return new Response('', { status: 408, statusText: 'Offline / Network Timeout' });
        });
    })
  );
});
