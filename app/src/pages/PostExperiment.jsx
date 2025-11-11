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
      <div className="card">
        <h1 className="text-4xl font-bold gradient-text mb-8 text-center">
          Questionnaire final
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Comment avez-vous trouvé la difficulté des tâches ?
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-notion-purple focus:outline-none transition-colors text-lg"
            >
              <option value="">-- Choisir --</option>
              <option value="very_easy">Très facile</option>
              <option value="easy">Facile</option>
              <option value="moderate">Modéré</option>
              <option value="difficult">Difficile</option>
              <option value="very_difficult">Très difficile</option>
            </select>
          </div>

          {condition === 'music' && (
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Selon vous, la musique a-t-elle influencé vos performances ?
              </label>
              <select
                name="musicImpact"
                value={formData.musicImpact}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-notion-purple focus:outline-none transition-colors text-lg"
              >
                <option value="">-- Choisir --</option>
                <option value="positive">Oui, positivement</option>
                <option value="negative">Oui, négativement</option>
                <option value="no_impact">Non, aucun impact</option>
                <option value="unsure">Je ne sais pas</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Commentaires ou observations (optionnel)
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-notion-purple focus:outline-none transition-colors text-lg resize-none"
              placeholder="Partagez vos impressions sur l'expérience..."
            />
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={!isValid}
              className={`btn-primary text-xl ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Terminer l'expérience
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
