import { useNavigate } from 'react-router-dom';
import { useAudio } from '../contexts/AudioContext';
import { useExperiment } from '../contexts/ExperimentContext';
import Layout from '../components/Layout';
import { useState, useRef } from 'react';

export default function StartMusic() {
  const navigate = useNavigate();
  const { condition } = useExperiment();
  const { loadTrack, play } = useAudio();
  const [musicStarted, setMusicStarted] = useState(false);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  // Fonction pour générer un son ambiant doux avec Web Audio API
  const playTestAudio = () => {
    try {
      // Créer un AudioContext
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContextClass();

      // Créer un oscillateur (ton continu doux)
      oscillatorRef.current = audioContextRef.current.createOscillator();
      gainNodeRef.current = audioContextRef.current.createGain();

      // Configuration : ton doux de 220 Hz (note La)
      oscillatorRef.current.type = 'sine'; // Onde sinusoïdale (son doux)
      oscillatorRef.current.frequency.value = 220; // 220 Hz

      // Volume très bas pour ne pas être dérangeant
      gainNodeRef.current.gain.value = 0.1;

      // Connecter oscillateur → gain → destination (haut-parleurs)
      oscillatorRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);

      // Démarrer l'oscillateur
      oscillatorRef.current.start();

      console.log('Audio de test genere (ton 220Hz)');
    } catch (err) {
      console.error('Erreur génération audio:', err);
    }
  };

  const handleStartMusic = () => {
    if (condition === 'music') {
      // Essayer de charger le fichier MP3
      loadTrack('/audio/background-music.mp3');
      play();

      // Si le fichier n'existe pas, générer un son de test
      setTimeout(() => {
        playTestAudio();
      }, 500);
    }
    setMusicStarted(true);

    // Wait a moment then proceed
    setTimeout(() => {
      navigate('/demographics');
    }, 1200);
  };

  return (
    <Layout>
      <div className="card max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
        <h1 className="text-4xl font-semibold text-apple-gray-900 mb-4">
          {condition === 'music' ? 'Démarrage de la musique' : 'Configuration'}
        </h1>

        <div className="space-y-4 text-base text-apple-gray-600 leading-relaxed">
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

        <div className="pt-6">
          <button
            onClick={handleStartMusic}
            disabled={musicStarted}
            className={`btn-primary btn-large ${musicStarted ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            {musicStarted ? 'Démarrage...' : 'Continuer'}
          </button>
        </div>
      </div>
    </Layout>
  );
}
