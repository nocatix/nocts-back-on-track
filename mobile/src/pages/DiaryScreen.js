import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import diaryService from '../api/diaryService';
import Button from '../components/Button';

export default function DiaryScreen() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newEntry, setNewEntry] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchEntries();
    }, [])
  );

  const fetchEntries = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await diaryService.getDiaryEntries({ limit: 50 });
      // Sort by most recent first
      const sorted = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setEntries(sorted);
    } catch (err) {
      setError(err.message || 'Failed to load diary entries');
      console.error('Error fetching diary entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!newEntry.trim()) {
      setError('Please write something in your diary');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await diaryService.createDiaryEntry({
        content: newEntry,
      });

      setNewEntry('');
      setShowNewEntryForm(false);
      await fetchEntries();
    } catch (err) {
      setError(err.message || 'Failed to save diary entry');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today at ' + date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <ScrollView style={styles.container}>
      {!showNewEntryForm ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Diary</Text>
          <Button
            title="+ Write New Entry"
            onPress={() => setShowNewEntryForm(true)}
            style={styles.newEntryButton}
          />
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Entry</Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TextInput
            style={styles.textInput}
            placeholder="Write your thoughts here..."
            value={newEntry}
            onChangeText={setNewEntry}
            multiline
            numberOfLines={8}
            editable={!submitting}
            placeholderTextColor="#999"
          />

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={() => {
                setShowNewEntryForm(false);
                setNewEntry('');
                setError('');
              }}
              style={styles.cancelButton}
              disabled={submitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <Button
              title="Save Entry"
              onPress={handleAddEntry}
              loading={submitting}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.entriesTitle}>
          {entries.length === 0 ? 'No entries yet' : `${entries.length} Entries`}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#6366f1" style={{ marginVertical: 20 }} />
        ) : error && entries.length === 0 ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorMessage}>{error}</Text>
            <Button title="Retry" onPress={fetchEntries} />
          </View>
        ) : entries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📔 Start journaling your thoughts</Text>
            <Text style={styles.emptySubtext}>
              Your diary is a safe space to express yourself
            </Text>
          </View>
        ) : (
          <View>
            {entries.map((entry, index) => (
              <View key={index} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                </View>
                <Text style={styles.entryContent}>
                  {entry.content.substring(0, 150)}
                  {entry.content.length > 150 ? '...' : ''}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
  entriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  newEntryButton: {
    marginBottom: 0,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 12,
    backgroundColor: '#fff',
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  entryHeader: {
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  entryContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  errorMessage: {
    color: '#991b1b',
    marginBottom: 12,
  },
  emptyContainer: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#1e40af',
  },
});
