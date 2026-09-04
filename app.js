const body = document.body;
const hero = document.querySelector(".hero");
const sections = [...document.querySelectorAll("[data-section]")];
const links = [...document.querySelectorAll("[data-section-link]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateJourney() {
  const progress = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.72)));
  hero.style.setProperty("--journey-progress", progress.toFixed(3));
  body.classList.toggle("is-scrolled", progress > 0.16);
}

if (!reducedMotion) {
  updateJourney();
  window.addEventListener("scroll", updateJourney, { passive: true });
}

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;

  links.forEach((link) => {
    const active = link.getAttribute("href") === "#" + visible.target.id;
    link.classList.toggle("is-active", active);
    active ? link.setAttribute("aria-current", "true") : link.removeAttribute("aria-current");
  });
}, { rootMargin: "-35% 0px -45% 0px", threshold: [0.1, 0.45, 0.8] });

sections.forEach((section) => sectionObserver.observe(section));

if (!reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}