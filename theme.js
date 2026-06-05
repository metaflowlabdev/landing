/*
 * Shared chrome for all Metaflow Lab pages: the sticky Apple-style top nav
 * (brand mark + wordmark, links home to the studio) and the theme toggle.
 *
 * Theme: default follows the system (prefers-color-scheme, no data-theme).
 * The toggle forces data-theme="light|dark" and remembers it in localStorage,
 * which wins over the system until cleared. A tiny inline guard in <head>
 * applies the stored theme before first paint to avoid a flash.
 *
 * Injecting the nav here keeps every page (and every future product page) in
 * sync — a page only needs to include this script.
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
    ".theme-toggle .label{font-size:13px;font-weight:500;letter-spacing:-.01em;white-space:nowrap;}" +
    ".theme-toggle:hover .switch{border-color:color-mix(in srgb, var(--text) 30%, transparent);}" +
    "@media (max-width:460px){.theme-toggle .label{display:none;}}";
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---- flat "metaflow" brand mark (one node branching into a flow) ------ */
  var mark =
    '<svg class="mark" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M6.5 12 C 11 12, 12.5 6.5, 17.5 6.5 M6.5 12 C 11 12, 12.5 17.5, 17.5 17.5" ' +
    'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>' +
    '<circle cx="6.5" cy="12" r="2.4" fill="currentColor"/>' +
    '<circle cx="17.5" cy="6.5" r="2.4" fill="currentColor"/>' +
    '<circle cx="17.5" cy="17.5" r="2.4" fill="currentColor"/>' +
    "</svg>";

  /* ---- nav bar --------------------------------------------------------- */
  var nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.innerHTML =
    '<div class="inner">' +
    '<a class="brand" href="studio.html" aria-label="Metaflow Lab — home">' +
    mark + "<span>Metaflow Lab</span></a>" +
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
    root.style.display = "none";
    void root.offsetHeight; // reflow (same JS turn, so no visible flash)
    root.style.display = "";
  });

  // When no manual choice is stored, keep following the system live.
  mq.addEventListener("change", function () {
    if (!root.getAttribute("data-theme")) render();
  });

  nav.querySelector(".right").appendChild(btn);
  document.body.insertBefore(nav, document.body.firstChild);
})();
