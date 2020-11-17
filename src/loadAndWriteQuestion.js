const fs = require("fs");

// STEP 1: Reading JSON file
const questions = require("../questions.json");

// Defining new question
let question = {
  question: "neue Frage",
  answer: [
    "richtige Antwort",
    "falsche Antwort",
    "falsche Antwort 2",
    "falsche Antwort 3",
  ],
  category: "Filme",
  difficulty: 100,
  isGuess: false,
};

// STEP 2: Adding new data to users object
// questions.push(question);

// STEP 3: Writing to a file
fs.writeFile("questions.json", JSON.stringify(questions), (err) => {
  // Checking for errors
  if (err) throw err;

  console.log("Done writing"); // Success
});
