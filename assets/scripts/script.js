const QUESTIONS_URL = "assets/data/questions.json";
const QUIZ_DURATION = 60;
const CLASS_ATTRIBUTE = "class";
const HIDE_VALUE = "hide";

var questionsElement = document.getElementById("questions");
var timeElement = document.getElementById("time");
var choicesElement = document.getElementById("choices");
var correctElement = document.getElementById("correct");
var incorrectElement = document.getElementById("incorrect");

var questions;
var timer;
var remainingTime;
var answeredQuestions = [];
var correctPlayer = createPlayer("/assets/sfx/correct.wav");
var incorrectPlayer = createPlayer("/assets/sfx/incorrect.wav");
var disableAnswerButtons = false;

// Returns a non-negative random integer that is less than the specified maximum. 
function getRandomNumber(maxValue) {
  return Math.floor(Math.random() * maxValue);
}

// Creates an audio player with a method to play a sound.
function createPlayer(url) {
  let audio = new Audio(url);

  return {
    "play": () => audio.play()
  };
}

// Retrieves the list of questions from a JSON file hosted on the server.
function getQuestions(url) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send(null);
  
  return JSON.parse(xhr.responseText);
}

// Toggles the hide value on a specified element's class attribute.
function toggleHide(element) {
  element.classList.toggle(HIDE_VALUE);
}

// Handles the click event of the start button.
function startButtonClick() {
  processNextQuestion();
  toggleHide(document.getElementById("start-screen"));
  toggleHide(questionsElement);

  startTimer();
};

// Updates the time remaining on the quiz.
function updateRemainingTime() {
  let mins = Math.floor(remainingTime / 60).toString().padStart(2, "0");
  let secs = String(remainingTime % 60).padStart(2, "0");

  timeElement.textContent = `${mins}:${secs}`;
}

// Initialises and starts the quiz timer.
function startTimer() {
  remainingTime = QUIZ_DURATION;
  updateRemainingTime();

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

// Handles the click of an answer button.
function answerButtonClick(event) {
  if (disableAnswerButtons || !event.target.matches("button")) {
    return;    
  }

  disableAnswerButtons = true;

  let questionId = questionsElement.dataset.id;
  
  let answer = { 
    questionId: questionId,
    answerId: event.target.dataset.id
  };

  answeredQuestions.push(answer);
  let correctAnswerId = questions[questionId].answers.find(a => a.isCorrect).id;

  if (answer.answerId === correctAnswerId) {
    correctPlayer.play();
    toggleHide(correctElement);
  } else {
    incorrectPlayer.play();
    toggleHide(incorrectElement);
    remainingTime -= 10;
  }

  setTimeout(() => {
    correctElement.classList.add(HIDE_VALUE);
    incorrectElement.classList.add(HIDE_VALUE);
    processNextQuestion();
  }, 500);
}

// Displays a question.
function displayQuestion(question) {
  questionsElement.dataset.id = question.id;
  document.getElementById("question-title").innerHTML = question.question;
  choicesElement.innerText = "";

  question.answers.forEach(a => {
    let button = document.createElement("button");
    button.textContent = `${a.id}. ${a.answer}`;
    button.dataset.id = a.id;
    choicesElement.appendChild(button);
  });
}

// Manages the workflow for processing the next question.
function processNextQuestion() {
  displayQuestion(getNextQuestion());
  disableAnswerButtons = false;
}

// Initialise the app.
function init() {
  questions = getQuestions(QUESTIONS_URL);
  document.getElementById("start").onclick = startButtonClick;
  choicesElement.onclick = answerButtonClick;
}

init();