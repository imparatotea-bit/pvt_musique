import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ExperimentProvider } from './contexts/ExperimentContext';
import { AudioProvider } from './contexts/AudioContext';

// Pages
import Welcome from './pages/Welcome';
import Questionnaire from './pages/Questionnaire';
import InstructionsCategorization from './pages/InstructionsCategorization';
import CategorizationTask from './pages/CategorizationTask';
import InstructionsPVT from './pages/InstructionsPVT';
import PVTTask from './pages/PVTTask';
import ThankYou from './pages/ThankYou';

function App() {
  return (
    <ExperimentProvider>
      <AudioProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-apple-gray-50">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/questionnaire" element={<Questionnaire />} />
              <Route path="/instructions-categorization" element={<InstructionsCategorization />} />
              <Route path="/categorization-1" element={<CategorizationTask series={1} />} />
              <Route path="/instructions-pvt" element={<InstructionsPVT />} />
              <Route path="/pvt-block-1" element={<PVTTask block={1} />} />
              <Route path="/categorization-2" element={<CategorizationTask series={2} />} />
              <Route path="/pvt-block-2" element={<PVTTask block={2} />} />
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
