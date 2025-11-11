import { useNavigate } from 'react-router-dom';
import { useExperiment } from '../contexts/ExperimentContext';
import Layout from '../components/Layout';
import { useEffect } from 'react';

export default function Welcome() {
  const navigate = useNavigate();
  const { setParticipantId, setCondition } = useExperiment();

  useEffect(() => {
    // Get participant ID and condition from backend
    fetch('/api/assign-condition', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setParticipantId(data.participant_id);
        setCondition(data.condition);
      })
      .catch(err => {
        console.error('Failed to get condition:', err);
        // Fallback: assign random condition
        const fallbackCondition = Math.random() < 0.5 ? 'music' : 'no_music';
        setCondition(fallbackCondition);
        setParticipantId(Date.now().toString());
      });
  }, [setParticipantId, setCondition]);

  const handleStart = () => {
    navigate('/start-music');
  };

  return (
    <Layout>
      <div className="card max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
        <h1 className="text-6xl font-semibold text-apple-gray-900 mb-10 tracking-tight">
          Bienvenue
        </h1>

        <div className="space-y-4 text-lg text-apple-gray-700">
          <p>
            Merci de participer à cette étude sur l'attention et la musique.
          </p>
          <p>
            Cette expérience prendra environ <strong>15 minutes</strong>.
          </p>
          <p>
            Veuillez vous assurer d'être dans un environnement calme et de porter des écouteurs.
          </p>
        </div>

        <div className="pt-8">
          <button
            onClick={handleStart}
            className="btn-primary btn-large text-xl"
          >
            Commencer l'expérience
          </button>
        </div>
      </div>
    </Layout>
  );
}
