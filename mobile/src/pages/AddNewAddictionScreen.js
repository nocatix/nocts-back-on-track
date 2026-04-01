import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import addictionService from '../api/addictionService';

const ADDICTION_TYPES = [
  'nicotine',
  'alcohol',
  'cannabis',
  'hardDrugs',
  'coffee',
  'sugar',
  'socialMedia',
  'videoGames',
  'gambling',
  'pornography',
  'shopping',
  'overeating',
  'doomscrolling',
  'other',
];

const ADDICTION_LABELS = {
  nicotine: 'Nicotine/Smoking',
  alcohol: 'Alcohol',
  cannabis: 'Cannabis',
  hardDrugs: 'Hard Drugs',
  coffee: 'Caffeine/Coffee',
  sugar: 'Sugar',
  socialMedia: 'Social Media',
  videoGames: 'Video Games',
  gambling: 'Gambling',
  pornography: 'Pornography',
  shopping: 'Shopping',
  overeating: 'Overeating',
  doomscrolling: 'Doomscrolling',
  other: 'Other',
};

export default function AddNewAddictionScreen({ navigation }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('nicotine');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddAddiction = async () => {
    if (!name.trim()) {
      setError('Please enter an addiction name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addictionService.createAddiction({
        name: name.trim(),
        type,
        description: description.trim(),
        startDate: new Date().toISOString(),
        status: 'active',
      });

      // Navigate back to dashboard
      navigation.goBack();
    } catch (err) {
      setError(err.message || 'Failed to create addiction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Track a New Addiction</Text>
          <Text style={styles.subtitle}>
            Starting today on your recovery journey
          </Text>
        </View>

        <View style={styles.form}>
          <ErrorMessage message={error} />

          <Text style={styles.label}>Addiction Name</Text>
          <FormInput
            placeholder="e.g., Coffee, Instagram, Cigarettes"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />

          <Text style={styles.label}>Type</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.typeScroll}
          >
            {ADDICTION_TYPES.map((addictionType) => (
              <TouchableOpacity
                key={addictionType}
                onPress={() => setType(addictionType)}
                style={[
                  styles.typeButton,
                  type === addictionType && styles.typeButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    type === addictionType && styles.typeButtonTextSelected,
                  ]}
                >
                  {ADDICTION_LABELS[addictionType]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Description (optional)</Text>
          <FormInput
            placeholder="How has this addiction affected you?"
            value={description}
            onChangeText={setDescription}
            editable={!loading}
          />

          <Button
            title="Start Tracking"
            onPress={handleAddAddiction}
            loading={loading}
            style={styles.button}
          />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.linkText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  typeScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  typeButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  typeButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },
  button: {
    marginTop: 20,
    marginBottom: 16,
  },
  linkText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});
