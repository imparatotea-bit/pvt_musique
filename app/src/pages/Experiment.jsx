import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useExperiment } from '../contexts/ExperimentContext';
import { useAudio } from '../contexts/AudioContext';
import Layout from '../components/Layout';
import Slider from '../components/Slider';
import { localImages } from '../data/localImages';
import { BrainCircuit } from 'lucide-react';

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
  const [allShuffledImages, setAllShuffledImages] = useState([]);

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

  // Shuffle all 42 images once at the start (21 for cat1, 21 for cat2)
  const initializeImages = useCallback(() => {
    const shuffled = [...localImages];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setAllShuffledImages(shuffled);
    console.log('🖼️ Images randomisées: 42 images divisées en 2 groupes de 21');
  }, []);

  // Get images for current categorization task
  const getCatImages = useCallback((taskNumber) => {
    if (taskNumber === 1) {
      return allShuffledImages.slice(0, 21); // First 21 images
    } else {
      return allShuffledImages.slice(21, 42); // Last 21 images
    }
  }, [allShuffledImages]);

  // Control music based on step and condition
  useEffect(() => {
    if (!audioReady) {
      console.log('🎵 Musique: audio pas prêt');
      return;
    }

    // Jouer la musique PENDANT le questionnaire (welcome + questionnaire)
    if (step === 'welcome' || step === 'questionnaire') {
      console.log('🎵 Musique: questionnaire → JOUER');
      play();
      return;
    }

    // APRÈS le questionnaire: contrôle selon C1/C2
    if (!condition) {
      console.log('🎵 Musique: condition pas encore assignée');
      return;
    }

    const shouldPlayMusic =
      (condition === 'C1' && (step === 'inst_cat2' || step === 'cat2' || step === 'inst_pvt2' || step === 'pvt2')) ||
      (condition === 'C2' && (step === 'inst_cat1' || step === 'cat1' || step === 'inst_pvt1' || step === 'pvt1'));

    console.log(`🎵 Musique: step="${step}", condition="${condition}", shouldPlay=${shouldPlayMusic}`);

    if (shouldPlayMusic) {
      console.log('▶️ Démarrage musique');
      play();
    } else {
      console.log('⏸️ Arrêt musique');
      pause();
    }
  }, [step, condition, audioReady]);

  // === START (Audio Authorization) ===
  const handleAudioStart = async () => {
    try {
      // Load music file and wait for it to be ready
      await loadTrack('/musique/musique.mp3');
      console.log('✅ Audio complètement chargé, prêt à être utilisé');
      setAudioReady(true);
      // Initialize images once at the start
      initializeImages();
      setStep('welcome');
    } catch (err) {
      console.error('❌ Impossible de charger l\'audio:', err);
      // Continuer quand même sans audio
      setAudioReady(false);
      initializeImages();
      setStep('welcome');
    }
  };

  // === QUESTIONNAIRE ===
  const handleQuestionnaireSubmit = async (e) => {
    e.preventDefault();

    const isHabitue = musicHabit >= 5; // ≥5 = habitué
    const pid = `P${Date.now()}`;

    console.log('🎯 Demande assignation déterministe au backend...');

    try {
      // Demander au backend quelle condition assigner (déterministe pour 50/50)
      const response = await fetch('/api/assign-condition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHabitue }),
      });

      if (!response.ok) {
        throw new Error('Erreur assignation condition');
      }

      const { condition: assignedCondition } = await response.json();

      console.log('🎯 Assignation déterministe reçue:', {
        musicHabit,
        isHabitue: isHabitue ? 'OUI (≥5)' : 'NON (<5)',
        condition: assignedCondition,
        participantId: pid.substring(0, 12) + '...',
      });
      console.log(`🎯 ${assignedCondition === 'C1' ? 'C1 = Silence puis Musique' : 'C2 = Musique puis Silence'}`);

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

      // Go to first categorization instructions (first 21 images)
      setCatImages(getCatImages(1));
      setCatCurrentIndex(0);
      setStep('inst_cat1');

    } catch (error) {
      console.error('❌ Erreur assignation:', error);
      // Fallback en cas d'erreur backend
      const fallbackCondition = 'C1';
      console.warn('⚠️ Fallback sur C1');
      setCondition(fallbackCondition);
      setParticipantId(pid);

      updateData('questionnaire', {
        age: parseInt(age),
        gender,
        musicHabit,
        fatigue,
        stress,
        isHabitue,
        condition: fallbackCondition,
        timestamp: new Date().toISOString(),
      });

      setCatImages(getCatImages(1));
      setCatCurrentIndex(0);
      setStep('inst_cat1');
    }
  };

  // === CATEGORIZATION ===
  const handleCatResponse = useCallback((response) => {
    const rt = performance.now() - catStartTime;
    const currentSeries = step === 'cat1' ? 1 : 2;

    addTrialData(`categorization${currentSeries}`, {
      trial: catCurrentIndex + 1,
      image: catImages[catCurrentIndex]?.filename,
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
          handleCatResponse('interieur');
        } else if (e.key === 'j' || e.key === 'J') {
          handleCatResponse('exterieur');
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
        setCatImages(getCatImages(2)); // Second 21 images for cat2
        setCatCurrentIndex(0);
        setStep('inst_cat2');
      } else {
        // Experiment complete - export data
        setStep('thank_you');
        // Wait for state update to complete before exporting
        setTimeout(() => {
          exportData()
            .then(() => setExportStatus('success'))
            .catch(() => setExportStatus('error'));
        }, 0);
      }
    } else {
      setPvtCurrentTrial(prev => prev + 1);
      setPvtTimer('0000');
      startPVTTrial();
    }
  }, [pvtState, pvtStartTime, pvtCurrentTrial, step, pvtBlockStartTime, pvtLastKeyPressTime, addTrialData, startPVTTrial, exportData, getCatImages]);

  useEffect(() => {
    if ((step === 'pvt1' || step === 'pvt2') && pvtState === 'ready') {
      setPvtBlockStartTime(performance.now());
      setPvtCurrentTrial(0);
      setTimeout(() => startPVTTrial(), 1000);
    }
  }, [step, pvtState, startPVTTrial]);

  useEffect(() => {
    if (pvtState === 'stimulus' && (step === 'pvt1' || step === 'pvt2')) {
      const handleSpace = (e) => {
        if (e.code === 'Space') {
          e.preventDefault();
          handlePVTResponse();
        }
      };

      window.addEventListener('keydown', handleSpace);
      return () => window.removeEventListener('keydown', handleSpace);
    }
  }, [pvtState, step, handlePVTResponse]);

  // Cleanup PVT timer
  useEffect(() => {
    return () => {
      if (pvtTimerRef.current) {
        cancelAnimationFrame(pvtTimerRef.current);
      }
    };
  }, []);

  // Cleanup PVT when entering thank_you (stop timer and remove listeners)
  useEffect(() => {
    if (step === 'thank_you') {
      console.log('🛑 Thank you: nettoyage complet PVT');
      // Stop timer animation
      if (pvtTimerRef.current) {
        cancelAnimationFrame(pvtTimerRef.current);
        pvtTimerRef.current = null;
      }
      // Reset PVT state
      setPvtState('ready');
      setPvtTimer('0000');
    }
  }, [step]);

  // DEV MODE: Skip PVT with Escape key
  useEffect(() => {
    const handleDevSkip = (e) => {
      if (e.key === 'Escape' && (step === 'pvt1' || step === 'pvt2')) {
        console.log('⚠️ [DEV MODE] Skipping PVT with Escape');

        // Generate fake data
        const fakeTrials = Array.from({ length: 10 }, (_, i) => ({
          trial: i + 1,
          rt: 200 + Math.random() * 300, // Random RT between 200-500ms
          timestamp: new Date().toISOString(),
        }));

        // Add fake data
        const currentBlock = step === 'pvt1' ? 'pvtBlock1' : 'pvtBlock2';
        console.log(`⚠️ [DEV MODE] Génération de ${fakeTrials.length} essais fake pour ${currentBlock}`);
        console.log(`⚠️ [DEV MODE] Exemple RT: ${fakeTrials.slice(0, 3).map(t => Math.round(t.rt)).join('ms, ')}ms`);
        updateData(currentBlock, fakeTrials);

        // Move to next step
        setPvtState('ready');
        if (pvtTimerRef.current) {
          cancelAnimationFrame(pvtTimerRef.current);
          pvtTimerRef.current = null;
        }

        if (step === 'pvt1') {
          console.log('⚠️ [DEV MODE] → Passage à inst_cat2');
          setCatImages(getCatImages(2));
          setCatCurrentIndex(0);
          setStep('inst_cat2');
        } else {
          console.log('⚠️ [DEV MODE] → Passage à thank_you');
          setStep('thank_you');
          // Wait for state update to complete before exporting
          setTimeout(() => {
            exportData()
              .then(() => {
                console.log('✅ [DEV MODE] Export réussi');
                setExportStatus('success');
              })
              .catch((err) => {
                console.error('❌ [DEV MODE] Export échoué:', err);
                setExportStatus('error');
              });
          }, 0);
        }
      }
    };

    window.addEventListener('keydown', handleDevSkip);
    return () => window.removeEventListener('keydown', handleDevSkip);
  }, [step, exportData, getCatImages, updateData]);

  // Calculate stats for thank you page (memoized to avoid recalculating 4 times)
  const stats = useMemo(() => {
    const pvt1 = data.pvtBlock1 || [];
    const pvt2 = data.pvtBlock2 || [];

    console.log('📊 Calcul stats RT:', {
      condition,
      pvt1Length: pvt1.length,
      pvt2Length: pvt2.length,
      pvt1Sample: pvt1.slice(0, 3),
      pvt2Sample: pvt2.slice(0, 3),
    });

    const calculateMean = (arr) => {
      if (!arr.length) return 0;
      const sum = arr.reduce((acc, trial) => acc + trial.rt, 0);
      const mean = Math.round(sum / arr.length);
      console.log(`  → Moyenne de ${arr.length} essais: ${mean}ms`);
      return mean;
    };

    // Determine which block had music
    const isMusicFirst = condition === 'C2';
    console.log(`  → Condition: ${condition}, musique ${isMusicFirst ? 'AVANT (pvt1)' : 'APRÈS (pvt2)'}`);

    const rtWithMusic = isMusicFirst ? calculateMean(pvt1) : calculateMean(pvt2);
    const rtWithoutMusic = isMusicFirst ? calculateMean(pvt2) : calculateMean(pvt1);

    console.log('📊 Résultats finaux:', { rtWithMusic, rtWithoutMusic });

    return { rtWithMusic, rtWithoutMusic };
  }, [data.pvtBlock1, data.pvtBlock2, condition]);

  // === RENDER ===
  return (
    <Layout>
      <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
        {/* START - Audio Authorization */}
        {step === 'start' && (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="flex justify-center mb-6">
              <BrainCircuit className="w-20 h-20 text-apple-gray-900" strokeWidth={1.5} />
            </div>
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
                  <label className="label-apple">Genre</label>
                  <select
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="select-apple"
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
              <p>Des images vont apparaître à l'écran</p>
              <p>Indiquez si l'objet est <strong>intérieur</strong> ou <strong>extérieur</strong></p>

              <div className="bg-apple-gray-50 p-8 rounded-2xl inline-block">
                <div className="space-y-4 text-xl">
                  <p><kbd className="px-4 py-2 bg-white rounded-xl shadow-soft font-mono font-bold border border-apple-gray-200">F</kbd> = Intérieur</p>
                  <p><kbd className="px-4 py-2 bg-white rounded-xl shadow-soft font-mono font-bold border border-apple-gray-200">J</kbd> = Extérieur</p>
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
            <div className="mb-16 flex justify-center">
              <div className="relative rounded-3xl overflow-hidden shadow-soft-xl border border-apple-gray-200">
                <img
                  src={catImages[catCurrentIndex].url}
                  alt={catImages[catCurrentIndex].name}
                  className="w-96 h-96 object-cover"
                  loading="eager"
                />
              </div>
            </div>

            <div className="flex gap-12 justify-center">
              <div className="text-apple-gray-600">
                <kbd className="px-6 py-3 bg-apple-gray-100 rounded-xl font-mono font-bold text-2xl shadow-soft">F</kbd>
                <p className="mt-4 text-lg">Intérieur</p>
              </div>
              <div className="text-apple-gray-600">
                <kbd className="px-6 py-3 bg-apple-gray-100 rounded-xl font-mono font-bold text-2xl shadow-soft">J</kbd>
                <p className="mt-4 text-lg">Extérieur</p>
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
          <div className="text-center w-full relative">
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

            {/* Dev mode indicator */}
            <div className="fixed bottom-4 right-4 opacity-20 hover:opacity-100 transition-opacity">
              <p className="text-xs text-apple-gray-400 bg-apple-gray-50 px-3 py-2 rounded-lg border border-apple-gray-200">
                DEV: <kbd className="text-xs bg-apple-gray-100 px-1.5 py-0.5 rounded">Esc</kbd> pour skip
              </p>
            </div>
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
                <p className="text-5xl font-bold text-apple-gray-900">
                  {stats.rtWithMusic || '-'}
                </p>
                <p className="text-sm text-apple-gray-500 mt-2">
                  {stats.rtWithMusic ? 'millisecondes' : 'aucune donnée'}
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-soft-lg border border-apple-gray-200">
                <p className="text-sm uppercase tracking-wide text-apple-gray-500 mb-2">Sans musique</p>
                <p className="text-5xl font-bold text-apple-gray-900">
                  {stats.rtWithoutMusic || '-'}
                </p>
                <p className="text-sm text-apple-gray-500 mt-2">
                  {stats.rtWithoutMusic ? 'millisecondes' : 'aucune donnée'}
                </p>
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
