import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useMode } from '../context/ModeContext';

export default function ModeSelectionScreen({ navigation }) {
  const { selectMode, loading } = useMode();
  const [selecting, setSelecting] = useState(false);

  const handleSelectMode = async (mode) => {
    setSelecting(true);
    try {
      await selectMode(mode);
      // Navigation will be handled by ModeContext state change
    } catch (error) {
      console.error('Error selecting mode:', error);
      Alert.alert('Error', `Failed to select mode: ${error.message}`);
    } finally {
      setSelecting(false);
    }
  };

  if (loading || selecting) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Nocts: Back on Track</Text>
        <Text style={styles.subtitle}>How would you like to use this app?</Text>
      </View>

      <View style={styles.optionsContainer}>
        {/* Standalone Option */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => handleSelectMode('standalone')}
          disabled={selecting}
          activeOpacity={0.7}
        >
          <View style={styles.optionHeader}>
            <Text style={styles.optionIcon}>📱</Text>
            <Text style={styles.optionTitle}>Standalone</Text>
          </View>
          <Text style={styles.optionDescription}>
            Use the app locally on your device. No server needed, no login required. Perfect for personal, single-user tracking.
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.feature}>✓ Works offline</Text>
            <Text style={styles.feature}>✓ No login required</Text>
            <Text style={styles.feature}>✓ Private & secure</Text>
            <Text style={styles.feature}>✓ No internet needed</Text>
          </View>
        </TouchableOpacity>

        {/* Connected Option */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => handleSelectMode('connected')}
          disabled={selecting}
          activeOpacity={0.7}
        >
          <View style={styles.optionHeader}>
            <Text style={styles.optionIcon}>🌐</Text>
            <Text style={styles.optionTitle}>Connect to Server</Text>
          </View>
          <Text style={styles.optionDescription}>
            Connect to your own Nocts server for sync across devices and multi-device access.
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.feature}>✓ Sync across devices</Text>
            <Text style={styles.feature}>✓ Secure login</Text>
            <Text style={styles.feature}>✓ Server-based backup</Text>
            <Text style={styles.feature}>✓ Share with others</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          You can change this later in Settings
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 40,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  featureList: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  feature: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 6,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
