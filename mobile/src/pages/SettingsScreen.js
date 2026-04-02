import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useMode } from '../context/ModeContext';
import { DarkModeContext } from '../context/DarkModeContext';
import { BiometricContext } from '../context/BiometricContext';
import { getTheme } from '../utils/theme';
import { AuthContext } from '../context/AuthContext';
import modeService from '../services/modeService';
import LanguageSelector from '../components/LanguageSelector';

export default function SettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { mode, serverUrl, switchMode, clearModeData } = useMode();
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { isBiometricAvailable, isBiometricEnabled, enableBiometric, disableBiometric } = useContext(BiometricContext);
  const theme = getTheme(isDarkMode);
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
      t('settings.confirmSwitchMode', 'Switch Mode?'),
      t('settings.switchModeMessage', 'You\'re about to switch from {{mode}} to a different mode.\n\nYour current data will not be transferred. You\'ll need to log in again.', { mode }),
      [
        { text: t('common.cancel', 'Cancel'), onPress: () => {} },
        {
          text: t('settings.switchModeButton', 'Switch Mode'),
          onPress: async () => {
            try {
              await logout();
              await switchMode(newMode);
              // Navigation will be handled by RootNavigator when mode changes
            } catch (error) {
              Alert.alert(t('common.error', 'Error'), 'Failed to switch mode: ' + error.message);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      t('settings.confirmClearAllData', 'Clear All Data?'),
      t('settings.clearDataMessage', 'This will delete all local data and log you out. This cannot be undone.'),
      [
        { text: t('common.cancel', 'Cancel'), onPress: () => {} },
        {
          text: t('settings.clearDataButton', 'Clear Data'),
          onPress: async () => {
            try {
              await clearModeData();
              await logout();
              // This will clear everything and reset to mode selection
            } catch (error) {
              Alert.alert(t('common.error', 'Error'), 'Failed to clear data: ' + error.message);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('settings.confirmLogout', 'Log Out?'),
      t('settings.logoutMessage', 'You will need to log in again.'),
      [
        { text: t('common.cancel', 'Cancel'), onPress: () => {} },
        {
          text: t('settings.logOutButton', 'Log Out'),
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert(t('common.error', 'Error'), 'Failed to logout: ' + error.message);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

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
        }
      ]} 
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.cardBg, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('settings.title', 'Settings')}</Text>
      </View>

      {/* User Info Section - Hide in standalone mode */}
      {user && mode === 'connected' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>{t('settings.userInformation', 'User Information')}</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
            <View style={styles.row}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{t('settings.username', 'Username')}:</Text>
              <Text style={[styles.value, { color: theme.colors.text }]}>{user.username}</Text>
            </View>
            {user.fullName && (
              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{t('settings.fullName', 'Full Name')}:</Text>
                <Text style={[styles.value, { color: theme.colors.text }]}>{user.fullName}</Text>
              </View>
            )}
            {user.nameOnPhone && (
              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{t('settings.displayName', 'Display Name')}:</Text>
                <Text style={[styles.value, { color: theme.colors.text }]}>{user.nameOnPhone}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Display/Theme Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>{t('settings.display', 'Display')}</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
            <View>
              <Text style={[styles.label, { color: theme.colors.text }]}>{t('settings.darkMode', 'Dark Mode')}</Text>
              <Text style={[styles.description, { color: theme.colors.textTertiary }]}>{t('settings.useDarkTheme', 'Use dark theme')}</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#d1d5db', true: '#a78bfa' }}
              thumbColor={isDarkMode ? '#818cf8' : '#f3f4f6'}
            />
          </View>
        </View>
      </View>

      {/* Language Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>{t('settings.language', 'Language')}</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <LanguageSelector />
        </View>
      </View>

      {/* Security Section - Standalone only */}
      {mode === 'standalone' && isBiometricAvailable && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>{t('settings.security', 'Security')}</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
            <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
              <View>
                <Text style={[styles.label, { color: theme.colors.text }]}>{t('settings.biometricLock', 'Biometric Lock')}</Text>
                <Text style={[styles.description, { color: theme.colors.textTertiary }]}>{t('settings.requireFingerprintOrFaceId', 'Require fingerprint or face ID')}</Text>
              </View>
              <Switch
                value={isBiometricEnabled}
                onValueChange={(value) => {
                  if (value) {
                    enableBiometric();
                  } else {
                    disableBiometric();
                  }
                }}
                trackColor={{ false: '#d1d5db', true: '#a78bfa' }}
                thumbColor={isBiometricEnabled ? '#818cf8' : '#f3f4f6'}
              />
            </View>
          </View>
        </View>
      )}

      {/* Mode Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>{t('settings.appMode', 'App Mode')}</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{t('settings.currentMode', 'Current Mode')}:</Text>
            <View style={[styles.modeTag, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.modeTagText, { color: '#fff' }]}>{mode}</Text>
            </View>
          </View>

          {mode === 'standalone' && (
            <Text style={[styles.modeDescription, { color: theme.colors.textTertiary }]}>
              📱 {t('settings.runningLocally', 'Running locally without server connection')}
            </Text>
          )}

          {mode === 'connected' && (
            <>
              <Text style={[styles.modeDescription, { color: theme.colors.textTertiary }]}>
                🌐 {t('settings.connectedToServer', 'Connected to server for sync and multi-device access')}
              </Text>
              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{t('settings.server', 'Server')}:</Text>
                <Text style={[styles.value, { color: theme.colors.text }]}>{serverUrl}</Text>
              </View>
              <View style={[styles.row, { alignItems: 'center' }]}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{t('settings.connection', 'Connection')}:</Text>
                {testing ? (
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                ) : connectionStatus === 'online' ? (
                  <View style={[styles.statusOnline, { backgroundColor: theme.colors.success }]}>
                    <Text style={[styles.statusText, { color: '#fff' }]}>🟢 {t('settings.online', 'Online')}</Text>
                  </View>
                ) : (
                  <View style={[styles.statusOffline, { backgroundColor: theme.colors.error }]}>
                    <Text style={[styles.statusText, { color: '#fff' }]}>🔴 {t('settings.offline', 'Offline')}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={[styles.testButton, { backgroundColor: theme.colors.primary }]}
                onPress={testConnection}
                disabled={testing}
              >
                <Text style={[styles.testButtonText, { color: '#fff' }]}>
                  {testing ? t('settings.testing', 'Testing...') : t('settings.testConnection', 'Test Connection')}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={[styles.switchButton, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}
            onPress={handleSwitchMode}
          >
            <Text style={[styles.switchButtonText, { color: '#fff' }]}>
              {mode === 'standalone' ? t('settings.switchToServer', 'Switch to Server Mode') : t('settings.switchToStandalone', 'Switch to Standalone Mode')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Data Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>{t('settings.dataManagement', 'Data Management')}</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionDescription, { color: theme.colors.textTertiary }]}>
            {t('settings.chooseManageData', 'Choose how to manage your data')}
          </Text>
          <TouchableOpacity
            style={[styles.dangerButton, { backgroundColor: theme.colors.error }]}
            onPress={handleClearAllData}
          >
            <Text style={[styles.dangerButtonText, { color: '#fff' }]}>🗑️ {t('settings.clearAllData', 'Clear All Data')}</Text>
          </TouchableOpacity>
          <Text style={[styles.buttonDescription, { color: theme.colors.textTertiary }]}>
            {t('settings.deletesAllData', 'Deletes all local data and resets the app')}
          </Text>
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>{t('settings.account', 'Account')}</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
            onPress={handleLogout}
          >
            <Text style={[styles.logoutButtonText, { color: '#fff' }]}>{t('settings.signOut', 'Sign Out')}</Text>
          </TouchableOpacity>
          <Text style={[styles.buttonDescription, { color: theme.colors.textTertiary }]}>
            {t('settings.needLoginAgain', 'You\'ll need to log in again')}
          </Text>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <View style={[styles.card, { backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }]}>
          <Text style={[styles.appInfo, { color: theme.colors.text }]}>{t('settings.appTitle', 'Nocts: Back on Track')}</Text>
          <Text style={[styles.appVersion, { color: theme.colors.textSecondary }]}>{t('settings.appVersion', 'v1.3.0')}</Text>
          <Text style={[styles.appDescription, { color: theme.colors.textTertiary }]}>
            {t('settings.appDescription', 'Your companion for recovery and habit tracking')}
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
  description: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
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
