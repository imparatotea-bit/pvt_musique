import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function InstructionsCategorization() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="card max-w-2xl mx-auto text-center animate-fade-in">
        <h1 className="text-3xl font-semibold text-apple-gray-900 mb-8">
          Catégorisation
        </h1>

        <div className="space-y-6">
          <p className="text-lg text-apple-gray-700">
            Indiquez si l'objet est <strong>naturel</strong> ou <strong>artificiel</strong>
          </p>

          <div className="bg-apple-gray-100 p-6 rounded-lg inline-block">
            <div className="space-y-2 text-lg">
              <p><kbd className="px-3 py-1 bg-white rounded font-mono font-bold">F</kbd> = Naturel</p>
              <p><kbd className="px-3 py-1 bg-white rounded font-mono font-bold">J</kbd> = Artificiel</p>
            </div>
          </div>

          <p className="text-base text-apple-gray-600">
            Répondez rapidement
          </p>
        </div>

        <button
          onClick={() => navigate('/categorization-1')}
          className="btn-primary btn-large mt-8"
        >
          Commencer
        </button>
      </div>
    </Layout>
  );
}
