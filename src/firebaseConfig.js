// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBt1SlLrBaT0N4EvyeNp-FiAfcdMXIfW4Y",
  authDomain: "baokhang-bb500.firebaseapp.com",
  projectId: "baokhang-bb500",
  storageBucket: "baokhang-bb500.appspot.com",
  messagingSenderId: "727807488970",
  appId: "1:727807488970:web:0fbb71f8a431bbf9d9d533",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
