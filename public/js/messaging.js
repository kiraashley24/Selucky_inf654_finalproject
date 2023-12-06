import {db, messaging} from "js/db";
import {doc, setDoc} from 'firebase/'
import {getToken, onMessage} from 'js/messaging'

const VAPID_KEY = "BDexwMDDoXIZvy7mFTjz84Wc_IRB64GH1ptheuBxrCXjadfGhRQJP-8mxE7iFvwahT403FI7LySfeL7AhW8OjvQ"
const FCM_TOKEN_COLLECTION = "fcmTokens";

async function requestNotificationsPermissions(uid) {
    console.log("Request notifications permission");
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
        await saveMessagingDeviceToken(uid);
    }else{
        console.log("no permission");
    }
}

async function saveMessagingDeviceToken(uid) {
    const msg = await messaging();
    const fcmToken = await getToken(msg, {vapidKey: VAPID_KEY});
    console.log('fcmToken:', fcmToken);

    if (fcmToken) {
        console.log('Received FCM device token', fcmToken);
        //save token to Firestore
        const tokenRef = doc(db, FCM_TOKEN_COLLECTION, uid);
        await setDoc(tokenRef, {fcmToken}); //overwrites document if already exists
    }else {
        //need permission
        requestNotificationsPermissions(uid);
    }
}