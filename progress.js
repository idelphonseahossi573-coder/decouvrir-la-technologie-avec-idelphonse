/* ============================================================
   PROGRESS.JS v4.0 — Système de progression HYBRIDE
   - Sans connexion : localStorage (comme avant, par appareil)
   - Connecté (Google via Firebase) : Firestore (cross-device)
   Toutes les fonctions publiques restent SYNCHRONES pour la
   lecture (lisent le cache local) et déclenchent une écriture
   asynchrone vers Firestore en arrière-plan si connecté.
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
    { id: 'explorer', icon: '🔭', color: '#059669', label: 'Explorateur Blockchain',
      desc: 'Premier module complété',
      condition: function(p) { return Object.keys(p.completed).length >= 1; } },
    { id: 'wallet_expert', icon: '👛', color: '#1e5fcc', label: 'Expert Wallet',
      desc: 'Wallets et Seed Phrase maîtrisés',
      condition: function(p) { return !!(p.completed['db_wallet'] && p.completed['db_seed']); } },
    { id: 'security_expert', icon: '🛡️', color: '#dc2626', label: 'Expert Sécurité',
      desc: 'Sécurité et arnaques maîtrisées',
      condition: function(p) { return !!(p.completed['db_securite'] && p.completed['db_arnaques']); } },
    { id: 'debutant_complete', icon: '🌱', color: '#059669', label: 'Diplômé Débutant',
      desc: 'Parcours Débutant complété à 100%',
      condition: function(p) { return MODULES.debutant.modules.every(function(m) { return !!p.completed[m.id]; }); } },
    { id: 'defi_master', icon: '💰', color: '#f0c040', label: 'Maître DeFi',
      desc: 'DeFi, Staking et Yield Farming maîtrisés',
      condition: function(p) { return !!(p.completed['im_defi'] && p.completed['im_staking'] && p.completed['im_yield']); } },
    { id: 'web3_analyst', icon: '🔍', color: '#7b5ea7', label: 'Analyste Web3',
      desc: 'Analyse de projets et Tokenomics maîtrisés',
      condition: function(p) { return !!(p.completed['av_analyse'] && p.completed['im_tokenomics']); } },
    { id: 'intermediaire_complete', icon: '📈', color: '#1e5fcc', label: 'Diplômé Intermédiaire',
      desc: 'Parcours Intermédiaire complété à 100%',
      condition: function(p) { return MODULES.intermediaire.modules.every(function(m) { return !!p.completed[m.id]; }); } },
    { id: 'junior_ambassador', icon: '🌍', color: '#ea580c', label: 'Ambassadeur Junior',
      desc: 'Parcours Ambassadeur démarré',
      condition: function(p) { return !!(p.completed['am_bases'] && p.completed['am_presence']); } },
    { id: 'certified_ambassador', icon: '🏆', color: '#f0c040', label: 'Ambassadeur Certifié',
      desc: 'Certification Web3 obtenue',
      condition: function(p) { return !!(p.certifications && p.certifications.length > 0); } },
    { id: 'quiz_master', icon: '🧠', color: '#00d4ff', label: 'Quiz Master',
      desc: 'Tous les quiz réussis avec 80%+',
      condition: function(p) {
        var scores = Object.values(p.quizScores || {});
        return scores.length >= 2 && scores.every(function(s) { return s >= 80; });
      } }
  ];

  /* ── ÉTAT INTERNE ───────────────────────────────────────── */
  var _cache = null;          // dernier état connu (toujours à jour en RAM)
  var _fbUser = null;         // utilisateur Firebase connecté (ou null)
  var _fbReady = false;       // Firebase initialisé avec succès ?
  var _fbDb = null;           // instance Firestore
  var _fbAuth = null;         // instance Auth
  var _authListeners = [];    // callbacks à notifier lors des changements d'auth
  var _remoteUnsub = null;    // fonction pour arrêter l'écoute Firestore en cours

  /* ── LOCALSTORAGE (fallback + cache) ────────────────────── */
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

  function _loadLocal() {
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

  function _saveLocal(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch(e) {
      console.warn('[IDW3] Erreur écriture localStorage:', e.message);
      return false;
    }
  }

  /* Fusionne deux jeux de progression (utilisé lors de la 1ère connexion,
     pour ne perdre ni les données locales ni celles déjà dans le cloud) */
  function _mergeProgress(local, remote) {
    if (!remote) return local;
    if (!local)  return remote;
    var merged = {
      userName: remote.userName || local.userName || '',
      completed: Object.assign({}, local.completed, remote.completed),
      quizScores: {},
      badges: Array.from(new Set([].concat(local.badges || [], remote.badges || []))),
      certifications: [],
      lastPage: remote.lastPage || local.lastPage || '',
      startDate: (local.startDate < remote.startDate) ? local.startDate : remote.startDate,
      sessions: (local.sessions || 0) + (remote.sessions || 0)
    };
    // quizScores : garder le meilleur score de chaque quiz
    var allQuizIds = new Set(Object.keys(local.quizScores || {}).concat(Object.keys(remote.quizScores || {})));
    allQuizIds.forEach(function(qid) {
      var a = (local.quizScores || {})[qid] || 0;
      var b = (remote.quizScores || {})[qid] || 0;
      merged.quizScores[qid] = Math.max(a, b);
    });
    // certifications : fusion par id unique
    var certMap = {};
    (local.certifications || []).forEach(function(c) { certMap[c.id] = c; });
    (remote.certifications || []).forEach(function(c) { certMap[c.id] = c; });
    merged.certifications = Object.values(certMap);
    return merged;
  }

  /* ── BADGE NOTIFICATION ─────────────────────────────────── */
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
      el.innerHTML = '<span style="font-size:1.6rem;flex-shrink:0">' + badge.icon + '</span>'
        + '<div><div style="font-weight:700;font-size:.85rem">Badge débloqué !</div>'
        + '<div style="font-size:.8rem;opacity:.9">' + badge.label + '</div></div>';
      document.body.appendChild(el);
      requestAnimationFrame(function() {
        requestAnimationFrame(function() { el.style.transform = 'translateX(0)'; });
      });
      setTimeout(function() {
        el.style.transform = 'translateX(-130%)';
        setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 450);
      }, 3500);
    } catch(e) { /* DOM pas prêt */ }
  }

  function _showToastSimple(msg) {
    try {
      var el = document.createElement('div');
      el.style.cssText = [
        'position:fixed;bottom:80px;right:24px;z-index:9999',
        'background:#111827;color:#fff;padding:12px 18px;border-radius:10px',
        'font-size:.82rem;font-family:sans-serif;box-shadow:0 8px 32px rgba(0,0,0,.35)',
        'max-width:260px;opacity:0;transition:opacity .3s'
      ].join(';');
      el.textContent = msg;
      document.body.appendChild(el);
      requestAnimationFrame(function() { el.style.opacity = '1'; });
      setTimeout(function() {
        el.style.opacity = '0';
        setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 400);
      }, 3000);
    } catch(e) {}
  }

  function _checkAndAwardBadges(p) {
    var awarded = false;
    BADGES.forEach(function(badge) {
      if (p.badges.indexOf(badge.id) === -1 && badge.condition(p)) {
        p.badges.push(badge.id);
        awarded = true;
        var delay = (p.badges.length - 1) * 700;
        setTimeout(function() { _showBadgeToast(badge); }, delay);
      }
    });
    return awarded;
  }

  /* ── PERSISTENCE UNIFIÉE ─────────────────────────────────── */
  // Toute écriture passe par ici : met à jour le cache RAM + localStorage
  // TOUJOURS (pour rester réactif hors-ligne), et pousse vers Firestore
  // en tâche de fond si un utilisateur est connecté.
  function _persist(p) {
    _cache = p;
    _saveLocal(p);
    if (_fbReady && _fbUser && _fbDb) {
      try {
        _fbDb.collection('progress').doc(_fbUser.uid).set(p, { merge: false })
          .catch(function(err) { console.warn('[IDW3] Sync Firestore échouée:', err.message); });
      } catch(e) { console.warn('[IDW3] Erreur sync Firestore:', e.message); }
    }
  }

  function _load() {
    if (_cache) return _cache;
    _cache = _loadLocal();
    return _cache;
  }

  /* ── API PUBLIQUE : LECTURE (synchrone, depuis le cache) ─── */
  function getProgress() { return _load(); }

  function markComplete(moduleId) {
    if (!moduleId) return false;
    var p = _load();
    if (p.completed[moduleId]) return false;
    p.completed[moduleId] = new Date().toISOString();
    _checkAndAwardBadges(p);
    _persist(p);
    return true;
  }

  function markIncomplete(moduleId) {
    if (!moduleId) return false;
    var p = _load();
    if (!p.completed[moduleId]) return false;
    delete p.completed[moduleId];
    _persist(p);
    return true;
  }

  function saveQuizScore(quizId, score, total) {
    if (!quizId || total <= 0) return 0;
    var p    = _load();
    var pct  = Math.round((score / total) * 100);
    var prev = p.quizScores[quizId] || 0;
    if (pct >= prev) p.quizScores[quizId] = pct;
    if (!p.completed[quizId]) p.completed[quizId] = new Date().toISOString();
    _checkAndAwardBadges(p);
    _persist(p);
    return pct;
  }

  function setUserName(name) {
    var p = _load();
    p.userName = (name || '').trim();
    _persist(p);
    return true;
  }

  function setLastPage(page) {
    var p = _load();
    p.lastPage = page || '';
    _persist(p);
  }

  function trackSession() {
    var sessionKey = 'idw3_sess_' + new Date().toDateString();
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, '1');
      var p = _load();
      p.sessions = (p.sessions || 0) + 1;
      _persist(p);
    }
  }

  function saveCertification(cert) {
    if (!cert || !cert.id) return false;
    var p = _load();
    var exists = p.certifications.some(function(c) { return c.id === cert.id; });
    if (exists) return false;
    p.certifications.push(cert);
    _checkAndAwardBadges(p);
    _persist(p);
    return true;
  }

  // Vérification LOCALE (cache courant) — reste utile hors-ligne
  function verifyCertification(certId) {
    if (!certId) return null;
    var p = _load();
    for (var i = 0; i < p.certifications.length; i++) {
      if (p.certifications[i].id === certId) return p.certifications[i];
    }
    return null;
  }

  // Vérification GLOBALE (Firestore) — cross-device, fonction ASYNCHRONE.
  // Cherche le certificat dans TOUTE la base (peu importe qui est connecté).
  // Retourne une Promise résolue avec { cert, ownerName } ou null.
  function verifyCertificationRemote(certId) {
    return new Promise(function(resolve) {
      if (!certId) { resolve(null); return; }
      if (!_fbReady || !_fbDb) { resolve(null); return; }
      _fbDb.collection('progress')
        .where('certifications', '!=', null)
        .get()
        .then(function(snapshot) {
          var found = null;
          snapshot.forEach(function(doc) {
            if (found) return;
            var data = doc.data();
            var certs = data.certifications || [];
            for (var i = 0; i < certs.length; i++) {
              if (certs[i].id === certId) {
                found = certs[i];
                break;
              }
            }
          });
          resolve(found);
        })
        .catch(function(err) {
          console.warn('[IDW3] Recherche Firestore échouée:', err.message);
          resolve(null);
        });
    });
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
    try { localStorage.removeItem(KEY); } catch(e) {}
    _cache = _fresh();
    if (_fbReady && _fbUser && _fbDb) {
      _fbDb.collection('progress').doc(_fbUser.uid).delete().catch(function(){});
    }
    return true;
  }

  /* ── AUTHENTIFICATION FIREBASE (Google) ─────────────────── */

  function isFirebaseReady() { return _fbReady; }
  function getCurrentUser()  { return _fbUser; }
  function isLoggedIn()      { return !!_fbUser; }

  function onAuthChange(callback) {
    if (typeof callback === 'function') {
      _authListeners.push(callback);
      // notifier immédiatement l'état courant
      try { callback(_fbUser); } catch(e) {}
    }
  }

  function _notifyAuthListeners() {
    _authListeners.forEach(function(cb) {
      try { cb(_fbUser); } catch(e) {}
    });
  }

  function loginWithGoogle() {
    if (!_fbReady || !_fbAuth) {
      return Promise.reject(new Error('Firebase non configuré. Voir firebase-config.js'));
    }
    var provider = new firebase.auth.GoogleAuthProvider();
    return _fbAuth.signInWithPopup(provider);
  }

  function logout() {
    if (!_fbReady || !_fbAuth) return Promise.resolve();
    return _fbAuth.signOut();
  }

  // Écoute en temps réel les changements sur le document Firestore
  // de l'utilisateur connecté, pour rester synchronisé cross-device
  // (si l'utilisateur progresse sur un autre appareil pendant qu'il
  // a cette page ouverte ici).
  function _subscribeRemote(uid) {
    if (_remoteUnsub) { _remoteUnsub(); _remoteUnsub = null; }
    if (!_fbDb) return;
    _remoteUnsub = _fbDb.collection('progress').doc(uid)
      .onSnapshot(function(doc) {
        if (doc.exists) {
          var remote = doc.data();
          // Ne pas re-déclencher une écriture Firestore ici (boucle) :
          // on met juste à jour le cache + localStorage.
          _cache = remote;
          _saveLocal(remote);
        }
      }, function(err) {
        console.warn('[IDW3] Écoute Firestore interrompue:', err.message);
      });
  }

  function _initFirebase() {
    if (typeof firebase === 'undefined') {
      console.info('[IDW3] SDK Firebase non chargé — mode localStorage uniquement.');
      return;
    }
    if (typeof FIREBASE_CONFIG === 'undefined') {
      console.info('[IDW3] firebase-config.js non chargé — mode localStorage uniquement.');
      return;
    }
    if (!FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey.indexOf('REMPLACER') === 0) {
      console.info('[IDW3] Firebase non configuré (valeurs par défaut) — mode localStorage uniquement.');
      return;
    }
    try {
      if (!firebase.apps || !firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      _fbAuth  = firebase.auth();
      _fbDb    = firebase.firestore();
      _fbReady = true;

      _fbAuth.onAuthStateChanged(function(user) {
        _fbUser = user || null;

        if (user) {
          // Utilisateur vient de se connecter : fusionner local + cloud
          var localData = _loadLocal();
          _fbDb.collection('progress').doc(user.uid).get().then(function(doc) {
            var remoteData = doc.exists ? doc.data() : null;
            var merged = _mergeProgress(localData, remoteData);
            _cache = merged;
            _saveLocal(merged);
            _fbDb.collection('progress').doc(user.uid).set(merged, { merge: false })
              .then(function() {
                _subscribeRemote(user.uid);
                _showToastSimple('✅ Connecté — progression synchronisée');
                _notifyAuthListeners();
              })
              .catch(function(err) {
                console.warn('[IDW3] Fusion initiale échouée:', err.message);
                _notifyAuthListeners();
              });
          }).catch(function(err) {
            console.warn('[IDW3] Lecture Firestore échouée:', err.message);
            _notifyAuthListeners();
          });
        } else {
          // Déconnexion : revenir au localStorage pur
          if (_remoteUnsub) { _remoteUnsub(); _remoteUnsub = null; }
          _cache = _loadLocal();
          _notifyAuthListeners();
        }
      });
    } catch (e) {
      console.warn('[IDW3] Initialisation Firebase échouée:', e.message);
      _fbReady = false;
    }
  }

  /* ── AUTO-INIT ───────────────────────────────────────────── */
  (function() {
    try {
      var page = (window.location.pathname.split('/').pop() || 'index.html');
      setLastPage(page);
      trackSession();
    } catch(e) {}
    _initFirebase();
  })();

  /* ── EXPORT ──────────────────────────────────────────────── */
  return {
    MODULES: MODULES,
    BADGES: BADGES,
    getProgress: getProgress,
    markComplete: markComplete,
    markIncomplete: markIncomplete,
    saveQuizScore: saveQuizScore,
    setUserName: setUserName,
    setLastPage: setLastPage,
    saveCertification: saveCertification,
    verifyCertification: verifyCertification,
    verifyCertificationRemote: verifyCertificationRemote,
    getGlobalPercent: getGlobalPercent,
    getSectionPercent: getSectionPercent,
    getUnlockedBadges: getUnlockedBadges,
    resetAll: resetAll,
    // Auth
    isFirebaseReady: isFirebaseReady,
    getCurrentUser: getCurrentUser,
    isLoggedIn: isLoggedIn,
    onAuthChange: onAuthChange,
    loginWithGoogle: loginWithGoogle,
    logout: logout,
    // Compat dashboard existant
    load: _load,
    save: _saveLocal
  };

})();
