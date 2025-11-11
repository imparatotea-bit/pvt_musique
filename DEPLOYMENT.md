# 🚀 Guide de déploiement complet

## 📋 Vue d'ensemble

Ton expérience utilise maintenant un **backend Node.js** qui équilibre automatiquement les participants entre les 4 groupes pour garantir une distribution 50/50 stricte.

**Architecture :**
```
Participants → Expérience (Pavlovia) → Backend (Railway/Render) → SQLite DB
```

---

## 🧪 ÉTAPE 1 : Tester en LOCAL

### 1.1 Installer les dépendances backend

```bash
cd server
npm install
```

### 1.2 Lancer le backend

```bash
npm start
```

Tu verras :
```
🚀 Serveur backend PVT démarré sur le port 3000
📊 Statistiques: http://localhost:3000/
🔌 API: http://localhost:3000/api/assign
```

### 1.3 Ouvrir le dashboard backend

Dans ton navigateur : `http://localhost:3000`

Tu verras :
- Total participants : 0
- Distribution : 0/0/0/0

### 1.4 Lancer l'expérience

**Dans un NOUVEAU terminal** :

```bash
# Retour à la racine
cd ..

# Lancer l'expérience
npm start
```

Navigateur s'ouvre sur `http://localhost:8000`

### 1.5 Tester l'assignation

1. Fais l'expérience (slider habitude à 7 par exemple)
2. Regarde la **console** (F12) : tu verras `✅ Assignation reçue du backend`
3. Retourne sur `http://localhost:3000` → Les compteurs ont augmenté !
4. Refais plusieurs fois avec différents scores d'habitude
5. Vérifie que la distribution reste équilibrée

---

## 🌐 ÉTAPE 2 : Déployer le BACKEND

Je recommande **Railway** (le plus simple).

### Option A : Railway (Recommandé)

#### 2.1 Créer un compte

- Va sur https://railway.app
- "Start a New Project" → "Deploy from GitHub repo"
- Connecte ton compte GitHub
- Autorise Railway

#### 2.2 Sélectionner ton repo

- Cherche `pvt_musique`
- Clique dessus
- Railway va scanner le repo

#### 2.3 Configurer le service

- **Root Directory** : `server`
- **Start Command** : `npm start`
- **Build Command** : `npm install`

Railway détecte automatiquement Node.js !

#### 2.4 Déployer

- Clique "Deploy"
- Attends 1-2 minutes
- Railway te donne une URL : `https://ton-projet-production.up.railway.app`

#### 2.5 Copier l'URL

Copie cette URL (tu en auras besoin à l'étape 3)

**Coût :** Gratuit pour 500h/mois ($5/mois après, mais très largement suffisant)

---

### Option B : Render (Alternative gratuite)

1. Va sur https://render.com
2. "New Web Service"
3. Connecte GitHub → Sélectionne `pvt_musique`
4. **Root Directory** : `server`
5. **Build Command** : `npm install`
6. **Start Command** : `npm start`
7. **Free tier** (attention : se met en veille après 15min d'inactivité)
8. Déploie
9. Copie l'URL fournie

**Note :** Avec le plan gratuit, le serveur "s'endort" après 15min d'inactivité. Le 1er participant réveille le serveur (30s de délai). Pas idéal mais fonctionnel.

---

## 🎨 ÉTAPE 3 : Configurer l'expérience avec l'URL du backend

### 3.1 Modifier index.html

Dans `index.html`, ligne 14, **remplace** :

```javascript
window.BACKEND_URL = 'http://localhost:3000';
```

Par ton URL Railway/Render :

```javascript
window.BACKEND_URL = 'https://ton-projet-production.up.railway.app';
```

### 3.2 Committer et pusher

```bash
git add index.html
git commit -m "Configuration URL backend production"
git push
```

---

## 🎯 ÉTAPE 4 : Déployer l'EXPÉRIENCE sur Pavlovia

### 4.1 Créer un projet Pavlovia

1. Va sur https://pavlovia.org
2. Crée un compte (gratuit)
3. "Create Experiment" → Nom : `pvt_musique_habitudes`

### 4.2 Obtenir l'URL GitLab

Pavlovia te donne une URL GitLab :
```
https://gitlab.pavlovia.org/ton-username/pvt_musique_habitudes.git
```

### 4.3 Pousser vers Pavlovia

```bash
# Ajouter le remote Pavlovia
git remote add pavlovia https://gitlab.pavlovia.org/ton-username/pvt_musique_habitudes.git

# Pousser (sur la branche main)
git push pavlovia claude/export-experiment-work-011CV2guQzYoNHLAicD4nSoK:main
```

### 4.4 Activer l'expérience

1. Sur Pavlovia : Va dans ton projet
2. Clique "Set status to RUNNING"
3. Copie le lien public : `https://run.pavlovia.org/ton-username/pvt_musique_habitudes`

### 4.5 Configurer CORS sur Railway

Pour que Pavlovia puisse appeler ton backend :

1. Va sur Railway → Ton service backend
2. "Variables" → Ajoute :
   - `PAVLOVIA_URL` = `https://pavlovia.org`

Ou modifie `server/server.js` ligne 11 :

```javascript
app.use(cors({
  origin: ['http://localhost:8000', 'https://pavlovia.org', 'https://run.pavlovia.org']
}));
```

Puis redéploie sur Railway (git push automatique).

---

## ✅ ÉTAPE 5 : TESTER la version en ligne

### 5.1 Ouvrir le lien Pavlovia

`https://run.pavlovia.org/ton-username/pvt_musique_habitudes`

### 5.2 Vérifier dans la console

Ouvre F12 → Console, tu devrais voir :

```
📡 Appel au backend pour assignation...
✅ Assignation reçue du backend: {groupe_experimental: 1, ...}
```

Si tu vois `❌ Erreur connexion au backend` → Problème CORS ou URL incorrecte.

### 5.3 Vérifier le dashboard backend

Va sur ton URL Railway : `https://ton-projet.up.railway.app`

Tu devrais voir le participant ajouté !

---

## 📊 ÉTAPE 6 : Suivre la collecte

### Dashboard backend

`https://ton-projet.up.railway.app`

Tu verras en temps réel :
- Total participants
- Distribution : habitue_C1, habitue_C2, non_habitue_C1, non_habitue_C2
- Bouton "Exporter CSV"

### Exporter les assignations

Clique sur "📥 Exporter les assignations (CSV)"

Tu obtiens un fichier avec :
- ID participant
- Groupe habitude
- Groupe expérimental
- Condition ordre
- Date/heure
- Statut (terminé ou pas)

### Logs Railway

Railway → Ton service → "Logs"

Tu verras chaque assignation :
```
✅ Assignation: Participant P... → Groupe 1 (musique_puis_silence)
📊 Compteurs actuels pour habitue: C1=5, C2=4
```

---

## 🔧 Dépannage

### Erreur CORS

**Symptôme :** Console dit "blocked by CORS policy"

**Solution :** Vérifie que `server.js` autorise `pavlovia.org` dans CORS (ligne 11)

### Backend indisponible

**Symptôme :** Console dit "Erreur connexion au backend"

**Solution :**
1. Vérifie que l'URL dans `index.html` est correcte
2. Vérifie que le backend Railway est bien démarré
3. Si problème persiste, l'expérience continue en mode fallback (aléatoire)

### Render se met en veille

**Symptôme :** Premier participant attend 30 secondes

**Solution :** Passe au plan payant ($7/mois) ou utilise Railway

### Distribution déséquilibrée

**Symptôme :** 15 habitués en C1, 5 en C2

**Solution :** Le backend équilibre automatiquement. Si tu as déjà collecté, le déséquilibre est normal. Pour les prochains participants, l'équilibrage se fera automatiquement.

---

## 📈 Workflow final

```
1. Participant clique sur le lien Pavlovia
2. Expérience démarre
3. Questionnaire → Appel backend → Assignation équilibrée
4. Participant fait l'expérience (Bloc 1 + Bloc 2)
5. Données téléchargées localement (CSV via lab.js)
6. Backend garde une trace de l'assignation

À la fin de la collecte :
- Tu as les CSVs des participants (via Pavlovia)
- Tu as le CSV des assignations (via backend)
- Tu peux fusionner les deux avec l'ID participant
```

---

## 🎯 Checklist finale

- [ ] Backend déployé sur Railway/Render
- [ ] URL backend ajoutée dans `index.html`
- [ ] Expérience déployée sur Pavlovia
- [ ] CORS configuré pour Pavlovia
- [ ] Testé avec 2-3 participants pilotes
- [ ] Dashboard backend accessible
- [ ] Distribution équilibrée vérifiée

---

## 💰 Coûts estimés

| Service | Plan | Coût |
|---------|------|------|
| Railway Backend | Hobby | $5/mois (500h gratuit = largement suffisant) |
| Render Backend | Free | $0 (avec veille) |
| Pavlovia | Standard | 20 crédits gratuits, puis ~$20 pour 1000 participants |

**Estimation pour 100 participants :** Gratuit (Railway hobby) + 20 crédits Pavlovia = $0

---

Besoin d'aide ? Dis-moi où tu bloques !
