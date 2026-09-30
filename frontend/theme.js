const toggleBtn = document.getElementById("toggleBtn");

// Load saved theme from localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
  document.getElementById("toggleBtn").textContent = "Dark Mode";
} else {
  document.getElementById("toggleBtn").textContent = "Light Mode";
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  document.getElementById("toggleBtn").textContent = document.body.classList.contains("light")
    ? "Dark Mode"
    : "Light Mode";

  // Save current theme
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
});