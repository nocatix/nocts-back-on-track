import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';

const ExercisesScreen = ({ navigation }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const insets = useSafeAreaInsets();

  const [expandedSections, setExpandedSections] = useState({
    why: true,
    physical: false,
    mental: false,
    getting: false,
    tips: false,
    types: false,
    barriers: false,
  });

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const tips = [
    {
      icon: '📅',
      title: 'Schedule It',
      description: 'Treat exercise like a non-negotiable appointment. Remove decision-making.',
    },
    {
      icon: '⏰',
      title: 'Morning Time',
      description: 'Early exercising prevents derailment and sets a positive tone for your day.',
    },
    {
      icon: '🎵',
      title: 'Use Music',
      description: 'Great music makes exercise FUN. Create an energizing playlist.',
    },
    {
      icon: '👥',
      title: 'Find Your People',
      description: 'Join a class or find a buddy. Community and accountability are powerful.',
    },
    {
      icon: '🎁',
      title: 'Reward Yourself',
      description: 'Celebrate consistency. After 1 week, treat yourself (non-food reward).',
    },
    {
      icon: '💪',
      title: 'No Equipment Needed',
      description: 'Bodyweight exercises are FREE and effective. YouTube has free workouts.',
    },
    {
      icon: '📊',
      title: 'Track How You Feel',
      description: 'Monitor mood, energy, sleep, and cravings—these shift in days to weeks.',
    },
    {
      icon: '❌',
      title: 'One Day Isn\'t Failure',
      description: 'Life happens. The key: get back to it the next day. Resilience matters.',
    },
  ];

  const exerciseTypes = [
    {
      icon: '🚶',
      title: 'Cardio (Walking, Running, Cycling, Swimming)',
      benefits: 'Cardiovascular health, mood boost, stress relief, improves endurance',
      start: '20-30 minute walks are perfect. No equipment needed.',
    },
    {
      icon: '💪',
      title: 'Strength Training (Weights, Bodyweight)',
      benefits: 'Builds muscle, increases metabolism, improves confidence and strength',
      start: 'Bodyweight exercises at home. 20-30 min, 3x per week.',
    },
    {
      icon: '🧘',
      title: 'Yoga & Stretching',
      benefits: 'Flexibility, mindfulness, gentle strength, stress relief, better sleep',
      start: 'YouTube free classes. Start with beginner videos (15-20 min).',
    },
    {
      icon: '🕺',
      title: 'Dance',
      benefits: 'FUN, cardiovascular fitness, coordination, creative expression',
      start: 'Dance to your favorite music for 15 minutes. Genuinely enjoyable.',
    },
    {
      icon: '⛹️',
      title: 'Sports & Group Activities',
      benefits: 'Social connection, competitive motivation, full-body workout, FUN',
      start: 'Join a league or casual pickup game. Beginner-friendly groups exist.',
    },
  ];

  const barriers = [
    {
      title: '"I Don\'t Have Time"',
      solution: 'You make time for what matters. 10-20 minutes/day is only ~2% of your day. Attach it to existing habits.',
    },
    {
      title: '"I\'m Too Out of Shape"',
      solution: 'Everyone starts somewhere. Focus on progress. If you can walk 5 min today, walk 6 tomorrow. That\'s winning.',
    },
    {
      title: '"It\'s Boring"',
      solution: 'You chose a boring activity. Switch it up. Dance instead of running. Exercise should be FUN.',
    },
    {
      title: '"I Don\'t See Results"',
      solution: 'Look at the right metrics. Body takes weeks; mood takes days. Track FEELINGS, not just calories.',
    },
    {
      title: '"I Keep Giving Up"',
      solution: 'You\'re going too hard too fast. Start with 10 minutes. Build from there. Consistency beats intensity.',
    },
  ];

  const SectionHeader = ({ id, icon, title, onPress, isExpanded }) => (
    <TouchableOpacity
      style={[styles.sectionHeader, { backgroundColor: theme.colors.cardBg }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
      </View>
      <MaterialCommunityIcons
        name={isExpanded ? 'chevron-up' : 'chevron-down'}
        size={24}
        color={theme.colors.primary}
      />
    </TouchableOpacity>
  );

  const SectionContent = ({ children }) => (
    <View style={[styles.sectionContent, { backgroundColor: theme.colors.surfaceBackground }]}>
      {children}
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>💪 Exercise for Recovery</Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Move your body, transform your mind, rebuild your life
        </Text>
      </View>

      {/* Why Exercise */}
      <View style={styles.section}>
        <SectionHeader
          id="why"
          icon="🎯"
          title="Why Exercise Matters for Recovery"
          onPress={() => toggleSection('why')}
          isExpanded={expandedSections.why}
        />
        {expandedSections.why && (
          <SectionContent>
            <Text style={[styles.text, { color: theme.colors.text }]}>
              Exercise is one of the most powerful tools for addiction recovery. It rewires your brain, rebuilds confidence, and creates lasting change.
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.text, marginTop: 10 }]}>The Science:</Text>
            <Text style={[styles.text, { color: theme.colors.text }]}>
              Regular exercise is as effective as medication for depression and anxiety in many cases. It normalizes dopamine levels, reduces cravings, and strengthens the prefrontal cortex—the decision-making part of your brain.
            </Text>
          </SectionContent>
        )}
      </View>

      {/* Physical Benefits */}
      <View style={styles.section}>
        <SectionHeader
          id="physical"
          icon="🏃"
          title="Physical Benefits"
          onPress={() => toggleSection('physical')}
          isExpanded={expandedSections.physical}
        />
        {expandedSections.physical && (
          <SectionContent>
            <View style={styles.bulletList}>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • <Text style={{ fontWeight: 'bold' }}>Restores Health</Text> - Reverses addiction damage
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • <Text style={{ fontWeight: 'bold' }}>Increases Energy</Text> - Better sleep and circulation
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • <Text style={{ fontWeight: 'bold' }}>Improves Sleep</Text> - Critical for early recovery
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • <Text style={{ fontWeight: 'bold' }}>Reduces Pain</Text> - Natural pain management without drugs
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • <Text style={{ fontWeight: 'bold' }}>Normalizes Appetite</Text> - Regulates hunger cues
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • <Text style={{ fontWeight: 'bold' }}>Builds Strength</Text> - Physical and confidence growth
              </Text>
            </View>
          </SectionContent>
        )}
      </View>

      {/* Mental Benefits */}
      <View style={styles.section}>
        <SectionHeader
          id="mental"
          icon="🧠"
          title="Mental & Emotional Benefits"
          onPress={() => toggleSection('mental')}
          isExpanded={expandedSections.mental}
        />
        {expandedSections.mental && (
          <SectionContent>
            <View style={styles.bulletList}>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • <Text style={{ fontWeight: 'bold' }}>Natural Dopamine</Text> - Get high on endorphins, not substances
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • <Text style={{ fontWeight: 'bold' }}>Reduces Anxiety</Text> - As effective as medication
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • <Text style={{ fontWeight: 'bold' }}>Manages Cravings</Text> - 20 min shifts neurochemistry
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • <Text style={{ fontWeight: 'bold' }}>Builds Confidence</Text> - Proof that you can commit
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • <Text style={{ fontWeight: 'bold' }}>Provides Structure</Text> - Recovery needs routine
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • <Text style={{ fontWeight: 'bold' }}>Creates Mindfulness</Text> - Meditation in motion
              </Text>
            </View>
            <View style={[styles.highlight, { backgroundColor: theme.colors.primary + '20' }]}>
              <Text style={[styles.highlightText, { color: theme.colors.text }]}>
                Your brain doesn't distinguish between a natural high and a substance high—it just knows it feels good. Retrain your reward system.
              </Text>
            </View>
          </SectionContent>
        )}
      </View>

      {/* Getting Started */}
      <View style={styles.section}>
        <SectionHeader
          id="getting"
          icon="🚀"
          title="How to Get Started"
          onPress={() => toggleSection('getting')}
          isExpanded={expandedSections.getting}
        />
        {expandedSections.getting && (
          <SectionContent>
            {[
              { num: '1', title: 'Start Small', desc: 'Just 10 minutes. Consistency beats intensity.' },
              { num: '2', title: 'Enjoy It', desc: 'If you hate it, you won\'t stick with it. Exercise must be fun.' },
              { num: '3', title: 'Create a Habit', desc: 'Attach it to an existing habit. After coffee → walk.' },
              { num: '4', title: 'Make It Social', desc: 'Find a friend or join a class. Accountability matters.' },
              { num: '5', title: 'Track Progress', desc: 'Log it. After 2 weeks, visible proof builds motivation.' },
              { num: '6', title: 'Increase Gradually', desc: '10 min → 15 → 20-30. Build on success, not force.' },
            ].map((step, idx) => (
              <View key={idx} style={styles.stepContainer}>
                <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.stepNumberText}>{step.num}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.colors.text }]}>{step.title}</Text>
                  <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
                    {step.desc}
                  </Text>
                </View>
              </View>
            ))}
          </SectionContent>
        )}
      </View>

      {/* Tips */}
      <View style={styles.section}>
        <SectionHeader
          id="tips"
          icon="💡"
          title="Tips for Building Habit"
          onPress={() => toggleSection('tips')}
          isExpanded={expandedSections.tips}
        />
        {expandedSections.tips && (
          <SectionContent>
            {tips.map((tip, idx) => (
              <View key={idx} style={[styles.tipCard, { backgroundColor: theme.colors.cardBg }]}>
                <Text style={styles.tipIcon}>{tip.icon}</Text>
                <View>
                  <Text style={[styles.tipTitle, { color: theme.colors.text }]}>{tip.title}</Text>
                  <Text style={[styles.tipDescription, { color: theme.colors.textSecondary }]}>
                    {tip.description}
                  </Text>
                </View>
              </View>
            ))}
          </SectionContent>
        )}
      </View>

      {/* Types of Exercise */}
      <View style={styles.section}>
        <SectionHeader
          id="types"
          icon="🤸"
          title="Types of Exercise"
          onPress={() => toggleSection('types')}
          isExpanded={expandedSections.types}
        />
        {expandedSections.types && (
          <SectionContent>
            {exerciseTypes.map((type, idx) => (
              <View key={idx} style={[styles.typeCard, { backgroundColor: theme.colors.cardBg }]}>
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text style={[styles.typeTitle, { color: theme.colors.text }]}>{type.title}</Text>
                <Text style={[styles.typeLabel, { color: theme.colors.textSecondary }]}>Benefits:</Text>
                <Text style={[styles.typeText, { color: theme.colors.textSecondary }]}>{type.benefits}</Text>
                <Text style={[styles.typeLabel, { color: theme.colors.textSecondary, marginTop: 8 }]}>How to start:</Text>
                <Text style={[styles.typeText, { color: theme.colors.textSecondary }]}>{type.start}</Text>
              </View>
            ))}
          </SectionContent>
        )}
      </View>

      {/* Barriers */}
      <View style={styles.section}>
        <SectionHeader
          id="barriers"
          icon="🚧"
          title="Overcoming Barriers"
          onPress={() => toggleSection('barriers')}
          isExpanded={expandedSections.barriers}
        />
        {expandedSections.barriers && (
          <SectionContent>
            {barriers.map((barrier, idx) => (
              <View key={idx} style={[styles.barrierCard, { backgroundColor: theme.colors.cardBg }]}>
                <Text style={[styles.barrierTitle, { color: theme.colors.text }]}>{barrier.title}</Text>
                <Text style={[styles.barrierSolution, { color: theme.colors.textSecondary }]}>
                  {barrier.solution}
                </Text>
              </View>
            ))}
          </SectionContent>
        )}
      </View>

      {/* Closing */}
      <View style={[styles.closingBox, { backgroundColor: theme.colors.primary + '20' }]}>
        <Text style={[styles.closingText, { color: theme.colors.text }]}>
          Start today. Not tomorrow. 10 minutes. Walk around, dance, or stretch. Then do it again tomorrow. Eight weeks from now, you won't recognize yourself.
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    marginHorizontal: 15,
    marginVertical: 5,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  sectionContent: {
    marginHorizontal: 15,
    marginVertical: 5,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  bulletList: {
    marginTop: 10,
    gap: 8,
  },
  bullet: {
    fontSize: 13,
    lineHeight: 19,
  },
  highlight: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  highlightText: {
    fontSize: 13,
    lineHeight: 19,
  },
  stepContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 15,
  },
  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
  tipCard: {
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
  },
  tipIcon: {
    fontSize: 24,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
  typeCard: {
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  typeTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  typeText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  barrierCard: {
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  barrierTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  barrierSolution: {
    fontSize: 12,
    lineHeight: 18,
  },
  closingBox: {
    marginHorizontal: 15,
    marginVertical: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
  },
  closingText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  },
});

export default ExercisesScreen;
