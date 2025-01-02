// Vérifier si le navigateur supporte les Notifications et le Service Worker
if ('Notification' in window && 'serviceWorker' in navigator) {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration: ServiceWorkerRegistration) => {
                    console.log('Service Worker enregistré:', registration);

                    // S'abonner aux notifications Push
                    subscribeToPushNotifications(registration);
                })
                .catch((error: Error) => {
                    console.error('Erreur d\'enregistrement du service worker:', error);
                });
        } else {
            console.log('Permission de notification refusée');
        }
    });
}
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker enregistré avec succès:', registration);
            })
            .catch((error) => {
                console.error('Erreur d\'enregistrement du Service Worker:', error);
            });
    });
}

// Fonction pour s'abonner aux notifications Push
function subscribeToPushNotifications(registration: ServiceWorkerRegistration) {
    const vapidPublicKey = 'VOTRE_CLE_PUBLIC_VAPID';
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
    })
    .then((subscription: PushSubscription) => {
        console.log('Abonnement réussi:', subscription);
        // Envoyer l'abonnement au serveur ici pour l'enregistrer
    })
    .catch((error: Error) => {
        console.error('Erreur lors de l\'abonnement aux notifications push:', error);
    });
}

// Fonction pour convertir la clé VAPID (en base64) en format Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
