import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ExperimentProvider } from './contexts/ExperimentContext';
import { AudioProvider } from './contexts/AudioContext';
import Experiment from './pages/Experiment';

function App() {
  return (
    <ExperimentProvider>
      <AudioProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-apple-gray-50">
            <Routes>
              <Route path="/*" element={<Experiment />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AudioProvider>
    </ExperimentProvider>
  );
}

export default App;
