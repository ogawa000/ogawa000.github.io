//service-worker.js
self.addEventListener('install',function(e){
    console.log('[ServiceWorker] Install');
});

self.addEventListener('active',function(e){
    console.log('[ServiceWorker] Active');
});

//念仏
self.addEventListener('fetch',function(event){});

self.addEventListener('push',function(event){
    self.addEventListener('push',function(event){
        var title = 'メッセージが届きました';
        var body = 'メッセージ内容はこんにちわ';
        // var icon =
        var tag = 'simple-push-demo-notification-tag';
        
        event.waitUntil(
        
            self.registration.showNotification(title,{
                body:body,
                tag:tag
            })
        );
    });
});

self.addEventListener('notificationclick',function(event){
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({
            type:"window"
        })
        .then(function(clientList){
            for(var i =0;i<clientList.length;i++){
                var client = clientList[i];
                if(client.url == '/' && 'focus' in client)
                    return client.focus();
            }
            if(clients.openWindow){
                return clients.openWindow('/');
            }
        })
    );
});






