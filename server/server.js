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
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
      background: #fafafa;
      color: #1c1c1e;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .header {
      margin-bottom: 40px;
    }

    .header h1 {
      font-size: 32px;
      font-weight: 600;
      color: #1c1c1e;
      margin-bottom: 8px;
    }

    .header p {
      color: #86868b;
      font-size: 15px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border: 1px solid #e8e8ed;
      border-radius: 16px;
      padding: 24px;
      transition: box-shadow 0.2s;
    }

    .stat-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .stat-label {
      font-size: 13px;
      color: #86868b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 40px;
      font-weight: 600;
      color: #1c1c1e;
    }

    .stat-secondary {
      font-size: 14px;
      color: #6e6e73;
      margin-top: 4px;
    }

    .section {
      background: white;
      border: 1px solid #e8e8ed;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .distribution {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .dist-item {
      padding: 16px;
      background: #f5f5f7;
      border-radius: 12px;
    }

    .dist-label {
      font-size: 13px;
      color: #6e6e73;
      margin-bottom: 4px;
    }

    .dist-value {
      font-size: 28px;
      font-weight: 600;
      color: #1c1c1e;
    }

    .actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
      display: inline-block;
    }

    .btn-primary {
      background: #1c1c1e;
      color: white;
    }

    .btn-primary:hover {
      background: #3a3a3c;
    }

    .btn-secondary {
      background: #f5f5f7;
      color: #1c1c1e;
      border: 1px solid #e8e8ed;
    }

    .btn-secondary:hover {
      background: #e8e8ed;
    }

    .btn-danger {
      background: #ff3b30;
      color: white;
    }

    .btn-danger:hover {
      background: #ff453a;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      font-size: 12px;
      color: #86868b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 12px 8px;
      border-bottom: 1px solid #e8e8ed;
      font-weight: 500;
    }

    td {
      padding: 12px 8px;
      border-bottom: 1px solid #f5f5f7;
      font-size: 14px;
      color: #1c1c1e;
    }

    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    }

    .badge-c1 {
      background: #f5f5f7;
      color: #1c1c1e;
    }

    .badge-c2 {
      background: #e8e8ed;
      color: #1c1c1e;
    }

    .badge-habitue {
      background: #d2d2d7;
      color: #1c1c1e;
    }
  </style>
  <title>Backend PVT</title>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Backend PVT</h1>
      <p>Participants ayant complété l'expérience</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total</div>
        <div class="stat-value">${stats}</div>
        <div class="stat-secondary">participants complétés</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Habitués</div>
        <div class="stat-value">${habitues}</div>
        <div class="stat-secondary">Non-habitués : ${nonHabitues}</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Conditions</div>
        <div class="stat-value">${c1} / ${c2}</div>
        <div class="stat-secondary">C1 / C2</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">RT Moyen</div>
        <div class="stat-value">${Math.round(avgRtMusic)}ms</div>
        <div class="stat-secondary">Avec musique</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">RT Moyen</div>
        <div class="stat-value">${Math.round(avgRtSilence)}ms</div>
        <div class="stat-secondary">Sans musique</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Distribution</div>
      <div class="distribution">
        <div class="dist-item">
          <div class="dist-label">Habitués C1</div>
          <div class="dist-value">${db.exec('SELECT COUNT(*) FROM participants WHERE is_habitue = 1 AND condition = "C1"')[0]?.values[0]?.[0] || 0}</div>
        </div>
        <div class="dist-item">
          <div class="dist-label">Habitués C2</div>
          <div class="dist-value">${db.exec('SELECT COUNT(*) FROM participants WHERE is_habitue = 1 AND condition = "C2"')[0]?.values[0]?.[0] || 0}</div>
        </div>
        <div class="dist-item">
          <div class="dist-label">Non-habitués C1</div>
          <div class="dist-value">${db.exec('SELECT COUNT(*) FROM participants WHERE is_habitue = 0 AND condition = "C1"')[0]?.values[0]?.[0] || 0}</div>
        </div>
        <div class="dist-item">
          <div class="dist-label">Non-habitués C2</div>
          <div class="dist-value">${db.exec('SELECT COUNT(*) FROM participants WHERE is_habitue = 0 AND condition = "C2"')[0]?.values[0]?.[0] || 0}</div>
        </div>
      </div>
    </div>

    ${recentParticipants.length > 0 && recentParticipants[0].values.length > 0 ? `
    <div class="section">
      <div class="section-title">10 derniers participants</div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Condition</th>
            <th>Profil</th>
            <th>RT Musique</th>
            <th>RT Silence</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${recentParticipants[0].values.map(row => `
            <tr>
              <td><code>${row[0].substring(0, 8)}...</code></td>
              <td><span class="badge badge-${row[1].toLowerCase()}">${row[1]}</span></td>
              <td><span class="badge ${row[2] ? 'badge-habitue' : ''}">${row[2] ? 'Habitué' : 'Non-habitué'}</span></td>
              <td>${row[3] ? Math.round(row[3]) + 'ms' : '-'}</td>
              <td>${row[4] ? Math.round(row[4]) + 'ms' : '-'}</td>
              <td>${new Date(row[5]).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    <div class="actions">
      <a href="/api/export" class="btn btn-primary">Exporter CSV</a>
      <a href="/api/stats" class="btn btn-secondary">Statistiques JSON</a>
      <button onclick="location.reload()" class="btn btn-secondary">Actualiser</button>
      <button onclick="if(confirm('Supprimer TOUS les participants ? Un backup sera créé.')) fetch('/api/cleanup', {method:'POST'}).then(r=>r.json()).then(()=>location.reload())" class="btn btn-danger">Nettoyer</button>
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
