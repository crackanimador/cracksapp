// web/firebase-messaging-sw.js

// Usamos las librerías "compat" para que funcionen bien con FlutterFire Web.
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Configuración de tu proyecto Firebase (WEB)
// Usa los mismos valores que en firebase_options.dart (sección web).
firebase.initializeApp({
  apiKey: "AIzaSyA1i7wU9-3J80cfCsuVBJNqVQx5Yjr52wI",
  authDomain: "folkloric-pier-355411.firebaseapp.com",
  projectId: "folkloric-pier-355411",
  storageBucket: "folkloric-pier-355411.firebasestorage.app",
  messagingSenderId: "127447460824",
  appId: "1:127447460824:web:17d6b62a4d0c48e98d20ad"
});

// Inicializar Messaging en el Service Worker
const messaging = firebase.messaging();

// Manejar mensajes en SEGUNDO PLANO (cuando la pestaña está cerrada o en background)
messaging.onBackgroundMessage((payload) => {
  console.log('🔔 [firebase-messaging-sw.js] Mensaje en segundo plano:', payload);

  const notificationTitle = payload.notification?.title || 'Nuevo mensaje';
  const notificationOptions = {
    body: payload.notification?.body || 'Tienes un mensaje nuevo',
    icon: '/icons/Icon-192.png',
    badge: '/icons/Icon-192.png',
    data: payload.data || {}, // aquí puede venir chatId, etc.
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});