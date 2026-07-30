/* ============================================================
   DÉCOUVRIR LA TECHNOLOGIE AVEC IDELPHONSE — script.js
   v2.0 — Avec système de progression intégré
   ============================================================ */

/* ── DARK MODE ───────────────────────────────────────────── */
const toggle = document.getElementById('dark-toggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
if (toggle) {
  toggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  toggle.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggle.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

/* ── MOBILE MENU ─────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target))
      mobileMenu.classList.remove('open');
  });
}

/* ── BACK TO TOP ─────────────────────────────────────────── */
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 400));
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── SCROLL REVEAL ───────────────────────────────────────── */
const reveals = document.querySelectorAll('[data-reveal]');
if (reveals.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => obs.observe(el));
}

/* ── ACCORDIONS ──────────────────────────────────────────── */
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const body = trigger.nextElementSibling;
    const isOpen = trigger.classList.contains('open');
    const parent = trigger.closest('.accordion');
    if (parent) {
      parent.querySelectorAll('.accordion-trigger.open').forEach(t => {
        t.classList.remove('open');
        t.nextElementSibling.classList.remove('open');
      });
    }
    if (!isOpen) { trigger.classList.add('open'); body.classList.add('open'); }
  });
});

/* ── QUIZ ENGINE (avec sauvegarde progression) ───────────── */
function initQuiz(containerId, questions) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let current = 0;
  let score = 0;
  let answered = false;

  // Map quiz container IDs to progress module IDs
  const QUIZ_MODULE_MAP = {
    'quiz-debutant':      'db_quiz',
    'quiz-intermediaire': 'im_quiz',
  };

  function render() {
    if (current >= questions.length) {
      const pct = Math.round((score / questions.length) * 100);
      const passed = pct >= 60;
      // Save to progress system if available
      if (typeof IDW3 !== 'undefined' && QUIZ_MODULE_MAP[containerId]) {
        IDW3.saveQuizScore(QUIZ_MODULE_MAP[containerId], score, questions.length);
      }
      container.innerHTML = `
        <div class="quiz-container text-center">
          <div style="font-size:3rem;margin-bottom:16px;">${pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '📚'}</div>
          <h3 class="quiz-title">Quiz terminé !</h3>
          <p class="quiz-subtitle">Score : <strong>${score}/${questions.length}</strong> — <strong style="color:${pct>=80?'#059669':pct>=60?'#f0c040':'#dc2626'}">${pct}%</strong></p>
          <div style="margin:12px 0 20px;">
            <div class="progress-track" style="height:8px;max-width:240px;margin:0 auto;">
              <div class="progress-fill" style="width:${pct}%;background:${pct>=80?'linear-gradient(90deg,#059669,#10b981)':pct>=60?'linear-gradient(90deg,#d97706,#f0c040)':'linear-gradient(90deg,#dc2626,#ef4444)'};"></div>
            </div>
          </div>
          <p style="font-size:.875rem;color:var(--text-light);margin:0 0 20px;">
            ${pct === 100 ? 'Parfait ! Maîtrise totale du module.' : pct >= 80 ? 'Excellent travail ! Continuez ainsi.' : pct >= 60 ? 'Bon résultat ! Révisez les points manqués.' : 'Relisez le cours et réessayez — vous y arriverez !'}
          </p>
          ${passed && typeof IDW3 !== 'undefined' ? `<div style="background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);border-radius:8px;padding:12px;margin-bottom:16px;font-size:.8rem;color:#059669;">✅ Progression sauvegardée dans votre <a href="dashboard.html" style="color:#059669;font-weight:600;">Dashboard</a></div>` : ''}
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="initQuiz('${containerId}', window._quizData['${containerId}'])">🔄 Recommencer</button>
            <a href="dashboard.html" class="btn btn-ghost">📊 Mon dashboard</a>
          </div>
        </div>`;
      return;
    }

    const q = questions[current];
    answered = false;
    container.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-title">🧠 Quiz Interactif</div>
        <div class="quiz-subtitle">Testez vos connaissances · Question ${current + 1}/${questions.length}</div>
        <div style="margin-bottom:12px;">
          <div class="progress-track" style="height:4px;">
            <div class="progress-fill" style="width:${(current/questions.length)*100}%;"></div>
          </div>
        </div>
        <div class="quiz-question">Question ${current + 1} : ${q.q}</div>
        <div class="quiz-options">
          ${q.options.map((o, i) => `<button class="quiz-option" data-i="${i}">${o}</button>`).join('')}
        </div>
        <div id="qfeedback"></div>
        <div class="quiz-nav">
          <span class="quiz-progress">${current + 1} / ${questions.length}</span>
          <button class="btn btn-primary btn-sm" id="qnext" style="display:none">Suivant →</button>
        </div>
      </div>`;

    container.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const i = parseInt(btn.dataset.i);
        const correct = i === q.answer;
        if (correct) score++;
        container.querySelectorAll('.quiz-option').forEach((b, idx) => {
          if (idx === q.answer) b.classList.add('correct');
          else if (idx === i && !correct) b.classList.add('wrong');
          b.disabled = true;
        });
        document.getElementById('qfeedback').innerHTML = `
          <div class="quiz-feedback ${correct ? 'correct' : 'wrong'}">
            ${correct ? '✅ ' : '❌ '} ${q.explanation}
          </div>`;
        document.getElementById('qnext').style.display = 'inline-flex';
      });
    });
    const nextBtn = document.getElementById('qnext');
    if (nextBtn) nextBtn.addEventListener('click', () => { current++; render(); });
  }

  if (!window._quizData) window._quizData = {};
  window._quizData[containerId] = questions;
  render();
}

/* ── COUNTER ANIMATION ───────────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const step = target / (duration / 16);
    let cur = 0;
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(timer); }
      el.textContent = Math.floor(cur).toLocaleString('fr-FR') + suffix;
    }, 16);
  });
}
const statsSection = document.querySelector('.stats-bar');
if (statsSection) {
  const so = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { animateCounters(); so.disconnect(); }
  }, { threshold: 0.3 });
  so.observe(statsSection);
}

/* ── ACTIVE NAV ──────────────────────────────────────────── */
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html'))
    a.classList.add('active');
});

/* ── GLOBAL PROGRESS BAR IN NAV ─────────────────────────── */
(function injectNavProgress() {
  if (typeof IDW3 === 'undefined') return;
  const pct = IDW3.getGlobalPercent();
  if (pct === 0) return;
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:fixed;top:70px;left:0;right:0;height:3px;
    background:var(--gray-200);z-index:999;`;
  const fill = document.createElement('div');
  fill.style.cssText = `
    height:100%;width:${pct}%;
    background:linear-gradient(90deg,#1e5fcc,#00d4ff);
    transition:width 1s ease;`;
  bar.appendChild(fill);
  document.body.appendChild(bar);
})();

/* ── GLOSSARY SEARCH ─────────────────────────────────────── */
const glossarySearch = document.getElementById('glossary-search');
if (glossarySearch) {
  glossarySearch.addEventListener('input', () => {
    const val = glossarySearch.value.toLowerCase().trim();
    document.querySelectorAll('.glossary-term').forEach(term => {
      term.style.display = val === '' || term.textContent.toLowerCase().includes(val) ? '' : 'none';
    });
  });
}

/* ── ALPHA NAVIGATION ────────────────────────────────────── */
document.querySelectorAll('.alpha-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.alpha-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const letter = btn.dataset.letter;
    document.querySelectorAll('.glossary-term').forEach(t => {
      const title = t.querySelector('.glossary-term-title').textContent;
      t.style.display = letter === 'all' || title.toUpperCase().startsWith(letter) ? '' : 'none';
    });
    if (glossarySearch) glossarySearch.value = '';
  });
});

/* ── CONTACT FORM ────────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('✅ Message envoyé ! Je vous réponds sous 24h.');
    contactForm.reset();
  });
}

/* ── TOAST ───────────────────────────────────────────────── */
function showToast(msg, duration = 3500) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── MODULE MARK-COMPLETE BUTTONS ────────────────────────── */
document.querySelectorAll('[data-complete-module]').forEach(btn => {
  const moduleId = btn.dataset.completeModule;
  if (typeof IDW3 !== 'undefined') {
    const p = IDW3.getProgress();
    if (p.completed[moduleId]) {
      btn.textContent = '✅ Module terminé';
      btn.classList.add('btn-ghost');
      btn.style.borderColor = '#059669';
      btn.style.color = '#059669';
    }
  }
  btn.addEventListener('click', () => {
    if (typeof IDW3 !== 'undefined') {
      IDW3.markComplete(moduleId);
      btn.textContent = '✅ Module terminé';
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-ghost');
      btn.style.borderColor = '#059669';
      btn.style.color = '#059669';
      showToast('✅ Module marqué comme terminé !');
    }
  });
});

/* ── SMOOTH ANCHOR LINKS ─────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});
