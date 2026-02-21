// Service Worker optimizado para móvil
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBgPt2RFwc2o6rgC2II-cwJ_0J-TyO0eLg",
    authDomain: "studio-979184038-173c2.firebaseapp.com",
    projectId: "studio-979184038-173c2",
    storageBucket: "studio-979184038-173c2.firebasestorage.app",
    messagingSenderId: "276076090787",
    appId: "1:276076090787:web:5c9f7ab3b441c9d0d93616"
});

const messaging = firebase.messaging();

// Background messages
messaging.onBackgroundMessage((payload) => {
    console.log('📩 Background:', payload);
    
    const notificationTitle = payload.notification?.title || 'GhostChat';
    const notificationOptions = {
        body: payload.notification?.body || 'Nuevo mensaje',
        icon: '/icons/Icon-192.png',
        badge: '/icons/Icon-192.png',
        vibrate: [200, 100, 200],
        tag: payload.data?.chat_id || 'ghostchat',
        data: payload.data,
        silent: false,
        requireInteraction: false
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Click en notificación
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const chatId = event.notification.data?.chat_id;
    const urlToOpen = chatId ? `/?chat=${chatId}` : '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clients) => {
                if (clients.length > 0) {
                    return clients[0].focus();
                }
                return self.clients.openWindow(urlToOpen);
            })
    );
});

// Cache mínimo para PWA (evitar problemas de memoria)
const CACHE_NAME = 'ghostchat-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.png',
    '/icons/Icon-192.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
        ).then(() => clients.claim())
    );
});

// Fetch strategy: network first, then cache
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('firebase') || event.request.url.includes('googleapis')) {
        // No cachear peticiones a Firebase
        event.respondWith(fetch(event.request));
        return;
    }
    
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Cachear solo respuestas exitosas
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});