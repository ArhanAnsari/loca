import * as admin from "firebase-admin";
const serviceKey = require("@/firebaseAdmin.json");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceKey),
  });
}

export const adminAuth = admin.auth();
export const admindb = admin.firestore();
