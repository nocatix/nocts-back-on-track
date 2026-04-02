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

const THERAPY_TYPES = [
  {
    id: 'cbt',
    name: 'Cognitive Behavioral Therapy (CBT)',
    icon: 'brain',
    description: 'Focuses on changing negative thought patterns and behaviors. Highly effective for addiction.',
    benefits: ['Identifies triggers', 'Builds coping strategies', 'Changes thought patterns', 'Prevents relapse'],
    duration: '12-20 weeks typically',
  },
  {
    id: 'motive',
    name: 'Motivational Interviewing',
    icon: 'comment-check',
    description: 'Helps you find your own motivation to change, rather than being told what to do.',
    benefits: ['Increases intrinsic motivation', 'Builds confidence', 'Explores ambivalence', 'Respects autonomy'],
    duration: '5-10 sessions typically',
  },
  {
    id: 'group',
    name: 'Group Therapy',
    icon: 'account-group',
    description: 'Therapy with others facing similar challenges. Provides peer support and shared experiences.',
    benefits: ['Reduces shame', 'Peer support', 'Learn from others', 'Build community'],
    duration: 'Ongoing groups available',
  },
  {
    id: 'family',
    name: 'Family Therapy',
    icon: 'family-tree',
    description: 'Involves family members to improve relationships and support recovery.',
    benefits: ['Repairs relationships', 'Family education', 'Improves support system', 'Addresses family dynamics'],
    duration: '8-12 sessions typically',
  },
  {
    id: 'medication',
    name: 'Medication-Assisted Treatment',
    icon: 'pill',
    description: 'Uses FDA-approved medications to reduce cravings and withdrawal symptoms.',
    benefits: ['Reduces cravings', 'Prevents withdrawal', 'Allows focus on recovery', 'Medical oversight'],
    duration: 'Several months to years',
  },
];

export default function TherapyInfoScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const [expandedId, setExpandedId] = useState(null);

  const renderTherapyItem = ({ item }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        style={[styles.therapyCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
      >
        <View style={styles.therapyHeader}>
          <View style={[styles.iconPlaceholder, { backgroundColor: theme.colors.primary }]}>
            <MaterialCommunityIcons name={item.icon} size={24} color="white" />
          </View>
          <View style={styles.therapyTitle}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.duration, { color: theme.colors.textSecondary }]}>
              {item.duration}
            </Text>
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
          paddingBottom: insets.bottom + 40,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <Text style={[styles.pageTitle, { color: theme.colors.text }]}>Therapy Options</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Different approaches to find what works for you
      </Text>

      <FlatList
        data={THERAPY_TYPES}
        renderItem={renderTherapyItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />

      {/* Medication Partnership Section */}
      <View style={[styles.medicationSection, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
        <View style={styles.medicationHeader}>
          <Text style={styles.medicationIcon}>💊</Text>
          <View>
            <Text style={[styles.medicationTitle, { color: theme.colors.text }]}>Why Medication Complements Therapy</Text>
            <Text style={[styles.medicationSubtitle, { color: theme.colors.textSecondary }]}>The power of combining treatments</Text>
          </View>
        </View>

        <Text style={[styles.medicationText, { color: theme.colors.text }]}>
          Many people misunderstand medication in recovery. Medication isn't "cheating"—it's a powerful tool that often makes therapy more effective.
        </Text>

        <View style={styles.medicationBenefits}>
          <View style={[styles.benefitCard, { backgroundColor: theme.colors.surfaceBackground }]}>
            <Text style={styles.benefitIcon}>🧠</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.benefitTitle, { color: theme.colors.text }]}>Treating Chemical Imbalances</Text>
              <Text style={[styles.benefitDesc, { color: theme.colors.textSecondary }]}>
                Medications correct imbalances in dopamine and serotonin, reducing cravings and making therapy more effective.
              </Text>
            </View>
          </View>

          <View style={[styles.benefitCard, { backgroundColor: theme.colors.surfaceBackground }]}>
            <Text style={styles.benefitIcon}>😌</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.benefitTitle, { color: theme.colors.text }]}>Managing Co-Occurring Issues</Text>
              <Text style={[styles.benefitDesc, { color: theme.colors.textSecondary }]}>
                Treating depression, anxiety, or PTSD removes barriers to recovery.
              </Text>
            </View>
          </View>

          <View style={[styles.benefitCard, { backgroundColor: theme.colors.surfaceBackground }]}>
            <Text style={styles.benefitIcon}>🛑</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.benefitTitle, { color: theme.colors.text }]}>Reducing Cravings</Text>
              <Text style={[styles.benefitDesc, { color: theme.colors.textSecondary }]}>
                Medications give you breathing room to focus on therapy instead of fighting constant urges.
              </Text>
            </View>
          </View>

          <View style={[styles.benefitCard, { backgroundColor: theme.colors.surfaceBackground }]}>
            <Text style={styles.benefitIcon}>🔄</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.benefitTitle, { color: theme.colors.text }]}>Preventing Relapse</Text>
              <Text style={[styles.benefitDesc, { color: theme.colors.textSecondary }]}>
                Medication provides stability in early recovery while you learn new coping skills.
              </Text>
            </View>
          </View>

          <View style={[styles.benefitCard, { backgroundColor: theme.colors.surfaceBackground }]}>
            <Text style={styles.benefitIcon}>📊</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.benefitTitle, { color: theme.colors.text }]}>Evidence-Based Approach</Text>
              <Text style={[styles.benefitDesc, { color: theme.colors.textSecondary }]}>
                Research consistently shows that therapy + medication produces better outcomes than either alone.
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.commonMedBox, { backgroundColor: theme.colors.surfaceBackground, borderLeftColor: theme.colors.primary }]}>
          <Text style={[styles.medBoxTitle, { color: theme.colors.text }]}>Common Medications in Recovery:</Text>
          <Text style={[styles.medBoxText, { color: theme.colors.textSecondary }]}>
            <Text style={{ fontWeight: '600' }}>For Alcohol:</Text> Naltrexone, Acamprosate, Disulfiram
          </Text>
          <Text style={[styles.medBoxText, { color: theme.colors.textSecondary }]}>
            <Text style={{ fontWeight: '600' }}>For Opioids:</Text> Buprenorphine, Methadone, Naltrexone
          </Text>
          <Text style={[styles.medBoxText, { color: theme.colors.textSecondary }]}>
            <Text style={{ fontWeight: '600' }}>For Co-Occurring Issues:</Text> SSRIs for depression/anxiety
          </Text>
        </View>
      </View>

      {/* How to Find Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>How to Find a Therapist</Text>
        
        <View style={[styles.tipItem, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} />
          <Text style={[styles.tipText, { color: theme.colors.text }]}>
            Ask your doctor for referrals
          </Text>
        </View>

        <View style={[styles.tipItem, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} />
          <Text style={[styles.tipText, { color: theme.colors.text }]}>
            Contact your insurance provider for covered therapists
          </Text>
        </View>

        <View style={[styles.tipItem, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} />
          <Text style={[styles.tipText, { color: theme.colors.text }]}>
            Use online directories (Psychology Today, TherapyDen)
          </Text>
        </View>

        <View style={[styles.tipItem, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} />
          <Text style={[styles.tipText, { color: theme.colors.text }]}>
            Join support groups (AA, NA, SMART Recovery)
          </Text>
        </View>

        <View style={[styles.tipItem, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} />
          <Text style={[styles.tipText, { color: theme.colors.text }]}>
            Call SAMHSA National Helpline for treatment locator
          </Text>
        </View>
      </View>

      {/* Questions to Ask */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Questions to Ask Potential Therapists</Text>

        <View style={[styles.questionItem, { backgroundColor: theme.colors.cardBg, borderLeftColor: theme.colors.primary }]}>
          <Text style={[styles.questionText, { color: theme.colors.text }]}>
            What experience do you have with addiction treatment?
          </Text>
        </View>

        <View style={[styles.questionItem, { backgroundColor: theme.colors.cardBg, borderLeftColor: theme.colors.primary }]}>
          <Text style={[styles.questionText, { color: theme.colors.text }]}>
            What treatment approaches do you use?
          </Text>
        </View>

        <View style={[styles.questionItem, { backgroundColor: theme.colors.cardBg, borderLeftColor: theme.colors.primary }]}>
          <Text style={[styles.questionText, { color: theme.colors.text }]}>
            What are your fees and do you accept insurance?
          </Text>
        </View>

        <View style={[styles.questionItem, { backgroundColor: theme.colors.cardBg, borderLeftColor: theme.colors.primary }]}>
          <Text style={[styles.questionText, { color: theme.colors.text }]}>
            How often can we meet?
          </Text>
        </View>
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
  listContent: {
    paddingHorizontal: 16,
  },
  therapyCard: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  therapyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  therapyTitle: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  duration: {
    fontSize: 11,
    marginTop: 2,
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
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  questionItem: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  questionText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  medicationSection: {
    marginHorizontal: 16,
    marginVertical: 20,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  medicationIcon: {
    fontSize: 28,
  },
  medicationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  medicationSubtitle: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  medicationText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
    fontWeight: '500',
  },
  medicationBenefits: {
    marginVertical: 12,
    gap: 10,
  },
  benefitCard: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 8,
    gap: 10,
    alignItems: 'flex-start',
  },
  benefitIcon: {
    fontSize: 18,
    marginTop: 2,
  },
  benefitTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  benefitDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  commonMedBox: {
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    marginTop: 12,
  },
  medBoxTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  medBoxText: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 4,
  },
});
