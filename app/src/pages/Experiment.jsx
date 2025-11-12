import { useState, useEffect, useRef, useCallback } from 'react';
import { useExperiment } from '../contexts/ExperimentContext';
import { useAudio } from '../contexts/AudioContext';
import Layout from '../components/Layout';
import Slider from '../components/Slider';

// Image stimuli for categorization
const imageStimuli = [
  { id: 1, name: 'tree.jpg', category: 'natural' },
  { id: 2, name: 'car.jpg', category: 'artificial' },
  { id: 3, name: 'flower.jpg', category: 'natural' },
  { id: 4, name: 'building.jpg', category: 'artificial' },
  { id: 5, name: 'bird.jpg', category: 'natural' },
  { id: 6, name: 'computer.jpg', category: 'artificial' },
  { id: 7, name: 'mountain.jpg', category: 'natural' },
  { id: 8, name: 'phone.jpg', category: 'artificial' },
  { id: 9, name: 'cat.jpg', category: 'natural' },
  { id: 10, name: 'chair.jpg', category: 'artificial' },
];

export default function Experiment() {
  const { updateData, addTrialData, setCondition, setParticipantId, condition, exportData, participantId } = useExperiment();
  const { loadTrack, play, pause } = useAudio();

  // Global step management
  const [step, setStep] = useState('welcome'); // welcome, questionnaire, cat1, pvt1, cat2, pvt2, thank_you

  // Questionnaire state
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [musicHabit, setMusicHabit] = useState(5);
  const [fatigue, setFatigue] = useState(5);
  const [stress, setStress] = useState(5);

  // Categorization state
  const [catImages, setCatImages] = useState([]);
  const [catCurrentIndex, setCatCurrentIndex] = useState(0);
  const [catStartTime, setCatStartTime] = useState(0);

  // PVT state
  const [pvtState, setPvtState] = useState('ready'); // ready, fixation, stimulus, feedback
  const [pvtCurrentTrial, setPvtCurrentTrial] = useState(0);
  const [pvtTimer, setPvtTimer] = useState('0000');
  const [pvtStartTime, setPvtStartTime] = useState(0);
  const [pvtBlockStartTime, setPvtBlockStartTime] = useState(0);
  const [pvtTotalTrials, setPvtTotalTrials] = useState(48); // Will be calculated dynamically
  const pvtTimerRef = useRef(null);

  // Thank you state
  const [completionCode, setCompletionCode] = useState('');
  const [exportStatus, setExportStatus] = useState('pending');

  // Shuffle images for categorization
  const shuffleImages = useCallback(() => {
    const shuffled = [...imageStimuli];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Control music based on step and condition
  useEffect(() => {
    if (!condition) return;

    const shouldPlayMusic =
      (condition === 'C1' && (step === 'cat2' || step === 'pvt2')) ||
      (condition === 'C2' && (step === 'cat1' || step === 'pvt1'));

    if (shouldPlayMusic) {
      play();
    } else {
      pause();
    }
  }, [step, condition, play, pause]);

  // === QUESTIONNAIRE ===
  const handleQuestionnaireSubmit = (e) => {
    e.preventDefault();

    const isHabitue = musicHabit >= 6;
    const assignedCondition = Math.random() < 0.5 ? 'C1' : 'C2';
    const pid = `P${Date.now()}`;

    setCondition(assignedCondition);
    setParticipantId(pid);

    updateData('questionnaire', {
      age: parseInt(age),
      gender,
      musicHabit,
      fatigue,
      stress,
      isHabitue,
      condition: assignedCondition,
      timestamp: new Date().toISOString(),
    });

    // Load and start music
    loadTrack('/static/musique.mp3');
    play();

    // Go to cat1
    setCatImages(shuffleImages());
    setCatCurrentIndex(0);
    setTimeout(() => setStep('cat1'), 1000);
  };

  // === CATEGORIZATION ===
  const handleCatResponse = useCallback((response) => {
    const rt = performance.now() - catStartTime;
    const currentSeries = step === 'cat1' ? 1 : 2;

    addTrialData(`categorization${currentSeries}`, {
      trial: catCurrentIndex + 1,
      image: catImages[catCurrentIndex]?.name,
      response,
      rt,
      timestamp: new Date().toISOString(),
    });

    if (catCurrentIndex + 1 >= catImages.length) {
      // Categorization complete, move to next step
      if (step === 'cat1') {
        setPvtState('ready');
        setPvtCurrentTrial(0);
        setStep('pvt1');
      } else {
        setPvtState('ready');
        setPvtCurrentTrial(0);
        setStep('pvt2');
      }
    } else {
      setCatCurrentIndex(prev => prev + 1);
    }
  }, [catStartTime, catImages, catCurrentIndex, step, addTrialData]);

  useEffect(() => {
    if (step === 'cat1' || step === 'cat2') {
      setCatStartTime(performance.now());
    }
  }, [step, catCurrentIndex]);

  useEffect(() => {
    if (step === 'cat1' || step === 'cat2') {
      const handleKeyPress = (e) => {
        if (e.key === 'f' || e.key === 'F') {
          handleCatResponse('natural');
        } else if (e.key === 'j' || e.key === 'J') {
          handleCatResponse('artificial');
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [step, handleCatResponse]);

  // === PVT ===
  const PVT_DURATION_MS = 5 * 60 * 1000; // 5 minutes exact

  const startPVTTrial = useCallback(() => {
    setPvtState('fixation');
    const delay = 2000 + Math.random() * 8000; // 2-10s

    setTimeout(() => {
      setPvtState('stimulus');
      setPvtStartTime(performance.now());

      // Start timer animation
      const startTime = performance.now();
      const updateTimer = () => {
        const elapsed = Math.floor(performance.now() - startTime);
        setPvtTimer(String(elapsed).padStart(4, '0'));
        pvtTimerRef.current = requestAnimationFrame(updateTimer);
      };
      pvtTimerRef.current = requestAnimationFrame(updateTimer);
    }, delay);
  }, []);

  const handlePVTResponse = useCallback(() => {
    if (pvtState !== 'stimulus') return;

    const rt = performance.now() - pvtStartTime;
    if (pvtTimerRef.current) {
      cancelAnimationFrame(pvtTimerRef.current);
    }

    const currentBlock = step === 'pvt1' ? 1 : 2;
    addTrialData(`pvtBlock${currentBlock}`, {
      trial: pvtCurrentTrial + 1,
      rt,
      timestamp: new Date().toISOString(),
    });

    // Check if we should continue or stop (5min limit)
    const elapsedTime = performance.now() - pvtBlockStartTime;
    if (elapsedTime >= PVT_DURATION_MS || pvtCurrentTrial + 1 >= 60) {
      // PVT block complete
      if (step === 'pvt1') {
        setCatImages(shuffleImages());
        setCatCurrentIndex(0);
        setStep('cat2');
      } else {
        // Experiment complete
        setStep('thank_you');
        const code = `PVT-${participantId}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        setCompletionCode(code);

        exportData()
          .then(() => setExportStatus('success'))
          .catch(() => setExportStatus('error'));
      }
    } else {
      setPvtCurrentTrial(prev => prev + 1);
      setPvtTimer('0000');
      startPVTTrial();
    }
  }, [pvtState, pvtStartTime, pvtCurrentTrial, step, pvtBlockStartTime, addTrialData, startPVTTrial, participantId, exportData, shuffleImages]);

  useEffect(() => {
    if ((step === 'pvt1' || step === 'pvt2') && pvtState === 'ready') {
      setPvtBlockStartTime(performance.now());
      setTimeout(() => startPVTTrial(), 1000);
    }
  }, [step, pvtState, startPVTTrial]);

  useEffect(() => {
    if (pvtState === 'stimulus') {
      const handleSpace = (e) => {
        if (e.code === 'Space') {
          e.preventDefault();
          handlePVTResponse();
        }
      };

      window.addEventListener('keydown', handleSpace);
      return () => window.removeEventListener('keydown', handleSpace);
    }
  }, [pvtState, handlePVTResponse]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (pvtTimerRef.current) {
        cancelAnimationFrame(pvtTimerRef.current);
      }
    };
  }, []);

  // === RENDER ===
  return (
    <Layout>
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        {/* WELCOME */}
        {step === 'welcome' && (
          <div className="card max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl font-semibold text-apple-gray-900 mb-8">
              Expérience
            </h1>

            <div className="space-y-4 text-lg text-apple-gray-700">
              <p>Étude sur l'attention et la musique</p>
              <p>Durée : <strong>~10 minutes</strong></p>
              <p>Munissez-vous de casque ou d'écouteurs</p>
            </div>

            <button
              onClick={() => setStep('questionnaire')}
              className="btn-primary btn-large mt-8"
            >
              Commencer
            </button>
          </div>
        )}

        {/* QUESTIONNAIRE */}
        {step === 'questionnaire' && (
          <div className="card max-w-2xl mx-auto animate-fade-in overflow-y-auto max-h-[90vh]">
            <h1 className="text-2xl md:text-3xl font-semibold text-apple-gray-900 mb-6 text-center">
              Questionnaire
            </h1>

            <form onSubmit={handleQuestionnaireSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm font-medium text-apple-gray-700 mb-2">Âge</label>
                <input
                  type="number"
                  min="18"
                  max="99"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-2 border border-apple-gray-300 rounded-lg focus:ring-2 focus:ring-apple-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-gray-700 mb-2">Genre</label>
                <select
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2 border border-apple-gray-300 rounded-lg focus:ring-2 focus:ring-apple-gray-900 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="F">Femme</option>
                  <option value="H">Homme</option>
                  <option value="A">Autre</option>
                  <option value="N">Préfère ne pas répondre</option>
                </select>
              </div>

              <div>
                <Slider
                  label="Avez-vous l'habitude de travailler/étudier en musique ?"
                  min={0}
                  max={10}
                  defaultValue={5}
                  onChange={setMusicHabit}
                />
                <div className="flex justify-between text-xs text-apple-gray-500 mt-2">
                  <span>Jamais</span>
                  <span>Toujours</span>
                </div>
              </div>

              <div>
                <Slider label="Niveau de fatigue" min={0} max={10} defaultValue={5} onChange={setFatigue} />
                <div className="flex justify-between text-xs text-apple-gray-500 mt-2">
                  <span>Pas fatigué</span>
                  <span>Très fatigué</span>
                </div>
              </div>

              <div>
                <Slider label="Niveau de stress" min={0} max={10} defaultValue={5} onChange={setStress} />
                <div className="flex justify-between text-xs text-apple-gray-500 mt-2">
                  <span>Pas stressé</span>
                  <span>Très stressé</span>
                </div>
              </div>

              <button type="submit" className="btn-primary btn-large w-full mt-6">
                Commencer
              </button>
            </form>
          </div>
        )}

        {/* CATEGORIZATION */}
        {(step === 'cat1' || step === 'cat2') && catImages[catCurrentIndex] && (
          <div className="text-center w-full">
            <div className="mb-12">
              <div className="w-48 h-48 md:w-64 md:h-64 mx-auto bg-apple-gray-200 rounded-3xl flex items-center justify-center shadow-soft-lg">
                <span className="text-2xl md:text-3xl font-medium text-apple-gray-700">
                  {catImages[catCurrentIndex].name.replace('.jpg', '')}
                </span>
              </div>
            </div>

            <div className="flex gap-4 md:gap-8 justify-center">
              <div className="text-apple-gray-600">
                <kbd className="px-3 md:px-4 py-2 bg-apple-gray-100 rounded font-mono font-bold text-lg md:text-xl">F</kbd>
                <p className="mt-2 text-sm md:text-base">Naturel</p>
              </div>
              <div className="text-apple-gray-600">
                <kbd className="px-3 md:px-4 py-2 bg-apple-gray-100 rounded font-mono font-bold text-lg md:text-xl">J</kbd>
                <p className="mt-2 text-sm md:text-base">Artificiel</p>
              </div>
            </div>
          </div>
        )}

        {/* PVT */}
        {(step === 'pvt1' || step === 'pvt2') && (
          <div className="text-center w-full">
            <div className="mb-8">
              <p className="text-xs md:text-sm text-apple-gray-400 mb-8">Temps estimé : 5 min</p>
            </div>

            {pvtState === 'fixation' && (
              <div className="timer-display text-apple-gray-400">0000</div>
            )}

            {pvtState === 'stimulus' && (
              <div className="timer-display">{pvtTimer}</div>
            )}

            {pvtState === 'ready' && (
              <div>
                <div className="timer-display text-apple-gray-400 mb-8">0000</div>
                <p className="text-base md:text-lg text-apple-gray-600">Préparez-vous...</p>
              </div>
            )}
          </div>
        )}

        {/* THANK YOU */}
        {step === 'thank_you' && (
          <div className="card max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-4xl font-semibold text-apple-gray-900">Merci</h1>

            <div className="space-y-3 text-lg text-apple-gray-600">
              <p>Vos données ont été enregistrées.</p>
            </div>

            <div className="bg-apple-gray-100 p-8 rounded-2xl">
              <p className="text-sm text-apple-gray-500 mb-2 uppercase tracking-wide">
                Code de complétion
              </p>
              <p className="text-3xl font-mono font-semibold text-apple-gray-900">
                {completionCode}
              </p>
            </div>

            {exportStatus === 'pending' && (
              <div className="bg-apple-gray-100 p-4 rounded-lg">
                <p className="text-apple-gray-600">Envoi...</p>
              </div>
            )}

            {exportStatus === 'success' && (
              <div className="bg-apple-gray-100 p-4 rounded-lg">
                <p className="text-apple-gray-900">Enregistré</p>
              </div>
            )}

            {exportStatus === 'error' && (
              <div className="bg-apple-gray-100 p-4 rounded-lg">
                <p className="text-apple-gray-600">Erreur - Contactez l'expérimentateur</p>
              </div>
            )}

            <p className="text-apple-gray-400 text-sm pt-4">
              Vous pouvez fermer cette fenêtre
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
