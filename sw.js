const CACHE_NAME = 'portaria-shell-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  // Cache only the PWA shell. The Apps Script application itself is always
  // fetched from its own origin so that google.script.run and Google services
  // continue working normally.
  if (new URL(request.url).origin === self.location.origin) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request).then(r => r || caches.match('./index.html')))
    );
  }
});
