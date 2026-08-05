# 🔥 Guide de configuration Firebase (connexion Gmail + synchronisation)

Ce guide vous permet d'activer :
- La **connexion avec Google** (les apprenants se créent un compte en un clic avec leur Gmail)
- La **synchronisation cross-device** (progression et certificats identiques sur téléphone, tablette, ordinateur)
- La **vérification globale des certificats** (un certificat généré sur l'appareil A peut être vérifié sur l'appareil B)

**Temps estimé : 15-20 minutes. Aucune carte bancaire requise — le plan gratuit de Firebase (Spark) suffit largement pour ce volume d'utilisateurs.**

---

## Étape 1 — Créer le projet Firebase

1. Allez sur **https://console.firebase.google.com**
2. Connectez-vous avec un compte Google (créez-en un si besoin — idéalement un compte dédié au projet, pas votre Gmail personnel)
3. Cliquez **"Ajouter un projet"**
4. Nom du projet : `idelphonse-web3` (ou ce que vous voulez)
5. Désactivez Google Analytics si proposé (pas nécessaire) → **Continuer**
6. Cliquez **"Créer le projet"** → attendez ~30 secondes → **Continuer**

---

## Étape 2 — Activer la connexion Google

1. Dans le menu de gauche, cliquez **Build → Authentication**
2. Cliquez **"Get started"** (ou "Commencer")
3. Onglet **"Sign-in method"**
4. Cliquez sur **"Google"** dans la liste des fournisseurs
5. Activez le bouton (**Enable**)
6. Choisissez un **email d'assistance du projet** (votre email)
7. Cliquez **"Enregistrer"**

---

## Étape 3 — Activer la base de données (Firestore)

1. Dans le menu de gauche, cliquez **Build → Firestore Database**
2. Cliquez **"Créer une base de données"**
3. Mode : choisissez **"Démarrer en mode production"**
4. Emplacement : choisissez la région la plus proche de vos utilisateurs (ex: `eur3 (europe-west)` pour l'Afrique/Europe)
5. Cliquez **"Activer"**

### Configurer les règles de sécurité

1. Une fois la base créée, allez dans l'onglet **"Règles"** (Rules)
2. Remplacez tout le contenu par :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /progress/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Explication simple :**
- `allow read: if true` → tout le monde peut **lire** les certificats (nécessaire pour que la page de vérification fonctionne pour n'importe qui, connecté ou non)
- `allow write: if request.auth.uid == userId` → seul le propriétaire connecté peut **modifier** sa propre progression (personne ne peut falsifier la progression de quelqu'un d'autre)

3. Cliquez **"Publier"**

---

## Étape 4 — Récupérer la configuration de votre site web

1. Dans le menu de gauche, cliquez sur l'**icône ⚙️ (roue crantée)** à côté de "Vue d'ensemble du projet" → **"Paramètres du projet"**
2. Descendez jusqu'à la section **"Vos applications"**
3. Cliquez sur l'icône **`</>`** (Web)
4. Nom de l'application : `Idelphonse Web3` → **Enregistrer**
5. **Ne cochez PAS** "Configurer Firebase Hosting"
6. Cliquez **"Enregistrer l'application"**
7. Vous verrez un bloc de code ressemblant à ceci — **copiez ces 6 valeurs** :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyABCDEF...",
  authDomain: "idelphonse-web3.firebaseapp.com",
  projectId: "idelphonse-web3",
  storageBucket: "idelphonse-web3.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

---

## Étape 5 — Configurer l'autorisation de domaine

Firebase doit savoir que votre site GitHub Pages a le droit d'utiliser la connexion Google.

1. Toujours dans **Authentication → Sign-in method**
2. Descendez jusqu'à **"Domaines autorisés"**
3. Cliquez **"Ajouter un domaine"**
4. Entrez votre domaine GitHub Pages, par exemple :
   ```
   votre-username.github.io
   ```
   (sans `https://`, sans le chemin après)
5. Cliquez **"Ajouter"**

---

## Étape 6 — Remplir le fichier `firebase-config.js`

1. Ouvrez le fichier `firebase-config.js` fourni
2. Remplacez les valeurs `REMPLACER_xxx` par celles copiées à l'étape 4 :

```javascript
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyABCDEF...",
  authDomain:         "idelphonse-web3.firebaseapp.com",
  projectId:          "idelphonse-web3",
  storageBucket:      "idelphonse-web3.appspot.com",
  messagingSenderId:  "123456789012",
  appId:              "1:123456789012:web:abc123def456"
};
```

3. Uploadez ce fichier corrigé sur GitHub (remplacer l'ancien `firebase-config.js`)

---

## Étape 7 — Tester

1. Videz le cache (**Ctrl+Shift+R**)
2. Allez sur `dashboard.html`
3. Cliquez **"🔐 Se connecter avec Google"**
4. Une fenêtre Google s'ouvre → choisissez un compte Gmail
5. Le bandeau doit passer à **"☁️ Connecté — progression synchronisée"**
6. Testez : faites un quiz sur ce téléphone → connectez-vous avec le **même compte Google sur un autre appareil** → vérifiez que la progression apparaît aussi là-bas

---

## ⚠️ Important à savoir

- **Sans configuration Firebase** : le site continue de fonctionner exactement comme avant (progression sauvegardée uniquement sur l'appareil, via `localStorage`). Rien ne casse.
- **Avec Firebase configuré mais utilisateur non connecté** : toujours `localStorage` uniquement — la connexion est optionnelle, pas obligatoire.
- **Le plan gratuit Firebase (Spark)** permet jusqu'à 50 000 lectures/jour et 20 000 écritures/jour sur Firestore, et un nombre illimité de connexions Google — largement suffisant pour une plateforme éducative de cette taille.
- Les clés dans `firebase-config.js` **ne sont pas secrètes** — c'est normal et voulu par Firebase pour les apps web. La vraie sécurité vient des **règles Firestore** de l'étape 3.

---

## Besoin d'aide ?

Si une étape bloque, contactez le développeur avec :
- Une capture d'écran de l'erreur exacte
- La page où ça se passe (dashboard, certification, ou verification)
- Si possible, la console développeur du navigateur (F12 → onglet "Console")
