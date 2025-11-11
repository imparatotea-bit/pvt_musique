import { useEffect, useState } from 'react';
import { useExperiment } from '../contexts/ExperimentContext';
import Layout from '../components/Layout';

export default function ThankYou() {
  const { participantId, exportData } = useExperiment();
  const [exportStatus, setExportStatus] = useState('pending'); // pending, success, error
  const [completionCode, setCompletionCode] = useState('');

  useEffect(() => {
    // Generate completion code
    const code = `PVT-${participantId || Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setCompletionCode(code);

    // Export data
    exportData()
      .then(() => {
        setExportStatus('success');
      })
      .catch(err => {
        console.error('Export failed:', err);
        setExportStatus('error');
      });
  }, [participantId, exportData]);

  const handleDownloadBackup = () => {
    // Trigger CSV download as backup
    exportData();
  };

  return (
    <Layout>
      <div className="card text-center space-y-8">
        <div className="text-8xl mb-4">
          🎉
        </div>

        <h1 className="text-5xl font-bold gradient-text">
          Merci d'avoir participé !
        </h1>

        <div className="space-y-4 text-lg text-gray-700">
          <p>
            Votre contribution est précieuse pour notre recherche.
          </p>
          <p>
            Vos données ont été enregistrées avec succès.
          </p>
        </div>

        <div className="bg-notion-purple-bg p-8 rounded-2xl border-2 border-notion-purple-light">
          <p className="text-sm text-gray-600 mb-2">
            Votre code de complétion :
          </p>
          <p className="text-3xl font-bold text-notion-purple font-mono tracking-wider">
            {completionCode}
          </p>
          <p className="text-sm text-gray-600 mt-4">
            Notez ce code pour validation
          </p>
        </div>

        {exportStatus === 'success' && (
          <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
            <p className="text-green-700 font-medium">
              ✓ Données enregistrées avec succès
            </p>
          </div>
        )}

        {exportStatus === 'error' && (
          <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-200 space-y-3">
            <p className="text-orange-700 font-medium">
              ⚠️ Erreur lors de l'envoi au serveur
            </p>
            <button
              onClick={handleDownloadBackup}
              className="btn-secondary"
            >
              Télécharger une copie de sauvegarde
            </button>
          </div>
        )}

        <div className="pt-8 text-gray-500 text-sm">
          <p>Vous pouvez maintenant fermer cette fenêtre.</p>
        </div>
      </div>
    </Layout>
  );
}
