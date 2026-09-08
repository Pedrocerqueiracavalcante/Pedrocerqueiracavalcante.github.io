/* ==========================================================================
   Pedro Cerqueira — Minimal interactions & animations
   ========================================================================== */

(function() {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Intersection Observer para fade-in ao scroll
  var observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('shown');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(function(el) {
      if (!reduced) {
        el.classList.add('hidden');
      }
      observer.observe(el);
    });
  }

  // Suavizar scroll ao clicar em links internos
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Active nav indicator ao scroll
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav a');

  if (navLinks.length && sections.length) {
    window.addEventListener('scroll', function() {
      var current = '';
      sections.forEach(function(section) {
        var sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(function(link) {
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === '#' + current) {
          link.setAttribute('aria-current', 'page');
        }
      });
    }, { passive: true });
  }

  // Timeout para garantir que tudo aparece se houver erro
  if ('IntersectionObserver' in window) {
    setTimeout(function() {
      document.querySelectorAll('.reveal.hidden:not(.shown)').forEach(function(el) {
        el.classList.add('shown');
      });
    }, 2000);
  }

})();
