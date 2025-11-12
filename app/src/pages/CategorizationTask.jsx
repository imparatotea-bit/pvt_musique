import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperiment } from '../contexts/ExperimentContext';
import { useAudio } from '../contexts/AudioContext';
import Layout from '../components/Layout';

// Sample images - in production, these would be real image URLs
const imageStimuli = [
  { id: 1, name: 'tree.jpg', category: 'natural', correctResponse: 'natural' },
  { id: 2, name: 'car.jpg', category: 'artificial', correctResponse: 'artificial' },
  { id: 3, name: 'flower.jpg', category: 'natural', correctResponse: 'natural' },
  { id: 4, name: 'building.jpg', category: 'artificial', correctResponse: 'artificial' },
  { id: 5, name: 'bird.jpg', category: 'natural', correctResponse: 'natural' },
  { id: 6, name: 'computer.jpg', category: 'artificial', correctResponse: 'artificial' },
  { id: 7, name: 'mountain.jpg', category: 'natural', correctResponse: 'natural' },
  { id: 8, name: 'phone.jpg', category: 'artificial', correctResponse: 'artificial' },
  { id: 9, name: 'cat.jpg', category: 'natural', correctResponse: 'natural' },
  { id: 10, name: 'chair.jpg', category: 'artificial', correctResponse: 'artificial' },
];

export default function CategorizationTask({ series }) {
  const navigate = useNavigate();
  const { addTrialData, condition, data } = useExperiment();
  const { play, pause } = useAudio();
  const [currentTrial, setCurrentTrial] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);
  const [trialStartTime, setTrialStartTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  // Control music based on condition
  // C1: D1=S, D2=M
  // C2: D1=M, D2=S
  useEffect(() => {
    const shouldPlayMusic = (condition === 'C1' && series === 2) || (condition === 'C2' && series === 1);

    if (shouldPlayMusic) {
      play();
    } else {
      pause();
    }
  }, [condition, series, play, pause]);

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
        setButtonsDisabled(false);
      }, 500);

      return () => clearTimeout(timeout);
    } else if (currentTrial >= stimuli.length && !isComplete) {
      setIsComplete(true);
    }
  }, [currentTrial, stimuli, showFeedback, isComplete]);

  // Handle response via button click
  const handleResponse = useCallback((response) => {
    if (!currentImage || showFeedback || isComplete || buttonsDisabled) return;

    setButtonsDisabled(true);

    const rt = performance.now() - trialStartTime;
    const isCorrect = response === currentImage.correctResponse;

    // Record trial data
    const trialData = {
      trial: currentTrial + 1,
      image: currentImage.name,
      category: currentImage.category,
      response: response,
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
  }, [currentImage, currentTrial, showFeedback, isComplete, trialStartTime, series, addTrialData, buttonsDisabled]);

  const handleNext = () => {
    if (series === 1) {
      navigate('/instructions-pvt');
    } else {
      navigate('/pvt-block-2');
    }
  };

  if (isComplete) {
    return (
      <Layout>
        <div className="card max-w-xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-semibold text-apple-gray-900">
            Série {series} terminée !
          </h1>
          <p className="text-lg text-apple-gray-600">
            {series === 1 ? 'Passons à la série suivante.' : 'Excellent travail !'}
          </p>
          <button onClick={handleNext} className="btn-primary btn-large mt-8">
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
          <p className="text-sm text-apple-gray-400">
            Série {series} • Image {currentTrial + 1} / {stimuli.length}
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          {currentImage && !showFeedback && (
            <div className="text-center space-y-12 animate-scale-in">
              {/* Placeholder for image - in production would be <img src={...} /> */}
              <div className="w-80 h-80 bg-apple-gray-100 rounded-3xl flex items-center justify-center shadow-soft-lg">
                <div className="text-center">
                  <p className="text-base text-apple-gray-600">
                    {currentImage.name}
                  </p>
                  <p className="text-xs text-apple-gray-400 mt-2">
                    (Image placeholder)
                  </p>
                </div>
              </div>

              {/* Boutons de réponse */}
              <div className="flex justify-center gap-6">
                <button
                  onClick={() => handleResponse('natural')}
                  disabled={buttonsDisabled}
                  className="px-10 py-5 bg-white border-2 border-apple-gray-200 rounded-2xl
                             hover:border-apple-gray-900 hover:bg-apple-gray-900 hover:text-white
                             transition-all duration-200 shadow-soft hover:shadow-soft-lg
                             disabled:opacity-50 disabled:cursor-not-allowed
                             text-lg font-medium text-apple-gray-900"
                >
                  Naturel
                </button>

                <button
                  onClick={() => handleResponse('artificial')}
                  disabled={buttonsDisabled}
                  className="px-10 py-5 bg-white border-2 border-apple-gray-200 rounded-2xl
                             hover:border-apple-gray-900 hover:bg-apple-gray-900 hover:text-white
                             transition-all duration-200 shadow-soft hover:shadow-soft-lg
                             disabled:opacity-50 disabled:cursor-not-allowed
                             text-lg font-medium text-apple-gray-900"
                >
                  Artificiel
                </button>
              </div>
            </div>
          )}

          {showFeedback && feedbackData && (
            <div className="text-center space-y-6 animate-scale-in">
              <div className={`text-4xl font-medium ${feedbackData.isCorrect ? 'text-apple-gray-900' : 'text-apple-gray-600'}`}>
                {feedbackData.isCorrect ? 'Correct' : 'Incorrect'}
              </div>
              <p className="text-4xl font-light text-apple-gray-900">
                {feedbackData.rt} <span className="text-xl text-apple-gray-500">ms</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
