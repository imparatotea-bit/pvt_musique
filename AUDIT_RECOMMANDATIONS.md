# 🔍 AUDIT COMPLET - Expérience PVT_Musique_Habitudes

**Date :** 2025-11-11
**Fichier analysé :** script.js (1283 lignes)
**Statut :** ✅ Fonctionnel avec corrections recommandées

---

## 📊 RÉSUMÉ EXÉCUTIF

Votre expérience est **globalement bien structurée** et utilise correctement lab.js. Cependant, j'ai identifié **1 bug critique** et plusieurs **améliorations recommandées** pour mieux correspondre à votre protocole.

**Points positifs :**
- ✅ Assignation automatique aux groupes fonctionnelle
- ✅ Gestion dynamique de la musique entre blocs
- ✅ PVT bien implémenté (détection anticipations/lapses)
- ✅ Données enregistrées correctement

**Points à corriger :**
- 🔴 Bug logique dans Arreter_Musique_Bloc2 (ligne 723)
- 🟡 Ordre des tâches à vérifier vs protocole
- 🟡 Données manquantes (marqueurs de bloc, contexte audio)

---

## 🏗️ STRUCTURE ACTUELLE DE L'EXPÉRIENCE

### Séquence complète

```
1. Demarrer_Musique_Questionnaire
   └─ Lance musique.mp3 en boucle
   └─ Stockée dans window.musiqueExperience

2. Questionnaire_initial
   └─ Collecte : âge, genre, habitudes (0-10), fatigue, stress
   └─ Assignation automatique (4 groupes)

3. Instructions_generales

4. ⚙️ Arreter_Musique_Bloc1 (conditionnel)
   └─ SKIP si musique_bloc1 = true
   └─ EXÉCUTÉ si musique_bloc1 = false → Arrête musique

5. Categorisation 1 (BLOC 1)
   └─ 2 images : lampe (F), voiture (J)
   └─ Timeout : 10s par essai

6. PVT_Complete 1 (BLOC 1)
   └─ 48 essais
   └─ ISI aléatoire : 2-10 secondes
   └─ Timeout : 8 secondes
   └─ Mesure RT, détection anticipations (<100ms) et lapses (>500ms)

7. 🐛 Arreter_Musique_Bloc2 (BUG DÉTECTÉ)

8. ⚙️ Demarrer_Musique_Bloc2 (conditionnel)
   └─ SKIP si musique_bloc2 = false OU musique déjà active
   └─ EXÉCUTÉ si musique_bloc2 = true → Redémarre musique

9. Categorisation 2 (BLOC 2)
   └─ Identique à Catégorisation 1

10. PVT_Complete 2 (BLOC 2)
    └─ 48 essais (identique)

11. Arreter_Musique_Finale
    └─ Arrête toute musique

12. Merci (écran final)
```

### Assignation des groupes

| Groupe | Habitude | Condition | musique_bloc1 | musique_bloc2 | Description |
|--------|----------|-----------|---------------|---------------|-------------|
| **1** | Habitué | Musique→Silence | `true` | `false` | Bloc 1 en musique, Bloc 2 en silence |
| **2** | Habitué | Silence→Musique | `false` | `true` | Bloc 1 en silence, Bloc 2 en musique |
| **3** | Non-habitué | Musique→Silence | `true` | `false` | Bloc 1 en musique, Bloc 2 en silence |
| **4** | Non-habitué | Silence→Musique | `false` | `true` | Bloc 1 en silence, Bloc 2 en musique |

**Seuil habitude :** score >= 5 → "habitué"
**Randomisation :** 50/50 pour chaque groupe d'habitude

---

## 🔴 BUGS CRITIQUES

### Bug #1 : Logique inversée dans Arreter_Musique_Bloc2

**Localisation :** script.js, lignes 716-726

**Code actuel :**
```javascript
"before:prepare": function anonymous() {
  const datastore = this.options.datastore;
  const questData = datastore.data.find(d => d.sender === 'Questionnaire_initial');
  const musiqueBloc1 = questData?.musique_bloc1;

  if (!musiqueBloc1) {  // ❌ BUG ICI
    this.skip = true;
    console.log("✓ Skip Arreter_Musique_Bloc1");
  }
}
```

**Problème :**
- Si `musique_bloc1 = false` (Bloc 1 en silence), on SKIP l'arrêt de musique
- Mais il n'y a **aucune musique à arrêter** car bloc 1 était en silence !
- Inversement, si `musique_bloc1 = true`, on EXÉCUTE l'arrêt, mais la musique doit **continuer** pour le bloc 2

**Correction :**
```javascript
if (musiqueBloc1) {  // ✅ CORRECTION
  this.skip = true;
  console.log("✓ Skip Arreter_Musique_Bloc2 (musique continue du Bloc 1)");
}
// Sinon : musique_bloc1 = false, donc musique a déjà été arrêtée
```

**Logique correcte :**
- `musique_bloc1 = true` → Musique déjà active → SKIP l'arrêt (on continue)
- `musique_bloc1 = false` → Musique déjà arrêtée → SKIP aussi (rien à faire)
- En fait, **ce composant ne devrait jamais s'exécuter** avec la logique actuelle !

**Recommandation :** Supprimer complètement ce composant ou le remplacer par une simple transition.

---

## 🟡 VÉRIFICATION PROTOCOLE EXPÉRIMENTAL

### Votre spécification

```
C1 = Q + M – D + S – T + S – D + M – T + M
C2 = Q + M – D + M – T + M – D + S – T + S
```

Où :
- **Q** = Questionnaire
- **M** = Musique
- **S** = Silence
- **D** = Distraction (Catégorisation)
- **T** = Tâche (PVT)

### Implémentation actuelle

**Condition 1 (Musique→Silence) :**
```
Q + M → [musique continue] → D(M) + T(M) → [arrêt musique] → D(S) + T(S)
```

**Condition 2 (Silence→Musique) :**
```
Q + M → [arrêt musique] → D(S) + T(S) → [redémarrage musique] → D(M) + T(M)
```

### ⚠️ ATTENTION : Différence détectée

Votre notation suggère :
```
C1 = Q+M – D+S – T+S – D+M – T+M
     (4 tâches : D silence, T silence, D musique, T musique)
```

Mais implémentation :
```
C1 = Q+M – [D+T musique] – [D+T silence]
     (2 blocs de 2 tâches)
```

**Question :** Voulez-vous **4 tâches séparées** (D, T, D, T) ou **2 blocs** (D+T, D+T) ?

**Implémentation actuelle = 2 blocs** → Catégorisation et PVT dans la même condition audio

---

## 📦 MODULARISATION DU SCRIPT

### Verdict : NON RECOMMANDÉ pour Pavlovia

**Raisons :**

1. **Lab.js exporte tout dans script.js**
   - L'export de lab.js génère un fichier monolithique
   - Découper après coup casse cette structure

2. **Pavlovia attend cette structure**
   - Upload des fichiers via GitLab
   - Tous les scripts doivent être référencés dans index.html
   - Risque de fichiers manquants

3. **Taille du fichier (1283 lignes) est acceptable**
   - Lab.js gère bien ce volume
   - Pas de problème de performance

### Alternative : Améliorer la lisibilité

Au lieu de diviser en fichiers, utiliser des **commentaires structurés** :

```javascript
// ========================================
// SECTION 1 : CONFIGURATION
// ========================================

// ========================================
// SECTION 2 : QUESTIONNAIRE & ASSIGNATION
// ========================================

// ========================================
// SECTION 3 : BLOC 1 (CATÉGORISATION + PVT)
// ========================================
```

Cela permet de naviguer facilement sans compromettre la compatibilité.

---

## 🔧 RECOMMANDATIONS D'AMÉLIORATION

### 1. Ajouter des marqueurs de bloc et contexte audio

**Problème actuel :** Les données ne contiennent pas l'information du bloc ni du contexte audio.

**Solution :** Ajouter dans chaque tâche (Catégorisation, PVT) :

```javascript
messageHandlers: {
  "before:prepare": function() {
    // Récupérer les données du questionnaire
    const datastore = this.options.datastore;
    const questData = datastore.data.find(d => d.sender === 'Questionnaire_initial');

    // Déterminer le contexte audio
    // Pour Bloc 1 : utiliser musique_bloc1
    // Pour Bloc 2 : utiliser musique_bloc2

    this.data.bloc_number = 1; // ou 2
    this.data.audio_condition = questData.musique_bloc1 ? "musique" : "silence";
    this.data.groupe_experimental = questData.groupe_experimental;
    this.data.participant_id = questData.participant_id;
  }
}
```

**Avantages :**
- Facilite l'analyse statistique
- Permet de vérifier que l'assignation a fonctionné
- Traçabilité complète

### 2. Améliorer le feedback PVT

**Actuellement :** Pas de feedback visuel après chaque essai

**Suggestion :** Ajouter un écran de feedback optionnel :
- RT affiché si réponse valide
- "Trop rapide !" si anticipation
- "Pas de réponse" si timeout

### 3. Ajouter des images de catégorisation

**Actuellement :** Seulement 2 images (lampe, voiture)

**Suggestion :** Ajouter au minimum 10-15 images par catégorie pour :
- Réduire les effets d'apprentissage
- Augmenter la validité de la tâche de distraction

### 4. Vérifier la durée totale

**Estimation actuelle :**
- Questionnaire : ~2 min
- Catégorisation 1 : 2 images × 10s = 20s (trop court !)
- PVT 1 : 48 essais × ~5s moyen = ~4 min
- Catégorisation 2 : 20s
- PVT 2 : ~4 min
- **Total : ~10-11 minutes**

**Note :** La catégorisation est très courte (2 images seulement). Est-ce intentionnel ?

---

## 🚀 GUIDE DE LANCEMENT LOCAL

### Prérequis
- Python 3 installé
- Navigateur web moderne (Chrome, Firefox, Safari)

### Étapes

1. **Ouvrir un terminal** dans le dossier du projet

2. **Lancer le serveur HTTP local :**
   ```bash
   python3 -m http.server 8000
   ```

3. **Ouvrir le navigateur** et aller à :
   ```
   http://localhost:8000/index.html
   ```

4. **Tester l'expérience :**
   - Vérifier que la musique se lance
   - Tester les deux conditions (changer le slider d'habitude)
   - Vérifier les logs console (F12 → Console)

5. **Télécharger les données :**
   - À la fin, un fichier CSV est téléchargé automatiquement
   - Nom : `pvt_musique_habitudes-XXXX.csv`

### Débogage

**Si la musique ne se lance pas :**
- Vérifier que `static/musique.mp3` existe
- Vérifier la console (F12) pour les erreurs
- Tester dans un autre navigateur
- Vérifier les permissions audio du navigateur

**Si les images ne s'affichent pas :**
- Vérifier que `static/lampe.jpeg` et `static/voiture.jpg` existent
- Vérifier la console pour erreurs 404

---

## ✅ CHECKLIST AVANT DÉPLOIEMENT PAVLOVIA

### Corrections obligatoires
- [ ] Corriger le bug Arreter_Musique_Bloc2 (ligne 723)
- [ ] Ajouter marqueurs de bloc dans les données
- [ ] Ajouter contexte audio dans les données

### Améliorations recommandées
- [ ] Augmenter le nombre d'images de catégorisation (min 10 par catégorie)
- [ ] Vérifier l'ordre des tâches vs protocole (4 tâches ou 2 blocs ?)
- [ ] Ajouter feedback PVT (optionnel)
- [ ] Tester sur plusieurs navigateurs

### Tests Pavlovia
- [ ] Upload sur GitLab Pavlovia
- [ ] Vérifier que tous les fichiers sont uploadés (static/, lib/, script.js)
- [ ] Tester le mode pilote
- [ ] Vérifier le téléchargement des données

---

## 📁 STRUCTURE DES FICHIERS

```
pvt_musique/
├── index.html           # Page principale
├── script.js            # Logique expérience (1283 lignes)
├── style.css            # Styles personnalisés (vide actuellement)
├── lib/                 # Librairies lab.js (NE PAS MODIFIER)
│   ├── lab.js
│   ├── lab.css
│   ├── lab.fallback.js
│   └── ...
└── static/              # Fichiers médias
    ├── musique.mp3      # 2.5 MB
    ├── lampe.jpeg       # 17 KB
    └── voiture.jpg      # 515 KB
```

---

## 🎯 COMPATIBILITÉ LAB.JS & PAVLOVIA

### ✅ Compatible
- Structure actuelle (1 fichier script.js)
- Format des données (CSV automatique)
- Gestion des fichiers statiques
- Plugins utilisés (Metadata, Download)

### ⚠️ Points d'attention
- **Autoplay audio** : Peut être bloqué par certains navigateurs
  - Solution actuelle : Bouton "Démarrer" (✅ bon choix)
- **Taille du fichier audio** : 2.5 MB → Vérifier temps de chargement
- **Format MP3** : Compatible tous navigateurs (✅)

### ❌ Non recommandé
- Division en modules JavaScript (risque de perte de fichiers)
- Utilisation de librairies externes non incluses dans lib/

---

## 📊 VARIABLES ENREGISTRÉES

### Questionnaire (sender: "Questionnaire_initial")
- `age`, `genre`, `fatigue`, `stress`
- `habitude_musique_slider` (0-10)
- **Variables générées :**
  - `participant_id` (unique)
  - `timestamp_participation`
  - `habitude_musique_score`
  - `est_habitue` (boolean)
  - `groupe_habitude` ("habitue" / "non_habitue")
  - `groupe_experimental` (1, 2, 3, 4)
  - `condition_ordre` ("musique_puis_silence" / "silence_puis_musique")
  - `musique_bloc1`, `musique_bloc2` (boolean)

### Catégorisation (sender: "Affichage_Image")
- `image_shown` (chemin du fichier)
- `object_name` (Lampe, Voiture)
- `correct_response` (f/j)
- `response` (f/j)
- `correct` (0/1)
- `accuracy` ("correct" / "incorrect" / "no_response")
- `rt` (temps de réaction en ms)
- `duration` (durée totale)

### PVT (sender: "Compteur", "Fixation_ISI")
- `trial_number` (1-48)
- `isi` (délai avant stimulus, 2000-10000 ms)
- `rt` (temps de réaction)
- `response_type` ("normal" / "anticipation" / "lapse" / "no_response")
- `anticipation` (boolean, si réponse pendant ISI)

### ⚠️ Variables manquantes (à ajouter)
- `bloc_number` (1 ou 2)
- `audio_condition` ("musique" ou "silence")

---

## 🔮 PROCHAINES ÉTAPES SUGGÉRÉES

1. **Corriger le bug critique** (Arreter_Musique_Bloc2)
2. **Ajouter les marqueurs de données** (bloc, audio)
3. **Clarifier le protocole** (4 tâches ou 2 blocs ?)
4. **Augmenter images catégorisation** (si besoin)
5. **Test pilote complet** (3-5 participants)
6. **Upload sur Pavlovia** et test en ligne
7. **Validation finale** avant collecte de données

---

## 📞 SUPPORT

**Documentation lab.js :** https://labjs.readthedocs.io/
**Forum lab.js :** https://github.com/FelixHenninger/lab.js/discussions
**Pavlovia :** https://pavlovia.org/docs/

---

**Fin du rapport d'audit**
