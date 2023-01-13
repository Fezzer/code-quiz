const QUESTIONS_URL = "assets/data/questions.json";
const QUIZ_DURATION = 60;

var startButton = document.getElementById("start");
var startScreenElement = document.getElementById("start-screen");
var questionsElement = document.getElementById("questions");
var timeElement = document.getElementById("time");
var questions;
var timer;
var remainingTime;
var answeredQuestions = [];
// Retrieves the list of questions from a JSON file hosted on the server.
function getQuestions(url) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send(null);
  
  return JSON.parse(xhr.responseText);
}

// Toggles the 'hide' class in an element's class attribute.
function toggleHide(element) {
  const hideClass = "hide";
  const classAttribute = "class";

  if (!(element instanceof Element)) {
    return;
  }

  let classes = element.getAttribute(classAttribute)?.split(" ") ?? [];
  let index = classes.indexOf(hideClass);

  if (index === -1)
    classes.push(hideClass);
  else
    classes.splice(index, 1);

  element.setAttribute(classAttribute, classes.join(" "));
}

// Updates the time remaining.
function updateRemainingTime() {
  let mins = Math.floor(remainingTime / 60).toString().padStart(2, "0");
  let secs = String(remainingTime % 60).padStart(2, "0");

  timeElement.textContent = `${mins}:${secs}`;
}

// Initialises and starts the quiz timer.
function startTimer() {
  remainingTime = QUIZ_DURATION;
  updateRemainingTime;

  timer = setInterval(() => {
    remainingTime--;
    updateRemainingTime();

    if (remainingTime === 0) {
      clearInterval(timer);
      // TODO: need to handle timer completion here.
    }
  }, 1000);
}

function init() {
  questions = getQuestions(QUESTIONS_URL);

  startButton.onclick = () => {
    // TODO: get first question.
    toggleHide(startScreenElement);
    toggleHide(questionsElement);

    startTimer();
  };
}

init();