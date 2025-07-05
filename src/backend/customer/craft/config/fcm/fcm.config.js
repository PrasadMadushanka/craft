const admin = require("firebase-admin");
const serviceAccount = require("./quickeats-shop-547a5-firebase-adminsdk-fbsvc-fbbcbafc05.json");

// Initialize Firebase Admin only once
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

/**
 * Send FCM notification to a specific device
 * @param {string} orderId - The order ID
 * @param {string} token - Device registration token
 * @returns {Promise<string>} Message ID
 */
exports.sendFcmNotification = async (orderId, token) => {
    if (!token) {
        console.error("Error: Missing FCM Token");

        return;
    }
    const message = {
        data: {
            orderId: orderId.toString(),
            type: "new_order",
            click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
        notification: {
            title: "New Order Received",
            body: "You have a new order to process!",
        },
        token: token,
        android: {
            priority: "high",
            notification: {
                sound: "default",
            },
        },
        apns: {
            payload: {
                aps: {
                    badge: 1,
                    sound: "default",
                },
            },
        },
    };

    const response = await admin.messaging().send(message);
    console.log(response);
};
