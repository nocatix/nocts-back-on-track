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

const FEATURES = [
  {
    title: 'Track Your Addictions',
    description: 'Monitor multiple addictions with personalized tracking. Set quit dates and watch your progress grow.',
    icon: 'list-box-outline',
    color: '#3b82f6',
  },
  {
    title: 'Daily Mood Tracking',
    description: 'Log your mood daily to understand patterns and identify triggers. See how your well-being improves.',
    icon: 'emoticon-happy',
    color: '#8b5cf6',
  },
  {
    title: 'Private Journal',
    description: 'Securely journal your thoughts and experiences. All entries are encrypted for your privacy.',
    icon: 'notebook',
    color: '#ec4899',
  },
  {
    title: 'Coping Resources',
    description: 'Access meditation guides, crisis hotlines, therapy information, and coping strategies when you need them.',
    icon: 'heart-pulse',
    color: '#ef4444',
  },
  {
    title: 'Gamification',
    description: 'Earn achievements and trophies as you hit milestones. Celebrate your victories and stay motivated.',
    icon: 'trophy',
    color: '#f59e0b',
  },
  {
    title: 'Offline Access',
    description: 'Use the app completely offline (Standalone Mode) or sync your data to the cloud (Connected Mode).',
    icon: 'wifi-off',
    color: '#06b6d4',
  },
  {
    title: 'Multi-Language Support',
    description: 'Available in 11+ languages. Recover in the language you\'re most comfortable with.',
    icon: 'translate',
    color: '#22c55e',
  },
  {
    title: 'Biometric Security',
    description: 'Lock your data with fingerprint or face recognition in Standalone Mode for added privacy.',
    icon: 'fingerprint',
    color: '#6366f1',
  },
];

const STATS = [
  { label: 'Features', value: '8+', icon: 'star' },
  { label: 'Languages', value: '11+', icon: 'translate' },
  { label: 'Free Forever', value: '✓', icon: 'check-circle' },
  { label: 'Open Source', value: '✓', icon: 'github' },
];

export default function WhyUseThisScreen() {
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
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="heart" size={48} color={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Nocts Back on Track
        </Text>
        <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
          Your Personal Recovery Companion
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {STATS.map((stat, index) => (
          <View key={index} style={[styles.statBox, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
            <MaterialCommunityIcons name={stat.icon} size={24} color={theme.colors.primary} />
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Why Choose Us */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Why Choose Nocts?</Text>

        <View style={[styles.infoBox, { backgroundColor: theme.colors.cardBg }]}>
          <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            <Text style={{ fontWeight: '600' }}>Privacy First:</Text> Your data is yours. All sensitive information is encrypted.
          </Text>
        </View>

        <View style={[styles.infoBox, { backgroundColor: theme.colors.cardBg }]}>
          <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            <Text style={{ fontWeight: '600' }}>Offline Ready:</Text> Use fully offline without internet connection.
          </Text>
        </View>

        <View style={[styles.infoBox, { backgroundColor: theme.colors.cardBg }]}>
          <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            <Text style={{ fontWeight: '600' }}>Always Free:</Text> No ads, no subscriptions. Support is through community.
          </Text>
        </View>

        <View style={[styles.infoBox, { backgroundColor: theme.colors.cardBg }]}>
          <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            <Text style={{ fontWeight: '600' }}>Built for Recovery:</Text> Features designed with addiction specialists.
          </Text>
        </View>
      </View>

      {/* Features Grid */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Key Features</Text>
        
        {FEATURES.map((feature, index) => (
          <View
            key={index}
            style={[styles.featureCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
          >
            <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
              <MaterialCommunityIcons name={feature.icon} size={24} color="white" />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDesc, { color: theme.colors.textSecondary }]}>
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Call to Action */}
      <View style={[styles.ctaBox, { backgroundColor: theme.colors.primary }]}>
        <MaterialCommunityIcons name="heart" size={32} color="white" />
        <Text style={styles.ctaTitle}>
          You've Got This
        </Text>
        <Text style={styles.ctaText}>
          Recovery is possible. We're here to support you every step of the way.
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
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  tagline: {
    fontSize: 14,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  featureCard: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  ctaBox: {
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 24,
    gap: 8,
  },
  ctaTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  ctaText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
