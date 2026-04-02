import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';

const WORD_LIST = [
  'RECOVERY', 'SOBER', 'COURAGE', 'STRENGTH', 'PROGRESS', 'FREEDOM',
  'HEALING', 'TRIUMPH', 'VICTORY', 'MINDFUL', 'BALANCE', 'CLARITY',
  'GRATEFUL', 'HONEST', 'BRAVE', 'WORTHY', 'CAPABLE', 'FOCUSED',
  'HEALTHY', 'HOPEFUL', 'PEACEFUL', 'RESILIENT', 'TRANSFORM', 'BELIEVE'
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const getWordOfDay = () => {
  const today = new Date().toDateString();
  const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return WORD_LIST[seed % WORD_LIST.length];
};

export default function CravingGameScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);

  const [gameState, setGameState] = useState('loading');
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongCount, setWrongCount] = useState(0);
  const [message, setMessage] = useState('');

  const MAX_WRONG = 6;

  useFocusEffect(
    React.useCallback(() => {
      initializeGame();
    }, [])
  );

  const initializeGame = async () => {
    setGameState('loading');
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 300));
    const todayWord = getWordOfDay();
    setWord(todayWord);
    setGuessedLetters(new Set());
    setWrongCount(0);
    setMessage('');
    setGameState('playing');
  };

  const handleLetterGuess = (letter) => {
    if (guessedLetters.has(letter)) return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!word.includes(letter)) {
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);
      
      if (newWrongCount >= MAX_WRONG) {
        setGameState('lost');
        setMessage(`Game Over! The word was: ${word}`);
      }
    }

    // Check if won
    const wordLetters = new Set(word.split(''));
    const allGuessed = Array.from(wordLetters).every(l => newGuessed.has(l));
    
    if (allGuessed && wordLetters.size > 0) {
      setGameState('won');
      setMessage('Congratulations! You won!');
    }
  };

  const displayWord = word
    .split('')
    .map(letter => (guessedLetters.has(letter) ? letter : '_'))
    .join(' ');

  const isLetterGuessed = (letter) => guessedLetters.has(letter);
  const isLetterWrong = (letter) => guessedLetters.has(letter) && !word.includes(letter);

  if (gameState === 'loading') {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title */}
      <Text style={[styles.title, { color: theme.colors.text }]}>Craving Game</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Play for the day and keep your mind busy
      </Text>

      {/* Game Status */}
      <View style={[styles.statusBar, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
        <View style={styles.statusItem}>
          <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>Wrong Guesses</Text>
          <Text style={[styles.statusValue, { color: gameState === 'lost' ? theme.colors.error : theme.colors.text }]}>
            {wrongCount}/{MAX_WRONG}
          </Text>
        </View>
        
        {gameState === 'playing' && (
          <View style={styles.statusItem}>
            <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>Score</Text>
            <Text style={[styles.statusValue, { color: theme.colors.primary }]}>
              {word.length > 0 ? Math.max(0, (word.split('').filter(l => !guessedLetters.has(l)).length * 10) + 50) : 0}
            </Text>
          </View>
        )}

        {gameState === 'won' && (
          <View style={styles.statusItem}>
            <Text style={[styles.statusLabel, { color: theme.colors.success }]}>Status</Text>
            <Text style={[styles.statusValue, { color: theme.colors.success }]}>Won!</Text>
          </View>
        )}

        {gameState === 'lost' && (
          <View style={styles.statusItem}>
            <Text style={[styles.statusLabel, { color: theme.colors.error }]}>Status</Text>
            <Text style={[styles.statusValue, { color: theme.colors.error }]}>Lost!</Text>
          </View>
        )}
      </View>

      {/* Word Display */}
      <View style={[styles.wordDisplay, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
        <Text style={[styles.word, { color: theme.colors.primary, fontSize: 32 }]}>
          {displayWord}
        </Text>
      </View>

      {/* Hangman Progress */}
      <View style={[styles.hangmanContainer, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
        <MaterialCommunityIcons 
          name={
            wrongCount === 0 ? 'circle-outline' :
            wrongCount === 1 ? 'head' :
            wrongCount === 2 ? 'human-male-height-variant' :
            wrongCount === 3 ? 'human-male-board' :
            wrongCount === 4 ? 'human-male' :
            'emoticon-sad'
          }
          size={56}
          color={wrongCount >= MAX_WRONG ? theme.colors.error : theme.colors.primary}
        />
        <Text style={[styles.hangmanLabel, { color: theme.colors.textSecondary }]}>
          {MAX_WRONG - wrongCount} chances left
        </Text>
      </View>

      {/* Message */}
      {message && (
        <View style={[
          styles.message,
          { backgroundColor: gameState === 'won' ? '#dcfce7' : gameState === 'lost' ? '#fee2e2' : theme.colors.cardBg }
        ]}>
          <Text style={[
            styles.messageText,
            { color: gameState === 'won' ? '#166534' : gameState === 'lost' ? '#991b1b' : theme.colors.text }
          ]}>
            {message}
          </Text>
        </View>
      )}

      {/* Keyboard */}
      <View style={styles.keyboard}>
        {Array.from(Array(26)).map((_, i) => {
          const letter = ALPHABET[i];
          const isWrong = isLetterWrong(letter);
          const isGuessed = isLetterGuessed(letter);

          return (
            <TouchableOpacity
              key={letter}
              style={[
                styles.letterButton,
                {
                  backgroundColor: isGuessed ? (isWrong ? theme.colors.error : theme.colors.primary) : theme.colors.cardBg,
                  borderColor: theme.colors.border,
                  opacity: isGuessed ? 1 : 1,
                },
              ]}
              onPress={() => handleLetterGuess(letter)}
              disabled={isGuessed || gameState !== 'playing'}
            >
              <Text style={[
                styles.letterText,
                {
                  color: isGuessed ? 'white' : theme.colors.text,
                  opacity: isGuessed ? 1 : 1,
                }
              ]}>
                {letter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* New Game Button */}
      {gameState !== 'playing' && (
        <TouchableOpacity
          style={[styles.newGameButton, { backgroundColor: theme.colors.primary }]}
          onPress={initializeGame}
        >
          <Text style={styles.newGameButtonText}>Play Again Tomorrow</Text>
        </TouchableOpacity>
      )}

      {/* Tips */}
      <View style={styles.tipsSection}>
        <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>💡 Tips</Text>
        <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
          Each recovery-themed word is your word of the day. Play to keep your mind engaged and beat cravings!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  wordDisplay: {
    padding: 24,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  word: {
    fontWeight: '700',
    letterSpacing: 8,
  },
  hangmanContainer: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  hangmanLabel: {
    fontSize: 12,
    marginTop: 8,
  },
  message: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  letterButton: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  letterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  newGameButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  newGameButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsSection: {
    padding: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 8,
    marginTop: 16,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
