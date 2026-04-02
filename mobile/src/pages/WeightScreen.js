import React, { useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';
import { useWeight } from '../context/WeightContext';
import Button from '../components/Button';

export default function WeightScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const { weights, loading, error, addWeight, deleteWeight, updateWeight, loadWeights } = useWeight();

  const [showAddModal, setShowAddModal] = useState(false);
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('lbs');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadWeights();
    }, [loadWeights])
  );

  const handleAddWeight = async () => {
    if (!weight || isNaN(parseFloat(weight))) {
      Alert.alert('Error', 'Please enter a valid weight');
      return;
    }

    setSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await addWeight({
        date: today,
        weight: parseFloat(weight),
        unit,
        notes,
      });
      
      setWeight('');
      setUnit('lbs');
      setNotes('');
      setEditingId(null);
      setShowAddModal(false);
      Alert.alert('Success', 'Weight recorded successfully');
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to save weight');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWeight = (id) => {
    Alert.alert(
      'Delete Weight',
      'Are you sure you want to delete this weight entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWeight(id);
              Alert.alert('Success', 'Weight entry deleted');
            } catch (err) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ]
    );
  };

  const getWeightTrend = () => {
    if (weights.length < 2) return null;
    const latest = parseFloat(weights[0]?.weight || 0);
    const previous = parseFloat(weights[1]?.weight || 0);
    const diff = latest - previous;
    if (diff > 0) return { direction: 'up', value: diff.toFixed(1), color: '#ef4444' };
    if (diff < 0) return { direction: 'down', value: Math.abs(diff).toFixed(1), color: '#22c55e' };
    return null;
  };

  const trend = getWeightTrend();

  const renderWeightItem = ({ item }) => {
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });

    return (
      <View style={[styles.weightItem, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
        <View style={styles.weightItemLeft}>
          <Text style={[styles.weightValue, { color: theme.colors.primary }]}>
            {item.weight} {item.unit}
          </Text>
          <Text style={[styles.weightDate, { color: theme.colors.textSecondary }]}>
            {formattedDate}
          </Text>
          {item.notes && (
            <Text style={[styles.weightNotes, { color: theme.colors.textTertiary }]} numberOfLines={1}>
              {item.notes}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteWeight(item.id)}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && weights.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
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
        {/* Stats Section */}
        {weights.length > 0 && (
          <View style={[styles.statsContainer, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Current</Text>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {weights[0]?.weight} {weights[0]?.unit}
              </Text>
            </View>
            
            {trend && (
              <View style={styles.stat}>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Change</Text>
                <View style={styles.trendContainer}>
                  <MaterialCommunityIcons
                    name={trend.direction === 'up' ? 'trending-up' : 'trending-down'}
                    size={20}
                    color={trend.color}
                  />
                  <Text style={[styles.statValue, { color: trend.color }]}>
                    {trend.direction === 'up' ? '+' : '-'}{trend.value}
                  </Text>
                </View>
              </View>
            )}

            {weights.length >= 2 && (
              <View style={styles.stat}>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Average</Text>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                  {(weights.reduce((sum, w) => sum + parseFloat(w.weight), 0) / weights.length).toFixed(1)} {weights[0]?.unit}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Add Weight Button */}
        <Button
          title="+ Add Weight"
          onPress={() => setShowAddModal(true)}
          style={styles.addButton}
        />

        {/* Weight List */}
        {weights.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="scale" size={64} color={theme.colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Weight Entries</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
              Start tracking your weight to see progress over time
            </Text>
          </View>
        ) : (
          <FlatList
            data={weights}
            renderItem={renderWeightItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </ScrollView>

      {/* Add Weight Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modal, { backgroundColor: theme.colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Add Weight</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Weight</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={[
                      styles.weightInput,
                      { backgroundColor: theme.colors.inputBg, color: theme.colors.text, borderColor: theme.colors.border }
                    ]}
                    placeholder="Enter weight"
                    placeholderTextColor={theme.colors.textTertiary}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="decimal-pad"
                  />
                  <TouchableOpacity
                    style={[styles.unitButton, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
                    onPress={() => setUnit(unit === 'lbs' ? 'kg' : 'lbs')}
                  >
                    <Text style={[styles.unitText, { color: theme.colors.text }]}>{unit}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Notes (optional)</Text>
                <TextInput
                  style={[
                    styles.notesInput,
                    { backgroundColor: theme.colors.inputBg, color: theme.colors.text, borderColor: theme.colors.border }
                  ]}
                  placeholder="How did you feel? What did you do?"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  onPress={() => setShowAddModal(false)}
                  variant="secondary"
                  style={styles.button}
                />
                <Button
                  title="Save"
                  onPress={handleAddWeight}
                  loading={submitting}
                  style={styles.button}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButton: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  weightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  weightItemLeft: {
    flex: 1,
  },
  weightValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  weightDate: {
    fontSize: 12,
    marginTop: 4,
  },
  weightNotes: {
    fontSize: 11,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  weightInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  unitButton: {
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minWidth: 60,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  notesInput: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
  },
});
