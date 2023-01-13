const QUESTIONS_URL = "assets/data/questions.json";

function getQuestions(url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send(null);
  
  return JSON.parse(xhr.responseText);
}

var questions = getQuestions(QUESTIONS_URL);
console.log(questions[0]);