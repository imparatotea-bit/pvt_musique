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

// Variables globales pour la base de données
let db = null;
const DB_PATH = path.join(__dirname, 'participants.db');

// Initialiser SQL.js et la base de données
async function initDatabase() {
  const SQL = await initSqlJs();

  // Charger la DB existante ou créer une nouvelle
  let buffer = null;
  if (fs.existsSync(DB_PATH)) {
    buffer = fs.readFileSync(DB_PATH);
  }

  db = new SQL.Database(buffer);

  // Créer les tables si elles n'existent pas
  db.run(`
    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_id TEXT UNIQUE NOT NULL,
      groupe_habitude TEXT NOT NULL,
      groupe_experimental INTEGER NOT NULL,
      condition_ordre TEXT NOT NULL,
      musique_bloc1 INTEGER NOT NULL,
      musique_bloc2 INTEGER NOT NULL,
      assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed INTEGER DEFAULT 0
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS counters (
      groupe TEXT PRIMARY KEY,
      count INTEGER DEFAULT 0
    );
  `);

  // Initialiser les compteurs
  const counters = ['habitue_C1', 'habitue_C2', 'non_habitue_C1', 'non_habitue_C2'];
  counters.forEach(groupe => {
    db.run('INSERT OR IGNORE INTO counters (groupe, count) VALUES (?, 0)', [groupe]);
  });

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
// FONCTION PRINCIPALE : ASSIGNER UNE CONDITION
// ============================================
function assignCondition(estHabitue) {
  const prefix = estHabitue ? 'habitue' : 'non_habitue';

  const result = db.exec(`SELECT count FROM counters WHERE groupe IN ('${prefix}_C1', '${prefix}_C2')`);
  const counts = result[0]?.values || [];

  const countC1 = counts[0]?.[0] || 0;
  const countC2 = counts[1]?.[0] || 0;

  console.log(`📊 Compteurs actuels pour ${prefix}: C1=${countC1}, C2=${countC2}`);

  // Déterminer quelle condition assigner
  let assignC1;
  if (countC1 < countC2) {
    assignC1 = true;
  } else if (countC2 < countC1) {
    assignC1 = false;
  } else {
    assignC1 = Math.random() < 0.5;
  }

  // Construire l'assignation
  let groupeExperimental, condition, musiqueBloc1, musiqueBloc2;

  if (estHabitue) {
    if (assignC1) {
      groupeExperimental = 1;
      condition = 'musique_puis_silence';
      musiqueBloc1 = 1;
      musiqueBloc2 = 0;
    } else {
      groupeExperimental = 2;
      condition = 'silence_puis_musique';
      musiqueBloc1 = 0;
      musiqueBloc2 = 1;
    }
  } else {
    if (assignC1) {
      groupeExperimental = 3;
      condition = 'musique_puis_silence';
      musiqueBloc1 = 1;
      musiqueBloc2 = 0;
    } else {
      groupeExperimental = 4;
      condition = 'silence_puis_musique';
      musiqueBloc1 = 0;
      musiqueBloc2 = 1;
    }
  }

  return {
    groupeExperimental,
    condition,
    musiqueBloc1,
    musiqueBloc2,
    groupeHabitude: estHabitue ? 'habitue' : 'non_habitue',
    assignedGroup: assignC1 ? 'C1' : 'C2'
  };
}

// ============================================
// ROUTES API
// ============================================

// POST /api/assign
app.post('/api/assign', (req, res) => {
  try {
    const { participant_id, habitude_score } = req.body;

    if (!participant_id || habitude_score === undefined) {
      return res.status(400).json({
        error: 'Paramètres manquants: participant_id et habitude_score requis'
      });
    }

    // Vérifier si déjà assigné
    const existing = db.exec('SELECT * FROM assignments WHERE participant_id = ?', [participant_id]);

    if (existing.length > 0 && existing[0].values.length > 0) {
      const row = existing[0].values[0];
      console.log(`♻️  Participant ${participant_id} déjà assigné`);
      return res.json({
        groupe_experimental: row[3],
        condition_ordre: row[4],
        musique_bloc1: row[5] === 1,
        musique_bloc2: row[6] === 1,
        groupe_habitude: row[2],
        already_assigned: true
      });
    }

    // Déterminer habitude
    const estHabitue = parseInt(habitude_score) >= 5;
    const assignment = assignCondition(estHabitue);

    // Insérer dans la base
    db.run(`
      INSERT INTO assignments
      (participant_id, groupe_habitude, groupe_experimental, condition_ordre, musique_bloc1, musique_bloc2)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      participant_id,
      assignment.groupeHabitude,
      assignment.groupeExperimental,
      assignment.condition,
      assignment.musiqueBloc1,
      assignment.musiqueBloc2
    ]);

    // Incrémenter le compteur
    db.run('UPDATE counters SET count = count + 1 WHERE groupe = ?',
      [`${assignment.groupeHabitude}_${assignment.assignedGroup}`]);

    saveDatabase();

    console.log(`✅ Assignation: ${participant_id} → Groupe ${assignment.groupeExperimental}`);

    res.json({
      groupe_experimental: assignment.groupeExperimental,
      condition_ordre: assignment.condition,
      musique_bloc1: assignment.musiqueBloc1 === 1,
      musique_bloc2: assignment.musiqueBloc2 === 1,
      groupe_habitude: assignment.groupeHabitude,
      already_assigned: false
    });

  } catch (error) {
    console.error('❌ Erreur assignation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/complete
app.post('/api/complete', (req, res) => {
  try {
    const { participant_id } = req.body;

    if (!participant_id) {
      return res.status(400).json({ error: 'participant_id requis' });
    }

    db.run('UPDATE assignments SET completed = 1 WHERE participant_id = ?', [participant_id]);
    saveDatabase();

    console.log(`✅ Participant ${participant_id} marqué comme terminé`);
    res.json({ success: true });

  } catch (error) {
    console.error('❌ Erreur completion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/stats
app.get('/api/stats', (req, res) => {
  try {
    const countersResult = db.exec('SELECT * FROM counters ORDER BY groupe');
    const totalResult = db.exec('SELECT COUNT(*) as count FROM assignments');
    const completedResult = db.exec('SELECT COUNT(*) as count FROM assignments WHERE completed = 1');

    const counters = countersResult[0]?.values || [];
    const total = totalResult[0]?.values[0]?.[0] || 0;
    const completed = completedResult[0]?.values[0]?.[0] || 0;

    const stats = {
      total,
      completed,
      distribution: {}
    };

    counters.forEach(row => {
      stats.distribution[row[0]] = row[1];
    });

    res.json(stats);

  } catch (error) {
    console.error('❌ Erreur stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/export
app.get('/api/export', (req, res) => {
  try {
    const result = db.exec('SELECT * FROM assignments ORDER BY assigned_at');

    if (result.length === 0) {
      return res.send('id,participant_id,groupe_habitude,groupe_experimental,condition_ordre,musique_bloc1,musique_bloc2,assigned_at,completed\n');
    }

    const headers = ['id', 'participant_id', 'groupe_habitude', 'groupe_experimental', 'condition_ordre', 'musique_bloc1', 'musique_bloc2', 'assigned_at', 'completed'];
    const rows = result[0].values.map(row => row.join(','));
    const csv = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=assignments.csv');
    res.send(csv);

  } catch (error) {
    console.error('❌ Erreur export:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /
app.get('/', (req, res) => {
  try {
    const countersResult = db.exec('SELECT * FROM counters ORDER BY groupe');
    const totalResult = db.exec('SELECT COUNT(*) as count FROM assignments');
    const completedResult = db.exec('SELECT COUNT(*) as count FROM assignments WHERE completed = 1');

    const counters = countersResult[0]?.values || [];
    const total = totalResult[0]?.values[0]?.[0] || 0;
    const completed = completedResult[0]?.values[0]?.[0] || 0;

    let html = `
<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <title>Backend PVT - Dashboard</title>
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-8">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold text-gray-800 mb-2">🎯 Backend PVT</h1>
          <p class="text-gray-600">Équilibrage automatique des conditions expérimentales</p>
        </div>
        <div class="text-right">
          <div class="text-5xl font-bold text-indigo-600">${total}</div>
          <div class="text-sm text-gray-600 uppercase tracking-wide">Participants</div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Total -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600 text-2xl mr-4">
            👥
          </div>
          <div>
            <div class="text-3xl font-bold text-gray-800">${total}</div>
            <div class="text-sm text-gray-600">Total assignés</div>
          </div>
        </div>
      </div>

      <!-- Completed -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600 text-2xl mr-4">
            ✅
          </div>
          <div>
            <div class="text-3xl font-bold text-gray-800">${completed}</div>
            <div class="text-sm text-gray-600">Terminés</div>
          </div>
        </div>
      </div>

      <!-- In Progress -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 text-2xl mr-4">
            ⏳
          </div>
          <div>
            <div class="text-3xl font-bold text-gray-800">${total - completed}</div>
            <div class="text-sm text-gray-600">En cours</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Distribution Table -->
    <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">📊 Distribution par groupe</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${counters.map(row => {
          const [groupe, count] = row;
          const isHabitue = groupe.startsWith('habitue');
          const isC1 = groupe.endsWith('C1');
          const bgColor = isHabitue ? 'bg-indigo-50' : 'bg-purple-50';
          const textColor = isHabitue ? 'text-indigo-600' : 'text-purple-600';
          const icon = isHabitue ? '🎵' : '🔇';
          const condition = isC1 ? 'M→S' : 'S→M';

          return `
          <div class="${bgColor} rounded-xl p-6 border-2 ${isHabitue ? 'border-indigo-200' : 'border-purple-200'}">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold ${textColor} uppercase tracking-wide mb-1">
                  ${groupe.replace('_', ' → ')}
                </div>
                <div class="text-gray-600 text-sm">${icon} ${condition}</div>
              </div>
              <div class="text-4xl font-bold ${textColor}">${count}</div>
            </div>
            <div class="mt-4 bg-white rounded-lg h-2 overflow-hidden">
              <div class="h-full ${isHabitue ? 'bg-indigo-500' : 'bg-purple-500'}"
                   style="width: ${total > 0 ? (count / total * 100) : 0}%"></div>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-4">
      <a href="/api/export"
         class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition duration-200 text-center">
        📥 Exporter CSV
      </a>
      <a href="/api/stats"
         class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition duration-200 text-center">
        📊 JSON Stats
      </a>
      <button onclick="location.reload()"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition duration-200">
        🔄 Actualiser
      </button>
    </div>

    <!-- API Info -->
    <div class="mt-8 bg-gray-800 rounded-xl p-6 text-white">
      <h3 class="font-bold text-lg mb-3">🔌 Endpoints API</h3>
      <div class="space-y-2 font-mono text-sm">
        <div><span class="text-green-400">POST</span> /api/assign - Assigner une condition</div>
        <div><span class="text-blue-400">POST</span> /api/complete - Marquer comme terminé</div>
        <div><span class="text-yellow-400">GET</span> /api/stats - Statistiques JSON</div>
        <div><span class="text-purple-400">GET</span> /api/export - Export CSV</div>
      </div>
    </div>
  </div>

  <script>
    // Auto-refresh toutes les 30 secondes
    setTimeout(() => location.reload(), 30000);
  </script>
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
    console.log(`🚀 Serveur backend PVT démarré sur le port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/`);
    console.log(`🔌 API: http://localhost:${PORT}/api/assign`);
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
