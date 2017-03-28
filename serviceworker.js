var CACHE_NAME = 'gih-cache-v5';
var CACHED_URLS = [
  // Our HTML
  'first.html',
  // Stylesheets and fonts
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'min-style.css',
    'styles.css',
    'https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&lang=en',
    
  // JavaScript
    'manifest.json',
    'material.js',
  // Images
    'appimages/paddy.jpg',
    'eventsimages/example-work01.jpg',
    'eventsimages/example-work07.jpg',
    'eventsimages/example-work02.jpg',
    'eventsimages/example-work03.jpg',
    'eventsimages/example-work04.jpg',
    'eventsimages/example-work08.jpg',
    'appimages/android-icon-36x36.png',
    'appimages/android-icon-48x48.png',
    'appimages/android-icon-72x72.png',
    'appimages/android-icon-96x96.png',
    'appimages/android-icon-144x144.png',
    'appimages/android-icon-192x192.png',
];

self.addEventListener('install', function(event) {
  // Cache everything in CACHED_URLS. Installation will fail if something fails to cache
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestURL = new URL(event.request.url);
  if (requestURL.pathname === 'first.html') {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match('first.html').then(function(cachedResponse) {
          var fetchPromise = fetch('first.html').then(function(networkResponse) {
            cache.put('first.html', networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
  } else if (
    CACHED_URLS.includes(requestURL.href) ||
    CACHED_URLS.includes(requestURL.pathname) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          return response || fetch(event.request);
        })
      })
    );
  }
});


self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName.startsWith('gih-cache') && CACHE_NAME !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});




