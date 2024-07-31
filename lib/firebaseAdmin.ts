import { initializeApp, getApps, App, getApp, cert} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import {getFirestore} from "firebase-admin/firestore"


const serviceKey = require('@/firebaseAdmin.json');

let app: App


if(getApps().length === 0){
    app = initializeApp({
        credential: cert(serviceKey)
    })
} else{
    app = getApp();
}

const adminAuth = getAuth(app)
const admindb = getFirestore(app)

export {app as adminApp, admindb, adminAuth}