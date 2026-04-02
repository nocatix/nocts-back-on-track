import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';
import Button from '../components/Button';

const MEDITATIONS = [
  {
    id: 1,
    title: 'Quick Breathing',
    duration: 5,
    description: 'A quick 5-minute breathing exercise',
    icon: '🌬️',
  },
  {
    id: 2,
    title: 'Body Scan',
    duration: 10,
    description: 'Release tension through body awareness',
    icon: '🧘',
  },
  {
    id: 3,
    title: 'Mindful Walking',
    duration: 15,
    description: 'Bring awareness to your movements',
    icon: '🚶',
  },
  {
    id: 4,
    title: 'Loving Kindness',
    duration: 20,
    description: 'Cultivate compassion for yourself and others',
    icon: '❤️',
  },
];

export default function MeditationScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const [activeMeditation, setActiveMeditation] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const startMeditation = (meditation) => {
    setActiveMeditation(meditation);
    setTimeRemaining(meditation.duration * 60);
    setIsPlaying(true);
    startAnimation();
  };

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopMeditation = () => {
    setActiveMeditation(null);
    setIsPlaying(false);
    scaleValue.setValue(1);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (activeMeditation && isPlaying) {
    return (
      <View style={[styles.meditationContainer, { backgroundColor: isDarkMode ? '#1e1b4b' : '#1e1b4b' }]}>
        <TouchableOpacity
          onPress={() => setIsPlaying(!isPlaying)}
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <View style={styles.meditationContent}>
          <Text style={styles.meditationTitle}>{activeMeditation.title}</Text>

          <Animated.View
            style={[
              styles.breathingCircle,
              {
                transform: [{ scale: scaleValue }],
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
              },
            ]}
          >
            <Text style={styles.breathingIcon}>{activeMeditation.icon}</Text>
          </Animated.View>

          <Text style={styles.meditationTime}>{formatTime(timeRemaining)}</Text>

          <Text style={styles.meditationInstruction}>
            Breathe naturally and let your thoughts drift by like clouds
          </Text>

          <View style={styles.meditationButtons}>
            <Button
              title={isPlaying ? 'Pause' : 'Resume'}
              onPress={() => setIsPlaying(!isPlaying)}
              style={styles.pauseButton}
            />
            <Button
              title="Stop"
              onPress={stopMeditation}
              style={styles.stopButton}
            />
          </View>
        </View>
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
        }
      ]}
    >
      <View style={[styles.header, { backgroundColor: theme.colors.cardBg, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Meditation & Mindfulness</Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Take time to calm your mind and body
        </Text>
      </View>

      <View style={[styles.tipsContainer, { backgroundColor: theme.colors.surfaceBackground, borderLeftColor: theme.colors.primary }]}>
        <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>💡 Tips for Meditation</Text>
        <Text style={[styles.tipItem, { color: theme.colors.textSecondary }]}>• Find a quiet, comfortable place</Text>
        <Text style={[styles.tipItem, { color: theme.colors.textSecondary }]}>• Sit or lie down in a relaxed position</Text>
        <Text style={[styles.tipItem, { color: theme.colors.textSecondary }]}>• Focus on your breath</Text>
        <Text style={[styles.tipItem, { color: theme.colors.textSecondary }]}>• Don't judge your thoughts</Text>
      </View>

      <View style={styles.meditationsSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Guided Sessions</Text>

        {MEDITATIONS.map((meditation) => (
          <TouchableOpacity
            key={meditation.id}
            onPress={() => startMeditation(meditation)}
            style={[styles.meditationCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
          >
            <View style={styles.meditationCardLeft}>
              <Text style={styles.meditationIcon}>{meditation.icon}</Text>
              <View>
                <Text style={[styles.meditationCardTitle, { color: theme.colors.text }]}>{meditation.title}</Text>
                <Text style={[styles.meditationCardDesc, { color: theme.colors.textTertiary }]}>
                  {meditation.description}
                </Text>
              </View>
            </View>
            <Text style={[styles.meditationDuration, { color: theme.colors.primary, backgroundColor: theme.colors.primary, opacity: 0.1 }]}>{meditation.duration}m</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.benefitsSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Benefits of Meditation</Text>
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>😌</Text>
          <Text style={[styles.benefitText, { color: theme.colors.text }]}>Reduces stress and anxiety</Text>
        </View>
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>🧠</Text>
          <Text style={[styles.benefitText, { color: theme.colors.text }]}>Improves mental clarity</Text>
        </View>
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>❤️</Text>
          <Text style={[styles.benefitText, { color: theme.colors.text }]}>Promotes emotional well-being</Text>
        </View>
        <View style={styles.benefitItem}>
          <Text style={styles.benefitIcon}>💤</Text>
          <Text style={[styles.benefitText, { color: theme.colors.text }]}>Better sleep quality</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    color: '#111',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  tipsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f0f9ff',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1e40af',
  },
  tipItem: {
    fontSize: 13,
    color: '#1e40af',
    marginBottom: 4,
  },
  meditationsSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
  meditationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  meditationCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  meditationIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  meditationCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  meditationCardDesc: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  meditationDuration: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  benefitsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  meditationContainer: {
    flex: 1,
    backgroundColor: '#1e1b4b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  meditationContent: {
    alignItems: 'center',
  },
  meditationTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 40,
  },
  breathingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  breathingIcon: {
    fontSize: 64,
  },
  meditationTime: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  meditationInstruction: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 40,
    lineHeight: 24,
  },
  meditationButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    paddingHorizontal: 20,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: '#6366f1',
  },
  stopButton: {
    flex: 1,
    backgroundColor: '#64748b',
  },
});
