import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "learn-with-copilot-api.firebaseapp.com",
  projectId: "learn-with-copilot-api",
  storageBucket: "learn-with-copilot-api.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

onAuthStateChanged(auth, user => {
  const loginZone = document.getElementById("login");
  if (user) {
    loginZone.innerHTML = `
      <p>Welcome, ${user.displayName || user.email}</p>
      <a href="dashboard.html" class="cta-button">Dashboard</a>
      <button id="logout-btn">Log Out</button>
    `;
    document.getElementById("logout-btn").onclick = () => signOut(auth);
  } else {
    loginZone.innerHTML = `
      <button id="google-btn" class="cta-button">Sign in with Google</button>
      <form id="signup-form">
        <input type="email" id="email" placeholder="Email" required />
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
    `;
    document.getElementById("google-btn").onclick = () =>
      signInWithPopup(auth, provider).catch(err => alert(err.message));
    document.getElementById("signup-form").onsubmit = e => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const pw = document.getElementById("password").value;
      createUserWithEmailAndPassword(auth, email, pw).catch(err => alert(err.message));
    };
  }
});
