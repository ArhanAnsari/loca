// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyD0JVmPlMsEzOnNaZbG8z4yKZ2fnFsmElE",
  authDomain: "loca-bc18e.firebaseapp.com",
  projectId: "loca-bc18e",
  storageBucket: "loca-bc18e.appspot.com",
  messagingSenderId: "1044823003273",
  appId: "1:1044823003273:web:7e9b06fdbed1e14c1db658",
  measurementId: "G-HJB7RLGXQ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {auth}