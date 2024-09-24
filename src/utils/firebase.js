// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvdR1XQeucJ3tjJnxeKnDFzILOJdkcWjQ",
  authDomain: "event-management-f1eed.firebaseapp.com",
  projectId: "event-management-f1eed",
  storageBucket: "event-management-f1eed.appspot.com",
  messagingSenderId: "1044098540629",
  appId: "1:1044098540629:web:29bcaa917eeaf342f260dc",
  measurementId: "G-LV4WLX71ST"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider };
export { db };
