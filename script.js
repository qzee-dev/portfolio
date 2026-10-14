// ========================================
// THEME TOGGLE
// ========================================

const themeToggle = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("theme");

function setTheme(theme) {
  document.documentElement.setAttribute(
    "data-theme",
    theme
  );

  themeToggle.textContent =
    theme === "dark"
      ? "🌙"
      : "☀️";

  localStorage.setItem(
    "theme",
    theme
  );
}

if (savedTheme) {
  setTheme(savedTheme);
} else {
  const prefersDark =
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

  setTheme(
    prefersDark ? "dark" : "light"
  );
}

themeToggle.addEventListener(
  "click",
  () => {

    const currentTheme =
      document.documentElement.getAttribute(
        "data-theme"
      );

    const nextTheme =
      currentTheme === "dark"
        ? "light"
        : "dark";

    setTheme(nextTheme);
  }
);

// ========================================
// MOBILE NAVIGATION
// ========================================

const hamburger =
  document.getElementById(
    "hamburger"
  );

const navLinks =
  document.getElementById(
    "nav-links"
  );

if (hamburger && navLinks) {

  hamburger.addEventListener(
    "click",
    () => {

      navLinks.classList.toggle(
        "active"
      );

      hamburger.textContent =
        navLinks.classList.contains
