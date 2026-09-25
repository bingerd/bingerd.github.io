/* Self-updating bits of the landing page, so it doesn't go stale between posts:
   - years of ML experience, computed from a start date
   - model version + "last deployed" footer, from the latest GitHub commit
   - latest-post line in the hero and "new" badges on fresh posts
   Everything degrades to the static text already in index.html. */
(function () {
  var ML_SINCE = '2024-01-01';        // first day shipping ML in industry
  var REPO = 'bingerd/bingerd.github.io';
  var NEW_POST_DAYS = 30;

  var DAY = 86400000;
  var now = Date.now();
  var rtf = window.Intl && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }) : null;

  function ago(date) {
    var days = Math.round((date - now) / DAY);
    if (!rtf) return Math.abs(days) + ' days ago';
    if (days > -1) return rtf.format(Math.round((date - now) / 3600000), 'hour');
    if (days > -45) return rtf.format(days, 'day');
    return rtf.format(Math.round(days / 30), 'month');
  }

  /* Years shipping ML */
  var years = Math.floor((now - new Date(ML_SINCE)) / (365.25 * DAY));
  document.querySelectorAll('[data-years-since]').forEach(function (el) {
    el.textContent = years + '+';
  });

  /* Latest post in the hero + "new" badges in the writing list */
  var posts = window.blogPosts || [];
  var latest = posts[0];
  var heroLatest = document.getElementById('heroLatest');
  if (latest && heroLatest) {
    var fresh = (now - new Date(latest.date)) / DAY < NEW_POST_DAYS;
    heroLatest.href = latest.href;
    heroLatest.innerHTML = '<span class="hero-latest-tag">' + (fresh ? 'New post' : 'Latest post') + '</span>';
    var title = document.createElement('span');
    title.textContent = latest.title + ' →';
    heroLatest.appendChild(title);
    heroLatest.hidden = false;
  }
  document.querySelectorAll('#blogGrid .blog-card').forEach(function (card, i) {
    var post = posts[i];
    if (!post || (now - new Date(post.date)) / DAY >= NEW_POST_DAYS) return;
    var badge = document.createElement('em');
    badge.className = 'blog-new';
    badge.textContent = 'new';
    card.querySelector('.blog-meta').prepend(badge);
  });

  /* Model version + last deploy, from the most recent commit (cached per session) */
  function applyCommit(c) {
    var d = new Date(c.date);
    var version = 'v' + d.getFullYear() + '.' + String(d.getMonth() + 1).padStart(2, '0');
    document.querySelectorAll('[data-model-version]').forEach(function (el) { el.textContent = version; });
    var el = document.getElementById('lastDeploy');
    if (!el) return;
    var msg = c.message.split('\n')[0];
    if (msg.length > 48) msg = msg.slice(0, 47) + '…';
    var a = document.createElement('a');
    a.href = c.url;
    a.textContent = ago(d) + ' · “' + msg + '”';
    el.textContent = 'Last deploy: ';
    el.appendChild(a);
    el.hidden = false;
  }

  var KEY = 'bing-last-commit';
  var cached = null;
  try { cached = JSON.parse(window.sessionStorage.getItem(KEY)); } catch (_e) { /* private mode */ }
  if (cached && now - cached.fetched < 3600000) {
    applyCommit(cached);
  } else if (window.fetch) {
    window.fetch('https://api.github.com/repos/' + REPO + '/commits?per_page=1')
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (list) {
        var c = list[0];
        var info = { date: c.commit.committer.date, message: c.commit.message, url: c.html_url, fetched: now };
        try { window.sessionStorage.setItem(KEY, JSON.stringify(info)); } catch (_e) { /* private mode */ }
        applyCommit(info);
      })
      .catch(function () { /* offline or rate-limited: static text stays */ });
  }
})();
