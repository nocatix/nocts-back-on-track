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

const MindfulnessScreen = ({ navigation }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const insets = useSafeAreaInsets();

  const [expandedSections, setExpandedSections] = useState({
    intro: true,
    multitasking: false,
    diningTable: false,
    practices: false,
    integration: false,
  });

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const practices = [
    {
      icon: '☕',
      title: 'Mindful Coffee/Tea',
      description: 'Feel the warmth, savor each sip, notice the aroma. Start your day with intention.',
    },
    {
      icon: '🚶',
      title: 'Intentional Walking',
      description: 'Walk without distractions. Notice your feet, the air, the sounds around you.',
    },
    {
      icon: '💬',
      title: 'Full Listening',
      description: 'When someone speaks, truly listen. Make eye contact. Listen to understand.',
    },
    {
      icon: '🧘',
      title: 'Meditation',
      description: 'Even 5-10 minutes builds the mental muscle of mindfulness.',
    },
    {
      icon: '🛁',
      title: 'Mindful Bathing',
      description: 'Notice temperature, scent, sensation. Leave your phone outside.',
    },
    {
      icon: '📝',
      title: 'Journaling',
      description: 'Write without editing. Observe your thoughts and feelings on paper.',
    },
    {
      icon: '🎨',
      title: 'Creative Activities',
      description: 'Painting, drawing, crafting. When absorbed, you\'re fully present.',
    },
    {
      icon: '🌍',
      title: 'Nature Connection',
      description: 'Sit outside and observe. Watch birds, trees, clouds, plants.',
    },
    {
      icon: '✋',
      title: 'One-Tasking',
      description: 'Do one thing at a time with full attention. This is mindfulness in action.',
    },
    {
      icon: '🤝',
      title: 'Mindful Social Time',
      description: 'Spend time with people without phones. Real presence strengthens connections.',
    },
    {
      icon: '🎵',
      title: 'Music Listening',
      description: 'Listen fully—no scrolling. Pay attention to instruments and rhythm.',
    },
    {
      icon: '🫂',
      title: 'Mindful Hugging',
      description: 'Fully be present. Feel the embrace. Human connection supports recovery.',
    },
  ];

  const integrationSteps = [
    {
      number: '1',
      title: 'Start Small',
      description: 'Choose one mindfulness practice this week. Maybe one meal at the table, or a 5-minute walk.',
    },
    {
      number: '2',
      title: 'Notice the Difference',
      description: 'Observe how you feel after mindful activities. Calmer? More aware? More connected?',
    },
    {
      number: '3',
      title: 'Use It for Cravings',
      description: 'When a craving strikes, pause and observe it mindfully. Just notice it like a cloud passing.',
    },
    {
      number: '4',
      title: 'Build a Habit',
      description: 'After 2-3 weeks, mindfulness becomes habit. Your brain learns it as a refuge.',
    },
    {
      number: '5',
      title: 'Expand Gradually',
      description: 'As one practice becomes natural, add another. Mindfulness becomes a way of being.',
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>🧠 Mindfulness for Recovery</Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Be present. Be aware. Be free from distractions.
        </Text>
      </View>

      {/* What is Mindfulness */}
      <View style={styles.section}>
        <SectionHeader
          id="intro"
          icon="✨"
          title="What is Mindfulness?"
          onPress={() => toggleSection('intro')}
          isExpanded={expandedSections.intro}
        />
        {expandedSections.intro && (
          <SectionContent>
            <Text style={[styles.text, { color: theme.colors.text }]}>
              Mindfulness is being fully present and engaged in the moment, without judgment. It's about
              paying attention to your thoughts, feelings, and surroundings with awareness and compassion.
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.text, marginTop: 10 }]}>
              In recovery, mindfulness helps you:
            </Text>
            <View style={styles.bulletList}>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • <Text style={{ fontWeight: 'bold' }}>Break the autopilot cycle</Text> - Stop habits that
                feed addiction
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • <Text style={{ fontWeight: 'bold' }}>Manage cravings</Text> - Observe urges without
                reacting
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • <Text style={{ fontWeight: 'bold' }}>Reduce stress</Text> - Calm your nervous system
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • <Text style={{ fontWeight: 'bold' }}>Reconnect with yourself</Text> - Rediscover who you
                are
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • <Text style={{ fontWeight: 'bold' }}>Improve decisions</Text> - Live with intention
              </Text>
            </View>
          </SectionContent>
        )}
      </View>

      {/* Multi-tasking */}
      <View style={styles.section}>
        <SectionHeader
          id="multitasking"
          icon="⚡"
          title="Multi-tasking: The Enemy of Mindfulness"
          onPress={() => toggleSection('multitasking')}
          isExpanded={expandedSections.multitasking}
        />
        {expandedSections.multitasking && (
          <SectionContent>
            <Text style={[styles.text, { color: theme.colors.text }]}>
              Multi-tasking destroys mindfulness. When you juggle multiple things, your attention is
              divided and you're never truly present.
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.text, marginTop: 10 }]}>Why Multi-tasking Fails:</Text>
            <View style={styles.bulletList}>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • Fragmented attention - Never settling in the present
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • Increased stress - Mental overload and anxiety
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • Poor outcomes - Nothing gets full attention
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • Enables addiction - Perfect environment for addictions unnoticed
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • Reduced awareness - Miss warning signs and emotional cues
              </Text>
            </View>
            <View style={[styles.highlight, { backgroundColor: theme.colors.primary + '20' }]}>
              <Text style={[styles.highlightText, { color: theme.colors.text }]}>
                <Text style={{ fontWeight: 'bold' }}>The Solution:</Text> Do one thing at a time with full
                attention. When you eat, just eat. When you work, just work. Honor both the activity and
                yourself.
              </Text>
            </View>
          </SectionContent>
        )}
      </View>

      {/* Dining Table */}
      <View style={styles.section}>
        <SectionHeader
          id="diningTable"
          icon="🍽️"
          title="The Power of Eating at the Table"
          onPress={() => toggleSection('diningTable')}
          isExpanded={expandedSections.diningTable}
        />
        {expandedSections.diningTable && (
          <SectionContent>
            <Text style={[styles.text, { color: theme.colors.text }]}>
              Eating dinner at the table without distractions is one of the most transformative mindfulness
              practices for recovery.
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.text, marginTop: 10 }]}>Benefits:</Text>
            <View style={styles.bulletList}>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • Mindful awareness - Notice flavors and satisfaction you normally miss
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • Better digestion - Eating slowly improves your body's ability to digest
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • Enhanced gratitude - Appreciate the effort in preparing the meal
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • Real connection - Strengthen relationships through genuine presence
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • Interrupts habits - Table eating is intentional, not mindless
              </Text>
              <Text style={[styles.bullet, { color: theme.colors.text }]}>
                • Reduces emotional eating - Eat for hunger, not to fill emotional voids
              </Text>
            </View>
            <View style={[styles.highlight, { backgroundColor: theme.colors.primary + '20' }]}>
              <Text style={[styles.highlightText, { color: theme.colors.text }]}>
                <Text style={{ fontWeight: 'bold' }}>Try This:</Text> For one week, eat at least one meal
                at the table without screens. Notice how different the experience feels.
              </Text>
            </View>
          </SectionContent>
        )}
      </View>

      {/* Mindfulness Practices */}
      <View style={styles.section}>
        <SectionHeader
          id="practices"
          icon="🌿"
          title="Mindfulness Practices for Daily Life"
          onPress={() => toggleSection('practices')}
          isExpanded={expandedSections.practices}
        />
        {expandedSections.practices && (
          <SectionContent>
            {practices.map((practice, idx) => (
              <View key={idx} style={[styles.practiceCard, { backgroundColor: theme.colors.cardBg }]}>
                <Text style={styles.practiceIcon}>{practice.icon}</Text>
                <View style={styles.practiceContent}>
                  <Text style={[styles.practiceTitle, { color: theme.colors.text }]}>{practice.title}</Text>
                  <Text style={[styles.practiceDescription, { color: theme.colors.textSecondary }]}>
                    {practice.description}
                  </Text>
                </View>
              </View>
            ))}
          </SectionContent>
        )}
      </View>

      {/* Integration */}
      <View style={styles.section}>
        <SectionHeader
          id="integration"
          icon="🔗"
          title="Integrating Mindfulness Into Your Recovery"
          onPress={() => toggleSection('integration')}
          isExpanded={expandedSections.integration}
        />
        {expandedSections.integration && (
          <SectionContent>
            <Text style={[styles.text, { color: theme.colors.text }]}>
              Mindfulness isn't separate from recovery—it IS part of recovery. Each moment of mindfulness is
              a moment you're not on autopilot.
            </Text>
            {integrationSteps.map((step, idx) => (
              <View key={idx} style={[styles.stepContainer, { marginTop: idx > 0 ? 15 : 20 }]}>
                <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.colors.text }]}>{step.title}</Text>
                  <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
                    {step.description}
                  </Text>
                </View>
              </View>
            ))}
            <View style={[styles.closingBox, { backgroundColor: theme.colors.primary + '20', marginTop: 20 }]}>
              <Text style={[styles.closingText, { color: theme.colors.text }]}>
                Recovery is about reclaiming your life from autopilot. Every moment of mindfulness is a
                moment you're truly alive, truly yourself, and truly free.
              </Text>
            </View>
          </SectionContent>
        )}
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
  practiceCard: {
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
  },
  practiceIcon: {
    fontSize: 28,
  },
  practiceContent: {
    flex: 1,
  },
  practiceTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  practiceDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
  stepContainer: {
    flexDirection: 'row',
    gap: 12,
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
  closingBox: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closingText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
});

export default MindfulnessScreen;
