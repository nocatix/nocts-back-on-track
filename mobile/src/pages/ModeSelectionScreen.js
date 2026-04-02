import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useMode } from '../context/ModeContext';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';

export default function ModeSelectionScreen({ navigation }) {
  const { selectMode, loading, mode, switchMode } = useMode();
  const [selecting, setSelecting] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);

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

  const handleSwitchMode = async () => {
    Alert.alert(
      'Switch Mode',
      'Are you sure you want to switch modes? This will clear your current session.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Switch',
          onPress: async () => {
            setSelecting(true);
            try {
              const newMode = mode === 'standalone' ? 'connected' : 'standalone';
              await switchMode(newMode);
            } catch (error) {
              console.error('Error switching mode:', error);
              Alert.alert('Error', `Failed to switch mode: ${error.message}`);
            } finally {
              setSelecting(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading || selecting) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
      >
      {/* Show current mode and switch option if mode is already configured */}
      {mode && (
        <View style={[styles.currentModeCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.currentModeLabel, { color: theme.colors.textSecondary }]}>Current Mode:</Text>
          <Text style={[styles.currentModeValue, { color: theme.colors.primary }]}>
            {mode === 'standalone' ? '📱 Standalone' : '🌐 Connected to Server'}
          </Text>
          <TouchableOpacity 
            style={[styles.switchModeButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSwitchMode}
            disabled={selecting}
          >
            <Text style={styles.switchModeButtonText}>Switch Mode</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Nocts: Back on Track</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>How would you like to use this app?</Text>
      </View>

      <View style={styles.optionsContainer}>
        {/* Standalone Option */}
        <TouchableOpacity
          style={[styles.optionCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
          onPress={() => handleSelectMode('standalone')}
          disabled={selecting}
          activeOpacity={0.7}
        >
          <View style={styles.optionHeader}>
            <Text style={styles.optionIcon}>📱</Text>
            <Text style={[styles.optionTitle, { color: theme.colors.text }]}>Standalone</Text>
          </View>
          <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
            Use the app locally on your device. No server needed, no login required. Perfect for personal, single-user tracking.
          </Text>
          <View style={[styles.featureList, { borderTopColor: isDarkMode ? theme.colors.border : '#f3f4f6' }]}>
            <Text style={[styles.feature, { color: isDarkMode ? theme.colors.textSecondary : '#4b5563' }]}>✓ Works offline</Text>
            <Text style={[styles.feature, { color: isDarkMode ? theme.colors.textSecondary : '#4b5563' }]}>✓ No login required</Text>
            <Text style={[styles.feature, { color: isDarkMode ? theme.colors.textSecondary : '#4b5563' }]}>✓ Private & secure</Text>
            <Text style={[styles.feature, { color: isDarkMode ? theme.colors.textSecondary : '#4b5563' }]}>✓ No internet needed</Text>
          </View>
        </TouchableOpacity>

        {/* Connected Option */}
        <TouchableOpacity
          style={[styles.optionCard, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}
          onPress={() => handleSelectMode('connected')}
          disabled={selecting}
          activeOpacity={0.7}
        >
          <View style={styles.optionHeader}>
            <Text style={styles.optionIcon}>🌐</Text>
            <Text style={[styles.optionTitle, { color: theme.colors.text }]}>Connect to Server</Text>
          </View>
          <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
            Connect to your own Nocts server for sync across devices and multi-device access.
          </Text>
          <View style={[styles.featureList, { borderTopColor: isDarkMode ? theme.colors.border : '#f3f4f6' }]}>
            <Text style={[styles.feature, { color: isDarkMode ? theme.colors.textSecondary : '#4b5563' }]}>✓ Sync across devices</Text>
            <Text style={[styles.feature, { color: isDarkMode ? theme.colors.textSecondary : '#4b5563' }]}>✓ Secure login</Text>
            <Text style={[styles.feature, { color: isDarkMode ? theme.colors.textSecondary : '#4b5563' }]}>✓ Server-based backup</Text>
            <Text style={[styles.feature, { color: isDarkMode ? theme.colors.textSecondary : '#4b5563' }]}>✓ Share with others</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.textTertiary }]}>
          You can change this later in Settings
        </Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  currentModeCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
  },
  currentModeLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentModeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  switchModeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  switchModeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 40,
  },
  optionCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
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
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  featureList: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
  feature: {
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
