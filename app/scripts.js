// scripts.js

// Run after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // ===========================
  // Smooth scrolling for nav
  // ===========================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ===========================
  // Scroll-based fade/slide animations
  // ===========================
  const animated = document.querySelectorAll(
    ".research-text, .media-container, .about-content"
  );
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!prefersReduced && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    animated.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      observer.observe(el);
    });
  }

  // ===========================
  // Make hero title white
  // ===========================
  const heroTitle = document.querySelector(".hero h1");
  if (heroTitle) {
    heroTitle.style.color = "#fff";
  }

  // ===========================
  // Hero parallax (light)
  // ===========================
  const hero = document.querySelector(".hero");
  let tickingParallax = false;

  function parallaxUpdate() {
    const scrolled =
      window.pageYOffset || document.documentElement.scrollTop || 0;
    if (hero) hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    tickingParallax = false;
  }

  function onScrollParallax() {
    if (prefersReduced) return;
    if (!tickingParallax) {
      tickingParallax = true;
      requestAnimationFrame(parallaxUpdate);
    }
  }
  window.addEventListener("scroll", onScrollParallax, { passive: true });

  // ===========================
  // Background zoom on scroll
  // ===========================
  const bg = document.querySelector(".scene-bg");
  const introSection = document.querySelector(".intro-section");
  let tickingZoom = false;

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function zoomUpdate() {
    if (!bg || !hero || !introSection) {
      tickingZoom = false;
      return;
    }

    const heroRect = hero.getBoundingClientRect();
    const heroBottom = heroRect.bottom; // px from viewport top to hero bottom

    // Start zoom when hero bottom hits top of viewport; finish after ~3/4 viewport more
    const start = 0;
    const end = window.innerHeight * 0.75;

    const rawProgress = 1 - (heroBottom - start) / (end - start);
    const progress = clamp(rawProgress, 0, 1);

    const minZoom = 1.0;
    const maxZoom = 1.2;
    const zoom = minZoom + (maxZoom - minZoom) * progress;

    bg.style.setProperty("--zoom", zoom.toFixed(4));
    tickingZoom = false;
  }

  function onScrollZoom() {
    if (prefersReduced) return;
    if (!tickingZoom) {
      tickingZoom = true;
      requestAnimationFrame(zoomUpdate);
    }
  }

  // Initial run + listeners (only if .scene-bg exists)
  if (bg) {
    zoomUpdate();
    window.addEventListener("scroll", onScrollZoom, { passive: true });
    window.addEventListener("resize", onScrollZoom);
  }
});
