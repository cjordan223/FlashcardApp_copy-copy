import React, { createContext, useContext, useState, useEffect } from 'react';

// Progress data model
const defaultProgress = {
  lastStudiedDate: null,
  studyStreak: 0,
  decks: {
    // Acronym Sets
    acs1: { highScore: null, status: "not-started" },
    acs2: { highScore: null, status: "not-started" },
    acs3: { highScore: null, status: "not-started" },
    acs4: { highScore: null, status: "not-started" },
    acs5: { highScore: null, status: "not-started" },
    acs6: { highScore: null, status: "not-started" },
    acs7: { highScore: null, status: "not-started" },
    acs8: { highScore: null, status: "not-started" },
    acs9: { highScore: null, status: "not-started" },
    acs10: { highScore: null, status: "not-started" },
    // Practice Exams
    exam1: { highScore: null, status: "not-started" },
    exam2: { highScore: null, status: "not-started" },
    exam3: { highScore: null, status: "not-started" },
    exam4: { highScore: null, status: "not-started" },
    exam5: { highScore: null, status: "not-started" },
    exam6: { highScore: null, status: "not-started" },
    exam7: { highScore: null, status: "not-started" },
    exam8: { highScore: null, status: "not-started" },
    exam9: { highScore: null, status: "not-started" },
    exam10: { highScore: null, status: "not-started" },
    exam11: { highScore: null, status: "not-started" },
    exam12: { highScore: null, status: "not-started" },
    exam13: { highScore: null, status: "not-started" },
    exam14: { highScore: null, status: "not-started" },
    exam15: { highScore: null, status: "not-started" },
    exam16: { highScore: null, status: "not-started" },
    exam17: { highScore: null, status: "not-started" },
    exam18: { highScore: null, status: "not-started" },
    exam19: { highScore: null, status: "not-started" },
    exam20: { highScore: null, status: "not-started" },
    exam21: { highScore: null, status: "not-started" },
    exam22: { highScore: null, status: "not-started" },
    exam23: { highScore: null, status: "not-started" },
    exam24: { highScore: null, status: "not-started" }
  }
};

// Data layer abstraction - can be easily swapped for different storage mechanisms
const ProgressDataLayer = {
  // Fetch progress data from localStorage (can be replaced with API calls)
  async fetchProgress() {
    try {
      const stored = localStorage.getItem('securityPlusProgress');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with default to ensure all decks are present
        return {
          ...defaultProgress,
          ...parsed,
          decks: {
            ...defaultProgress.decks,
            ...parsed.decks
          }
        };
      }
      return defaultProgress;
    } catch (error) {
      console.error('Error fetching progress:', error);
      return defaultProgress;
    }
  },

  // Save progress data to localStorage (can be replaced with API calls)
  async saveProgress(progress) {
    try {
      localStorage.setItem('securityPlusProgress', JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  }
};

const ProgressContext = createContext();

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(defaultProgress);
  const [loading, setLoading] = useState(true);

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      setLoading(true);
      try {
        const data = await ProgressDataLayer.fetchProgress();
        setProgress(data);
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  // Update progress and save
  const updateProgress = async (updates) => {
    const newProgress = {
      ...progress,
      ...updates,
      decks: {
        ...progress.decks,
        ...updates.decks
      }
    };
    
    setProgress(newProgress);
    
    try {
      await ProgressDataLayer.saveProgress(newProgress);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  // Update deck progress after quiz completion
  const updateDeckProgress = async (deckId, score, totalQuestions) => {
    const percentage = Math.round((score / totalQuestions) * 100);
    const currentDeck = progress.decks[deckId];
    // Update high score if new score is higher or if no previous high score
    const newHighScore = (typeof currentDeck.highScore !== 'number' || percentage > currentDeck.highScore)
      ? percentage
      : currentDeck.highScore;
    // Determine status based on high score
    const newStatus = newHighScore >= 90 ? "completed" : "in-progress";
    // Update streak logic
    const today = new Date().toDateString();
    const lastStudied = progress.lastStudiedDate ? new Date(progress.lastStudiedDate).toDateString() : null;
    let newStreak = progress.studyStreak;
    if (lastStudied === null) {
      newStreak = 1;
    } else if (lastStudied === today) {
      newStreak = progress.studyStreak;
    } else {
      const lastDate = new Date(progress.lastStudiedDate);
      const todayDate = new Date();
      const diffTime = todayDate - lastDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreak = progress.studyStreak + 1;
      } else {
        newStreak = 1;
      }
    }
    await updateProgress({
      lastStudiedDate: today,
      studyStreak: newStreak,
      decks: {
        [deckId]: {
          highScore: newHighScore,
          status: newStatus
        }
      }
    });
  };

  // Reload progress from storage
  const reloadProgress = async () => {
    setLoading(true);
    try {
      const data = await ProgressDataLayer.fetchProgress();
      setProgress(data);
    } catch (error) {
      console.error('Failed to reload progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    progress,
    loading,
    updateProgress,
    updateDeckProgress,
    reloadProgress
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}; 