
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Replace these example values with your Firebase configuration.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const registration = document.getElementById("registration").value.trim().toUpperCase();
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  message.textContent = "Checking your account...";

  try {
    // Internal email is generated from the registration number.
    const internalEmail = registration.toLowerCase() + "@login.leibnizmathsphere.com";

    const credential = await signInWithEmailAndPassword(
      auth,
      internalEmail,
      password
    );

    const studentRef = doc(db, "students", credential.user.uid);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      await auth.signOut();
      message.textContent = "Student account not found.";
      return;
    }

    const student = studentSnap.data();

    if (student.active !== true ||
        student.registrationNumber.toUpperCase() !== registration) {
      await auth.signOut();
      message.textContent = "Your account is inactive or invalid.";
      return;
    }

    message.textContent = "Login successful! Welcome, " + student.name;

    // Dashboard routing will be added in the next step.

  } catch (error) {
    console.error(error);
    message.textContent = "Login failed. Check your registration number and password.";
  }
});

