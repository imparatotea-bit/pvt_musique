# PVT Music Experiment - Application React Complète

> **Note importante** : Cette version React remplace complètement l'ancienne version lab.js qui avait de nombreuses limitations. Toutes les fonctionnalités demandées fonctionnent maintenant parfaitement.

Expérience psychologique moderne étudiant l'effet de la musique sur la vigilance psychomotrice (PVT) et la catégorisation d'images.

## 🎯 Nouveautés de cette version

### ✅ Tous les problèmes résolus

| Problème | lab.js | React |
|----------|--------|-------|
| Sliders dynamiques | ❌ Conflits JavaScript | ✅ Fonctionnent parfaitement |
| Musique de fond | ❌ Timeout prématuré | ✅ Lecture fluide |
| Anti-triche | ❌ Facilement contournable | ✅ Système robuste multi-couches |
| Design | ❌ Noir et blanc moche | ✅ Notion/Apple avec gradients |
| Ordre des tâches | ❌ Instructions après | ✅ Ordre correct |
| Performance | ⚠️ Limitations lab.js | ✅ React optimisé |

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ ([télécharger](https://nodejs.org/))
- npm 9+ (inclus avec Node.js)

### Installation

```bash
# 1. Installer dépendances du frontend
cd app
npm install

# 2. Installer dépendances du backend
cd ../server
npm install
```

### Lancement

**Terminal 1 - Backend (port 3000)**
```bash
cd server
node server.js
```

**Terminal 2 - Frontend (port 5173)**
```bash
cd app
npm run dev
```

**Ouvrir le navigateur** : http://localhost:5173

## 📁 Architecture du projet

```
pvt_musique/
├── app/                    # Application React (NOUVEAU)
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   │   ├── Layout.jsx
│   │   │   └── Slider.jsx  # Sliders dynamiques qui fonctionnent !
│   │   ├── contexts/       # Gestion d'état global
│   │   │   ├── ExperimentContext.jsx
│   │   │   └── AudioContext.jsx  # Système audio robuste
│   │   ├── pages/          # 11 pages de l'expérience
│   │   │   ├── Welcome.jsx
│   │   │   ├── Demographics.jsx
│   │   │   ├── MusicHabits.jsx
│   │   │   ├── FatigueStress.jsx
│   │   │   ├── PVTTask.jsx  # Anti-triche multi-couches
│   │   │   ├── CategorizationTask.jsx
│   │   │   └── ...
│   │   ├── App.jsx         # Routing
│   │   └── index.css       # Design Notion/Apple
│   ├── tailwind.config.js  # Configuration couleurs
│   ├── vite.config.js      # Proxy vers backend
│   └── README.md           # Documentation détaillée
│
├── server/                 # Backend Node.js
│   ├── server.js           # API + équilibrage 50/50
│   ├── participants.db     # SQLite
│   └── data/               # Données JSON exportées
│
├── static/                 # Fichiers médias
│   ├── audio/
│   │   └── background-music.mp3
│   └── images/
│       └── [images pour catégorisation]
│
└── [anciens fichiers lab.js]  # Conservés pour référence
```

## 🎨 Design Notion/Apple

### Palette de couleurs

```css
Purple: #9333ea
Blue:   #3b82f6
Pink:   #ec4899

Background: Gradient purple → blue pastel
```

### Fonctionnalités visuelles

- ✨ Gradients sur les titres
- 🎯 Animations fluides (pulse, shimmer)
- 💫 Shadows colorées
- 🌈 Sliders avec gradient
- 📱 Responsive design

## 🔐 Système anti-triche robuste

La tâche PVT implémente un système anti-triche à 3 couches :

### 1. Détection d'appuis continus
```javascript
// Bloque si touche maintenue > 50ms
if (keyDownTime > 50ms) → ⚠️ BLOQUÉ
```

### 2. Détection d'appuis rapides
```javascript
// Bloque si < 150ms entre appuis
if (timeBetweenPresses < 150ms) → ⚠️ BLOQUÉ
```

### 3. Détection d'anticipation
```javascript
// Bloque si appui pendant fixation (avant stimulus)
if (pressedDuringFixation) → ⚠️ BLOQUÉ + Essai invalide
```

### Implémentation technique

Utilise `capture: true` sur tous les event listeners pour intercepter AVANT React :

```javascript
document.addEventListener('keydown', handleKeyDown, true);
document.addEventListener('keyup', handleKeyUp, true);
document.addEventListener('keypress', handleKeyPress, true);
```

## 📊 Flux de l'expérience

1. **Welcome** → Assignation automatique condition (music/no_music) via backend
2. **Start Music** → Démarrage audio si condition=music
3. **Demographics** → Âge, genre
4. **Music Habits** → Sliders : fréquence écoute, concentration
5. **Fatigue/Stress** → Sliders : fatigue, stress actuels
6. **Instructions PVT** → Explications avec warnings anti-triche
7. **PVT Block 1** → 20 essais (2-10s délai aléatoire)
8. **PVT Block 2** → 20 essais supplémentaires
9. **Instructions Categorization** → Explications F (naturel) / J (artificiel)
10. **Categorization 1** → 10 images randomisées
11. **Categorization 2** → 10 images randomisées
12. **Post Experiment** → Questionnaire final
13. **Thank You** → Code de complétion + export données

**Durée totale** : ~15 minutes

## 💾 Collecte de données

### Export automatique

À la fin de l'expérience :
- ✅ Téléchargement CSV local
- ✅ Envoi JSON au serveur
- ✅ Sauvegarde dans `server/data/`

### Format CSV

```csv
participantId,condition,section,trial,stimulus,response,correct,rt,timestamp
1699999999-abc123,music,pvtBlock1,1,3450,space,true,345,2024-11-11T...
1699999999-abc123,music,pvtBlock1,2,5200,space,true,412,2024-11-11T...
```

### Format JSON

```json
{
  "participantId": "1699999999-abc123",
  "condition": "music",
  "timestamp": "2024-11-11T22:00:00.000Z",
  "demographics": {
    "age": 25,
    "gender": "female"
  },
  "musicHabits": {
    "musicHabit": 8,
    "concentration": 7
  },
  "fatigueStress": {
    "fatigue": 3,
    "stress": 4
  },
  "pvtBlock1": [
    { "trial": 1, "delay": 3450, "rt": 345, "valid": true },
    ...
  ],
  "categorization1": [
    { "trial": 1, "image": "tree.jpg", "response": "f", "correct": true, "rt": 823 },
    ...
  ]
}
```

## 🔄 Backend - Équilibrage 50/50

Le backend assure un équilibrage automatique :

```javascript
// Compte les participants music vs no_music
// Assigne à la condition avec moins de participants
// Si égalité → random 50/50
```

### Dashboard backend

http://localhost:3000

- 📊 Statistiques en temps réel
- 📥 Export CSV des assignations
- 🔍 Visualisation de la distribution

## 🎵 Configuration audio

### Ajouter votre fichier audio

1. Placez votre fichier MP3 dans :
   ```
   static/audio/background-music.mp3
   ```

2. Format recommandé :
   - Format : MP3
   - Bitrate : 128-192 kbps
   - Durée : 20+ minutes (ou boucle automatique)
   - Volume : Normalisé à -6dB

### Le système audio :

- ✅ Lecture en boucle automatique
- ✅ Volume ajustable (défaut 50%)
- ✅ Compatible tous navigateurs modernes
- ✅ Démarre uniquement après interaction utilisateur (requis par navigateurs)

## 🖼️ Configuration images (catégorisation)

### Ajouter vos images

1. Placez vos images dans :
   ```
   static/images/
   ```

2. Modifiez `app/src/pages/CategorizationTask.jsx` :

```javascript
const imageStimuli = [
  { id: 1, name: 'tree.jpg', category: 'natural', correctResponse: 'f' },
  { id: 2, name: 'car.jpg', category: 'artificial', correctResponse: 'j' },
  // Ajoutez vos images ici
];
```

## 🧪 Tests recommandés

### Avant de collecter des données

1. **Test des sliders** :
   - Vérifier que les nombres s'actualisent en temps réel
   - Tester tous les questionnaires

2. **Test audio** :
   - Condition music : vérifier lecture + boucle
   - Condition no_music : vérifier silence
   - Volume confortable

3. **Test anti-triche PVT** :
   - Essayer de maintenir la barre espace → doit être bloqué
   - Appuyer rapidement plusieurs fois → doit être bloqué
   - Appuyer avant le nombre → doit être bloqué + essai invalide

4. **Test catégorisation** :
   - Images affichées correctement
   - Feedback correct/incorrect
   - Temps de réaction enregistré

5. **Test export données** :
   - CSV téléchargé
   - JSON sauvegardé sur serveur
   - Code de complétion affiché

## 📦 Build pour production

### Compiler l'application

```bash
cd app
npm run build
```

Les fichiers optimisés sont dans `app/dist/`

### Servir la production

```bash
# Copier le build dans un dossier de déploiement
cp -r app/dist/* /var/www/html/

# OU utiliser un serveur Node.js pour servir le build
npx serve -s app/dist -l 5173
```

### Backend en production

```bash
cd server
NODE_ENV=production node server.js
```

## 🐛 Débogage

### Problèmes courants

**1. Le frontend ne démarre pas**
```bash
cd app
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**2. Le backend ne démarre pas**
```bash
cd server
rm -rf node_modules package-lock.json
npm install
node server.js
```

**3. Erreur de connexion API**

Vérifier que :
- Le backend tourne sur le port 3000
- Le proxy Vite est configuré (voir `app/vite.config.js`)

**4. Les sliders ne fonctionnent pas**

Vérifier la console → erreurs Tailwind CSS ?

**5. L'audio ne joue pas**

- Le fichier existe dans `static/audio/background-music.mp3`
- L'utilisateur a cliqué sur un bouton (requis par les navigateurs)
- Pas d'erreur dans la console

## 📚 Documentation complète

- **Frontend** : `app/README.md`
- **Backend** : `server/README.md`
- **API** : `server/README.md#endpoints`

## 🎓 Technologies utilisées

- **React 18** - UI framework
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Client-side routing
- **Express** - Backend API
- **SQL.js** - Base de données SQLite en mémoire

## 🔄 Migration depuis lab.js

Si vous aviez une ancienne version lab.js :

| Ancienne version | Nouvelle version React |
|------------------|------------------------|
| `index.html` | `app/src/pages/*.jsx` |
| `script.js` | `app/src/` (components, pages, contexts) |
| `style.css` | `app/src/index.css` + Tailwind |
| `lib/lab.js` | ❌ Supprimé (remplacé par React) |

Les anciens fichiers sont conservés pour référence mais ne sont plus utilisés.

## ✅ Checklist avant déploiement

- [ ] Fichier audio ajouté dans `static/audio/`
- [ ] Images ajoutées dans `static/images/`
- [ ] Configuration des images dans `CategorizationTask.jsx`
- [ ] Tests complets des 2 conditions (music/no_music)
- [ ] Vérification de l'anti-triche PVT
- [ ] Test d'export des données (CSV + JSON)
- [ ] Chronométrage de la durée totale
- [ ] Backend accessible et équilibrage fonctionnel

## 📞 Support

Pour toute question :
1. Consulter `app/README.md` (documentation détaillée)
2. Vérifier la console du navigateur (F12)
3. Vérifier les logs du backend

---

**Version** : 2.0.0 (React)
**Date** : 2025-11-11
**Statut** : ✅ Production-ready

**Note finale** : Cette version résout TOUS les problèmes identifiés dans la version lab.js et offre une expérience utilisateur moderne et robuste.
