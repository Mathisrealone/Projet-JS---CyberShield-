const code = "Shwlwh sdxvh txdqg wx dv wurxyh oh ghxalhph phvvdjh";
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
decode(code4);
