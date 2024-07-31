// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
import { Config } from "./utils";
import { getFirestore } from "firebase/firestore";
let firebaseConfig = Config;

// Initialize Firebase
const app = getApps.length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore();
const auth = getAuth(app)

export {db, auth}
