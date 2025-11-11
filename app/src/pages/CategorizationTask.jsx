import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperiment } from '../contexts/ExperimentContext';
import Layout from '../components/Layout';

// Sample images - in production, these would be real image URLs
const imageStimuli = [
  { id: 1, name: 'tree.jpg', category: 'natural', correctResponse: 'f' },
  { id: 2, name: 'car.jpg', category: 'artificial', correctResponse: 'j' },
  { id: 3, name: 'flower.jpg', category: 'natural', correctResponse: 'f' },
  { id: 4, name: 'building.jpg', category: 'artificial', correctResponse: 'j' },
  { id: 5, name: 'bird.jpg', category: 'natural', correctResponse: 'f' },
  { id: 6, name: 'computer.jpg', category: 'artificial', correctResponse: 'j' },
  { id: 7, name: 'mountain.jpg', category: 'natural', correctResponse: 'f' },
  { id: 8, name: 'phone.jpg', category: 'artificial', correctResponse: 'j' },
  { id: 9, name: 'cat.jpg', category: 'natural', correctResponse: 'f' },
  { id: 10, name: 'chair.jpg', category: 'artificial', correctResponse: 'j' },
];

export default function CategorizationTask({ series }) {
  const navigate = useNavigate();
  const { addTrialData } = useExperiment();
  const [currentTrial, setCurrentTrial] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);
  const [trialStartTime, setTrialStartTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  // Shuffle images for this series
  const [stimuli] = useState(() => {
    const shuffled = [...imageStimuli];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  // Start new trial
  useEffect(() => {
    if (currentTrial < stimuli.length && !showFeedback && !isComplete) {
      // Short delay before showing image
      const timeout = setTimeout(() => {
        setCurrentImage(stimuli[currentTrial]);
        setTrialStartTime(performance.now());
      }, 500);

      return () => clearTimeout(timeout);
    } else if (currentTrial >= stimuli.length && !isComplete) {
      setIsComplete(true);
    }
  }, [currentTrial, stimuli, showFeedback, isComplete]);

  // Handle response
  const handleResponse = useCallback((key) => {
    if (!currentImage || showFeedback || isComplete) return;

    const rt = performance.now() - trialStartTime;
    const isCorrect = key === currentImage.correctResponse;

    // Record trial data
    const trialData = {
      trial: currentTrial + 1,
      image: currentImage.name,
      category: currentImage.category,
      response: key,
      correct: isCorrect,
      rt: Math.round(rt),
      timestamp: new Date().toISOString(),
    };

    addTrialData(series === 1 ? 'categorization1' : 'categorization2', trialData);

    // Show feedback
    setFeedbackData({
      isCorrect,
      rt: Math.round(rt),
    });
    setShowFeedback(true);

    // Move to next trial
    setTimeout(() => {
      setShowFeedback(false);
      setFeedbackData(null);
      setCurrentImage(null);
      setCurrentTrial(prev => prev + 1);
    }, 800);
  }, [currentImage, currentTrial, showFeedback, isComplete, trialStartTime, series, addTrialData]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'f' || key === 'j') {
        handleResponse(key);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [handleResponse]);

  const handleNext = () => {
    if (series === 1) {
      navigate('/categorization-2');
    } else {
      navigate('/post-experiment');
    }
  };

  if (isComplete) {
    return (
      <Layout>
        <div className="card text-center space-y-8">
          <h1 className="text-4xl font-bold gradient-text">
            Série {series} terminée !
          </h1>
          <p className="text-xl text-gray-700">
            {series === 1 ? 'Passons à la série suivante.' : 'Excellent travail !'}
          </p>
          <button onClick={handleNext} className="btn-primary text-xl">
            Continuer
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card min-h-[600px] flex flex-col">
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm">
            Série {series} - Image {currentTrial + 1} / {stimuli.length}
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          {currentImage && !showFeedback && (
            <div className="text-center space-y-8">
              {/* Placeholder for image - in production would be <img src={...} /> */}
              <div className="w-96 h-96 bg-gradient-to-br from-notion-purple-light to-notion-blue-light rounded-3xl flex items-center justify-center border-4 border-white shadow-2xl">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-700 mb-2">
                    {currentImage.category === 'natural' ? '🌿' : '🏭'}
                  </p>
                  <p className="text-lg text-gray-600">
                    {currentImage.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    (Image placeholder)
                  </p>
                </div>
              </div>
            </div>
          )}

          {showFeedback && feedbackData && (
            <div className="text-center space-y-4">
              <div className={`text-6xl ${feedbackData.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {feedbackData.isCorrect ? '✓' : '✗'}
              </div>
              <p className="text-2xl font-semibold text-gray-700">
                {feedbackData.rt} ms
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center gap-8 text-lg">
          <div className="text-center">
            <kbd className="px-6 py-3 bg-white rounded-xl font-mono text-notion-blue border-3 border-notion-blue shadow-lg text-2xl">
              F
            </kbd>
            <p className="mt-2 text-gray-600">Naturel</p>
          </div>
          <div className="text-center">
            <kbd className="px-6 py-3 bg-white rounded-xl font-mono text-notion-pink border-3 border-notion-pink shadow-lg text-2xl">
              J
            </kbd>
            <p className="mt-2 text-gray-600">Artificiel</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
