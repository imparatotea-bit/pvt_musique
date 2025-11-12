import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperiment } from '../contexts/ExperimentContext';
import Layout from '../components/Layout';

export default function PVTTask({ block }) {
  const navigate = useNavigate();
  const { addTrialData } = useExperiment();
  const [trialState, setTrialState] = useState('waiting');
  const [currentTrial, setCurrentTrial] = useState(0);
  const [timerValue, setTimerValue] = useState('0000');
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

  // Timer interval reference
  const timerIntervalRef = useRef(null);

  const totalTrials = 20;

  // Generate random delay between 2000-10000ms (max 10s comme demandé)
  const getRandomDelay = () => {
    return 2000 + Math.random() * 8000; // 2-10 secondes
  };

  // Start the timer that counts up
  const startTimer = useCallback(() => {
    const startTime = performance.now();
    timingRef.current.stimulusOnsetTime = startTime;

    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor(performance.now() - startTime);
      const formatted = elapsed.toString().padStart(4, '0');
      setTimerValue(formatted);
    }, 1); // Update every millisecond for smooth counting
  }, []);

  // Stop the timer
  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // Handle valid response
  const handleValidResponse = useCallback(() => {
    if (trialState !== 'stimulus') return;

    stopTimer();

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
      message: 'Réponse enregistrée',
      rt: Math.round(rt),
      color: 'text-apple-gray-900',
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
    }, 1200);
  }, [trialState, currentTrial, block, addTrialData, stopTimer]);

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
          console.warn('APPUI CONTINU BLOQUE');

          if (trialState === 'stimulus') {
            stopTimer();
            setFeedback({
              message: 'Ne maintenez pas la touche enfoncée',
              color: 'text-apple-gray-600',
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
          console.warn('APPUI TROP RAPIDE BLOQUE');

          if (trialState === 'stimulus') {
            stopTimer();
            setFeedback({
              message: 'Appuis trop rapides détectés',
              color: 'text-apple-gray-600',
            });
          }
          return false;
        }

        // BLOCK if pressed during fixation (anticipation)
        if (trialState === 'fixation') {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          console.warn('ANTICIPATION BLOQUEE');

          setFeedback({
            message: 'Attendez que le timer apparaisse !',
            color: 'text-apple-gray-600',
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
      stopTimer();
    };
  }, [trialState, currentTrial, block, addTrialData, handleValidResponse, stopTimer]);

  // Trial sequence
  useEffect(() => {
    if (trialState === 'waiting') {
      // Start new trial
      setTimerValue('0000');
      setFeedback(null);
      timingRef.current.trialStartTime = performance.now();

      // Short delay before fixation
      const waitTimeout = setTimeout(() => {
        setTrialState('fixation');
      }, 500);

      return () => clearTimeout(waitTimeout);
    } else if (trialState === 'fixation') {
      // Show fixation "0000" for random delay
      const delay = getRandomDelay();
      timingRef.current.currentDelay = delay;
      setTimerValue('0000');

      const fixationTimeout = setTimeout(() => {
        // Start timer
        setTrialState('stimulus');
        startTimer();
      }, delay);

      return () => clearTimeout(fixationTimeout);
    } else if (trialState === 'stimulus') {
      // Timeout after 10 seconds if no response
      const timeoutId = setTimeout(() => {
        stopTimer();
        setFeedback({
          message: 'Trop lent !',
          color: 'text-apple-gray-600',
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
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
  }, [trialState, currentTrial, block, addTrialData, startTimer, stopTimer]);

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
        <div className="card max-w-xl mx-auto text-center space-y-6">
          <h1 className="text-3xl font-semibold text-apple-gray-900">
            Bloc {block} terminé !
          </h1>
          <p className="text-lg text-apple-gray-600">
            {block === 1 ? 'Prenez une courte pause avant de continuer.' : 'Excellent travail !'}
          </p>
          <button onClick={handleNext} className="btn-primary btn-large mt-8">
            {block === 1 ? 'Commencer le Bloc 2' : 'Continuer'}
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="card min-h-[600px] flex flex-col justify-center items-center">
        <div className="text-center mb-8">
          <p className="text-sm text-apple-gray-400">
            Bloc {block} • Essai {currentTrial + 1} / {totalTrials}
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center w-full">
          {(trialState === 'fixation' || trialState === 'stimulus') && (
            <div className="timer-display">
              {timerValue}
            </div>
          )}

          {trialState === 'feedback' && feedback && (
            <div className="text-center space-y-4 animate-scale-in">
              <p className={`text-2xl font-medium ${feedback.color}`}>
                {feedback.message}
              </p>
              {feedback.rt && (
                <p className="text-5xl font-light text-apple-gray-900">
                  {feedback.rt} <span className="text-2xl text-apple-gray-500">ms</span>
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-apple-gray-500">
            Appuyez sur <kbd className="px-3 py-1.5 bg-white border border-apple-gray-300 rounded-lg text-apple-gray-700 font-mono text-xs shadow-soft">ESPACE</kbd> dès que le timer démarre
          </p>
        </div>
      </div>
    </Layout>
  );
}
