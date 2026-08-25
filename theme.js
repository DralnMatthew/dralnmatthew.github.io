/* ============================================================
   Light by day, dark by night — following Helsinki.

   Sunrise and sunset are computed locally (no network, no
   timezone database) from the standard low-precision solar
   position formulas for 60.17°N, 24.94°E. That is accurate to
   about a minute here, which is far more than a colour scheme
   needs, and it beats a fixed "dark after 19:00" rule: Helsinki
   loses seven hours of daylight between June and December.

   Clicking the toggle overrides the automatic choice and the
   override is remembered in this browser. Loaded synchronously
   from <head> so the theme is set before the first paint.
   ============================================================ */
(function () {
  "use strict";

  var KEY = "theme-mode"; /* stored value: "light" | "dark"; absent = auto */
  var LAT = 60.1699,
    LON = 24.9384;

  var root = document.documentElement;
  var rad = Math.PI / 180,
    dayMs = 864e5,
    J1970 = 2440588,
    J2000 = 2451545,
    obliquity = rad * 23.4397;

  /* Is the sun below the horizon in Helsinki at `now`? */
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

    /* -0.833° puts the centre of the disc low enough that its upper
       limb, refracted, sits on the horizon — the usual definition. */
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
      return "auto"; /* private mode, blocked storage — just follow the sun */
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
    auto: "Theme: automatic, following sunrise and sunset in Helsinki. Switch to light.",
    light: "Theme: light. Switch to dark.",
    dark: "Theme: dark. Switch back to automatic.",
  };
  var NEXT = { auto: "light", light: "dark", dark: "auto" };

  document.addEventListener("DOMContentLoaded", function () {
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
  });

  /* A tab left open overnight should still turn dark at sunset. */
  setInterval(function () {
    if (mode === "auto") apply(mode);
  }, 60000);
})();
