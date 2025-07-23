// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB4U4bL4jvRPo61wr8hLmT4WGD83_oG3ho",
  authDomain: "gestion-garage-c5ea0.firebaseapp.com",
  projectId: "gestion-garage-c5ea0",
  storageBucket: "gestion-garage-c5ea0.appspot.com",
  messagingSenderId: "1047186365394",
  appId: "1:1047186365394:web:5566c1ee743323ae21860b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };