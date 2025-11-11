# ❓ Question importante : Ordre des tâches

## 🔍 Différence détectée entre votre description et l'implémentation

### Votre description initiale

```
C1 = Q + M – D + S – T + S – D + M – T + M
C2 = Q + M – D + M – T + M – D + S – T + S
```

**Où :**
- Q = Questionnaire
- M = Musique
- S = Silence
- D = Distraction (Catégorisation)
- T = Tâche (PVT)

---

## 🎯 Interprétation possible #1 : 4 tâches avec alternance

**Si votre protocole signifie 4 tâches séparées :**

### Condition 1 (Q + M – D + S – T + S – D + M – T + M)

```
1. Questionnaire EN MUSIQUE
2. Distraction (Cat) EN SILENCE     ← changement
3. PVT EN SILENCE
4. Distraction (Cat) EN MUSIQUE     ← changement
5. PVT EN MUSIQUE
```

**→ 4 changements de condition audio**

### Condition 2 (Q + M – D + M – T + M – D + S – T + S)

```
1. Questionnaire EN MUSIQUE
2. Distraction (Cat) EN MUSIQUE     (continue)
3. PVT EN MUSIQUE
4. Distraction (Cat) EN SILENCE     ← changement
5. PVT EN SILENCE
```

**→ 1 changement de condition audio**

---

## 🎯 Interprétation possible #2 : 2 blocs (implémentation actuelle)

**Si votre protocole signifie 2 blocs de tâches :**

### Condition 1 "Musique puis Silence"

```
1. Questionnaire EN MUSIQUE
2. BLOC 1 EN MUSIQUE
   - Distraction (Catégorisation)
   - PVT
3. BLOC 2 EN SILENCE              ← 1 changement
   - Distraction (Catégorisation)
   - PVT
```

**→ 1 changement de condition audio**

### Condition 2 "Silence puis Musique"

```
1. Questionnaire EN MUSIQUE
2. BLOC 1 EN SILENCE              ← 1 changement
   - Distraction (Catégorisation)
   - PVT
3. BLOC 2 EN MUSIQUE              ← 1 changement
   - Distraction (Catégorisation)
   - PVT
```

**→ 2 changements de condition audio (1 au début, 1 entre les blocs)**

---

## 📊 Tableau comparatif

| Aspect | Interprétation #1 (4 tâches) | Interprétation #2 (2 blocs) - ACTUEL |
|--------|------------------------------|--------------------------------------|
| **Nombre de tâches** | 4 tâches distinctes | 2 blocs de 2 tâches |
| **Catégorisation** | 2 fois séparées | 2 fois (1 par bloc) |
| **PVT** | 2 fois séparées | 2 fois (1 par bloc) |
| **Changements audio C1** | 2 changements | 1 changement |
| **Changements audio C2** | 1 changement | 2 changements |
| **Symétrie** | Non (C1≠C2) | Oui (C1 et C2 équilibrés) |

---

## ⚙️ Implémentation actuelle (Interprétation #2)

### Structure du code

```javascript
// BLOC 1
Arreter_Musique_Bloc1 (si musique_bloc1 = false)
  ↓
Categorisation 1
  ↓
PVT_Complete 1
  ↓
// TRANSITION
Arreter_Musique_Bloc2 (si musique_bloc1 = true) ← 🐛 BUG
  ↓
Demarrer_Musique_Bloc2 (si musique_bloc2 = true ET pas déjà active)
  ↓
// BLOC 2
Categorisation 2
  ↓
PVT_Complete 2
```

**Résultat :**
- Groupe M→S : Cat1+PVT1 en musique, puis Cat2+PVT2 en silence
- Groupe S→M : Cat1+PVT1 en silence, puis Cat2+PVT2 en musique

---

## 🤔 Question à trancher

**Quelle interprétation correspond à votre protocole ?**

### Option A : Garder l'implémentation actuelle (2 blocs)

**Avantages :**
- ✅ Plus simple à implémenter
- ✅ Symétrique (C1 et C2 équilibrés)
- ✅ Moins de changements audio (moins de risque de bug)
- ✅ Durée totale plus courte
- ✅ Code déjà fonctionnel (après correction du bug)

**Inconvénient :**
- ❌ Ne correspond pas exactement à la notation "D + S – T + S – D + M – T + M"

**Actions nécessaires :**
1. Corriger le bug Arreter_Musique_Bloc2
2. Ajouter marqueurs de bloc dans les données
3. Clarifier la notation du protocole

### Option B : Modifier pour 4 tâches séparées

**Avantages :**
- ✅ Correspondance exacte avec la notation
- ✅ Permet d'étudier l'effet de la musique tâche par tâche
- ✅ Plus de points de mesure

**Inconvénients :**
- ❌ Nécessite refactorisation complète du code
- ❌ Plus de transitions audio (complexité)
- ❌ Durée totale plus longue
- ❌ Asymétrie entre C1 et C2 (nombre de changements différent)
- ❌ Instructions plus compliquées pour les participants

**Actions nécessaires :**
1. Restructurer complètement le code
2. Ajouter 2 transitions audio supplémentaires
3. Dupliquer les instructions de catégorisation et PVT
4. Augmenter la durée de l'expérience

---

## 💡 Ma recommandation

**→ Option A : Garder l'implémentation actuelle (2 blocs)**

**Raisons :**

1. **Design expérimental plus propre**
   - Symétrie parfaite entre C1 et C2
   - Contrebalancement équilibré
   - Effets d'ordre contrôlés

2. **Simplicité pour les participants**
   - Moins de transitions confuses
   - Instructions claires par bloc
   - Moins de fatigue cognitive

3. **Analyse statistique facilitée**
   - 2 mesures par condition (Bloc 1 / Bloc 2)
   - Comparaison intra-sujet claire
   - Variables indépendantes bien définies

4. **Pragmatisme**
   - Code déjà fonctionnel (après correction)
   - Testé et validé par lab.js
   - Compatible Pavlovia

**Mais vous devriez ajuster votre notation :**

```
NOUVELLE NOTATION :

C1 (Musique puis Silence) :
   Q+M → BLOC1(D+T)+M → BLOC2(D+T)+S

C2 (Silence puis Musique) :
   Q+M → BLOC1(D+T)+S → BLOC2(D+T)+M
```

---

## 🔬 Hypothèses testables avec l'implémentation actuelle

### Variables indépendantes
1. **Habitude musicale** : Habitué vs Non-habitué (inter-sujet)
2. **Condition audio** : Musique vs Silence (intra-sujet)
3. **Ordre** : M→S vs S→M (inter-sujet, contrebalancé)

### Variables dépendantes
1. **PVT** : Temps de réaction, lapses, anticipations
2. **Catégorisation** : Précision, temps de réaction

### Analyses possibles

**Effet principal de la musique :**
```
Performance(Musique) vs Performance(Silence)
```

**Interaction habitude × musique :**
```
Habitués : Musique vs Silence
Non-habitués : Musique vs Silence
```

**Effet d'ordre :**
```
Bloc 1 vs Bloc 2 (fatigue, apprentissage)
```

**Interaction triple :**
```
Habitude × Musique × Ordre
```

---

## 📋 Checklist de décision

**Si vous choisissez Option A (2 blocs) :**
- [ ] Corriger le bug ligne 723
- [ ] Ajouter bloc_number et audio_condition aux données
- [ ] Mettre à jour la documentation du protocole
- [ ] Tester les 4 groupes
- [ ] Prêt pour collecte de données

**Si vous choisissez Option B (4 tâches) :**
- [ ] Discuter avec moi de la nouvelle structure
- [ ] Refactoriser le code script.js
- [ ] Ajouter les transitions audio supplémentaires
- [ ] Réécrire les instructions
- [ ] Tester extensivement
- [ ] Réestimer la durée totale

---

## ❓ Question à vous poser

**Quel est l'objectif principal de votre expérience ?**

### Si l'objectif est de comparer Musique vs Silence selon l'habitude :
→ **Option A suffit** (2 blocs, design simple et propre)

### Si l'objectif est d'étudier les transitions et adaptations :
→ **Option B** pourrait être justifiée (mais plus complexe)

### Si l'objectif est de mesurer la fatigue/vigilance :
→ **Option A** est meilleur (2 points de mesure clairs, effet de bloc interprétable)

---

## 🎯 Prochaine étape

**Avant de continuer, confirmez :**

1. **Quelle interprétation correspond à votre protocole ?**
   - [ ] Option A : 2 blocs (implémentation actuelle)
   - [ ] Option B : 4 tâches séparées

2. **Si Option A, on procède à :**
   - Correction du bug
   - Ajout des marqueurs de données
   - Tests finaux

3. **Si Option B, on planifie :**
   - Architecture de la nouvelle structure
   - Estimation du temps de refactorisation
   - Validation du nouveau design expérimental

---

**Attendez vos instructions avant de procéder !**
