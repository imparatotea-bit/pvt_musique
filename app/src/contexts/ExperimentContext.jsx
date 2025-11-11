import { createContext, useContext, useState, useCallback } from 'react';

const ExperimentContext = createContext();

export const useExperiment = () => {
  const context = useContext(ExperimentContext);
  if (!context) {
    throw new Error('useExperiment must be used within ExperimentProvider');
  }
  return context;
};

export const ExperimentProvider = ({ children }) => {
  const [participantId, setParticipantId] = useState(null);
  const [condition, setCondition] = useState(null);
  const [data, setData] = useState({
    demographics: {},
    musicHabits: {},
    fatigueStress: {},
    pvtBlock1: [],
    pvtBlock2: [],
    categorization1: [],
    categorization2: [],
    postExperiment: {},
  });

  const updateData = useCallback((section, newData) => {
    setData(prev => ({
      ...prev,
      [section]: newData,
    }));
  }, []);

  const addTrialData = useCallback((section, trialData) => {
    setData(prev => ({
      ...prev,
      [section]: [...prev[section], trialData],
    }));
  }, []);

  const exportData = useCallback(() => {
    const exportObject = {
      participantId,
      condition,
      timestamp: new Date().toISOString(),
      ...data,
    };

    // Send to server only (no local CSV download)
    return fetch('/api/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exportObject),
    });
  }, [participantId, condition, data]);

  const value = {
    participantId,
    setParticipantId,
    condition,
    setCondition,
    data,
    updateData,
    addTrialData,
    exportData,
  };

  return (
    <ExperimentContext.Provider value={value}>
      {children}
    </ExperimentContext.Provider>
  );
};
