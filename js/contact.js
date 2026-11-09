/* ==========================================================================
   contact.js — Contact details, link rendering and the contact form
   --------------------------------------------------------------------------
   EDIT YOUR CONTACT DETAILS HERE (one place; used by the contact section,
   the contact page and the footer).

   HOW THE FORM SENDS (this is a static site with no server):
   - While FORM_ENDPOINT is empty, the form validates, then opens the visitor's
     email app with the message ready to send (a mailto: link). Nothing is
     delivered by the website itself, and the form says so.
   - To send directly from the site later, put a form-service URL in
     FORM_ENDPOINT (for example a Formspree or Web3Forms endpoint). The form
     will then POST JSON to it and only report success if the service replies OK.
   ========================================================================== */
(function () {
  "use strict";

  var FORM_ENDPOINT = "";   // e.g. "https://formspree.io/f/your-form-id"

  var CONTACT = {
    email: "khenrodc@gmail.com",
    socials: [
      { name: "GitHub",    handle: "khenrodc-coder",  url: "https://github.com/khenrodc-coder",         icon: "github" },
      { name: "Facebook",  handle: "khentarohohoho",  url: "https://www.facebook.com/khentarohohoho",   icon: "facebook" },
      { name: "Instagram", handle: "@khentaroo_",     url: "https://www.instagram.com/khentaroo_/",     icon: "instagram" }
    ],
    formEndpoint: FORM_ENDPOINT
  };

  var ICONS = {
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    instagram: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    arrow: '<path d="M7 17 17 7M8 7h9v9"/>'
  };

  function esc(v) {
    return String(v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icon(name, cls) {
    return '<svg class="' + (cls || "icon") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS[name] || "") + "</svg>";
  }

  /* Shared with navigation.js (footer) */
  CONTACT.icon = icon;
  window.PORTFOLIO_CONTACT = CONTACT;

  /* ---- Contact link rows ------------------------------------------------- */
  function renderLinks() {
    var mounts = document.querySelectorAll("[data-contact-links]");
    if (!mounts.length) return;

    var rows = '<li><a class="contact-link" href="mailto:' + esc(CONTACT.email) + '">' +
      '<span class="contact-link__icon">' + icon("mail") + "</span>" +
      '<span class="contact-link__text"><span class="stat-label">Email</span><span class="contact-link__value">' + esc(CONTACT.email) + "</span></span>" +
      icon("arrow", "icon contact-link__go") + "</a></li>";

    rows += CONTACT.socials.map(function (s) {
      return '<li><a class="contact-link" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="contact-link__icon">' + icon(s.icon) + "</span>" +
        '<span class="contact-link__text"><span class="stat-label">' + esc(s.name) + '</span><span class="contact-link__value">' + esc(s.handle) + "</span></span>" +
        icon("arrow", "icon contact-link__go") + '<span class="sr-only">(opens in a new tab)</span></a></li>';
    }).join("");

    mounts.forEach(function (m) { m.innerHTML = rows; });
  }

  /* ---- Form -------------------------------------------------------------- */
  var RULES = {
    name: function (v) {
      if (!v) return "Please enter your name.";
      if (v.length < 2) return "Your name needs at least 2 characters.";
      return "";
    },
    email: function (v) {
      if (!v) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email address, like name@example.com.";
      return "";
    },
    subject: function (v) {
      if (!v) return "Please add a subject.";
      if (v.length < 3) return "Please make the subject at least 3 characters.";
      return "";
    },
    message: function (v) {
      if (!v) return "Please write a message.";
      if (v.length < 10) return "Your message is a little short. Please write at least 10 characters.";
      return "";
    }
  };

  function initForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    var status = form.querySelector("[data-form-status]");
    var note = form.querySelector("[data-mode-note]");
    var submit = form.querySelector('button[type="submit"]');
    var names = Object.keys(RULES);
    var usingEndpoint = Boolean(CONTACT.formEndpoint);

    if (note) {
      note.textContent = usingEndpoint
        ? "Your message is sent through a secure form service."
        : "This form opens your email app with your message ready to send. The website itself does not deliver messages.";
    }

    function field(name) { return form.elements[name]; }
    function wrapper(name) { return field(name).closest(".field"); }

    function validateOne(name) {
      var el = field(name);
      var msg = RULES[name](el.value.trim());
      var wrap = wrapper(name);
      var err = wrap.querySelector(".field__error");
      err.textContent = msg;
      wrap.setAttribute("data-invalid", msg ? "true" : "false");
      if (msg) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
      return !msg;
    }

    function setStatus(state, html) {
      status.setAttribute("data-state", state);
      status.innerHTML = html;
      status.hidden = false;
    }

    // Validate a field once the visitor leaves it, then keep it fresh while they fix it
    names.forEach(function (n) {
      var el = field(n);
      el.addEventListener("blur", function () { if (el.value !== "" || el.dataset.touched) validateOne(n); el.dataset.touched = "1"; });
      el.addEventListener("input", function () { if (wrapper(n).getAttribute("data-invalid") === "true") validateOne(n); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot: real visitors never see or fill this field
      if (form.elements.company && form.elements.company.value) return;

      var firstBad = null;
      names.forEach(function (n) { if (!validateOne(n) && !firstBad) firstBad = n; });
      if (firstBad) {
        setStatus("error", "Please fix the highlighted fields and try again.");
        field(firstBad).focus();
        return;
      }

      var data = {
        name: field("name").value.trim(),
        email: field("email").value.trim(),
        subject: field("subject").value.trim(),
        message: field("message").value.trim()
      };

      if (usingEndpoint) sendToService(data); else openEmailApp(data);
    });

    function openEmailApp(data) {
      var body = "Name: " + data.name + "\nEmail: " + data.email + "\n\n" + data.message;
      var url = "mailto:" + CONTACT.email + "?subject=" + encodeURIComponent(data.subject) + "&body=" + encodeURIComponent(body);
      setStatus("info",
        "Your email app should open with this message ready to send. <strong>Nothing has been sent yet.</strong> " +
        'If nothing opens, you can email me directly at <a href="mailto:' + esc(CONTACT.email) + '">' + esc(CONTACT.email) + "</a>.");
      window.location.href = url;
    }

    function sendToService(data) {
      submit.disabled = true;
      submit.setAttribute("aria-busy", "true");
      setStatus("info", "Sending your message…");
      fetch(CONTACT.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        names.forEach(function (n) { wrapper(n).setAttribute("data-invalid", "false"); field(n).removeAttribute("aria-invalid"); });
        setStatus("success", "Thanks! Your message was sent.");
      }).catch(function () {
        setStatus("error", 'Sorry, your message could not be sent. Please try again, or email me at <a href="mailto:' + esc(CONTACT.email) + '">' + esc(CONTACT.email) + "</a>.");
      }).then(function () {
        submit.disabled = false;
        submit.removeAttribute("aria-busy");
      });
    }
  }

  function init() { renderLinks(); initForm(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
