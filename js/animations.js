/* ==========================================================================
   animations.js — Scroll reveals, heading text reveal, hero parallax,
   scroll progress, card spotlight and page transitions
   --------------------------------------------------------------------------
   - Respects prefers-reduced-motion: nothing is hidden or animated for those
     visitors (the html.js-anim class is simply never added).
   - Fails safe: if anything throws, the class is removed so all content shows.
   - To animate a new element, add its selector to REVEALS below.
   ========================================================================== */
(function () {
  "use strict";

  window.__animReady = true;                     // tells the inline safety timer in <head> we loaded
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---- What gets revealed ------------------------------------------------
     [selector, variant, first delay (ms), stagger between siblings (ms)]
     Variants: up (default) | left | right | scale | fade                      */
  var REVEALS = [
    // Hero (plays on load)
    [".hero__content > *:not(.hero__title)", "up", 380, 90],
    [".hero__visual", "scale", 300, 0],
    [".hero__scroll-wrap", "fade", 1300, 0],
    // Shared section pattern
    [".section__head > *:not(h2)", "up", 120, 80],
    // Homepage
    [".about__story > *:not(h2):not(.eyebrow)", "up", 100, 90],
    [".about__story > .eyebrow", "up", 0, 0],
    [".about__cards > .card", "up", 80, 110],
    [".about__interests", "up", 0, 0],
    [".skill-card", "up", 60, 130],
    [".skill", "up", 150, 70],
    [".project", "up", 0, 0],
    [".creative__item", "up", 60, 130],
    [".education__intro > *:not(h2)", "up", 0, 90],
    [".timeline__item", "up", 150, 0],
    [".contact__intro > *:not(h2)", "up", 80, 90],
    [".contact-links > li", "up", 150, 80],
    [".contact-form", "up", 120, 0],
    // Inner pages
    [".page-hero__text > *:not(h1)", "up", 250, 90],
    [".page-hero__portrait", "scale", 250, 0],
    [".about-page__intro .stack > *:not(h2):not(.eyebrow)", "up", 80, 90],
    [".glance", "up", 150, 0],
    [".interest-grid > .card", "up", 60, 100],
    [".about-page__more", "up", 0, 0],
    [".cta__inner > *", "up", 0, 120],
    [".pd__head > *:not(h2)", "up", 0, 80],
    [".pd__main > .pd__block", "up", 60, 100],
    [".pd__aside", "up", 150, 0],
    [".pd__gallery-wrap > .stat-label", "up", 0, 0],
    [".pd__shot", "up", 60, 110],
    // Footer
    [".site-footer__top > *", "up", 0, 120]
  ];

  /* Headings that reveal word by word: [selector, first delay (ms)] */
  var SPLITS = [
    [".hero__title", 180],
    [".section__head h2", 0],
    [".about__story h2", 0],
    [".education__intro h2", 0],
    [".contact__intro h2", 0],
    [".page-hero__title", 120],
    [".about-page__intro h2", 0],
    [".pd__head h2", 0],
    [".cta h2", 0]
  ];

  /* ---- Reveal on scroll -------------------------------------------------- */
  function splitWords(el, base) {
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement("span"); w.className = "word";
            var inner = document.createElement("span"); inner.className = "word__inner";
            inner.style.setProperty("--i", String(n++));
            inner.textContent = part;
            w.appendChild(inner); frag.appendChild(w);
          });
          child.parentNode.replaceChild(frag, child);
        } else if (child.nodeType === 1 && !child.classList.contains("word")) {
          walk(child);
        }
      });
    })(el);
    el.setAttribute("data-split", "");
    el.style.setProperty("--base", base + "ms");
  }

  function setupReveal() {
    var targets = [];

    SPLITS.forEach(function (s) {
      document.querySelectorAll(s[0]).forEach(function (el) {
        if (el.hasAttribute("data-split")) return;
        splitWords(el, s[1]); targets.push(el);
      });
    });

    REVEALS.forEach(function (r) {
      var groups = new Map();                              // stagger within each parent
      document.querySelectorAll(r[0]).forEach(function (el) {
        if (el.hasAttribute("data-reveal") || el.hasAttribute("data-split")) return;
        var list = groups.get(el.parentElement) || [];
        list.push(el); groups.set(el.parentElement, list);
      });
      groups.forEach(function (list) {
        list.forEach(function (el, i) {
          el.setAttribute("data-reveal", r[1] === "up" ? "" : r[1]);
          el.style.setProperty("--d", (r[2] + i * r[3]) + "ms");
          targets.push(el);
        });
      });
    });

    if (!("IntersectionObserver" in window)) { targets.forEach(show); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        show(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  }

  function show(el) {
    el.classList.add("is-visible");
    if (el.hasAttribute("data-split")) return;
    // Once it has appeared, drop the reveal hook so hover transitions are not delayed
    var wait = (parseFloat(el.style.getPropertyValue("--d")) || 0) + 900;
    window.setTimeout(function () {
      el.removeAttribute("data-reveal");
      el.classList.remove("is-visible");
      el.style.removeProperty("--d");
    }, wait);
  }

  /* ---- Scroll progress bar ---------------------------------------------- */
  function setupProgress() {
    var bar = document.createElement("div");
    bar.className = "scroll-progress"; bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    var ticking = false;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty("--p", max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : "0");
      ticking = false;
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---- Hero pointer parallax (mouse/trackpad only) ----------------------- */
  function setupParallax() {
    var hero = document.querySelector(".hero");
    if (!hero || !finePointer) return;
    var tx = 0, ty = 0, x = 0, y = 0, raf = null;
    function loop() {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      hero.style.setProperty("--px", x.toFixed(3)); hero.style.setProperty("--py", y.toFixed(3));
      raf = (Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001) ? requestAnimationFrame(loop) : null;
    }
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hero.addEventListener("pointerleave", function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
  }

  /* ---- Card spotlight ---------------------------------------------------- */
  function setupSpotlight() {
    if (!finePointer) return;
    document.querySelectorAll(".card--interactive, .skill-card, .creative__item").forEach(function (el) {
      el.classList.add("has-spotlight");
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---- Fade out before moving to another page ---------------------------- */
  function setupPageTransitions() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download") || (a.protocol !== "http:" && a.protocol !== "https:" && a.protocol !== "file:")) return;
      if (a.origin !== location.origin) return;
      if (a.pathname === location.pathname && (a.hash || a.search === location.search)) return;   // same-page jump
      e.preventDefault();
      document.body.classList.add("is-leaving");
      window.setTimeout(function () { window.location.href = a.href; }, 230);
    });
    window.addEventListener("pageshow", function (e) { if (e.persisted) document.body.classList.remove("is-leaving"); });
  }

  /* ---- Start ------------------------------------------------------------- */
  function init() {
    try {
      setupProgress();
      if (reduce) return;                       // no hidden states, no motion
      setupReveal();
      setupParallax();
      setupSpotlight();
      setupPageTransitions();
    } catch (err) {
      root.classList.remove("js-anim");         // fail safe: show everything
      if (window.console) console.error("animations.js:", err);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
