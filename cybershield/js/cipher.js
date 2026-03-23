// Ta fonction de base reste identique
function caesarCipher(text, key) {
	const alphabet = "abcdefghijklmnopqrstuvwxyz";
	let result = "";
	for (let char of text) {
		const lowerChar = char.toLowerCase();
		const index = alphabet.indexOf(lowerChar);
		if (index === -1) {
			result += char;
			continue;
		}
		let newIndex = (index + key) % 26;
		if (newIndex < 0) newIndex += 26;
		const newChar = alphabet[newIndex];
		result += char === char.toUpperCase() ? newChar.toUpperCase() : newChar;
	}
	return result;
}

const caesarInput = document.getElementById("caesar-input");
const caesarKey = document.getElementById("caesar-key");
const caesarOutput = document.getElementById("caesar-output");
const bruteForceBody = document.getElementById("brute-force-body");
const bruteForceContainer = document.getElementById("brute-force-container");

// Actions simples
document.getElementById("encrypt-btn").addEventListener("click", () => {
	const key = parseInt(caesarKey.value) || 0;
	caesarOutput.innerText = caesarCipher(caesarInput.value, key);
	bruteForceContainer.style.display = "none"; // On cache l'analyse
});

document.getElementById("decrypt-btn").addEventListener("click", () => {
	const key = parseInt(caesarKey.value) || 0;
	caesarOutput.innerText = caesarCipher(caesarInput.value, -key);
	bruteForceContainer.style.display = "none";
});

// Action "Rechercher la clé"
document.getElementById("brute-force-btn").addEventListener("click", () => {
	const text = caesarInput.value;
	if (!text) return;

	bruteForceBody.innerHTML = "";
	for (let i = 1; i <= 25; i++) {
		const decoded = caesarCipher(text, -i);
		bruteForceBody.innerHTML += `<tr><td>${i}</td><td>${decoded}</td></tr>`;
	}
	bruteForceContainer.style.display = "block";
	// On scrolle automatiquement vers le tableau
	bruteForceContainer.scrollIntoView({ behavior: "smooth" });
});
