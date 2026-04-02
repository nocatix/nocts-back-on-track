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

const ADDICTION_SYMPTOMS = {
  alcohol: {
    name: 'Alcohol',
    icon: 'bottle-wine',
    symptoms: [
      { title: 'Tremors', time: '6-24 hours', description: 'Shaking hands and body' },
      { title: 'Anxiety', time: '6-24 hours', description: 'Nervousness and worry' },
      { title: 'Sweating', time: '6-24 hours', description: 'Excessive perspiration' },
      { title: 'Seizures', time: '12-48 hours', description: 'Involuntary muscle contractions (seek help immediately)' },
      { title: 'Hallucinations', time: '12-48 hours', description: 'Seeing or hearing things (seek help immediately)' },
      { title: 'Confusion', time: '24-96 hours', description: 'Brain fog and disorientation' },
    ],
    tips: [
      'Stay hydrated - drink plenty of water',
      'Eat nutritious meals regularly',
      'Get plenty of rest',
      'Exercise lightly (walking)',
      'Practice deep breathing exercises',
      'Seek medical help if symptoms worsen',
    ]
  },
  nicotine: {
    name: 'Nicotine',
    icon: 'cigarette-off',
    symptoms: [
      { title: 'Cravings', time: 'Minutes to hours', description: 'Strong urge to smoke' },
      { title: 'Irritability', time: 'Hours to days', description: 'Mood swings and short temper' },
      { title: 'Difficulty Concentrating', time: 'Hours to days', description: 'Brain fog' },
      { title: 'Increased Appetite', time: 'Days to weeks', description: 'Want to eat more' },
      { title: 'Sleep Issues', time: 'Days to weeks', description: 'Insomnia or restlessness' },
      { title: 'Anxiety', time: 'Hours to days', description: 'Nervousness and worry' },
    ],
    tips: [
      'Use nicotine replacement (gum, patches)',
      'Find alternative activities (exercise, games)',
      'Try stress management techniques',
      'Avoid triggers and smoke-filled environments',
      'Stay active and busy',
      'Consider prescription medications (talk to doctor)',
    ]
  },
  cannabis: {
    name: 'Cannabis',
    icon: 'leaf-off',
    symptoms: [
      { title: 'Irritability', time: '1-3 days', description: 'Mood irritation and anger' },
      { title: 'Sleep Issues', time: '1-2 weeks', description: 'Difficulty sleeping' },
      { title: 'Cravings', time: 'Days to weeks', description: 'Strong desire to use' },
      { title: 'Anxiety', time: '1-2 weeks', description: 'Worry and nervousness' },
      { title: 'Decreased Appetite', time: '1-7 days', description: 'Not feeling hungry' },
      { title: 'Brain Fog', time: 'Days to weeks', description: 'Difficulty thinking clearly' },
    ],
    tips: [
      'Exercise regularly',
      'Maintain a consistent sleep schedule',
      'Practice relaxation techniques',
      'Stay busy with activities',
      'Avoid friends who still use',
      'Join support groups',
    ]
  },
  coffee: {
    name: 'Caffeine',
    icon: 'coffee-off',
    symptoms: [
      { title: 'Headaches', time: '12-48 hours', description: 'Dull to severe headaches' },
      { title: 'Fatigue', time: '24-48 hours', description: 'Extreme tiredness' },
      { title: 'Difficulty Concentrating', time: '24-48 hours', description: 'Brain fog' },
      { title: 'Irritability', time: '24-48 hours', description: 'Mood swings' },
      { title: 'Anxiety', time: '24-48 hours', description: 'Nervousness' },
      { title: 'Depression', time: '24-48 hours', description: 'Low mood' },
    ],
    tips: [
      'Gradually reduce caffeine (tapering is better than quitting cold turkey)',
      'Stay hydrated',
      'Get extra sleep',
      'Use over-the-counter pain relievers for headaches',
      'Exercise to boost energy',
      'Try caffeine-free alternatives',
    ]
  },
  default: {
    name: 'Addiction',
    icon: 'alert-circle',
    symptoms: [
      { title: 'Anxiety', time: 'Variable', description: 'Nervousness and worry' },
      { title: 'Irritability', time: 'Variable', description: 'Mood irritation' },
      { title: 'Cravings', time: 'Variable', description: 'Strong urges' },
      { title: 'Sleep Issues', time: 'Variable', description: 'Difficulty sleeping' },
      { title: 'Mood Swings', time: 'Variable', description: 'Emotional changes' },
      { title: 'Body Aches', time: 'Variable', description: 'Physical discomfort' },
    ],
    tips: [
      'Seek professional medical help',
      'Stay hydrated and eat well',
      'Exercise regularly',
      'Practice stress management',
      'Join support groups',
      'Use this app to track progress',
    ]
  }
};

export default function WithdrawalSymptomsScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const [expandedSymptom, setExpandedSymptom] = useState(null);

  // Get most common addictions
  const addictions = ['alcohol', 'nicotine', 'cannabis', 'coffee'];

  const renderSymptomItem = ({ item }) => {
    const isExpanded = expandedSymptom === item.title;
    
    return (
      <TouchableOpacity
        style={[styles.symptomItem, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
        onPress={() => setExpandedSymptom(isExpanded ? null : item.title)}
      >
        <View style={styles.symptomHeader}>
          <View style={styles.symptomTitleSection}>
            <Text style={[styles.symptomTitle, { color: theme.colors.text }]}>
              {item.title}
            </Text>
            <Text style={[styles.symptomTime, { color: theme.colors.primary }]}>
              {item.time}
            </Text>
          </View>
          <MaterialCommunityIcons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={theme.colors.textSecondary}
          />
        </View>
        
        {isExpanded && (
          <Text style={[styles.symptomDescription, { color: theme.colors.textSecondary }]}>
            {item.description}
          </Text>
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
      <Text style={[styles.intro, { color: theme.colors.textSecondary }]}>
        Withdrawal symptoms vary by addiction type and individual factors. Symptoms typically improve within days to weeks. If severe, seek medical attention.
      </Text>

      {addictions.map((addiction) => {
        const data = ADDICTION_SYMPTOMS[addiction];
        return (
          <View key={addiction} style={styles.section}>
            <View style={[styles.sectionHeader, { backgroundColor: theme.colors.cardBg }]}>
              <MaterialCommunityIcons name={data.icon} size={24} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {data.name}
              </Text>
            </View>

            <Text style={[styles.subsectionTitle, { color: theme.colors.text }]}>Common Symptoms</Text>
            <FlatList
              data={data.symptoms}
              renderItem={renderSymptomItem}
              keyExtractor={(item) => item.title}
              scrollEnabled={false}
              contentContainerStyle={styles.symptomList}
            />

            <Text style={[styles.subsectionTitle, { color: theme.colors.text }]}>Coping Tips</Text>
            {data.tips.map((tip, index) => (
              <View key={index} style={[styles.tipItem, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
                <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} />
                <Text style={[styles.tipText, { color: theme.colors.text }]}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        );
      })}

      <View style={[styles.disclaimer, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
        <MaterialCommunityIcons name="alert-circle" size={20} color={theme.colors.warning} />
        <Text style={[styles.disclaimerText, { color: theme.colors.textSecondary }]}>
          Seek immediate medical help if you experience severe symptoms like seizures, chest pain, or thoughts of self-harm.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  intro: {
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  symptomList: {
    marginBottom: 12,
  },
  symptomItem: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  symptomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  symptomTitleSection: {
    flex: 1,
  },
  symptomTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  symptomTime: {
    fontSize: 12,
    marginTop: 2,
  },
  symptomDescription: {
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
  tipItem: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  disclaimer: {
    flexDirection: 'row',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    marginTop: 32,
    marginBottom: 32,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
});
