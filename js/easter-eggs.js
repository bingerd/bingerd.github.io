/* Easter Eggs */
(function() {
  var achievements = JSON.parse(localStorage.getItem('bing-achievements') || '{}');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showToast(text) {
    var toast = document.createElement('div');
    toast.className = 'konami-toast';
    toast.textContent = text;
    document.body.appendChild(toast);
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        toast.classList.add('visible');
      });
    });
    setTimeout(function() {
      toast.classList.remove('visible');
      setTimeout(function() { toast.remove(); }, 400);
    }, 3500);
  }

  function unlock(id, text) {
    if (achievements[id]) return;
    achievements[id] = true;
    localStorage.setItem('bing-achievements', JSON.stringify(achievements));
    showToast(text);
    updateBadgeCounter();
  }

  // ==========================================
  // 1. KONAMI CODE: up up down down left right left right b a
  // ==========================================
  var konamiSeq = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var konamiPos = 0;

  document.addEventListener('keydown', function(e) {
    if (e.keyCode === konamiSeq[konamiPos]) {
      konamiPos++;
      if (konamiPos === konamiSeq.length) {
        konamiPos = 0;
        activateKonami();
      }
    } else {
      konamiPos = 0;
    }
  });

  function activateKonami() {
    unlock('konami', 'Achievement unlocked: Found the backdoor');

    var overlay = document.createElement('div');
    overlay.className = 'konami-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Easter egg activated');
    document.body.appendChild(overlay);

    function dismiss() {
      overlay.classList.remove('active');
      setTimeout(function() { overlay.remove(); }, 300);
    }
    document.addEventListener('keydown', function onEsc(e) {
      if (e.key === 'Escape') { dismiss(); document.removeEventListener('keydown', onEsc); }
    });

    var lines = [
      '> sudo deploy --force',
      'Deploying bing-tan to production...',
      'Loading weights... done.',
      'Model loaded. Inference ready.'
    ];

    overlay.classList.add('active');

    if (prefersReducedMotion) {
      overlay.innerHTML = lines.map(function(l) { return '<div>' + l + '</div>'; }).join('');
      setTimeout(dismiss, 3000);
      return;
    }

    var lineIdx = 0;
    function typeLine() {
      if (lineIdx >= lines.length) {
        setTimeout(function() {
          dismiss();
          if (window.togglePerf) {
            window.togglePerf();
            setTimeout(function() { window.togglePerf(); }, 5000);
          }
        }, 800);
        return;
      }
      var line = lines[lineIdx];
      var div = document.createElement('div');
      overlay.appendChild(div);
      var charIdx = 0;
      var interval = setInterval(function() {
        div.textContent = line.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx >= line.length) {
          clearInterval(interval);
          lineIdx++;
          setTimeout(typeLine, 400);
        }
      }, 30);
    }
    typeLine();
  }

  // ==========================================
  // 2. LOGO CLICK: click the logo 5 times fast
  // ==========================================
  var logoClicks = 0;
  var logoTimer = null;

  document.addEventListener('DOMContentLoaded', function() {
    var logo = document.querySelector('nav .logo');
    if (logo) {
      logo.style.cursor = 'pointer';
      logo.addEventListener('click', function() {
        logoClicks++;
        clearTimeout(logoTimer);
        logoTimer = setTimeout(function() { logoClicks = 0; }, 1500);
        if (logoClicks >= 5) {
          logoClicks = 0;
          unlock('logo5', 'Achievement unlocked: Persistent clicker');
          // Invert colors briefly
          document.body.style.filter = 'invert(1) hue-rotate(180deg)';
          setTimeout(function() {
            document.body.style.filter = '';
          }, prefersReducedMotion ? 100 : 2000);
        }
      });
    }
  });

  // ==========================================
  // 3. MATRIX MODE: type "matrix" anywhere on the page
  // ==========================================
  var matrixBuffer = '';

  document.addEventListener('keypress', function(e) {
    matrixBuffer += e.key.toLowerCase();
    if (matrixBuffer.length > 10) matrixBuffer = matrixBuffer.slice(-10);
    if (matrixBuffer.includes('matrix')) {
      matrixBuffer = '';
      activateMatrix();
    }
  });

  function activateMatrix() {
    unlock('matrix', 'Achievement unlocked: You took the red pill');
    if (prefersReducedMotion) return;

    var canvas = document.createElement('canvas');
    canvas.className = 'matrix-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var cols = Math.floor(canvas.width / 14);
    var drops = [];
    for (var i = 0; i < cols; i++) drops[i] = Math.random() * -100;
    var chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01'.split('');

    var frame = 0;
    var maxFrames = 180; // ~3 seconds at 60fps

    function drawMatrix() {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0';
      ctx.font = '14px monospace';

      for (var j = 0; j < drops.length; j++) {
        var char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, j * 14, drops[j] * 14);
        if (drops[j] * 14 > canvas.height && Math.random() > 0.975) drops[j] = 0;
        drops[j]++;
      }

      frame++;
      if (frame < maxFrames) {
        requestAnimationFrame(drawMatrix);
      } else {
        canvas.style.transition = 'opacity 0.5s';
        canvas.style.opacity = '0';
        setTimeout(function() { canvas.remove(); }, 500);
      }
    }
    drawMatrix();
  }

  // ==========================================
  // 4. /help COMMAND: type "/help" to see all easter eggs
  // ==========================================
  var helpBuffer = '';

  document.addEventListener('keypress', function(e) {
    helpBuffer += e.key;
    if (helpBuffer.length > 10) helpBuffer = helpBuffer.slice(-10);
    if (helpBuffer.includes('/help')) {
      helpBuffer = '';
      showHelp();
    }
  });

  function showHelp() {
    unlock('help', 'Achievement unlocked: RTFM');

    var overlay = document.createElement('div');
    overlay.className = 'konami-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Easter egg help');
    document.body.appendChild(overlay);

    var found = Object.keys(achievements).length;
    var total = 7;

    overlay.innerHTML =
      '<div style="text-align:left; max-width:480px; width:100%; padding:0 24px;">' +
        '<div style="margin-bottom:24px; font-size:1.4rem;">Easter Eggs (' + found + '/' + total + ')</div>' +
        '<div style="font-size:0.9rem; line-height:2; opacity:0.8;">' +
          eggLine('konami', 'Konami Code', '\u2191\u2191\u2193\u2193\u2190\u2192\u2190\u2192 B A') +
          eggLine('logo5', 'Persistent Clicker', 'Click the logo 5 times fast') +
          eggLine('matrix', 'Red Pill', 'Type "matrix"') +
          eggLine('help', 'RTFM', 'Type "/help"') +
          eggLine('dark10', 'Night Owl', 'Toggle the theme 10 times') +
          eggLine('scroll', 'Deep Diver', 'Scroll to the very bottom') +
          eggLine('time', 'Dedicated', 'Spend 5 minutes on the site') +
        '</div>' +
        '<div style="margin-top:24px; font-size:0.75rem; opacity:0.4;">Press Escape to close</div>' +
      '</div>';

    overlay.classList.add('active');

    function dismiss() {
      overlay.classList.remove('active');
      setTimeout(function() { overlay.remove(); }, 300);
    }
    document.addEventListener('keydown', function onEsc(e) {
      if (e.key === 'Escape') { dismiss(); document.removeEventListener('keydown', onEsc); }
    });
    overlay.addEventListener('click', dismiss);
  }

  function eggLine(id, name, hint) {
    var found = achievements[id];
    return '<div>' + (found ? '\u2705' : '\u2B1C') + ' <strong>' + name + '</strong> — ' +
      (found ? '<span style="opacity:0.5">' + hint + '</span>' : '<span style="opacity:0.3">???</span>') +
      '</div>';
  }

  // ==========================================
  // 5. THEME TOGGLE 10x: toggle dark/light 10 times
  // ==========================================
  var themeToggles = 0;
  var origToggleTheme = null;

  document.addEventListener('DOMContentLoaded', function() {
    // Wrap toggleTheme to count
    var check = setInterval(function() {
      if (window.toggleTheme && window.toggleTheme !== wrappedToggle) {
        origToggleTheme = window.toggleTheme;
        window.toggleTheme = wrappedToggle;
        clearInterval(check);
      }
    }, 200);
  });

  function wrappedToggle() {
    if (origToggleTheme) origToggleTheme();
    themeToggles++;
    if (themeToggles >= 10 && !achievements['dark10']) {
      unlock('dark10', 'Achievement unlocked: Night owl');
    }
  }

  // ==========================================
  // 6. SCROLL TO BOTTOM
  // ==========================================
  window.addEventListener('scroll', function() {
    var scrolled = window.innerHeight + window.scrollY;
    var total = document.documentElement.scrollHeight;
    if (scrolled >= total - 10) {
      unlock('scroll', 'Achievement unlocked: Deep diver');
    }
  });

  // ==========================================
  // 7. SPEND 5 MINUTES ON SITE
  // ==========================================
  setTimeout(function() {
    unlock('time', 'Achievement unlocked: Dedicated visitor');
  }, 5 * 60 * 1000);

  // ==========================================
  // BADGE COUNTER (in footer)
  // ==========================================
  function updateBadgeCounter() {
    var el = document.getElementById('eggCounter');
    if (el) {
      var count = Object.keys(achievements).length;
      el.textContent = count + '/7';
      el.style.opacity = '1';
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    var count = Object.keys(achievements).length;
    if (count > 0) updateBadgeCounter();
  });
})();
