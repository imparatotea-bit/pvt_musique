const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Base de données SQLite
const db = new Database(path.join(__dirname, 'participants.db'));

// Initialiser la base de données
db.exec(`
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

  CREATE TABLE IF NOT EXISTS counters (
    groupe TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0
  );
`);

// Initialiser les compteurs si vide
const initCounters = db.prepare(`
  INSERT OR IGNORE INTO counters (groupe, count) VALUES (?, 0)
`);

['habitue_C1', 'habitue_C2', 'non_habitue_C1', 'non_habitue_C2'].forEach(groupe => {
  initCounters.run(groupe);
});

// ============================================
// FONCTION PRINCIPALE : ASSIGNER UNE CONDITION
// ============================================
function assignCondition(estHabitue) {
  // Récupérer les compteurs actuels
  const getCount = db.prepare('SELECT count FROM counters WHERE groupe = ?');

  const prefix = estHabitue ? 'habitue' : 'non_habitue';
  const countC1 = getCount.get(`${prefix}_C1`).count;
  const countC2 = getCount.get(`${prefix}_C2`).count;

  console.log(`📊 Compteurs actuels pour ${prefix}: C1=${countC1}, C2=${countC2}`);

  // Déterminer quelle condition assigner (équilibrage)
  let assignC1;

  if (countC1 < countC2) {
    assignC1 = true; // Assigner à C1 (moins remplie)
  } else if (countC2 < countC1) {
    assignC1 = false; // Assigner à C2 (moins remplie)
  } else {
    // Égalité → randomiser
    assignC1 = Math.random() < 0.5;
  }

  // Construire l'assignation
  let groupeExperimental, condition, musiqueBloc1, musiqueBloc2;

  if (estHabitue) {
    if (assignC1) {
      // Habitué → C1 (Musique puis Silence)
      groupeExperimental = 1;
      condition = 'musique_puis_silence';
      musiqueBloc1 = 1;
      musiqueBloc2 = 0;
    } else {
      // Habitué → C2 (Silence puis Musique)
      groupeExperimental = 2;
      condition = 'silence_puis_musique';
      musiqueBloc1 = 0;
      musiqueBloc2 = 1;
    }
  } else {
    if (assignC1) {
      // Non-habitué → C1 (Musique puis Silence)
      groupeExperimental = 3;
      condition = 'musique_puis_silence';
      musiqueBloc1 = 1;
      musiqueBloc2 = 0;
    } else {
      // Non-habitué → C2 (Silence puis Musique)
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

// GET /api/assign
// Assigner une condition au participant
app.post('/api/assign', (req, res) => {
  try {
    const { participant_id, habitude_score } = req.body;

    if (!participant_id || habitude_score === undefined) {
      return res.status(400).json({
        error: 'Paramètres manquants: participant_id et habitude_score requis'
      });
    }

    // Vérifier si déjà assigné
    const existing = db.prepare('SELECT * FROM assignments WHERE participant_id = ?').get(participant_id);

    if (existing) {
      console.log(`♻️  Participant ${participant_id} déjà assigné (groupe ${existing.groupe_experimental})`);
      return res.json({
        groupe_experimental: existing.groupe_experimental,
        condition_ordre: existing.condition_ordre,
        musique_bloc1: existing.musique_bloc1 === 1,
        musique_bloc2: existing.musique_bloc2 === 1,
        groupe_habitude: existing.groupe_habitude,
        already_assigned: true
      });
    }

    // Déterminer habitude (seuil à 5)
    const estHabitue = parseInt(habitude_score) >= 5;

    // Assigner la condition
    const assignment = assignCondition(estHabitue);

    // Enregistrer dans la base de données
    const insert = db.prepare(`
      INSERT INTO assignments
      (participant_id, groupe_habitude, groupe_experimental, condition_ordre, musique_bloc1, musique_bloc2)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      participant_id,
      assignment.groupeHabitude,
      assignment.groupeExperimental,
      assignment.condition,
      assignment.musiqueBloc1,
      assignment.musiqueBloc2
    );

    // Incrémenter le compteur
    const updateCounter = db.prepare(`
      UPDATE counters SET count = count + 1 WHERE groupe = ?
    `);
    updateCounter.run(`${assignment.groupeHabitude}_${assignment.assignedGroup}`);

    console.log(`✅ Assignation: Participant ${participant_id} → Groupe ${assignment.groupeExperimental} (${assignment.condition})`);

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
// Marquer un participant comme ayant terminé
app.post('/api/complete', (req, res) => {
  try {
    const { participant_id } = req.body;

    if (!participant_id) {
      return res.status(400).json({ error: 'participant_id requis' });
    }

    const update = db.prepare('UPDATE assignments SET completed = 1 WHERE participant_id = ?');
    const result = update.run(participant_id);

    if (result.changes > 0) {
      console.log(`✅ Participant ${participant_id} marqué comme terminé`);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Participant non trouvé' });
    }

  } catch (error) {
    console.error('❌ Erreur completion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/stats
// Statistiques de distribution
app.get('/api/stats', (req, res) => {
  try {
    const counters = db.prepare('SELECT * FROM counters ORDER BY groupe').all();
    const total = db.prepare('SELECT COUNT(*) as count FROM assignments').get();
    const completed = db.prepare('SELECT COUNT(*) as count FROM assignments WHERE completed = 1').get();

    const stats = {
      total: total.count,
      completed: completed.count,
      distribution: {}
    };

    counters.forEach(row => {
      stats.distribution[row.groupe] = row.count;
    });

    res.json(stats);

  } catch (error) {
    console.error('❌ Erreur stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/export
// Exporter toutes les assignations (CSV)
app.get('/api/export', (req, res) => {
  try {
    const assignments = db.prepare('SELECT * FROM assignments ORDER BY assigned_at').all();

    // Générer CSV
    const headers = Object.keys(assignments[0] || {}).join(',');
    const rows = assignments.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=assignments.csv');
    res.send(csv);

  } catch (error) {
    console.error('❌ Erreur export:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /
// Page d'accueil avec stats
app.get('/', (req, res) => {
  const counters = db.prepare('SELECT * FROM counters ORDER BY groupe').all();
  const total = db.prepare('SELECT COUNT(*) as count FROM assignments').get();
  const completed = db.prepare('SELECT COUNT(*) as count FROM assignments WHERE completed = 1').get();

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Backend PVT - Statistiques</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
    h1 { color: #333; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border: 1px solid #ddd; }
    th { background: #4CAF50; color: white; }
    .total { font-size: 24px; font-weight: bold; color: #4CAF50; }
    .btn { background: #008CBA; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 5px; }
  </style>
</head>
<body>
  <h1>🎯 Backend PVT - Statistiques en temps réel</h1>

  <div style="background: #f0f0f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
    <p>Total participants assignés : <span class="total">${total.count}</span></p>
    <p>Participants ayant terminé : <span class="total">${completed.count}</span></p>
    <p>En cours : <span class="total">${total.count - completed.count}</span></p>
  </div>

  <h2>Distribution par groupe</h2>
  <table>
    <tr>
      <th>Groupe</th>
      <th>Nombre de participants</th>
    </tr>
    ${counters.map(row => `
      <tr>
        <td>${row.groupe.replace('_', ' → ')}</td>
        <td>${row.count}</td>
      </tr>
    `).join('')}
  </table>

  <a href="/api/export" class="btn">📥 Exporter les assignations (CSV)</a>
  <a href="/api/stats" class="btn">📊 JSON Stats</a>

  <p style="margin-top: 40px; color: #666;">
    <strong>Endpoints API :</strong><br>
    POST /api/assign - Assigner une condition<br>
    POST /api/complete - Marquer comme terminé<br>
    GET /api/stats - Obtenir les statistiques<br>
    GET /api/export - Exporter CSV
  </p>
</body>
</html>
  `;

  res.send(html);
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend PVT démarré sur le port ${PORT}`);
  console.log(`📊 Statistiques: http://localhost:${PORT}/`);
  console.log(`🔌 API: http://localhost:${PORT}/api/assign`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du serveur...');
  db.close();
  process.exit(0);
});
