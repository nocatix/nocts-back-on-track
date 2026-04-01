import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import addictionService from '../api/addictionService';
import { withdrawalHelper } from '../utils/withdrawalHelper';
import Button from '../components/Button';

export default function AddictionDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [addiction, setAddiction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [daysSince, setDaysSince] = useState(0);
  const [phase, setPhase] = useState('');
  const [percentage, setPercentage] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      fetchAddictionDetail();
    }, [id])
  );

  const fetchAddictionDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await addictionService.getAddictionById(id);
      setAddiction(data);

      // Calculate withdrawal information
      const days = withdrawalHelper.calculateDaysSinceStart(data.startDate);
      const phase = withdrawalHelper.getPhaseByDays(data.type, days);
      const percent = withdrawalHelper.calculatePercentageComplete(
        data.type,
        data.startDate
      );

      setDaysSince(days);
      setPhase(phase);
      setPercentage(percent);
    } catch (err) {
      setError(err.message || 'Failed to load addiction details');
      console.error('Error fetching addiction:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this addiction?')) {
      try {
        await addictionService.deleteAddiction(id);
        navigation.goBack();
      } catch (err) {
        setError('Failed to delete addiction');
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!addiction) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const phaseColors = {
    severe: '#ef4444',
    moderate: '#f97316',
    mild: '#eab308',
    recovery: '#84cc16',
    recovered: '#22c55e',
  };

  const phaseDescription = withdrawalHelper.getPhaseDescription(phase);
  const motivationalMessage = withdrawalHelper.getMotivationalMessage(
    phase,
    daysSince
  );
  const symptoms = withdrawalHelper.getSymptoms(addiction.type);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{addiction.name}</Text>
        <Text style={styles.type}>{addiction.type}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Days Since Started</Text>
            <Text
              style={[
                styles.statValue,
                { color: phaseColors[phase] || '#6366f1' },
              ]}
            >
              {daysSince}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Current Phase</Text>
            <Text
              style={[
                styles.statValue,
                { color: phaseColors[phase] || '#6366f1' },
              ]}
            >
              {phase}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress</Text>
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
          <Text style={styles.progressText}>
            {percentage}% through withdrawal process
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: phaseColors[phase] || '#6366f1' },
        ]}
      >
        <Text style={styles.phaseDescriptionTitle}>{phaseDescription}</Text>
        <Text style={styles.phaseDescriptionText}>{motivationalMessage}</Text>
      </View>

      {addiction.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Notes</Text>
          <Text style={styles.description}>{addiction.description}</Text>
        </View>
      )}

      {symptoms.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Withdrawal Symptoms</Text>
          <View style={styles.symptomsList}>
            {symptoms.map((symptom, index) => (
              <View key={index} style={styles.symptomItem}>
                <Text style={styles.symptomBullet}>•</Text>
                <Text style={styles.symptomText}>{symptom}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <Button
          title="Log Craving"
          onPress={() =>
            navigation.navigate('CravingGame', { addictionId: id })
          }
          style={{ marginBottom: 10 }}
        />
        <Button
          title="Update Details"
          onPress={() =>
            navigation.navigate('EditAddiction', { addictionId: id })
          }
          style={{ marginBottom: 10, backgroundColor: '#64748b' }}
        />
        <Button
          title="Delete Addiction"
          onPress={handleDelete}
          style={{ backgroundColor: '#ef4444' }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  progressContainer: {
    marginBottom: 0,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  phaseDescriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  phaseDescriptionText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  symptomsList: {
    paddingVertical: 8,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  symptomBullet: {
    fontSize: 14,
    color: '#6366f1',
    marginRight: 12,
    fontWeight: 'bold',
  },
  symptomText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginVertical: 20,
  },
});
