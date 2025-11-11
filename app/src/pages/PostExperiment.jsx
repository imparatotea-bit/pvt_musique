import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperiment } from '../contexts/ExperimentContext';
import { useAudio } from '../contexts/AudioContext';
import Layout from '../components/Layout';

export default function PostExperiment() {
  const navigate = useNavigate();
  const { updateData, condition } = useExperiment();
  const { stop } = useAudio();
  const [formData, setFormData] = useState({
    difficulty: '',
    musicImpact: '',
    comments: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateData('postExperiment', formData);

    // Stop music
    stop();

    navigate('/thank-you');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isValid = formData.difficulty && (condition === 'no_music' || formData.musicImpact);

  return (
    <Layout>
      <div className="card max-w-2xl mx-auto animate-fade-in">
        <h1 className="text-4xl font-semibold text-apple-gray-900 mb-10 text-center tracking-tight">
          Questionnaire final
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="label-apple">
              Comment avez-vous trouvé la difficulté des tâches ?
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
              className="select-apple"
            >
              <option value="">Sélectionnez...</option>
              <option value="very_easy">Très facile</option>
              <option value="easy">Facile</option>
              <option value="moderate">Modéré</option>
              <option value="difficult">Difficile</option>
              <option value="very_difficult">Très difficile</option>
            </select>
          </div>

          {condition === 'music' && (
            <div>
              <label className="label-apple">
                Selon vous, la musique a-t-elle influencé vos performances ?
              </label>
              <select
                name="musicImpact"
                value={formData.musicImpact}
                onChange={handleChange}
                required
                className="select-apple"
              >
                <option value="">Sélectionnez...</option>
                <option value="positive">Oui, positivement</option>
                <option value="negative">Oui, négativement</option>
                <option value="no_impact">Non, aucun impact</option>
                <option value="unsure">Je ne sais pas</option>
              </select>
            </div>
          )}

          <div>
            <label className="label-apple">
              Commentaires ou observations (optionnel)
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows={4}
              className="input-apple resize-none"
              placeholder="Partagez vos impressions sur l'expérience..."
            />
          </div>

          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              disabled={!isValid}
              className={`btn-primary btn-large ${!isValid ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Terminer l'expérience
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
