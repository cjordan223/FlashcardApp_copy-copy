import React, { useState, useEffect } from 'react';
import './Flashcard.css';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const Flashcard = ({ question, onAnswer, userAnswer, isAnswered }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (userAnswer) {
      setSelectedOptions(userAnswer);
      setShowFeedback(true);
    } else {
      setSelectedOptions([]);
      setShowFeedback(false);
    }
  }, [userAnswer, question]);

  const handleOptionClick = (option) => {
    if (isAnswered) return;
    let newSelectedOptions;
    if (question.correct_answers.length === 1) {
      newSelectedOptions = [option];
      setSelectedOptions(newSelectedOptions);
      onAnswer(newSelectedOptions);
      setShowFeedback(true);
    } else {
      if (selectedOptions.includes(option)) {
        newSelectedOptions = selectedOptions.filter(opt => opt !== option);
      } else {
        newSelectedOptions = [...selectedOptions, option];
      }
      setSelectedOptions(newSelectedOptions);
      if (newSelectedOptions.length === question.correct_answers.length) {
        onAnswer(newSelectedOptions);
        setShowFeedback(true);
      } else {
        setShowFeedback(false);
      }
    }
  };

  const isCorrect = () => {
    if (selectedOptions.length === 0) return false;
    return JSON.stringify(selectedOptions.sort()) === JSON.stringify(question.correct_answers.sort());
  };

  const getOptionClass = (option) => {
    if (!showFeedback) {
      return selectedOptions.includes(option) ? 'answer-card selected' : 'answer-card';
    }
    const isSelected = selectedOptions.includes(option);
    const isCorrectAnswer = question.correct_answers.includes(option);
    if (isSelected && isCorrectAnswer) {
      return 'answer-card correct';
    } else if (isSelected && !isCorrectAnswer) {
      return 'answer-card incorrect';
    } else if (!isSelected && isCorrectAnswer) {
      return 'answer-card reveal-correct';
    } else {
      return 'answer-card';
    }
  };

  return (
    <div className="flashcard mobile-flashcard">
      <div className="question-section mobile-question-section">
        <h2 className="question-text mobile-question-text">{question.question}</h2>
        {question.correct_answers.length > 1 && (
          <div className="multiple-choice-hint mobile-multi-hint">
            Select {question.correct_answers.length} answer{question.correct_answers.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
      <div className="mobile-answers-list">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={getOptionClass(option)}
            onClick={() => handleOptionClick(option)}
            disabled={isAnswered || (showFeedback && !selectedOptions.includes(option))}
            tabIndex={0}
          >
            <span className="answer-card-label">{option}</span>
            {showFeedback && question.correct_answers.includes(option) && (
              <span className="answer-card-icon correct-icon"><FiCheckCircle /></span>
            )}
            {showFeedback && selectedOptions.includes(option) && !question.correct_answers.includes(option) && (
              <span className="answer-card-icon incorrect-icon"><FiXCircle /></span>
            )}
          </button>
        ))}
      </div>
      {showFeedback && (
        <>
          <div className={`mobile-feedback-msg ${isCorrect() ? 'correct' : 'incorrect'}`}
               key={isCorrect() ? 'correct' : 'incorrect'}>
            {isCorrect() ? (
              <span><FiCheckCircle className="feedback-icon" /> Correct!</span>
            ) : (
              <span><FiXCircle className="feedback-icon" /> Incorrect</span>
            )}
          </div>
          {question.explanation && (
            <div className="explanation-box mobile-explanation-box">
              <strong>Explanation:</strong>
              <div className="explanation-text">{question.explanation}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Flashcard; 