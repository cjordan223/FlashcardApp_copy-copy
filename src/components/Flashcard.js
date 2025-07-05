import React, { useState, useEffect } from 'react';
import './Flashcard.css';

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
      // Single choice question
      newSelectedOptions = [option];
      setSelectedOptions(newSelectedOptions);
      onAnswer(newSelectedOptions);
      setShowFeedback(true);
    } else {
      // Multiple choice question
      if (selectedOptions.includes(option)) {
        newSelectedOptions = selectedOptions.filter(opt => opt !== option);
      } else {
        newSelectedOptions = [...selectedOptions, option];
      }
      setSelectedOptions(newSelectedOptions);
      // Only check/show feedback if user has selected the required number
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
      return selectedOptions.includes(option) ? 'option selected' : 'option';
    }
    const isSelected = selectedOptions.includes(option);
    const isCorrectAnswer = question.correct_answers.includes(option);
    if (isSelected && isCorrectAnswer) {
      return 'option correct';
    } else if (isSelected && !isCorrectAnswer) {
      return 'option incorrect';
    } else if (!isSelected && isCorrectAnswer) {
      return 'option correct-answer';
    } else {
      return 'option';
    }
  };

  return (
    <div className="flashcard">
      <div className="question-section">
        <h2 className="question-text">{question.question}</h2>
        {question.correct_answers.length > 1 && (
          <div className="multiple-choice-hint">
            Select {question.correct_answers.length} answer{question.correct_answers.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
      <div className="options-section">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={getOptionClass(option)}
            onClick={() => handleOptionClick(option)}
            disabled={isAnswered || (showFeedback && !selectedOptions.includes(option))}
          >
            <span className="option-text">{option}</span>
            {showFeedback && question.correct_answers.includes(option) && (
              <span className="correct-icon">✓</span>
            )}
            {showFeedback && selectedOptions.includes(option) && !question.correct_answers.includes(option) && (
              <span className="incorrect-icon">✗</span>
            )}
          </button>
        ))}
      </div>
      {showFeedback && (
        <div className={`feedback ${isCorrect() ? 'correct' : 'incorrect'}`}>
          <div className="feedback-header">
            <span className="feedback-icon">
              {isCorrect() ? '🎉' : '❌'}
            </span>
            <span className="feedback-text">
              {isCorrect() ? 'Correct!' : 'Incorrect'}
            </span>
          </div>
          {!isCorrect() && (
            <div className="correct-answers">
              <p>Correct answer{question.correct_answers.length > 1 ? 's' : ''}:</p>
              <ul>
                {question.correct_answers.map((answer, index) => (
                  <li key={index}>{answer}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Flashcard; 