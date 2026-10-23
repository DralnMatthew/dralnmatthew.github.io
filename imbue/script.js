/* ============================================================
   IMBUE project page: theme, top bar, figure zoom, result tabs,
   folded details, BibTeX copy.

   Loaded synchronously from <head>, so the theme is on <html> before
   the first paint; everything else waits for DOMContentLoaded. With
   JavaScript off the page still works: light theme, every "More
   results" panel shown in turn, and each figure links to its PNG.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- Theme ----------
     The rule of /theme.js on zhanghu-zhao.com, repeated here so this page
     also stands on its own: light by day and dark by night in Helsinki,
     unless the reader picked a theme with the button. The choice is
     stored under the same key, so it carries across the whole site. */
  var KEY = "theme-mode"; /* stored value: "light" | "dark"; absent = auto */
  var LAT = 60.1699,
    LON = 24.9384;

  var rad = Math.PI / 180,
    dayMs = 864e5,
    J1970 = 2440588,
    J2000 = 2451545,
    obliquity = rad * 23.4397;

  /* Is the sun below the horizon in Helsinki at `now`? Standard
     low-precision solar position formulas, good to about a minute. */
  function isNight(now) {
    var lw = rad * -LON,
      phi = rad * LAT,
      d = now.valueOf() / dayMs - 0.5 + J1970 - J2000,
      n = Math.round(d - 0.0009 - lw / (2 * Math.PI)),
      ds = 0.0009 + lw / (2 * Math.PI) + n,
      M = rad * (357.5291 + 0.98560028 * ds), /* solar mean anomaly */
      L =
        M +
        rad *
          (1.9148 * Math.sin(M) +
            0.02 * Math.sin(2 * M) +
            0.0003 * Math.sin(3 * M)) +
        rad * 102.9372 +
        Math.PI, /* ecliptic longitude */
      dec = Math.asin(Math.sin(obliquity) * Math.sin(L)),
      correction = 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);

    /* -0.833° puts the upper limb of the refracted sun on the horizon */
    var cosW =
      (Math.sin(rad * -0.833) - Math.sin(phi) * Math.sin(dec)) /
      (Math.cos(phi) * Math.cos(dec));
    if (cosW > 1) return true; /* sun never rises today */
    if (cosW < -1) return false; /* sun never sets today */

    var w = Math.acos(cosW),
      noon = J2000 + ds + correction,
      set = J2000 + (0.0009 + (w + lw) / (2 * Math.PI) + n) + correction,
      toDate = function (j) {
        return new Date((j + 0.5 - J1970) * dayMs);
      };

    return now < toDate(noon - (set - noon)) || now >= toDate(set);
  }

  function readMode() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "light" || v === "dark" ? v : "auto";
    } catch (e) {
      return "auto"; /* private mode, blocked storage: just follow the sun */
    }
  }

  function apply(mode) {
    var theme = mode === "auto" ? (isNight(new Date()) ? "dark" : "light") : mode;
    root.setAttribute("data-mode", mode);
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#14161a" : "#ffffff");
  }

  var mode = readMode();
  apply(mode);

  var LABELS = {
    auto: "Theme: Helsinki — light by day, dark by night, following sunrise and sunset there. Switch to light.",
    light: "Theme: light. Switch to dark.",
    dark: "Theme: dark. Switch back to Helsinki daylight.",
  };
  var NEXT = { auto: "light", light: "dark", dark: "auto" };

  function initThemeToggle() {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;

    function describe() {
      btn.setAttribute("aria-label", LABELS[mode]);
      btn.setAttribute("title", LABELS[mode]);
    }

    describe();
    btn.addEventListener("click", function () {
      mode = NEXT[mode];
      try {
        if (mode === "auto") localStorage.removeItem(KEY);
        else localStorage.setItem(KEY, mode);
      } catch (e) {}
      apply(mode);
      describe();
    });
  }

  /* A tab left open overnight should still turn dark at sunset. */
  setInterval(function () {
    if (mode === "auto") apply(mode);
  }, 60000);

  /* ---------- Top bar ----------
     Marks the link of the section being read with aria-current: the last
     linked section whose top has passed a line a quarter of the way down
     the window, or the last one at the bottom of the page. Also shows the
     name in the bar once the header's has scrolled out of sight. */
  function initTopbar() {
    var bar = document.querySelector(".topbar");
    if (!bar) return;
    var links = Array.prototype.slice.call(bar.querySelectorAll('.topbar__links a[href^="#"]'));
    var sections = links.map(function (link) {
      return document.getElementById(link.getAttribute("href").slice(1));
    });
    var name = document.querySelector(".hero__name");
    var pending = false;

    function update() {
      pending = false;
      var line = bar.offsetHeight + window.innerHeight / 4;
      var current = -1;
      sections.forEach(function (section, i) {
        if (section && section.getBoundingClientRect().top <= line) current = i;
      });
      var atEnd = window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 2;
      if (atEnd && current !== -1) current = sections.length - 1;
      links.forEach(function (link, i) {
        if (i === current) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
      if (name) bar.classList.toggle("is-scrolled", name.getBoundingClientRect().bottom < bar.offsetHeight);
    }

    function schedule() {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
  }

  /* ---------- Tabs (More results) ----------
     WAI-ARIA tabs with automatic activation: click, or arrow keys and
     Home/End on the strip. A URL fragment that points at a panel, or at
     anything inside one, opens that panel; picking a tab writes its
     panel's id into the URL so the view can be linked. */
  function initTabs() {
    var groups = document.querySelectorAll("[data-tabs]");
    Array.prototype.forEach.call(groups, function (group) {
      var tablist = group.querySelector('[role="tablist"]');
      var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));
      var panels = tabs.map(function (tab) {
        return document.getElementById(tab.getAttribute("aria-controls"));
      });
      if (!tablist || !tabs.length || panels.indexOf(null) !== -1) return;

      panels.forEach(function (panel, i) {
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", tabs[i].id);
      });

      function select(index, moveFocus) {
        tabs.forEach(function (tab, i) {
          var on = i === index;
          tab.setAttribute("aria-selected", on ? "true" : "false");
          tab.tabIndex = on ? 0 : -1;
          panels[i].hidden = !on;
        });
        if (moveFocus) tabs[index].focus();
      }

      function remember(index) {
        if (history.replaceState) history.replaceState(null, "", "#" + panels[index].id);
      }

      function followHash() {
        var target = null;
        try {
          var id = decodeURIComponent(location.hash.slice(1));
          target = id ? document.getElementById(id) : null;
        } catch (e) {}
        if (!target) return false;
        for (var i = 0; i < panels.length; i++) {
          if (panels[i].contains(target)) {
            select(i, false);
            /* the panel was hidden when the browser tried to scroll to it */
            (target === panels[i] ? tablist : target).scrollIntoView({ block: "start" });
            return true;
          }
        }
        return false;
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener("click", function () {
          select(i, false);
          remember(i);
        });
        tab.addEventListener("keydown", function (event) {
          var last = tabs.length - 1,
            next = null;
          if (event.key === "ArrowRight") next = i === last ? 0 : i + 1;
          else if (event.key === "ArrowLeft") next = i === 0 ? last : i - 1;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = last;
          if (next === null) return;
          event.preventDefault();
          select(next, true);
          remember(next);
        });
      });

      tablist.hidden = false;
      group.classList.add("is-enhanced");
      if (!followHash()) select(0, false);
      window.addEventListener("hashchange", followHash);
    });
  }

  /* ---------- Figure zoom ----------
     Every figure is wrapped in <a class="zoom" href="full.png">. Here a
     plain click opens that image in a modal <dialog> with the figure's
     caption; Esc, the close button or a click on the dimmed area closes
     it, and focus returns to the figure. Modified clicks (new tab, etc.)
     and browsers without <dialog> keep the link's normal behaviour. */
  function initLightbox() {
    var dialog = document.getElementById("lightbox");
    if (!dialog || typeof dialog.showModal !== "function") return;

    var img = dialog.querySelector(".lightbox__img");
    var scroller = dialog.querySelector(".lightbox__scroll");
    var caption = dialog.querySelector(".lightbox__caption");
    var opener = null;

    document.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var link = event.target.closest ? event.target.closest("a.zoom") : null;
      if (!link) return;
      event.preventDefault();

      var thumb = link.querySelector("img");
      var figure = link.closest("figure");
      var figcaption = figure ? figure.querySelector("figcaption") : null;
      /* The version on screen: on a phone a <picture> may have swapped in
         the stacked layout, which reads better there than the wide one. */
      var width = thumb ? thumb.naturalWidth || Number(thumb.getAttribute("width")) : 0;

      img.src = (thumb && thumb.currentSrc) || link.href;
      img.alt = thumb ? thumb.alt : "";
      /* On phones the image opens at half its pixel width (its 2x size),
         wider than the screen, so dense plots can be panned. */
      dialog.style.setProperty("--zoom-width", width ? Math.round(width / 2) + "px" : "100%");
      /* the caption is the page's own markup, so its <sub>/<var> survive */
      caption.innerHTML = figcaption ? figcaption.innerHTML : "";
      caption.hidden = !figcaption;
      opener = link;
      dialog.showModal();
      scroller.scrollTop = 0;
      scroller.scrollLeft = 0;
    });

    dialog.querySelector(".lightbox__close").addEventListener("click", function () {
      dialog.close();
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close(); /* the dimmed area */
    });

    dialog.addEventListener("close", function () {
      img.removeAttribute("src");
      if (opener) opener.focus({ preventScroll: true });
      opener = null;
    });
  }

  /* ---------- Folded details ----------
     A link to something inside a closed <details> (from this page or a
     shared URL) opens it, and printing opens every one of them, closing
     them again afterwards. */
  function initDetails() {
    function reveal() {
      var target = null;
      try {
        var id = decodeURIComponent(location.hash.slice(1));
        target = id ? document.getElementById(id) : null;
      } catch (e) {}
      var details = target && target.closest ? target.closest("details") : null;
      if (!details || details.open) return;
      details.open = true;
      target.scrollIntoView({ block: "start" });
    }

    var opened = [];
    window.addEventListener("beforeprint", function () {
      Array.prototype.forEach.call(document.querySelectorAll("details:not([open])"), function (details) {
        details.open = true;
        opened.push(details);
      });
    });
    window.addEventListener("afterprint", function () {
      opened.forEach(function (details) {
        details.open = false;
      });
      opened = [];
    });

    reveal();
    window.addEventListener("hashchange", reveal);
  }

  /* ---------- Copy BibTeX ----------
     The button stays hidden without JavaScript. The result is spoken
     through the live region next to it; if the clipboard is unavailable
     the entry is selected so it can be copied by hand. */
  /* the pre-Clipboard-API way: copy from a throwaway, hidden textarea */
  function legacyCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {}
    document.body.removeChild(area);
    return ok ? Promise.resolve() : Promise.reject();
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () {
        return legacyCopy(text); /* e.g. clipboard permission refused */
      });
    }
    return legacyCopy(text);
  }

  function selectContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function initCopy() {
    var buttons = document.querySelectorAll("[data-copy]");
    Array.prototype.forEach.call(buttons, function (btn) {
      var source = document.getElementById(btn.getAttribute("data-copy"));
      if (!source) return;
      var label = btn.querySelector(".copy-btn__label");
      var status = btn.parentNode.querySelector(".copy-status");
      var timer;

      function report(text, message) {
        label.textContent = text;
        if (status) status.textContent = message;
        clearTimeout(timer);
        timer = setTimeout(function () {
          label.textContent = "Copy";
          if (status) status.textContent = "";
        }, 2000);
      }

      btn.hidden = false;
      btn.addEventListener("click", function () {
        copyText(source.textContent).then(
          function () {
            report("Copied", "BibTeX copied to the clipboard.");
          },
          function () {
            selectContents(source);
            report("Selected", "Could not copy automatically. The BibTeX is selected: press Ctrl+C or Command+C.");
          }
        );
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();
    initTopbar();
    initTabs();
    initDetails();
    initLightbox();
    initCopy();
  });
})();
