// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

// Authentication
import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// Realtime Database
import {
  getDatabase
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";

// Storage
import {
  getStorage
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";

// Firebase Config
const firebaseConfig = {

  apiKey: "AIzaSyACztDFFn-xL75-32PYd1vsyjHKBod-UzA",

  authDomain: "fantasy-adda-e3b72.firebaseapp.com",

  projectId: "fantasy-adda-e3b72",

  storageBucket: "fantasy-adda-e3b72.firebasestorage.app",

  messagingSenderId: "882657286194",

  appId: "1:882657286194:web:284e818359de2363f0442b"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);

const database = getDatabase(app);

const storage = getStorage(app);

export {
  auth,
  database,
  storage
};