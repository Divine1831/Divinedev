document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const themeToggle = document.querySelector(".theme-toggle");
  const progress = document.querySelector(".scroll-progress");

  // Mobile navigation
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");

    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation"
    );
  });

  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      nav?.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Theme
  const savedTheme = localStorage.getItem("divine-theme");

  if (savedTheme === "light") {
    document.body.classList.add("light");
  }

  function updateThemeIcon() {
    if (!themeToggle) return;

    themeToggle.innerHTML = document.body.classList.contains("light")
      ? '<i class="fa-solid fa-moon"></i>'
      : '<i class="fa-solid fa-sun"></i>';
  }

  updateThemeIcon();

  themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("light");

    localStorage.setItem(
      "divine-theme",
      document.body.classList.contains("light") ? "light" : "dark"
    );

    updateThemeIcon();
  });

  // Scroll progress
  function updateProgress() {
    if (!progress) return;

    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage =
      scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

    progress.style.width = `${percentage}%`;
  }

  window.addEventListener("scroll", updateProgress);
  updateProgress();

  // Reveal animations
  const revealElements = document.querySelectorAll(
    ".section, .hero-content, .hero-card, .skill-card, .project-card"
  );

  revealElements.forEach(element => {
    element.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(element => observer.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add("visible"));
  }

  // Active navigation link
  const sections = document.querySelectorAll("section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            document.querySelectorAll(".nav-link").forEach(link => {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${entry.target.id}`
              );
            });
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );

    sections.forEach(section => sectionObserver.observe(section));
  }

  // Back to top
  document.querySelector(".topBtn")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Current year
  const year = document.querySelector("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
});