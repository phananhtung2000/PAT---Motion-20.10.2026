/* PAT Motion - service worker. Chỉ cache tài nguyên tĩnh (app shell + thư viện bản đồ).
   Không đụng tới localStorage / IndexedDB, ô bản đồ, API tra độ cao, tìm đường: các request đó đi thẳng ra mạng. */
const PREFIX = 'pat-motion-cache-';
const CACHE_NAME = PREFIX + 'v1';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-512-maskable.png'];
const CDN = [
  'https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.js',
  'https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.css'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(async c => {
    await c.addAll(SHELL);
    // thư viện CDN: lỗi mạng thì bỏ qua, không làm hỏng việc cài service worker (app vẫn tự nạp lại thư viện khi có mạng)
    await Promise.all(CDN.map(u => fetch(new Request(u, { mode: 'cors' })).then(r => { if (r.ok) return c.put(u, r); }).catch(() => {})));
  }));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.filter(n => n.startsWith(PREFIX) && n !== CACHE_NAME).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isShell = url.origin === self.location.origin;
  const isCdn = CDN.indexOf(req.url) !== -1;
  if (!isShell && !isCdn) return;   // mọi request khác (ô bản đồ, API, dữ liệu…) không can thiệp
  e.respondWith(
    caches.open(CACHE_NAME).then(c =>
      c.match(req, { ignoreSearch: req.mode === 'navigate' }).then(hit => {
        if (hit) return hit;
        return fetch(req).catch(() =>
          req.mode === 'navigate' ? c.match('./index.html') : Response.error()
        );
      })
    )
  );
});
