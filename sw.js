var cacheName = '0.3.4';
var cacheFiles = [
    '/js/jquery.min.js',
    '/css/video-js.min.css',
    '/js/video-7.8.4.min.js',
    '/css/summernote-lite.min.css',
    '/js/summernote-lite.min.js',
    '/js/lang/summernote-ko-KR.js',
    '/js/menu_bar.js',
    '/resource/font/minecraftia-webfont.woff',
];
self.addEventListener('install', (event) => {
    event.waitUntil(
    	// 캐쉬할 페이지들을 전부 캐쉬합니다.
        caches.open(cacheName).then((cache) => cache.addAll(cacheFiles))
    );
});
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') { // GET 요청만 캐싱 지원 처리
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
                    .then(cache => {return cache;}) // 네트워크 요청 실패시 캐싱된 요청으로 응답.
            })
    );
});