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
      <div className="card max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
        <h1 className="text-4xl font-semibold text-apple-gray-900">
          Merci
        </h1>

        <div className="space-y-3 text-lg text-apple-gray-600">
          <p>
            Vos données ont été enregistrées.
          </p>
        </div>

        <div className="bg-apple-gray-100 p-8 rounded-2xl">
          <p className="text-sm text-apple-gray-500 mb-2 uppercase tracking-wide">
            Code de complétion
          </p>
          <p className="text-3xl font-mono font-semibold text-apple-gray-900">
            {completionCode}
          </p>
        </div>

        {exportStatus === 'pending' && (
          <div className="bg-apple-gray-100 p-4 rounded-lg">
            <p className="text-apple-gray-600">Envoi...</p>
          </div>
        )}

        {exportStatus === 'success' && (
          <div className="bg-apple-gray-100 p-4 rounded-lg">
            <p className="text-apple-gray-900">Enregistré</p>
          </div>
        )}

        {exportStatus === 'error' && (
          <div className="bg-apple-gray-100 p-4 rounded-lg">
            <p className="text-apple-gray-600">Erreur - Contactez l'expérimentateur</p>
          </div>
        )}

        <p className="text-apple-gray-400 text-sm pt-4">
          Vous pouvez fermer cette fenêtre
        </p>
      </div>
    </Layout>
  );
}
