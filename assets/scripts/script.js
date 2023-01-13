const QUESTIONS_URL = "assets/data/questions.json";
const QUIZ_DURATION = 60;

var startButton = document.getElementById("start");
var startScreenElement = document.getElementById("start-screen");
var questionsElement = document.getElementById("questions");
var timeElement = document.getElementById("time");
var choicesElement = document.getElementById("choices");
var questions;
var timer;
var remainingTime;
var currentQuestion;
var answeredQuestions = [];

// Returns a non-negative random integer that is less than the specified maximum. 
function getRandomNumber(maxValue) {
  return Math.floor(Math.random() * maxValue);
}

// Generate an array containing a sequence of integer numbers within a specified range.
function range(start, count) {
  return new Array(count).fill(undefined).map((_, i) => start + i);
}

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

// Updates the time remaining on the quiz.
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

    if (remainingTime <= 0) {
      clearInterval(timer);
      // TODO: need to handle timer completion here.
    }
  }, 1000);
}

// Gets the next question to ask.
function getNextQuestion() {
  let askedIds = answeredQuestions.map(aq => aq.id);
  
  let notAskedIds = questions
    .filter(q => !askedIds.includes(q.id))
    .map(q => q.id);
  
  let nextId = notAskedIds[getRandomNumber(notAskedIds.length)];

  return questions[nextId];
}

// Displays a question.
function displayQuestion(question) {
  document.getElementById("question-title").textContent = question.question;

  question.answers.forEach(a => {
    var button = document.createElement("button");
    button.textContent = `${a.index}. ${a.answer}`;
    button.dataset.index = a.index;
    choicesElement.appendChild(button);
  });
}

// Manages the workflow for processing the next question.
function processNextQuestion() {
  currentQuestion = getNextQuestion();
  displayQuestion(currentQuestion);
}

// Initialise the app.
function init() {
  questions = getQuestions(QUESTIONS_URL);

  startButton.onclick = () => {
    processNextQuestion();
    toggleHide(startScreenElement);
    toggleHide(questionsElement);

    startTimer();
  };
}

init();