// lib/firebase.js
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyDFLF-CdkQHL6ZCl9lvm6eEHspHo5d240U",
  authDomain: "sharwa-data.firebaseapp.com",
  projectId: "sharwa-data",
  storageBucket: "sharwa-data.firebasestorage.app",
  messagingSenderId: "177377787551",
  appId: "1:177377787551:web:8610d5385e01eda9b5acaa",
  measurementId: "G-62FLNTTHJL"
};

export const app = initializeApp(firebaseConfig)