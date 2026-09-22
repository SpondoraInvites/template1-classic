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

  // Swap a digit only when it changed, and let it settle in softly
  // (styles.css "num-settle") instead of hard-swapping every second.
  function setNum(el, val) {
    if (!el || el.textContent === val) return;
    el.textContent = val;
    el.classList.remove("is-settling");
    void el.offsetWidth; // restart the settle animation
    el.classList.add("is-settling");
  }

  function tick() {
    var diff = target - Date.now();
    var done = diff <= 0;
    setNum(elD, done ? "00" : pad(Math.floor(diff / 864e5)));
    setNum(elH, done ? "00" : pad(Math.floor(diff / 36e5) % 24));
    setNum(elM, done ? "00" : pad(Math.floor(diff / 6e4) % 60));
    setNum(elS, done ? "00" : pad(Math.floor(diff / 1e3) % 60));
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

  /* ============ 8. Ink-in the scroll ornaments ============
     The welcome ornament and footer sprig draw their strokes when
     they enter the viewport (CSS "draw-stroke" animates them once
     .is-in lands). Without IO or with reduced motion they simply
     render fully drawn. */
  var drawers = $$(".ornament, .sprig--footer");
  if (drawers.length && "IntersectionObserver" in window && !prefersReducedMotion()) {
    var inkIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          inkIo.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    drawers.forEach(function (el) { inkIo.observe(el); });
  } else {
    drawers.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ============ 9. Drifting petals — decorative canvas ============
     A fixed, pointer-transparent canvas floats a handful of translucent
     petals down the viewport. Shapes echo the site's line-art botanicals
     (sprig buds, paired leaves, tiny blossoms) in the antique-gold family,
     so they sit naturally on both emerald and cream sections. Everything
     is randomised per petal — size, tint, sway, tumble, drift — and a slow
     shared breeze keeps the field from ever looking like a looping cycle.
     ============================================================ */
  (function initPetals() {
    if (prefersReducedMotion()) return;

    var canvas = document.createElement("canvas");
    canvas.className = "petal-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    if (!ctx) { document.body.removeChild(canvas); return; }

    var W = 0, H = 0, MAX = 7;
    var petals = [];
    var rafId = 0, last = 0, nextSpawn = 0, windX = 0;

    function rand(a, b) { return a + Math.random() * (b - a); }

    /* ---- Sprites: pre-rendered once, drawn as images (cheap per frame) ---- */

    var TINTS = [
      { lite: "#e8d5a0", deep: "#d3b271", line: "rgba(168, 137, 79, 0.55)" },
      { lite: "#dcc084", deep: "#c2a057", line: "rgba(150, 120, 64, 0.55)" },
      { lite: "#cda85e", deep: "#ad8c4c", line: "rgba(120, 96, 50, 0.50)" },
    ];

    // Pointed-oval bud, base at (0,0), tip at (0,-len) — same silhouette
    // as the sprig buds in the hero artwork.
    function budPath(c, len, wid) {
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(wid * 0.58, -len * 0.3, wid * 0.5, -len * 0.72, 0, -len);
      c.bezierCurveTo(-wid * 0.5, -len * 0.72, -wid * 0.58, -len * 0.3, 0, 0);
      c.closePath();
    }

    function paintBud(c, len, wid, t, vein) {
      var g = c.createLinearGradient(0, 0, 0, -len);
      g.addColorStop(0, t.deep);
      g.addColorStop(1, t.lite);
      budPath(c, len, wid);
      c.fillStyle = g;
      c.fill();
      c.lineWidth = 0.7;
      c.strokeStyle = t.line;
      c.stroke();
      if (vein) {
        c.beginPath();
        c.moveTo(0, -len * 0.12);
        c.quadraticCurveTo(wid * 0.1, -len * 0.5, 0, -len * 0.86);
        c.lineWidth = 0.55;
        c.stroke();
      }
    }

    function makeSprite(w, h, painter) {
      var PAD = 3, SS = 2; // padded, drawn at 2x for crisp rotation
      var cv = document.createElement("canvas");
      cv.width = Math.ceil((w + PAD * 2) * SS);
      cv.height = Math.ceil((h + PAD * 2) * SS);
      var c = cv.getContext("2d");
      c.scale(SS, SS);
      c.translate(PAD + w / 2, PAD + h / 2);
      painter(c);
      return { img: cv, w: w + PAD * 2, h: h + PAD * 2 };
    }

    var KINDS = [
      {
        // single bud, gently veined
        w: 62, dw: 12, dh: 24,
        paint: function (c, t) { c.translate(0, 11); paintBud(c, 22, 7, t, true); },
      },
      {
        // two buds splayed from one point — the paired leaf of the branches
        w: 24, dw: 30, dh: 26,
        paint: function (c, t) {
          c.rotate(0.08);
          c.save(); c.rotate(0.52); paintBud(c, 19, 6.4, t, false); c.restore();
          c.save(); c.rotate(-0.52); paintBud(c, 19, 6.4, t, false); c.restore();
        },
      },
      {
        // tiny five-petal blossom with a gold centre
        w: 14, dw: 22, dh: 20,
        paint: function (c, t) {
          for (var i = 0; i < 5; i++) {
            c.save();
            c.rotate(i * Math.PI * 2 / 5 + 0.3);
            paintBud(c, 7.5, 3.6, t, false);
            c.restore();
          }
          c.beginPath();
          c.arc(0, 0, 1.8, 0, Math.PI * 2);
          c.fillStyle = t.deep;
          c.fill();
        },
      },
    ];

    var SPRITES = [];
    TINTS.forEach(function (t, ti) {
      var tintWeight = [1.15, 1, 0.72][ti];
      KINDS.forEach(function (k) {
        SPRITES.push({ s: makeSprite(k.dw, k.dh, function (c) { k.paint(c, t); }), w: k.w * tintWeight });
      });
    });

    function pickSprite() {
      var total = 0, i;
      for (i = 0; i < SPRITES.length; i++) total += SPRITES[i].w;
      var r = Math.random() * total;
      for (i = 0; i < SPRITES.length; i++) {
        r -= SPRITES[i].w;
        if (r <= 0) return SPRITES[i].s;
      }
      return SPRITES[0].s;
    }

    /* ---- Petal lifecycle ---- */

    function spawnX() {
      // On wide screens most petals grace the invitation column itself.
      if (W > 760 && Math.random() < 0.65) return W / 2 + rand(-340, 340);
      return rand(-30, W + 30);
    }

    function spawn(seeded) {
      var fromCorner = !seeded && Math.random() < 0.3;
      var side = Math.random() < 0.5 ? -1 : 1;
      var x, y, vx;

      if (seeded) {
        // Entrance on load: already mid-fall, biased to the outer halves so
        // the couple's names stay unobstructed at first paint.
        var band = Math.random() < 0.22 ? rand(0.3, 0.7)
          : (Math.random() < 0.5 ? rand(0.05, 0.28) : rand(0.72, 0.95));
        x = band * W;
        y = rand(0.06, 0.5) * H;
        vx = rand(-8, 8);
      } else if (fromCorner) {
        x = side < 0 ? rand(-30, W * 0.1) : rand(W * 0.9, W + 30);
        y = rand(-40, H * 0.12);
        vx = side < 0 ? rand(6, 22) : -rand(6, 22);
      } else {
        x = spawnX();
        y = -rand(30, 110);
        vx = rand(-8, 8);
      }

      petals.push({
        spr: pickSprite(),
        scale: rand(0.8, 1.35) * (W < 620 ? 0.9 : 1),
        x: x, y: y, vx: vx,
        vy: rand(20, 46),
        swayAmp: rand(12, 40),
        om: Math.PI * 2 * rand(0.16, 0.4),
        ph: rand(0, Math.PI * 2),
        rot0: rand(0, Math.PI * 2),
        rotV: rand(-0.16, 0.16),
        tilt: rand(0.05, 0.18),
        alpha: rand(0.3, 0.55),
        wf: rand(0.5, 1.4),
        age: 0,
      });
    }

    function scheduleNext(now) {
      nextSpawn = now + (W < 620 ? rand(3400, 7600) : rand(2400, 5600));
    }

    function frame(now) {
      rafId = requestAnimationFrame(frame);
      var dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      var t = now / 1000;

      // Slow shared breeze — two incommensurate sines, never quite repeats.
      windX = 6 * Math.sin(t * 0.1) + 3.5 * Math.sin(t * 0.047 + 2.3);

      if (now >= nextSpawn && petals.length < MAX) {
        spawn(false);
        scheduleNext(now);
      }

      ctx.clearRect(0, 0, W, H);
      for (var i = petals.length - 1; i >= 0; i--) {
        var p = petals[i];
        p.age += dt;
        p.y += p.vy * dt;
        p.x += p.vx * dt;
        if (p.y > H + 110) { petals.splice(i, 1); continue; }

        var sway = Math.sin(p.age * p.om + p.ph);
        var x = p.x + p.swayAmp * sway + windX * p.wf;
        // Petals lean into their sway (quarter-phase offset).
        var rot = p.rot0 + p.rotV * p.age + p.tilt * Math.cos(p.age * p.om + p.ph);

        // Fade in over the first stretch, out again near the bottom.
        var lifeA = Math.min(1, Math.max(0, p.y / 130)) * Math.max(0, Math.min(1, (H + 90 - p.y) / 190));

        ctx.save();
        ctx.globalAlpha = p.alpha * lifeA;
        ctx.translate(x, p.y);
        ctx.rotate(rot);
        ctx.drawImage(p.spr.img, -p.spr.w * p.scale / 2, -p.spr.h * p.scale / 2, p.spr.w * p.scale, p.spr.h * p.scale);
        ctx.restore();
      }
    }

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      MAX = W < 620 ? 4 : 7;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.ceil(W * dpr);
      canvas.height = Math.ceil(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    function start() {
      if (!rafId) {
        last = performance.now();
        rafId = requestAnimationFrame(frame);
      }
    }

    function stop() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });

    var mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    function onReduceChange() {
      if (mq.matches) {
        stop();
        ctx.clearRect(0, 0, W, H);
      } else {
        start();
      }
    }
    if (mq) {
      if (mq.addEventListener) mq.addEventListener("change", onReduceChange);
      else if (mq.addListener) mq.addListener(onReduceChange);
    }

    resize();
    // Romantic entrance: a few petals already adrift when the page opens,
    // then the slow ambient trickle begins shortly after.
    var seed = W < 620 ? 3 : 4;
    for (var i = 0; i < seed; i++) spawn(true);
    nextSpawn = performance.now() + rand(1600, 3000);
    start();
  })();

  /* ============ 10. Hero parallax — barely-there depth on scroll ============ */
  (function initParallax() {
    if (prefersReducedMotion()) return;
    var hero = $(".hero");
    if (!hero || !window.requestAnimationFrame) return;

    var ticking = false;
    function apply() {
      ticking = false;
      var y = Math.min(window.scrollY || window.pageYOffset || 0, 900);
      hero.style.setProperty("--para-y", (y * 0.12).toFixed(1) + "px");
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    }, { passive: true });
    apply();
  })();

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
})();
