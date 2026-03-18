const CACHE = 'content-app-v1'
const ASSETS = ['/', '/index.html', '/static/js/main.chunk.js', '/static/css/main.chunk.css']

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  )
})

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  )
})