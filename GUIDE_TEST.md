# 🧪 Guide de test de l'expérience

## ✅ Checklist de vérification

Utilisez ce guide pour tester systématiquement votre expérience avant la collecte de données.

---

## 🚀 1. Préparation

### 1.1 Lancer le serveur local

```bash
# Option 1 : Script automatique
./START_SERVER.sh

# Option 2 : Manuel
python3 -m http.server 8000
```

### 1.2 Ouvrir le navigateur

```
http://localhost:8000/index.html
```

### 1.3 Ouvrir la console développeur

- **Chrome/Edge** : F12 ou Ctrl+Shift+J (Cmd+Option+J sur Mac)
- **Firefox** : F12 ou Ctrl+Shift+K (Cmd+Option+K sur Mac)
- **Safari** : Cmd+Option+C

**Pourquoi ?** Les logs console affichent les assignations et transitions audio

---

## 🎵 2. Test Groupe 1 : Habitué + Musique→Silence

### 2.1 Configuration
- [ ] **Slider habitudes** : Mettre à **8** (habitué)
- [ ] Remplir âge, genre, fatigue, stress

### 2.2 Vérifications console attendues

```javascript
=== RÉSULTAT ASSIGNATION ===
Habitude musicale: 8/10 → habitue
Groupe expérimental: 1 ou 2 (aléatoire)
```

**Si Groupe 1 :**
```javascript
Condition: musique_puis_silence
Bloc 1 (Cat1+PVT1): Musique = true
Bloc 2 (Cat2+PVT2): Musique = false
```

### 2.3 Déroulement attendu

| Étape | Attendu | Vérification |
|-------|---------|--------------|
| Démarrage | 🎵 Musique lance | Entendre la musique |
| Questionnaire | 🎵 Musique continue | Musique audible |
| Instructions | 🎵 Musique continue | Musique audible |
| Catégorisation 1 | 🎵 Musique continue | Musique audible |
| PVT 1 | 🎵 Musique continue | Musique audible |
| Transition | 🔇 Musique s'arrête | Silence complet |
| Catégorisation 2 | 🔇 Silence | Pas de musique |
| PVT 2 | 🔇 Silence | Pas de musique |
| Fin | 🔇 Silence | Téléchargement CSV |

### 2.4 Checklist de fonctionnement

- [ ] Musique lance au début
- [ ] Musique continue pendant tout le Bloc 1
- [ ] Musique s'arrête avant le Bloc 2
- [ ] Bloc 2 se déroule en silence
- [ ] Fichier CSV téléchargé à la fin
- [ ] Pas d'erreurs dans la console

---

## 🔇 3. Test Groupe 2 : Habitué + Silence→Musique

### 3.1 Configuration
- [ ] **Rafraîchir la page** (Ctrl+F5)
- [ ] **Slider habitudes** : Mettre à **8** (habitué)
- [ ] Remplir le questionnaire

### 3.2 Déroulement attendu (si assigné Groupe 2)

| Étape | Attendu | Vérification |
|-------|---------|--------------|
| Démarrage | 🎵 Musique lance | Entendre la musique |
| Questionnaire | 🎵 Musique continue | Musique audible |
| Transition | 🔇 Musique s'arrête | Silence |
| Catégorisation 1 | 🔇 Silence | Pas de musique |
| PVT 1 | 🔇 Silence | Pas de musique |
| Transition | 🎵 Musique redémarre | Musique audible |
| Catégorisation 2 | 🎵 Musique | Musique audible |
| PVT 2 | 🎵 Musique | Musique audible |
| Fin | 🔇 Musique arrêtée | Téléchargement CSV |

### 3.3 Checklist

- [ ] Musique lance puis s'arrête avant Bloc 1
- [ ] Bloc 1 en silence complet
- [ ] Musique redémarre avant Bloc 2
- [ ] Bloc 2 avec musique
- [ ] Fichier CSV téléchargé
- [ ] Pas d'erreurs console

**Note :** Si vous êtes assigné au Groupe 1 (aléatoire 50/50), rafraîchir et réessayer jusqu'à obtenir Groupe 2.

---

## 🙅 4. Test Groupe 3 : Non-habitué + Musique→Silence

### 4.1 Configuration
- [ ] **Rafraîchir la page** (Ctrl+F5)
- [ ] **Slider habitudes** : Mettre à **2** (non-habitué)

### 4.2 Déroulement attendu

**Identique au Groupe 1** (mais `groupe_experimental = 3`)

---

## 🙅 5. Test Groupe 4 : Non-habitué + Silence→Musique

### 5.1 Configuration
- [ ] **Rafraîchir la page** (Ctrl+F5)
- [ ] **Slider habitudes** : Mettre à **2** (non-habitué)

### 5.2 Déroulement attendu

**Identique au Groupe 2** (mais `groupe_experimental = 4`)

---

## 📊 6. Vérification des données

### 6.1 Ouvrir le fichier CSV téléchargé

**Format attendu :** `pvt_musique_habitudes-TIMESTAMP.csv`

### 6.2 Colonnes essentielles à vérifier

**Questionnaire (ligne avec sender = "Questionnaire_initial") :**
```
participant_id, groupe_experimental, groupe_habitude,
musique_bloc1, musique_bloc2, condition_ordre,
age, genre, habitude_musique_slider, fatigue, stress
```

**Catégorisation (lignes avec sender = "Affichage_Image") :**
```
image_shown, object_name, correct_response, response,
correct, accuracy, rt, duration
```

**PVT (lignes avec sender = "Compteur") :**
```
trial_number, isi, rt, response_type, ended_on
```

### 6.3 Checklist données

- [ ] `participant_id` présent et unique
- [ ] `groupe_experimental` = 1, 2, 3, ou 4
- [ ] `musique_bloc1` et `musique_bloc2` cohérents avec le groupe
- [ ] Données de catégorisation présentes (2 essais par bloc = 4 lignes)
- [ ] Données PVT présentes (48 essais par bloc = 96 lignes)
- [ ] Temps de réaction (rt) en millisecondes raisonnables (100-2000 ms typique)

### 6.4 Vérification de cohérence

**Groupe 1 (M→S) doit avoir :**
- `musique_bloc1 = true`
- `musique_bloc2 = false`
- `condition_ordre = "musique_puis_silence"`

**Groupe 2 (S→M) doit avoir :**
- `musique_bloc1 = false`
- `musique_bloc2 = true`
- `condition_ordre = "silence_puis_musique"`

---

## 🔍 7. Tests spécifiques PVT

### 7.1 Test anticipation

**Action :**
1. Lancer une session
2. Pendant le PVT, appuyer sur ESPACE **avant** que le compteur ne commence

**Attendu :**
- Message console ou comportement d'anticipation
- `response_type = "anticipation"` dans les données

### 7.2 Test lapse

**Action :**
1. Attendre que le compteur dépasse ~500ms avant de répondre

**Attendu :**
- `response_type = "lapse"` dans les données

### 7.3 Test timeout

**Action :**
1. Ne pas répondre du tout pendant un essai

**Attendu :**
- `ended_on = "timeout"` dans les données
- `response_type = "no_response"`

---

## ⚠️ 8. Problèmes courants et solutions

### Problème : Musique ne se lance pas

**Causes possibles :**
1. Fichier `static/musique.mp3` manquant
2. Navigateur bloque l'autoplay
3. Volume système à 0

**Solutions :**
- Vérifier que le fichier existe
- Cliquer sur le bouton "Démarrer" (interaction utilisateur requise)
- Vérifier volume système et navigateur

**Vérification console :**
```javascript
✓✓✓ Musique démarrée avec succès
✓ Musique confirmée active (temps: X s)
```

### Problème : Images ne s'affichent pas

**Causes possibles :**
1. Fichiers manquants dans `static/`
2. Chemin incorrect

**Solutions :**
- Vérifier `static/lampe.jpeg` et `static/voiture.jpg`
- Vérifier console pour erreurs 404

### Problème : CSV ne se télécharge pas

**Causes possibles :**
1. Bloqueur de pop-up
2. Navigateur bloque téléchargement

**Solutions :**
- Autoriser pop-ups pour localhost
- Vérifier dans le dossier Téléchargements

### Problème : Assignation toujours au même groupe

**Cause :** Randomisation normale (50/50)

**Solution :**
- Rafraîchir plusieurs fois (Ctrl+F5)
- Statistiquement, 50% de chance pour chaque groupe

---

## 🔧 9. Tests navigateurs

Tester sur plusieurs navigateurs pour compatibilité :

### Chrome/Edge
- [ ] Musique fonctionne
- [ ] Images s'affichent
- [ ] CSV se télécharge
- [ ] Pas d'erreurs console

### Firefox
- [ ] Musique fonctionne
- [ ] Images s'affichent
- [ ] CSV se télécharge
- [ ] Pas d'erreurs console

### Safari (Mac uniquement)
- [ ] Musique fonctionne
- [ ] Images s'affichent
- [ ] CSV se télécharge
- [ ] Pas d'erreurs console

**Note :** Si des problèmes apparaissent sur Safari, vérifier les logs console (souvent plus strict sur l'autoplay).

---

## 📱 10. Test sur mobile/tablette (optionnel)

**⚠️ Attention :** Lab.js est optimisé pour desktop. Tests mobiles facultatifs.

Si vous voulez tester sur mobile :
1. Trouver votre IP locale : `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
2. Lancer serveur : `python3 -m http.server 8000`
3. Sur mobile, aller à : `http://VOTRE_IP:8000/index.html`

**Problèmes courants mobile :**
- Autoplay bloqué (plus strict)
- Clavier virtuel peut gêner
- Timeout peut être trop court (tactile plus lent)

---

## ✅ 11. Checklist finale avant déploiement Pavlovia

### Code
- [ ] Bug ligne 723 corrigé (Arreter_Musique_Bloc2)
- [ ] Marqueurs bloc et audio ajoutés aux données
- [ ] Console logs retirés (ou minimisés)
- [ ] Commentaires ajoutés pour clarté

### Tests
- [ ] Les 4 groupes testés (1, 2, 3, 4)
- [ ] Musique fonctionne dans tous les cas
- [ ] Données complètes et cohérentes
- [ ] Durée totale mesurée (~10-12 min)
- [ ] Testé sur 2+ navigateurs

### Fichiers
- [ ] `static/musique.mp3` présent (2.5 MB)
- [ ] `static/lampe.jpeg` présent (17 KB)
- [ ] `static/voiture.jpg` présent (515 KB)
- [ ] `lib/` complet (lab.js)
- [ ] `index.html`, `script.js`, `style.css` OK

### Documentation
- [ ] README.md à jour
- [ ] Protocole clarifié (voir QUESTION_PROTOCOLE.md)
- [ ] Instructions participant claires

### Pavlovia
- [ ] Compte Pavlovia créé
- [ ] Projet GitLab configuré
- [ ] Tous les fichiers uploadés
- [ ] Test en mode pilote réussi
- [ ] Crédits Pavlovia suffisants

---

## 📋 12. Journal de test (template)

Utilisez ce template pour documenter vos tests :

```
DATE : __________
TESTEUR : __________

TEST #1
- Groupe : _____
- Navigateur : _____
- Musique : OK / ERREUR
- Images : OK / ERREUR
- Données : OK / ERREUR
- Durée : _____ min
- Notes : ___________________________

TEST #2
...

BUGS DÉTECTÉS :
1. _____________________________
2. _____________________________

AMÉLIORATIONS SUGGÉRÉES :
1. _____________________________
2. _____________________________
```

---

## 🎯 Prochaines étapes

Après avoir complété tous les tests :

1. **Corriger les bugs détectés**
2. **Documenter les résultats**
3. **Test pilote avec 3-5 vrais participants**
4. **Ajustements finaux**
5. **Déploiement sur Pavlovia**
6. **Collecte de données**

---

**Bon courage pour vos tests !**
