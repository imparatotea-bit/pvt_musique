import sharp from 'sharp';
import { readdir, unlink, rename } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const IMG_DIR = join(__dirname, '../app/public/img');
const QUALITY = 85;

// Fonction pour attendre un peu (Windows file locking)
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function convertToWebP() {
  console.log('🔄 Conversion des images en WEBP...\n');
  
  const files = await readdir(IMG_DIR);
  const imageFiles = files.filter(f => 
    /\.(jpg|jpeg|png|avif|jxl|webp)$/i.test(f)
  );

  let converted = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of imageFiles) {
    const inputPath = join(IMG_DIR, file);
    const baseName = basename(file, extname(file));
    const outputPath = join(IMG_DIR, `${baseName}.webp`);
    const ext = extname(file).toLowerCase();

    try {
      // Si c'est déjà un WEBP, on skip
      if (ext === '.webp') {
        console.log(`⏭️  ${file} (déjà WEBP)`);
        skipped++;
        continue;
      }

      // Convertir en WEBP
      await sharp(inputPath)
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      await wait(100); // Attendre que le fichier soit bien écrit

      // Supprimer l'original
      await unlink(inputPath);
      console.log(`✅ ${file} → ${baseName}.webp`);
      converted++;

    } catch (error) {
      console.error(`❌ ${file}: ${error.message}`);
      errors++;
    }
  }

  console.log(`\n📊 Résumé:`);
  console.log(`   ✅ Converties: ${converted}`);
  console.log(`   ⏭️  Ignorées: ${skipped}`);
  console.log(`   ❌ Erreurs: ${errors}`);
}

convertToWebP().catch(console.error);
