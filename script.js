/* ============================================================
   Classic Wedding Invitation — behaviour
   All content comes from INVITE_CONFIG (config.js).
   ============================================================ */
(function () {
  "use strict";

  // Top-level `const` in config.js creates a global lexical binding, not a
  // window property — so read the binding directly and only fall back to window.
  var cfg = typeof INVITE_CONFIG !== "undefined" ? INVITE_CONFIG : window.INVITE_CONFIG;
  if (!cfg) return;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ============ 1. Hydrate simple text slots ============ */
  var slots = {
    "data-initials": cfg.couple.initials,
    "data-name1": cfg.couple.name1,
    "data-name2": cfg.couple.name2,
    "data-date-display": cfg.dateDisplay,
    "data-city": cfg.city,
    "data-blessing": cfg.blessing,
    "data-welcome-eyebrow": cfg.welcome.eyebrow,
    "data-parents1": cfg.welcome.parents1,
    "data-parents2": cfg.welcome.parents2,
    "data-invite-line": cfg.welcome.inviteLine,
    "data-countdown-note": cfg.countdownNote,
    "data-venue-name": cfg.venue.name,
    "data-venue-address": (cfg.venue.address || ""),
    "data-closing": cfg.closing,
    "data-footer-names": cfg.couple.name1 + " & " + cfg.couple.name2,
    "data-footer-date": formatDateShort() + " \u00B7 " + cfg.city.replace(", Bangladesh", "").replace(/,.*/, ""),
    "data-hashtag": cfg.couple.hashtag,
    "data-credit": cfg.credit,
  };

  Object.keys(slots).forEach(function (attr) {
    var el = $("[" + attr + "]");
    if (el) el.textContent = slots[attr];
  });

  // Document title & social meta follow the couple.
  var title = cfg.couple.name1 + " & " + cfg.couple.name2 + " \u2014 Wedding Invitation";
  document.title = title;
  var ogTitle = $('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", title);

  /* Keep each name on a single line: shrink the script font until it fits
     the arch. Below 18px, give up and allow wrapping (very long names). */
  function fitNames() {
    $$(".hero__name").forEach(function (el) {
      el.style.whiteSpace = "nowrap";
      el.style.fontSize = "";
      var max = el.parentElement.clientWidth;
      var size = parseFloat(window.getComputedStyle(el).fontSize);
      var guard = 30;
      while (size > 18 && el.scrollWidth > max && guard-- > 0) {
        size -= 1;
        el.style.fontSize = size + "px";
      }
      if (el.scrollWidth > max) el.style.whiteSpace = "";
    });
  }
  fitNames();
  window.addEventListener("resize", fitNames);

  function formatDateShort() {
    // "24 · 01 · 2027" from weddingDateTime (venue-local via manual parse).
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(cfg.weddingDateTime);
    return m ? m[3] + " \u00B7 " + m[2] + " \u00B7 " + m[1] : "";
  }

  /* ============ 2. Event cards ============ */
  var ICONS = {
    date: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>',
    time: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 13.5"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  };

  var list = $("#eventList");
  if (list && cfg.events && cfg.events.length) {
    list.innerHTML = cfg.events.map(renderEvent).join("");
  }

  function renderEvent(ev) {
    var mapUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ev.mapQuery || ev.venue || "");
    var calUrl = buildCalendarUrl(ev);
    return (
      '<article class="event-card reveal">' +
      '<p class="event-card__tag">' + esc(ev.tag) + "</p>" +
      '<h3 class="event-card__name">' + esc(ev.name) + "</h3>" +
      (ev.tagline ? '<p class="event-card__tagline">' + esc(ev.tagline) + "</p>" : "") +
      '<div class="event-card__divider" aria-hidden="true"></div>' +
      '<dl class="event-card__rows">' +
      row(ICONS.date, "Date", ev.date) +
      row(ICONS.time, "Time", ev.time) +
      row(ICONS.pin, "Venue", ev.venue) +
      (ev.address ? row('<span class="row__dot" aria-hidden="true"></span>', "Address", ev.address) : "") +
      "</dl>" +
      '<div class="event-card__actions">' +
      '<a class="link-btn" href="' + mapUrl + '" target="_blank" rel="noopener">View on Map \u2197</a>' +
      (calUrl ? '<a class="link-btn link-btn--calendar" href="' + calUrl + '" target="_blank" rel="noopener">Add to Calendar \u2197</a>' : "") +
      "</div></article>"
    );
  }

  function row(icon, label, value) {
    return '<div class="row"><dt>' + icon + "<span>" + label + "</span></dt><dd>" + esc(value) + "</dd></div>";
  }

  function buildCalendarUrl(ev) {
    if (!ev.calDate || !ev.calStart || !ev.calEnd) return "";
    var start = ev.calDate.replace(/-/g, "") + "T" + ev.calStart.replace(":", "") + "00";
    var end = ev.calDate.replace(/-/g, "") + "T" + ev.calEnd.replace(":", "") + "00";
    var params = {
      action: "TEMPLATE",
      text: cfg.couple.name1 + " & " + cfg.couple.name2 + " \u2014 " + ev.name,
      dates: start + "/" + end,
      details: "We would be honoured by your presence. " + cfg.couple.hashtag,
      location: [ev.venue, ev.address].filter(Boolean).join(", "),
    };
    if (ev.calTz) params.ctz = ev.calTz;
    return "https://calendar.google.com/calendar/render?" + Object.keys(params)
      .map(function (k) { return k + "=" + encodeURIComponent(params[k]); })
      .join("&");
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ============ 3. Map ============ */
  var mapFrame = $("#venueMap");
  if (mapFrame && cfg.venue.mapQuery) {
    var zoom = cfg.venue.mapZoom || 15;
    mapFrame.src =
      "https://maps.google.com/maps?q=" + encodeURIComponent(cfg.venue.mapQuery) +
      "&z=" + zoom + "&output=embed";
  }
  $$("[data-directions]").forEach(function (a) {
    if (cfg.venue.mapQuery) {
      a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(cfg.venue.mapQuery);
    }
  });

  /* ============ 4. Countdown ============ */
  var target = new Date(cfg.weddingDateTime).getTime();
  var elD = $("#cdDays"), elH = $("#cdHours"), elM = $("#cdMinutes"), elS = $("#cdSeconds");

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function tick() {
    var diff = target - Date.now();
    if (elD) elD.textContent = diff <= 0 ? "00" : pad(Math.floor(diff / 864e5));
    if (elH) elH.textContent = diff <= 0 ? "00" : pad(Math.floor(diff / 36e5) % 24);
    if (elM) elM.textContent = diff <= 0 ? "00" : pad(Math.floor(diff / 6e4) % 60);
    if (elS) elS.textContent = diff <= 0 ? "00" : pad(Math.floor(diff / 1e3) % 60);
  }
  if (!isNaN(target)) {
    tick();
    setInterval(tick, 1000);
  }

  /* ============ 5. Share ============ */
  var toast = $("#toast");
  var toastTimer;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 2600);
  }

  function share() {
    var data = {
      title: document.title,
      text: "You\u2019re invited \u2014 " + cfg.couple.name1 + " & " + cfg.couple.name2 +
        " \u00B7 " + cfg.dateDisplay + " \u00B7 " + cfg.city,
      url: location.origin === "null" || location.protocol === "file:"
        ? "https://your-invite-link.example"
        : location.href,
    };
    if (navigator.share) {
      navigator.share(data).catch(function () { /* user dismissed */ });
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(data.url).then(
        function () { showToast("Link copied to clipboard"); },
        function () { fallbackCopy(data.url); }
      );
      return;
    }
    fallbackCopy(data.url);
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast("Link copied to clipboard");
    } catch (e) {
      showToast(text);
    }
    document.body.removeChild(ta);
  }

  ["#shareBtn", "#shareFab"].forEach(function (sel) {
    var btn = $(sel);
    if (btn) btn.addEventListener("click", share);
  });

  /* ============ 6. Floating share pill appears after hero ============ */
  var fab = $("#shareFab");
  var hero = $(".hero");
  if (fab && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        fab.classList.toggle("is-visible", !e.isIntersecting);
      });
    }, { rootMargin: "-72px 0px 0px 0px" }).observe(hero);
  } else if (fab) {
    fab.classList.add("is-visible");
  }

  /* ============ 7. Reveal on scroll ============ */
  var revealables = $$(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion()) {
    // Tag major blocks progressively.
    [".welcome", ".countdown__panel", ".event-card", ".venue__info", ".venue__frame"].forEach(function (sel) {
      $$(sel).forEach(function (el) { el.classList.add("reveal"); });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
})();
