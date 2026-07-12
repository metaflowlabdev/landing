/*
 * Shared chrome for all northox pages: the sticky Apple-style top nav
 * (brand mark + wordmark, links home to the studio) and the theme toggle.
 *
 * Theme: default follows the system (prefers-color-scheme, no data-theme).
 * The toggle forces data-theme="light|dark" and remembers it in localStorage,
 * which wins over the system until cleared. A tiny inline guard in <head>
 * applies the stored theme before first paint to avoid a flash.
 *
 * Injecting the nav (and the shared footer tail: brand mark + copyright) here
 * keeps every page (and every future product page) in sync — a page only needs
 * to include this script and provide an empty <footer> for its own content.
 */
(function () {
  var root = document.documentElement;
  var mq = window.matchMedia("(prefers-color-scheme: light)");

  function effective() {
    var forced = root.getAttribute("data-theme");
    if (forced) return forced;
    return mq.matches ? "light" : "dark";
  }

  /* ---- styles ---------------------------------------------------------- */
  var css =
    ".site-nav{position:sticky;top:0;z-index:40;align-self:stretch;height:48px;" +
    "display:flex;align-items:center;justify-content:center;padding:0 20px;" +
    "background:color-mix(in srgb, var(--bg) 72%, transparent);" +
    "-webkit-backdrop-filter:saturate(1.8) blur(20px);" +
    "backdrop-filter:saturate(1.8) blur(20px);" +
    "border-bottom:1px solid var(--glass-border);margin:0 -20px 40px;}" +
    ".site-nav .inner{width:100%;max-width:760px;display:flex;" +
    "align-items:center;justify-content:space-between;}" +
    ".brand{display:inline-flex;align-items:center;gap:8px;text-decoration:none;" +
    "color:var(--text);font-weight:600;font-size:15px;letter-spacing:-.01em;}" +
    ".brand .mark{width:22px;height:22px;display:block;flex:none;}" +
    ".brand:hover{opacity:.75;}" +
    ".site-nav .right{display:flex;align-items:center;gap:14px;}" +
    ".site-nav .navlink{color:var(--text);text-decoration:none;font-size:14px;" +
    "font-weight:500;letter-spacing:-.01em;white-space:nowrap;opacity:.78;" +
    "transition:opacity .15s;}" +
    ".site-nav .navlink:hover{opacity:1;}" +
    ".site-nav .navlink.is-active{opacity:1;font-weight:600;color:var(--accent);}" +
    "@media (max-width:520px){.site-nav .right{gap:10px;}.site-nav .navlink{font-size:13px;}}" +
    ".theme-toggle{display:inline-flex;align-items:center;gap:9px;border:0;padding:0;" +
    "background:transparent;color:var(--text);font:inherit;cursor:pointer;}" +
    ".theme-toggle .switch{position:relative;width:50px;height:29px;border-radius:999px;" +
    "border:1px solid var(--glass-border);" +
    "background:color-mix(in srgb, var(--card) 55%, transparent);" +
    "-webkit-backdrop-filter:blur(12px) saturate(1.8);backdrop-filter:blur(12px) saturate(1.8);" +
    "box-shadow:inset 0 1px 0 color-mix(in srgb, #fff 28%, transparent), 0 1px 3px rgba(0,0,0,.18);" +
    "transition:background .2s, border-color .2s;flex:none;}" +
    ".theme-toggle .knob{position:absolute;top:2px;left:2px;width:23px;height:23px;" +
    "border-radius:50%;background:var(--text);" +
    "box-shadow:0 1px 3px rgba(0,0,0,.45), inset 0 1px 0 color-mix(in srgb, #fff 35%, transparent);" +
    "transform:translateX(21px);" + /* default = dark: knob on the right */
    "transition:transform .24s cubic-bezier(.34,1.4,.5,1), background .2s;}" +
    ".theme-toggle .switch.is-light .knob{transform:translateX(0);}" +
    ".foot-brand{display:inline-flex;align-items:center;gap:8px;text-decoration:none;" +
    "color:var(--text);font-weight:600;}" +
    ".foot-brand .mark{width:22px;height:22px;flex:none;}" +
    ".foot-brand:hover{opacity:.7;}" +
    ".theme-toggle .label{font-size:13px;font-weight:500;letter-spacing:-.01em;white-space:nowrap;}" +
    ".theme-toggle:hover .switch{border-color:color-mix(in srgb, var(--text) 30%, transparent);}" +
    "@media (max-width:460px){.theme-toggle .label{display:none;}}";
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---- northox brand mark (a north / compass star) --------------------- */
  var mark =
    '<svg class="mark" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M12 2 L13.56 10.44 L22 12 L13.56 13.56 L12 22 ' +
    'L10.44 13.56 L2 12 L10.44 10.44 Z" fill="currentColor"/>' +
    "</svg>";

  /* ---- nav bar --------------------------------------------------------- */
  var nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.innerHTML =
    '<div class="inner">' +
    '<a class="brand" href="index.html" aria-label="northox — home">' +
    mark + "<span>northox</span></a>" +
    '<div class="right"></div>' +
    "</div>";

  /* ---- theme toggle ---------------------------------------------------- */
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-toggle";
  btn.setAttribute("role", "switch");
  btn.setAttribute("aria-label", "Switch between light and dark theme");
  btn.innerHTML =
    '<span class="switch"><span class="knob"></span></span>' +
    '<span class="label"></span>';
  var sw = btn.querySelector(".switch");
  var label = btn.querySelector(".label");

  function render() {
    var light = effective() === "light";
    sw.classList.toggle("is-light", light);
    label.textContent = "Theme: " + (light ? "Light" : "Dark");
    btn.setAttribute("aria-checked", light ? "true" : "false");
  }
  render();

  btn.addEventListener("click", function () {
    var next = effective() === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    render();
    // iOS Safari repaints only the visible tile when CSS variables change,
    // leaving the rest of the page on the old theme. Force a full repaint.
    // Toggling display collapses the page, so capture and restore the scroll
    // position — otherwise the user is bounced to the top on every toggle.
    var sx = window.scrollX, sy = window.scrollY;
    // If a page sets `html { scroll-behavior: smooth }` (e.g. the docs page, for
    // its anchor links), the restore below would ANIMATE from the collapsed top
    // back down — a visible jump-to-top-then-back. Neutralise it for the restore,
    // then put it back so anchor scrolling stays smooth.
    var prevScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    root.style.display = "none";
    void root.offsetHeight; // reflow (same JS turn, so no visible flash)
    root.style.display = "";
    window.scrollTo(sx, sy);
    root.style.scrollBehavior = prevScrollBehavior;
  });

  // When no manual choice is stored, keep following the system live.
  mq.addEventListener("change", function () {
    if (!root.getAttribute("data-theme")) render();
  });

  /* ---- product nav links (product pages only) ------------------------- */
  // Shown only when a page opts in via <body data-product="…">, so the studio
  // home (index.html) stays a clean brand + theme toggle. Order in the right
  // group: <Product>, Documentation, theme toggle. Add a product = one entry.
  var PRODUCT_NAV = {
    appfreeze: [
      { label: "AppFreeze", href: "appfreeze.html" },
      { label: "Documentation", href: "appfreeze-docs.html" }
    ],
    claudelimits: [
      { label: "ClaudeLimits", href: "claudelimits.html" },
      { label: "Documentation", href: "claudelimits-docs.html" }
    ],
    explorer: [
      { label: "Explorer", href: "explorer.html" },
      { label: "Documentation", href: "explorer-docs.html" },
      { label: "Parity", href: "explorer-parity.html" }
    ]
  };
  var product = document.body.getAttribute("data-product");
  if (PRODUCT_NAV[product]) {
    var right = nav.querySelector(".right");
    var here = location.pathname.split("/").pop() || "index.html";
    PRODUCT_NAV[product].forEach(function (l) {
      var a = document.createElement("a");
      a.className = "navlink" + (here === l.href ? " is-active" : "");
      a.href = l.href;
      a.textContent = l.label;
      right.appendChild(a);
    });
  }

  /* ---- global Pricing link (every page) ------------------------------- */
  // A site-wide "Pricing" link in the header, before the theme toggle, so the
  // on-domain pricing page is reachable from the top nav on every page.
  (function () {
    var right = nav.querySelector(".right");
    var here = location.pathname.split("/").pop() || "index.html";
    var a = document.createElement("a");
    a.className = "navlink" + (here === "pricing.html" ? " is-active" : "");
    a.href = "pricing.html";
    a.textContent = "Pricing";
    right.appendChild(a);
  })();

  nav.querySelector(".right").appendChild(btn);
  document.body.insertBefore(nav, document.body.firstChild);

  /* ---- shared footer tail (brand mark + copyright) -------------------- */
  // Every page keeps its own page-specific footer content; here we append the
  // common northox brand mark + copyright so it stays in sync everywhere.
  var foot = document.querySelector("footer");
  if (foot) {
    foot.insertAdjacentHTML(
      "beforeend",
      '<a class="foot-brand" href="index.html" aria-label="northox — home">' +
        mark + "<span>northox</span></a><br>" +
        "© " + new Date().getFullYear() + " northox. All rights reserved."
    );
  }
})();
