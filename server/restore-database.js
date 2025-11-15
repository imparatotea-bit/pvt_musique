const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DB_PATH = path.join(__dirname, 'participants.db');
const DATA_DIR = path.join(__dirname, 'data');

async function restoreDatabase() {
  console.log('🔧 Restauration de la base de données à partir des fichiers JSON...\n');

  // Initialiser SQL.js
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  // Créer la table
  db.run(`
    CREATE TABLE IF NOT EXISTS participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_id TEXT UNIQUE NOT NULL,
      age INTEGER,
      gender TEXT,
      music_habit INTEGER,
      fatigue INTEGER,
      stress INTEGER,
      is_habitue INTEGER,
      condition TEXT NOT NULL,
      rt_with_music REAL,
      rt_without_music REAL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Lire tous les fichiers JSON dans le dossier data
  if (!fs.existsSync(DATA_DIR)) {
    console.error('❌ Le dossier data/ n\'existe pas');
    return;
  }

  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  console.log(`📁 Fichiers JSON trouvés: ${files.length}\n`);

  let restored = 0;
  let skipped = 0;

  for (const file of files) {
    try {
      const filepath = path.join(DATA_DIR, file);
      const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));

      // Calculer les stats
      const pvt1 = data.pvtBlock1 || [];
      const pvt2 = data.pvtBlock2 || [];

      const calculateMean = (arr) => {
        if (!arr.length) return null;
        const sum = arr.reduce((acc, trial) => acc + trial.rt, 0);
        return sum / arr.length;
      };

      const isMusicFirst = data.condition === 'C2';
      const rtWithMusic = isMusicFirst ? calculateMean(pvt1) : calculateMean(pvt2);
      const rtWithoutMusic = isMusicFirst ? calculateMean(pvt2) : calculateMean(pvt1);

      // Extraire données questionnaire
      const quest = data.questionnaire || {};

      // Vérifier si les données sont complètes
      const isComplete = pvt1.length > 0 || pvt2.length > 0;

      if (!isComplete) {
        console.log(`⚠️  ${file}: Données incomplètes - ignoré`);
        skipped++;
        continue;
      }

      // Extraire la date de complétion du timestamp
      const completedAt = data.timestamp || new Date().toISOString();

      // Insérer dans la base
      db.run(`
        INSERT OR REPLACE INTO participants
        (participant_id, age, gender, music_habit, fatigue, stress, is_habitue, condition, rt_with_music, rt_without_music, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        data.participantId,
        quest.age || null,
        quest.gender || null,
        quest.musicHabit || null,
        quest.fatigue || null,
        quest.stress || null,
        quest.isHabitue ? 1 : 0,
        data.condition,
        rtWithMusic,
        rtWithoutMusic,
        completedAt
      ]);

      console.log(`✅ ${data.participantId}: Restauré (Condition: ${data.condition}, Habitué: ${quest.isHabitue ? 'Oui' : 'Non'})`);
      restored++;

    } catch (error) {
      console.error(`❌ Erreur avec ${file}:`, error.message);
      skipped++;
    }
  }

  // Sauvegarder la base de données
  const dbData = db.export();
  fs.writeFileSync(DB_PATH, dbData);

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Base de données restaurée: ${DB_PATH}`);
  console.log(`📊 Participants restaurés: ${restored}`);
  console.log(`⚠️  Participants ignorés: ${skipped}`);
  console.log('='.repeat(60));

  // Afficher les stats
  const totalResult = db.exec('SELECT COUNT(*) FROM participants');
  const c1Result = db.exec('SELECT COUNT(*) FROM participants WHERE condition = "C1"');
  const c2Result = db.exec('SELECT COUNT(*) FROM participants WHERE condition = "C2"');
  const habituesResult = db.exec('SELECT COUNT(*) FROM participants WHERE is_habitue = 1');

  console.log('\n📈 Statistiques:');
  console.log(`   Total: ${totalResult[0]?.values[0]?.[0] || 0}`);
  console.log(`   C1: ${c1Result[0]?.values[0]?.[0] || 0}`);
  console.log(`   C2: ${c2Result[0]?.values[0]?.[0] || 0}`);
  console.log(`   Habitués: ${habituesResult[0]?.values[0]?.[0] || 0}`);
  console.log(`   Non-habitués: ${(totalResult[0]?.values[0]?.[0] || 0) - (habituesResult[0]?.values[0]?.[0] || 0)}`);

  db.close();
}

// Exécuter la restauration
restoreDatabase().catch(err => {
  console.error('❌ Erreur lors de la restauration:', err);
  process.exit(1);
});
