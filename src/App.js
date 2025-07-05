import React, { useState, useEffect } from 'react';
import './App.css';
import DeckSelector from './components/DeckSelector';
import Flashcard from './components/Flashcard';
import ProgressBar from './components/ProgressBar';
import { FiChevronLeft, FiX } from 'react-icons/fi';
import { useSwipeable } from 'react-swipeable';

function App() {
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [userAnswers, setUserAnswers] = useState({});
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);

  useEffect(() => {
    if (selectedDeck) {
      loadQuestions();
    }
  }, [selectedDeck]);

  const loadQuestions = async () => {
    try {
      const response = await fetch(`/${selectedDeck.path}`);
      const data = await response.json();
      setQuestions(data.questions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResults(false);
      setShowReview(false);
      setAnsweredQuestions(new Set());
      setUserAnswers({});
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const handleAnswer = (selectedOptions) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = JSON.stringify(selectedOptions.sort()) === JSON.stringify(currentQuestion.correct_answers.sort());
    
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: selectedOptions
    }));

    if (isCorrect && !answeredQuestions.has(currentQuestionIndex)) {
      setScore(prev => prev + 1);
    }

    setAnsweredQuestions(prev => new Set([...prev, currentQuestionIndex]));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishExam = () => {
    setShowResults(true);
    setShowReview(true);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setShowReview(false);
    setAnsweredQuestions(new Set());
    setUserAnswers({});
  };

  const backToDeckSelection = () => {
    setSelectedDeck(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setShowReview(false);
    setAnsweredQuestions(new Set());
    setUserAnswers({});
  };

  const goToQuestion = (idx) => {
    setCurrentQuestionIndex(idx);
    setShowProgressModal(false);
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentQuestionIndex < questions.length - 1 && answeredQuestions.has(currentQuestionIndex)) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    },
    onSwipedRight: () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  // Main quiz UI
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = Math.round(progress);

  // Handlers for bottom nav
  const handlePrev = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
  };
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1 && answeredQuestions.has(currentQuestionIndex)) setCurrentQuestionIndex(currentQuestionIndex + 1);
  };
  const handleFinish = () => setShowFinishConfirm(true);
  const confirmFinish = () => {
    setShowFinishConfirm(false);
    setShowResults(true);
    setShowReview(true);
  };

  if (!selectedDeck) {
    return <DeckSelector onDeckSelect={setSelectedDeck} />;
  }

  if (showResults && showReview) {
    return (
      <div className="app">
        <div className="results-container">
          <h1>Exam Review</h1>
          <div className="score-display">
            <h2>Your Score: {score} / {questions.length}</h2>
            <p>Percentage: {Math.round((score / questions.length) * 100)}%</p>
          </div>
          <div className="review-list">
            {questions.map((q, idx) => {
              const userAns = userAnswers[idx] || [];
              const isCorrect = JSON.stringify((userAns).sort()) === JSON.stringify(q.correct_answers.sort());
              return (
                <div key={idx} className={`review-question ${isCorrect ? 'correct' : 'incorrect'}`}> 
                  <div className="review-q-header">
                    <span className="review-q-num">Q{idx + 1}:</span> {q.question}
                  </div>
                  <div className="review-options">
                    {q.options.map((opt, oidx) => {
                      const isUser = userAns.includes(opt);
                      const isCorrectAns = q.correct_answers.includes(opt);
                      return (
                        <span
                          key={oidx}
                          className={`review-option${isCorrectAns ? ' correct' : ''}${isUser ? ' user' : ''}`}
                        >
                          {opt}
                        </span>
                      );
                    })}
                  </div>
                  <div className="review-status">
                    {isCorrect ? '✅ Correct' : '❌ Incorrect'}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="results-buttons">
            <button onClick={resetQuiz} className="btn btn-primary">
              Try Again
            </button>
            <button onClick={backToDeckSelection} className="btn btn-secondary">
              Choose Different Deck
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="app">
        <div className="results-container">
          <h1>Quiz Complete!</h1>
          <div className="score-display">
            <h2>Your Score: {score} / {questions.length}</h2>
            <p>Percentage: {Math.round((score / questions.length) * 100)}%</p>
          </div>
          <div className="results-buttons">
            <button onClick={resetQuiz} className="btn btn-primary">
              Try Again
            </button>
            <button onClick={backToDeckSelection} className="btn btn-secondary">
              Choose Different Deck
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="app">
        <div className="loading">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="app mobile-stack">
      <div className="mobile-header">
        <button className="chevron-back" onClick={() => setSelectedDeck(null)} aria-label="Back to Decks">
          <FiChevronLeft size={28} />
        </button>
        <div className="mobile-title-row">
          <span className="mobile-title">{selectedDeck.name}</span>
          <span className="progress-pill">{progressPercent}%</span>
        </div>
      </div>
      <div className="mobile-progress-bar-wrap">
        <div className="progress-bar-tappable" onClick={() => setShowProgressModal(true)}>
          <ProgressBar progress={progress} />
        </div>
      </div>
      {showProgressModal && (
        <div className="progress-modal-overlay" onClick={() => setShowProgressModal(false)}>
          <div className="progress-modal" onClick={e => e.stopPropagation()}>
            <div className="progress-modal-header">
              <span>Jump to Question</span>
              <button className="progress-modal-close" onClick={() => setShowProgressModal(false)} aria-label="Close">
                <FiX size={24} />
              </button>
            </div>
            <div className="progress-modal-grid">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  className={`progress-modal-btn${idx === currentQuestionIndex ? ' current' : ''}${answeredQuestions.has(idx) ? ' answered' : ''}`}
                  onClick={() => goToQuestion(idx)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="mobile-content-stack" {...swipeHandlers}>
        <div className="mobile-question-number">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <Flashcard
          question={currentQuestion}
          onAnswer={handleAnswer}
          userAnswer={userAnswers[currentQuestionIndex]}
          isAnswered={answeredQuestions.has(currentQuestionIndex)}
        />
      </div>
      <div className="mobile-bottom-nav">
        <button
          className="bottom-nav-btn prev"
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        <button
          className="bottom-nav-btn finish"
          onClick={handleFinish}
        >
          Finish Exam
        </button>
        <button
          className="bottom-nav-btn next"
          onClick={handleNext}
          disabled={!answeredQuestions.has(currentQuestionIndex) || currentQuestionIndex === questions.length - 1}
        >
          Next
        </button>
      </div>
      {showFinishConfirm && (
        <div className="finish-confirm-overlay" onClick={() => setShowFinishConfirm(false)}>
          <div className="finish-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="finish-confirm-title">Finish Exam?</div>
            <div className="finish-confirm-desc">Are you sure you want to finish the exam? You can review your answers after finishing.</div>
            <div className="finish-confirm-actions">
              <button className="finish-confirm-btn cancel" onClick={() => setShowFinishConfirm(false)}>Cancel</button>
              <button className="finish-confirm-btn confirm" onClick={confirmFinish}>Yes, Finish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 