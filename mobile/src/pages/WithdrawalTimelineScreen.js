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

const WITHDRAWAL_TIMELINES = {
  alcohol: {
    name: 'Alcohol Withdrawal Timeline',
    icon: 'bottle-wine',
    phases: [
      {
        time: '6-12 hours',
        severity: 'Mild',
        color: '#4caf50',
        symptoms: ['Shakiness', 'Anxiety', 'Sweating'],
        whatToExpect: 'Initial discomfort. Your body starts triggering withdrawal response within the first hours.',
        tips: ['Stay hydrated', 'Get rest', 'Avoid stress'],
      },
      {
        time: '12-24 hours',
        severity: 'Moderate',
        color: '#ff9800',
        symptoms: ['Increased anxiety', 'Heart palpitations', 'Appetite changes'],
        whatToExpect: 'Peak withdrawal symptoms. This is often the hardest time. Seek support.',
        tips: ['Call support line', 'Light exercise', 'Eat nutritious meals'],
      },
      {
        time: '24-72 hours',
        severity: 'High',
        color: '#f44336',
        symptoms: ['Possible seizures*', 'Confusion', 'Hallucinations*'],
        whatToExpect: 'Severe symptoms possible. SEEK MEDICAL HELP immediately if experiencing seizures or hallucinations.',
        tips: ['Go to hospital', 'Medical supervision essential', 'Medications may help'],
      },
      {
        time: '3-7 days',
        severity: 'Moderate',
        color: '#ff9800',
        symptoms: ['Sleep disturbance', 'Anxiety', 'Tremors subsiding'],
        whatToExpect: 'Symptoms gradually improving but still challenging.',
        tips: ['Sleep hygiene', 'Mood tracking', 'Peer support'],
      },
      {
        time: '1-4 weeks',
        severity: 'Mild',
        color: '#4caf50',
        symptoms: ['Lingering sleep issues', 'Occasional anxiety', 'Fatigue'],
        whatToExpect: 'Most physical symptoms resolved. Psychological cravings may continue.',
        tips: ['Build routine', 'Exercise', 'Counseling'],
      },
      {
        time: '1-3 months+',
        severity: 'Minimal',
        color: '#2196f3',
        symptoms: ['Post-acute withdrawal', 'Cravings', 'Mood changes'],
        whatToExpect: 'You\'ve made it through acute withdrawal! Long-term recovery begins.',
        tips: ['Maintain support', 'Healthy habits', 'Celebrate progress'],
      },
    ],
  },
  nicotine: {
    name: 'Nicotine Withdrawal Timeline',
    icon: 'cigarette-off',
    phases: [
      {
        time: 'First 30 minutes',
        severity: 'High',
        color: '#f44336',
        symptoms: ['Intense cravings', 'Irritability', 'Anxiety'],
        whatToExpect: 'The hardest moment. Cravings peak right after quitting.',
        tips: ['Drink water', 'Chew gum', 'Deep breathing'],
      },
      {
        time: 'Hours 1-3',
        severity: 'High',
        color: '#f44336',
        symptoms: ['Strong cravings', 'Restlessness', 'Difficulty concentrating'],
        whatToExpect: 'Keep busy. Cravings pass if you don\'t give in.',
        tips: ['Call a friend', 'Go for a walk', 'Stay active'],
      },
      {
        time: 'Day 1 (hours 3-24)',
        severity: 'Moderate',
        color: '#ff9800',
        symptoms: ['Irritability', 'Cravings less frequent', 'Increased appetite'],
        whatToExpect: 'By evening, cravings become less intense but still challenging.',
        tips: ['Light snacks', 'Hydration', 'Avoid triggers'],
      },
      {
        time: 'Days 2-3',
        severity: 'Moderate',
        color: '#ff9800',
        symptoms: ['Mood swings', 'Sleep disturbance', 'Concentration issues'],
        whatToExpect: 'Physical cravings peak this period. This is critical—don\'t relapse.',
        tips: ['Support group', 'Physical activity', 'Nicotine replacement'],
      },
      {
        time: 'Week 1-2',
        severity: 'Mild',
        color: '#4caf50',
        symptoms: ['Occasional cravings', 'Sleep improving', 'Stress'],
        whatToExpect: 'Most acute withdrawal passed. Cravings less frequent and intense.',
        tips: ['Daily exercise', 'Social support', 'Reward yourself'],
      },
      {
        time: '2-4 weeks',
        severity: 'Minimal',
        color: '#2196f3',
        symptoms: ['Rare cravings', 'Mood stable', 'Breathing improving'],
        whatToExpect: 'You\'ve broken the acute withdrawal cycle. Psychological cravings continue.',
        tips: ['Maintain vigilance', 'Celebrate wins', 'Long-term strategies'],
      },
    ],
  },
  cannabis: {
    name: 'Cannabis Withdrawal Timeline',
    icon: 'leaf-off',
    phases: [
      {
        time: '0-12 hours',
        severity: 'Mild',
        color: '#4caf50',
        symptoms: ['Slight irritability', 'Anxiety', 'Empty feeling'],
        whatToExpect: 'Initial withdrawal response. Mild symptoms at first.',
        tips: ['Stay busy', 'Deep breathing', 'Hydrate'],
      },
      {
        time: '1-2 days',
        severity: 'Moderate',
        color: '#ff9800',
        symptoms: ['Irritability peaks', 'Sleep problems', 'Cravings', 'Anxiety'],
        whatToExpect: 'Most difficult period. Peak withdrawal during first 48 hours.',
        tips: ['Exercise', 'Avoid triggers', 'Social support'],
      },
      {
        time: '3-7 days',
        severity: 'Moderate',
        color: '#ff9800',
        symptoms: ['Sleep disturbance', 'Appetite changes', 'Mood swings'],
        whatToExpect: 'Symptoms still present but gradually improving.',
        tips: ['Sleep routine', 'Healthy meals', 'Stress relief'],
      },
      {
        time: '1-2 weeks',
        severity: 'Mild',
        color: '#4caf50',
        symptoms: ['Lingering sleep issues', 'Occasional anxiety', 'Cravings'],
        whatToExpect: 'Most physical withdrawal passed. Psychological cravings remain.',
        tips: ['Meditation', 'Activities', 'Counseling'],
      },
      {
        time: '2-4 weeks',
        severity: 'Minimal',
        color: '#2196f3',
        symptoms: ['Emotional stability', 'Sleep improving', 'Rare cravings'],
        whatToExpect: 'Physical symptoms mostly gone. Mental health improving.',
        tips: ['Build new habits', 'Support groups', 'Long-term focus'],
      },
      {
        time: '1+ months',
        severity: 'Minimal',
        color: '#2196f3',
        symptoms: ['Post-acute withdrawal', 'Occasional cravings', 'Normal emotions'],
        whatToExpect: 'Acute withdrawal complete. Maintenance phase begins.',
        tips: ['Stay committed', 'Celebrate progress', 'Prevent relapse'],
      },
    ],
  },
};

const WithdrawalTimeline = ({ navigation }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const insets = useSafeAreaInsets();
  const [selectedAddiction, setSelectedAddiction] = useState('alcohol');

  const timeline = WITHDRAWAL_TIMELINES[selectedAddiction];

  const TimelinePhase = ({ phase, index, total }) => (
    <View style={styles.phaseContainer}>
      <View style={styles.phaseContent}>
        {/* Timeline Circle and Line */}
        <View style={styles.timelineColumn}>
          <View style={[styles.timelineCircle, { backgroundColor: phase.color }]}>
            <Text style={styles.phaseIndex}>{index}</Text>
          </View>
          {index < total && <View style={[styles.timelineLine, { backgroundColor: phase.color }]} />}
        </View>

        {/* Phase Details */}
        <View style={[styles.phaseCard, { backgroundColor: theme.card }]}>
          <View style={styles.phaseHeader}>
            <Text style={[styles.phaseTime, { color: theme.text }]}>{phase.time}</Text>
            <View style={[styles.severityBadge, { backgroundColor: phase.color + '30' }]}>
              <Text style={[styles.severityText, { color: phase.color }]}>
                {phase.severity}
              </Text>
            </View>
          </View>

          <Text style={[styles.whatToExpect, { color: theme.subtext }]}>
            {phase.whatToExpect}
          </Text>

          <Text style={[styles.symptomsTitle, { color: theme.text }]}>Symptoms:</Text>
          <View style={styles.symptomsList}>
            {phase.symptoms.map((symptom, idx) => (
              <View key={idx} style={styles.symptomItem}>
                <MaterialCommunityIcons name="circle-small" size={16} color={phase.color} />
                <Text style={[styles.symptomText, { color: theme.text }]}>{symptom}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.tipsTitle, { color: theme.text }]}>Tips:</Text>
          <View style={styles.tipsList}>
            {phase.tips.map((tip, idx) => (
              <View key={idx} style={styles.tipItem}>
                <MaterialCommunityIcons name="check" size={14} color={theme.primary} />
                <Text style={[styles.tipText, { color: theme.subtext }]}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={[styles.title, { color: theme.text }]}>Withdrawal Timeline</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>
          Know what to expect at each stage
        </Text>
      </View>

      {/* Addiction Selector */}
      <View style={styles.selectorContainer}>
        <FlatList
          horizontal
          data={Object.keys(WITHDRAWAL_TIMELINES).map(key => ({
            id: key,
            name: WITHDRAWAL_TIMELINES[key].name.split(' ')[0],
          }))}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.addictionButton,
                {
                  backgroundColor: selectedAddiction === item.id ? theme.primary : theme.card,
                  borderColor: theme.border,
                }
              ]}
              onPress={() => setSelectedAddiction(item.id)}
            >
              <Text style={[
                styles.addictionButtonText,
                { color: selectedAddiction === item.id ? 'white' : theme.text }
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          scrollEnabled
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Timeline */}
      <View style={styles.timelineWrapper}>
        {timeline.phases.map((phase, idx) => (
          <TimelinePhase
            key={idx}
            phase={phase}
            index={idx + 1}
            total={timeline.phases.length}
          />
        ))}
      </View>

      {/* Closing Message */}
      <View style={[styles.closingMessage, { backgroundColor: theme.primary + '20' }]}>
        <Text style={[styles.closingEmoji]}>💪</Text>
        <Text style={[styles.closingText, { color: theme.text }]}>
          You can do this. Withdrawal is temporary. Recovery is permanent.
        </Text>
      </View>
    </ScrollView>
  );
};

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
    fontSize: 16,
  },
  selectorContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  addictionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  addictionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  timelineWrapper: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  phaseContainer: {
    marginBottom: 20,
  },
  phaseContent: {
    flexDirection: 'row',
    gap: 15,
  },
  timelineColumn: {
    alignItems: 'center',
  },
  timelineCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseIndex: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timelineLine: {
    width: 3,
    height: 80,
    marginTop: 5,
  },
  phaseCard: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  phaseTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  whatToExpect: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  symptomsTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 6,
  },
  symptomsList: {
    gap: 4,
    marginBottom: 10,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  symptomText: {
    fontSize: 11,
  },
  tipsTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 6,
  },
  tipsList: {
    gap: 4,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tipText: {
    fontSize: 11,
  },
  closingMessage: {
    marginHorizontal: 15,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    gap: 10,
  },
  closingEmoji: {
    fontSize: 32,
  },
  closingText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default WithdrawalTimeline;
