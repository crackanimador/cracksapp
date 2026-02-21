// Firebase Service Worker para notificaciones en background
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// 🔥 REEMPLAZA CON TUS CREDENCIALES (las mismas que en index.html)
firebase.initializeApp({
  apiKey: "AIzaSyBgPt2RFwc2o6rgC2II-cwJ_0J-TyO0eLg",
  authDomain: "studio-979184038-173c2.firebaseapp.com",
  projectId: "studio-979184038-173c2",
  storageBucket: "studio-979184038-173c2.firebasestorage.app",
  messagingSenderId: "276076090787",
  appId: "1:276076090787:web:5c9f7ab3b441c9d0d93616"
});

const messaging = firebase.messaging();

// Manejar mensajes en background
messaging.onBackgroundMessage((payload) => {
  console.log('📩 Mensaje en background:', payload);

  const notificationTitle = payload.notification?.title || 'GhostChat';
  const notificationOptions = {
    body: payload.notification?.body || 'Nuevo mensaje',
    icon: '/icons/Icon-192.png',
    badge: '/icons/Icon-192.png',
    vibrate: [200, 100, 200],
    tag: payload.data?.chat_id || 'ghostchat',
    data: payload.data,
    actions: [
      { action: 'open', title: 'Abrir' },
      { action: 'close', title: 'Cerrar' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Manejar clic en notificación
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Clic en notificación:', event);
  
  event.notification.close();

  const chatId = event.notification.data?.chat_id;
  const urlToOpen = chatId ? `/?chat=${chatId}` : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Si hay una ventana abierta, enfocarla
        for (const client of windowClients) {
          if ('focus' in client) {
            return client.focus();
          }
        }
        // Si no hay ventana, abrir una nueva
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Cache básico para PWA
const CACHE_NAME = 'ghostchat-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/icons/Icon-192.png',
  '/icons/Icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});