import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="card max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
        <h1 className="text-5xl font-semibold text-apple-gray-900 mb-8">
          Expérience
        </h1>

        <div className="space-y-4 text-lg text-apple-gray-700">
          <p>
            Étude sur l'attention et la musique
          </p>
          <p>
            Durée : <strong>~10 minutes</strong>
          </p>
          <p>
            Munissez-vous de casque ou d'écouteurs
          </p>
        </div>

        <button
          onClick={() => navigate('/questionnaire')}
          className="btn-primary btn-large mt-8"
        >
          Commencer
        </button>
      </div>
    </Layout>
  );
}
