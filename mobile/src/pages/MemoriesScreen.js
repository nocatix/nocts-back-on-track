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
import { useMemory } from '../context/MemoryContext';
import Button from '../components/Button';

const MEMORY_TYPES = [
  { value: 'positive', label: 'Positive', icon: 'emoticon-happy', color: '#22c55e' },
  { value: 'challenge', label: 'Challenge', icon: 'emoticon-sad', color: '#ef4444' },
  { value: 'learning', label: 'Learning', icon: 'lightbulb', color: '#f59e0b' },
  { value: 'milestone', label: 'Milestone', icon: 'trophy', color: '#06b6d4' },
  { value: 'other', label: 'Other', icon: 'note', color: '#8b5cf6' },
];

export default function MemoriesScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const { memories, loading, error, addMemory, deleteMemory, loadMemories } = useMemory();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('positive');
  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadMemories();
    }, [loadMemories])
  );

  const handleAddMemory = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await addMemory({
        date: today,
        title: title.trim(),
        description: description.trim(),
        type,
      });
      
      setTitle('');
      setDescription('');
      setType('positive');
      setShowAddModal(false);
      Alert.alert('Success', 'Memory saved successfully');
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to save memory');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMemory = (id) => {
    Alert.alert(
      'Delete Memory',
      'Are you sure you want to delete this memory?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMemory(id);
              Alert.alert('Success', 'Memory deleted');
            } catch (err) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ]
    );
  };

  const getTypeInfo = (typeValue) => {
    return MEMORY_TYPES.find(t => t.value === typeValue) || MEMORY_TYPES[4];
  };

  const renderMemoryItem = ({ item }) => {
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
    
    const typeInfo = getTypeInfo(item.type);

    return (
      <TouchableOpacity style={[styles.memoryItem, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
        <View style={styles.memoryItemTop}>
          <View style={styles.memoryHeader}>
            <View style={[styles.typeIcon, { backgroundColor: typeInfo.color || theme.colors.primary }]}>
              <MaterialCommunityIcons name={typeInfo.icon} size={20} color="white" />
            </View>
            <View style={styles.titleAndDate}>
              <Text style={[styles.memoryTitle, { color: theme.colors.text }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[styles.memoryDate, { color: theme.colors.textSecondary }]}>
                {formattedDate}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleDeleteMemory(item.id)}
            style={styles.deleteButton}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.memoryDescription, { color: theme.colors.textSecondary }]} numberOfLines={3}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading && memories.length === 0) {
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
        {memories.length > 0 && (
          <View style={[styles.statsContainer, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Total</Text>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {memories.length}
              </Text>
            </View>
            
            {(() => {
              const typeCounts = MEMORY_TYPES.map(t => ({
                ...t,
                count: memories.filter(m => m.type === t.value).length
              })).filter(t => t.count > 0);
              
              if (typeCounts.length > 0) {
                const topType = typeCounts.reduce((a, b) => a.count > b.count ? a : b);
                return (
                  <View style={styles.stat}>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Most Common</Text>
                    <View style={styles.topTypeContainer}>
                      <MaterialCommunityIcons
                        name={topType.icon}
                        size={20}
                        color={topType.color}
                      />
                      <Text style={[styles.topType, { color: theme.colors.text }]}>
                        {topType.label}
                      </Text>
                    </View>
                  </View>
                );
              }
              return null;
            })()}
          </View>
        )}

        {/* Add Memory Button */}
        <Button
          title="+ New Memory"
          onPress={() => setShowAddModal(true)}
          style={styles.addButton}
        />

        {/* Memories List */}
        {memories.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="notebook-heart" size={64} color={theme.colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Memories Yet</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
              Start recording your important moments and learnings
            </Text>
          </View>
        ) : (
          <FlatList
            data={memories}
            renderItem={renderMemoryItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </ScrollView>

      {/* Add Memory Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modal, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>New Memory</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Title</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { backgroundColor: theme.colors.inputBg, color: theme.colors.text, borderColor: theme.colors.border }
                  ]}
                  placeholder="Give it a title"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={title}
                  onChangeText={setTitle}
                  maxLength={100}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Type</Text>
                <View style={styles.typeSelector}>
                  {MEMORY_TYPES.map((t) => (
                    <TouchableOpacity
                      key={t.value}
                      style={[
                        styles.typeButton,
                        { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border },
                        type === t.value && { backgroundColor: t.color, borderColor: t.color }
                      ]}
                      onPress={() => setType(t.value)}
                    >
                      <MaterialCommunityIcons
                        name={t.icon}
                        size={20}
                        color={type === t.value ? 'white' : t.color}
                      />
                      <Text style={[
                        styles.typeButtonLabel,
                        { color: type === t.value ? 'white' : theme.colors.textSecondary }
                      ]}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Description</Text>
                <TextInput
                  style={[
                    styles.textAreaInput,
                    { backgroundColor: theme.colors.inputBg, color: theme.colors.text, borderColor: theme.colors.border }
                  ]}
                  placeholder="Tell your story..."
                  placeholderTextColor={theme.colors.textTertiary}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  maxLength={1000}
                />
                <Text style={[styles.charCount, { color: theme.colors.textTertiary }]}>
                  {description.length}/1000
                </Text>
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
                  onPress={handleAddMemory}
                  loading={submitting}
                  style={styles.button}
                />
              </View>
            </ScrollView>
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
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  topTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topType: {
    fontSize: 12,
    fontWeight: '500',
  },
  addButton: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  memoryItem: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  memoryItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  memoryHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleAndDate: {
    flex: 1,
  },
  memoryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  memoryDate: {
    fontSize: 12,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  memoryDescription: {
    fontSize: 13,
    lineHeight: 18,
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
    maxHeight: '90%',
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
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  textAreaInput: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  typeButton: {
    width: '31%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  typeButtonLabel: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 24,
  },
  button: {
    flex: 1,
  },
});
