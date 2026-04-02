import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';
import cravingGameWords from '../data/cravingGameWords';
import Button from '../components/Button';

const getLetterStatus = (letter, position, word) => {
  if (word[position] === letter) return 'correct'; // Green
  if (word.includes(letter)) return 'present'; // Yellow
  return 'absent'; // Gray
};

export default function CravingGameScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);

  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState([]); // Array of { word, feedback }
  const [currentRow, setCurrentRow] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [message, setMessage] = useState('');
  const [showTips, setShowTips] = useState(true);

  const KEYBOARD = [
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    'ZXCVBNM'.split(''),
  ];

  // Initialize game
  useEffect(() => {
    if (!answer) {
      const randomWord = cravingGameWords[Math.floor(Math.random() * cravingGameWords.length)];
      setAnswer(randomWord);
    }
  }, [answer]);

  const handleSubmitWord = useCallback(() => {
    if (currentInput.length !== 5) {
      setMessage('Word must be 5 letters');
      setTimeout(() => setMessage(''), 2000);
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
  }, [currentInput, attempts, answer]);

  const handleLetterClick = (letter) => {
    if (gameStatus !== 'playing' || currentInput.length >= 5) return;
    setCurrentInput(currentInput + letter);
  };

  const handleBackspace = () => {
    if (currentInput.length > 0) {
      setCurrentInput(currentInput.slice(0, -1));
      setMessage('');
    }
  };

  const handleEnter = () => {
    handleSubmitWord();
  };

  const startNewGame = () => {
    const randomWord = cravingGameWords[Math.floor(Math.random() * cravingGameWords.length)];
    setAnswer(randomWord);
    setAttempts([]);
    setCurrentRow(0);
    setCurrentInput('');
    setGameStatus('playing');
    setMessage('');
  };

  const getLetterKeyStatus = (letter) => {
    for (const attempt of attempts) {
      for (const { letter: l, status } of attempt.feedback) {
        if (l === letter) return status;
      }
    }
    return null;
  };

  const getTileColor = (status) => {
    switch (status) {
      case 'correct':
        return '#10b981'; // Green
      case 'present':
        return '#f59e0b'; // Orange/Yellow
      case 'absent':
        return '#6b7280'; // Gray
      default:
        return theme.colors.border;
    }
  };

  const getTileTextColor = (status) => {
    return status ? '#ffffff' : theme.colors.text;
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, paddingTop: insets.top }
      ]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>🎮 Craving Game</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Keep your mind sharp and distracted from cravings
        </Text>
      </View>

      {message && (
        <View style={[
          styles.messageBox,
          {
            backgroundColor: gameStatus === 'won' || gameStatus === 'lost' 
              ? theme.colors.primary + '20'
              : theme.colors.warning + '20'
          }
        ]}>
          <Text style={[styles.messageText, { color: theme.colors.text }]}>
            {message}
          </Text>
        </View>
      )}

      {/* Wordle Board */}
      <View style={styles.board}>
        {Array(6).fill(null).map((_, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {Array(5).fill(null).map((_, colIdx) => {
              const attempt = attempts[rowIdx];
              const isCurrentRow = rowIdx === currentRow;
              const letterValue = isCurrentRow 
                ? currentInput[colIdx] || '' 
                : attempt?.feedback[colIdx]?.letter || '';
              const status = attempt?.feedback[colIdx]?.status;

              return (
                <View
                  key={colIdx}
                  style={[
                    styles.tile,
                    {
                      borderColor: letterValue ? getTileColor(status) : theme.colors.border,
                      backgroundColor: status ? getTileColor(status) : theme.colors.cardBg,
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.tileLetter,
                      { color: getTileTextColor(status) }
                    ]}
                  >
                    {letterValue}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* Keyboard */}
      <View style={styles.keyboardContainer}>
        {KEYBOARD.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.keyboardRow}>
            {rowIdx === 2 && (
              <TouchableOpacity
                style={[styles.keyboardButton, styles.wideButton, { backgroundColor: theme.colors.cardBg }]}
                onPress={handleBackspace}
              >
                <MaterialCommunityIcons name="backspace" size={20} color={theme.colors.text} />
              </TouchableOpacity>
            )}

            {row.map((letter) => {
              const letterStatus = getLetterKeyStatus(letter);
              return (
                <TouchableOpacity
                  key={letter}
                  style={[
                    styles.keyboardButton,
                    {
                      backgroundColor: letterStatus 
                        ? getTileColor(letterStatus)
                        : theme.colors.cardBg,
                      borderColor: theme.colors.border,
                    }
                  ]}
                  onPress={() => handleLetterClick(letter)}
                  disabled={gameStatus !== 'playing' || currentInput.length >= 5}
                >
                  <Text
                    style={[
                      styles.keyboardButtonText,
                      { color: getTileTextColor(letterStatus) }
                    ]}
                  >
                    {letter}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {rowIdx === 2 && (
              <TouchableOpacity
                style={[styles.keyboardButton, styles.wideButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleEnter}
              >
                <Text style={styles.enterButtonText}>Enter</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Game Controls */}
      {gameStatus !== 'playing' && (
        <Button
          title="Play Again"
          onPress={startNewGame}
          style={styles.playAgainButton}
        />
      )}

      {/* Tips */}
      <TouchableOpacity
        style={[styles.tipsHeader, { backgroundColor: theme.colors.cardBg }]}
        onPress={() => setShowTips(!showTips)}
      >
        <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>
          💪 How to Play
        </Text>
        <MaterialCommunityIcons
          name={showTips ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={theme.colors.primary}
        />
      </TouchableOpacity>

      {showTips && (
        <View style={[styles.tips, { backgroundColor: theme.colors.surfaceBackground }]}>
          <View style={styles.tipItem}>
            <Text style={[styles.tipLabel, { color: theme.colors.text }]}>🟩 Green</Text>
            <Text style={[styles.tipDescription, { color: theme.colors.textSecondary }]}>
              Correct letter in correct spot
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={[styles.tipLabel, { color: theme.colors.text }]}>🟨 Yellow</Text>
            <Text style={[styles.tipDescription, { color: theme.colors.textSecondary }]}>
              Correct letter in wrong spot
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={[styles.tipLabel, { color: theme.colors.text }]}>⬜ Gray</Text>
            <Text style={[styles.tipDescription, { color: theme.colors.textSecondary }]}>
              Letter not in word
            </Text>
          </View>
          <View style={[styles.divider, { borderTopColor: theme.colors.border }]} />
          <View>
            <Text style={[styles.strategyTitle, { color: theme.colors.text }]}>
              💡 Strategy Tips:
            </Text>
            <Text style={[styles.strategyText, { color: theme.colors.textSecondary }]}>
              • Use common letters first (E, A, R, O, I){'\n'}
              • Try different vowels in each guess{'\n'}
              • Cravings peak in 15-20 minutes—keep guessing until they pass{'\n'}
              • You have 6 attempts to find the word
            </Text>
          </View>
        </View>
      )}

      {/* Recovery Message */}
      <View style={[styles.recoveryBox, { backgroundColor: theme.colors.primary + '20' }]}>
        <Text style={[styles.recoveryTitle, { color: theme.colors.primary }]}>
          🧠 Why This Game Helps Recovery
        </Text>
        <Text style={[styles.recoveryText, { color: theme.colors.text }]}>
          Cravings are strongest in the first 15-20 minutes, then fade. This game occupies your mind and gives you a winning experience—proof that you can overcome challenges through focus and strategy.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageBox: {
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  board: {
    marginHorizontal: 12,
    marginBottom: 20,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  tile: {
    width: 54,
    height: 54,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileLetter: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  keyboardContainer: {
    marginHorizontal: 8,
    marginBottom: 16,
    gap: 6,
  },
  keyboardRow: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  keyboardButton: {
    minWidth: 32,
    height: 44,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  wideButton: {
    minWidth: 50,
  },
  keyboardButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  enterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  playAgainButton: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  tipsHeader: {
    marginHorizontal: 20,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  tips: {
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  tipItem: {
    marginBottom: 12,
  },
  tipLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 13,
    lineHeight: 19,
  },
  divider: {
    borderTopWidth: 1,
    marginVertical: 12,
  },
  strategyTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  strategyText: {
    fontSize: 13,
    lineHeight: 20,
  },
  recoveryBox: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  recoveryTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  recoveryText: {
    fontSize: 13,
    lineHeight: 19,
  },
});
