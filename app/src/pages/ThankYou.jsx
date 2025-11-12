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

    // Export data to server only
    exportData()
      .then(() => {
        setExportStatus('success');
      })
      .catch(err => {
        console.error('Export failed:', err);
        setExportStatus('error');
      });
  }, [participantId, exportData]);

  return (
    <Layout>
      <div className="card max-w-2xl mx-auto text-center space-y-10 animate-fade-in">
        <h1 className="text-4xl font-semibold text-apple-gray-900">
          Merci d'avoir participé !
        </h1>

        <div className="space-y-3 text-lg text-apple-gray-600">
          <p>
            Votre contribution est précieuse pour notre recherche.
          </p>
          <p>
            Vos données ont été enregistrées sur le serveur.
          </p>
        </div>

        <div className="bg-apple-gray-100 p-10 rounded-3xl border border-apple-gray-200">
          <p className="text-sm text-apple-gray-500 mb-3 font-medium uppercase tracking-wide">
            Votre code de complétion
          </p>
          <p className="text-4xl font-mono font-semibold text-apple-gray-900 tracking-wider">
            {completionCode}
          </p>
          <p className="text-sm text-apple-gray-500 mt-4">
            Notez ce code pour validation
          </p>
        </div>

        {exportStatus === 'pending' && (
          <div className="bg-apple-gray-100 p-5 rounded-2xl">
            <p className="text-apple-gray-600 font-medium">
              Envoi des données en cours...
            </p>
          </div>
        )}

        {exportStatus === 'success' && (
          <div className="bg-apple-gray-100 p-5 rounded-2xl border border-apple-gray-200">
            <p className="text-apple-gray-900 font-medium">
              Données enregistrées avec succès
            </p>
          </div>
        )}

        {exportStatus === 'error' && (
          <div className="bg-apple-gray-100 p-5 rounded-2xl border border-apple-gray-200">
            <p className="text-apple-gray-600 font-medium">
              Erreur lors de l'envoi au serveur
            </p>
            <p className="text-sm text-apple-gray-600 mt-2">
              Veuillez contacter l'expérimentateur avec votre code de complétion.
            </p>
          </div>
        )}

        <div className="pt-8 text-apple-gray-400 text-sm">
          <p>Vous pouvez maintenant fermer cette fenêtre.</p>
        </div>
      </div>
    </Layout>
  );
}
