import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export let Config = {
  apiKey: "AIzaSyD0JVmPlMsEzOnNaZbG8z4yKZ2fnFsmElE",
  authDomain: "loca-bc18e.firebaseapp.com",
  projectId: "loca-bc18e",
  storageBucket: "loca-bc18e.appspot.com",
  messagingSenderId: "1044823003273",
  appId: "1:1044823003273:web:7e9b06fdbed1e14c1db658",
  measurementId: "G-HJB7RLGXQ0"
};
