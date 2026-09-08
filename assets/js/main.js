/* ========================================================================
   PEDRO CERQUEIRA — Portfolio Interactions
   Smooth, elegant interactions without excessive effects
   ======================================================================== */

(function() {
  'use strict';

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ====== Intersection Observer for scroll animations ====== */
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe animatable elements
    document.querySelectorAll('.project-card, .what-card, .tech-category').forEach((el) => {
      observer.observe(el);
    });
  } else if (!prefersReducedMotion) {
    // Fallback for older browsers
    document.querySelectorAll('.project-card, .what-card, .tech-category').forEach((el) => {
      el.classList.add('animated');
    });
  }

  /* ====== Smooth scroll for anchor links ====== */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });

      // Update active nav link
      updateActiveNav(href);
    });
  });

  /* ====== Active navigation sync with scroll ====== */
  function updateActiveNav(sectionId) {
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === sectionId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 300;
      const sectionHeight = section.clientHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    if (currentSection) {
      updateActiveNav('#' + currentSection);
    }
  }, { passive: true });

  /* ====== Navbar appearance on scroll ====== */
  const navbar = document.querySelector('.navbar');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.style.backgroundColor = 'rgba(10, 14, 39, 0.9)';
    } else {
      navbar.style.backgroundColor = 'rgba(10, 14, 39, 0.7)';
    }

    lastScrollY = scrollY;
  }, { passive: true });

  /* ====== Prevent layout shift from JS ====== */
  document.documentElement.classList.add('js-loaded');

})();
