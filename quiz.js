const apiUrl = "https://the-trivia-api.com/v2/questions";
const selectedTopic = localStorage.getItem("quizTopic");

// Redirect to index.html if no topic is selected
if (!selectedTopic) {
    window.location.href = "index.html";
}

// Clear quiz topic on page refresh
window.addEventListener("beforeunload", function () {
    localStorage.removeItem("quizTopic");
});

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Fetch questions from API
fetch(`${apiUrl}?categories=${selectedTopic}&limit=10`)
  .then(response => response.json())
  .then(data => {
    questions = data;
    showQuestion();
  })
  .catch(error => console.error("Error fetching questions:", error));

const questionEl = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const scoreEl = document.getElementById("score");
const endOptions = document.getElementById("end-options"); 
const playAgainBtn = document.getElementById("play-again-btn"); 
const goHomeBtn = document.getElementById("go-home-btn");
const homeBtn = document.getElementById("home-btn");

function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    questionEl.innerHTML = "Quiz Completed!";
    optionsContainer.innerHTML = "";
    nextBtn.style.display = "none";
    endOptions.style.display = "block"; // Show end options (Play Again / Home)
    return;
  }

  let currentQuestion = questions[currentQuestionIndex];
  questionEl.innerHTML = currentQuestion.question.text;

  let options = [...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer];
  options.sort(() => Math.random() - 0.5);

  optionsContainer.innerHTML = "";
  options.forEach(optionText => {
    let btn = document.createElement("button");
    btn.textContent = optionText;
    btn.classList.add("option-btn");
    btn.addEventListener("click", () => checkAnswer(btn, currentQuestion.correctAnswer));
    optionsContainer.appendChild(btn);
  });

  nextBtn.disabled = true; // Disable next button until an answer is selected
}

function checkAnswer(selectedButton, correctAnswer) {
  let buttons = document.querySelectorAll(".option-btn");
  buttons.forEach(btn => {
    btn.disabled = true; // Disable all buttons after selecting an answer

    // Highlight the correct answer
    if (btn.textContent === correctAnswer) {
      btn.style.backgroundColor = "green"; // Show the correct answer in green
    }
  });

  // Indicate incorrect answer
  if (selectedButton.textContent !== correctAnswer) {
    selectedButton.style.backgroundColor = "red"; // Show the incorrect answer in red
  } else {
    score++;
  }

  scoreEl.textContent = `Score: ${score}`;
  nextBtn.disabled = false; // Enable next button after selecting an answer
}

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  showQuestion();
});

// Home button functionality
homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});

// Play Again button functionality
playAgainBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    scoreEl.textContent = "Score: 0";
    endOptions.style.display = "none";
    nextBtn.style.display = "inline-block";
    fetch(`${apiUrl}?categories=${selectedTopic}&limit=10`)
        .then(response => response.json())
        .then(data => {
            questions = data;
            showQuestion();
        })
        .catch(error => console.error("Error fetching questions:", error));
});

// Go Home button functionality
goHomeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
