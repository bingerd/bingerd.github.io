/* Blog post enhancements: syntax highlighting, copy buttons,
   reading progress bar, prev/next navigation.
   Classic script (file://-safe); loaded by every blog post after blog-data.js. */
(function () {

  /* Syntax highlighting via highlight.js (CDN, lazy). Explicit languages only. */
  var codeBlocks = document.querySelectorAll('pre code[class*="language-"]');
  if (codeBlocks.length) {
    import('https://cdn.jsdelivr.net/npm/highlight.js@11/+esm')
      .then(function (mod) {
        var hljs = mod.default;
        codeBlocks.forEach(function (el) { hljs.highlightElement(el); });
      })
      .catch(function () { /* offline: plain code is fine */ });
  }

  /* Copy button on every code block (not mermaid diagrams) */
  document.querySelectorAll('pre > code').forEach(function (code) {
    var pre = code.parentElement;
    if (pre.classList.contains('mermaid')) return;
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.addEventListener('click', function () {
      var write = navigator.clipboard && navigator.clipboard.writeText
        ? navigator.clipboard.writeText(code.textContent)
        : Promise.reject();
      write.then(function () {
        btn.textContent = 'Copied ✓';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
      }).catch(function () {
        btn.textContent = 'Press ⌘C';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
      });
    });
    pre.appendChild(btn);
  });

  /* Reading progress bar */
  var bar = document.createElement('div');
  bar.className = 'progress-bar';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  function updateBar() {
    var total = document.documentElement.scrollHeight - window.innerHeight;
    var pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
  }
  window.addEventListener('scroll', updateBar, { passive: true });
  window.addEventListener('resize', updateBar);
  updateBar();

  /* Prev/next navigation from blog-data.js */
  var nav = document.getElementById('postNav');
  var posts = window.blogPosts;
  if (nav && posts) {
    var file = window.location.pathname.split('/').pop();
    var idx = -1;
    posts.forEach(function (p, i) {
      if (p.href.split('/').pop() === file) idx = i;
    });
    if (idx !== -1) {
      nav.className = 'post-nav';
      var root = '../../../'; // posts live at docs/blog/<year>/
      var newer = idx > 0 ? posts[idx - 1] : null;      // list is newest-first
      var older = idx < posts.length - 1 ? posts[idx + 1] : null;
      function card(post, cls, label) {
        var a = document.createElement('a');
        a.href = root + post.href;
        a.className = cls;
        var l = document.createElement('span');
        l.className = 'post-nav-label';
        l.textContent = label;
        var t = document.createElement('span');
        t.className = 'post-nav-title';
        t.textContent = post.title;
        a.appendChild(l);
        a.appendChild(t);
        return a;
      }
      if (older) nav.appendChild(card(older, 'prev', '← Older'));
      if (newer) nav.appendChild(card(newer, 'next', 'Newer →'));
    }
  }
})();
