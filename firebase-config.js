import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TODO: Replace the following with your app's Firebase project configuration
// 1. Go to Firebase Console (console.firebase.google.com)
// 2. Create a new project or select an existing one
// 3. Add a Web App to the project
// 4. Copy the config object below
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app, db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized (Check config if errors occur)");
} catch (error) {
    console.error("Firebase initialization error:", error);
}

export { db, collection, addDoc, serverTimestamp };
