import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperiment } from '../contexts/ExperimentContext';
import { useAudio } from '../contexts/AudioContext';
import Layout from '../components/Layout';
import Slider from '../components/Slider';

export default function Questionnaire() {
  const navigate = useNavigate();
  const { updateData, setCondition, setParticipantId } = useExperiment();
  const { loadTrack, play } = useAudio();

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [musicHabit, setMusicHabit] = useState(5);
  const [fatigue, setFatigue] = useState(5);
  const [stress, setStress] = useState(5);
  const [musicStarted, setMusicStarted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine group: habitué (≥6) or non-habitué (<6)
    const isHabitue = musicHabit >= 6;

    // Assign condition randomly: C1 (music→silence) or C2 (silence→music)
    const assignedCondition = Math.random() < 0.5 ? 'C1' : 'C2';

    setCondition(assignedCondition);
    setParticipantId(`P${Date.now()}`);

    // Save questionnaire data
    updateData('questionnaire', {
      age: parseInt(age),
      gender,
      musicHabit,
      fatigue,
      stress,
      isHabitue,
      condition: assignedCondition,
      timestamp: new Date().toISOString(),
    });

    // Start music
    if (!musicStarted) {
      loadTrack('/static/musique.mp3');
      play();
      setMusicStarted(true);

      setTimeout(() => {
        navigate('/instructions-categorization');
      }, 1000);
    }
  };

  return (
    <Layout>
      <div className="card max-w-2xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-semibold text-apple-gray-900 mb-8 text-center">
          Questionnaire
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-apple-gray-700 mb-2">
              Âge
            </label>
            <input
              type="number"
              min="18"
              max="99"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2 border border-apple-gray-300 rounded-lg focus:ring-2 focus:ring-apple-gray-900 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-gray-700 mb-2">
              Genre
            </label>
            <select
              required
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 border border-apple-gray-300 rounded-lg focus:ring-2 focus:ring-apple-gray-900 focus:border-transparent"
            >
              <option value="">Sélectionner</option>
              <option value="F">Femme</option>
              <option value="H">Homme</option>
              <option value="A">Autre</option>
              <option value="N">Préfère ne pas répondre</option>
            </select>
          </div>

          <div>
            <Slider
              label="Avez-vous l'habitude de travailler/étudier en musique ?"
              min={0}
              max={10}
              defaultValue={5}
              onChange={setMusicHabit}
            />
            <div className="flex justify-between text-xs text-apple-gray-500 mt-2">
              <span>Jamais</span>
              <span>Toujours</span>
            </div>
          </div>

          <div>
            <Slider
              label="Niveau de fatigue"
              min={0}
              max={10}
              defaultValue={5}
              onChange={setFatigue}
            />
            <div className="flex justify-between text-xs text-apple-gray-500 mt-2">
              <span>Pas fatigué</span>
              <span>Très fatigué</span>
            </div>
          </div>

          <div>
            <Slider
              label="Niveau de stress"
              min={0}
              max={10}
              defaultValue={5}
              onChange={setStress}
            />
            <div className="flex justify-between text-xs text-apple-gray-500 mt-2">
              <span>Pas stressé</span>
              <span>Très stressé</span>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={musicStarted}
              className={`btn-primary btn-large ${musicStarted ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {musicStarted ? 'Démarrage...' : 'Commencer'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
