import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';
import moodService from '../api/moodService';
import Button from '../components/Button';

// Emotion wheel colors
const PRIMARY_EMOTIONS = {
  '😊 Happy': '#FFD700',
  '😢 Sad': '#4169E1',
  '😠 Angry': '#FF4500',
  '😰 Anxious': '#FF69B4',
  '😌 Calm': '#90EE90',
  '⚡ Energetic': '#FF8C00',
  '😴 Tired': '#696969',
  '😐 Neutral': '#D3D3D3'
};

const SECONDARY_EMOTIONS = {
  '😊 Happy': ['Joyful', 'Grateful', 'Optimistic', 'Content', 'Energized'],
  '😢 Sad': ['Melancholy', 'Hopeless', 'Disappointed', 'Lonely', 'Vulnerable'],
  '😠 Angry': ['Furious', 'Frustrated', 'Irritated', 'Resentful', 'Impatient'],
  '😰 Anxious': ['Nervous', 'Worried', 'Stressed', 'Overwhelmed', 'Fearful'],
  '😌 Calm': ['Peaceful', 'Relaxed', 'Serene', 'Centered', 'Grounded'],
  '⚡ Energetic': ['Excited', 'Motivated', 'Powerful', 'Enthusiastic', 'Vibrant'],
  '😴 Tired': ['Exhausted', 'Sluggish', 'Worn Out', 'Drained', 'Lethargic'],
  '😐 Neutral': ['Indifferent', 'Detached', 'Blank', 'Unaffected', 'Numb']
};

// Helper function to lighten or darken a hex color
const adjustColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
};

// Generate color shades for secondary emotions
const getSecondaryShades = (primaryEmotion) => {
  const baseColor = PRIMARY_EMOTIONS[primaryEmotion];
  const shades = [-40, -20, 0, 20, 40];
  return shades.map(shade => adjustColor(baseColor, shade));
};

// Calculate luminance to determine text color
const getLuminance = (hexColor) => {
  const rgb = parseInt(hexColor.replace('#', ''), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  return (r * 299 + g * 587 + b * 114) / 1000;
};

// Get contrasting text color based on background
const getTextColor = (backgroundColor) => {
  const luminance = getLuminance(backgroundColor);
  return luminance > 128 ? '#000000' : '#FFFFFF';
};

const MOOD_OPTIONS = [
  { value: 1, emoji: '😢', label: 'Very Bad', color: '#ef4444' },
  { value: 2, emoji: '😞', label: 'Bad', color: '#f97316' },
  { value: 3, emoji: '😐', label: 'Neutral', color: '#eab308' },
  { value: 4, emoji: '🙂', label: 'Good', color: '#84cc16' },
  { value: 5, emoji: '😄', label: 'Excellent', color: '#22c55e' },
];

export default function MoodScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentMoods, setRecentMoods] = useState([]);
  const [fetchingMoods, setFetchingMoods] = useState(true);
  const [error, setError] = useState('');
  const [showEmotionWheel, setShowEmotionWheel] = useState(false);
  const [selectedPrimary, setSelectedPrimary] = useState(null);
  const [selectedSecondary, setSelectedSecondary] = useState(null);
  const [intensity, setIntensity] = useState(3);

  useFocusEffect(
    React.useCallback(() => {
      fetchRecentMoods();
    }, [])
  );

  const fetchRecentMoods = async () => {
    setFetchingMoods(true);
    try {
      const now = new Date();
      const data = await moodService.getMoods(now.getFullYear(), now.getMonth() + 1);
      setRecentMoods(data);
    } catch (err) {
      console.error('Error fetching moods:', err);
    } finally {
      setFetchingMoods(false);
    }
  };

  const handleSubmitMood = async () => {
    if (!selectedPrimary) {
      setError('Please select an emotion');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await moodService.createMood({
        moodLevel: selectedMood || 3,
        primaryMood: selectedPrimary,
        secondaryMood: selectedSecondary,
        intensity: intensity,
        notes: notes,
      });

      setSelectedMood(null);
      setSelectedPrimary(null);
      setSelectedSecondary(null);
      setIntensity(3);
      setNotes('');
      setShowEmotionWheel(false);
      await fetchRecentMoods();
    } catch (err) {
      setError(err.message || 'Failed to save mood');
    } finally {
      setLoading(false);
    }
  };


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
      {!showEmotionWheel ? (
        <>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>How are you feeling?</Text>

            {selectedPrimary ? (
              <View style={[styles.emotionDisplay, { backgroundColor: PRIMARY_EMOTIONS[selectedPrimary] }]}>
                <Text style={styles.emotionEmoji}>{selectedPrimary.split(' ')[0]}</Text>
                <Text style={[styles.emotionLabel, { color: getTextColor(PRIMARY_EMOTIONS[selectedPrimary]) }]}>
                  {selectedPrimary}
                </Text>
                {selectedSecondary && (
                  <Text style={[styles.secondaryLabel, { color: getTextColor(PRIMARY_EMOTIONS[selectedPrimary]) }]}>
                    {selectedSecondary}
                  </Text>
                )}
                <Text style={[styles.intensityLabel, { color: getTextColor(PRIMARY_EMOTIONS[selectedPrimary]) }]}>
                  Intensity: {intensity}/5
                </Text>
              </View>
            ) : (
              <Text style={[styles.promptText, { color: theme.colors.textSecondary }]}>
                Tap below to express how you're feeling
              </Text>
            )}

            <Button
              title={selectedPrimary ? "Change Emotion" : "Express Feeling"}
              onPress={() => {
                setShowEmotionWheel(true);
              }}
              style={styles.wheelButton}
            />

            {selectedPrimary && (
              <>
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: theme.colors.text }]}>Intensity: {intensity}/5</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={5}
                    step={1}
                    value={intensity}
                    onValueChange={(value) => setIntensity(value)}
                    minimumTrackTintColor={PRIMARY_EMOTIONS[selectedPrimary]}
                    maximumTrackTintColor={theme.colors.border}
                    thumbTintColor={PRIMARY_EMOTIONS[selectedPrimary]}
                  />
                </View>

                <View style={styles.notesContainer}>
                  <Text style={[styles.notesLabel, { color: theme.colors.text }]}>Add notes (optional)</Text>
                  <TouchableOpacity
                    style={[styles.notesInput, { borderColor: PRIMARY_EMOTIONS[selectedPrimary], backgroundColor: theme.colors.inputBg }]}
                    onPress={() => {
                      // In a real app, you'd open a modal or text input
                    }}
                  >
                    <Text style={[styles.notesPlaceholder, { color: theme.colors.textTertiary }]}>
                      {notes || 'What triggered this emotion?'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}

                <Button
                  title="Save Emotion"
                  onPress={handleSubmitMood}
                  loading={loading}
                  style={styles.saveButton}
                />
              </>
            )}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Emotions</Text>

            {fetchingMoods ? (
              <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 20 }} />
            ) : recentMoods.length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.colors.textTertiary }]}>No emotions logged yet.</Text>
            ) : (
              <View>
                {recentMoods.map((mood, index) => {
                  const primaryEmoji = mood.primaryMood ? mood.primaryMood.split(' ')[0] : '😐';
                  const moodColor = mood.primaryMood ? PRIMARY_EMOTIONS[mood.primaryMood] : '#D3D3D3';
                  return (
                    <View key={index} style={[styles.moodItem, { backgroundColor: theme.colors.cardBg }]}>
                      <View style={[styles.moodItemEmoji, { backgroundColor: moodColor }]}>
                        <Text style={styles.moodItemEmojiText}>{primaryEmoji}</Text>
                      </View>
                      <View style={styles.moodItemInfo}>
                        <Text style={[styles.moodItemLabel, { color: theme.colors.text }]}>
                          {mood.primaryMood || 'Mood logged'}
                        </Text>
                        {mood.secondaryMood && (
                          <Text style={[styles.moodItemSecondary, { color: theme.colors.textSecondary }]}>
                            {mood.secondaryMood}
                          </Text>
                        )}
                        <Text style={[styles.moodItemDate, { color: theme.colors.textTertiary }]}>
                          {new Date(mood.timestamp).toLocaleDateString()} • Intensity: {mood.intensity || mood.moodLevel}/5
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </>
      ) : (
        <View style={[styles.wheelSection, { backgroundColor: theme.colors.background }]}>
          <View style={styles.wheelHeader}>
            <TouchableOpacity onPress={() => setShowEmotionWheel(false)}>
              <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.wheelTitle, { color: theme.colors.text }]}>
              {!selectedPrimary ? "How are you feeling?" : "More specifically?"}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {!selectedPrimary ? (
            <ScrollView style={styles.emotionsContainer}>
              <Text style={[styles.wheelLabel, { color: theme.colors.textSecondary }]}>Select primary emotion</Text>
              <View style={styles.emotionGrid}>
                {Object.entries(PRIMARY_EMOTIONS).map(([emotion, color]) => (
                  <TouchableOpacity
                    key={emotion}
                    style={[styles.emotionButton, { backgroundColor: color }]}
                    onPress={() => setSelectedPrimary(emotion)}
                  >
                    <Text style={[styles.emotionButtonText, { color: getTextColor(color) }]}>
                      {emotion}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          ) : (
            <ScrollView style={styles.emotionsContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  setSelectedPrimary(null);
                  setSelectedSecondary(null);
                }}
              >
                <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>← Back</Text>
              </TouchableOpacity>

              <Text style={[styles.wheelLabel, { color: theme.colors.textSecondary }]}>
                Select your specific emotion
              </Text>

              <View style={styles.emotionGrid}>
                <TouchableOpacity
                  style={[
                    styles.emotionButton,
                    { backgroundColor: PRIMARY_EMOTIONS[selectedPrimary] },
                    !selectedSecondary && styles.emotionButtonSelected
                  ]}
                  onPress={() => setSelectedSecondary(null)}
                >
                  <Text style={[styles.emotionButtonText, { color: getTextColor(PRIMARY_EMOTIONS[selectedPrimary]) }]}>
                    {selectedPrimary}
                  </Text>
                </TouchableOpacity>

                {SECONDARY_EMOTIONS[selectedPrimary]?.map((secondary, idx) => {
                  const shades = getSecondaryShades(selectedPrimary);
                  const shadeColor = shades[idx];
                  return (
                    <TouchableOpacity
                      key={secondary}
                      style={[
                        styles.emotionButton,
                        { backgroundColor: shadeColor },
                        selectedSecondary === secondary && styles.emotionButtonSelected
                      ]}
                      onPress={() => setSelectedSecondary(secondary)}
                    >
                      <Text style={[styles.emotionButtonText, { color: getTextColor(shadeColor) }]}>
                        {secondary}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.wheelControlsContainer}>
                <Button
                  title="Apply"
                  onPress={() => setShowEmotionWheel(false)}
                  style={styles.applyButton}
                />
              </View>
            </ScrollView>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111',
  },
  promptText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  emotionDisplay: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emotionEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  emotionLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  secondaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  intensityLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  wheelButton: {
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  notesContainer: {
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    minHeight: 100,
  },
  notesPlaceholder: {
    color: '#999',
    fontSize: 14,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 12,
  },
  saveButton: {
    marginBottom: 20,
  },
  moodItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodItemEmoji: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moodItemEmojiText: {
    fontSize: 24,
  },
  moodItemInfo: {
    flex: 1,
  },
  moodItemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  moodItemSecondary: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  moodItemDate: {
    fontSize: 12,
    color: '#999',
  },
  moodItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  wheelSection: {
    flex: 1,
    paddingBottom: 20,
  },
  wheelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  wheelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  emotionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  wheelLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    color: '#666',
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  emotionButton: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emotionButtonSelected: {
    borderWidth: 3,
    borderColor: '#333',
  },
  emotionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    paddingVertical: 10,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  wheelControlsContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  applyButton: {
    marginTop: 8,
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moodButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  moodButtonSelected: {
    borderColor: 'transparent',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  moodLabelSelected: {
    color: '#fff',
  },
});
