# Expérience PVT - Musique & Habitudes

Expérience psychologique étudiant l'effet de la musique sur la vigilance psychomotrice selon les habitudes musicales.

## 🚀 Lancement rapide

### Option 1 : Serveur Python (recommandé)

```bash
# Ouvrir un terminal dans ce dossier, puis :
python3 -m http.server 8000

# Ouvrir navigateur :
# http://localhost:8000/index.html
```

### Option 2 : Serveur Node.js

```bash
# Si vous avez Node.js installé :
npx http-server -p 8000

# Ouvrir navigateur :
# http://localhost:8000/index.html
```

### Option 3 : Double-clic (peut ne pas fonctionner)

Ouvrir directement `index.html` dans le navigateur → ⚠️ La musique peut ne pas fonctionner (CORS)

## 📋 Protocole expérimental

**Participants :** 2 groupes (habitués/non-habitués à la musique pendant le travail)

**Conditions :**
- **C1** : Musique → Silence (contrebalancement)
- **C2** : Silence → Musique (contrebalancement)

**Tâches :**
1. Questionnaire initial (âge, genre, habitudes, fatigue, stress)
2. **Bloc 1** : Catégorisation + PVT (avec/sans musique selon condition)
3. **Bloc 2** : Catégorisation + PVT (avec/sans musique selon condition)

**Durée totale :** ~10 minutes

## 📊 Données collectées

Les données sont téléchargées automatiquement à la fin de l'expérience :
- Format : CSV
- Nom : `pvt_musique_habitudes-XXXX.csv`

Variables principales :
- Données démographiques et habitudes
- Groupe expérimental (1-4)
- Condition audio (musique/silence par bloc)
- Temps de réaction PVT (48 essais × 2)
- Précision catégorisation

## ⚠️ Problèmes connus

**1. Bug critique identifié** → Voir `AUDIT_RECOMMANDATIONS.md` section "Bugs critiques"

**2. Seulement 2 images** de catégorisation → Peut-être insuffisant pour une tâche de distraction

**3. Données manquantes** → Pas de marqueur de bloc/audio dans chaque essai

## 📁 Structure du projet

```
.
├── index.html              # Page principale
├── script.js               # Logique expérience (1283 lignes)
├── style.css               # Styles (vide)
├── lib/                    # Librairies lab.js
│   ├── lab.js
│   └── lab.css
├── static/                 # Médias
│   ├── musique.mp3         # Fichier audio
│   ├── lampe.jpeg          # Image intérieur
│   └── voiture.jpg         # Image extérieur
├── README.md               # Ce fichier
└── AUDIT_RECOMMANDATIONS.md # Rapport complet
```

## 🔍 Audit complet

Pour un rapport détaillé de l'analyse du code, voir :
**`AUDIT_RECOMMANDATIONS.md`**

Contenu :
- Structure complète de l'expérience
- Bugs identifiés et corrections
- Recommandations d'amélioration
- Guide de déploiement Pavlovia
- Checklist avant collecte de données

## 🛠️ Modifications recommandées

Avant de lancer l'expérience en production :

1. ✅ Corriger le bug ligne 723 (Arreter_Musique_Bloc2)
2. ✅ Ajouter marqueurs de bloc dans les données
3. ✅ Ajouter plus d'images de catégorisation (min 10-15)
4. ✅ Vérifier l'ordre des tâches vs protocole

## 📖 Documentation

- **Lab.js :** https://labjs.readthedocs.io/
- **Pavlovia :** https://pavlovia.org/docs/
- **Forum lab.js :** https://github.com/FelixHenninger/lab.js/discussions

## 🧪 Test pilote

Avant la collecte de données :
1. Tester les 4 conditions (habitué/non-habitué × C1/C2)
2. Vérifier les données exportées
3. Chronométrer la durée réelle
4. Vérifier le volume audio (casque recommandé)

---

**Dernière mise à jour :** 2025-11-11
