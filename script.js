
// =====================================================
// QOSEEM OYERINMADE — PORTFOLIO INTERACTIONS
// Theme, responsive navigation, active section, footer year
// =====================================================
(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  const currentYear = document.getElementById("current-year");
  const navItems = [...document.querySelectorAll(".nav-link")];

  // Apply the selected colour theme.
  function setTheme(theme, save = true) {
    const resolvedTheme = theme === "light" ? "light" : "dark";

    root.setAttribute("data-theme", resolvedTheme);

    if (themeToggle) {
      const isDark = resolvedTheme === "dark";

      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );

      themeToggle.setAttribute("aria-pressed", String(!isDark));
    }

    const themeMeta = document.querySelector(
      'meta[name="theme-color"]'
    );

    if (themeMeta) {
      themeMeta.setAttribute(
        "content",
        resolvedTheme === "dark" ? "#070d1b" : "#f4f6ff"
      );
    }

    if (save) {
      try {
        localStorage.setItem("theme", resolvedTheme);
      } catch (_) {
        // Storage can be unavailable.
      }
    }
  }

  // Restore the saved theme or use the browser preference.
  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("theme");
  } catch (_) {
    // Use the system preference.
  }

  const systemPrefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  setTheme(
    savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : systemPrefersDark
        ? "dark"
        : "light",
    false
  );

  // Toggle between dark and light themes.
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = root.getAttribute("data-theme");

      setTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }

  // Close the mobile navigation menu.
  function closeNavigation() {
    if (!hamburger || !navLinks) return;

    navLinks.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open navigation");
    hamburger.classList.remove("is-open");
  }

  // Mobile navigation controls.
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");

      hamburger.setAttribute("aria-expanded", String(isOpen));

      hamburger.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );

      hamburger.classList.toggle("is-open", isOpen);
    });

    // Close the menu after selecting a navigation link.
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeNavigation);
    });

    // Close the menu when Escape is pressed.
    document.addEventListener("keydown", event => {
      if (
        event.key === "Escape" &&
        navLinks.classList.contains("active")
      ) {
        closeNavigation();
        hamburger.focus();
      }
    });

    // Close the menu when clicking outside it.
    document.addEventListener("click", event => {
      if (
        navLinks.classList.contains("active") &&
        !navLinks.contains(event.target) &&
        !hamburger.contains(event.target)
      ) {
        closeNavigation();
      }
    });

    // Close the mobile menu when returning to desktop width.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeNavigation();
      }
    });
  }

  // Automatically update the copyright year.
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Highlight the navigation item for the visible section.
  const observedSections = [
    "home",
    "about",
    "projects",
    "skills",
    "contact"
  ]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (
    "IntersectionObserver" in window &&
    observedSections.length
  ) {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          )[0];

        if (!visible) return;

        const activeId = visible.target.id;

        navItems.forEach(link => {
          const active =
            link.getAttribute("href") === `#${activeId}`;

          link.classList.toggle("active", active);
        });
      },
      {
        rootMargin: "-22% 0px -58% 0px",
        threshold: [0, 0.15, 0.35, 0.6]
      }
    );

    observedSections.forEach(section => {
      observer.observe(section);
    });
  }
})();
