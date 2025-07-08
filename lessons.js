import { getAuth, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const auth = getAuth();
const lessonGrid = document.getElementById("lesson-grid");

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "index.html";
  document.getElementById("user-display").textContent = `Welcome, ${user.email}`;

  const res = await fetch("data/lessons.json");
  const lessons = await res.json();

  Object.entries(lessons).forEach(([id, data]) => {
    const card = document.createElement("article");
    card.className = "lesson-card";
    card.innerHTML = `
      <h2>${data.title}</h2>
      <p>${data.summary}</p>
      <a href="lesson.html?lesson=${id}">Start Lesson</a>
    `;
    lessonGrid.appendChild(card);
  });
});
