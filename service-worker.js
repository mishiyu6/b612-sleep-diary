const CACHE_NAME = 'sleep-diary-v3'; // ← 每次更新請改這個版本號
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  // 加入你用到的其他檔案，例如 CSS、JS、圖片等
];

// 安裝階段：快取必要檔案
self.addEventListener('install', event => {
  console.log('📦 Service Worker 安裝中...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // 立即啟用新版本
});

// 啟用階段：清除舊快取
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker 啟用');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('🧹 移除舊快取：', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // 立即接管所有頁面
});

// 攔截 fetch 請求：優先使用快取
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});