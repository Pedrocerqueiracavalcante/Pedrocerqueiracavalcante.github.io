/* ========================================================================
   PEDRO CERQUEIRA — Interactions & Animations
   Subtle, elegant interactions without AI clichés
   ======================================================================== */

(function() {
  'use strict';

  /* Check if reduced motion is preferred */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ====== Intersection Observer for fade-in animations ====== */
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with animation
    document.querySelectorAll('.project-card').forEach((el) => {
      observer.observe(el);
    });
  }

  /* ====== Smooth scroll for anchor links ====== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Update active nav link
      updateActiveNav(href);
    });
  });

  /* ====== Active navigation indicator ====== */
  function updateActiveNav(sectionId) {
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === sectionId) {
        link.classList.add('active');
      }
    });
  }

  /* ====== Navbar background on scroll ====== */
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
      navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
      navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    }

    /* Update active section */
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 200;
      const sectionHeight = section.clientHeight;

      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    if (currentSection) {
      updateActiveNav('#' + currentSection);
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, { passive: true });

  /* ====== Prevent flash of unstyled content ====== */
  document.documentElement.classList.add('js-loaded');

  /* ====== Mobile menu toggle (if needed) ====== */
  const navbar_toggle = document.querySelector('.navbar-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navbar_toggle && navMenu) {
    navbar_toggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navbar_toggle.setAttribute('aria-expanded',
        navMenu.classList.contains('active'));
    });

    /* Close menu on link click */
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navbar_toggle.setAttribute('aria-expanded', 'false');
      });
    });

    /* Close menu on escape */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navbar_toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ====== Respect reduced motion ====== */
  if (prefersReducedMotion) {
    document.querySelectorAll('[style*="animation"]').forEach((el) => {
      el.style.animation = 'none';
    });
  }

})();
