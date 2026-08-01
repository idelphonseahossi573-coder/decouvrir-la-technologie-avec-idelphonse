/* ============================================================
   SCRIPT.JS v3.0 — Script global corrigé
   Chargé sur toutes les pages. progress.js chargé APRÈS.
   ============================================================ */

/* ── DARK MODE ───────────────────────────────────────────── */
(function() {
  var theme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
})();

window.addEventListener('DOMContentLoaded', function() {
  var btn = document.getElementById('dark-toggle');
  if (btn) {
    var theme = document.documentElement.getAttribute('data-theme');
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.addEventListener('click', function() {
      var cur  = document.documentElement.getAttribute('data-theme');
      var next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      btn.textContent = next === 'dark' ? '☀️' : '🌙';
    });
  }
});

/* ── MOBILE MENU ─────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', function() {
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;
  hamburger.addEventListener('click', function() {
    mobileMenu.classList.toggle('open');
  });
  document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
});

/* ── BACK TO TOP ─────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', function() {
  var btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', function() {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ── SCROLL REVEAL ───────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', function() {
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  if (!window.IntersectionObserver) {
    els.forEach(function(el) { el.classList.add('revealed'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
  els.forEach(function(el) { obs.observe(el); });
});

/* ── ACCORDIONS ──────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.accordion-trigger').forEach(function(trigger) {
    trigger.addEventListener('click', function() {
      var body   = trigger.nextElementSibling;
      var isOpen = trigger.classList.contains('open');
      var parent = trigger.closest('.accordion');
      if (parent) {
        parent.querySelectorAll('.accordion-trigger.open').forEach(function(t) {
          t.classList.remove('open');
          if (t.nextElementSibling) t.nextElementSibling.classList.remove('open');
        });
      }
      if (!isOpen && body) {
        trigger.classList.add('open');
        body.classList.add('open');
      }
    });
  });
});

/* ── SMOOTH SCROLL ───────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var id     = a.getAttribute('href');
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
});

/* ── COUNTER ANIMATION ───────────────────────────────────── */
window.addEventListener('DOMContentLoaded', function() {
  var section = document.querySelector('.stats-bar');
  if (!section) return;
  var ran = false;
  function run() {
    if (ran) return;
    ran = true;
    document.querySelectorAll('[data-count]').forEach(function(el) {
      var target   = parseInt(el.getAttribute('data-count'), 10);
      var suffix   = el.getAttribute('data-suffix') || '';
      var duration = 1800;
      var steps    = duration / 16;
      var step     = target / steps;
      var cur      = 0;
      var timer = setInterval(function() {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(timer); }
        el.textContent = Math.floor(cur).toLocaleString('fr-FR') + suffix;
      }, 16);
    });
  }
  if (window.IntersectionObserver) {
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) { run(); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(section);
  } else {
    run();
  }
});

/* ── NAV PROGRESS BAR ────────────────────────────────────── */
// Injectée APRÈS que progress.js soit chargé (DOMContentLoaded tardif)
window.addEventListener('load', function() {
  if (typeof IDW3 === 'undefined') return;
  var pct = IDW3.getGlobalPercent();
  if (pct === 0) return;
  var bar = document.createElement('div');
  bar.setAttribute('aria-hidden', 'true');
  bar.style.cssText = 'position:fixed;top:70px;left:0;right:0;height:3px;background:rgba(255,255,255,.06);z-index:998;pointer-events:none;';
  var fill = document.createElement('div');
  fill.style.cssText = 'height:100%;width:0;background:linear-gradient(90deg,#1e5fcc,#00d4ff);transition:width 1.2s ease;';
  bar.appendChild(fill);
  document.body.appendChild(bar);
  setTimeout(function() { fill.style.width = pct + '%'; }, 200);
});

/* ── GLOSSARY SEARCH ─────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('glossary-search');
  if (!input) return;
  input.addEventListener('input', function() {
    var val = input.value.toLowerCase().trim();
    document.querySelectorAll('.glossary-term').forEach(function(term) {
      var show = !val || term.textContent.toLowerCase().indexOf(val) !== -1;
      term.style.display = show ? '' : 'none';
    });
  });
  document.querySelectorAll('.alpha-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.alpha-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var letter = btn.getAttribute('data-letter');
      document.querySelectorAll('.glossary-term').forEach(function(t) {
        var title = t.querySelector('.glossary-term-title');
        var show  = letter === 'all' || (title && title.textContent.trim().charAt(0).toUpperCase() === letter);
        t.style.display = show ? '' : 'none';
      });
      input.value = '';
    });
  });
});

/* ── CONTACT FORM ────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('✅ Message envoyé ! Idelphonse vous répond sous 24h.');
    form.reset();
  });
});

/* ── TOAST ───────────────────────────────────────────────── */
function showToast(msg, duration) {
  duration = duration || 3500;
  var toast = document.getElementById('_idw3_toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = '_idw3_toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, duration);
}

/* ── QUIZ ENGINE ─────────────────────────────────────────── */
// Map container IDs → module IDs pour la sauvegarde progression
var QUIZ_MODULE_MAP = {
  'quiz-debutant':      'db_quiz',
  'quiz-intermediaire': 'im_quiz'
};

function initQuiz(containerId, questions) {
  var container = document.getElementById(containerId);
  if (!container) return;

  var current  = 0;
  var score    = 0;
  var answered = false;

  // Sauvegarder pour le bouton "recommencer"
  if (!window._quizData) window._quizData = {};
  window._quizData[containerId] = questions;

  function getLetters() { return ['A','B','C','D']; }

  function render() {
    if (current >= questions.length) {
      // FIN : sauvegarder le score
      var pct    = Math.round((score / questions.length) * 100);
      var passed = pct >= 60;
      var color  = pct >= 80 ? '#059669' : pct >= 60 ? '#f0c040' : '#dc2626';

      // FIX : un seul appel saveQuizScore (atomique dans progress.js v3)
      if (typeof IDW3 !== 'undefined' && QUIZ_MODULE_MAP[containerId]) {
        IDW3.saveQuizScore(QUIZ_MODULE_MAP[containerId], score, questions.length);
      }

      var dashLink = passed
        ? '<div style="background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);border-radius:8px;padding:10px;margin-bottom:16px;font-size:.8rem;color:#059669">✅ Progression sauvegardée — <a href="dashboard.html" style="color:#059669;font-weight:600;text-decoration:underline">Voir mon Dashboard</a></div>'
        : '';

      container.innerHTML = '<div class="quiz-container" style="text-align:center">'
        + '<div style="font-size:3rem;margin-bottom:12px">' + (pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚') + '</div>'
        + '<div class="quiz-title">Quiz terminé !</div>'
        + '<p class="quiz-subtitle" style="margin:8px 0">Score : <strong>' + score + '/' + questions.length
        + '</strong> — <strong style="color:' + color + '">' + pct + '%</strong></p>'
        + '<div style="height:8px;background:var(--gray-200);border-radius:50px;overflow:hidden;max-width:240px;margin:10px auto 14px">'
        + '<div style="height:100%;width:' + pct + '%;background:' + color + ';border-radius:50px;transition:width 1s ease"></div></div>'
        + '<p style="font-size:.875rem;color:var(--text-light);margin-bottom:16px">'
        + (pct === 100 ? 'Parfait ! Maîtrise totale du module.'
           : pct >= 80  ? 'Excellent ! Continuez sur cette lancée.'
           : pct >= 60  ? 'Bon résultat ! Révisez les points manqués.'
           : 'Relisez le cours et réessayez — vous y arriverez !')
        + '</p>'
        + dashLink
        + '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">'
        + '<button class="btn btn-primary" onclick="initQuiz(\'' + containerId + '\',window._quizData[\'' + containerId + '\'])">🔄 Recommencer</button>'
        + '<a href="dashboard.html" class="btn btn-ghost">📊 Dashboard</a>'
        + '</div></div>';
      return;
    }

    // QUESTION
    var q        = questions[current];
    answered     = false;
    var letters  = getLetters();
    var optsHtml = '';
    for (var i = 0; i < q.options.length; i++) {
      optsHtml += '<button class="quiz-option" data-idx="' + i + '">'
        + '<span style="background:var(--gray-200);width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;flex-shrink:0;margin-right:10px">'
        + letters[i] + '</span>' + q.options[i] + '</button>';
    }

    var pctDone = Math.round((current / questions.length) * 100);
    container.innerHTML = '<div class="quiz-container">'
      + '<div class="quiz-title">🧠 Quiz Interactif</div>'
      + '<div class="quiz-subtitle" style="margin-bottom:10px">Question ' + (current + 1) + ' / ' + questions.length + '</div>'
      + '<div style="height:4px;background:var(--gray-200);border-radius:50px;overflow:hidden;margin-bottom:16px">'
      + '<div style="height:100%;width:' + pctDone + '%;background:linear-gradient(90deg,#1e5fcc,#00d4ff);border-radius:50px"></div></div>'
      + '<div class="quiz-question">' + q.q + '</div>'
      + '<div class="quiz-options" id="_opts_' + containerId + '">' + optsHtml + '</div>'
      + '<div id="_fb_' + containerId + '" style="margin-bottom:12px"></div>'
      + '<div class="quiz-nav">'
      + '<span class="quiz-progress">' + (current + 1) + ' / ' + questions.length + '</span>'
      + '<button class="btn btn-primary btn-sm" id="_next_' + containerId + '" style="display:none">Suivant →</button>'
      + '</div></div>';

    // Événements options
    var optsContainer = document.getElementById('_opts_' + containerId);
    if (optsContainer) {
      optsContainer.querySelectorAll('.quiz-option').forEach(function(btn) {
        btn.addEventListener('click', function() {
          if (answered) return;
          answered    = true;
          var chosen  = parseInt(btn.getAttribute('data-idx'), 10);
          var correct = chosen === q.answer;
          if (correct) score++;

          optsContainer.querySelectorAll('.quiz-option').forEach(function(b, idx) {
            b.disabled = true;
            if (idx === q.answer) b.classList.add('correct');
            else if (idx === chosen && !correct) b.classList.add('wrong');
          });

          var fb = document.getElementById('_fb_' + containerId);
          if (fb) {
            fb.innerHTML = '<div class="quiz-feedback ' + (correct ? 'correct' : 'wrong') + '">'
              + (correct ? '✅ ' : '❌ ') + q.explanation + '</div>';
          }

          var nb = document.getElementById('_next_' + containerId);
          if (nb) nb.style.display = 'inline-flex';
        });
      });
    }

    // Bouton suivant
    var nextBtn = document.getElementById('_next_' + containerId);
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        current++;
        render();
      });
    }
  }

  render();
}
