// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlCeCIPPvklcOtWPT93QVJmdSuLxkX6FM",
  authDomain: "splitwisebysam.firebaseapp.com",
  projectId: "splitwisebysam",
  storageBucket: "splitwisebysam.appspot.com",
  messagingSenderId: "148799153136",
  appId: "1:148799153136:web:085930b52afd2380d6f335",
  measurementId: "G-3QZ8ZPKY1L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;