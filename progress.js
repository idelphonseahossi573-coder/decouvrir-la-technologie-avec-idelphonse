/* ============================================================
   PROGRESS.JS — Système de progression complet
   LocalStorage key: "idw3_progress"
   ============================================================ */

const IDW3 = (() => {

  /* ── STRUCTURE DE DONNÉES ──────────────────────────────── */
  const MODULES = {
    debutant: {
      label: 'Parcours Débutant',
      icon: '🌱',
      color: '#059669',
      modules: [
        { id: 'db_internet',    label: "Internet & le Web" },
        { id: 'db_web123',      label: "Web1, Web2, Web3" },
        { id: 'db_blockchain',  label: "Introduction Blockchain" },
        { id: 'db_bitcoin',     label: "Bitcoin & Ethereum" },
        { id: 'db_crypto',      label: "Les Cryptomonnaies" },
        { id: 'db_wallet',      label: "Les Wallets" },
        { id: 'db_seed',        label: "Seed Phrase & Clés" },
        { id: 'db_securite',    label: "Sécurité Numérique" },
        { id: 'db_arnaques',    label: "Arnaques Courantes" },
        { id: 'db_pratique',    label: "Créer son premier wallet" },
        { id: 'db_quiz',        label: "Quiz Débutant" },
      ]
    },
    intermediaire: {
      label: 'Parcours Intermédiaire',
      icon: '📈',
      color: '#1e5fcc',
      modules: [
        { id: 'im_smartcontract', label: "Smart Contracts" },
        { id: 'im_dapps',         label: "DApps" },
        { id: 'im_cex',           label: "Exchanges Centralisés" },
        { id: 'im_dex',           label: "Exchanges Décentralisés" },
        { id: 'im_stablecoin',    label: "Stablecoins" },
        { id: 'im_staking',       label: "Staking" },
        { id: 'im_defi',          label: "DeFi" },
        { id: 'im_yield',         label: "Yield Farming" },
        { id: 'im_nft',           label: "NFT" },
        { id: 'im_dao',           label: "DAO" },
        { id: 'im_layer',         label: "Layer 1 & Layer 2" },
        { id: 'im_tokenomics',    label: "Tokenomics" },
        { id: 'im_quiz',          label: "Quiz Intermédiaire" },
      ]
    },
    avance: {
      label: 'Parcours Avancé',
      icon: '🚀',
      color: '#7b5ea7',
      modules: [
        { id: 'av_ecosystemes',  label: "Écosystèmes Blockchain" },
        { id: 'av_analyse',      label: "Analyser un projet" },
        { id: 'av_airdrops',     label: "Airdrops" },
        { id: 'av_testnets',     label: "Testnets" },
        { id: 'av_bugbounty',    label: "Bug Bounty" },
        { id: 'av_contenu',      label: "Création de contenu" },
        { id: 'av_marketing',    label: "Marketing Web3" },
        { id: 'av_community',    label: "Community Building" },
        { id: 'av_branding',     label: "Personal Branding" },
      ]
    },
    ambassadeur: {
      label: 'Parcours Ambassadeur',
      icon: '🌍',
      color: '#f0c040',
      modules: [
        { id: 'am_bases',       label: "Maîtriser les bases" },
        { id: 'am_presence',    label: "Présence en ligne" },
        { id: 'am_contenu',     label: "Créer du contenu" },
        { id: 'am_cv',          label: "CV Ambassadeur" },
        { id: 'am_interview',   label: "Réussir l'interview" },
        { id: 'am_evenements',  label: "Organiser des événements" },
        { id: 'am_missions',    label: "Premières missions" },
      ]
    }
  };

  /* ── BADGES ────────────────────────────────────────────── */
  const BADGES = [
    {
      id: 'explorer',
      label: 'Explorateur Blockchain',
      icon: '🔭',
      color: '#059669',
      desc: 'Vous avez terminé votre premier module',
      condition: (p) => Object.keys(p.completed).length >= 1
    },
    {
      id: 'wallet_expert',
      label: 'Expert Wallet',
      icon: '👛',
      color: '#1e5fcc',
      desc: 'Vous maîtrisez les wallets et la seed phrase',
      condition: (p) => p.completed['db_wallet'] && p.completed['db_seed']
    },
    {
      id: 'security_expert',
      label: 'Expert Sécurité',
      icon: '🛡️',
      color: '#dc2626',
      desc: 'Vous connaissez les arnaques et la sécurité',
      condition: (p) => p.completed['db_securite'] && p.completed['db_arnaques']
    },
    {
      id: 'debutant_complete',
      label: 'Diplômé Débutant',
      icon: '🌱',
      color: '#059669',
      desc: 'Parcours Débutant complété à 100%',
      condition: (p) => MODULES.debutant.modules.every(m => p.completed[m.id])
    },
    {
      id: 'defi_master',
      label: 'Maître DeFi',
      icon: '💰',
      color: '#f0c040',
      desc: 'Vous avez maîtrisé la finance décentralisée',
      condition: (p) => p.completed['im_defi'] && p.completed['im_staking'] && p.completed['im_yield']
    },
    {
      id: 'web3_analyst',
      label: 'Analyste Web3',
      icon: '🔍',
      color: '#7b5ea7',
      desc: 'Vous savez analyser un projet Web3',
      condition: (p) => p.completed['av_analyse'] && p.completed['im_tokenomics']
    },
    {
      id: 'intermediaire_complete',
      label: 'Diplômé Intermédiaire',
      icon: '📈',
      color: '#1e5fcc',
      desc: 'Parcours Intermédiaire complété à 100%',
      condition: (p) => MODULES.intermediaire.modules.every(m => p.completed[m.id])
    },
    {
      id: 'junior_ambassador',
      label: 'Ambassadeur Junior',
      icon: '🌍',
      color: '#ea580c',
      desc: 'Vous avez démarré le parcours Ambassadeur',
      condition: (p) => p.completed['am_bases'] && p.completed['am_presence']
    },
    {
      id: 'certified_ambassador',
      label: 'Ambassadeur Certifié',
      icon: '🏆',
      color: '#f0c040',
      desc: 'Certification Web3 obtenue avec succès',
      condition: (p) => p.certifications && p.certifications.length > 0
    },
    {
      id: 'quiz_master',
      label: 'Quiz Master',
      icon: '🧠',
      color: '#00d4ff',
      desc: 'Tous les quiz réussis avec 80%+',
      condition: (p) => {
        const scores = Object.values(p.quizScores || {});
        return scores.length >= 2 && scores.every(s => s >= 80);
      }
    }
  ];

  /* ── STORAGE ────────────────────────────────────────────── */
  const KEY = 'idw3_progress';

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return fresh();
      return JSON.parse(raw);
    } catch(e) { return fresh(); }
  }

  function fresh() {
    return {
      userName: '',
      completed: {},
      quizScores: {},
      badges: [],
      certifications: [],
      lastPage: '',
      totalTime: 0,
      startDate: new Date().toISOString(),
      sessions: 0
    };
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch(e) { console.warn('Storage full'); }
  }

  /* ── PUBLIC API ─────────────────────────────────────────── */
  function getProgress() { return load(); }

  function markComplete(moduleId) {
    const p = load();
    if (!p.completed[moduleId]) {
      p.completed[moduleId] = new Date().toISOString();
      checkBadges(p);
      save(p);
      emitUpdate(moduleId);
    }
  }

  function saveQuizScore(quizId, score, total) {
    const p = load();
    const pct = Math.round((score / total) * 100);
    const prev = p.quizScores[quizId] || 0;
    if (pct >= prev) p.quizScores[quizId] = pct;
    // Auto-complete the quiz module
    markComplete(quizId);
    checkBadges(p);
    save(p);
  }

  function setUserName(name) {
    const p = load();
    p.userName = name;
    save(p);
  }

  function setLastPage(page) {
    const p = load();
    p.lastPage = page;
    p.sessions = (p.sessions || 0) + 1;
    save(p);
  }

  function checkBadges(p) {
    BADGES.forEach(badge => {
      if (!p.badges.includes(badge.id) && badge.condition(p)) {
        p.badges.push(badge.id);
        showBadgeNotification(badge);
      }
    });
  }

  function showBadgeNotification(badge) {
    const el = document.createElement('div');
    el.className = 'badge-toast';
    el.innerHTML = `
      <span style="font-size:1.6rem;">${badge.icon}</span>
      <div>
        <div style="font-weight:700;font-size:.85rem;color:#fff;">Badge débloqué !</div>
        <div style="font-size:.8rem;color:rgba(255,255,255,.8);">${badge.label}</div>
      </div>`;
    el.style.cssText = `
      position:fixed;bottom:80px;left:24px;
      background:linear-gradient(135deg,#1e5fcc,#00d4ff);
      color:#fff;padding:14px 20px;border-radius:12px;
      display:flex;align-items:center;gap:12px;
      box-shadow:0 8px 32px rgba(0,0,0,.3);
      z-index:1200;transform:translateX(-120%);
      transition:transform .4s cubic-bezier(.34,1.56,.64,1);
      max-width:280px;`;
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.transform = 'translateX(0)'; });
    setTimeout(() => {
      el.style.transform = 'translateX(-120%)';
      setTimeout(() => el.remove(), 400);
    }, 3500);
  }

  function getGlobalPercent() {
    const p = load();
    let total = 0, done = 0;
    Object.values(MODULES).forEach(section => {
      total += section.modules.length;
      section.modules.forEach(m => { if (p.completed[m.id]) done++; });
    });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }

  function getSectionPercent(sectionKey) {
    const p = load();
    const section = MODULES[sectionKey];
    if (!section) return 0;
    const done = section.modules.filter(m => p.completed[m.id]).length;
    return Math.round((done / section.modules.length) * 100);
  }

  function getUnlockedBadges() {
    const p = load();
    return BADGES.filter(b => p.badges.includes(b.id));
  }

  function getAllBadges() { return BADGES; }
  function getModules() { return MODULES; }

  function saveCertification(cert) {
    const p = load();
    if (!p.certifications) p.certifications = [];
    p.certifications.push(cert);
    checkBadges(p);
    save(p);
  }

  function verifyCertification(certId) {
    // Scan all stored progress (only current user's local storage)
    const p = load();
    if (!p.certifications) return null;
    return p.certifications.find(c => c.id === certId) || null;
  }

  // Auto track last page
  if (typeof window !== 'undefined') {
    setLastPage(window.location.pathname.split('/').pop() || 'index.html');
  }

  return {
    getProgress, markComplete, saveQuizScore, setUserName, setLastPage,
    checkBadges: () => { const p = load(); checkBadges(p); save(p); },
    getGlobalPercent, getSectionPercent, getUnlockedBadges, getAllBadges,
    getModules, saveCertification, verifyCertification, load, save, fresh,
    MODULES, BADGES
  };
})();
