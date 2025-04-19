const fs = require('fs');

function toUnicodeEscape(char) {
  return [...char].map(c =>
    "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0")
  ).join("");
}

let text = "";
const s = 125000;
for (let i = s; i < s + 2000; i++) {
    const char = String.fromCharCode(i)
    text += char + ": " + toUnicodeEscape(char) + "\n";
}

fs.writeFileSync('unicode.txt', text);
