import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxx",
  authDomain: "miapp-vecinal.firebaseapp.com",
  projectId: "miapp-vecinal",
  storageBucket: "miapp-vecinal.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdefg12345"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
