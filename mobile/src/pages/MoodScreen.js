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
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';
import moodService from '../api/moodService';
import Button from '../components/Button';

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
    if (selectedMood === null) {
      setError('Please select a mood');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await moodService.createMood({
        moodLevel: selectedMood,
        notes: notes,
      });

      setSelectedMood(null);
      setNotes('');
      await fetchRecentMoods();
    } catch (err) {
      setError(err.message || 'Failed to save mood');
    } finally {
      setLoading(false);
    }
  };

  const getMoodColor = (value) => {
    return MOOD_OPTIONS.find((m) => m.value === value)?.color || '#6366f1';
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
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>How are you feeling?</Text>

        <View style={styles.moodGrid}>
          {MOOD_OPTIONS.map((mood) => (
            <TouchableOpacity
              key={mood.value}
              style={[
                styles.moodButton,
                { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border },
                selectedMood === mood.value && styles.moodButtonSelected,
                selectedMood === mood.value && {
                  backgroundColor: mood.color,
                },
              ]}
              onPress={() => setSelectedMood(mood.value)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text
                style={[
                  styles.moodLabel,
                  selectedMood !== mood.value && { color: theme.colors.textSecondary },
                  selectedMood === mood.value && styles.moodLabelSelected,
                ]}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}

        <View style={styles.notesContainer}>
          <Text style={[styles.notesLabel, { color: theme.colors.text }]}>Add notes (optional)</Text>
          <TouchableOpacity
            style={[styles.notesInput, { borderColor: getMoodColor(selectedMood), backgroundColor: theme.colors.inputBg }]}
            onPress={() => {
              // In a real app, you'd open a modal or navigate to a text editor
            }}
          >
            <Text style={[styles.notesPlaceholder, { color: theme.colors.textTertiary }]}>
              {notes || 'What triggered this mood?'}
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Save Mood"
          onPress={handleSubmitMood}
          loading={loading}
          style={styles.saveButton}
          disabled={selectedMood === null}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Moods</Text>

        {fetchingMoods ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 20 }} />
        ) : recentMoods.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.colors.textTertiary }]}>No moods logged yet.</Text>
        ) : (
          <View>
            {recentMoods.map((mood, index) => {
              const moodOption = MOOD_OPTIONS.find((m) => m.value === mood.moodLevel);
              return (
                <View key={index} style={[styles.moodItem, { backgroundColor: theme.colors.cardBg }]}>
                  <View style={styles.moodItemLeft}>
                    <Text style={styles.moodItemEmoji}>{moodOption?.emoji}</Text>
                    <View style={styles.moodItemInfo}>
                      <Text style={[styles.moodItemLabel, { color: theme.colors.text }]}>{moodOption?.label}</Text>
                      <Text style={[styles.moodItemDate, { color: theme.colors.textTertiary }]}>
                        {new Date(mood.timestamp).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
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
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 12,
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
  moodItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moodItemEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  moodItemInfo: {
    flex: 1,
  },
  moodItemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  moodItemDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
});
