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
    questionnaire: {},
    pvtBlock1: [],
    pvtBlock2: [],
    categorization1: [],
    categorization2: [],
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

    console.log('📤 Export données vers backend:', {
      participantId: exportObject.participantId,
      condition: exportObject.condition,
      pvtBlock1Length: exportObject.pvtBlock1?.length || 0,
      pvtBlock2Length: exportObject.pvtBlock2?.length || 0,
      pvtBlock1Sample: exportObject.pvtBlock1?.slice(0, 2) || [],
      pvtBlock2Sample: exportObject.pvtBlock2?.slice(0, 2) || [],
    });

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
