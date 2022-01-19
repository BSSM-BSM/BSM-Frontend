const cacheName = '1.2.0.24';
const cacheFiles = [
    '/',
    '/meal',
    '/timetable',
    '/meister',
    '/board/board',
    '/board/anonymous',
    '/board/notice',
    '/js/common.js',
    '/js/account.js',
    '/js/error_code.js',
    '/js/alert.js',
    '/js/etc/meal.js',
    '/js/etc/meister.js',
    '/js/etc/board/board.js',
    '/js/etc/board/post.js',
    '/css/style.css',
    '/css/etc/board.css',
    '/css/etc/index.css',
    '/css/etc/meal.css',
    '/css/etc/meister.css',
    '/css/etc/memberinfo.css',
    '/css/etc/timetable.css',
];
const libCacheName = 'lib-1.2.0.2';
const libCacheFiles = [
    '/js/lib/jquery.min.js',
    '/js/lib/axios.js',
    '/js/lib/summernote-lite.min.js',
    '/js/lib/lang/summernote-ko-KR.js',
    '/js/lib/vue.js',
    '/css/lib/summernote-lite.min.css',
    '/css/lib/font/summernote.woff',
    '/css/lib/font/summernote.woff2',
    '/css/lib/font/summernote.ttf'
];
const imgCacheName = 'img-1.2.0.1';
const imgCacheFiles = [
    '/favicon.ico',
    '/icons/logo.png',
    '/resource/common/images/x.svg',
    '/resource/common/images/theme.svg',
    '/resource/common/images/download.png',
    '/resource/index/images/main.webp',
    '/resource/index/images/main2.webp',
    '/resource/member/profile_images/profile_default.png'
];
const allCacheFiles = [
    ...cacheFiles,
    ...libCacheFiles,
    ...imgCacheFiles
]
self.addEventListener('install', (event) => {
    event.waitUntil(
        // 캐시할 파일들 캐시
        caches.open(cacheName).then((cache) => cache.addAll(cacheFiles)),
        caches.open(libCacheName).then((cache) => cache.addAll(libCacheFiles)),
        caches.open(imgCacheName).then((cache) => cache.addAll(imgCacheFiles))
    );
    self.skipWaiting();
});
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => {
                    return key != cacheName && key != libCacheName && key != imgCacheName;
                }).map((key) => {
                    return caches.delete(key);
                })
            );
        })
    );
});
self.addEventListener('fetch', (event) => {
    if(event.request.method !== 'GET') { // GET 요청만 캐싱
        return;
    }
    if(allCacheFiles.indexOf(event.request.url.split('bssm.kro.kr')[1])==-1){ // 캐싱된 요청만
        return;
    }
    const fetchRequest = event.request.clone();
    event.respondWith(
        fetch(fetchRequest)
            .then((response) => {
                //caches.open(cacheName) // 네트워크 요청 성공시 해당 결과값 캐싱
                //      .then(cache => cache.put(event.request.url, response.clone()));
                return response;
            })
            .catch(() => {
                return caches.match(event.request.url)
                    .then(cache => {return cache;}) // 네트워크 요청 실패시 캐시 반환
            })
    );
});
self.addEventListener("push", event => { //푸시알림을 받았을 때
    const payload = JSON.parse(event.data.text());
    event.waitUntil(
        registration.showNotification(payload.title, {
            body:payload.body,
            data:{
                link:payload.link
            },
        })
    );
});
self.addEventListener("notificationclick", event => { //알림을 클릭할 때
    clients.openWindow(event.notification.data.link);
});