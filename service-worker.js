//service-worker.js
self.addEventListener('install',function(e){
    console.log('[ServiceWorker] Install');
});

self.addEventListener('active',function(e){
    console.log('[ServiceWorker] Active');
});

//念仏
self.addEventListener('fetch',function(event){});