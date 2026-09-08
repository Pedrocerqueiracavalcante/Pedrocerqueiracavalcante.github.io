/* ==========================================================================
   Pedro Cerqueira Cavalcante — portfólio
   Quatro comportamentos, sem dependências:
   menu no telemóvel, estado do cabeçalho, secção ativa e revelação ao scroll.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     1. Menu no telemóvel
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
      if (e.target.closest('a')) setOpen(false);
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
      if (window.innerWidth > 992 && nav.getAttribute('data-open') === 'true') setOpen(false);
    });
  }

  /* ---------------------------------------------------------------
     2. Cabeçalho ganha linha e opacidade depois do primeiro scroll
     --------------------------------------------------------------- */
  var header = document.getElementById('header');

  if (header) {
    var ticking = false;
    var syncHeader = function () {
      header.setAttribute('data-scrolled', window.scrollY > 8 ? 'true' : 'false');
      ticking = false;
    };

    syncHeader();
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(syncHeader);
    }, { passive: true });
  }

  /* ---------------------------------------------------------------
     3. Secção ativa na navegação (só na página inicial)
     --------------------------------------------------------------- */
  var links = nav ? nav.querySelectorAll('a[href^="#"]:not(.nav-cta)') : [];

  if (links.length && 'IntersectionObserver' in window) {
    var byId = {};
    var watched = [];

    Array.prototype.forEach.call(links, function (link) {
      var section = document.getElementById(link.getAttribute('href').slice(1));
      if (!section) return;
      byId[section.id] = link;
      watched.push(section);
    });

    var mark = function (id) {
      Array.prototype.forEach.call(links, function (link) { link.removeAttribute('aria-current'); });
      if (byId[id]) byId[id].setAttribute('aria-current', 'true');
    };

    var visible = {};
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });

      // A secção ativa é a primeira visível pela ordem do documento.
      for (var i = 0; i < watched.length; i++) {
        if (visible[watched[i].id]) { mark(watched[i].id); return; }
      }
    }, { rootMargin: '-30% 0px -60% 0px' });

    watched.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ---------------------------------------------------------------
     4. Revelação discreta ao entrar no ecrã.
     Sem suporte ou com movimento reduzido, mostra tudo de imediato.
     --------------------------------------------------------------- */
  var targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  var showAll = function () {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('shown'); });
  };

  if (!('IntersectionObserver' in window) || reduced) {
    showAll();
    return;
  }

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('shown');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });

  Array.prototype.forEach.call(targets, function (el) { revealObserver.observe(el); });

  // Rede de segurança: nada fica invisível por causa de um efeito.
  setTimeout(showAll, 2500);
})();
