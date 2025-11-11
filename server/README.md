# 🎯 Backend PVT - Équilibrage automatique

Backend Node.js + SQLite pour équilibrer automatiquement les conditions expérimentales.

## ✨ Fonctionnalités

- **Équilibrage automatique** : Assigne automatiquement les participants pour maintenir un équilibre 50/50 dans chaque groupe
- **Persistance SQLite** : Base de données légère, pas besoin de MySQL/PostgreSQL
- **Statistiques en temps réel** : Dashboard web pour voir la distribution
- **Export CSV** : Télécharge toutes les assignations
- **API REST** : Endpoints simples pour l'intégration
- **Fallback** : Si le backend est indisponible, l'expérience continue en mode aléatoire

## 🚀 Installation locale

```bash
cd server
npm install
npm start
```

Le serveur démarre sur `http://localhost:3000`

## 📊 Dashboard

Ouvre `http://localhost:3000` pour voir :
- Nombre total de participants
- Distribution par groupe (habitué C1, habitué C2, etc.)
- Export CSV des assignations

## 🔌 Endpoints API

### POST /api/assign
Assigner une condition à un participant

**Request:**
```json
{
  "participant_id": "P1731354782456_3421",
  "habitude_score": 7
}
```

**Response:**
```json
{
  "groupe_experimental": 1,
  "condition_ordre": "musique_puis_silence",
  "musique_bloc1": true,
  "musique_bloc2": false,
  "groupe_habitude": "habitue",
  "already_assigned": false
}
```

### POST /api/complete
Marquer un participant comme ayant terminé

**Request:**
```json
{
  "participant_id": "P1731354782456_3421"
}
```

### GET /api/stats
Obtenir les statistiques de distribution

**Response:**
```json
{
  "total": 42,
  "completed": 38,
  "distribution": {
    "habitue_C1": 10,
    "habitue_C2": 11,
    "non_habitue_C1": 10,
    "non_habitue_C2": 11
  }
}
```

### GET /api/export
Télécharger le CSV de toutes les assignations

## 🌐 Déploiement

### Option 1 : Railway (Recommandé)

1. Créer un compte sur https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Connecter ton repo GitHub
4. Sélectionner le dossier `/server`
5. Railway détecte automatiquement Node.js
6. Déploie automatiquement !
7. Copie l'URL fournie (ex: `https://ton-backend.railway.app`)

**Coût :** Gratuit jusqu'à 500h/mois (largement suffisant)

### Option 2 : Render

1. Créer un compte sur https://render.com
2. "New Web Service"
3. Connecter GitHub
4. Root directory: `server`
5. Build command: `npm install`
6. Start command: `npm start`
7. Déploie !

**Coût :** Gratuit (avec spin-down après 15min d'inactivité)

### Option 3 : Fly.io

1. Installer flyctl: `curl -L https://fly.io/install.sh | sh`
2. `fly auth signup`
3. Dans le dossier `server`: `fly launch`
4. Suivre les instructions
5. `fly deploy`

**Coût :** Gratuit jusqu'à 3 apps

## ⚙️ Configuration

### Modifier l'URL du backend dans l'expérience

**Option A : Variable globale (index.html)**

Ajouter AVANT le `<script src="script.js">` :

```html
<script>
  window.BACKEND_URL = 'https://ton-backend.railway.app';
</script>
<script src="script.js"></script>
```

**Option B : Modifier script.js ligne 136**

```javascript
const BACKEND_URL = 'https://ton-backend.railway.app';
```

## 🔒 Sécurité

Pour la production, ajouter :

1. **Limiter les origines CORS** (dans server.js) :
```javascript
app.use(cors({
  origin: ['https://ton-domaine.com', 'https://pavlovia.org']
}));
```

2. **Rate limiting** :
```javascript
npm install express-rate-limit
```

3. **Variables d'environnement** :
```bash
# .env
PORT=3000
NODE_ENV=production
```

## 📈 Monitoring

Le backend log automatiquement :
- ✅ Chaque assignation
- 📊 Compteurs actuels
- ❌ Erreurs éventuelles

Consulter les logs :
- **Railway** : Dashboard → Logs
- **Render** : Dashboard → Logs
- **Fly.io** : `fly logs`

## 🧪 Tests

Tester localement :

```bash
# Terminal 1 : Backend
cd server
npm start

# Terminal 2 : Expérience
cd ..
npm start

# Ouvrir http://localhost:8000 et tester
```

Vérifier le dashboard backend sur `http://localhost:3000`

## 📦 Base de données

Le fichier `participants.db` contient toutes les assignations.

**Backup** :
```bash
cp participants.db participants.backup.db
```

**Reset** (attention, efface tout) :
```bash
rm participants.db
npm start  # Recrée la DB vide
```

## 🆘 Troubleshooting

**Erreur CORS** : Vérifier que le backend autorise l'origine de ton site

**Erreur 404** : Vérifier que l'URL du backend est correcte dans index.html

**Backend indisponible** : L'expérience continue en mode fallback (aléatoire local)

**Déséquilibre** : Consulter `/api/stats` pour voir la distribution actuelle
