// sw.js - Service Worker para cache otimizado
const CACHE_NAME = 'erondicorretor-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/javascript/main.js',
  '/images/imagens-principais/img-hero-erondi.jpg',
  '/images/favicon_io/favicon.ico',
  '/images/imagens-principais/img-logo-header.png'
  // Adicione aqui mais imagens importantes se quiser
];

// Instalar o Service Worker e criar o cache
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache criado com sucesso');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requisições e servir do cache quando possível
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Se encontrou no cache, retorna
        if (response) {
          return response;
        }
        
        // Se não encontrou, busca na internet e salva no cache
        return fetch(event.request)
          .then(function(response) {
            // Só cacheia se a resposta for válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta para salvar no cache
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

// Limpar caches antigos quando atualizar
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});