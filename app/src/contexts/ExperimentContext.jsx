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

    // Convert to CSV
    const csvRows = [];

    // Header row
    csvRows.push([
      'participantId',
      'condition',
      'timestamp',
      'section',
      'trial',
      'stimulus',
      'response',
      'correct',
      'rt',
      'data'
    ].join(','));

    // PVT trials
    ['pvtBlock1', 'pvtBlock2'].forEach(block => {
      data[block].forEach((trial, idx) => {
        csvRows.push([
          participantId,
          condition,
          trial.timestamp,
          block,
          idx + 1,
          trial.delay || '',
          trial.response || '',
          trial.valid ? 'true' : 'false',
          trial.rt || '',
          JSON.stringify(trial).replace(/,/g, ';')
        ].join(','));
      });
    });

    // Categorization trials
    ['categorization1', 'categorization2'].forEach(block => {
      data[block].forEach((trial, idx) => {
        csvRows.push([
          participantId,
          condition,
          trial.timestamp,
          block,
          idx + 1,
          trial.image || '',
          trial.response || '',
          trial.correct ? 'true' : 'false',
          trial.rt || '',
          JSON.stringify(trial).replace(/,/g, ';')
        ].join(','));
      });
    });

    const csvContent = csvRows.join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pvt_music_${participantId}_${Date.now()}.csv`;
    link.click();

    // Also send to server
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
