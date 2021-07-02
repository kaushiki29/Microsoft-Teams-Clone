importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
    apiKey: "AIzaSyAxgqdIWPQIEnXFyfT8zhwx_rDD7n3UdYM",
    authDomain: "ms-teams-clone-d0fdb.firebaseapp.com",
    projectId: "ms-teams-clone-d0fdb",
    storageBucket: "ms-teams-clone-d0fdb.appspot.com",
    messagingSenderId: "907149617598",
    appId: "1:907149617598:web:7f2dab761f5e4cc89431ef"
};

if (!firebase.apps.length) {
    try {
        firebase.initializeApp(firebaseConfig);
    } catch (e) {
        console.log("sw error", e)
    }
}
// firebase.initializeApp({messagingSenderId: "907149617598"});
const initMessaging = firebase.messaging();


// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
});