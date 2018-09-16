const cacheName = 'weatherPWA-step-6-1';
const filesToCache = [
    '/',
    '/index.html',
    '/scripts/app.js',
    '/styles/inline.css',
    '/images/clear.png',
    '/images/cloudy-scattered-showers.png',
    '/images/cloudy.png',
    '/images/fog.png',
    '/images/ic_add_white_24px.svg',
    '/images/ic_refresh_white_24px.svg',
    '/images/partly-cloudy.png',
    '/images/rain.png',
    '/images/scattered-showers.png',
    '/images/sleet.png',
    '/images/snow.png',
    '/images/thunderstorm.png',
    '/images/wind.png'
];

self.addEventListener('install', (e) => {
    console.log('[Service worker] Install');
    e.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                console.log('[Service worker] Caching app shell');
                return cache.addAll(filesToCache);
            })
    );
});

self.addEventListener('activate', (e) => {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys()
        .then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
  );
  return self.clients.claim(); //fixes a corner case in which the app wasn't returning the latest data
});

self.addEventListener('fetch', (e) => {
    console.log('[Service worker] Fetch', e.request.url);
    e.respondWith(
        // caches.match() evaluates the web request that triggered the fetch event, and checks to see if it's available in the cache
        caches.match(e.request)
            .then((response) => {
                // responds with the cached version, or uses fetch to get a copy from the network
                return response || fetch(e.request);
            })
    );
});
