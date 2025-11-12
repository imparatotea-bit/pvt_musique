import { useState, useEffect, useRef, useCallback } from 'react';
import { useExperiment } from '../contexts/ExperimentContext';
import { useAudio } from '../contexts/AudioContext';
import Layout from '../components/Layout';
import Slider from '../components/Slider';

// Image stimuli for categorization
const imageStimuli = [
  { id: 1, name: 'Arbre', category: 'natural' },
  { id: 2, name: 'Voiture', category: 'artificial' },
  { id: 3, name: 'Fleur', category: 'natural' },
  { id: 4, name: 'Immeuble', category: 'artificial' },
  { id: 5, name: 'Oiseau', category: 'natural' },
  { id: 6, name: 'Ordinateur', category: 'artificial' },
  { id: 7, name: 'Montagne', category: 'natural' },
  { id: 8, name: 'Téléphone', category: 'artificial' },
  { id: 9, name: 'Chat', category: 'natural' },
  { id: 10, name: 'Chaise', category: 'artificial' },
];

export default function Experiment() {
  const { updateData, addTrialData, setCondition, setParticipantId, condition, exportData, participantId, data } = useExperiment();
  const { loadTrack, play, pause } = useAudio();

  // Step: start, welcome, questionnaire, inst_cat1, cat1, inst_pvt1, pvt1, inst_cat2, cat2, inst_pvt2, pvt2, thank_you
  const [step, setStep] = useState('start');
  const [audioReady, setAudioReady] = useState(false);

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
  const [pvtState, setPvtState] = useState('ready');
  const [pvtCurrentTrial, setPvtCurrentTrial] = useState(0);
  const [pvtTimer, setPvtTimer] = useState('0000');
  const [pvtStartTime, setPvtStartTime] = useState(0);
  const [pvtBlockStartTime, setPvtBlockStartTime] = useState(0);
  const [pvtLastKeyPressTime, setPvtLastKeyPressTime] = useState(0);
  const pvtTimerRef = useRef(null);

  // Thank you state
  const [exportStatus, setExportStatus] = useState('pending');

  // Shuffle images
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
    if (!condition || !audioReady) return;

    const shouldPlayMusic =
      (condition === 'C1' && (step === 'inst_cat2' || step === 'cat2' || step === 'inst_pvt2' || step === 'pvt2')) ||
      (condition === 'C2' && (step === 'inst_cat1' || step === 'cat1' || step === 'inst_pvt1' || step === 'pvt1'));

    if (shouldPlayMusic) {
      play();
    } else {
      pause();
    }
  }, [step, condition, audioReady, play, pause]);

  // === START (Audio Authorization) ===
  const handleAudioStart = async () => {
    try {
      // Load music file and wait for it to be ready
      await loadTrack('/static/musique.mp3');
      console.log('✅ Audio complètement chargé, prêt à être utilisé');
      setAudioReady(true);
      setStep('welcome');
    } catch (err) {
      console.error('❌ Impossible de charger l\'audio:', err);
      // Continuer quand même sans audio
      setAudioReady(false);
      setStep('welcome');
    }
  };

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

    // Go to first categorization instructions
    setCatImages(shuffleImages());
    setCatCurrentIndex(0);
    setStep('inst_cat1');
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
      // Categorization complete
      if (step === 'cat1') {
        setStep('inst_pvt1');
      } else {
        setStep('inst_pvt2');
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
  const PVT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

  const startPVTTrial = useCallback(() => {
    setPvtState('fixation');
    const delay = 2000 + Math.random() * 8000;

    setTimeout(() => {
      setPvtState('stimulus');
      setPvtStartTime(performance.now());

      const startTime = performance.now();
      const updateTimer = () => {
        if (pvtTimerRef.current === null) return;
        const elapsed = Math.floor(performance.now() - startTime);
        setPvtTimer(String(elapsed).padStart(4, '0'));
        pvtTimerRef.current = requestAnimationFrame(updateTimer);
      };
      pvtTimerRef.current = requestAnimationFrame(updateTimer);
    }, delay);
  }, []);

  const handlePVTResponse = useCallback(() => {
    if (pvtState !== 'stimulus') {
      // Ignore invalid presses (anti-cheat intelligent)
      return;
    }

    const now = performance.now();

    // Anti-spam: ignore if pressed < 150ms ago
    if (now - pvtLastKeyPressTime < 150) {
      return;
    }

    setPvtLastKeyPressTime(now);

    const rt = now - pvtStartTime;

    // Ignore too fast responses (< 100ms = anticipation)
    if (rt < 100) {
      return;
    }

    if (pvtTimerRef.current) {
      cancelAnimationFrame(pvtTimerRef.current);
      pvtTimerRef.current = null;
    }

    const currentBlock = step === 'pvt1' ? 1 : 2;
    addTrialData(`pvtBlock${currentBlock}`, {
      trial: pvtCurrentTrial + 1,
      rt,
      timestamp: new Date().toISOString(),
    });

    // Check time limit
    const elapsedTime = now - pvtBlockStartTime;
    if (elapsedTime >= PVT_DURATION_MS || pvtCurrentTrial + 1 >= 60) {
      // Block complete
      if (step === 'pvt1') {
        setCatImages(shuffleImages());
        setCatCurrentIndex(0);
        setStep('inst_cat2');
      } else {
        // Experiment complete - export data
        setStep('thank_you');
        exportData()
          .then(() => setExportStatus('success'))
          .catch(() => setExportStatus('error'));
      }
    } else {
      setPvtCurrentTrial(prev => prev + 1);
      setPvtTimer('0000');
      startPVTTrial();
    }
  }, [pvtState, pvtStartTime, pvtCurrentTrial, step, pvtBlockStartTime, pvtLastKeyPressTime, addTrialData, startPVTTrial, exportData, shuffleImages]);

  useEffect(() => {
    if ((step === 'pvt1' || step === 'pvt2') && pvtState === 'ready') {
      setPvtBlockStartTime(performance.now());
      setPvtCurrentTrial(0);
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

  // Cleanup
  useEffect(() => {
    return () => {
      if (pvtTimerRef.current) {
        cancelAnimationFrame(pvtTimerRef.current);
      }
    };
  }, []);

  // Calculate stats for thank you page
  const calculateStats = () => {
    const pvt1 = data.pvtBlock1 || [];
    const pvt2 = data.pvtBlock2 || [];

    const calculateMean = (arr) => {
      if (!arr.length) return 0;
      const sum = arr.reduce((acc, trial) => acc + trial.rt, 0);
      return Math.round(sum / arr.length);
    };

    // Determine which block had music
    const isMusicFirst = condition === 'C2';

    const rtWithMusic = isMusicFirst ? calculateMean(pvt1) : calculateMean(pvt2);
    const rtWithoutMusic = isMusicFirst ? calculateMean(pvt2) : calculateMean(pvt1);

    return { rtWithMusic, rtWithoutMusic };
  };

  // === RENDER ===
  return (
    <Layout>
      <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
        {/* START - Audio Authorization */}
        {step === 'start' && (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-semibold text-apple-gray-900">
              Expérience
            </h1>
            <div className="space-y-4 text-lg text-apple-gray-700">
              <p>Étude sur l'attention et la musique</p>
              <p>Durée : <strong>~10 minutes</strong></p>
              <p>Munissez-vous de casque ou d'écouteurs</p>
            </div>
            <button
              onClick={handleAudioStart}
              className="btn-primary btn-large"
            >
              Autoriser l'audio et commencer
            </button>
          </div>
        )}

        {/* WELCOME */}
        {step === 'welcome' && (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-semibold text-apple-gray-900">
              Bienvenue
            </h1>
            <div className="space-y-4 text-lg text-apple-gray-700">
              <p>Cette expérience comporte plusieurs tâches</p>
              <p>Suivez attentivement les instructions</p>
            </div>
            <button
              onClick={() => setStep('questionnaire')}
              className="btn-primary btn-large"
            >
              Commencer
            </button>
          </div>
        )}

        {/* QUESTIONNAIRE */}
        {step === 'questionnaire' && (
          <div className="max-w-3xl mx-auto w-full animate-fade-in">
            <div className="bg-white rounded-3xl shadow-soft-lg border border-apple-gray-200/50 p-6 md:p-10 max-h-[90vh] overflow-y-auto">
              <h1 className="text-2xl md:text-3xl font-semibold text-apple-gray-900 mb-6 text-center">
                Questionnaire
              </h1>

              <form onSubmit={handleQuestionnaireSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 mb-2">Âge</label>
                  <input
                    type="number"
                    min="18"
                    max="99"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-3 border border-apple-gray-300 rounded-xl focus:ring-2 focus:ring-apple-gray-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 mb-2">Genre</label>
                  <select
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 border border-apple-gray-300 rounded-xl focus:ring-2 focus:ring-apple-gray-900 focus:border-transparent"
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

                <button type="submit" className="btn-primary w-full mt-6">
                  Continuer
                </button>
              </form>
            </div>
          </div>
        )}

        {/* INSTRUCTIONS CATEGORIZATION */}
        {(step === 'inst_cat1' || step === 'inst_cat2') && (
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-semibold text-apple-gray-900">
              Tâche de catégorisation
            </h1>
            <div className="space-y-6 text-lg text-apple-gray-700">
              <p>Des mots vont apparaître à l'écran</p>
              <p>Indiquez si l'objet est <strong>naturel</strong> ou <strong>artificiel</strong></p>

              <div className="bg-apple-gray-50 p-8 rounded-2xl inline-block">
                <div className="space-y-4 text-xl">
                  <p><kbd className="px-4 py-2 bg-white rounded-xl shadow-soft font-mono font-bold border border-apple-gray-200">F</kbd> = Naturel</p>
                  <p><kbd className="px-4 py-2 bg-white rounded-xl shadow-soft font-mono font-bold border border-apple-gray-200">J</kbd> = Artificiel</p>
                </div>
              </div>

              <p className="text-base text-apple-gray-600">
                Répondez rapidement selon votre première impression
              </p>
            </div>
            <button
              onClick={() => setStep(step === 'inst_cat1' ? 'cat1' : 'cat2')}
              className="btn-primary btn-large"
            >
              Commencer
            </button>
          </div>
        )}

        {/* CATEGORIZATION */}
        {(step === 'cat1' || step === 'cat2') && catImages[catCurrentIndex] && (
          <div className="text-center w-full">
            <div className="mb-16">
              <div className="text-7xl md:text-8xl font-bold text-apple-gray-900">
                {catImages[catCurrentIndex].name}
              </div>
            </div>

            <div className="flex gap-12 justify-center">
              <div className="text-apple-gray-600">
                <kbd className="px-6 py-3 bg-apple-gray-100 rounded-xl font-mono font-bold text-2xl shadow-soft">F</kbd>
                <p className="mt-4 text-lg">Naturel</p>
              </div>
              <div className="text-apple-gray-600">
                <kbd className="px-6 py-3 bg-apple-gray-100 rounded-xl font-mono font-bold text-2xl shadow-soft">J</kbd>
                <p className="mt-4 text-lg">Artificiel</p>
              </div>
            </div>
          </div>
        )}

        {/* INSTRUCTIONS PVT */}
        {(step === 'inst_pvt1' || step === 'inst_pvt2') && (
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-semibold text-apple-gray-900">
              Tâche de vigilance
            </h1>
            <div className="space-y-6 text-lg text-apple-gray-700">
              <p>Un compteur va apparaître à l'écran</p>
              <p>Dès qu'il démarre, appuyez sur <kbd className="px-4 py-2 bg-apple-gray-100 rounded-xl shadow-soft font-mono font-bold">ESPACE</kbd> le plus vite possible</p>

              <div className="bg-apple-gray-50 p-8 rounded-2xl">
                <p className="text-base text-apple-gray-600">
                  N'anticipez pas • Réagissez rapidement • Restez concentré
                </p>
              </div>

              <p className="text-base text-apple-gray-500">
                Durée : ~5 minutes
              </p>
            </div>
            <button
              onClick={() => {
                setPvtState('ready');
                setPvtCurrentTrial(0);
                setStep(step === 'inst_pvt1' ? 'pvt1' : 'pvt2');
              }}
              className="btn-primary btn-large"
            >
              Commencer
            </button>
          </div>
        )}

        {/* PVT */}
        {(step === 'pvt1' || step === 'pvt2') && (
          <div className="text-center w-full">
            <p className="text-sm text-apple-gray-400 mb-12">Temps estimé : 5 min</p>

            {pvtState === 'fixation' && (
              <div className="timer-display text-apple-gray-300">0000</div>
            )}

            {pvtState === 'stimulus' && (
              <div className="timer-display">{pvtTimer}</div>
            )}

            {pvtState === 'ready' && (
              <div>
                <div className="timer-display text-apple-gray-300 mb-8">0000</div>
                <p className="text-xl text-apple-gray-600">Préparez-vous...</p>
              </div>
            )}
          </div>
        )}

        {/* THANK YOU */}
        {step === 'thank_you' && (
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-semibold text-apple-gray-900">
              Merci !
            </h1>

            <p className="text-lg text-apple-gray-600">
              Voici vos résultats
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="bg-white p-8 rounded-3xl shadow-soft-lg border border-apple-gray-200">
                <p className="text-sm uppercase tracking-wide text-apple-gray-500 mb-2">Avec musique</p>
                <p className="text-5xl font-bold text-apple-gray-900">{calculateStats().rtWithMusic}</p>
                <p className="text-sm text-apple-gray-500 mt-2">millisecondes</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-soft-lg border border-apple-gray-200">
                <p className="text-sm uppercase tracking-wide text-apple-gray-500 mb-2">Sans musique</p>
                <p className="text-5xl font-bold text-apple-gray-900">{calculateStats().rtWithoutMusic}</p>
                <p className="text-sm text-apple-gray-500 mt-2">millisecondes</p>
              </div>
            </div>

            <div className="mt-8">
              {exportStatus === 'pending' && (
                <p className="text-apple-gray-600">Envoi des données...</p>
              )}
              {exportStatus === 'success' && (
                <p className="text-apple-gray-900">✓ Données enregistrées avec succès</p>
              )}
              {exportStatus === 'error' && (
                <p className="text-apple-gray-600">Erreur d'envoi - Contactez l'expérimentateur</p>
              )}
            </div>

            <p className="text-sm text-apple-gray-400 pt-8">
              Vous pouvez fermer cette fenêtre
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
