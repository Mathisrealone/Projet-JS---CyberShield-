import Quidata from "./quiz-data.js";

const TOTAL_QUESTIONS = 10;
const TIME_PER_QUESTION = 20;

let questions = [];
let indexActuel = 0;
let score = 0;
let tempsRestant = TIME_PER_QUESTION;
let timerId = null;
let streak = 0;
let bonnesReponses = 0;
let parCategorie = {};

document.body.innerHTML = `
  <div id="quiz-app" style="max-width:700px;margin:20px auto;font-family:sans-serif">
    <h2>Quiz CyberShield</h2>
    <div id="start-panel" style="text-align:center;padding:24px 0;">
      <p>Le quiz ne démarre que lorsque vous êtes prêt.</p>
      <button id="start-btn" style="padding:10px 16px;font-size:16px;cursor:pointer;">Lancer le quiz</button>
    </div>

    <div id="quiz-panel" style="display:none;">
      <div id="info">Score: <span id="score-text">0</span> | Temps: <span id="timer-text">${TIME_PER_QUESTION}</span>s | Streak: <span id="streak-text">0</span></div>
      <div id="progress-wrap" style="background:#eee;height:12px;margin:8px 0"><div id="progress-bar" style="height:100%;width:100%;background:#4caf50"></div></div>
      <div id="question-area">
        <h3 id="question-text"></h3>
        <div id="options"></div>
      </div>
      <div id="explanation" style="margin-top:10px;color:#333"></div>
      <button id="next-btn" style="display:none;margin-top:10px">Suivant</button>
    </div>

    <div id="result-panel" style="display:none;"></div>
  </div>
`;

const startPanel = document.getElementById("start-panel");
const quizPanel = document.getElementById("quiz-panel");
const resultPanel = document.getElementById("result-panel");
const startBtn = document.getElementById("start-btn");
const questionTexte = document.getElementById("question-text");
const optionsDiv = document.getElementById("options");
const scoreAffichage = document.getElementById("score-text");
const timerAffichage = document.getElementById("timer-text");
const boutonSuivant = document.getElementById("next-btn");
const zoneExplication = document.getElementById("explanation");
const progressBar = document.getElementById("progress-bar");
const streakAffichage = document.getElementById("streak-text");

function melanger(tableau) {
	for (let i = tableau.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		let tmp = tableau[i];
		tableau[i] = tableau[j];
		tableau[j] = tmp;
	}
	return tableau;
}

function choisirQuestions() {
	let copie = Quidata.slice();
	melanger(copie);
	questions = copie.slice(0, Math.min(TOTAL_QUESTIONS, copie.length));
}

function demarrerQuiz() {
	indexActuel = 0;
	score = 0;
	tempsRestant = TIME_PER_QUESTION;
	streak = 0;
	bonnesReponses = 0;
	parCategorie = {};
	startPanel.style.display = "none";
	resultPanel.style.display = "none";
	quizPanel.style.display = "block";
	scoreAffichage.innerText = score;
	streakAffichage.innerText = streak;
	choisirQuestions();
	afficherQuestion();
}

function afficherQuestion() {
	clearInterval(timerId);
	zoneExplication.innerHTML = "";
	boutonSuivant.style.display = "none";
	optionsDiv.innerHTML = "";
	tempsRestant = TIME_PER_QUESTION;

	let q = questions[indexActuel];
	if (!q) return;

	questionTexte.innerText = indexActuel + 1 + ". " + q.question;

	if (!parCategorie[q.difficulty])
		parCategorie[q.difficulty] = { asked: 0, correct: 0 };
	parCategorie[q.difficulty].asked += 1;

	let reponses = melanger(q.options.slice());
	reponses.forEach((rep) => {
		let btn = document.createElement("button");
		btn.innerText = rep;
		btn.style.display = "block";
		btn.style.margin = "6px 0";
		btn.onclick = function () {
			choisirReponse(rep, q);
		};
		optionsDiv.appendChild(btn);
	});

	progressBar.style.width = "100%";
	startTimer();
}

function startTimer() {
	clearInterval(timerId);
	timerAffichage.innerText = tempsRestant;
	timerId = setInterval(() => {
		tempsRestant -= 1;
		if (tempsRestant < 0) tempsRestant = 0;
		timerAffichage.innerText = tempsRestant;
		let pct = (tempsRestant / TIME_PER_QUESTION) * 100;
		progressBar.style.width = pct + "%";
		if (tempsRestant === 0) {
			clearInterval(timerId);
			choisirReponse(null, questions[indexActuel]);
		}
	}, 1000);
}

function choisirReponse(choix, question) {
	clearInterval(timerId);
	let tous = document.querySelectorAll("#options button");
	tous.forEach((b) => (b.disabled = true));

	let correct = choix === question.answer;
	let pointsBase = 100;
	if (question.difficulty === "intermédiaire") pointsBase = 200;
	if (question.difficulty === "avancé") pointsBase = 300;

	let pointsGagnes = 0;
	if (correct) {
		bonnesReponses += 1;
		parCategorie[question.difficulty].correct += 1;
		streak += 1;
		let ratio = tempsRestant / TIME_PER_QUESTION;
		let bonusTemps = Math.round(pointsBase * 0.5 * ratio);
		pointsGagnes = pointsBase + bonusTemps;
		if (streak >= 3) pointsGagnes = Math.round(pointsGagnes * 1.5);
		score += pointsGagnes;
		zoneExplication.innerHTML =
			"<p style='color:green'>Bonne réponse ! +" + pointsGagnes + " pts</p>";
	} else {
		streak = 0;
		zoneExplication.innerHTML =
			"<p style='color:red'>Mauvaise réponse. La bonne réponse était : " +
			question.answer +
			"</p>";
	}

	scoreAffichage.innerText = score;
	streakAffichage.innerText = streak;

	boutonSuivant.style.display = "inline-block";
}

boutonSuivant.onclick = function () {
	indexActuel += 1;
	if (indexActuel < questions.length) {
		afficherQuestion();
	} else {
		terminerQuiz();
	}
};

function chargerTop() {
	try {
		let raw = localStorage.getItem("cybershield_top5");
		if (!raw) return [];
		return JSON.parse(raw);
	} catch (e) {
		return [];
	}
}

function sauvegarderScore(session) {
	let arr = chargerTop();
	arr.push(session);
	arr.sort((a, b) => b.score - a.score);
	arr = arr.slice(0, 5);
	localStorage.setItem("cybershield_top5", JSON.stringify(arr));
}

function sauvegarderScoreDashboard(scorePourcentage) {
	try {
		let scores = localStorage.getItem("cybershield-quiz-scores");
		scores = scores ? JSON.parse(scores) : [];

		scores.push({
			score: scorePourcentage,
			date: new Date().toISOString(),
		});

		localStorage.setItem("cybershield-quiz-scores", JSON.stringify(scores));
	} catch (e) {
		console.error("Erreur sauvegarde score dashboard:", e);
	}
}

function notifierMiseAJourDashboard() {
	try {
		window.dispatchEvent(new Event("data-updated"));
		if (window.parent && window.parent !== window) {
			window.parent.dispatchEvent(new Event("data-updated"));
		}
	} catch (e) {
		console.error("Erreur notification dashboard:", e);
	}
}

function recommander(parCat) {
	let liste = [];
	for (let k in parCat) {
		let v = parCat[k];
		if (v.asked > 0) {
			let acc = v.correct / v.asked;
			if (acc < 0.6) liste.push({ cat: k, acc: Math.round(acc * 100) });
		}
	}
	liste.sort((a, b) => a.acc - b.acc);
	return liste.slice(0, 3);
}

function terminerQuiz() {
	clearInterval(timerId);
	const scorePourcentage = Math.round(
		(bonnesReponses / questions.length) * 100,
	);

	let session = {
		score: score,
		date: new Date().toISOString(),
		correct: bonnesReponses,
		total: questions.length,
		parCategorie: parCategorie,
	};
	sauvegarderScore(session);
	sauvegarderScoreDashboard(scorePourcentage);
	notifierMiseAJourDashboard();

	let top = chargerTop();
	let recs = recommander(parCategorie);

	let html = "<h2>Résultats</h2>";
	html += "<p>Score final : " + score + "</p>";
	html += "<p>Score de réussite : " + scorePourcentage + "%</p>";
	html +=
		"<p>Réponses correctes : " +
		bonnesReponses +
		" / " +
		questions.length +
		"</p>";
	html += "<h3>Top 5</h3><ol>";
	for (let i = 0; i < top.length; i++) {
		let s = top[i];
		html +=
			"<li>" +
			s.score +
			" pts — " +
			new Date(s.date).toLocaleString() +
			" (" +
			s.correct +
			"/" +
			s.total +
			")</li>";
	}
	html += "</ol>";
	html += "<h3>Recommandations</h3><ul>";
	if (recs.length === 0)
		html += "<li>Bon travail ! Pas de catégorie critique.</li>";
	for (let i = 0; i < recs.length; i++) {
		html +=
			"<li>" +
			recs[i].cat +
			" — précision " +
			recs[i].acc +
			"% : revoir cette catégorie.</li>";
	}
	html += "</ul>";
	html +=
		'<button id="rejouer" style="padding:10px 16px;cursor:pointer;">Rejouer</button>';

	quizPanel.style.display = "none";
	resultPanel.style.display = "block";
	resultPanel.innerHTML = html;

	const boutonRejouer = document.getElementById("rejouer");
	if (boutonRejouer) {
		boutonRejouer.onclick = function () {
			demarrerQuiz();
		};
	}
}

if (startBtn) {
	startBtn.addEventListener("click", demarrerQuiz);
}
