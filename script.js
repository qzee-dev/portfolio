
// ========================================================
// QOSEEM OYERINMADE — PORTFOLIO JAVASCRIPT
// Theme toggle, mobile navigation, active links and year
// ========================================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------------------
  // THEME TOGGLE
  // ------------------------------------------------------

  const themeToggle = document.getElementById("theme-toggle");
  const root = document.documentElement;

  function applyTheme(theme) {
    const selectedTheme = theme === "light" ? "light" : "dark";

    root.setAttribute("data-theme", selectedTheme);

    if (themeToggle) {
      const isLight = selectedTheme === "light";

      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
      );
      themeToggle.setAttribute(
        "title",
        isLight ? "Switch to dark theme" : "Switch to light theme"
      );
    }

    // Keep the browser interface consistent with the selected theme.
    const themeColor = document.querySelector('meta[name="theme-color"]');

    if (themeColor) {
      themeColor.setAttribute(
        "content",
        selectedTheme === "light" ? "#f4f6ff" : "#070d1b"
      );
    }
  }

  let savedTheme = "dark";

  try {
    const storedTheme = localStorage.getItem("qoseem-portfolio-theme");

    if (storedTheme === "light" || storedTheme === "dark") {
      savedTheme = storedTheme;
    }
  } catch (error) {
    // The site still works if browser storage is unavailable.
  }

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = root.getAttribute("data-theme") || "dark";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      applyTheme(nextTheme);

      try {
        localStorage.setItem("qoseem-portfolio-theme", nextTheme);
      } catch (error) {
        // Theme switching continues to work for the current page.
      }
    });
  }

  // ------------------------------------------------------
  // MOBILE NAVIGATION
  // ------------------------------------------------------

  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  function closeNavigation() {
    if (!hamburger || !navLinks) return;

    navLinks.classList.remove("active");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Open navigation");
  }

  function openNavigation() {
    if (!hamburger || !navLinks) return;

    navLinks.classList.add("active");
    hamburger.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Close navigation");
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isExpanded =
        hamburger.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        closeNavigation();
      } else {
        openNavigation();
      }
    });

    // Close the mobile menu after selecting a navigation link.
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNavigation);
    });

    // Close the menu when the user clicks outside it.
    document.addEventListener("click", (event) => {
      const target = event.target;

      if (
        target instanceof Node &&
        !hamburger.contains(target) &&
        !navLinks.contains(target)
      ) {
        closeNavigation();
      }
    });

    // Close the menu with Escape.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNavigation();
        hamburger.focus();
      }
    });

    // Reset navigation state when returning to desktop width.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeNavigation();
      }
    });
  }

  // ------------------------------------------------------
  // ACTIVE NAVIGATION LINK
  // ------------------------------------------------------

  const sections = document.querySelectorAll(
    "#home, #about, #projects, #skills, #contact"
  );

  const navigationLinks = document.querySelectorAll(
    ".nav-links .nav-link"
  );

  function setActiveLink(sectionId) {
    navigationLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const isActive = href === `#${sectionId}`;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visibleEntries.length > 0) {
          setActiveLink(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.15, 0.35, 0.6]
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // ------------------------------------------------------
  // AUTOMATIC COPYRIGHT YEAR
  // ------------------------------------------------------

  const yearElement = document.getElementById("current-year");

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  // ------------------------------------------------------
  // SMOOTH SCROLL FOR INTERNAL LINKS
  // ------------------------------------------------------

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      let target;

      try {
        target = document.querySelector(href);
      } catch (error) {
        return;
      }

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
        block: "start"
      });

      // Keep the URL hash in sync without a second jump.
      if (window.location.hash !== href) {
        history.pushState(null, "", href);
      }
    });
  });

  // ------------------------------------------------------
  // EXTERNAL LINKS: OPEN SAFELY IN A NEW TAB
  // ------------------------------------------------------

  document
    .querySelectorAll('a[target="_blank"]')
    .forEach((link) => {
      const relValues = new Set(
        (link.getAttribute("rel") || "")
          .split(/\s+/)
          .filter(Boolean)
      );

      relValues.add("noopener");
      relValues.add("noreferrer");

      link.setAttribute("rel", [...relValues].join(" "));
    });

  // ------------------------------------------------------
  // OPTIONAL DOWNLOADABLE CV BUTTON
  // ------------------------------------------------------
  // If your HTML includes an element with id="download-cv",
  // this handler checks for a valid href before navigation.
  // Set the anchor's href to your actual CV file path.
  // Example: href="assets/Qoseem-Oyerinmade-CV.pdf"

  const cvButton = document.getElementById("download-cv");

  if (cvButton) {
    cvButton.addEventListener("click", (event) => {
      const cvHref = cvButton.getAttribute("href");

      if (!cvHref || cvHref === "#") {
        event.preventDefault();
        console.warn(
          "CV download is not configured. Add the correct CV file path to the download-cv link."
        );
      }
    });
  }
});
