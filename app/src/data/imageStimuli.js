// 40 images libres de droit pour la tâche de catégorisation
// Source: Unsplash (licence libre, attribution recommandée)
// 20 objets naturels + 20 objets artificiels

export const imageStimuli = [
  // === NATURELS (20) ===
  { id: 1, name: 'tree', category: 'natural', url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400' },
  { id: 2, name: 'flower', category: 'natural', url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400' },
  { id: 3, name: 'mountain', category: 'natural', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400' },
  { id: 4, name: 'bird', category: 'natural', url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400' },
  { id: 5, name: 'ocean', category: 'natural', url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400' },
  { id: 6, name: 'forest', category: 'natural', url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400' },
  { id: 7, name: 'cat', category: 'natural', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400' },
  { id: 8, name: 'dog', category: 'natural', url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400' },
  { id: 9, name: 'butterfly', category: 'natural', url: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400' },
  { id: 10, name: 'sunset', category: 'natural', url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400' },
  { id: 11, name: 'waterfall', category: 'natural', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400' },
  { id: 12, name: 'leaves', category: 'natural', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { id: 13, name: 'horse', category: 'natural', url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400' },
  { id: 14, name: 'fish', category: 'natural', url: 'https://images.unsplash.com/photo-1520990853125-b166ab2dbf2e?w=400' },
  { id: 15, name: 'clouds', category: 'natural', url: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=400' },
  { id: 16, name: 'river', category: 'natural', url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400' },
  { id: 17, name: 'grass', category: 'natural', url: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400' },
  { id: 18, name: 'rabbit', category: 'natural', url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400' },
  { id: 19, name: 'deer', category: 'natural', url: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400' },
  { id: 20, name: 'sand', category: 'natural', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400' },

  // === ARTIFICIELS (20) ===
  { id: 21, name: 'car', category: 'artificial', url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400' },
  { id: 22, name: 'building', category: 'artificial', url: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?w=400' },
  { id: 23, name: 'computer', category: 'artificial', url: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=400' },
  { id: 24, name: 'phone', category: 'artificial', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
  { id: 25, name: 'chair', category: 'artificial', url: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400' },
  { id: 26, name: 'lamp', category: 'artificial', url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400' },
  { id: 27, name: 'clock', category: 'artificial', url: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=400' },
  { id: 28, name: 'bicycle', category: 'artificial', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400' },
  { id: 29, name: 'keyboard', category: 'artificial', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400' },
  { id: 30, name: 'guitar', category: 'artificial', url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400' },
  { id: 31, name: 'camera', category: 'artificial', url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400' },
  { id: 32, name: 'bridge', category: 'artificial', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400' },
  { id: 33, name: 'bottle', category: 'artificial', url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400' },
  { id: 34, name: 'book', category: 'artificial', url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400' },
  { id: 35, name: 'train', category: 'artificial', url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400' },
  { id: 36, name: 'plane', category: 'artificial', url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400' },
  { id: 37, name: 'watch', category: 'artificial', url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400' },
  { id: 38, name: 'headphones', category: 'artificial', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  { id: 39, name: 'glasses', category: 'artificial', url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400' },
  { id: 40, name: 'pen', category: 'artificial', url: 'https://images.unsplash.com/photo-1586158291800-2665f07bba79?w=400' },
];
