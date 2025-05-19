// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxLejAKJSguUma0j4ObGjNCCcTVpo0rls",
  authDomain: "job-search-db-32e0b.firebaseapp.com",
  projectId: "job-search-db-32e0b",
  storageBucket: "job-search-db-32e0b.firebasestorage.app",
  messagingSenderId: "388897369769",
  appId: "1:388897369769:web:10d323df5a300f047ac3b8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const btn = document.getElementById("btn");

btn.addEventListener("click", (e) => {
  e.preventDefault();
  //users
  const fname = document.getElementById("fname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user.uid);

      const userData = {
        fullName: fname,
        email: email,
      };

      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          console.log("userdata succ", userData);

          window.location.href = "../login/login.html";
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/email-already-in-use") {
        alert(errorCode);
      }
      // ..
    });
});
