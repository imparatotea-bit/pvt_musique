# Image Files

Placez vos images pour la tâche de catégorisation ici.

## Format recommandé

- Format : JPG ou PNG
- Dimensions : 512x512 px ou plus
- Qualité : Optimisée pour le web

## Organisation

```
static/images/
├── natural/
│   ├── tree.jpg
│   ├── flower.jpg
│   ├── bird.jpg
│   └── ...
└── artificial/
    ├── car.jpg
    ├── building.jpg
    ├── computer.jpg
    └── ...
```

## Configuration

Après avoir ajouté vos images, modifiez le fichier :

`app/src/pages/CategorizationTask.jsx`

```javascript
const imageStimuli = [
  { id: 1, name: 'tree.jpg', category: 'natural', correctResponse: 'f' },
  { id: 2, name: 'car.jpg', category: 'artificial', correctResponse: 'j' },
  // Ajoutez vos images ici
];
```
