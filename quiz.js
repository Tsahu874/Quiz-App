const apiUrl = "https://the-trivia-api.com/v2/questions";
const selectedTopic = localStorage.getItem("quizTopic");
const quizContainer = document.querySelector(".quiz-container");

// Declare global variables
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// DOM Elements
const questionEl = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const scoreEl = document.getElementById("score");
const endOptions = document.getElementById("end-options");
const playAgainBtn = document.getElementById("play-again-btn");
const goHomeBtn = document.getElementById("go-home-btn");
const homeBtn = document.getElementById("home-btn");

// Main function to initialize quiz
function main() {
    // Redirect if no topic is selected
    if (!selectedTopic) {
        window.location.href = "index.html";
        return;  // Stop execution if redirected
    }

    // Clear quiz topic on page refresh
    window.addEventListener("beforeunload", function () {
        localStorage.removeItem("quizTopic");
    });

    // Fetch questions and set background
    fetchQuestions();
    setRandomBackground();
}

// Fetch questions from API
function fetchQuestions() {
    fetch(`${apiUrl}?categories=${selectedTopic}&limit=10`)
        .then((response) => response.json())
        .then((data) => {
            questions = data;
            showQuestion();
        })
        .catch((error) => console.error("Error fetching questions:", error));
}

// Fetch a random background image
function setRandomBackground() {
    const imageUrl = `https://source.unsplash.com/random/800x600?sig=${new Date().getTime()}`;
    quizContainer.style.background = `url(${imageUrl})`;
    quizContainer.style.backgroundSize = "cover";
    quizContainer.style.backgroundPosition = "center";
}

// Display the current question
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        questionEl.innerHTML = "Quiz Completed!";
        optionsContainer.innerHTML = "";
        nextBtn.style.display = "none";
        endOptions.style.display = "block";
        return;
    }

    let currentQuestion = questions[currentQuestionIndex];
    questionEl.innerHTML = currentQuestion.question.text;

    let options = [...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer];
    options.sort(() => Math.random() - 0.5);

    optionsContainer.innerHTML = "";
    options.forEach((optionText) => {
        let btn = document.createElement("button");
        btn.textContent = optionText;
        btn.classList.add("option-btn");
        btn.addEventListener("click", () => checkAnswer(btn, currentQuestion.correctAnswer));
        optionsContainer.appendChild(btn);
    });

    nextBtn.disabled = true;
}

// Check if the selected answer is correct
function checkAnswer(selectedButton, correctAnswer) {
    let buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((btn) => {
        btn.disabled = true;
        if (btn.textContent === correctAnswer) {
            btn.style.backgroundColor = "green";
        }
    });

    if (selectedButton.textContent !== correctAnswer) {
        selectedButton.style.backgroundColor = "red";
    } else {
        score++;
    }

    scoreEl.textContent = `Score: ${score}`;
    nextBtn.disabled = false;
}

// Event Listeners
nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    showQuestion();
});

homeBtn.addEventListener("click", () => window.location.href = "index.html");

playAgainBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    scoreEl.textContent = "Score: 0";
    endOptions.style.display = "none";
    nextBtn.style.display = "inline-block";
    fetchQuestions();
    setRandomBackground();
});

goHomeBtn.addEventListener("click", () => window.location.href = "index.html");

// 🔥 Call main function to start the quiz
main();

