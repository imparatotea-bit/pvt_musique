import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperiment } from '../contexts/ExperimentContext';
import Layout from '../components/Layout';

export default function Demographics() {
  const navigate = useNavigate();
  const { updateData } = useExperiment();
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateData('demographics', formData);
    navigate('/music-habits');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isValid = formData.age && formData.gender;

  return (
    <Layout>
      <div className="card">
        <h1 className="text-4xl font-bold gradient-text mb-8 text-center">
          Informations démographiques
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Âge
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="18"
              max="100"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-notion-purple focus:outline-none transition-colors text-lg"
              placeholder="Votre âge"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Genre
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-notion-purple focus:outline-none transition-colors text-lg"
            >
              <option value="">-- Choisir --</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="other">Autre</option>
              <option value="prefer_not_to_say">Préfère ne pas répondre</option>
            </select>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={!isValid}
              className={`btn-primary text-xl ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Continuer
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
