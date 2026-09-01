/* ==========================================================================
   Pedro Cerqueira Cavalcante — portfólio
   Três comportamentos, sem dependências: tema, menu e revelação.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------------------------------------------------------------
     Tema claro / escuro
     Sem escolha guardada, manda a preferência do sistema.
     --------------------------------------------------------------- */
  var KEY = 'pc-theme';

  function readStored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  var saved = readStored();
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);

  function isDark() {
    var attr = root.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  var themeBtn = document.getElementById('theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* janela privada */ }
      themeBtn.setAttribute('aria-label',
        next === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro');
    });
  }

  /* ---------------------------------------------------------------
     Menu no telemóvel
     --------------------------------------------------------------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    var setOpen = function (open) {
      nav.setAttribute('data-open', open ? 'true' : 'false');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };

    burger.addEventListener('click', function () {
      setOpen(nav.getAttribute('data-open') !== 'true');
    });

    // Fecha ao escolher um destino.
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });

    // Fecha com Escape, e devolve o foco ao botão.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.getAttribute('data-open') === 'true') {
        setOpen(false);
        burger.focus();
      }
    });

    // Se a janela crescer para além do ponto de rutura, o menu deixa de fazer sentido.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 864 && nav.getAttribute('data-open') === 'true') setOpen(false);
    });
  }

  /* ---------------------------------------------------------------
     Revelação discreta ao entrar no ecrã.
     Só se aplica quando há suporte e o utilizador não pediu menos movimento;
     caso contrário o conteúdo fica simplesmente visível.
     --------------------------------------------------------------- */
  var targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduced) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('shown'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('shown');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });

  Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
})();
