// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-1d2fd.firebaseapp.com",
  projectId: "mern-blog-1d2fd",
  storageBucket: "mern-blog-1d2fd.appspot.com",
  messagingSenderId: "167822871494",
  appId: "1:167822871494:web:7948bbffdd74f58a5600c7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
