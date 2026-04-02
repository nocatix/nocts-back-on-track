import React, { useState, useEffect, useCallback } from 'react';
import './CravingGame.css';
import { useNavigate } from 'react-router-dom';
import { getCookie, setCookie } from '../utils/cookieHelper';
import cravingGameWords from '../data/cravingGameWords';

// Word list for the game - 5 letter words only (imported from data file)
const WORDS = cravingGameWords;

const getLetterStatus = (letter, position, word) => {
  if (word[position] === letter) return 'correct'; // Green - right place
  if (word.includes(letter)) return 'present'; // Yellow - wrong place
  return 'absent'; // Gray - not in word
};

export default function CravingGame() {
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState([]); // Array of { word, feedback }
  const [currentRow, setCurrentRow] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [message, setMessage] = useState('');
  const [showGameTips, setShowGameTips] = useState(() => {
    const saved = getCookie('showGameTips');
    return saved !== null ? saved : true;
  });
  // Modified keyboard layout with bigger keys and repositioned backspace/enter
  const MODIFIED_KEYBOARD = [
    'QWERTYUIOP',
    'ASDFGHJKL',
    '1ZXCVBNM2'
  ];

  const startNewGame = useCallback(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setAnswer(randomWord);
    setAttempts([]);
    setCurrentRow(0);
    setCurrentInput('');
    setGameStatus('playing');
    setMessage('');
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Save game tips state to cookie
  useEffect(() => {
    setCookie('showGameTips', showGameTips, 365);
  }, [showGameTips]);

  const handleSubmitWord = useCallback(() => {
    if (currentInput.length !== 5) {
      setMessage('Word must be 5 letters');
      return;
    }

    const guessWord = currentInput.toUpperCase();
    const feedback = guessWord.split('').map((letter, idx) => ({
      letter,
      status: getLetterStatus(letter, idx, answer)
    }));

    const newAttempts = [...attempts, { word: guessWord, feedback }];
    setAttempts(newAttempts);

    // Check if won
    if (guessWord === answer) {
      setGameStatus('won');
      setMessage('🎉 Amazing! When you overcome cravings, you can overcome anything!');
      return;
    }

    // Check if lost
    if (newAttempts.length >= 6) {
      setGameStatus('lost');
      setMessage(`Game Over! The word was: ${answer}`);
      return;
    }

    setCurrentRow(newAttempts.length);
    setCurrentInput('');
    setMessage('');
  }, [currentInput, attempts, answer]);

  const handleKeyDown = useCallback((e) => {
    if (gameStatus !== 'playing') return;

    if (/^[a-zA-Z]$/.test(e.key) && currentInput.length < 5) {
      setCurrentInput(currentInput + e.key.toUpperCase());
    } else if (e.key === 'Backspace') {
      setCurrentInput(currentInput.slice(0, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmitWord();
    }
  }, [currentInput, gameStatus, handleSubmitWord]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleUndo = () => {
    if (currentInput.length > 0) {
      setCurrentInput(currentInput.slice(0, -1));
    }
  };

  const getLetterKeyStatus = (letter) => {
    for (const attempt of attempts) {
      for (const { letter: l, status } of attempt.feedback) {
        if (l === letter) return status;
      }
    }
    return null;
  };

  const handleLetterClick = (letter) => {
    if (gameStatus !== 'playing' || currentInput.length >= 5) return;
    setCurrentInput(currentInput + letter);
  };

  return (
    <div className="craving-game">
      {message && <p className={`game-message ${gameStatus}`}>{message}</p>}

      <div className="game-container">
        <div className="wordle-board">
          {Array(6).fill(null).map((_, rowIdx) => (
            <div key={rowIdx} className="wordle-row">
              {attempts[rowIdx] ? (
                // Completed row - show feedback
                attempts[rowIdx].feedback.map((item, letterIdx) => (
                  <div
                    key={letterIdx}
                    className={`wordle-tile ${item.status}`}
                  >
                    {item.letter}
                  </div>
                ))
              ) : rowIdx === currentRow ? (
                // Current row - show input
                <>
                  {Array(5).fill(null).map((_, letterIdx) => (
                    <div
                      key={letterIdx}
                      className={`wordle-tile ${letterIdx < currentInput.length ? 'filled' : ''}`}
                    >
                      {currentInput[letterIdx] || ''}
                    </div>
                  ))}
                </>
              ) : (
                // Future rows - empty
                Array(5).fill(null).map((_, letterIdx) => (
                  <div key={letterIdx} className="wordle-tile empty" />
                ))
              )}
            </div>
          ))}
        </div>

        <div className="alphabet-keyboard">
          {MODIFIED_KEYBOARD.map((row, rowIndex) => (
            <div key={rowIndex} className="keyboard-row">
              {row.split('').map((letter) => {
                const letterStatus = getLetterKeyStatus(letter);
                if ( letter === '2' ) {
                  return (
                    <button
                    onClick={handleUndo}
                    disabled={currentInput.length === 0 || gameStatus !== 'playing'}
                    className="letter-key special-key big-key"
                  >
                    ⌫
                  </button>
                  );
                } 
                else if ( letter === '1' ) {
                  return (
                    <button
                    onClick={handleSubmitWord}
                    disabled={currentInput.length !== 5 || gameStatus !== 'playing'}
                    className="letter-key special-key small-key"
                  >
                    Enter
                  </button>
                  );
                }
                return (
                  <button
                    key={letter}
                    onClick={() => handleLetterClick(letter)}
                    disabled={gameStatus !== 'playing' || currentInput.length >= 5}
                    className={`letter-key ${letterStatus || ''} big-key`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          ))}
          <div className="keyboard-row">
            
            
          </div>
        </div>

        {gameStatus !== 'playing' && (
          <button onClick={startNewGame} className="btn btn-primary play-again">
            Play Again
          </button>
        )}
      </div>

      <div className="game-tips">
        <div className="game-tips-header">
          <h3>💪 How to Play</h3>
          <button className="btn-hint-toggle-arrow" onClick={() => setShowGameTips(!showGameTips)} title={showGameTips ? 'Hide tips' : 'Show tips'}>
            {showGameTips ? '▼' : '▶'}
          </button>
        </div>
        {showGameTips && (
          <ul>
            <li>Type letters to fill each row (or use your keyboard)</li>
            <li>Press Enter or click the Enter button to submit your guess</li>
            <li>🟩 Green = correct letter in correct spot</li>
            <li>🟨 Yellow = correct letter in wrong spot</li>
            <li>⬜ Gray = letter not in word</li>
            <li>You have 6 attempts to guess the word</li>
          </ul>
        )}
      </div>
    </div>
  );
}
