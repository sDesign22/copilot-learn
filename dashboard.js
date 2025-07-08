import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, async (user) => {
  if (!user) return window.location.href = "index.html";
  document.getElementById("user-info").textContent = `Logged in as ${user.email}`;

  const userRef = doc(db, "users", user.uid);
  let snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, { progress: [], lastViewed: null });
    snap = await getDoc(userRef);
  }

  const data = snap.data();
  renderProgress(data.progress || []);
  showLastViewed(data.lastViewed);
  setupSandbox();
});

function renderProgress(progress) {
  const lessons = ["html-css-basics", "js-functions", "node-express-api"];
  const list = document.getElementById("progress-list");
  list.innerHTML = "";

  lessons.forEach(id => {
    const complete = progress.includes(id);
    const li = document.createElement("li");
    li.innerHTML = `${format(id)}: ${complete ? "✅" : "⬜"}
      ${!complete ? `<button data-id="${id}">Complete</button>` : ""}`;
    list.appendChild(li);
  });

  document.querySelectorAll("button[data-id]").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute("data-id");
      const userRef = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(userRef);
      const updated = [...new Set([...(snap.data().progress || []), id])];
      await updateDoc(userRef, { progress: updated });
      renderProgress(updated);
    };
  });
}

function showLastViewed(lessonId) {
  const display = document.getElementById("resume-lesson");
  if (lessonId) {
    display.innerHTML = `Last visited: <a href="lesson.html?lesson=${lessonId}">${format(lessonId)}</a>`;
  } else {
    display.textContent = "No lessons viewed yet.";
  }
}

function format(id) {
  return {
    "html-css-basics": "HTML & CSS Basics",
    "js-functions": "JavaScript Functions",
    "node-express-api": "Node.js & Express"
  }[id] || id;
}

function setupSandbox() {
  document.getElementById("api-test").onclick = () => {
    try {
      const input = document.getElementById("api-input").value;
      const parsed = JSON.parse(input);
      document.getElementById("api-result").textContent =
        `✅ Valid JSON:\n${JSON.stringify(parsed, null, 2)}`;
    } catch (e) {
      document.getElementById("api-result").textContent = `❌ ${e.message}`;
    }
  };
}
