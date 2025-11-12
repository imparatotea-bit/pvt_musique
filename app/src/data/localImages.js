// Images locales converties en WEBP pour performance optimale
// 42 images disponibles (image-01.webp à image-42.webp)

export const localImages = Array.from({ length: 42 }, (_, i) => {
  const num = i + 1;
  return {
    id: num,
    filename: `image-${String(num).padStart(2, '0')}.webp`,
    url: `/img/image-${String(num).padStart(2, '0')}.webp`
  };
});

// Helper pour obtenir une image par ID
export const getImageById = (id) => localImages.find(img => img.id === id);

// Helper pour obtenir N images aléatoires
export const getRandomImages = (count) => {
  const shuffled = [...localImages].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
