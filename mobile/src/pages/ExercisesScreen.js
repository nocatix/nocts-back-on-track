import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';

const EXERCISES = [
  {
    id: 'walking',
    name: 'Brisk Walking',
    intensity: 'Low',
    duration: '20-30 min',
    description: 'Easy on the body, great for clearing your mind',
    benefits: ['Reduces stress', 'Improves mood', 'Boosts energy'],
    icon: 'walk',
  },
  {
    id: 'running',
    name: 'Jogging/Running',
    intensity: 'High',
    duration: '30-45 min',
    description: 'Excellent cardio and endorphin release',
    benefits: ['Releases endorphins', 'Builds stamina', 'Improves sleep'],
    icon: 'run',
  },
  {
    id: 'yoga',
    name: 'Yoga',
    intensity: 'Low-Medium',
    duration: '30-60 min',
    description: 'Combines stretching, breathing, and mindfulness',
    benefits: ['Reduces anxiety', 'Increases flexibility', 'Promotes calm'],
    icon: 'yoga',
  },
  {
    id: 'cycling',
    name: 'Cycling',
    intensity: 'Medium-High',
    duration: '30-60 min',
    description: 'Fun cardio that\'s easy on joints',
    benefits: ['Low impact', 'Builds leg strength', 'Outdoor fun'],
    icon: 'bike',
  },
  {
    id: 'swimming',
    name: 'Swimming',
    intensity: 'Medium-High',
    duration: '30-45 min',
    description: 'Full body workout that\'s gentle on joints',
    benefits: ['Builds muscle', 'Low impact', 'Great cardio'],
    icon: 'swim',
  },
  {
    id: 'weights',
    name: 'Weightlifting',
    intensity: 'High',
    duration: '45-60 min',
    description: 'Build strength and channel negative energy',
    benefits: ['Builds strength', 'Improves confidence', 'Reduces stress'],
    icon: 'dumbbell',
  },
  {
    id: 'boxing',
    name: 'Boxing/Kickboxing',
    intensity: 'High',
    duration: '30-45 min',
    description: 'Release tension and channel aggression safely',
    benefits: ['Stress relief', 'Full body workout', 'Confidence boost'],
    icon: 'fist',
  },
  {
    id: 'dancing',
    name: 'Dancing',
    intensity: 'Medium-High',
    duration: '30-60 min',
    description: 'Fun, energetic, and uplifting',
    benefits: ['Improves mood', 'Social activity', 'Great cardio'],
    icon: 'dance-ballroom',
  },
];

export default function ExercisesScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const [expandedId, setExpandedId] = useState(null);

  const getIntensityColor = (intensity) => {
    if (intensity.includes('Low')) return '#22c55e';
    if (intensity.includes('Medium')) return '#f59e0b';
    if (intensity.includes('High')) return '#ef4444';
    return theme.colors.primary;
  };

  const renderExerciseItem = ({ item }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        style={[styles.exerciseCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
      >
        <View style={styles.exerciseHeader}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
            <MaterialCommunityIcons name={item.icon} size={24} color="white" />
          </View>
          <View style={styles.headerContent}>
            <Text style={[styles.exerciseName, { color: theme.colors.text }]}>
              {item.name}
            </Text>
            <View style={styles.metaRow}>
              <Text style={[styles.duration, { color: theme.colors.textSecondary }]}>
                ⏱ {item.duration}
              </Text>
              <Text
                style={[
                  styles.intensity,
                  { color: getIntensityColor(item.intensity) }
                ]}
              >
                • {item.intensity}
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={theme.colors.textSecondary}
          />
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
              {item.description}
            </Text>
            <Text style={[styles.benefitsTitle, { color: theme.colors.text }]}>
              Benefits:
            </Text>
            {item.benefits.map((benefit, idx) => (
              <View key={idx} style={styles.benefitItem}>
                <MaterialCommunityIcons name="check" size={16} color={theme.colors.primary} />
                <Text style={[styles.benefitText, { color: theme.colors.text }]}>
                  {benefit}
                </Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
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
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Exercise Ideas</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Find activities to keep your mind and body active
      </Text>

      <FlatList
        data={EXERCISES}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />

      <View style={[styles.tipBox, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
        <MaterialCommunityIcons name="information" size={20} color={theme.colors.primary} />
        <Text style={[styles.tipText, { color: theme.colors.text }]}>
          Start with activities you enjoy. Exercise releases endorphins which help reduce cravings and improve mood.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 14,
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  exerciseCard: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  headerContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 8,
  },
  duration: {
    fontSize: 11,
  },
  intensity: {
    fontSize: 11,
  },
  expandedContent: {
    marginTop: 12,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  benefitsTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  benefitText: {
    fontSize: 12,
  },
  tipBox: {
    flexDirection: 'row',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
});
