import React, { useContext } from 'react';
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

const RESOURCES = [
  {
    id: 'preparation',
    title: 'Preparation Plan',
    description: 'Get ready for success with essential preparation steps',
    icon: 'format-list-checks',
    color: '#3b82f6',
    screenName: 'PreparationPlan',
  },
  {
    id: 'selfassessment',
    title: 'Self-Assessment',
    description: 'Evaluate your addiction and track your progress',
    icon: 'clipboard-check',
    color: '#6366f1',
    screenName: 'SelfAssessment',
  },
  {
    id: 'withdrawal',
    title: 'Withdrawal Symptoms',
    description: 'Learn about common withdrawal symptoms and how to manage them',
    icon: 'hospital-box',
    color: '#ef4444',
    screenName: 'WithdrawalSymptoms',
  },
  {
    id: 'crisis',
    title: 'Crisis Hotlines',
    description: 'Emergency support numbers available 24/7',
    icon: 'phone-alert',
    color: '#06b6d4',
    screenName: 'CrisisHotlines',
  },
  {
    id: 'therapy',
    title: 'Therapy Information',
    description: 'Types of therapy and how to find professional help',
    icon: 'heart-multiple',
    color: '#f59e0b',
    screenName: 'TherapyInfo',
  },
  {
    id: 'howtosucceed',
    title: 'How to Succeed',
    description: 'Proven strategies for long-term success',
    icon: 'trophy',
    color: '#22c55e',
    screenName: 'HowToSucceed',
  },
  {
    id: 'whyuse',
    title: 'Why Use This App',
    description: 'Understanding the benefits and features',
    icon: 'information',
    color: '#8b5cf6',
    screenName: 'WhyUseThis',
  },
];

export default function ResourcesHubScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);

  const renderResourceCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.resourceCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
      onPress={() => navigation.navigate(item.screenName)}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <MaterialCommunityIcons name={item.icon} size={32} color="white" />
      </View>
      <View style={styles.resourceContent}>
        <Text style={[styles.resourceTitle, { color: theme.colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.resourceDescription, { color: theme.colors.textSecondary }]}>
          {item.description}
        </Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

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
      <Text style={[styles.title, { color: theme.colors.text }]}>Educational Resources</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Learn about recovery, manage withdrawal, and find support
      </Text>

      <FlatList
        data={RESOURCES}
        renderItem={renderResourceCard}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
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
    paddingBottom: 16,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});
