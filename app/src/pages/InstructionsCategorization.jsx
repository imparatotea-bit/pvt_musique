import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function InstructionsCategorization() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="card max-w-2xl mx-auto animate-fade-in space-y-6">
        <h1 className="text-4xl font-semibold text-apple-gray-900 text-center mb-10 tracking-tight">
          Instructions - Catégorisation d'images
        </h1>

        <div className="space-y-4 text-lg text-apple-gray-700">
          <p>
            Dans cette tâche, vous allez voir des images apparaître à l'écran.
          </p>

          <div className="bg-apple-gray-100 p-6 rounded-2xl border-2 border-apple-gray-200">
            <p className="font-semibold text-apple-gray-900 mb-3">
              Votre tâche :
            </p>
            <p className="mb-4">
              Indiquez si l'image représente un <strong>objet naturel</strong> ou un <strong>objet artificiel</strong>.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <kbd className="px-3 py-1 bg-white rounded-lg font-mono text-apple-gray-900 border-2 border-apple-gray-900">F</kbd>
                {' '}pour <strong>Naturel</strong> (ex: arbre, animal, fleur)
              </li>
              <li>
                <kbd className="px-3 py-1 bg-white rounded-lg font-mono text-apple-gray-900 border-2 border-apple-gray-900">J</kbd>
                {' '}pour <strong>Artificiel</strong> (ex: voiture, ordinateur, bâtiment)
              </li>
            </ul>
          </div>

          <div className="bg-apple-gray-100 p-6 rounded-2xl border-2 border-apple-gray-200">
            <p className="font-semibold text-apple-gray-900 mb-2">
              Conseils :
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Répondez le plus rapidement possible</li>
              <li>Fiez-vous à votre première impression</li>
              <li>Gardez vos doigts sur les touches F et J</li>
            </ul>
          </div>

          <p className="text-center pt-4">
            L'expérience comprend <strong>2 séries</strong> d'images.
          </p>
        </div>

        <div className="pt-6 flex justify-center">
          <button
            onClick={() => navigate('/categorization-1')}
            className="btn-primary btn-large text-xl"
          >
            Commencer la Série 1
          </button>
        </div>
      </div>
    </Layout>
  );
}
