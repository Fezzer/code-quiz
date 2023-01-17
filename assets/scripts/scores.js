const HIGH_SCORES = "high-scores";

var highScoresElement = document.getElementById("highscores");
var highScores = JSON.parse(localStorage.getItem(HIGH_SCORES)) ?? [];

highScores.forEach(hs => {
  let li = document.createElement("li");
  li.textContent = `${hs.initials} - ${hs.correct} out of ${hs.answers}`;
  highScoresElement.append(li);
});

document.getElementById("clear").onclick = () => {
  localStorage.removeItem(HIGH_SCORES);
  highScoresElement.innerHTML = "";
};