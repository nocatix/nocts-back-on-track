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

const FunctioningUserScreen = ({ navigation }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const insets = useSafeAreaInsets();
  const [expandedSections, setExpandedSections] = useState({
    illusion: true,
    brain: false,
    progression: false,
    health: false,
    relationships: false,
    cognition: false,
    recovery: false,
    final: false,
  });

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const SectionHeader = ({ id, icon, title, onPress, isExpanded }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.sectionHeader, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
    >
      <View style={styles.headerContent}>
        <Text style={styles.headerIcon}>{icon}</Text>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
      </View>
      <MaterialCommunityIcons
        name={isExpanded ? 'chevron-up' : 'chevron-down'}
        size={24}
        color={theme.colors.textSecondary}
      />
    </TouchableOpacity>
  );

  const SectionContent = ({ children }) => (
    <View style={[styles.sectionContent, { backgroundColor: theme.colors.surfaceBackground }]}>
      {children}
    </View>
  );

  const ListItem = ({ text }) => (
    <View style={styles.listItem}>
      <Text style={[styles.bullet, { color: theme.colors.primary }]}>•</Text>
      <Text style={[styles.listItemText, { color: theme.colors.text }]}>{text}</Text>
    </View>
  );

  const ResearchNote = ({ text }) => (
    <View style={[styles.noteBox, { backgroundColor: theme.colors.cardBg, borderLeftColor: theme.colors.warning }]}>
      <Text style={[styles.noteText, { color: theme.colors.text }]}>{text}</Text>
    </View>
  );

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 40,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      {/* Header */}
      <Text style={[styles.pageTitle, { color: theme.colors.text }]}>The Myth of the Functioning User</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Understanding why "functional addiction" is a dangerous illusion
      </Text>

      {/* Section 1: What is a Functioning User */}
      <SectionHeader
        id="illusion"
        icon="🎭"
        title="What is a Functioning User?"
        onPress={() => toggleSection('illusion')}
        isExpanded={expandedSections.illusion}
      />
      {expandedSections.illusion && (
        <SectionContent>
          <Text style={[styles.boldText, { color: theme.colors.text }]}>
            A "functioning user" is someone who maintains basic life responsibilities—job, housing, relationships—while
            regularly using drugs. On the surface, they appear okay. They show up, they perform, they haven't completely
            destroyed their life yet.
          </Text>
          <Text style={[styles.emphasizedText, { color: theme.colors.warning }]}>But this is an illusion. A dangerous
            one.
          </Text>
          <ListItem text="Hidden Damage: While external functioning continues, internal damage accelerates—brain chemistry, organ damage, mental health deterioration" />
          <ListItem text="Increasing Tolerance: The body requires more of the substance to achieve the same effect, driving escalating usage" />
          <ListItem text="Erosion of Judgment: Decision-making capacity degrades so gradually that impaired judgment feels normal" />
          <ListItem text="False Security: Functioning users often believe they 'have it under control,' making them less likely to seek help" />
          <ListItem text="Delayed Crisis: When the crash comes—and it does—it's often catastrophic because the dysfunction was hidden longer" />
        </SectionContent>
      )}

      {/* Section 2: Brain Chemistry Reality */}
      <SectionHeader
        id="brain"
        icon="🧠"
        title="The Brain Chemistry Reality"
        onPress={() => toggleSection('brain')}
        isExpanded={expandedSections.brain}
      />
      {expandedSections.brain && (
        <SectionContent>
          <Text style={[styles.boldText, { color: theme.colors.text }]}>
            Your brain doesn't care if you're "functioning." Addiction is fundamentally a brain disorder characterized by
            changes in neural pathways regardless of your job status.
          </Text>
          <ListItem text="Reward Pathway Hijacking: Drugs flood the brain with dopamine, overwriting natural reward systems. Your brain learns to prioritize the drug above food, sex, sleep, and social connection" />
          <ListItem text="Tolerance Development: The brain auto-adjusts to the constant chemical presence, requiring more substance to achieve the same effect—a direct path to overdose" />
          <ListItem text="Prefrontal Cortex Damage: Brain imaging shows reduced activity in decision-making regions, explaining why addiction persists despite negative consequences" />
          <ListItem text="Neurodegeneration: Repeated drug use causes actual structural brain damage. This isn't reversible overnight—recovery requires sustained effort" />
          <ListItem text="Withdrawal Syndrome: The brain becomes dependent on the drug to maintain chemical balance. Stopping triggers acute physical and psychological distress" />
          <ListItem text="Automatic Behavior Loops: Your brain stores powerful associations between cues (people, places, emotions) and drug use—these fire automatically" />
          <ResearchNote text="💡 fMRI studies show measurable brain changes in all users, regardless of functional status. The brain doesn't distinguish between a CEO who uses and an unemployed person who uses." />
        </SectionContent>
      )}

      {/* Section 3: The Inevitable Progression */}
      <SectionHeader
        id="progression"
        icon="📉"
        title="The Inevitable Progression"
        onPress={() => toggleSection('progression')}
        isExpanded={expandedSections.progression}
      />
      {expandedSections.progression && (
        <SectionContent>
          <Text style={[styles.boldText, { color: theme.colors.text }]}>
            Addiction follows a predictable path. Functioning status only delays inevitable consequences.
          </Text>

          <View style={[styles.timelineItem, { borderLeftColor: theme.colors.primary }]}>
            <Text style={[styles.stageLabel, { color: theme.colors.primary }]}>Stage 1</Text>
            <Text style={[styles.stageName, { color: theme.colors.text }]}>Recreational Use</Text>
            <Text style={[styles.stageDesc, { color: theme.colors.textSecondary }]}>
              "I can stop whenever I want" • Full control perceived
            </Text>
          </View>

          <View style={[styles.timelineItem, { borderLeftColor: theme.colors.primary }]}>
            <Text style={[styles.stageLabel, { color: theme.colors.primary }]}>Stage 2</Text>
            <Text style={[styles.stageName, { color: theme.colors.text }]}>Regular Use</Text>
            <Text style={[styles.stageDesc, { color: theme.colors.textSecondary }]}>
              "Functioning User" phase • External appearance maintained • Internal damage accelerating
            </Text>
          </View>

          <View style={[styles.timelineItem, { borderLeftColor: theme.colors.primary }]}>
            <Text style={[styles.stageLabel, { color: theme.colors.primary }]}>Stage 3</Text>
            <Text style={[styles.stageName, { color: theme.colors.text }]}>Dependency</Text>
            <Text style={[styles.stageDesc, { color: theme.colors.textSecondary }]}>
              Visible problems emerge • Job performance declining • Relationships suffering • Financial strain
            </Text>
          </View>

          <View style={[styles.timelineItem, { borderLeftColor: theme.colors.error }]}>
            <Text style={[styles.stageLabel, { color: theme.colors.error }]}>Stage 4</Text>
            <Text style={[styles.stageName, { color: theme.colors.text }]}>Addiction Crisis</Text>
            <Text style={[styles.stageDesc, { color: theme.colors.textSecondary }]}>
              Life falling apart • Medical emergencies • Legal consequences • Overdose risk
            </Text>
          </View>

          <Text style={[styles.warningText, { color: theme.colors.error }]}>
            The functioning phase is not stability—it's a ticking time bomb.
          </Text>
        </SectionContent>
      )}

      {/* Section 4: Physical & Mental Health Costs */}
      <SectionHeader
        id="health"
        icon="⚕️"
        title="Physical & Mental Health Costs"
        onPress={() => toggleSection('health')}
        isExpanded={expandedSections.health}
      />
      {expandedSections.health && (
        <SectionContent>
          <Text style={[styles.boldText, { color: theme.colors.text }]}>
            Your body keeps score regardless of your job performance.
          </Text>
          <ListItem text="Cardiovascular Damage: Increased heart rate, blood pressure, arrhythmias, and heart attack risk" />
          <ListItem text="Lung & Respiratory: Chronic inflammation, reduced oxygen capacity, and increased infection risk" />
          <ListItem text="Liver & Kidney: Progressive, often irreversible damage from filtering toxins" />
          <ListItem text="Immune System Collapse: Suppressed immunity makes infections more likely" />
          <ListItem text="Sleep Disruption: Drugs disrupt sleep architecture—even when you appear rested, your body isn't recovering" />
          <ListItem text="Nutritional Deficiency: Appetite suppression and poor eating habits lead to malnutrition" />
          <ListItem text="Mental Health Crisis: Depression, anxiety, paranoia, and psychosis develop gradually but intensify over time" />
          <ListItem text="Overdose Death: The ultimate consequence. It won't happen to me—until it does." />
        </SectionContent>
      )}

      {/* Section 5: Hidden Relationship Cost */}
      <SectionHeader
        id="relationships"
        icon="💔"
        title="The Hidden Relationship Cost"
        onPress={() => toggleSection('relationships')}
        isExpanded={expandedSections.relationships}
      />
      {expandedSections.relationships && (
        <SectionContent>
          <Text style={[styles.boldText, { color: theme.colors.text }]}>
            Addiction is a relational disease. No one recovers in isolation, and no one uses in isolation either.
          </Text>
          <ListItem text="Emotional Unavailability: While appearing present, you're chemically withdrawn from loved ones" />
          <ListItem text="Broken Trust: The lies required to hide use accumulate, eroding trust" />
          <ListItem text="Abandonment: Loved ones eventually leave because they can't support active addiction indefinitely" />
          <ListItem text="Parenting Impact: Children of using parents experience trauma, even when physical needs are met" />
          <ListItem text="Partner Codependency: Those close to you often develop codependent patterns, enabling the addiction" />
          <ListItem text="Social Isolation: Over time, healthy relationships fade as more time is spent with other users" />
          <ListItem text="Legacy of Pain: Your addiction affects generations—children, grandchildren, and everyone in your orbit" />
        </SectionContent>
      )}

      {/* Section 6: Cognitive Decline */}
      <SectionHeader
        id="cognition"
        icon="🧩"
        title="Cognitive Decline & Slow Mental Death"
        onPress={() => toggleSection('cognition')}
        isExpanded={expandedSections.cognition}
      />
      {expandedSections.cognition && (
        <SectionContent>
          <Text style={[styles.boldText, { color: theme.colors.text }]}>
            Long-term drug use causes measurable cognitive decline—even when functioning.
          </Text>
          <ListItem text="Memory Impairment: Both short-term and long-term memory deteriorate" />
          <ListItem text="Attention Deficit: Concentration becomes increasingly difficult" />
          <ListItem text="Decision-Making: The brain regions responsible for judgment atrophy" />
          <ListItem text="Executive Function: Planning, organizing, and executing multi-step tasks become harder" />
          <ListItem text="Emotional Regulation: Mood swings, explosions of anger, and emotional instability increase" />
          <ListItem text="Problem-Solving: Your ability to handle life challenges diminishes" />
          <ListItem text="Personality Changes: People who knew you notice you're 'not the same anymore'" />
          <ListItem text="Recovery Potential: The longer use continues, the less your brain can recover" />
          <ResearchNote text="💡 PET scans show that chronic drug users have brain activity patterns resembling those with dementia—this is preventable with recovery." />
        </SectionContent>
      )}

      {/* Section 7: Why Recovery Matters Now */}
      <SectionHeader
        id="recovery"
        icon="🎯"
        title="Why Recovery Matters RIGHT NOW"
        onPress={() => toggleSection('recovery')}
        isExpanded={expandedSections.recovery}
      />
      {expandedSections.recovery && (
        <SectionContent>
          <Text style={[styles.boldText, { color: theme.colors.text }]}>
            If you're a functioning user, recovery TODAY is infinitely easier than recovery during crisis.
          </Text>
          <ListItem text="Brain Plasticity: Your brain can still recover. Neuroplasticity means your brain can rebuild damaged pathways" />
          <ListItem text="Before Total Loss: Stop while you still have your relationships, your job, your health, your self-respect" />
          <ListItem text="Prevent Overdose: Every continued use increases overdose risk. Recovery eliminates this risk" />
          <ListItem text="Restore Authenticity: You can rebuild genuine connections based on who you actually are" />
          <ListItem text="Reverse Damage: The earlier you stop, the more damage reverses" />
          <ListItem text="Protect Others: Your recovery protects those who love you from the pain of watching you destroy yourself" />
        </SectionContent>
      )}

      {/* Section 8: Final Message */}
      <SectionHeader
        id="final"
        icon="💪"
        title="You Can't Stay Here"
        onPress={() => toggleSection('final')}
        isExpanded={expandedSections.final}
      />
      {expandedSections.final && (
        <SectionContent>
          <Text style={[styles.boldText, { color: theme.colors.text }]}>
            The functioning user phase is temporary. You're either getting better or getting worse. You can't stay in the
            middle.
          </Text>

          <View style={[styles.goodNewsBox, { backgroundColor: theme.colors.success, borderRadius: 10, padding: 12, marginTop: 12 }]}>
            <Text style={[styles.goodNewsText, { color: '#fff', fontWeight: '600' }]}>
              The good news? If you're still functioning, recovery is still possible.
            </Text>
          </View>

          <Text style={[styles.text, { color: theme.colors.text, marginTop: 12 }]}>
            Your relationships haven't all dissolved. Your brain can still heal. Your body can still recover. Your life
            hasn't been completely destroyed.
          </Text>

          <View style={[styles.finalCallBox, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.primary, borderWidth: 2 }]}>
            <Text style={[styles.finalCallText, { color: theme.colors.text, fontSize: 15, fontWeight: '600' }]}>
              💪 Stop now. Get help. Choose recovery. Use Back on Track to track your journey back to yourself.
            </Text>
          </View>

          <Text style={[styles.text, { color: theme.colors.textSecondary, marginTop: 12, fontStyle: 'italic' }]}>
            Recovery is possible. You can do this. 💪
          </Text>
        </SectionContent>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  boldText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 12,
  },
  emphasizedText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  text: {
    fontSize: 13,
    lineHeight: 19,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingRight: 8,
  },
  bullet: {
    marginRight: 12,
    fontSize: 18,
    fontWeight: 'bold',
  },
  listItemText: {
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  timelineItem: {
    paddingLeft: 16,
    paddingVertical: 12,
    marginVertical: 8,
    borderLeftWidth: 3,
  },
  stageLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stageName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  stageDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  warningText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    fontStyle: 'italic',
  },
  noteBox: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
  },
  noteText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  goodNewsBox: {
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  goodNewsText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
  },
  finalCallBox: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 2,
  },
  finalCallText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});

export default FunctioningUserScreen;
