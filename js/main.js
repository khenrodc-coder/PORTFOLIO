/* ==========================================================================
   main.js — Renders data-driven sections from js/data/*.js
   Requires (loaded earlier, with defer): js/data/skills.js, js/data/projects.js
   Renders skills, projects, project details, creative works, the skills
   marquee and the screenshot lightbox.
   ========================================================================== */
(function () {
  "use strict";

  var DATA = window.PORTFOLIO_DATA || {};

  /* Lucide-style 24x24 stroke icons, keyed by name */
  var ICONS = {
    monitor:   '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
    server:    '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
    palette:   '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
    code:      '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    layout:    '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/>',
    braces:    '<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>',
    wind:      '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2m10.6 11.4A2 2 0 1 0 14 16H2"/>',
    terminal:  '<path d="m4 17 6-6-6-6M12 19h8"/>',
    flask:     '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2M8.5 2h7M7 16h10"/>',
    database:  '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"/>',
    dashboard: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    pen:       '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    film:      '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18M3 7.5h4M3 12h18M3 16.5h4M17 3v18M17 7.5h4M17 16.5h4"/>'
  };

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" focusable="false">' + (ICONS[name] || ICONS.code) + "</svg>";
  }

  /* ---- Expertise / skills ----------------------------------------------- */
  function renderSkills() {
    var mount = document.querySelector("[data-skills]");
    var categories = DATA.skills;
    if (!mount || !categories || !categories.length) return;

    mount.innerHTML = categories.map(function (cat) {
      var items = cat.skills.map(function (s) {
        return '<li class="skill">' +
          '<span class="skill__icon" aria-hidden="true">' + icon(s.icon) + "</span>" +
          '<span class="skill__text"><span class="skill__name">' + esc(s.name) + "</span>" +
          '<span class="skill__note">' + esc(s.note) + "</span></span></li>";
      }).join("");

      return '<article class="card skill-card skill-card--' + esc(cat.id) + '" aria-labelledby="skills-' + esc(cat.id) + '">' +
        '<header class="skill-card__head">' +
          '<span class="card__icon" aria-hidden="true">' + icon(cat.icon) + "</span>" +
          '<h3 class="card__title" id="skills-' + esc(cat.id) + '">' + esc(cat.title) + "</h3>" +
        "</header>" +
        '<ul class="skill-list" role="list">' + items + "</ul></article>";
    }).join("");
  }


  /* ---- Featured projects ------------------------------------------------ */
  var ROOT = document.body.getAttribute("data-root") || "";

  function projectCard(p, index, total) {
    var items = [{ src: p.thumbnail, alt: p.thumbnailAlt, caption: p.thumbnailCaption || "Screenshot 1" }]
      .concat(p.screenshots || []);
    var first = items[0];
    var num = ("0" + (index + 1)).slice(-2) + " / " + ("0" + total).slice(-2);

    var thumbs = items.map(function (it, i) {
      var label = (it.caption || "Screenshot " + (i + 1));
      var inner = it.src
        ? '<img src="' + esc(ROOT + it.src) + '" alt="" loading="lazy" decoding="async" width="160" height="90">'
        : '<span class="project__thumb-empty" aria-hidden="true">' + (i + 1) + "</span>";
      return '<button class="project__thumb" type="button" data-index="' + i + '" aria-pressed="' + (i === 0) + '" ' +
        'aria-label="Show: ' + esc(p.name + " – " + label) + '">' + inner + "</button>";
    }).join("");

    var features = p.features.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("");
    var tags = p.technologies.map(function (t) { return '<li class="tag">' + esc(t) + "</li>"; }).join("");

    var live = p.liveUrl
      ? '<a class="btn btn--primary" href="' + esc(p.liveUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(p.liveLabel || "View Project") + ' <span class="sr-only">(opens in a new tab)</span>' +
        '<svg class="icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a>'
      : '<button class="btn btn--primary" type="button" aria-disabled="true" aria-describedby="note-' + esc(p.id) + '">View Project</button>' +
        '<span class="project__note" id="note-' + esc(p.id) + '">Live link coming soon</span>';

    return '<article class="project" id="' + esc(p.id) + '" aria-labelledby="title-' + esc(p.id) + '" data-project="' + esc(p.id) + '">' +
      '<div class="project__media">' +
        '<div class="project__stage media">' +
          '<img class="project__img" src="' + esc(ROOT + first.src) + '" alt="' + esc(first.alt || "") + '" width="1600" height="900" loading="lazy" decoding="async">' +
          '<div class="project__ph placeholder" data-label="" hidden></div>' +
        "</div>" +
        '<div class="project__thumbs-row">' +
          '<div class="project__thumbs" role="group" aria-label="' + esc(p.name) + ' screenshots">' + thumbs + "</div>" +
          '<span class="stat-label project__caption" aria-live="polite">' + esc(first.caption || "") + "</span>" +
        "</div>" +
      "</div>" +
      '<div class="project__info">' +
        '<div class="cluster project__meta"><span class="index-num">' + num + '</span><span class="tag tag--accent">' + esc(p.type) + "</span></div>" +
        '<div class="project__heading"><h3 class="project__title" id="title-' + esc(p.id) + '">' + esc(p.name) + "</h3>" +
          '<p class="project__full">' + esc(p.fullName) + "</p></div>" +
        '<p class="text-soft">' + esc(p.description) + "</p>" +
        '<div class="project__block"><h4 class="stat-label">Problem addressed</h4><p class="text-muted">' + esc(p.problem) + "</p></div>" +
        '<div class="project__block"><h4 class="stat-label">Key features</h4><ul class="project__features" role="list">' + features + "</ul></div>" +
        '<div class="project__block"><h4 class="stat-label">Technologies</h4><ul class="tag-list" role="list">' + tags + "</ul></div>" +
        '<div class="cluster project__actions">' + live +
          '<a class="btn btn--secondary" href="' + esc(ROOT + p.detailsUrl) + '">View Details</a></div>' +
      "</div></article>";
  }

  function bindGallery(card, p) {
    var items = [{ src: p.thumbnail, alt: p.thumbnailAlt, caption: p.thumbnailCaption || "Screenshot 1" }]
      .concat(p.screenshots || []);
    var stage = card.querySelector(".project__stage");
    var img = card.querySelector(".project__img");
    var ph = card.querySelector(".project__ph");
    var caption = card.querySelector(".project__caption");
    var buttons = card.querySelectorAll(".project__thumb");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var it = items[Number(btn.getAttribute("data-index"))];
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        // Extra screenshots show whole (contain) over their own colour; the cover image fills the frame
        stage.style.background = it.bg || "";
        img.style.objectFit = it.bg ? "contain" : "";
        if (it.src) {
          img.src = ROOT + it.src; img.alt = it.alt || ""; img.hidden = false; ph.hidden = true;
        } else {
          img.hidden = true; ph.hidden = false; ph.setAttribute("data-label", it.label || "Screenshot");
        }
        caption.textContent = it.caption || "";
      });
    });
  }

  function renderProjects() {
    var mount = document.querySelector("[data-projects]");
    var list = DATA.projects;
    if (!mount || !list || !list.length) return;
    mount.innerHTML = list.map(function (p, i) { return projectCard(p, i, list.length); }).join("");
    list.forEach(function (p) { bindGallery(mount.querySelector('[data-project="' + p.id + '"]'), p); });
  }

  /* ---- Creative works --------------------------------------------------- */
  function creativeCard(c) {
    var arrow = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
    var play = '<span class="creative__play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z"/></svg></span>';
    var id = esc(c.id);
    var href = c.href ? (/^https?:/.test(c.href) ? c.href : ROOT + c.href) : "";
    var media, link = "";

    if (c.kind === "placeholder") {
      media = '<div class="creative__media creative__media--empty media placeholder" data-label="' + esc(c.label || c.title) + '"></div>';
    } else {
      media = '<a class="creative__media media" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true"' +
        (c.aspect ? ' style="aspect-ratio: ' + esc(c.aspect) + '"' : "") + ">" +
        '<img src="' + esc(ROOT + c.image) + '" alt="' + esc(c.imageAlt || "") + '" width="1600" height="1067" loading="lazy" decoding="async">' +
        (c.kind === "video" ? play : "") + "</a>";
      link = '<a class="link-arrow" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' + esc(c.linkLabel || "View") +
        ' <span class="sr-only">(opens in a new tab)</span>' + arrow + "</a>";
    }

    return '<article class="card card--flush creative__item creative__item--' + esc(c.kind) + '" aria-labelledby="creative-' + id + '">' +
      media +
      '<div class="creative__body">' +
        '<div class="cluster"><span class="tag tag--accent">' + esc(c.category) + "</span></div>" +
        '<h3 class="card__title" id="creative-' + id + '">' + esc(c.title) + "</h3>" +
        '<p class="card__body">' + esc(c.description) + "</p>" +
        (c.note ? '<p class="text-sm text-muted">' + esc(c.note) + "</p>" : "") +
        link +
      "</div></article>";
  }

  function renderCreative() {
    var mount = document.querySelector("[data-creative]");
    var list = DATA.creative;
    if (!mount || !list || !list.length) return;
    mount.innerHTML = list.map(creativeCard).join("");
  }

  /* ---- Projects page: full project details ------------------------------ */
  function listItems(arr) { return (arr || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join(""); }

  function detailGallery(p) {
    var shots = [{ src: p.thumbnail, alt: p.thumbnailAlt, caption: p.thumbnailCaption || "Screenshot" }].concat(p.screenshots || []);
    return shots.map(function (it) {
      if (!it.src) {
        return '<figure class="pd__shot"><div class="media placeholder" data-label="' + esc(it.label || "Screenshot") + '"></div>' +
          "<figcaption>" + esc(it.caption || "") + "</figcaption></figure>";
      }
      return '<figure class="pd__shot"><a class="pd__shot-link" href="' + esc(ROOT + it.src) + '" data-lightbox="' + esc(p.id) + '" ' +
        'data-caption="' + esc(p.name + ": " + (it.caption || "")) + '" aria-label="Enlarge screenshot: ' + esc(it.caption || p.name) + '">' +
        '<span class="media pd__shot-media"' + (it.bg ? ' style="background:' + esc(it.bg) + '"' : "") + ">" +
        '<img src="' + esc(ROOT + it.src) + '" alt="' + esc(it.alt || "") + '" loading="lazy" decoding="async"></span></a>' +
        "<figcaption>" + esc(it.caption || "") + "</figcaption></figure>";
    }).join("");
  }

  function projectDetail(p, index, total) {
    var id = esc(p.id);
    var num = ("0" + (index + 1)).slice(-2) + " / " + ("0" + total).slice(-2);
    var live = p.liveUrl
      ? '<a class="btn btn--primary" href="' + esc(p.liveUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(p.liveLabel || "View Project") +
        ' <span class="sr-only">(opens in a new tab)</span><svg class="icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></a>'
      : '<button class="btn btn--primary" type="button" aria-disabled="true" aria-describedby="pd-note-' + id + '">View Project</button>' +
        '<span class="project__note" id="pd-note-' + id + '">Live link coming soon</span>';

    return '<section class="pd" id="' + id + '" aria-labelledby="pd-title-' + id + '">' +
      '<header class="pd__head">' +
        '<div class="cluster"><span class="index-num">' + num + '</span><span class="tag tag--accent">' + esc(p.type) + "</span></div>" +
        '<h2 class="pd__title" id="pd-title-' + id + '">' + esc(p.name) + "</h2>" +
        '<p class="pd__full">' + esc(p.fullName) + "</p>" +
        '<p class="lead">' + esc(p.description) + "</p>" +
        '<div class="cluster">' + live + "</div>" +
      "</header>" +
      '<div class="pd__body">' +
        '<div class="pd__main">' +
          '<div class="pd__block"><h3 class="stat-label">Problem addressed</h3><p class="text-soft">' + esc(p.problem) + "</p></div>" +
          '<div class="pd__block"><h3 class="stat-label">Objectives</h3><ul class="project__features" role="list">' + listItems(p.objectives) + "</ul></div>" +
          '<div class="pd__block"><h3 class="stat-label">What it includes</h3><ul class="project__features" role="list">' + listItems(p.highlights) + "</ul></div>" +
        "</div>" +
        '<aside class="pd__aside" aria-label="' + esc(p.name) + ' summary">' +
          '<div class="pd__block"><h3 class="stat-label">Key features</h3><ul class="project__features" role="list">' + listItems(p.features) + "</ul></div>" +
          '<div class="pd__block"><h3 class="stat-label">Technologies</h3><ul class="tag-list" role="list">' +
            (p.technologies || []).map(function (t) { return '<li class="tag">' + esc(t) + "</li>"; }).join("") + "</ul></div>" +
        "</aside>" +
      "</div>" +
      '<div class="pd__gallery-wrap"><h3 class="stat-label">Screenshots</h3><div class="pd__gallery">' + detailGallery(p) + "</div></div>" +
    "</section>";
  }

  function renderProjectDetails() {
    var mount = document.querySelector("[data-project-details]");
    var list = DATA.projects;
    if (!mount || !list || !list.length) return;
    mount.innerHTML = list.map(function (p, i) { return projectDetail(p, i, list.length); }).join("");
  }

  /* ---- Screenshot lightbox (native <dialog>) ---------------------------- */
  function initLightbox() {
    var links = Array.prototype.slice.call(document.querySelectorAll("a[data-lightbox]"));
    if (!links.length || typeof HTMLDialogElement === "undefined") return;   // without <dialog>, links just open the image

    var dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    dlg.setAttribute("aria-label", "Screenshot viewer");
    dlg.innerHTML =
      '<div class="lightbox__bar"><p class="lightbox__caption" aria-live="polite"></p>' +
      '<button class="lightbox__btn" type="button" data-act="prev" aria-label="Previous screenshot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button>' +
      '<button class="lightbox__btn" type="button" data-act="next" aria-label="Next screenshot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button>' +
      '<button class="lightbox__btn" type="button" data-act="close" aria-label="Close viewer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>' +
      '<img class="lightbox__img" alt="">';
    document.body.appendChild(dlg);

    var img = dlg.querySelector(".lightbox__img");
    var cap = dlg.querySelector(".lightbox__caption");
    var group = [], at = 0, opener = null;

    function show(i) {
      at = (i + group.length) % group.length;
      var a = group[at];
      img.src = a.getAttribute("href");
      img.alt = (a.querySelector("img") || {}).alt || "";
      cap.textContent = a.getAttribute("data-caption") || "";
      dlg.querySelectorAll('[data-act="prev"],[data-act="next"]').forEach(function (b) { b.hidden = group.length < 2; });
    }
    function open(a) {
      opener = a;
      group = links.filter(function (l) { return l.getAttribute("data-lightbox") === a.getAttribute("data-lightbox"); });
      show(group.indexOf(a));
      dlg.showModal();
    }

    links.forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); open(a); }); });
    dlg.addEventListener("click", function (e) {
      var act = e.target.closest("[data-act]");
      if (act) { var k = act.getAttribute("data-act"); if (k === "close") dlg.close(); else show(at + (k === "next" ? 1 : -1)); }
      else if (e.target === dlg) dlg.close();                       // click on the backdrop
    });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(at + 1);
      if (e.key === "ArrowLeft") show(at - 1);
    });
    dlg.addEventListener("close", function () { img.removeAttribute("src"); if (opener) opener.focus(); });
  }

  /* ---- Skills marquee (homepage strip) ---------------------------------- */
  function renderMarquee() {
    var mount = document.querySelector("[data-marquee]");
    var cats = DATA.skills;
    if (!mount || !cats || !cats.length) return;
    var names = [];
    cats.forEach(function (c) { c.skills.forEach(function (sk) { names.push(sk.name); }); });
    var list = function (hidden) {
      return '<ul class="marquee__list" role="list"' + (hidden ? ' aria-hidden="true"' : "") + ">" +
        names.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul>";
    };
    // Two identical lists side by side so the loop is seamless; the copy is hidden from screen readers
    mount.innerHTML = '<div class="marquee__track">' + list(false) + list(true) + "</div>";
  }

  renderSkills();
  renderProjects();
  renderProjectDetails();
  renderCreative();
  renderMarquee();
  initLightbox();
})();
