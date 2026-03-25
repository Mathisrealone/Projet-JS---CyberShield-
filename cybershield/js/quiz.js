import Quidata from "./quiz-data.js";

const TOTAL_QUESTIONS = 10;
const TIME_PER_QUESTION = 20; // seconds

// Points base by difficulty
const BASE_POINTS = {
  débutant: 100,
  intermédiaire: 200,
  avancé: 300,
};

// Helpers
function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function create(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") el.className = v;
    else if (k === "html") el.innerHTML = v;
    else el.setAttribute(k, v);
  });
  children.forEach((c) => {
    if (c != null)
      el.append(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return el;
}

// Quiz state
let questions = [];
let currentIndex = 0;
let score = 0;
let streak = 0;
let correctCount = 0;
let timerInterval = null;
let timeLeft = TIME_PER_QUESTION;
let perCategory = {}; // { difficulty: {asked, correct} }

// UI elements
const app = create("div", { class: "quiz-app", id: "quiz-app" });
document.body.prepend(app);

function buildUI() {
  app.innerHTML = "";

  const header = create("h2", {}, "Quiz CyberShield");
  const progressWrap = create("div", {
    class: "progress-wrap",
    id: "progress-wrap",
  });
  const progressBar = create("div", {
    id: "progress-bar",
    class: "progress-bar",
  });
  progressWrap.append(progressBar);

  const qBox = create("div", { id: "question-box", class: "question-box" });
  const qText = create("div", { id: "question-text", class: "question-text" });
  const options = create("div", { id: "options", class: "options" });

  const info = create("div", { class: "info-row" });
  const timerText = create(
    "span",
    { id: "timer-text" },
    `Temps: ${TIME_PER_QUESTION}s`,
  );
  const scoreText = create("span", { id: "score-text" }, `Score: 0`);
  const streakText = create("span", { id: "streak-text" }, `Streak: 0`);
  info.append(timerText, " | ", scoreText, " | ", streakText);

  const explanation = create("div", {
    id: "explanation",
    class: "explanation",
  });
  const nextBtn = create(
    "button",
    { id: "next-btn", class: "next-btn" },
    "Suivant",
  );
  nextBtn.style.display = "none";

  qBox.append(qText, options);
  app.append(header, progressWrap, info, qBox, explanation, nextBtn);

  nextBtn.addEventListener("click", () => {
    nextQuestion();
  });
}

function loadQuestions() {
  const shuffled = shuffle(Quidata);
  questions = shuffled.slice(0, Math.min(TOTAL_QUESTIONS, shuffled.length));
}

function startQuiz() {
  // reset state
  currentIndex = 0;
  score = 0;
  streak = 0;
  correctCount = 0;
  perCategory = {};
  buildUI();
  loadQuestions();
  renderQuestion();
}

function renderQuestion() {
  clearInterval(timerInterval);
  timeLeft = TIME_PER_QUESTION;
  const q = questions[currentIndex];
  const qText = document.getElementById("question-text");
  const optionsEl = document.getElementById("options");
  const explanation = document.getElementById("explanation");
  const nextBtn = document.getElementById("next-btn");

  explanation.innerHTML = "";
  nextBtn.style.display = "none";

  qText.textContent = `(${currentIndex + 1}/${questions.length}) ${q.question}`;
  optionsEl.innerHTML = "";

  const opts = shuffle(q.options);
  opts.forEach((opt) => {
    const b = create("button", { class: "opt-btn" }, opt);
    b.style.display = "block";
    b.style.margin = "8px 0";
    b.addEventListener("click", () => selectAnswer(opt, b));
    optionsEl.append(b);
  });

  startTimer();
  updateInfo();
}

function updateInfo() {
  const timerText = document.getElementById("timer-text");
  const scoreText = document.getElementById("score-text");
  const streakText = document.getElementById("streak-text");
  timerText.textContent = `Temps: ${Math.ceil(timeLeft)}s`;
  scoreText.textContent = `Score: ${score}`;
  streakText.textContent = `Streak: ${streak}`;
}

function startTimer() {
  const progressBar = document.getElementById("progress-bar");
  clearInterval(timerInterval);
  const total = TIME_PER_QUESTION;
  timerInterval = setInterval(() => {
    timeLeft -= 0.1;
    if (timeLeft < 0) timeLeft = 0;
    const pct = (timeLeft / total) * 100;
    if (progressBar) progressBar.style.width = pct + "%";
    updateInfo();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleAnswer(null); // timeout
    }
  }, 100);
}

function disableOptions() {
  document.querySelectorAll(".opt-btn").forEach((b) => (b.disabled = true));
}

function selectAnswer(selected, buttonEl) {
  if (!buttonEl) return;
  disableOptions();
  clearInterval(timerInterval);
  handleAnswer(selected);
}

function handleAnswer(selected) {
  const q = questions[currentIndex];
  const isCorrect = selected === q.answer;
  const difficulty = q.difficulty || "débutant";
  if (!perCategory[difficulty])
    perCategory[difficulty] = { asked: 0, correct: 0 };
  perCategory[difficulty].asked += 1;

  let earned = 0;
  if (isCorrect) {
    correctCount += 1;
    perCategory[difficulty].correct += 1;
    streak += 1;
    const base = BASE_POINTS[difficulty] || 100;
    const remainingRatio = Math.max(0, timeLeft / TIME_PER_QUESTION);
    const timeBonus = Math.round(base * 0.5 * remainingRatio); // up to +50%
    earned = base + timeBonus;
    if (streak >= 3) {
      earned = Math.round(earned * 1.5);
    }
    score += earned;
  } else {
    streak = 0;
  }

  // Show explanation
  const explanation = document.getElementById("explanation");
  explanation.innerHTML = "";
  const correctEl = create(
    "div",
    { class: "exp-correct" },
    `Réponse correcte : ${q.answer}`,
  );
  const resultEl = create(
    "div",
    { class: "exp-result" },
    isCorrect ? `Correct ! +${earned} pts` : `Incorrect. +0 pts`,
  );
  const autoExp = create(
    "div",
    { class: "exp-text" },
    `Explication : la bonne réponse est "${q.answer}".`,
  );
  explanation.append(resultEl, correctEl, autoExp);

  // reveal next button
  const nextBtn = document.getElementById("next-btn");
  nextBtn.style.display = "inline-block";
  updateInfo();
}

function nextQuestion() {
  currentIndex += 1;
  if (currentIndex >= questions.length) {
    endQuiz();
  } else {
    renderQuestion();
  }
}

function endQuiz() {
  clearInterval(timerInterval);
  // Persist score and build results
  const session = {
    score,
    date: new Date().toISOString(),
    correct: correctCount,
    total: questions.length,
    perCategory,
  };
  saveSession(session);
  showResults(session);
}

function loadSessions() {
  try {
    const raw = localStorage.getItem("cybershield_scores");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveSession(session) {
  const arr = loadSessions();
  arr.push(session);
  arr.sort((a, b) => b.score - a.score);
  const top5 = arr.slice(0, 5);
  localStorage.setItem("cybershield_scores", JSON.stringify(top5));
}

function computeRecommendations(perCategory) {
  // Find categories with lowest accuracy (asked >=1)
  const entries = Object.entries(perCategory).map(([cat, v]) => ({
    cat,
    asked: v.asked,
    correct: v.correct,
    acc: v.asked ? v.correct / v.asked : 0,
  }));
  entries.sort((a, b) => a.acc - b.acc);
  const recs = entries.filter((e) => e.asked > 0 && e.acc < 0.6).slice(0, 3);
  return recs.map((r) => ({
    category: r.cat,
    accuracy: Math.round(r.acc * 100),
  }));
}

function showResults(session) {
  app.innerHTML = "";
  const header = create("h2", {}, "Résultats");
  const scoreEl = create("div", {}, `Score: ${session.score}`);
  const correctEl = create(
    "div",
    {},
    `Réponses correctes: ${session.correct} / ${session.total}`,
  );

  const saved = loadSessions();
  const rank =
    saved.findIndex((s) => s.date === session.date) + 1 || saved.length;
  const rankEl = create(
    "div",
    {},
    `Classement de cette session: ${rank} / ${Math.max(saved.length, 1)}`,
  );

  const topTitle = create("h3", {}, "Top 5");
  const topList = create("ol");
  saved.forEach((s) => {
    const li = create(
      "li",
      {},
      `${s.score} pts — ${new Date(s.date).toLocaleString()} (${s.correct}/${s.total})`,
    );
    topList.append(li);
  });

  const recs = computeRecommendations(session.perCategory || {});
  const recTitle = create("h3", {}, "Recommandations");
  const recList = create("ul");
  if (recs.length === 0) {
    recList.append(
      create("li", {}, "Bon travail ! Aucun domaine critique à revoir."),
    );
  } else {
    recs.forEach((r) => {
      recList.append(
        create(
          "li",
          {},
          `${r.category} — précision ${r.accuracy}% : revoir les bases et exercices intermédiaires.`,
        ),
      );
    });
  }

  const retry = create("button", { id: "retry-btn" }, "Rejouer");
  retry.addEventListener("click", () => startQuiz());

  app.append(
    header,
    scoreEl,
    correctEl,
    rankEl,
    topTitle,
    topList,
    recTitle,
    recList,
    retry,
  );
}

// Basic styles for progress bar and layout (minimal inline)
const style = document.createElement("style");
style.textContent = `
	.progress-wrap{ width:100%; height:12px; background:#eee; margin:8px 0 }
	.progress-bar{ height:100%; width:100%; background:linear-gradient(90deg,#4caf50,#8bc34a); transition:width .1s linear }
	.question-box{ margin:12px 0 }
	#options button{ width:100%; padding:8px; }
	.explanation{ margin:12px 0; padding:8px; background:#f7f7f7 }
`;
document.head.appendChild(style);

// Initialize
buildUI();
startQuiz();
