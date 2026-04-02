import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useMode } from '../context/ModeContext';
import { AuthContext } from '../context/AuthContext';
import modeService from '../services/modeService';

export default function SettingsScreen({ navigation }) {
  const { mode, serverUrl, switchMode, clearModeData } = useMode();
  const { user, logout } = useContext(AuthContext);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [testing, setTesting] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (mode === 'connected' && serverUrl) {
        testConnection();
      }
    }, [mode, serverUrl])
  );

  const testConnection = async () => {
    if (mode !== 'connected' || !serverUrl) return;

    try {
      setTesting(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${serverUrl}/api/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setConnectionStatus(response.ok ? 'online' : 'offline');
    } catch (error) {
      setConnectionStatus('offline');
    } finally {
      setTesting(false);
    }
  };

  const handleSwitchMode = () => {
    const newMode = mode === 'standalone' ? 'connected' : 'standalone';
    
    Alert.alert(
      'Switch Mode?',
      `You're about to switch from ${mode} to ${newMode} mode.\n\nYour current data will not be transferred. You'll need to log in again.`,
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Switch Mode',
          onPress: async () => {
            try {
              await logout();
              await switchMode(newMode);
              // Navigation will be handled by RootNavigator when mode changes
            } catch (error) {
              Alert.alert('Error', 'Failed to switch mode: ' + error.message);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data?',
      'This will delete all local data and log you out. This cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Clear Data',
          onPress: async () => {
            try {
              await clearModeData();
              await logout();
              // This will clear everything and reset to mode selection
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data: ' + error.message);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out?',
      'You will need to log in again.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Log Out',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout: ' + error.message);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* User Info Section */}
      {user && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Information</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Username:</Text>
              <Text style={styles.value}>{user.username}</Text>
            </View>
            {user.fullName && (
              <View style={styles.row}>
                <Text style={styles.label}>Full Name:</Text>
                <Text style={styles.value}>{user.fullName}</Text>
              </View>
            )}
            {user.nameOnPhone && (
              <View style={styles.row}>
                <Text style={styles.label}>Display Name:</Text>
                <Text style={styles.value}>{user.nameOnPhone}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Mode Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Mode</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Current Mode:</Text>
            <View style={styles.modeTag}>
              <Text style={styles.modeTagText}>{mode}</Text>
            </View>
          </View>

          {mode === 'standalone' && (
            <Text style={styles.modeDescription}>
              📱 Running locally without server connection
            </Text>
          )}

          {mode === 'connected' && (
            <>
              <Text style={styles.modeDescription}>
                🌐 Connected to server for sync and multi-device access
              </Text>
              <View style={styles.row}>
                <Text style={styles.label}>Server:</Text>
                <Text style={styles.value}>{serverUrl}</Text>
              </View>
              <View style={[styles.row, { alignItems: 'center' }]}>
                <Text style={styles.label}>Connection:</Text>
                {testing ? (
                  <ActivityIndicator size="small" color="#6366f1" />
                ) : connectionStatus === 'online' ? (
                  <View style={styles.statusOnline}>
                    <Text style={styles.statusText}>🟢 Online</Text>
                  </View>
                ) : (
                  <View style={styles.statusOffline}>
                    <Text style={styles.statusText}>🔴 Offline</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.testButton}
                onPress={testConnection}
                disabled={testing}
              >
                <Text style={styles.testButtonText}>
                  {testing ? 'Testing...' : 'Test Connection'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.switchButton}
            onPress={handleSwitchMode}
          >
            <Text style={styles.switchButtonText}>
              Switch to {mode === 'standalone' ? 'Server' : 'Standalone'} Mode
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <View style={styles.card}>
          <Text style={styles.sectionDescription}>
            Choose how to manage your data
          </Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearAllData}
          >
            <Text style={styles.dangerButtonText}>🗑️ Clear All Data</Text>
          </TouchableOpacity>
          <Text style={styles.buttonDescription}>
            Deletes all local data and resets the app
          </Text>
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
          <Text style={styles.buttonDescription}>
            You'll need to log in again
          </Text>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <View style={styles.card}>
          <Text style={styles.appInfo}>Nocts: Back on Track</Text>
          <Text style={styles.appVersion}>v1.3.0</Text>
          <Text style={styles.appDescription}>
            Your companion for recovery and habit tracking
          </Text>
        </View>
      </View>

      <View style={styles.footer} />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  sectionDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#1f2937',
    fontFamily: 'monospace',
  },
  modeTag: {
    backgroundColor: '#6366f1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  modeTagText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  modeDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 12,
    marginTop: 8,
  },
  statusOnline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusOffline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  testButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  switchButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  switchButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  dangerButton: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
  logoutButton: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
  buttonDescription: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  appInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    height: 40,
  },
});
