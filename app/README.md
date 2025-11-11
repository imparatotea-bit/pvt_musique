# PVT Music Experiment - React Application

Application React moderne pour une expérience de Psychomotor Vigilance Task (PVT) avec musique de fond.

## 🚀 Technologies

- **React 18** - Interface utilisateur
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Styling avec design Notion/Apple
- **React Router** - Navigation
- **Node.js + Express** - Backend API

## 📁 Structure du projet

```
app/
├── src/
│   ├── components/       # Composants réutilisables
│   │   ├── Layout.jsx
│   │   └── Slider.jsx
│   ├── contexts/         # Contextes React (état global)
│   │   ├── ExperimentContext.jsx
│   │   └── AudioContext.jsx
│   ├── pages/            # Pages de l'expérience
│   │   ├── Welcome.jsx
│   │   ├── StartMusic.jsx
│   │   ├── Demographics.jsx
│   │   ├── MusicHabits.jsx
│   │   ├── FatigueStress.jsx
│   │   ├── InstructionsPVT.jsx
│   │   ├── PVTTask.jsx
│   │   ├── InstructionsCategorization.jsx
│   │   ├── CategorizationTask.jsx
│   │   ├── PostExperiment.jsx
│   │   └── ThankYou.jsx
│   ├── App.jsx           # Composant racine + routing
│   ├── main.jsx          # Point d'entrée
│   └── index.css         # Styles globaux Tailwind
└── public/               # Fichiers statiques
```

## 🎯 Fonctionnalités

### ✅ Sliders dynamiques qui FONCTIONNENT
- Mise à jour en temps réel
- Affichage de la valeur en grand
- Animations fluides

### ✅ Système audio robuste
- Musique de fond en boucle
- Contrôle du volume
- Condition music vs no_music

### ✅ Anti-triche multi-couches
- Détection des appuis continus (>50ms)
- Blocage des appuis trop rapides (<150ms)
- Détection des faux départs (anticipation)
- Event capture phase pour intercepter AVANT React

### ✅ Design Notion/Apple
- Gradients purple/blue/pink
- Animations fluides
- Shadows colorées
- Interface moderne et épurée

### ✅ Collecte de données complète
- Export CSV automatique
- Sauvegarde JSON sur serveur
- Tracking de tous les essais

## 🛠️ Installation

### Prérequis
- Node.js 18+
- npm 9+

### Installation des dépendances

```bash
# Dans le dossier app/
npm install

# Dans le dossier server/
cd ../server
npm install
```

## 🚀 Démarrage

### 1. Démarrer le backend (port 3000)

```bash
cd server
node server.js
```

Le backend sera accessible sur http://localhost:3000

### 2. Démarrer l'application React (port 5173)

```bash
cd app
npm run dev
```

L'application sera accessible sur http://localhost:5173

## 📊 Architecture de l'expérience

### Flux de l'expérience

1. **Welcome** → Assignation automatique condition (music/no_music)
2. **Start Music** → Démarrage audio si condition=music
3. **Demographics** → Âge, genre
4. **Music Habits** → Fréquence écoute, concentration (sliders)
5. **Fatigue/Stress** → État actuel (sliders)
6. **Instructions PVT** → Explications tâche vigilance
7. **PVT Block 1** → 20 essais avec anti-triche
8. **PVT Block 2** → 20 essais supplémentaires
9. **Instructions Categorization** → Explications tâche catégorisation
10. **Categorization 1** → 10 images naturel/artificiel
11. **Categorization 2** → 10 images supplémentaires
12. **Post Experiment** → Questionnaire final
13. **Thank You** → Code de complétion + export données

### Système anti-triche PVT

```javascript
// Triple interception des événements
document.addEventListener('keydown', handleKeyDown, true);  // Capture phase
document.addEventListener('keyup', handleKeyUp, true);
document.addEventListener('keypress', handleKeyPress, true);

// Bloque si :
- Touche maintenue > 50ms
- Appuis < 150ms d'intervalle
- Appui pendant fixation (anticipation)
```

## 🎨 Personnalisation du design

Les couleurs sont définies dans `tailwind.config.js` :

```javascript
colors: {
  notion: {
    purple: '#9333ea',
    blue: '#3b82f6',
    pink: '#ec4899',
  }
}
```

## 📦 Build pour production

```bash
npm run build
```

Les fichiers optimisés seront dans `dist/`

## 🔧 Configuration

### Vite proxy (vite.config.js)

Le proxy redirige les requêtes `/api/*` vers le backend :

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  }
}
```

## 📝 Ajout de fichiers audio/images

### Audio

Placez vos fichiers MP3 dans `/static/audio/` :

```
static/audio/background-music.mp3
```

### Images pour catégorisation

Placez vos images dans `/static/images/` et modifiez `CategorizationTask.jsx` :

```javascript
const imageStimuli = [
  { id: 1, name: 'tree.jpg', category: 'natural', correctResponse: 'f' },
  // ...
];
```

## 🐛 Débogage

### Console du navigateur

Tous les événements sont loggés :
- ✅ Appui valide
- ⚠️ Appui bloqué
- 📊 Temps de réaction

### React DevTools

Installer l'extension pour voir :
- État des contextes
- Props des composants
- Re-renders

## 🆘 Problèmes courants

### Le backend ne démarre pas

```bash
cd server
rm -rf node_modules package-lock.json
npm install
node server.js
```

### Les sliders ne fonctionnent pas

Vérifier que Tailwind est bien configuré :

```bash
npm run dev
# Ouvrir console → chercher erreurs CSS
```

### L'audio ne joue pas

L'audio nécessite une interaction utilisateur. Vérifier :
1. Le fichier audio existe dans `/static/audio/`
2. L'utilisateur a cliqué sur "Continuer"
3. Console → erreurs de chargement

## 📈 Données collectées

### Format CSV

```csv
participantId,condition,section,trial,stimulus,response,correct,rt,timestamp
123,music,pvtBlock1,1,3450,space,true,345,2024-...
```

### Format JSON

```json
{
  "participantId": "123",
  "condition": "music",
  "demographics": { "age": 25, "gender": "female" },
  "pvtBlock1": [
    { "trial": 1, "rt": 345, "valid": true }
  ]
}
```

## 🎓 Crédits

Application créée avec React + Vite + Tailwind CSS

Design inspiré de Notion et Apple

---

**Note** : Cette application remplace complètement l'ancienne version lab.js qui avait des limitations majeures.
