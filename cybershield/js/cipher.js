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
