/* Mermaid diagram rendering for blog posts.
   Classic script (not a module) so posts also work over file:// —
   dynamic import() of an https URL is allowed there, local module files are not.
   Loaded only by posts that contain diagrams. */
(function () {
  var blocks = document.querySelectorAll('pre.mermaid');
  if (!blocks.length) return;

  // Mermaid replaces element content with SVG; keep the source for re-renders.
  blocks.forEach(function (el) { el.dataset.src = el.textContent; });

  var mermaid = null;

  function themeFor(bodyTheme) {
    return bodyTheme === 'light' ? 'neutral' : 'dark';
  }

  function render() {
    if (!mermaid) return;
    blocks.forEach(function (el) {
      el.removeAttribute('data-processed');
      el.textContent = el.dataset.src;
    });
    mermaid.initialize({
      startOnLoad: false,
      theme: themeFor(document.body.dataset.theme),
      securityLevel: 'strict'
    });
    mermaid.run({ nodes: blocks }).catch(function () { /* leave source text visible */ });
  }

  import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs')
    .then(function (mod) {
      mermaid = mod.default;
      render();
      document.addEventListener('themechange', render);
    })
    .catch(function () { /* offline: raw diagram text stays visible */ });
})();
