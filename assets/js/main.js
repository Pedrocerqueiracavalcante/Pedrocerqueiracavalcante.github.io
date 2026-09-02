/* ==========================================================================
   Pedro Cerqueira Cavalcante — portfólio
   Dois comportamentos, sem dependências: menu e revelação ao scroll.
   ========================================================================== */
(function () {
  'use strict';

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

    // Fecha com Escape e devolve o foco ao botão.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.getAttribute('data-open') === 'true') {
        setOpen(false);
        burger.focus();
      }
    });

    // Acima do ponto de rutura o menu deixa de fazer sentido.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 896 && nav.getAttribute('data-open') === 'true') setOpen(false);
    });
  }

  /* ---------------------------------------------------------------
     Revelação discreta ao entrar no ecrã.
     Sem suporte ou com movimento reduzido, mostra tudo de imediato.
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

  // Rede de segurança: nada fica invisível por causa de um efeito.
  setTimeout(function () {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('shown'); });
  }, 2500);
})();
