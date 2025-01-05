// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "wsei-frontend-app-5d0fc.firebaseapp.com",
  projectId: "wsei-frontend-app-5d0fc",
  storageBucket: "wsei-frontend-app-5d0fc.firebasestorage.app",

  messagingSenderId: "513688451821",

  appId: "1:513688451821:web:e2909b04fb632873a0aae4",

  measurementId: "G-TF6L9P9TQY"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

//const analytics = getAnalytics(app);

export const auth = getAuth(app);

// Lazy load getAnalytics
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
      getAnalytics(app);
  });
}