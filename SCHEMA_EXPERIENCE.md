# 📊 Schéma de l'expérience PVT - Musique & Habitudes

## 🎯 Vue d'ensemble : 4 groupes expérimentaux

```
                    QUESTIONNAIRE INITIAL
                            |
                    Slider habitudes (0-10)
                            |
        ┌───────────────────┴───────────────────┐
        |                                       |
    Score < 5                               Score >= 5
  NON-HABITUÉ                              HABITUÉ
        |                                       |
   Random 50/50                            Random 50/50
        |                                       |
    ┌───┴───┐                              ┌───┴───┐
    |       |                              |       |
 Groupe 3   Groupe 4                    Groupe 1   Groupe 2
   M→S      S→M                           M→S      S→M
```

**Légende :**
- M→S : Musique puis Silence
- S→M : Silence puis Musique

---

## 🔄 Flux détaillé par groupe

### GROUPE 1 : Habitué + Musique→Silence

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DÉMARRAGE                                                │
│    ┌─────────────────────────────────────────┐              │
│    │ 🎵 Musique lancée                       │              │
│    │ window.musiqueExperience = Audio()      │              │
│    └─────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. QUESTIONNAIRE                                            │
│    → Assignation : groupe_experimental = 1                  │
│    → musique_bloc1 = true, musique_bloc2 = false            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. ARRÊT MUSIQUE BLOC 1 ?                                   │
│    → Condition : musique_bloc1 = true                       │
│    → Action : SKIP (musique continue) ✓                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. BLOC 1 EN MUSIQUE 🎵                                     │
│    ┌───────────────────────────────────┐                    │
│    │ Catégorisation 1                  │                    │
│    │ • 2 images (lampe, voiture)       │                    │
│    │ • Touches F (intérieur) / J (ext) │                    │
│    └───────────────────────────────────┘                    │
│                    ↓                                         │
│    ┌───────────────────────────────────┐                    │
│    │ PVT 1                             │                    │
│    │ • 48 essais                       │                    │
│    │ • ISI 2-10 secondes               │                    │
│    │ • Mesure RT                       │                    │
│    └───────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. ARRÊT MUSIQUE BLOC 2 ? (🐛 BUG ICI)                      │
│    → Condition : !musique_bloc1 (❌ devrait être autre)     │
│    → Action : EXÉCUTE arrêt (mais logique confuse)          │
│    → 🔧 À CORRIGER                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. DÉMARRAGE MUSIQUE BLOC 2 ?                               │
│    → Condition : musique_bloc2 = false                      │
│    → Action : SKIP (pas de musique au bloc 2) ✓             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. BLOC 2 EN SILENCE 🔇                                     │
│    ┌───────────────────────────────────┐                    │
│    │ Catégorisation 2                  │                    │
│    │ • Identique à Cat 1               │                    │
│    └───────────────────────────────────┘                    │
│                    ↓                                         │
│    ┌───────────────────────────────────┐                    │
│    │ PVT 2                             │                    │
│    │ • 48 essais                       │                    │
│    └───────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. ARRÊT FINAL                                              │
│    → Arrête toute musique                                   │
│    → Écran "Merci"                                          │
│    → Téléchargement CSV                                     │
└─────────────────────────────────────────────────────────────┘
```

---

### GROUPE 2 : Habitué + Silence→Musique

```
🎵 Musique lancée au début
            ↓
Questionnaire
→ groupe_experimental = 2
→ musique_bloc1 = false, musique_bloc2 = true
            ↓
⚙️ Arrêt musique avant Bloc 1
→ musique_bloc1 = false → EXÉCUTE arrêt ✓
            ↓
🔇 BLOC 1 EN SILENCE
    • Catégorisation 1
    • PVT 1 (48 essais)
            ↓
⚙️ Arrêt musique Bloc 2 ? (🐛 logique confuse)
            ↓
⚙️ Démarrage musique Bloc 2
→ musique_bloc2 = true → EXÉCUTE démarrage ✓
            ↓
🎵 BLOC 2 EN MUSIQUE
    • Catégorisation 2
    • PVT 2 (48 essais)
            ↓
Arrêt final + Merci
```

---

### GROUPE 3 : Non-habitué + Musique→Silence

```
Identique au Groupe 1
Différence : groupe_experimental = 3
```

---

### GROUPE 4 : Non-habitué + Silence→Musique

```
Identique au Groupe 2
Différence : groupe_experimental = 4
```

---

## 🎨 Tableau récapitulatif

| Groupe | Habitude | Bloc 1 | Bloc 2 | musique_bloc1 | musique_bloc2 |
|--------|----------|--------|--------|---------------|---------------|
| **1** | Habitué | 🎵 Musique | 🔇 Silence | `true` | `false` |
| **2** | Habitué | 🔇 Silence | 🎵 Musique | `false` | `true` |
| **3** | Non-habitué | 🎵 Musique | 🔇 Silence | `true` | `false` |
| **4** | Non-habitué | 🔇 Silence | 🎵 Musique | `false` | `true` |

---

## 🔍 Comparaison : Protocole vs Implémentation

### Votre protocole décrit

```
C1 = Q + M – D + S – T + S – D + M – T + M
C2 = Q + M – D + M – T + M – D + S – T + S
```

**Interprétation 1 : 4 tâches séparées**
```
C1 : Q+M → D(silence) → T(silence) → D(musique) → T(musique)
C2 : Q+M → D(musique) → T(musique) → D(silence) → T(silence)
```

### Implémentation actuelle

```
C1 (M→S) : Q+M → [D+T](musique) → [D+T](silence)
C2 (S→M) : Q+M → [D+T](silence) → [D+T](musique)
```

**Différence clé :**
- Protocole suggère : D puis T séparément avec changements de musique entre
- Implémentation : D et T regroupés en 2 blocs avec 1 changement de musique

---

## ⏱️ Timeline typique (Groupe 1 exemple)

```
[0:00]   🎵 Lancement musique + Questionnaire
[2:00]   Instructions générales
[2:30]   🎵 BLOC 1 : Catégorisation (2 images)
[2:50]   🎵 BLOC 1 : PVT (48 essais)
[6:50]   ⚙️ Arrêt musique
[7:00]   🔇 BLOC 2 : Catégorisation (2 images)
[7:20]   🔇 BLOC 2 : PVT (48 essais)
[11:20]  Fin + Téléchargement données
```

**Durée totale estimée :** 10-12 minutes

**Remarque :** Catégorisation très courte (2 images = ~20s)

---

## 🎯 Points clés de la gestion audio

### Variable globale

```javascript
window.musiqueExperience = Audio object
```

**États possibles :**
- `null` : Pas de musique active
- `Audio playing` : Musique en cours
- `Audio paused` : Musique arrêtée

### Transitions audio

```
DÉMARRAGE
    window.musiqueExperience = new Audio('static/musique.mp3')
    audioElement.loop = true
    audioElement.play()

ARRÊT BLOC 1 (si musique_bloc1 = false)
    window.musiqueExperience.pause()
    window.musiqueExperience.currentTime = 0
    window.musiqueExperience = null

DÉMARRAGE BLOC 2 (si musique_bloc2 = true ET pas déjà active)
    window.musiqueExperience = new Audio('static/musique.mp3')
    audioElement.play()

ARRÊT FINAL
    window.musiqueExperience.pause()
    window.musiqueExperience = null
```

---

## 🔧 Problèmes identifiés dans le flux

### 🐛 Bug #1 : Arreter_Musique_Bloc2 (ligne 723)

**Code actuel :**
```javascript
if (!musiqueBloc1) {  // ❌ Logique inversée
  this.skip = true;
}
```

**Scénario problématique :**
- Groupe 1 (M→S) : `musique_bloc1 = true`
  - Condition : `!true = false` → N'exécute PAS le skip → Arrête la musique
  - Mais la musique doit **déjà être arrêtée** pour le Bloc 2 !

- Groupe 2 (S→M) : `musique_bloc1 = false`
  - Condition : `!false = true` → SKIP
  - Correct, car pas de musique à arrêter

**Conclusion :** Ce composant est confus et probablement inutile. Recommandation = le supprimer.

### 🟡 Question #2 : Ordre des tâches

**Votre notation suggère :**
```
D + S – T + S  (tâche D en silence, puis tâche T en silence)
```

**Mais implémentation :**
```
[Catégorisation + PVT] en silence (les deux tâches ensemble)
```

**Question à clarifier :**
Voulez-vous changer la musique **entre chaque tâche** ou **entre les deux blocs** ?

---

## 📊 Variables de données enregistrées

### Par essai de Catégorisation

```javascript
{
  sender: "Affichage_Image",
  image_shown: "static/lampe.jpeg",
  object_name: "Lampe",
  correct_response: "f",
  response: "f",
  correct: 1,
  accuracy: "correct",
  rt: 1234,  // ms
  duration: 1234
}
```

**⚠️ Manquant :**
- `bloc_number` (1 ou 2)
- `audio_condition` ("musique" ou "silence")

### Par essai PVT

```javascript
{
  sender: "Compteur",
  trial_number: 23,
  isi: 5432,  // délai avant stimulus (ms)
  rt: 234,    // temps de réaction (ms)
  response_type: "normal",  // ou "anticipation", "lapse", "no_response"
  ended_on: "response"  // ou "timeout"
}
```

**⚠️ Manquant :**
- `bloc_number` (1 ou 2)
- `audio_condition` ("musique" ou "silence")

---

## ✅ Recommandations pour améliorer le flux

### 1. Supprimer Arreter_Musique_Bloc2

**Raison :** Logique confuse et probablement inutile

**Remplacement :**
```javascript
// Simple écran de transition
{
  type: "lab.html.Screen",
  title: "Transition_Bloc2",
  content: "<p>Transition...</p>",
  timeout: 500
}
```

### 2. Ajouter contexte dans les données

**Dans chaque tâche (Catégorisation, PVT) :**
```javascript
"before:prepare": function() {
  const questData = this.options.datastore.data.find(
    d => d.sender === 'Questionnaire_initial'
  );

  // Déterminer le bloc
  const blocNumber = /* logique pour déterminer 1 ou 2 */;

  // Déterminer contexte audio
  const audioCondition = (blocNumber === 1)
    ? (questData.musique_bloc1 ? "musique" : "silence")
    : (questData.musique_bloc2 ? "musique" : "silence");

  this.data.bloc_number = blocNumber;
  this.data.audio_condition = audioCondition;
  this.data.groupe_experimental = questData.groupe_experimental;
  this.data.participant_id = questData.participant_id;
}
```

### 3. Clarifier les instructions

**Ajouter dans les instructions :**
- Indication claire du bloc (Bloc 1 / Bloc 2)
- Feedback sur la condition audio si pertinent
- Estimation du temps restant

---

**Fin du schéma**
