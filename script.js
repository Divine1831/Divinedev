document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const progress = document.querySelector(".scroll-progress");
  const glow = document.querySelector(".cursor-glow");
  const year = document.querySelector("#year");

  if (year) year.textContent = new Date().getFullYear();

  menuButton?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  document.querySelectorAll(".nav-link, .nav-contact").forEach(link => {
    link.addEventListener("click", () => {
      nav?.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  const updateProgress = () => {
    if (!progress) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  if (glow && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("pointermove", event => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }


  // Small neon-green square cursor with fading pixel particles, as shown in the reference video.
  const customCursor = document.querySelector(".custom-cursor");
  const cursorTrail = document.querySelector(".cursor-trail");
  if (customCursor && cursorTrail && window.matchMedia("(pointer:fine)").matches) {
    document.body.classList.add("custom-cursor-active");
    let currentX = -100, currentY = -100, targetX = -100, targetY = -100;
    let frame = 0, lastParticleX = -100, lastParticleY = -100;
    const animateCursor = () => {
      currentX += (targetX - currentX) * 0.38;
      currentY += (targetY - currentY) * 0.38;
      customCursor.style.transform = `translate3d(${currentX - 4}px, ${currentY - 4}px, 0)`;
      if (Math.abs(targetX-currentX) > 0.15 || Math.abs(targetY-currentY) > 0.15) {
        frame = requestAnimationFrame(animateCursor);
      } else frame = 0;
    };
    const makeParticle = (x,y) => {
      const particle = document.createElement("span");
      particle.className = "cursor-particle";
      const size = 3 + Math.random() * 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x - size/2}px`;
      particle.style.top = `${y - size/2}px`;
      cursorTrail.appendChild(particle);
      particle.addEventListener("animationend", () => particle.remove(), {once:true});
    };
    window.addEventListener("pointermove", event => {
      targetX = event.clientX;
      targetY = event.clientY;
      customCursor.classList.add("cursor-visible");
      if (!frame) frame = requestAnimationFrame(animateCursor);
      const dx = targetX-lastParticleX, dy = targetY-lastParticleY;
      if (Math.hypot(dx,dy) > 9) {
        makeParticle(targetX,targetY);
        lastParticleX = targetX; lastParticleY = targetY;
      }
    }, {passive:true});
    window.addEventListener("blur", () => customCursor.classList.remove("cursor-visible"));
    window.addEventListener("focus", () => customCursor.classList.add("cursor-visible"));
    document.addEventListener("pointerover", event => {
      if (event.target.closest("a, button, .orbit-node")) customCursor.style.filter = "brightness(1.5) drop-shadow(0 0 12px #27f59a)";
      else customCursor.style.filter = "";
    });
  }

  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll(".nav-link").forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => sectionObserver.observe(section));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Hero role selector
  const roleButtons = document.querySelectorAll(".role-option");
  roleButtons.forEach(button => {
    button.addEventListener("click", () => {
      roleButtons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      const kicker = document.querySelector(".hero-kicker");
      if (kicker) kicker.textContent = button.dataset.role.toUpperCase() + " · DIGITAL BUILDER";
    });
  });

  // Interactive skill orbit labels
  const orbitNodes = document.querySelectorAll(".orbit-node");
  const orbitLabel = document.querySelector(".orbit-label");
  orbitNodes.forEach(node => {
    const showSkill = () => { if (orbitLabel) orbitLabel.textContent = node.dataset.skill; };
    const resetSkill = () => { if (orbitLabel) orbitLabel.textContent = "SKILLS"; };
    node.addEventListener("mouseenter", showSkill);
    node.addEventListener("focus", showSkill);
    node.addEventListener("mouseleave", resetSkill);
    node.addEventListener("blur", resetSkill);
  });

  // Floating back-to-top arrow appears after scrolling
  const backTop = document.querySelector(".back-to-top");
  const toggleBackTop = () => backTop?.classList.toggle("show", window.scrollY > 500);
  window.addEventListener("scroll", toggleBackTop, { passive: true });
  toggleBackTop();

});
