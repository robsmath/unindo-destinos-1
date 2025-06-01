const CACHE_NAME = 'unindo-destinos-v1.0.0';
const STATIC_CACHE_NAME = 'unindo-destinos-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'unindo-destinos-dynamic-v1.0.0';

// Recursos que nunca devem ser cacheados
const NO_CACHE_ROUTES = [
  '/viagens/cadastrarRoteiro',
  'cadastrarRoteiro'
];

// Função para verificar se a URL deve ser excluída do cache
function shouldSkipCache(url) {
  return NO_CACHE_ROUTES.some(route => url.includes(route));
}

// Recursos estáticos para cache
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/images/logo/unindo-destinos-logo.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Estratégias de cache
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Configuração de rotas e suas estratégias
const ROUTE_STRATEGIES = [
  {
    pattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cacheName: 'google-fonts'
  },
  {
    pattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: 'images'
  },
  {
    pattern: /\.(?:js|css)$/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cacheName: 'static-resources'
  },
  {
    pattern: /^https:\/\/api\./,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cacheName: 'api-cache'
  }
];

// Event listeners
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      self.skipWaiting()
    ])
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes('v1.0.0')) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { url, method } = request;

  // Só processar requests GET
  if (method !== 'GET') return;

  // Ignorar chrome-extension e outros protocolos
  if (!url.startsWith('http')) return;
  
  // Verificar se deve pular cache para rotas específicas
  if (shouldSkipCache(url)) {
    return; // Deixa a requisição passar normalmente sem cache
  }
  
  // Ignorar APIs externas de imagens para evitar interferência
  if (url.includes('unsplash.com') || 
      url.includes('images.unsplash.com')) {
    return; // Deixa a requisição passar normalmente
  }

  // Encontrar estratégia apropriada
  const routeStrategy = ROUTE_STRATEGIES.find(route => route.pattern.test(url));
  
  if (routeStrategy) {
    event.respondWith(handleRequest(request, routeStrategy));
  } else {
    // Estratégia padrão para páginas HTML
    event.respondWith(handlePageRequest(request));
  }
});

// Estratégia para páginas HTML
async function handlePageRequest(request) {
  try {
    // Tentar buscar da rede primeiro
    const networkResponse = await fetch(request);
    
    // Se sucesso, cache e retorna
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    // Tentar cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Se é uma navegação e não tem cache, mostrar página offline
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }
    
    // Para outros recursos, retornar erro
    return new Response('Resource not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Handler genérico para diferentes estratégias
async function handleRequest(request, routeStrategy) {
  const { strategy, cacheName } = routeStrategy;
  
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, cacheName);
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, cacheName);
    
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, cacheName);
    
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return fetch(request);
    
    case CACHE_STRATEGIES.CACHE_ONLY:
      return caches.match(request);
    
    default:
      return fetch(request);
  }
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache first failed for:', request.url);
    throw error;
  }
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network first failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Sempre tentar atualizar em background
  const networkResponsePromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch((error) => {
    console.log('[SW] Background update failed:', request.url);
  });
  
  // Retornar cache se disponível, senão aguardar rede
  return cachedResponse || networkResponsePromise;
}

// Background Sync para upload de dados quando voltar online
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implementar lógica de sincronização
  // Por exemplo, enviar dados salvos localmente quando voltar online
  console.log('[SW] Performing background sync...');
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização disponível!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver agora',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Unindo Destinos', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Utility function to clean up old caches
async function cleanupCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => !name.includes('v1.0.0'));
  
  return Promise.all(
    oldCaches.map(cacheName => caches.delete(cacheName))
  );
}

// Listener para mensagens do cliente para limpeza de cache específico
self.addEventListener('message', (event) => {
  const { data } = event;
  
  if (data && data.action === 'CLEAR_CACHE') {
    const { url } = data;
    
    // Limpar cache específico para URL
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.open(cacheName).then((cache) => {
            return cache.delete(url);
          });
        })
      );
    }).then(() => {
      console.log('[SW] Cache cleared for URL:', url);
      // Responder ao cliente que o cache foi limpo
      event.ports[0]?.postMessage({ success: true });
    }).catch((error) => {
      console.error('[SW] Error clearing cache:', error);
      event.ports[0]?.postMessage({ success: false, error });
    });
  }
  
  if (data && data.action === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] Service Worker loaded successfully');
