# 📚 Index de la documentation

Cette documentation a été générée le **2025-11-11** suite à un audit complet de votre expérience PVT_Musique_Habitudes.

---

## 🚀 Par où commencer ?

### Si vous voulez lancer l'expérience maintenant :
→ **[README.md](README.md)** - Guide de démarrage rapide (3 min)

### Si vous voulez comprendre le code :
→ **[AUDIT_RECOMMANDATIONS.md](AUDIT_RECOMMANDATIONS.md)** - Rapport complet (15 min)

### Si vous avez une question sur le protocole :
→ **[QUESTION_PROTOCOLE.md](QUESTION_PROTOCOLE.md)** - Clarification du design expérimental (10 min)

### Si vous voulez visualiser le flux :
→ **[SCHEMA_EXPERIENCE.md](SCHEMA_EXPERIENCE.md)** - Diagrammes et schémas (10 min)

### Si vous voulez tester l'expérience :
→ **[GUIDE_TEST.md](GUIDE_TEST.md)** - Procédure de test complète (20 min)

---

## 📄 Descriptions détaillées

### 📖 README.md
**Contenu :** Guide de démarrage rapide
**À lire si :** Vous voulez lancer l'expérience localement
**Durée de lecture :** 3 minutes
**Sections principales :**
- Lancement serveur local (3 options)
- Protocole expérimental résumé
- Structure des fichiers
- Problèmes counus
- Modifications recommandées

---

### 🔍 AUDIT_RECOMMANDATIONS.md
**Contenu :** Rapport d'audit complet du code
**À lire si :** Vous voulez comprendre en détail comment fonctionne votre expérience
**Durée de lecture :** 15 minutes
**Sections principales :**

1. **Résumé exécutif**
   - Points positifs et négatifs
   - Vue d'ensemble

2. **Structure actuelle**
   - Séquence complète étape par étape
   - Assignation des 4 groupes

3. **Bugs critiques**
   - 🔴 Bug ligne 723 (Arreter_Musique_Bloc2)
   - Explications et corrections

4. **Vérification protocole**
   - Comparaison spécification vs implémentation
   - Questions à clarifier

5. **Modularisation**
   - Verdict : NON recommandé
   - Raisons techniques

6. **Recommandations d'amélioration**
   - Marqueurs de bloc
   - Feedback PVT
   - Images de catégorisation
   - Durée totale

7. **Guide lancement local**

8. **Checklist avant déploiement Pavlovia**

9. **Compatibilité lab.js & Pavlovia**

10. **Variables enregistrées**

---

### ❓ QUESTION_PROTOCOLE.md
**Contenu :** Clarification sur l'ordre des tâches
**À lire si :** Vous avez un doute sur l'implémentation vs votre protocole
**Durée de lecture :** 10 minutes
**Sections principales :**

1. **Différence détectée**
   - Votre notation : `C1 = Q + M – D + S – T + S – D + M – T + M`
   - Implémentation actuelle

2. **Deux interprétations possibles**
   - Interprétation #1 : 4 tâches séparées
   - Interprétation #2 : 2 blocs (actuel)

3. **Tableau comparatif**

4. **Options A vs B**
   - Avantages/inconvénients
   - Actions nécessaires

5. **Ma recommandation**
   - Option A (2 blocs) avec justifications

6. **Hypothèses testables**
   - Variables indépendantes
   - Variables dépendantes
   - Analyses possibles

7. **Checklist de décision**

**⚠️ IMPORTANT :** Lisez ce document avant de continuer le développement !

---

### 🗺️ SCHEMA_EXPERIENCE.md
**Contenu :** Schémas visuels de l'expérience
**À lire si :** Vous préférez les représentations visuelles
**Durée de lecture :** 10 minutes
**Sections principales :**

1. **Vue d'ensemble** (arbre de décision 4 groupes)

2. **Flux détaillé par groupe**
   - Groupe 1 : Habitué + M→S (diagramme complet)
   - Groupe 2 : Habitué + S→M
   - Groupe 3 : Non-habitué + M→S
   - Groupe 4 : Non-habitué + S→M

3. **Tableau récapitulatif**

4. **Comparaison protocole vs implémentation**

5. **Timeline typique** (estimation durée)

6. **Gestion audio**
   - Variable globale `window.musiqueExperience`
   - Transitions audio

7. **Problèmes identifiés** (avec schémas)

8. **Variables de données** (par essai)

9. **Recommandations avec code**

---

### 🧪 GUIDE_TEST.md
**Contenu :** Procédure complète de test
**À lire si :** Vous êtes prêt à tester l'expérience
**Durée de lecture :** 20 minutes
**Sections principales :**

1. **Préparation**
   - Lancement serveur
   - Ouverture console développeur

2. **Tests par groupe** (4 sections)
   - Groupe 1, 2, 3, 4
   - Configuration attendue
   - Déroulement pas à pas
   - Checklist de vérification

3. **Vérification des données**
   - Format CSV
   - Colonnes essentielles
   - Cohérence des variables

4. **Tests spécifiques PVT**
   - Anticipation
   - Lapse
   - Timeout

5. **Problèmes courants et solutions**
   - Musique ne lance pas
   - Images manquantes
   - CSV non téléchargé

6. **Tests navigateurs**
   - Chrome/Edge
   - Firefox
   - Safari

7. **Tests mobile/tablette** (optionnel)

8. **Checklist finale avant Pavlovia**

9. **Journal de test** (template)

---

### 🚀 START_SERVER.sh
**Contenu :** Script de lancement automatique du serveur
**À lire si :** Vous voulez un lancement en 1 clic
**Usage :**
```bash
./START_SERVER.sh
```
Puis ouvrir : `http://localhost:8000/index.html`

---

## 🎯 Parcours recommandés

### Parcours 1 : "Je veux juste tester rapidement"
1. ✅ [README.md](README.md) → Section "Lancement rapide"
2. ✅ Lancer `./START_SERVER.sh`
3. ✅ Ouvrir navigateur
4. ✅ Tester une fois

**Temps total :** 10 minutes

---

### Parcours 2 : "Je veux comprendre mon code"
1. ✅ [AUDIT_RECOMMANDATIONS.md](AUDIT_RECOMMANDATIONS.md) → Tout lire
2. ✅ [SCHEMA_EXPERIENCE.md](SCHEMA_EXPERIENCE.md) → Visualiser le flux
3. ✅ [QUESTION_PROTOCOLE.md](QUESTION_PROTOCOLE.md) → Clarifier le design
4. ✅ Décider : Option A ou B

**Temps total :** 40 minutes

---

### Parcours 3 : "Je veux tester sérieusement avant collecte"
1. ✅ [README.md](README.md) → Lancement
2. ✅ [GUIDE_TEST.md](GUIDE_TEST.md) → Suivre toute la procédure
3. ✅ Tester les 4 groupes
4. ✅ Vérifier les données CSV
5. ✅ [AUDIT_RECOMMANDATIONS.md](AUDIT_RECOMMANDATIONS.md) → Checklist Pavlovia

**Temps total :** 2-3 heures

---

### Parcours 4 : "Je vais corriger les bugs et déployer"
1. ✅ [AUDIT_RECOMMANDATIONS.md](AUDIT_RECOMMANDATIONS.md) → Section "Bugs critiques"
2. ✅ Corriger le bug ligne 723
3. ✅ [AUDIT_RECOMMANDATIONS.md](AUDIT_RECOMMANDATIONS.md) → Section "Recommandations"
4. ✅ Ajouter marqueurs bloc et audio
5. ✅ [GUIDE_TEST.md](GUIDE_TEST.md) → Tester tout
6. ✅ [AUDIT_RECOMMANDATIONS.md](AUDIT_RECOMMANDATIONS.md) → Checklist Pavlovia
7. ✅ Upload sur Pavlovia

**Temps total :** 4-6 heures

---

## 📊 Résumé des points clés

### ✅ Ce qui fonctionne bien
- Assignation automatique aux 4 groupes
- Gestion dynamique de la musique
- PVT correctement implémenté
- Détection anticipations/lapses
- Export CSV automatique

### 🔴 À corriger obligatoirement
- Bug ligne 723 (Arreter_Musique_Bloc2)
- Ajouter marqueurs de bloc dans données
- Ajouter contexte audio dans données

### 🟡 À améliorer (optionnel)
- Augmenter nombre d'images catégorisation (2 → 10-15)
- Ajouter feedback après chaque essai PVT
- Clarifier le protocole (2 blocs vs 4 tâches)

### ⚠️ Question importante à trancher
**Voulez-vous :**
- **Option A** : 2 blocs (implémentation actuelle) → Simple, équilibré
- **Option B** : 4 tâches séparées → Complexe, plus de transitions

→ Voir [QUESTION_PROTOCOLE.md](QUESTION_PROTOCOLE.md) pour décider

---

## 🔧 Modifications du code

### Si vous choisissez Option A (2 blocs) :

**Fichier à modifier :** `script.js`

**Modifications nécessaires :**
1. Ligne 723 : Corriger le bug Arreter_Musique_Bloc2
2. Lignes 333-395 : Ajouter marqueurs dans Catégorisation 1
3. Lignes 840-903 : Ajouter marqueurs dans Catégorisation 2
4. Lignes 622-672 : Ajouter marqueurs dans PVT 1
5. Lignes 1148-1198 : Ajouter marqueurs dans PVT 2

**Code à ajouter :** Voir [AUDIT_RECOMMANDATIONS.md](AUDIT_RECOMMANDATIONS.md) section "Recommandations"

---

## 📞 Support et ressources

### Documentation externe
- **Lab.js** : https://labjs.readthedocs.io/
- **Pavlovia** : https://pavlovia.org/docs/
- **Forum lab.js** : https://github.com/FelixHenninger/lab.js/discussions

### Documentation locale (ce projet)
- Tous les fichiers .md dans ce dossier
- Console logs dans le navigateur (F12)
- Commentaires dans script.js

---

## 🗂️ Structure des fichiers du projet

```
pvt_musique/
│
├── 📄 index.html                    # Page principale
├── 📄 script.js                     # Code expérience (1283 lignes)
├── 📄 style.css                     # Styles (vide)
│
├── 📁 lib/                          # Librairies lab.js (NE PAS MODIFIER)
│   ├── lab.js
│   ├── lab.css
│   ├── lab.fallback.js
│   └── ...
│
├── 📁 static/                       # Fichiers médias
│   ├── 🎵 musique.mp3               # Audio (2.5 MB)
│   ├── 🖼️ lampe.jpeg                # Image intérieur
│   └── 🖼️ voiture.jpg               # Image extérieur
│
├── 📚 DOCUMENTATION/
│   ├── 📖 README.md                 # Démarrage rapide
│   ├── 🔍 AUDIT_RECOMMANDATIONS.md  # Rapport complet
│   ├── ❓ QUESTION_PROTOCOLE.md     # Clarification design
│   ├── 🗺️ SCHEMA_EXPERIENCE.md      # Diagrammes
│   ├── 🧪 GUIDE_TEST.md             # Procédure test
│   └── 📚 INDEX_DOCUMENTATION.md    # Ce fichier
│
└── 🚀 START_SERVER.sh               # Script lancement serveur
```

---

## ✨ Prochaines étapes suggérées

1. **Maintenant** : Lire [QUESTION_PROTOCOLE.md](QUESTION_PROTOCOLE.md) et décider Option A ou B
2. **Ensuite** : Lire [AUDIT_RECOMMANDATIONS.md](AUDIT_RECOMMANDATIONS.md) section "Bugs critiques"
3. **Puis** : Corriger le bug ligne 723
4. **Après** : Suivre [GUIDE_TEST.md](GUIDE_TEST.md) pour tester
5. **Enfin** : Déployer sur Pavlovia

---

**Dernière mise à jour :** 2025-11-11
**Version de l'audit :** 1.0
**Analysé par :** Claude Code (Sonnet 4.5)
