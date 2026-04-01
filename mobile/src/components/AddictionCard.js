import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { withdrawalHelper } from '../utils/withdrawalHelper';

export default function AddictionCard({ addiction, onPress }) {
  const daysSince = withdrawalHelper.calculateDaysSinceStart(addiction.startDate);
  const phase = withdrawalHelper.getPhaseByDays(addiction.type, daysSince);
  const percentage = withdrawalHelper.calculatePercentageComplete(
    addiction.type,
    addiction.startDate
  );

  const phaseColors = {
    severe: '#ef4444',
    moderate: '#f97316',
    mild: '#eab308',
    recovery: '#84cc16',
    recovered: '#22c55e',
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{addiction.name}</Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: phaseColors[phase] || '#6366f1' },
          ]}
        >
          <Text style={styles.badgeText}>
            {daysSince} {daysSince === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${percentage}%`,
                backgroundColor: phaseColors[phase] || '#6366f1',
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{percentage}% complete</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.phaseText}>
          Phase: <Text style={styles.phaseBold}>{phase}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  footer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  phaseText: {
    fontSize: 13,
    color: '#666',
  },
  phaseBold: {
    fontWeight: '600',
    color: '#333',
  },
});
