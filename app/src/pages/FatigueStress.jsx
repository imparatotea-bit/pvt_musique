import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperiment } from '../contexts/ExperimentContext';
import Layout from '../components/Layout';
import Slider from '../components/Slider';

export default function FatigueStress() {
  const navigate = useNavigate();
  const { updateData } = useExperiment();
  const [fatigue, setFatigue] = useState(5);
  const [stress, setStress] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateData('fatigueStress', {
      fatigue,
      stress,
    });
    navigate('/instructions-categorization');
  };

  return (
    <Layout>
      <div className="card max-w-2xl mx-auto animate-fade-in">
        <h1 className="text-4xl font-semibold text-apple-gray-900 mb-10 text-center tracking-tight">
          État actuel
        </h1>

        <form onSubmit={handleSubmit} className="space-y-12">
          <Slider
            label="Comment évaluez-vous votre niveau de fatigue actuel ?"
            min={0}
            max={10}
            defaultValue={5}
            onChange={setFatigue}
          />

          <div className="flex justify-between text-sm text-apple-gray-500 -mt-8">
            <span>Pas du tout fatigué(e)</span>
            <span>Extrêmement fatigué(e)</span>
          </div>

          <Slider
            label="Comment évaluez-vous votre niveau de stress actuel ?"
            min={0}
            max={10}
            defaultValue={5}
            onChange={setStress}
          />

          <div className="flex justify-between text-sm text-apple-gray-500 -mt-8">
            <span>Pas du tout stressé(e)</span>
            <span>Extrêmement stressé(e)</span>
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
