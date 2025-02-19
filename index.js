document.getElementById("start-quiz").addEventListener("click", () => {
    const selectedTopic = document.getElementById("topic-select").value;
    localStorage.setItem("quizTopic", selectedTopic);  // Store topic
    window.location.href = "quiz.html";  // Navigate to quiz page
  });
  