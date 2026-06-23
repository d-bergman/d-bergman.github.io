const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const themeButton = document.querySelector(".theme-toggle");
const backToTopButton = document.querySelector(".back-to-top");

document.querySelectorAll("img").forEach((image) => {
  image.draggable = false;
});

document.addEventListener("contextmenu", (event) => {
  if (event.target.closest("img, picture, .portrait-frame, .project-image, .personal-image, .image-preview-stage, .contact-section")) {
    event.preventDefault();
  }
});

document.addEventListener("dragstart", (event) => {
  if (event.target.closest("img, picture")) event.preventDefault();
});

function applyTheme(theme) {
  const useLightTheme = theme === "light";
  document.body.classList.toggle("light-theme", useLightTheme);
  themeButton?.setAttribute("aria-label", useLightTheme ? "Switch to dark theme" : "Switch to light theme");
}

const savedTheme = localStorage.getItem("portfolio-theme");
applyTheme(savedTheme || "dark");

themeButton?.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
  applyTheme(nextTheme);
  localStorage.setItem("portfolio-theme", nextTheme);
});

function closeMenu() {
  menuButton?.setAttribute("aria-expanded", "false");
  navigation?.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.querySelectorAll(".details-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const details = button.nextElementSibling;
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    details.classList.toggle("open", !isOpen);
  });
});

document.querySelectorAll("[data-dialog]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = document.getElementById(button.dataset.dialog);
    if (!dialog) return;
    dialog.showModal();
    document.body.classList.add("dialog-open");
  });
});

document.querySelectorAll(".project-dialog").forEach((dialog) => {
  dialog.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (!document.querySelector("dialog[open]")) document.body.classList.remove("dialog-open");
  });
});

const imagePreviewDialog = document.getElementById("image-preview-dialog");
const imagePreview = imagePreviewDialog?.querySelector("img");

document.querySelectorAll(".image-preview-open").forEach((button) => {
  button.addEventListener("click", () => {
    if (!imagePreviewDialog || !imagePreview) return;
    imagePreview.src = button.dataset.image;
    imagePreview.alt = button.dataset.imageAlt || "Full project screenshot";
    imagePreviewDialog.showModal();
  });
});

imagePreviewDialog?.querySelector(".image-preview-close")?.addEventListener("click", () => imagePreviewDialog.close());
imagePreviewDialog?.addEventListener("click", (event) => {
  if (event.target === imagePreviewDialog) imagePreviewDialog.close();
});
imagePreviewDialog?.addEventListener("close", () => {
  if (imagePreview) imagePreview.src = "";
});

const careerTrack = document.querySelector(".career-track");
const careerPrev = document.querySelector(".career-prev");
const careerNext = document.querySelector(".career-next");

function careerStep() {
  const slide = careerTrack?.querySelector(".career-slide");
  if (!slide) return 0;
  return slide.getBoundingClientRect().width + 22;
}

function updateCareerControls() {
  if (!careerTrack) return;
  careerPrev.disabled = careerTrack.scrollLeft <= 4;
  careerNext.disabled = careerTrack.scrollLeft >= careerTrack.scrollWidth - careerTrack.clientWidth - 4;
}

careerPrev?.addEventListener("click", () => careerTrack.scrollBy({ left: -careerStep(), behavior: "smooth" }));
careerNext?.addEventListener("click", () => careerTrack.scrollBy({ left: careerStep(), behavior: "smooth" }));
careerTrack?.addEventListener("scroll", updateCareerControls, { passive: true });

let dragStartX = 0;
let dragStartScroll = 0;
let draggingCareer = false;

careerTrack?.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button, a")) return;
  draggingCareer = true;
  dragStartX = event.clientX;
  dragStartScroll = careerTrack.scrollLeft;
  careerTrack.classList.add("dragging");
  careerTrack.setPointerCapture(event.pointerId);
});
careerTrack?.addEventListener("pointermove", (event) => {
  if (!draggingCareer) return;
  careerTrack.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
});
careerTrack?.addEventListener("pointerup", () => {
  draggingCareer = false;
  careerTrack.classList.remove("dragging");
});
careerTrack?.addEventListener("pointercancel", () => {
  draggingCareer = false;
  careerTrack.classList.remove("dragging");
});
window.addEventListener("resize", updateCareerControls);
updateCareerControls();

function updateBackToTop() {
  backToTopButton?.classList.toggle("visible", window.scrollY > 650);
}

backToTopButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
});
window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".site-nav a[href^='#']");

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });

sections.forEach((section) => sectionObserver.observe(section));

document.getElementById("year").textContent = new Date().getFullYear();
