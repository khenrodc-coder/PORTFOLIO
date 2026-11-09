/* ==========================================================================
   navigation.js — Shared header + footer, mobile menu, active-link tracking
   --------------------------------------------------------------------------
   One source of truth: the header and footer are rendered from the templates
   below on every page, so editing a link here updates the whole site.

   Each page declares its context on <body>:
     data-page="home | about | projects | contact"
     data-root=""      (pages in the project root)
     data-root="../"   (pages inside /pages)
   and provides two mount points: <header id="site-header"> and
   <footer id="site-footer">.
   ========================================================================== */

(function () {
  "use strict";

  /* ---- Edit navigation here --------------------------------------------
     key      : matches data-page when that item has its own page
     section  : id of the section on the homepage
     page     : optional dedicated page (relative to project root)          */
  var NAV_ITEMS = [
    { label: "Home",           key: "home",     section: "home" },
    { label: "About",          key: "about",    section: "about",          page: "pages/about.html" },
    { label: "Expertise",      key: "expertise", section: "expertise" },
    { label: "Projects",       key: "projects", section: "projects",       page: "pages/projects.html" },
    { label: "Creative Works", key: "creative", section: "creative-works" },
    { label: "Contact",        key: "contact",  section: "contact",        page: "pages/contact.html" }
  ];
  var RESUME_PATH = "assets/documents/resume.pdf";
  var DESKTOP_QUERY = "(min-width: 64em)";

  var body = document.body;
  var currentPage = body.getAttribute("data-page") || "home";
  var root = body.getAttribute("data-root") || "";
  var isHome = currentPage === "home";

  /* ---- Helpers ---------------------------------------------------------- */
  function hrefFor(item) {
    if (isHome) return "#" + item.section;
    if (item.key === "home") return root + "index.html";
    if (item.page) return root + item.page;
    return root + "index.html#" + item.section;
  }

  function logoSvg() {
    return '<svg class="brand__mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
      '<rect x="1" y="1" width="46" height="46" rx="12" fill="var(--color-surface)" stroke="var(--color-border-strong)"/>' +
      '<g fill="none" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M11 13v22M11 24l10-11M11 24l10 11" stroke="var(--color-text)"/>' +
      '<path d="M41 16.5A9 9 0 1 0 41 31.5" stroke="var(--color-accent)"/></g></svg>';
  }

  function linkList(extraClass) {
    return NAV_ITEMS.map(function (item) {
      var current = (!isHome && item.key === currentPage) ? ' aria-current="page"' : "";
      return '<li><a class="' + extraClass + '" href="' + hrefFor(item) + '" data-nav-key="' +
        item.key + '" data-section="' + item.section + '"' + current + ">" + item.label + "</a></li>";
    }).join("");
  }

  function socialList() {
    var C = window.PORTFOLIO_CONTACT;               // defined in js/contact.js
    if (!C) return "";
    var items = '<li><a class="social-list__link" href="mailto:' + C.email + '" aria-label="Email"><span aria-hidden="true">' + C.icon("mail") + "</span></a></li>";
    items += C.socials.map(function (s) {
      return '<li><a class="social-list__link" href="' + s.url + '" target="_blank" rel="noopener noreferrer" aria-label="' +
        s.name + ' (opens in a new tab)"><span aria-hidden="true">' + C.icon(s.icon) + "</span></a></li>";
    }).join("");
    return '<ul class="social-list" role="list">' + items + "</ul>";
  }

  /* ---- Templates -------------------------------------------------------- */
  function headerTemplate() {
    return '' +
      '<div class="site-header__inner container container--wide">' +
        '<a class="brand" href="' + (isHome ? "#home" : root + "index.html") + '" aria-label="Khen Rod S. Canlas — home">' +
          logoSvg() + '<span class="brand__name">Khen Rod S. Canlas</span>' +
        '</a>' +
        '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="Open menu">' +
          '<span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>' +
        '</button>' +
        '<div class="site-menu" id="site-menu">' +
          '<nav class="site-nav" aria-label="Primary">' +
            '<ul class="site-nav__list" role="list">' + linkList("site-nav__link") + '</ul>' +
          '</nav>' +
          '<a class="btn btn--secondary btn--sm site-menu__resume" href="' + root + RESUME_PATH + '" target="_blank" rel="noopener" aria-label="Resume (PDF, opens in a new tab)">' +
            'Resume' +
            '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/></svg>' +
          '</a>' +
        '</div>' +
      '</div>';
  }

  function footerTemplate() {
    return '' +
      '<div class="container container--wide">' +
        '<div class="site-footer__top">' +
          '<div class="site-footer__brand">' +
            '<a class="brand" href="' + (isHome ? "#home" : root + "index.html") + '" aria-label="Khen Rod S. Canlas — home">' +
              logoSvg() + '<span class="brand__name">Khen Rod S. Canlas</span></a>' +
            '<p class="text-muted text-sm">Aspiring Front-End Developer and Computer Science student at Holy Cross College.</p>' +
            socialList() +
          '</div>' +
          '<nav class="site-footer__nav" aria-label="Footer">' +
            '<ul class="site-footer__list" role="list">' + linkList("site-footer__link") + '</ul>' +
          '</nav>' +
        '</div>' +
        '<div class="site-footer__bottom">' +
          '<p class="text-sm text-muted">&copy; <span data-year>' + new Date().getFullYear() + '</span> Khen Rod S. Canlas. Built with HTML, CSS and vanilla JavaScript.</p>' +
          '<a class="link-arrow" href="#top">Back to top ' +
            '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>' +
          '</a>' +
        '</div>' +
      '</div>';
  }

  /* ---- Render ----------------------------------------------------------- */
  var headerEl = document.getElementById("site-header");
  var footerEl = document.getElementById("site-footer");
  if (headerEl) { headerEl.classList.add("site-header"); headerEl.innerHTML = headerTemplate(); }
  if (footerEl) { footerEl.classList.add("site-footer"); footerEl.innerHTML = footerTemplate(); }
  if (!headerEl) return;

  var toggle = headerEl.querySelector(".nav-toggle");
  var menu = headerEl.querySelector(".site-menu");
  var desktop = window.matchMedia(DESKTOP_QUERY);
  var inertTargets = [document.getElementById("main"), footerEl].filter(Boolean);

  /* ---- Mobile menu ------------------------------------------------------ */
  function setOpen(open, returnFocus) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    headerEl.classList.toggle("is-open", open);
    body.classList.toggle("nav-open", open);
    inertTargets.forEach(function (el) { el.inert = open; });
    if (!open && returnFocus) toggle.focus();
  }
  function isOpen() { return toggle.getAttribute("aria-expanded") === "true"; }

  toggle.addEventListener("click", function () { setOpen(!isOpen()); });

  // Close after choosing a link (hash links keep the page, so the menu must close)
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a") && isOpen()) setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (!isOpen()) return;
    if (e.key === "Escape") { setOpen(false, true); return; }
    if (e.key === "Tab") {                         // keep focus inside header while open
      var f = headerEl.querySelectorAll("a[href], button:not([disabled])");
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  function onBreakpoint() { if (desktop.matches && isOpen()) setOpen(false); }
  if (desktop.addEventListener) desktop.addEventListener("change", onBreakpoint);
  else desktop.addListener(onBreakpoint);

  /* ---- Header shadow once scrolled ------------------------------------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      headerEl.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Active section indicator (homepage only) ------------------------- */
  if (isHome && "IntersectionObserver" in window) {
    var links = {};
    headerEl.querySelectorAll(".site-nav__link").forEach(function (a) { links[a.getAttribute("data-section")] = a; });
    // Watch every top-level section; ones without a nav link (e.g. Education) clear the highlight
    var sections = Array.prototype.slice.call(document.querySelectorAll("main > section[id]"));

    function activate(id) {
      Object.keys(links).forEach(function (k) {
        if (k === id) links[k].setAttribute("aria-current", "location");
        else links[k].removeAttribute("aria-current");
      });
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) activate(entry.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { observer.observe(s); });
    activate("home");
  }

  /* ---- Move keyboard focus to the target after an in-page jump ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    var target = id && id !== "top" ? document.getElementById(id) : null;
    if (target) {
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  });
})();
