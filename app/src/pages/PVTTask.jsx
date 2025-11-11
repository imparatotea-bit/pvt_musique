import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperiment } from '../contexts/ExperimentContext';
import Layout from '../components/Layout';

export default function PVTTask({ block }) {
  const navigate = useNavigate();
  const { addTrialData } = useExperiment();
  const [trialState, setTrialState] = useState('waiting'); // waiting, fixation, stimulus, feedback, break
  const [currentTrial, setCurrentTrial] = useState(0);
  const [displayNumber, setDisplayNumber] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  // Anti-cheat state
  const antiCheatRef = useRef({
    spaceKeyDown: false,
    keyDownTime: 0,
    lastResponseTime: 0,
    hasHadFirstPress: false,
  });

  // Trial timing state
  const timingRef = useRef({
    trialStartTime: 0,
    stimulusOnsetTime: 0,
    currentDelay: 0,
  });

  const totalTrials = 20;

  // Generate random delay between 2000-10000ms
  const getRandomDelay = () => {
    return 2000 + Math.random() * 8000;
  };

  // Handle valid response
  const handleValidResponse = useCallback(() => {
    if (trialState !== 'stimulus') return;

    const now = performance.now();
    const rt = now - timingRef.current.stimulusOnsetTime;

    // Record trial data
    const trialData = {
      trial: currentTrial + 1,
      delay: timingRef.current.currentDelay,
      rt: Math.round(rt),
      valid: true,
      timestamp: new Date().toISOString(),
    };

    addTrialData(block === 1 ? 'pvtBlock1' : 'pvtBlock2', trialData);

    // Show feedback
    setFeedback({
      message: '✓ Réponse enregistrée',
      rt: Math.round(rt),
      color: 'text-green-600',
    });
    setTrialState('feedback');

    // Move to next trial after feedback
    setTimeout(() => {
      if (currentTrial + 1 >= totalTrials) {
        setIsComplete(true);
        setTrialState('break');
      } else {
        setCurrentTrial(prev => prev + 1);
        setTrialState('waiting');
        setFeedback(null);
      }
    }, 1500);
  }, [trialState, currentTrial, block, addTrialData]);

  // Anti-cheat system
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
        const now = performance.now();

        // First keydown detection
        if (!antiCheatRef.current.spaceKeyDown) {
          antiCheatRef.current.spaceKeyDown = true;
          antiCheatRef.current.keyDownTime = now;
        }

        // BLOCK if key held down (> 50ms)
        if (antiCheatRef.current.hasHadFirstPress &&
            (now - antiCheatRef.current.keyDownTime) > 50) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          console.warn('⚠️ APPUI CONTINU BLOQUÉ');

          // Show warning feedback
          if (trialState === 'stimulus') {
            setFeedback({
              message: '⚠️ Ne maintenez pas la touche enfoncée',
              color: 'text-red-600',
            });
          }
          return false;
        }

        // BLOCK if response too fast (< 150ms since last)
        if (antiCheatRef.current.lastResponseTime > 0 &&
            (now - antiCheatRef.current.lastResponseTime) < 150) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          console.warn('⚠️ APPUI TROP RAPIDE BLOQUÉ');

          if (trialState === 'stimulus') {
            setFeedback({
              message: '⚠️ Appuis trop rapides détectés',
              color: 'text-red-600',
            });
          }
          return false;
        }

        // BLOCK if pressed during fixation (anticipation)
        if (trialState === 'fixation') {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          console.warn('⚠️ ANTICIPATION BLOQUÉE');

          setFeedback({
            message: '⚠️ Attendez que le nombre apparaisse !',
            color: 'text-red-600',
          });

          // Record as false start
          const trialData = {
            trial: currentTrial + 1,
            delay: timingRef.current.currentDelay,
            rt: null,
            valid: false,
            error: 'false_start',
            timestamp: new Date().toISOString(),
          };
          addTrialData(block === 1 ? 'pvtBlock1' : 'pvtBlock2', trialData);

          // Reset trial
          setTimeout(() => {
            setFeedback(null);
            setCurrentTrial(prev => prev + 1);
            setTrialState('waiting');
          }, 2000);

          return false;
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
        antiCheatRef.current.spaceKeyDown = false;
        antiCheatRef.current.keyDownTime = 0;
      }
    };

    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
        const now = performance.now();

        if (antiCheatRef.current.spaceKeyDown &&
            (!antiCheatRef.current.hasHadFirstPress ||
             (now - antiCheatRef.current.lastResponseTime) >= 150)) {

          antiCheatRef.current.lastResponseTime = now;
          antiCheatRef.current.hasHadFirstPress = true;

          // Valid response
          handleValidResponse();
        }
      }
    };

    // Add listeners with capture phase
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);
    document.addEventListener('keypress', handleKeyPress, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyUp, true);
      document.removeEventListener('keypress', handleKeyPress, true);
    };
  }, [trialState, currentTrial, block, addTrialData, handleValidResponse]);

  // Trial sequence
  useEffect(() => {
    if (trialState === 'waiting') {
      // Start new trial
      setDisplayNumber('');
      setFeedback(null);
      timingRef.current.trialStartTime = performance.now();

      // Short delay before fixation
      const waitTimeout = setTimeout(() => {
        setTrialState('fixation');
      }, 500);

      return () => clearTimeout(waitTimeout);
    } else if (trialState === 'fixation') {
      // Show fixation cross for random delay
      const delay = getRandomDelay();
      timingRef.current.currentDelay = delay;

      const fixationTimeout = setTimeout(() => {
        // Show stimulus
        const randomNumber = Math.floor(100 + Math.random() * 900);
        setDisplayNumber(randomNumber);
        timingRef.current.stimulusOnsetTime = performance.now();
        setTrialState('stimulus');
      }, delay);

      return () => clearTimeout(fixationTimeout);
    } else if (trialState === 'stimulus') {
      // Timeout after 5 seconds if no response
      const timeoutId = setTimeout(() => {
        setFeedback({
          message: 'Trop lent !',
          color: 'text-orange-600',
        });

        const trialData = {
          trial: currentTrial + 1,
          delay: timingRef.current.currentDelay,
          rt: null,
          valid: false,
          error: 'timeout',
          timestamp: new Date().toISOString(),
        };
        addTrialData(block === 1 ? 'pvtBlock1' : 'pvtBlock2', trialData);

        setTrialState('feedback');

        setTimeout(() => {
          if (currentTrial + 1 >= totalTrials) {
            setIsComplete(true);
            setTrialState('break');
          } else {
            setCurrentTrial(prev => prev + 1);
            setTrialState('waiting');
            setFeedback(null);
          }
        }, 1500);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [trialState, currentTrial, block, addTrialData]);

  const handleNext = () => {
    if (block === 1) {
      navigate('/pvt-block-2');
    } else {
      navigate('/instructions-categorization');
    }
  };

  if (trialState === 'break' && isComplete) {
    return (
      <Layout>
        <div className="card text-center space-y-8">
          <h1 className="text-4xl font-bold gradient-text">
            Bloc {block} terminé !
          </h1>
          <p className="text-xl text-gray-700">
            {block === 1 ? 'Prenez une courte pause avant de continuer.' : 'Excellent travail !'}
          </p>
          <button onClick={handleNext} className="btn-primary text-xl">
            {block === 1 ? 'Commencer le Bloc 2' : 'Continuer'}
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card min-h-[500px] flex flex-col justify-center items-center">
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm">
            Bloc {block} - Essai {currentTrial + 1} / {totalTrials}
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center w-full">
          {trialState === 'fixation' && (
            <div className="text-8xl text-gray-400 animate-pulse">
              +
            </div>
          )}

          {trialState === 'stimulus' && (
            <div className="text-9xl font-bold gradient-text animate-pulse">
              {displayNumber}
            </div>
          )}

          {trialState === 'feedback' && feedback && (
            <div className="text-center space-y-4">
              <p className={`text-3xl font-semibold ${feedback.color}`}>
                {feedback.message}
              </p>
              {feedback.rt && (
                <p className="text-6xl font-bold gradient-text">
                  {feedback.rt} ms
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Appuyez sur ESPACE dès que le nombre apparaît</p>
        </div>
      </div>
    </Layout>
  );
}
