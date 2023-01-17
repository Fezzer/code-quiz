const QUESTIONS_URL = "assets/data/questions.json";
const QUIZ_DURATION = 60;
const CLASS_ATTRIBUTE = "class";
const HIDE_VALUE = "hide";

var startButton = document.getElementById("start");
var startScreenElement = document.getElementById("start-screen");
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

// Creates an audio player to play a
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

// Returns a boolean indicating if the specified element's class attribute contains the specified value.
function doesClassContain(element, value) {
  if (!(element instanceof Element)) {
    return;
  }
  
  let classes = element.getAttribute(CLASS_ATTRIBUTE)?.split(" ") ?? [];
  
  return classes.indexOf(value) !== -1;
}

// Adds the specified value to the specified element's class attribute'
function addValueToClassAttribute(element, value) {
  if (!(element instanceof Element)) {
    return;
  }

  if (doesClassContain(element, value))
    return;

  let newValue = `${element.getAttribute(CLASS_ATTRIBUTE)} ${value}`.trim();
  element.setAttribute(CLASS_ATTRIBUTE, newValue);
} 

// Removes the specified value from the specified element's class attribute.
function removeValueFromClassAttribute(element, value) {
  if (!(element instanceof Element)) {
    return;
  }

  if (!doesClassContain(element, value)) 
    return;

  let values = element.getAttribute(CLASS_ATTRIBUTE).split(" ");
  let indexToRemove = values.indexOf(value);
  values.splice(indexToRemove, 1);
  element.setAttribute(CLASS_ATTRIBUTE, values.join(" ").trim());
}

// Toggles the specified value in the specified element's class attribute.
function toggleAttributeValue(element, value) {
  if (!(element instanceof Element)) {
    return;
  }

  element.classList

  if (doesClassContain(element, value))
    removeValueFromClassAttribute(element, value);
  else
    addValueToClassAttribute(element, value);
}

// Toggles the hide value on a specified element's class attribute.
function toggleHide(element) {
  toggleAttributeValue(element, HIDE_VALUE);
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
  if (disableAnswerButtons) {
    return;    
  }

  disableAnswerButtons = true;

  let target = event.target;
  let questionId = questionsElement.dataset.id;
  
  let answer = { 
    questionId: questionId,
    answerId: target.dataset.id
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
    addValueToClassAttribute(correctElement, HIDE_VALUE);
    addValueToClassAttribute(incorrectElement, HIDE_VALUE);
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
    button.onclick = answerButtonClick;
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

  startButton.onclick = () => {
    processNextQuestion();
    toggleHide(startScreenElement);
    toggleHide(questionsElement);

    startTimer();
  };
}

init();