import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';

const STEPS = [
  {
    number: '1',
    title: 'Set a Quit Date',
    description: 'Choose a specific date within the next 2 weeks. Tell family and friends about your decision.',
    icon: 'calendar-check',
  },
  {
    number: '2',
    title: 'Identify Your Triggers',
    description: 'Write down situations, emotions, or activities that make you want to use. Plan how to avoid or handle them.',
    icon: 'lightbulb-alert',
  },
  {
    number: '3',
    title: 'Build Your Support System',
    description: 'Inform people who can help. Join support groups. Consider therapy or counseling.',
    icon: 'account-heart',
  },
  {
    number: '4',
    title: 'Plan for Withdrawal',
    description: 'Know what to expect. Prepare healthy alternatives. Have medication options available if needed.',
    icon: 'medical-bag',
  },
  {
    number: '5',
    title: 'Remove Temptations',
    description: 'Clean your environment. Remove stashed supplies, paraphernalia, or reminders.',
    icon: 'broom',
  },
  {
    number: '6',
    title: 'Develop Coping Strategies',
    description: 'Exercise, meditation, hobbies, journaling. Find healthy ways to manage stress and cravings.',
    icon: 'yoga',
  },
  {
    number: '7',
    title: 'Find Your Why',
    description: 'Identify deep reasons for quitting. Write them down. Revisit them when struggling.',
    icon: 'heart',
  },
  {
    number: '8',
    title: 'Track Your Progress',
    description: 'Use this app, journaling, or a calendar. Celebrate milestones. See how far you\'ve come.',
    icon: 'chart-line',
  },
];

const DAILY_TIPS = [
  'Drink plenty of water',
  'Exercise for at least 30 minutes',
  'Eat nutritious meals',
  'Get 7-9 hours of sleep',
  'Practice deep breathing or meditation',
  'Avoid triggers and risky situations',
  'Talk to someone when struggling',
  'Use the app to track mood and cravings',
  'Reward yourself with something you enjoy',
  'Remember your reasons for quitting',
];

export default function HowToSucceedScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);

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
      <Text style={[styles.pageTitle, { color: theme.colors.text }]}>Your Path to Success</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        8 key steps to achieve lasting recovery
      </Text>

      {/* Steps */}
      <View style={styles.section}>
        {STEPS.map((step, index) => (
          <View
            key={step.number}
            style={[
              styles.stepCard,
              { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border },
              index % 2 === 0 && { borderLeftColor: theme.colors.primary, borderLeftWidth: 4 }
            ]}
          >
            <View style={[styles.numberCircle, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.stepNumber}>{step.number}</Text>
            </View>
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <MaterialCommunityIcons name={step.icon} size={20} color={theme.colors.primary} />
                <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                  {step.title}
                </Text>
              </View>
              <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
                {step.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Daily Tips */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Daily Habits for Success</Text>
        <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
          These daily actions will support your recovery:
        </Text>

        {DAILY_TIPS.map((tip, index) => (
          <View
            key={index}
            style={[styles.tipItem, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
          >
            <View style={[styles.tipNumber, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.tipNumberText}>{index + 1}</Text>
            </View>
            <Text style={[styles.tipText, { color: theme.colors.text }]}>
              {tip}
            </Text>
          </View>
        ))}
      </View>

      {/* Timeline */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recovery Timeline</Text>
        
        <View style={[styles.timelineItem, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.timelinePeriod, { color: theme.colors.primary }]}>Days 1-3</Text>
          <Text style={[styles.timelineContent, { color: theme.colors.text }]}>
            Acute withdrawal symptoms. Stay busy. Reach out to support system.
          </Text>
        </View>

        <View style={[styles.timelineItem, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.timelinePeriod, { color: theme.colors.primary }]}>Days 4-14</Text>
          <Text style={[styles.timelineContent, { color: theme.colors.text }]}>
            Peak cravings possible. Symptoms usually improve. Sleep may normalize.
          </Text>
        </View>

        <View style={[styles.timelineItem, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.timelinePeriod, { color: theme.colors.primary }]}>Weeks 3-4</Text>
          <Text style={[styles.timelineContent, { color: theme.colors.text }]}>
            Most acute symptoms fade. Energy improves. Cravings decrease.
          </Text>
        </View>

        <View style={[styles.timelineItem, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.timelinePeriod, { color: theme.colors.primary }]}>Months 2-3</Text>
          <Text style={[styles.timelineContent, { color: theme.colors.text }]}>
            Physical symptoms mostly gone. Psychological cravings may occur. Brain healing begins.
          </Text>
        </View>

        <View style={[styles.timelineItem, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.timelinePeriod, { color: theme.colors.primary }]}>Months 3-12</Text>
          <Text style={[styles.timelineContent, { color: theme.colors.text }]}>
            Continued improvement. New habits forming. Confidence growing.
          </Text>
        </View>
      </View>

      {/* Remember */}
      <View style={[styles.rememberBox, { backgroundColor: theme.colors.primary }]}>
        <MaterialCommunityIcons name="star" size={24} color="white" />
        <Text style={styles.rememberText}>
          Recovery is a journey, not a destination. Every day sober is a victory worth celebrating!
        </Text>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageTitle: {
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
  section: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  stepCard: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    alignItems: 'flex-start',
  },
  numberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepNumber: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    alignItems: 'center',
  },
  tipNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  tipNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  tipText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  timelineItem: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderWidth: 1,
  },
  timelinePeriod: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  timelineContent: {
    fontSize: 12,
    lineHeight: 16,
  },
  rememberBox: {
    flexDirection: 'row',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
  },
  rememberText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    fontWeight: '500',
  },
});
