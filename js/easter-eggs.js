/* Konami Code Easter Egg: up up down down left right left right b a */
(function() {
  var sequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var pos = 0;
  var triggered = false;

  document.addEventListener('keydown', function(e) {
    if (triggered) return;
    if (e.keyCode === sequence[pos]) {
      pos++;
      if (pos === sequence.length) {
        triggered = true;
        activateKonami();
      }
    } else {
      pos = 0;
    }
  });

  function activateKonami() {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create overlay
    var overlay = document.createElement('div');
    overlay.className = 'konami-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Easter egg activated');
    document.body.appendChild(overlay);

    // Dismiss with Escape
    function dismiss() {
      overlay.classList.remove('active');
      setTimeout(function() { overlay.remove(); }, 300);
    }
    document.addEventListener('keydown', function onEsc(e) {
      if (e.key === 'Escape') {
        dismiss();
        document.removeEventListener('keydown', onEsc);
      }
    });

    // Type out terminal lines
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
      showToast();
      return;
    }

    var lineIdx = 0;
    function typeLine() {
      if (lineIdx >= lines.length) {
        setTimeout(function() {
          dismiss();
          // Trigger chaos mode for 5 seconds
          if (window.togglePerf) {
            window.togglePerf();
            setTimeout(function() { window.togglePerf(); }, 5000);
          }
        }, 800);
        showToast();
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

  function showToast() {
    var toast = document.createElement('div');
    toast.className = 'konami-toast';
    toast.textContent = 'Achievement unlocked: Found the backdoor';
    document.body.appendChild(toast);
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        toast.classList.add('visible');
      });
    });
    setTimeout(function() {
      toast.classList.remove('visible');
      setTimeout(function() { toast.remove(); }, 400);
    }, 3000);
  }
})();
