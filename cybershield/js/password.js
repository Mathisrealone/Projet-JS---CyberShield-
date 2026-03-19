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

function analyzePassword(password) {
	let score = 0;
	let notCommon = true;
	let hasUpper = false;
	let hasSymbol = false;
	let hasNumber = false;
	const symbol = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/;

	for (let i = 0; i < commonPassword.length; i++) {
		if (password == commonPassword[i]) {
			notCommon = false;
		}
	}

	if (notCommon === true) {
		score += 20;
	}

	if (password.length > 8) {
		score += (password.length - 8) * 2;
	}

	for (let char of password) {
		if (symbol.test(char)) {
			hasSymbol = true;
		}

		if (char === char.toUpperCase() && char !== char.toLowerCase()) {
			hasUpper = true;
		}

		if (char >= "0" && char <= "9") {
			hasNumber = true;
		}
	}

	if (hasSymbol) {
		score += 20;
	}

	if (hasUpper) {
		score += 15;
	}

	if (hasNumber) {
		score += 15;
	}

	let strength = "Faible";
	if (score > 80) strength = "Très Fort";
	else if (score > 50) strength = "Moyen";

	return {
		score: score,
		strength: strength,
		isCommon: !notCommon,
	};
}

const progressBar = document.getElementById("progress-bar");
const scoreDisplay = document.getElementById("score-text");

console.log("Recherche de l'input...");
const passwordInput = document.getElementById("password-input");
console.log("Résultat de la recherche :", passwordInput);

passwordInput.addEventListener("input", (e) => {
	const currentPassword = e.target.value;
	const result = analyzePassword(currentPassword);

	// A) Appliquer la largeur à la barre
	// On prend le score et on lui colle un "%" pour que le CSS comprenne
	progressBar.style.width = result.score + "%";

	// B) Changer la couleur selon le score
	if (result.score < 40) {
		progressBar.style.backgroundColor = "red";
	} else if (result.score < 75) {
		progressBar.style.backgroundColor = "orange";
	} else {
		progressBar.style.backgroundColor = "green";
	}

	// C) Afficher le texte du score
	scoreDisplay.innerText = "Score : " + result.score + "/100";
});

/* const code = "Shwlwh sdxvh txdqg wx dv wurxyh oh ghxalhph phvvdjh";
const code2 = "Zaz vq pqoazzq";
const code3 = "Ov ciowg eiobr asas";
const code4 = "nazvagd yaz myagd vq f'muyq pq fagf yaz oaqgd";
function decode(texte) {
  const Alphabet = "abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < 26; i++) {
    let result = "";
    for (let j = 0; j < texte.length; j++) {
      const char = texte[j].toLowerCase();
      const index = Alphabet.indexOf(char);
      if (index === -1) {
        result += texte[j];
        continue;
      }

      let newIndex = (index - i) % 26;
      if (newIndex < 0) {
        newIndex += 26;
      }

      const decodedChar = Alphabet[newIndex];

      if (texte[j] === texte[j].toUpperCase()) {
        result += decodedChar.toUpperCase();
      } else {
        result += decodedChar;
      }
    }
    console.log(`Décalage ${i} → ${result}`);
  }
}

decode(code);
decode(code2);
decode(code3);
decode(code4); */
