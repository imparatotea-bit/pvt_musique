import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperiment } from '../contexts/ExperimentContext';
import Layout from '../components/Layout';
import Slider from '../components/Slider';

export default function MusicHabits() {
  const navigate = useNavigate();
  const { updateData } = useExperiment();
  const [musicHabit, setMusicHabit] = useState(5);
  const [concentration, setConcentration] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateData('musicHabits', {
      musicHabit,
      concentration,
    });
    navigate('/fatigue-stress');
  };

  return (
    <Layout>
      <div className="card max-w-2xl mx-auto animate-fade-in">
        <h1 className="text-4xl font-semibold text-apple-gray-900 mb-10 text-center tracking-tight">
          Habitudes musicales
        </h1>

        <form onSubmit={handleSubmit} className="space-y-12">
          <Slider
            label="À quelle fréquence écoutez-vous de la musique en travaillant ou en étudiant ?"
            min={0}
            max={10}
            defaultValue={5}
            onChange={setMusicHabit}
          />

          <div className="flex justify-between text-sm text-apple-gray-500 -mt-8">
            <span>Jamais</span>
            <span>Très souvent</span>
          </div>

          <Slider
            label="Comment évaluez-vous votre capacité de concentration habituelle ?"
            min={0}
            max={10}
            defaultValue={5}
            onChange={setConcentration}
          />

          <div className="flex justify-between text-sm text-apple-gray-500 -mt-8">
            <span>Très faible</span>
            <span>Excellente</span>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="btn-primary btn-large text-xl"
            >
              Continuer
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
