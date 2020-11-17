const { response } = require("express");
const app = require("express")();

app.get("/q", (req, res) => res.sendFile(__dirname + "/admin/questions.html"));
app.get("/api/getQuestions", (req, res) =>
  res.sendFile(__dirname + "/questions.json")
);

app.listen(9091, () => console.log("Listening on http port 9091"));
