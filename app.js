
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Replace these values with your own Firebase project configuration.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginForm = document.getElementById("loginForm");
const registrationInput = document.getElementById("registration");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const registration = registrationInput.value.trim().toUpperCase();
  const password = passwordInput.value.trim();

  if (!registration || !password) {
    message.textContent = "Enter your registration number and password.";
    return;
  }

  message.textContent = "Checking your account...";

  try {
    const internalEmail =
      registration.toLowerCase() + "@login.leibnizmathsphere.com";

    const credential = await signInWithEmailAndPassword(
      auth,
      internalEmail,
      password
    );

    const studentRef = doc(db, "students", credential.user.uid);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      await signOut(auth);
      message.textContent = "Student profile not found. Contact the administrator.";
      return;
    }

    const student = studentSnap.data();

    if (
      student.active !== true ||
      typeof student.registrationNumber !== "string" ||
      student.registrationNumber.toUpperCase() !== registration
    ) {
      await signOut(auth);
      message.textContent = "Your account is inactive or invalid.";
      return;
    }

    message.textContent = "Welcome, " + student.name + "! Login successful.";

  } catch (error) {
    console.error("Firebase login error:", error.code, error.message);
    message.textContent = "Login error: " + (error.code || "unknown-error");
  }
});


