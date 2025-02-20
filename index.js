// Preload and set a random background image
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

// Event listener for starting the quiz
document.getElementById("start-quiz").addEventListener("click", () => {
  const selectedTopic = document.getElementById("topic-select").value;
  localStorage.setItem("quizTopic", selectedTopic);  // Store topic
  window.location.href = "quiz.html";  // Navigate to quiz page
});

// Apply the background when the page loads
document.addEventListener("DOMContentLoaded", preloadBackgroundImage);
