const cacheName = '1.0.0';
let cacheFiles = [
    '/',
    '/meal',
    '/timetable',
    '/meister',
    '/board/board',
    '/board/anonymous',
    '/js/jquery.min.js',
    '/js/summernote-lite.min.js',
    '/js/lang/summernote-ko-KR.js',
    '/js/menu_bar.js',
    '/js/search.js',
    '/js/error_code.js',
    '/css/style.min.css',
    '/css/etc/board.css',
    '/css/etc/index.css',
    '/css/etc/meal.css',
    '/css/etc/meister.css',
    '/css/etc/memberinfo.css',
    '/css/etc/timetable.css',
    '/css/summernote-lite.min.css',
    '/icons/logo.png',
    '/resource/common/BG_images/BG_image_blur.webp',
    '/resource/index/images/main.webp',
    '/resource/member/profile_images/profile_default.png'
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