import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();
const params = new URLSearchParams(location.search);
const lessonId = params.get("lesson");

onAuthStateChanged(auth, async (user) => {
  if (!user || !lessonId) return location.href = "index.html";
  document.getElementById("user-display").textContent = `Logged in as ${user.email}`;

  // Update last viewed lesson
  await updateDoc(doc(db, "users", user.uid), { lastViewed: lessonId });

  // Load lesson content
  const res = await fetch("data/lessons.json");
  const lessons = await res.json();
  const lesson = lessons[lessonId];

  if (!lesson) {
    document.getElementById("lesson-title").textContent = "Lesson Not Found";
    return;
  }

  document.getElementById("lesson-title").textContent = lesson.title;
  document.getElementById("lesson-content").innerHTML = injectGlossary(lesson.content);

  // Quiz
  const quizRes = await fetch("data/quiz.json");
  const quizData = await quizRes.json();
  showQuiz(quizData[lessonId]);

  showNavigation(Object.keys(lessons));
  setupMarkComplete(user.uid);
});

function injectGlossary(html) {
  return html.replace(/\b(\w+)\b/g, (word) => {
    return glossary[word.toLowerCase()]
      ? `<span class="glossary" title="${glossary[word.toLowerCase()]}">${word}</span>`
      : word;
  });
}

async function showQuiz(questions) {
  if (!questions) return;

  const quiz = document.getElementById("quiz");
  quiz.innerHTML = `<h3>Quiz</h3>`;
  questions.forEach((q, i) =>