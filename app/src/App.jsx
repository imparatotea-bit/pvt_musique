import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ExperimentProvider } from './contexts/ExperimentContext';
import { AudioProvider } from './contexts/AudioContext';

// Pages
import Welcome from './pages/Welcome';
import StartMusic from './pages/StartMusic';
import Demographics from './pages/Demographics';
import MusicHabits from './pages/MusicHabits';
import FatigueStress from './pages/FatigueStress';
import InstructionsPVT from './pages/InstructionsPVT';
import PVTTask from './pages/PVTTask';
import InstructionsCategorization from './pages/InstructionsCategorization';
import CategorizationTask from './pages/CategorizationTask';
import PostExperiment from './pages/PostExperiment';
import ThankYou from './pages/ThankYou';

function App() {
  return (
    <ExperimentProvider>
      <AudioProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-notion-purple-bg via-white to-notion-blue-bg">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/start-music" element={<StartMusic />} />
              <Route path="/demographics" element={<Demographics />} />
              <Route path="/music-habits" element={<MusicHabits />} />
              <Route path="/fatigue-stress" element={<FatigueStress />} />
              <Route path="/instructions-pvt" element={<InstructionsPVT />} />
              <Route path="/pvt-block-1" element={<PVTTask block={1} />} />
              <Route path="/pvt-block-2" element={<PVTTask block={2} />} />
              <Route path="/instructions-categorization" element={<InstructionsCategorization />} />
              <Route path="/categorization-1" element={<CategorizationTask series={1} />} />
              <Route path="/categorization-2" element={<CategorizationTask series={2} />} />
              <Route path="/post-experiment" element={<PostExperiment />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AudioProvider>
    </ExperimentProvider>
  );
}

export default App;
