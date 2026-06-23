const caseItems = document.querySelectorAll(".case-reveal");
const caseBackToTop = document.querySelector(".case-back-to-top");
const caseThemeButton = document.querySelector(".case-theme-toggle");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("img").forEach((image) => {
  image.draggable = false;
});

document.addEventListener("contextmenu", (event) => {
  if (event.target.closest("img, picture, .hero-image, .artifact")) event.preventDefault();
});

document.addEventListener("dragstart", (event) => {
  if (event.target.closest("img, picture")) event.preventDefault();
});

function applyCaseTheme(theme) {
  const useLightTheme = theme === "light";
  document.body.classList.toggle("light-theme", useLightTheme);
  caseThemeButton?.setAttribute("aria-label", useLightTheme ? "Switch to dark theme" : "Switch to light theme");
}

applyCaseTheme(localStorage.getItem("portfolio-theme") || "dark");

caseThemeButton?.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
  applyCaseTheme(nextTheme);
  localStorage.setItem("portfolio-theme", nextTheme);
});
if (reduceMotion || !("IntersectionObserver" in window)) {
  caseItems.forEach((item) => item.classList.add("visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  caseItems.forEach((item) => observer.observe(item));
}

function updateCaseBackToTop() {
  caseBackToTop?.classList.toggle("visible", window.scrollY > 550);
}

caseBackToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});
window.addEventListener("scroll", updateCaseBackToTop, { passive: true });
updateCaseBackToTop();
