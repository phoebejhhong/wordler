const fs = require('fs');
const dictionary = require('./words_dictionary.json');
const validWords = [];
Object.keys(dictionary).forEach((word, i) => {
  if (word.length > 3 && word.length < 7)
  validWords.push(word);
});

let fileContent = `export const VALID_WORDS = [
  \'`;

fileContent += validWords.join(`\',\n  \'`);
fileContent += `\',\n];`;

fs.writeFile('./src/validWords.js', fileContent, (data, err)=> {
  if (err) {
    console.log("ERROR:", err);
  }
})
