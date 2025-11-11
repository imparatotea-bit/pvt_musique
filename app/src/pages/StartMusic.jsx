import { useNavigate } from 'react-router-dom';
import { useAudio } from '../contexts/AudioContext';
import { useExperiment } from '../contexts/ExperimentContext';
import Layout from '../components/Layout';
import { useState } from 'react';

export default function StartMusic() {
  const navigate = useNavigate();
  const { condition } = useExperiment();
  const { loadTrack, play } = useAudio();
  const [musicStarted, setMusicStarted] = useState(false);

  const handleStartMusic = () => {
    if (condition === 'music') {
      // Load and play music
      loadTrack('/audio/background-music.mp3');
      play();
    }
    setMusicStarted(true);

    // Wait a moment then proceed
    setTimeout(() => {
      navigate('/demographics');
    }, 1000);
  };

  return (
    <Layout>
      <div className="card text-center space-y-8">
        <h1 className="text-5xl font-bold gradient-text mb-4">
          {condition === 'music' ? 'Démarrage de la musique' : 'Configuration audio'}
        </h1>

        <div className="space-y-4 text-lg text-gray-700">
          {condition === 'music' ? (
            <>
              <p>
                Une musique de fond va être lancée.
              </p>
              <p>
                Veuillez ajuster le volume de vos écouteurs à un niveau confortable.
              </p>
              <p>
                La musique continuera pendant toute l'expérience.
              </p>
            </>
          ) : (
            <>
              <p>
                Cette expérience se déroulera en silence.
              </p>
              <p>
                Assurez-vous d'être dans un environnement calme.
              </p>
            </>
          )}
        </div>

        <div className="pt-8">
          <button
            onClick={handleStartMusic}
            disabled={musicStarted}
            className="btn-primary text-xl"
          >
            {musicStarted ? 'Démarrage...' : 'Continuer'}
          </button>
        </div>
      </div>
    </Layout>
  );
}
