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
    if (!selectedTopic) {
        window.location.href = "index.html";
        return;
    }

    // Clear quiz topic on page refresh
    window.addEventListener("beforeunload", () => localStorage.removeItem("quizTopic"));

    // Fetch questions
    fetchQuestions();
}

// Fetch questions from API
async function fetchQuestions() {
    try {
        const response = await fetch(`${apiUrl}?categories=${selectedTopic}&limit=10`);
        if (!response.ok) throw new Error("Failed to fetch questions.");
        questions = await response.json();
        showQuestion();
    } catch (error) {
        console.error("Error fetching questions:", error);
        questionEl.innerHTML = "Failed to load questions. Please try again.";
    }
}

// Function to preload and set a random background image
function preloadBackgroundImage() {
    const imageUrl = `https://picsum.photos/1920/1080?random=${Date.now()}`;
    const img = new Image();

    img.src = imageUrl;
    img.onload = () => {
        document.body.style.backgroundImage = `url(${img.src})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundPosition = "center";
        document.body.style.transition = "background 0.5s ease-in-out"; // Smooth transition
    };

    img.onerror = () => {
        console.error("Failed to load background image.");
    };
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

    preloadBackgroundImage(); // Ensure image is preloaded before applying

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
});

goHomeBtn.addEventListener("click", () => window.location.href = "index.html");

// Set background on page load
document.addEventListener("DOMContentLoaded", preloadBackgroundImage);

// 🔥 Start the quiz
main();

