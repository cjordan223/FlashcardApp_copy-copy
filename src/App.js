import React, { useState, useEffect } from 'react';
import './App.css';
import DeckSelector from './components/DeckSelector';
import Flashcard from './components/Flashcard';
import ProgressBar from './components/ProgressBar';

function App() {
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [userAnswers, setUserAnswers] = useState({});

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

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="app">
      <div className="header">
        <button onClick={backToDeckSelection} className="back-button">
          ← Back to Decks
        </button>
        <h1>{selectedDeck.name}</h1>
        <div className="score">
          Score: {score} / {questions.length}
        </div>
      </div>

      <ProgressBar progress={progress} />

      <div className="question-counter">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>

      <div className="pagination-bar pagination-above">
        {questions.map((_, idx) => (
          <button
            key={idx}
            className={`pagination-btn${idx === currentQuestionIndex ? ' active' : ''}${answeredQuestions.has(idx) ? ' answered' : ''}`}
            onClick={() => goToQuestion(idx)}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <div className="flashcard-row">
        <button
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          className="btn btn-secondary nav-side-btn prev-btn"
        >
          Previous
        </button>
        <Flashcard
          question={currentQuestion}
          onAnswer={handleAnswer}
          userAnswer={userAnswers[currentQuestionIndex]}
          isAnswered={answeredQuestions.has(currentQuestionIndex)}
        />
        <div className="right-nav-btns">
          <button
            onClick={nextQuestion}
            disabled={!answeredQuestions.has(currentQuestionIndex)}
            className="btn btn-primary nav-side-btn next-btn"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
          <button
            onClick={finishExam}
            className="btn btn-danger nav-side-btn finish-btn"
            style={{ marginLeft: 8, marginTop: 8 }}
          >
            Finish Exam
          </button>
        </div>
      </div>
    </div>
  );
}

export default App; 