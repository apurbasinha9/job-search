import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

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

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      window.location.href = "../index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      console.log(errorCode);

      const errorMessage = error.message;
      console.log(errorMessage);
    });
});
