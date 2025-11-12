import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function InstructionsPVT() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="card max-w-2xl mx-auto text-center animate-fade-in">
        <h1 className="text-3xl font-semibold text-apple-gray-900 mb-8">
          Tâche de vigilance
        </h1>

        <div className="space-y-6">
          <p className="text-lg text-apple-gray-700">
            Un compteur va apparaître. Dès qu'il démarre, appuyez sur <kbd className="px-3 py-1 bg-apple-gray-100 rounded font-mono font-bold">ESPACE</kbd> le plus vite possible.
          </p>

          <div className="bg-apple-gray-100 p-6 rounded-lg inline-block">
            <p className="text-base text-apple-gray-600">
              N'anticipez pas • Réagissez rapidement
            </p>
          </div>

          <p className="text-sm text-apple-gray-500">
            Durée : ~5 min
          </p>
        </div>

        <button
          onClick={() => navigate('/pvt-block-1')}
          className="btn-primary btn-large mt-8"
        >
          Commencer
        </button>
      </div>
    </Layout>
  );
}
