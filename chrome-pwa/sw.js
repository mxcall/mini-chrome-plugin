// Service Worker 版本号
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `file-upload-pwa-${CACHE_VERSION}`;

// 需要缓存的静态资源
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker 安装中...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('缓存打开');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('静态资源已缓存');
        return self.skipWaiting(); // 强制激活新的 Service Worker
      })
      .catch((error) => {
        console.error('缓存失败:', error);
      })
  );
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker 激活中...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 删除旧版本缓存
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker 已激活');
      return self.clients.claim(); // 立即控制所有页面
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 只缓存同源的 GET 请求
  if (url.origin === location.origin && request.method === 'GET') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          // 缓存命中,返回缓存内容
          if (response) {
            console.log('从缓存返回:', request.url);
            return response;
          }
          
          // 缓存未命中,发起网络请求
          return fetch(request).then((response) => {
            // 检查是否是有效响应
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 克隆响应,一份返回给用户,一份存入缓存
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
            
            return response;
          });
        })
        .catch((error) => {
          console.error('请求失败:', error);
          // 可以返回一个离线页面
          return new Response('网络错误,请检查连接', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        })
    );
  } else {
    // 对于跨域请求或非 GET 请求,直接转发
    event.respondWith(fetch(request));
  }
});

// 监听消息
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-uploads') {
    console.log('后台同步上传任务');
    // 可以在这里处理离线时未完成的上传任务
  }
});

// 推送通知
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '新消息',
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [200, 100, 200]
  };
  
  event.waitUntil(
    self.registration.showNotification('文件上传助手', options)
  );
});

// 通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('./')
  );
});
