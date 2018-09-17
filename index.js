function initialseStatus(){
    if(!('showNotification' in ServiceWorkerRegistration.prototype)){
        console.log('プッシュ通知が対応されておりません');
        return;
    }
    if(Notification.permission === 'denied'){
        console.log('通知をブロックしております');
        return;
    }
    if(!('PushManager' in window)){
        console.log('プッシュ通知が対応されておりません');
        return;
    }
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
        serviceWorkerRegistration.pushManager.getSubscription().then(
            function(subscription){
                pushEnableButton.disabled = false;
                pushDisableButton.disabled = false;
                
                pushEnableButton.classList.add('non-active');
                pushEnableButton.disabled = false;
                
                pushDisableButton.classList.remove('non-active');
                pushDisablebutton.disabled = true;
                
                if(!subscription){
                    return;
                }
                
                //取得したsubscriptionをサーバなどで保存っせる処理
                sendSubscriptionToServer(subscription);
                
                pushEnableButton.classList.remove('non-active');
                pushEnableButton.disabled = true;
                
                pushDisableButton.classList.add('non-active');
                pushDisableButton.disabled = false;
            }
       )
        .catch(function(err){console.warn('Error during getSubscription',err);});
    });
}

if('serviceWorker' in navigator && (window.location.protocol === 'https:' || isLocalhost)
    ){
        navigator.serviceWorker.register('serviceWorker.js',{scope:'/'}).then(
            function(registration){
                if(typeof registration.update == 'function'){
                    registration.update();
                }
                initialseStatus();
            }
        )
        .catch(function(error){
            console.error('Service Worker registration failed:',error);
        });
    }

pushEnableButton.addEventListener('click',function(){
    Notification.requestPermission(function(permission){
        if(permission !== 'denied'){
            subscribe();
        }
        else {
            alert('プッシュ通知に対応を有効にできません。ブラウザの設定を確認してください。');
        }
        
    });
});

function subscribe(){
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
       serviceWorkerRegistration.pushManager.subscribe({userVisbleOnly:true}).then(
           function(subscription){
               pushEnableButton.classList.remove('non-active');
               pushEnableButton.disabled = true;
               
               pushDisableButton.classList.add('non-active');
               pushDisableButton.disabled = false;
               
               return sendSubscriptionToServer(subscription);
           }
       ) 
        .catch(
            function(e){
                if(Notification.permission == 'denied'){
                    console.warn('permission for notification was denied');
                }
                else{
                    console.error('unable to subscribe to push',e);
                    window.alert(e);
                }
            }
       )
    });
}

function sendSubscribeToServer(subscription){
    console.log(subscription);
}

pushDisableButton.addEventListener('click',function(){
    unsubscribed();
});

function unsubscribed(){
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
        serviceWorkerRegistration.pushManager.getSubscription().then(
            function(pushSubscription){
                if(!pushSubscription){
                    pushEnableButton.classList.add('non-active');
                    pushEnableButton.disabled = false;
                    
                    pushDisableButton.classList.remove('non-active');
                    pushDisableButton.disabled = true;
                    
                    return;
                }
                
                sendSubscribeToServerForDelete(pushSubscription);
                
                pushSubscription.unsubscribe().then(function(successful){
                    pushEnableButton.classList.add('non-active');
                    pushEnableButton.disabled = false;
                    
                    pushDisableButton.classList.remove('non-active');
                    pushDisableButton.disabled = true;
                }).catch(function(e){
                    console.error('unsubscription error:',e);
                    
                    pushEnableButton.classList.add('non-active');
                    pushEnableButton.disabled = false;
                    
                    pushDisableButton.classList.remove('non-active');
                    pushDisableButton.disabled = true;
                });
            }
        )
        .catch(
            function(e){
                console.error('error thrown while unsubscribing frome push messaging.',e);
            }
        )
    });
}

function sendSubscribeToServerForDelete(subscription){
    console.log('sending to server for delete:',subscription);
}












