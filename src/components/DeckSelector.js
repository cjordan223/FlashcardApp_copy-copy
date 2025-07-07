import React, { useEffect, useState } from 'react';
import './DeckSelector.css';

const acronymDecks = [
  { id: 'acs1', name: 'Acronyms Set 1', path: 'acs1.json', category: 'Terminology' },
  { id: 'acs2', name: 'Acronyms Set 2', path: 'acs2.json', category: 'Terminology' },
  { id: 'acs3', name: 'Acronyms Set 3', path: 'acs3.json', category: 'Terminology' },
  { id: 'acs4', name: 'Acronyms Set 4', path: 'acs4.json', category: 'Terminology' },
  { id: 'acs5', name: 'Acronyms Set 5', path: 'acs5.json', category: 'Terminology' },
  { id: 'acs6', name: 'Acronyms Set 6', path: 'acs6.json', category: 'Terminology' },
  { id: 'acs7', name: 'Acronyms Set 7', path: 'acs7.json', category: 'Terminology' },
  { id: 'acs8', name: 'Acronyms Set 8', path: 'acs8.json', category: 'Terminology' },
  { id: 'acs9', name: 'Acronyms Set 9', path: 'acs9.json', category: 'Terminology' },
  { id: 'acs10', name: 'Acronyms Set 10', path: 'acs10.json', category: 'Terminology' }
];

const examDecks = [
  { id: 'exam1', name: 'Practice Exam 1', path: 'exam1.json', category: 'Practice' },
  { id: 'exam2', name: 'Practice Exam 2', path: 'exam2.json', category: 'Practice' },
  { id: 'exam3', name: 'Practice Exam 3', path: 'exam3.json', category: 'Practice' },
  { id: 'exam4', name: 'Practice Exam 4', path: 'exam4.json', category: 'Practice' },
  { id: 'exam5', name: 'Practice Exam 5', path: 'exam5.json', category: 'Practice' },
  { id: 'exam6', name: 'Practice Exam 6', path: 'exam6.json', category: 'Practice' },
  { id: 'exam7', name: 'Practice Exam 7', path: 'exam7.json', category: 'Practice' },
  { id: 'exam8', name: 'Practice Exam 8', path: 'exam8.json', category: 'Practice' },
  { id: 'exam9', name: 'Practice Exam 9', path: 'exam9.json', category: 'Practice' },
  { id: 'exam10', name: 'Practice Exam 10', path: 'exam10.json', category: 'Practice' },
  { id: 'exam11', name: 'Practice Exam 11', path: 'exam11.json', category: 'Practice' },
  { id: 'exam12', name: 'Practice Exam 12', path: 'exam12.json', category: 'Practice' },
  { id: 'exam13', name: 'Practice Exam 13', path: 'exam13.json', category: 'Practice' },
  { id: 'exam14', name: 'Practice Exam 14', path: 'exam14.json', category: 'Practice' },
  { id: 'exam15', name: 'Practice Exam 15', path: 'exam15.json', category: 'Practice' },
  { id: 'exam16', name: 'Practice Exam 16', path: 'exam16.json', category: 'Practice' },
  { id: 'exam17', name: 'Practice Exam 17', path: 'exam17.json', category: 'Practice' },
  { id: 'exam18', name: 'Practice Exam 18', path: 'exam18.json', category: 'Practice' },
  { id: 'exam19', name: 'Practice Exam 19', path: 'exam19.json', category: 'Practice' },
  { id: 'exam20', name: 'Practice Exam 20', path: 'exam20.json', category: 'Practice' },
  { id: 'exam21', name: 'Practice Exam 21', path: 'exam21.json', category: 'Practice' },
  { id: 'exam22', name: 'Practice Exam 22', path: 'exam22.json', category: 'Practice' },
  { id: 'exam23', name: 'Practice Exam 23', path: 'exam23.json', category: 'Practice' },
  { id: 'exam24', name: 'Practice Exam 24', path: 'exam24.json', category: 'Practice' }
];

const statusColors = {
  'completed': 'green',
  'in-progress': 'goldenrod',
  'not-started': 'gray'
};

const DeckSelector = ({ onDeckSelect, progress }) => {
  const [questionCounts, setQuestionCounts] = useState({});
  const [openSection, setOpenSection] = useState('acronyms');

  useEffect(() => {
    const fetchCounts = async () => {
      const counts = {};
      await Promise.all(
        [...acronymDecks, ...examDecks].map(async (deck) => {
          try {
            const res = await fetch(`/${deck.path}`);
            const data = await res.json();
            counts[deck.id] = data.questions.length;
          } catch {
            counts[deck.id] = 0;
          }
        })
      );
      setQuestionCounts(counts);
    };
    fetchCounts();
  }, []);

  const renderDeckGrid = (decks) => (
    <div className="decks-grid compact">
      {decks.map((deck) => {
        const deckProgress = progress?.decks?.[deck.id] || {};
        const status = deckProgress.status || 'not-started';
        const highScore = deckProgress.highScore;
        let scoreBadge = null;
        let scoreColor = 'gray';
        if (typeof highScore === 'number') {
          if (highScore === 100) {
            scoreColor = 'green';
          } else if (highScore > 0) {
            scoreColor = 'goldenrod';
          } else {
            scoreColor = 'red';
          }
          scoreBadge = (
            <span className="deck-best-effort-badge" style={{ background: scoreColor, color: scoreColor === 'goldenrod' ? '#222' : '#fff' }}>{highScore}%</span>
          );
        } else {
          scoreBadge = (
            <span className="deck-best-effort-badge" style={{ background: 'gray', color: '#fff' }}>0%</span>
          );
        }
        return (
          <div
            key={deck.id}
            className={`deck-card compact status-${status}`}
            onClick={() => onDeckSelect(deck)}
            style={{ borderColor: statusColors[status], borderWidth: status !== 'not-started' ? 2 : 1, borderStyle: 'solid' }}
          >
            <div className="deck-icon compact">
              {deck.category === 'Terminology' ? '📚' : '📝'}
              <span className="deck-status-dot" style={{ background: statusColors[status] }}></span>
            </div>
            <div className="deck-title-row">
              <span className="deck-title">{deck.name}</span>
              <span className="deck-badge">{questionCounts[deck.id] ? `${questionCounts[deck.id]}` : '...'} Qs</span>
            </div>
            <span className={`deck-type-badge ${deck.category === 'Terminology' ? 'acronym' : 'practice'}`}>{deck.category}</span>
            <div className="deck-best-effort-row">{scoreBadge}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="deck-selector">
      <div className="dashboard-header">
        <h1>Security+ Flashcards</h1>
        <span className="dashboard-sub">Choose a deck to start studying</span>
        {progress && (
          <div className="streak-display">
            <span role="img" aria-label="fire">🔥</span> Current Streak: <b>{progress.studyStreak}</b> day{progress.studyStreak === 1 ? '' : 's'}
          </div>
        )}
      </div>
      <div className="section-group">
        <div className="section-header" onClick={() => setOpenSection(openSection === 'acronyms' ? null : 'acronyms')}>
          <span className="section-title">Acronym Sets</span>
          <span className="section-toggle">{openSection === 'acronyms' ? '▲' : '▼'}</span>
        </div>
        {openSection === 'acronyms' && renderDeckGrid(acronymDecks)}
      </div>
      <div className="section-group">
        <div className="section-header" onClick={() => setOpenSection(openSection === 'exams' ? null : 'exams')}>
          <span className="section-title">Practice Exams</span>
          <span className="section-toggle">{openSection === 'exams' ? '▲' : '▼'}</span>
        </div>
        {openSection === 'exams' && renderDeckGrid(examDecks)}
      </div>
      <div className="footer">
        <p>Select a deck to begin your Security+ study session</p>
      </div>
    </div>
  );
};

export default DeckSelector; 