const commonPassword = [
	"123456",
	"123456789",
	"azerty",
	"1234561",
	"azertyuiop",
	"avf2013",
	"loulou",
	"0",
	"password",
	"doudou",
	"marseille",
	"amiret2015",
	"motdepasse",
	"soleil",
	"12345",
	"1234567891",
	"cheval",
	"bonjour",
	"chouchou",
	"jetaime",
];

function calculatePasswordEntropy(password) {
	if (!password || password.length === 0) return 0;

	const hasLower = /[a-z]/.test(password);
	const hasUpper = /[A-Z]/.test(password);
	const hasDigit = /[0-9]/.test(password);
	const hasSymbol = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(password);

	let alphabetSize = 0;
	if (hasLower) alphabetSize += 26;
	if (hasUpper) alphabetSize += 26;
	if (hasDigit) alphabetSize += 10;
	if (hasSymbol) alphabetSize += 32;

	if (alphabetSize === 0) return 0;

	const entropy = password.length * Math.log2(alphabetSize);
	return Number(entropy.toFixed(2));
}

function analyzePassword(password) {
	if (password === "") {
		return {
			score: 0,
			strength: "En attente...",
			isCommon: false,
			entropy: 0,
		};
	}

	let score = 0;
	let isCommon = false;
	let hasUpper = false;
	let hasSymbol = false;
	let hasNumber = false;
	const symbol = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/;

	for (let i = 0; i < commonPassword.length; i++) {
		if (password.toLowerCase() === commonPassword[i].toLowerCase()) {
			isCommon = true;
			break;
		}
	}

	if (isCommon) {
		return {
			score: 0,
			strength: "Très Faible",
			isCommon: true,
			entropy: calculatePasswordEntropy(password),
		};
	}

	score += 20;

	if (password.length > 8) {
		score += (password.length - 8) * 2;
	}

	for (let char of password) {
		if (symbol.test(char)) hasSymbol = true;
		if (char === char.toUpperCase() && char !== char.toLowerCase())
			hasUpper = true;
		if (char >= "0" && char <= "9") hasNumber = true;
	}

	if (hasSymbol) score += 20;
	if (hasUpper) score += 15;
	if (hasNumber) score += 15;

	score = Math.min(100, Math.max(0, score));

	let strength = "Faible";
	if (score > 80) strength = "Très Fort";
	else if (score > 50) strength = "Moyen";

	return {
		score: score,
		strength: strength,
		isCommon: isCommon,
		entropy: calculatePasswordEntropy(password),
	};
}

const progressBar = document.getElementById("progress-bar");
const scoreDisplay = document.getElementById("score-text");
const passwordInput = document.getElementById("password-input");
const forceDisplay = document.getElementById("force-text");

if (passwordInput) {
	passwordInput.addEventListener("input", (e) => {
		const currentPassword = e.target.value;
		const result = analyzePassword(currentPassword);

		progressBar.style.width = result.score + "%";

		if (result.score < 40) {
			progressBar.style.backgroundColor = "red";
		} else if (result.score < 75) {
			progressBar.style.backgroundColor = "orange";
		} else {
			progressBar.style.backgroundColor = "green";
		}

		forceDisplay.innerText = result.strength;
		scoreDisplay.innerText =
			"Score : " +
			result.score +
			"/100 | Entropie : " +
			result.entropy +
			" bits";

		// INTÉGRATION: Sauvegarder dans le DataManager et notifier le dashboard
		if (currentPassword.length > 0) {
			dataManager.addPasswordAnalysis(result.strength, result.score);
			window.dispatchEvent(new Event("data-updated"));
		}
	});
}
