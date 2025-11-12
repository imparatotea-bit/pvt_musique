const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/static', express.static(path.join(__dirname, '..', 'static')));

// Variables globales pour la base de données
let db = null;
const DB_PATH = path.join(__dirname, 'participants.db');

// Initialiser SQL.js et la base de données
async function initDatabase() {
  const SQL = await initSqlJs();

  let buffer = null;
  if (fs.existsSync(DB_PATH)) {
    buffer = fs.readFileSync(DB_PATH);
  }

  db = new SQL.Database(buffer);

  // Table des participants complétés UNIQUEMENT
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

  saveDatabase();
  console.log('✅ Base de données initialisée');
}

// Sauvegarder la base de données
function saveDatabase() {
  if (db) {
    const data = db.export();
    fs.writeFileSync(DB_PATH, data);
  }
}

// ============================================
// ROUTES API
// ============================================

// POST /api/save-data - Sauvegarder UNIQUEMENT les participants qui ont terminé
app.post('/api/save-data', (req, res) => {
  try {
    const data = req.body;

    if (!data.participantId || !data.condition) {
      return res.status(400).json({ error: 'Données incomplètes' });
    }

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

    // Insérer dans la base
    db.run(`
      INSERT INTO participants
      (participant_id, age, gender, music_habit, fatigue, stress, is_habitue, condition, rt_with_music, rt_without_music)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      rtWithoutMusic
    ]);

    saveDatabase();

    // Sauvegarder JSON complet
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filename = `participant_${data.participantId}.json`;
    const filepath = path.join(dataDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));

    console.log(`✅ Participant complété: ${data.participantId}`);
    res.json({ success: true });

  } catch (error) {
    console.error('❌ Erreur save-data:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/assign-condition - Assignation DÉTERMINISTE C1/C2 pour forcer 50/50
app.post('/api/assign-condition', (req, res) => {
  try {
    const { isHabitue } = req.body;

    // Compter les participants COMPLÉTÉS uniquement (pas les en-cours)
    const c1CountResult = db.exec('SELECT COUNT(*) FROM participants WHERE condition = "C1"');
    const c2CountResult = db.exec('SELECT COUNT(*) FROM participants WHERE condition = "C2"');

    const c1Count = c1CountResult[0]?.values[0]?.[0] || 0;
    const c2Count = c2CountResult[0]?.values[0]?.[0] || 0;

    console.log(`🎯 Assignation déterministe: C1=${c1Count}, C2=${c2Count}, isHabitue=${isHabitue}`);

    let assignedCondition;

    if (c1Count < c2Count) {
      // Plus de C2 → assigner C1
      assignedCondition = 'C1';
      console.log(`  → C1 sous-représenté (${c1Count} vs ${c2Count}) → C1`);
    } else if (c2Count < c1Count) {
      // Plus de C1 → assigner C2
      assignedCondition = 'C2';
      console.log(`  → C2 sous-représenté (${c2Count} vs ${c1Count}) → C2`);
    } else {
      // Égalité → alterner selon le nombre total
      const total = c1Count + c2Count;
      assignedCondition = (total % 2 === 0) ? 'C1' : 'C2';
      console.log(`  → Égalité (${c1Count}=${c2Count}) → alternance → ${assignedCondition}`);
    }

    console.log(`✅ Assignation: ${assignedCondition}`);

    res.json({ condition: assignedCondition });

  } catch (error) {
    console.error('❌ Erreur assign-condition:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/stats
app.get('/api/stats', (req, res) => {
  try {
    const totalResult = db.exec('SELECT COUNT(*) as count FROM participants');
    const habitueTrueResult = db.exec('SELECT COUNT(*) FROM participants WHERE is_habitue = 1');
    const habitueFalseResult = db.exec('SELECT COUNT(*) FROM participants WHERE is_habitue = 0');
    const c1Result = db.exec('SELECT COUNT(*) FROM participants WHERE condition = "C1"');
    const c2Result = db.exec('SELECT COUNT(*) FROM participants WHERE condition = "C2"');

    const avgRtMusicResult = db.exec('SELECT AVG(rt_with_music) FROM participants WHERE rt_with_music IS NOT NULL');
    const avgRtSilenceResult = db.exec('SELECT AVG(rt_without_music) FROM participants WHERE rt_without_music IS NOT NULL');

    res.json({
      total: totalResult[0]?.values[0]?.[0] || 0,
      habitues: habitueTrueResult[0]?.values[0]?.[0] || 0,
      non_habitues: habitueFalseResult[0]?.values[0]?.[0] || 0,
      condition_c1: c1Result[0]?.values[0]?.[0] || 0,
      condition_c2: c2Result[0]?.values[0]?.[0] || 0,
      avg_rt_music: Math.round(avgRtMusicResult[0]?.values[0]?.[0] || 0),
      avg_rt_silence: Math.round(avgRtSilenceResult[0]?.values[0]?.[0] || 0)
    });

  } catch (error) {
    console.error('❌ Erreur stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/export
app.get('/api/export', (req, res) => {
  try {
    const result = db.exec('SELECT * FROM participants ORDER BY completed_at DESC');

    if (result.length === 0) {
      return res.send('id,participant_id,age,gender,music_habit,fatigue,stress,is_habitue,condition,rt_with_music,rt_without_music,completed_at\n');
    }

    const headers = ['id', 'participant_id', 'age', 'gender', 'music_habit', 'fatigue', 'stress', 'is_habitue', 'condition', 'rt_with_music', 'rt_without_music', 'completed_at'];
    const rows = result[0].values.map(row => row.join(','));
    const csv = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=participants.csv');
    res.send(csv);

  } catch (error) {
    console.error('❌ Erreur export:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/cleanup - Nettoyer les anciennes données (admin only)
app.post('/api/cleanup', (req, res) => {
  try {
    // Backup avant nettoyage
    const backupPath = path.join(__dirname, `participants_backup_${Date.now()}.db`);
    const data = db.export();
    fs.writeFileSync(backupPath, data);

    // Vider la table (nouveau départ propre)
    db.run('DELETE FROM participants');
    saveDatabase();

    console.log(`✅ Base nettoyée (backup: ${backupPath})`);
    res.json({ success: true, backup: backupPath });

  } catch (error) {
    console.error('❌ Erreur cleanup:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET / - Dashboard minimaliste Apple/Notion
app.get('/', (req, res) => {
  try {
    const stats = db.exec('SELECT COUNT(*) as total FROM participants')[0]?.values[0]?.[0] || 0;
    const habitues = db.exec('SELECT COUNT(*) FROM participants WHERE is_habitue = 1')[0]?.values[0]?.[0] || 0;
    const nonHabitues = db.exec('SELECT COUNT(*) FROM participants WHERE is_habitue = 0')[0]?.values[0]?.[0] || 0;
    const c1 = db.exec('SELECT COUNT(*) FROM participants WHERE condition = "C1"')[0]?.values[0]?.[0] || 0;
    const c2 = db.exec('SELECT COUNT(*) FROM participants WHERE condition = "C2"')[0]?.values[0]?.[0] || 0;

    const avgRtMusic = db.exec('SELECT AVG(rt_with_music) FROM participants WHERE rt_with_music IS NOT NULL')[0]?.values[0]?.[0] || 0;
    const avgRtSilence = db.exec('SELECT AVG(rt_without_music) FROM participants WHERE rt_without_music IS NOT NULL')[0]?.values[0]?.[0] || 0;

    const recentParticipants = db.exec('SELECT participant_id, condition, is_habitue, rt_with_music, rt_without_music, completed_at FROM participants ORDER BY completed_at DESC LIMIT 10');

    let html = `
<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'apple-gray': {
              50: '#fafafa',
              100: '#f5f5f7',
              200: '#e8e8ed',
              300: '#d2d2d7',
              400: '#86868b',
              500: '#6e6e73',
              600: '#515154',
              700: '#3a3a3c',
              800: '#2c2c2e',
              900: '#1c1c1e',
            }
          }
        }
      }
    }
  </script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
  </style>
  <title>Backend PVT</title>
</head>
<body class="bg-apple-gray-50 text-apple-gray-900 antialiased">
  <div class="max-w-7xl mx-auto px-5 py-10">
    <!-- Header -->
    <div class="mb-10">
      <h1 class="text-4xl font-semibold text-apple-gray-900 mb-2">Backend PVT</h1>
      <p class="text-apple-gray-400">Participants ayant complété l'expérience</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <!-- Total -->
      <div class="bg-white border border-apple-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
        <div class="text-xs uppercase tracking-wider text-apple-gray-400 mb-2">Total</div>
        <div class="text-5xl font-semibold text-apple-gray-900">${stats}</div>
        <div class="text-sm text-apple-gray-500 mt-1">participants complétés</div>
      </div>

      <!-- Habitués -->
      <div class="bg-white border border-apple-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
        <div class="text-xs uppercase tracking-wider text-apple-gray-400 mb-2">Habitués</div>
        <div class="text-5xl font-semibold text-apple-gray-900">${habitues}</div>
        <div class="text-sm text-apple-gray-500 mt-1">Non-habitués : ${nonHabitues}</div>
      </div>

      <!-- Conditions -->
      <div class="bg-white border border-apple-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
        <div class="text-xs uppercase tracking-wider text-apple-gray-400 mb-2">Conditions</div>
        <div class="text-5xl font-semibold text-apple-gray-900">${c1} / ${c2}</div>
        <div class="text-sm text-apple-gray-500 mt-1">C1 / C2</div>
      </div>

      <!-- RT Musique -->
      <div class="bg-white border border-apple-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
        <div class="text-xs uppercase tracking-wider text-apple-gray-400 mb-2">RT Moyen</div>
        <div class="text-5xl font-semibold text-apple-gray-900">${Math.round(avgRtMusic)}ms</div>
        <div class="text-sm text-apple-gray-500 mt-1">Avec musique</div>
      </div>

      <!-- RT Silence -->
      <div class="bg-white border border-apple-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200">
        <div class="text-xs uppercase tracking-wider text-apple-gray-400 mb-2">RT Moyen</div>
        <div class="text-5xl font-semibold text-apple-gray-900">${Math.round(avgRtSilence)}ms</div>
        <div class="text-sm text-apple-gray-500 mt-1">Sans musique</div>
      </div>
    </div>

    <!-- Distribution -->
    <div class="bg-white border border-apple-gray-200 rounded-2xl p-6 mb-6">
      <h2 class="text-xl font-semibold mb-5">Distribution</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-apple-gray-100 rounded-xl p-4">
          <div class="text-sm text-apple-gray-500 mb-1">Habitués C1</div>
          <div class="text-3xl font-semibold text-apple-gray-900">${db.exec('SELECT COUNT(*) FROM participants WHERE is_habitue = 1 AND condition = "C1"')[0]?.values[0]?.[0] || 0}</div>
        </div>
        <div class="bg-apple-gray-100 rounded-xl p-4">
          <div class="text-sm text-apple-gray-500 mb-1">Habitués C2</div>
          <div class="text-3xl font-semibold text-apple-gray-900">${db.exec('SELECT COUNT(*) FROM participants WHERE is_habitue = 1 AND condition = "C2"')[0]?.values[0]?.[0] || 0}</div>
        </div>
        <div class="bg-apple-gray-100 rounded-xl p-4">
          <div class="text-sm text-apple-gray-500 mb-1">Non-habitués C1</div>
          <div class="text-3xl font-semibold text-apple-gray-900">${db.exec('SELECT COUNT(*) FROM participants WHERE is_habitue = 0 AND condition = "C1"')[0]?.values[0]?.[0] || 0}</div>
        </div>
        <div class="bg-apple-gray-100 rounded-xl p-4">
          <div class="text-sm text-apple-gray-500 mb-1">Non-habitués C2</div>
          <div class="text-3xl font-semibold text-apple-gray-900">${db.exec('SELECT COUNT(*) FROM participants WHERE is_habitue = 0 AND condition = "C2"')[0]?.values[0]?.[0] || 0}</div>
        </div>
      </div>
    </div>

    ${recentParticipants.length > 0 && recentParticipants[0].values.length > 0 ? `
    <!-- Recent Participants -->
    <div class="bg-white border border-apple-gray-200 rounded-2xl p-6 mb-6">
      <h2 class="text-xl font-semibold mb-5">10 derniers participants</h2>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-apple-gray-200">
              <th class="text-left text-xs uppercase tracking-wider text-apple-gray-400 pb-3 px-2 font-medium">ID</th>
              <th class="text-left text-xs uppercase tracking-wider text-apple-gray-400 pb-3 px-2 font-medium">Condition</th>
              <th class="text-left text-xs uppercase tracking-wider text-apple-gray-400 pb-3 px-2 font-medium">Profil</th>
              <th class="text-left text-xs uppercase tracking-wider text-apple-gray-400 pb-3 px-2 font-medium">RT Musique</th>
              <th class="text-left text-xs uppercase tracking-wider text-apple-gray-400 pb-3 px-2 font-medium">RT Silence</th>
              <th class="text-left text-xs uppercase tracking-wider text-apple-gray-400 pb-3 px-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            ${recentParticipants[0].values.map(row => `
              <tr class="border-b border-apple-gray-100">
                <td class="py-3 px-2"><code class="text-sm font-mono text-apple-gray-600">${row[0].substring(0, 8)}...</code></td>
                <td class="py-3 px-2"><span class="inline-block px-2 py-1 rounded-md text-xs font-medium ${row[1] === 'C1' ? 'bg-apple-gray-100' : 'bg-apple-gray-200'} text-apple-gray-900">${row[1]}</span></td>
                <td class="py-3 px-2"><span class="inline-block px-2 py-1 rounded-md text-xs font-medium ${row[2] ? 'bg-apple-gray-300 text-apple-gray-900' : 'bg-apple-gray-100 text-apple-gray-700'}">${row[2] ? 'Habitué' : 'Non-habitué'}</span></td>
                <td class="py-3 px-2 text-sm text-apple-gray-900">${row[3] ? Math.round(row[3]) + 'ms' : '-'}</td>
                <td class="py-3 px-2 text-sm text-apple-gray-900">${row[4] ? Math.round(row[4]) + 'ms' : '-'}</td>
                <td class="py-3 px-2 text-sm text-apple-gray-500">${new Date(row[5]).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
    ` : ''}

    <!-- Actions -->
    <div class="flex flex-wrap gap-3">
      <a href="/api/export" class="px-6 py-3 rounded-xl bg-apple-gray-900 text-white font-medium hover:bg-apple-gray-700 transition-colors duration-200 inline-block">Exporter CSV</a>
      <a href="/api/stats" class="px-6 py-3 rounded-xl bg-apple-gray-100 text-apple-gray-900 border border-apple-gray-200 font-medium hover:bg-apple-gray-200 transition-colors duration-200 inline-block">Statistiques JSON</a>
      <button onclick="location.reload()" class="px-6 py-3 rounded-xl bg-apple-gray-100 text-apple-gray-900 border border-apple-gray-200 font-medium hover:bg-apple-gray-200 transition-colors duration-200">Actualiser</button>
      <button onclick="if(confirm('Supprimer TOUS les participants ? Un backup sera créé.')) fetch('/api/cleanup', {method:'POST'}).then(r=>r.json()).then(()=>location.reload())" class="px-6 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors duration-200">Nettoyer</button>
    </div>
  </div>
</body>
</html>
    `;

    res.send(html);

  } catch (error) {
    console.error('❌ Erreur dashboard:', error);
    res.status(500).send('Erreur serveur');
  }
});

// Démarrer le serveur
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur backend PVT sur le port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/`);
  });
}).catch(err => {
  console.error('❌ Erreur initialisation DB:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du serveur...');
  saveDatabase();
  process.exit(0);
});
