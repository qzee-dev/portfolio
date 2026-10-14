
// ========================================
// THEME TOGGLE
// ========================================

const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

function setTheme(theme, save = true) {
  root.setAttribute("data-theme", theme);

  if (themeToggle) {
    const isDark = theme === "dark";

    themeToggle.textContent = isDark ? "🌙" : "☀️";

    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme"
    );

    themeToggle.setAttribute(
      "aria-pressed",
      String(!isDark)
    );
  }

  if (save) {
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      // Theme switching still works if storage is unavailable.
    }
  }
}

// Load saved theme or use the system preference.
let savedTheme = null;

try {
  savedTheme = localStorage.getItem("theme");
} catch (error) {
  // Use the system preference if storage is unavailable.
}

const prefersDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

const initialTheme =
  savedTheme === "dark" || savedTheme === "light"
    ? savedTheme
    : prefersDark
      ? "dark"
      : "light";

setTheme(initialTheme, false);

// Toggle between dark and light themes.
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");

    const nextTheme =
      currentTheme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
  });
}

// ========================================
// MOBILE NAVIGATION
// ========================================

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

function closeNavigation() {
  if (!hamburger || !navLinks) return;

  navLinks.classList.remove("active");

  hamburger.textContent = "☰";

  hamburger.setAttribute(
    "aria-expanded",
    "false"
  );

  hamburger.setAttribute(
    "aria-label",
    "Open navigation"
  );
}

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    hamburger.textContent = isOpen ? "✕" : "☰";

    hamburger.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    hamburger.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  // Close the menu when a navigation link is selected.
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  // Close the menu when Escape is pressed.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const wasOpen = navLinks.classList.contains("active");

      closeNavigation();

      if (wasOpen) {
        hamburger.focus();
      }
    }
  });

  // Close the menu when clicking outside it.
  document.addEventListener("click", (event) => {
    const clickedInsideMenu = navLinks.contains(event.target);
    const clickedHamburger = hamburger.contains(event.target);

    if (
      navLinks.classList.contains("active") &&
      !clickedInsideMenu &&
      !clickedHamburger
    ) {
      closeNavigation();
    }
  });

  // Reset the mobile menu when switching to desktop width.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeNavigation();
    }
  });
}

// ========================================
// AUTOMATIC FOOTER YEAR
// ========================================

const currentYear = document.getElementById("current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
