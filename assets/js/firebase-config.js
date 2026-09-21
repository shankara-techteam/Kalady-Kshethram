import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxlnfrzPSal_w7ivrpPkZfacytB3d78V4",
  authDomain: "shankara-janmabhoomi.firebaseapp.com",
  databaseURL: "https://shankara-janmabhoomi-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shankara-janmabhoomi",
  storageBucket: "shankara-janmabhoomi.firebasestorage.app",
  messagingSenderId: "985282762191",
  appId: "1:985282762191:web:21cdf729edd6637e16eeba",
  measurementId: "G-P31PYXCQ5N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db, collection, onSnapshot, addDoc, serverTimestamp, query, orderBy };
