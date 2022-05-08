const cacheName = '1.4.1.4';
const cacheFiles = [
    '/',
    '/meal',
    '/timetable',
    '/meister',
    '/board/board',
    '/board/anonymous',
    '/board/notice',
    '/board/qna',
    '/board/software',
    '/board/embedded',
    '/emoticon',
    '/js/common.js',
    '/js/header.js',
    '/js/account.js',
    '/js/alert.js',
    '/js/etc/meal.js',
    '/js/etc/meister.js',
    '/js/etc/timetable.js',
    '/js/etc/userinfo.js',
    '/js/etc/board/load.js',
    '/js/etc/board/board.js',
    '/js/etc/board/post.js',
    '/js/etc/board/postWrite.js',
    '/js/etc/board/emoticon.js',
    '/css/style.css',
    '/css/etc/board.css',
    '/css/etc/index.css',
    '/css/etc/meal.css',
    '/css/etc/meister.css',
    '/css/etc/timetable.css',
    '/css/etc/user.css',
];
const libCacheName = 'lib-1.4.1.1';
const libCacheFiles = [
    '/lib/axios.js',
    '/lib/vue.js',
    '/lib/tinymce/tinymce.min.js',
];
const etcCacheName = 'etc-1.4.0.2';
const etcCacheFiles = [
    '/favicon.ico',
    '/icons/logo.png',
    '/resource/common/font/NotoSansKR-Regular.woff2',
    '/resource/common/images/x.svg',
    '/resource/common/images/theme.svg',
    '/resource/common/images/like.svg',
    '/resource/common/images/copy.svg',
    '/resource/common/images/emoticon.svg',
    '/resource/common/images/download.png',
    '/resource/index/images/main.webp',
    '/resource/index/images/main2.webp',
    '/resource/common/images/meal.svg',
    '/resource/common/images/person.svg',
    '/resource/common/images/timetable.svg',
    '/resource/common/images/people.svg',
    '/resource/common/images/bell.svg',
    '/resource/common/images/cloud.svg',
    '/resource/user/profile_images/profile_default.png',
    '/resource/user/profile_images/profile_-1.png'
];
const allCacheFiles = [
    ...cacheFiles,
    ...libCacheFiles,
    ...etcCacheName
]
self.addEventListener('install', (event) => {
    event.waitUntil(
        // 캐시할 파일들 캐시
        caches.open(cacheName).then((cache) => cache.addAll(cacheFiles)),
        caches.open(libCacheName).then((cache) => cache.addAll(libCacheFiles)),
        caches.open(etcCacheName).then((cache) => cache.addAll(etcCacheFiles))
    );
    self.skipWaiting();
});
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => {
                    return key != cacheName && key != libCacheName && key != etcCacheName;
                }).map((key) => {
                    return caches.delete(key);
                })
            );
        })
    );
});
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') { // GET 요청만 캐싱
        return;
    }
    if (allCacheFiles.indexOf(event.request.url.split('bssm.kro.kr')[1])==-1) { // 캐싱된 요청만
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