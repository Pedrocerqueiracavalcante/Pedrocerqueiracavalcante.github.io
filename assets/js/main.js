/* =========================================================
   Pedro Cerqueira — portefólio
   Sem dependências. Três comportamentos: tema, revelação e ano.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- tema claro / escuro ---------- */
  var STORAGE_KEY = 'pc-theme';
  var root = document.documentElement;

  function stored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function save(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* modo privado */ }
  }

  // Aplica a escolha guardada (se houver). Sem escolha, manda o tema do sistema.
  var saved = stored();
  if (saved === 'dark' || saved === 'light') {
    root.setAttribute('data-theme', saved);
  }

  function currentIsDark() {
    var attr = root.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentIsDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      save(next);
      toggle.setAttribute('aria-label', next === 'dark'
        ? 'Mudar para tema claro'
        : 'Mudar para tema escuro');
    });
  }

  /* ---------- revelação ao entrar no ecrã ---------- */
  var alvos = document.querySelectorAll('.card, .project, .steps li, .stack-group, .section-head');

  var reduzMovimento = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduzMovimento) {
    // Sem suporte ou com movimento reduzido: mostra tudo, sem animação.
    Array.prototype.forEach.call(alvos, function (el) { el.classList.add('is-visible'); });
  } else {
    Array.prototype.forEach.call(alvos, function (el) { el.classList.add('reveal'); });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(alvos, function (el) { observer.observe(el); });
  }
})();
