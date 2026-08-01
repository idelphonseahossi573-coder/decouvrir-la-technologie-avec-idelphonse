/* ============================================================
   PROGRESS.JS v3.0 — Système de progression CORRIGÉ
   ============================================================ */

var IDW3 = (function() {
  'use strict';

  var KEY = 'idw3_progress';

  /* ── MODULES ─────────────────────────────────────────────── */
  var MODULES = {
    debutant: {
      label: 'Parcours Débutant', icon: '🌱', color: '#059669',
      modules: [
        { id: 'db_internet',   label: 'Internet & le Web' },
        { id: 'db_web123',     label: 'Web1, Web2, Web3' },
        { id: 'db_blockchain', label: 'Introduction Blockchain' },
        { id: 'db_bitcoin',    label: 'Bitcoin & Ethereum' },
        { id: 'db_crypto',     label: 'Les Cryptomonnaies' },
        { id: 'db_wallet',     label: 'Les Wallets' },
        { id: 'db_seed',       label: 'Seed Phrase & Clés' },
        { id: 'db_securite',   label: 'Sécurité Numérique' },
        { id: 'db_arnaques',   label: 'Arnaques Courantes' },
        { id: 'db_pratique',   label: 'Créer son premier wallet' },
        { id: 'db_quiz',       label: 'Quiz Débutant' }
      ]
    },
    intermediaire: {
      label: 'Parcours Intermédiaire', icon: '📈', color: '#1e5fcc',
      modules: [
        { id: 'im_smartcontract', label: 'Smart Contracts' },
        { id: 'im_dapps',         label: 'DApps' },
        { id: 'im_cex',           label: 'Exchanges Centralisés' },
        { id: 'im_dex',           label: 'Exchanges Décentralisés' },
        { id: 'im_stablecoin',    label: 'Stablecoins' },
        { id: 'im_staking',       label: 'Staking' },
        { id: 'im_defi',          label: 'DeFi' },
        { id: 'im_yield',         label: 'Yield Farming' },
        { id: 'im_nft',           label: 'NFT' },
        { id: 'im_dao',           label: 'DAO' },
        { id: 'im_layer',         label: 'Layer 1 & Layer 2' },
        { id: 'im_tokenomics',    label: 'Tokenomics' },
        { id: 'im_quiz',          label: 'Quiz Intermédiaire' }
      ]
    },
    avance: {
      label: 'Parcours Avancé', icon: '🚀', color: '#7b5ea7',
      modules: [
        { id: 'av_ecosystemes', label: 'Écosystèmes Blockchain' },
        { id: 'av_analyse',     label: 'Analyser un projet' },
        { id: 'av_airdrops',    label: 'Airdrops' },
        { id: 'av_testnets',    label: 'Testnets' },
        { id: 'av_bugbounty',   label: 'Bug Bounty' },
        { id: 'av_contenu',     label: 'Création de contenu' },
        { id: 'av_marketing',   label: 'Marketing Web3' },
        { id: 'av_community',   label: 'Community Building' },
        { id: 'av_branding',    label: 'Personal Branding' }
      ]
    },
    ambassadeur: {
      label: 'Parcours Ambassadeur', icon: '🌍', color: '#f0c040',
      modules: [
        { id: 'am_bases',      label: 'Maîtriser les bases' },
        { id: 'am_presence',   label: 'Présence en ligne' },
        { id: 'am_contenu',    label: 'Créer du contenu' },
        { id: 'am_cv',         label: 'CV Ambassadeur' },
        { id: 'am_interview',  label: "Réussir l'interview" },
        { id: 'am_evenements', label: 'Organiser des événements' },
        { id: 'am_missions',   label: 'Premières missions' }
      ]
    }
  };

  /* ── BADGES ─────────────────────────────────────────────── */
  var BADGES = [
    {
      id: 'explorer', icon: '🔭', color: '#059669',
      label: 'Explorateur Blockchain',
      desc: 'Premier module complété',
      condition: function(p) { return Object.keys(p.completed).length >= 1; }
    },
    {
      id: 'wallet_expert', icon: '👛', color: '#1e5fcc',
      label: 'Expert Wallet',
      desc: 'Wallets et Seed Phrase maîtrisés',
      condition: function(p) { return !!(p.completed['db_wallet'] && p.completed['db_seed']); }
    },
    {
      id: 'security_expert', icon: '🛡️', color: '#dc2626',
      label: 'Expert Sécurité',
      desc: 'Sécurité et arnaques maîtrisées',
      condition: function(p) { return !!(p.completed['db_securite'] && p.completed['db_arnaques']); }
    },
    {
      id: 'debutant_complete', icon: '🌱', color: '#059669',
      label: 'Diplômé Débutant',
      desc: 'Parcours Débutant complété à 100%',
      condition: function(p) {
        return MODULES.debutant.modules.every(function(m) { return !!p.completed[m.id]; });
      }
    },
    {
      id: 'defi_master', icon: '💰', color: '#f0c040',
      label: 'Maître DeFi',
      desc: 'DeFi, Staking et Yield Farming maîtrisés',
      condition: function(p) {
        return !!(p.completed['im_defi'] && p.completed['im_staking'] && p.completed['im_yield']);
      }
    },
    {
      id: 'web3_analyst', icon: '🔍', color: '#7b5ea7',
      label: 'Analyste Web3',
      desc: 'Analyse de projets et Tokenomics maîtrisés',
      condition: function(p) {
        return !!(p.completed['av_analyse'] && p.completed['im_tokenomics']);
      }
    },
    {
      id: 'intermediaire_complete', icon: '📈', color: '#1e5fcc',
      label: 'Diplômé Intermédiaire',
      desc: 'Parcours Intermédiaire complété à 100%',
      condition: function(p) {
        return MODULES.intermediaire.modules.every(function(m) { return !!p.completed[m.id]; });
      }
    },
    {
      id: 'junior_ambassador', icon: '🌍', color: '#ea580c',
      label: 'Ambassadeur Junior',
      desc: 'Parcours Ambassadeur démarré',
      condition: function(p) {
        return !!(p.completed['am_bases'] && p.completed['am_presence']);
      }
    },
    {
      id: 'certified_ambassador', icon: '🏆', color: '#f0c040',
      label: 'Ambassadeur Certifié',
      desc: 'Certification Web3 obtenue',
      condition: function(p) {
        return !!(p.certifications && p.certifications.length > 0);
      }
    },
    {
      id: 'quiz_master', icon: '🧠', color: '#00d4ff',
      label: 'Quiz Master',
      desc: 'Tous les quiz réussis avec 80%+',
      condition: function(p) {
        var scores = Object.values(p.quizScores || {});
        return scores.length >= 2 && scores.every(function(s) { return s >= 80; });
      }
    }
  ];

  /* ── STORAGE ─────────────────────────────────────────────── */
  function _fresh() {
    return {
      userName: '',
      completed: {},
      quizScores: {},
      badges: [],
      certifications: [],
      lastPage: '',
      startDate: new Date().toISOString(),
      sessions: 0
    };
  }

  function _load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return _fresh();
      var d = JSON.parse(raw);
      if (!d.completed)      d.completed      = {};
      if (!d.quizScores)     d.quizScores     = {};
      if (!d.badges)         d.badges         = [];
      if (!d.certifications) d.certifications = [];
      if (!d.startDate)      d.startDate      = new Date().toISOString();
      if (typeof d.sessions !== 'number') d.sessions = 0;
      return d;
    } catch(e) {
      console.warn('[IDW3] Erreur lecture localStorage:', e.message);
      return _fresh();
    }
  }

  function _save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch(e) {
      console.warn('[IDW3] Erreur écriture localStorage:', e.message);
      return false;
    }
  }

  /* ── BADGE NOTIFICATION ──────────────────────────────────── */
  function _showBadgeToast(badge) {
    try {
      var el = document.createElement('div');
      el.style.cssText = [
        'position:fixed;bottom:80px;left:24px;z-index:9999',
        'background:linear-gradient(135deg,#1e5fcc,#00d4ff)',
        'color:#fff;padding:14px 20px;border-radius:12px',
        'display:flex;align-items:center;gap:12px',
        'box-shadow:0 8px 32px rgba(0,0,0,.35)',
        'max-width:280px;font-family:sans-serif',
        'transform:translateX(-130%)',
        'transition:transform .4s cubic-bezier(.34,1.56,.64,1)'
      ].join(';');
      el.innerHTML = [
        '<span style="font-size:1.6rem;flex-shrink:0">' + badge.icon + '</span>',
        '<div>',
          '<div style="font-weight:700;font-size:.85rem">Badge débloqué !</div>',
          '<div style="font-size:.8rem;opacity:.9">' + badge.label + '</div>',
        '</div>'
      ].join('');
      document.body.appendChild(el);
      // Double rAF pour forcer le reflow avant la transition
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          el.style.transform = 'translateX(0)';
        });
      });
      setTimeout(function() {
        el.style.transform = 'translateX(-130%)';
        setTimeout(function() {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 450);
      }, 3500);
    } catch(e) { /* DOM pas prêt */ }
  }

  /* ── CHECK BADGES ────────────────────────────────────────── */
  // FIX : accepte l'objet p déjà muté, le sauvegarde en interne
  function _checkAndAwardBadges(p) {
    var awarded = false;
    BADGES.forEach(function(badge) {
      if (p.badges.indexOf(badge.id) === -1 && badge.condition(p)) {
        p.badges.push(badge.id);
        awarded = true;
        // Stagger les notifications
        var delay = (p.badges.length - 1) * 700;
        setTimeout(function() { _showBadgeToast(badge); }, delay);
      }
    });
    return awarded;
  }

  /* ── API PUBLIQUE ────────────────────────────────────────── */

  function getProgress() {
    return _load();
  }

  // FIX CRITIQUE : opération atomique — charge, mute, vérifie badges, sauvegarde
  function markComplete(moduleId) {
    if (!moduleId) return false;
    var p = _load();
    if (p.completed[moduleId]) return false; // déjà fait
    p.completed[moduleId] = new Date().toISOString();
    _checkAndAwardBadges(p);
    return _save(p);
  }

  // FIX CRITIQUE : opération atomique inverse
  function markIncomplete(moduleId) {
    if (!moduleId) return false;
    var p = _load();
    if (!p.completed[moduleId]) return false;
    delete p.completed[moduleId];
    return _save(p);
  }

  // FIX CRITIQUE : opération atomique complète
  // charge → met à jour score → marque module terminé → vérifie badges → sauvegarde
  function saveQuizScore(quizId, score, total) {
    if (!quizId || total <= 0) return 0;
    var p    = _load();
    var pct  = Math.round((score / total) * 100);
    var prev = p.quizScores[quizId] || 0;
    if (pct >= prev) p.quizScores[quizId] = pct;
    // Marquer le module quiz terminé dans le même objet p
    if (!p.completed[quizId]) {
      p.completed[quizId] = new Date().toISOString();
    }
    _checkAndAwardBadges(p);
    _save(p); // Un seul save atomique
    return pct;
  }

  function setUserName(name) {
    var p = _load();
    p.userName = (name || '').trim();
    return _save(p);
  }

  function setLastPage(page) {
    var p = _load();
    p.lastPage = page || '';
    _save(p);
  }

  // FIX : utilise sessionStorage pour ne compter qu'une session par onglet
  function trackSession() {
    var sessionKey = 'idw3_sess_' + new Date().toDateString();
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, '1');
      var p = _load();
      p.sessions = (p.sessions || 0) + 1;
      _save(p);
    }
  }

  // FIX CRITIQUE : opération atomique pour certification
  function saveCertification(cert) {
    if (!cert || !cert.id) return false;
    var p = _load();
    // Éviter les doublons
    var exists = p.certifications.some(function(c) { return c.id === cert.id; });
    if (exists) return false;
    p.certifications.push(cert);
    _checkAndAwardBadges(p);
    _save(p);
    return true;
  }

  function verifyCertification(certId) {
    if (!certId) return null;
    var p = _load();
    for (var i = 0; i < p.certifications.length; i++) {
      if (p.certifications[i].id === certId) return p.certifications[i];
    }
    return null;
  }

  /* ── STATS ───────────────────────────────────────────────── */
  function getGlobalPercent() {
    var p = _load();
    var total = 0, done = 0;
    Object.values(MODULES).forEach(function(section) {
      total += section.modules.length;
      section.modules.forEach(function(m) { if (p.completed[m.id]) done++; });
    });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }

  function getSectionPercent(sectionKey) {
    var p       = _load();
    var section = MODULES[sectionKey];
    if (!section) return 0;
    var done = section.modules.filter(function(m) { return !!p.completed[m.id]; }).length;
    return Math.round((done / section.modules.length) * 100);
  }

  function getUnlockedBadges() {
    var p = _load();
    return BADGES.filter(function(b) { return p.badges.indexOf(b.id) !== -1; });
  }

  function resetAll() {
    try { localStorage.removeItem(KEY); return true; } catch(e) { return false; }
  }

  /* ── AUTO-INIT ───────────────────────────────────────────── */
  (function() {
    try {
      var page = (window.location.pathname.split('/').pop() || 'index.html');
      setLastPage(page);
      trackSession();
    } catch(e) {}
  })();

  /* ── EXPORT ──────────────────────────────────────────────── */
  return {
    MODULES           : MODULES,
    BADGES            : BADGES,
    getProgress       : getProgress,
    markComplete      : markComplete,
    markIncomplete    : markIncomplete,
    saveQuizScore     : saveQuizScore,
    setUserName       : setUserName,
    setLastPage       : setLastPage,
    saveCertification : saveCertification,
    verifyCertification: verifyCertification,
    getGlobalPercent  : getGlobalPercent,
    getSectionPercent : getSectionPercent,
    getUnlockedBadges : getUnlockedBadges,
    resetAll          : resetAll,
    // Aliases pour compatibilité dashboard
    load              : _load,
    save              : _save
  };

})();
