import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function InstructionsPVT() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="card max-w-2xl mx-auto animate-fade-in space-y-6">
        <h1 className="text-4xl font-semibold text-apple-gray-900 text-center mb-10 tracking-tight">
          Instructions - Tâche de vigilance
        </h1>

        <div className="space-y-4 text-lg text-apple-gray-700">
          <p>
            Dans cette tâche, vous allez devoir réagir le plus rapidement possible à l'apparition d'un stimulus.
          </p>

          <div className="bg-notion-purple-bg p-6 rounded-2xl border-2 border-notion-purple-light">
            <p className="font-semibold text-notion-purple mb-2">
              Comment répondre :
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Fixez le centre de l'écran</li>
              <li>Un nombre apparaîtra après un délai aléatoire</li>
              <li>Dès que le nombre apparaît, appuyez sur la <kbd className="px-3 py-1 bg-white rounded-lg font-mono text-notion-purple border-2 border-notion-purple">BARRE ESPACE</kbd></li>
              <li>Soyez le plus rapide possible</li>
            </ul>
          </div>

          <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200">
            <p className="font-semibold text-red-600 mb-2">
              ⚠️ Important :
            </p>
            <ul className="list-disc list-inside space-y-2 text-red-700">
              <li>N'appuyez PAS avant que le nombre n'apparaisse</li>
              <li>Ne maintenez PAS la barre espace enfoncée</li>
              <li>Attendez bien de voir le nombre avant de répondre</li>
            </ul>
          </div>

          <p className="text-center pt-4">
            L'expérience comprend <strong>2 blocs</strong> avec une pause entre les deux.
          </p>
        </div>

        <div className="pt-6 flex justify-center">
          <button
            onClick={() => navigate('/pvt-block-1')}
            className="btn-primary btn-large text-xl"
          >
            Commencer le Bloc 1
          </button>
        </div>
      </div>
    </Layout>
  );
}
