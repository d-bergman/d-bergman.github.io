const caseItems = document.querySelectorAll(".case-reveal");
const caseBackToTop = document.querySelector(".case-back-to-top");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
