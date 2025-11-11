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
      <div className="card max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold text-apple-gray-900 mb-10 text-center tracking-tight">
          Informations démographiques
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="label-apple">
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
              className="input-apple"
              placeholder="Votre âge"
            />
          </div>

          <div>
            <label className="label-apple">
              Genre
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="select-apple"
            >
              <option value="">Sélectionnez...</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="other">Autre</option>
              <option value="prefer_not_to_say">Préfère ne pas répondre</option>
            </select>
          </div>

          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              disabled={!isValid}
              className={`btn-primary btn-large ${!isValid ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Continuer
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
