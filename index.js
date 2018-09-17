    var isLocalhost = Boolean(
        window.location.hostname === 'localhost' ||
        window.location.hostname === '[::1]'     ||
        window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
    );


if (
        'serviceWorker' in navigator &&
        (window.location.protocol === 'https:' || isLocalhost)
    ) {
        navigator.serviceWorker.register('serviceWorker.js')
            .then(
            function (registration) {
                if (typeof registration.update == 'function') {
                    registration.update();
                }
            })
            .catch(function (error) {
                           });
    }




function initialiseState() {
        if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
            console.warn('プッシュ通知が対応されておりません');
            return;
        }

        if (Notification.permission === 'denied') {
            console.warn('通知をブロックしております');
            return;
        }

        if (!('PushManager' in window)) {
            console.warn('プッシュ通知が対応されておりません');
            return;
        }

        navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
            serviceWorkerRegistration.pushManager.getSubscription().then(
                function (subscription) {

                    pushEnableButton.disabled  = false;
                    pushDisableButton.disabled = false;

                    pushEnableButton.classList.add("non-active");
                    pushEnableButton.disabled = false;

                    pushDisableButton.classList.remove("non-active");
                    pushDisableButton.disabled = true;

                    if (!subscription) {
                        return;
                    }

                    // 取得したsubscriptionをServerなどで保存させる処理
                    sendSubscriptionToServer(subscription);

                    pushEnableButton.classList.remove("non-active");
                    pushEnableButton.disabled = true;

                    pushDisableButton.classList.add("non-active");
                    pushDisableButton.disabled = false;

                })
                .catch(function(err){console.warn('Error during getSubscription()', err); });
        });
    }

if (
        'serviceWorker' in navigator &&
        (window.location.protocol === 'https:' || isLocalhost)
    ) {
        navigator.serviceWorker.register('serviceWorker.js', {scope: '/'}).then(
            function (registration) {
                if (typeof registration.update == 'function') {
                    registration.update();
                }

                initialiseState();
            })
            .catch(function (error) {
                console.error('Service Worker registration failed: ', error);
            });
    }

pushEnableButton.addEventListener('click', function(){
        Notification.requestPermission(function(permission) {
            if(permission !== 'denied') {
                subscribe();
            }
            else {
                alert ('プッシュ通知を有効にできません。ブラウザの設定を確認して下さい。');
            }
        });
    });

    function subscribe() {
        navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
            serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true }).then(
                function(subscription) {
                    pushEnableButton.classList.remove("non-active");
                    pushEnableButton.disabled = true;

                    pushDisableButton.classList.add("non-active");
                    pushDisableButton.disabled = false;

                    return sendSubscriptionToServer(subscription);
                }
            )
            .catch(
                function (e) {
                    if (Notification.permission == 'denied') {
                        console.warn('Permission for Notifications was denied');
                    }
                    else {
                        console.error('Unable to subscribe to push.', e);
                        window.alert(e);
                    }
                }
            )
        })
    }

    function sendSubscriptionToServer(subscription) {
        console.log(subscription);
    }

pushDisableButton.addEventListener('click', function(){
        unsubscribled();
    });

    function unsubscribled() {
        navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
            serviceWorkerRegistration.pushManager.getSubscription().then(
                function(pushSubscription) {
                    if ( ! pushSubscription ) {
                        pushEnableButton.classList.add("non-active");
                        pushEnableButton.disabled = false;

                        pushDisableButton.classList.remove("non-active");
                        pushDisableButton.disabled = true;

                        return;
                    }

                    sendSubscriptionToServerForDelete(pushSubscription);

                    pushSubscription.unsubscribe().then(function(successful) {
                        pushEnableButton.classList.add("non-active");
                        pushEnableButton.disabled = false;

                        pushDisableButton.classList.remove("non-active");
                        pushDisableButton.disabled = true;
                    }).catch(function(e) {
                        console.error('Unsubscription error: ', e);

                        pushEnableButton.classList.add("non-active");
                        pushEnableButton.disabled = false;

                        pushDisableButton.classList.remove("non-active");
                        pushDisableButton.disabled = true;
                    });
                }
            )
            .catch(
                function(e) {
                    console.error('Error thrown while unsubscribing from push messaging.', e);
                }
            )
        });
    }

    function sendSubscriptionToServerForDelete(subscrption) {
        console.log('sending to server for delete:', subscrption);
    }

