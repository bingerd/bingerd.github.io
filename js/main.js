/* Blog post rendering */
var blogPosts = [
  { title: "Why Your ML System Will Fail in Production (And How to Prevent It)", description: "Data pipelines break. Models drift silently. Deployment patterns that actually survive the real world.", href: "docs/blog/2026/ml-production.html", date: "2026-01-01", category: "ML Engineering", readingTime: "7 min" },
  { title: "The Model That Passed Every Test and Failed in Production", description: "Hard-won lessons from late-night pages, silent model failures, and pipelines that looked fine until they weren't.", href: "docs/blog/2026/mlops-lessons.html", date: "2026-01-02", category: "MLOps", readingTime: "8 min" },
  { title: "The Hidden Cost of Transformer Inference (And How KV Caching Fixes It)", description: "Why naive decoding is expensive, how KV caching turns O(n\u00B2) into O(n), and what it takes to serve LLMs at scale.", href: "docs/blog/2026/transformers-kv-caching.html", date: "2026-01-03", category: "LLM Engineering", readingTime: "6 min" },
  { title: "Why I Serve PyTorch Models with Rust Instead of Python", description: "Sub-millisecond latency, zero GC pauses, and the surprising ergonomics of tch-rs and Axum.", href: "docs/blog/2026/rust-torch-serving.html", date: "2026-01-04", category: "ML Production", readingTime: "5 min" }
];

var gridB = document.getElementById('blogGrid');
if (gridB) {
  blogPosts.forEach(function (post) {
    var card = document.createElement('a');
    card.href = post.href;
    card.className = 'blog-card';
    card.innerHTML = '<div class="blog-meta">' + post.date + ' \u00B7 ' + post.category + ' \u00B7 ' + post.readingTime + '</div><h3>' + post.title + '</h3><p>' + post.description + '</p><span>Read \u2192</span>';
    gridB.appendChild(card);
  });
}

/* Show more endpoints toggle */
function toggleMoreEndpoints() {
  var more = document.getElementById('moreEndpoints');
  var btn = document.getElementById('showMoreBtn');
  if (more && btn) {
    var isVisible = more.classList.contains('visible');
    if (isVisible) {
      more.classList.remove('visible');
      btn.textContent = 'Show more endpoints';
    } else {
      more.classList.add('visible');
      btn.textContent = 'Show fewer endpoints';
    }
  }
}
// expose for onclick
window.toggleMoreEndpoints = typeof toggleMoreEndpoints !== 'undefined' ? toggleMoreEndpoints : function() {};

/* Uptime counter */
var startTime = Date.now();
function updateUptime() {
  var el = document.getElementById('uptimeCounter');
  if (!el) return;
  var elapsed = Math.floor((Date.now() - startTime) / 1000);
  var h = Math.floor(elapsed / 3600);
  var m = Math.floor((elapsed % 3600) / 60);
  var s = elapsed % 60;
  el.textContent = h + 'h ' + m + 'm ' + s + 's';
}
setInterval(updateUptime, 1000);
updateUptime();

/* Section loading text + loss curve reveal */
if ('IntersectionObserver' in window) {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Loading text observer
  var sections = document.querySelectorAll('section[data-loading-text]');
  var shownSections = {};

  var loadingObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var section = entry.target;
      var id = section.id;
      if (shownSections[id]) return;
      shownSections[id] = true;

      var text = section.getAttribute('data-loading-text');
      var container = section.querySelector('.container') || section.querySelector('.fun-section');
      if (!container || !text) return;

      var loadingEl = document.createElement('div');
      loadingEl.className = 'loading-text';
      loadingEl.setAttribute('aria-hidden', 'true');
      container.insertBefore(loadingEl, container.firstChild);

      if (prefersReducedMotion) {
        loadingEl.textContent = text;
        setTimeout(function() { loadingEl.remove(); }, 1500);
        return;
      }

      var i = 0;
      var interval = setInterval(function() {
        loadingEl.textContent = text.substring(0, i + 1);
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setTimeout(function() {
            loadingEl.style.transition = 'opacity 0.5s';
            loadingEl.style.opacity = '0';
            setTimeout(function() { loadingEl.remove(); }, 500);
          }, 600);
        }
      }, 25);
    });
  }, { threshold: 0.2 });

  sections.forEach(function(s) { loadingObserver.observe(s); });

  // Loss curve path reveal
  var lossCurve = document.querySelector('.loss-curve');
  if (lossCurve) {
    var curveObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          lossCurve.classList.add('visible');
        }
      });
    }, { threshold: 0.3 });
    curveObserver.observe(lossCurve);
  }
}
