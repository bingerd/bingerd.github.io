/* Shared theme handling: persistence + system preference.
   Load early in <body> so the saved theme applies before first paint. */
(function () {
  var stored = null;
  try { stored = localStorage.getItem('bing-theme'); } catch (_e) { /* private mode */ }
  // The site is designed dark-first; light is an explicit opt-in via the toggle.
  document.body.dataset.theme = stored === 'light' ? 'light' : 'dark';

  window.setTheme = function (theme) {
    document.body.dataset.theme = theme;
    try { localStorage.setItem('bing-theme', theme); } catch (_e) { /* private mode */ }
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  };

  window.toggleTheme = function () {
    window.setTheme(document.body.dataset.theme === 'dark' ? 'light' : 'dark');
  };
})();
