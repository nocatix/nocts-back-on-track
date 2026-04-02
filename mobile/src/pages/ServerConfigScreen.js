import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useMode } from '../context/ModeContext';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';
import modeService from '../services/modeService';

export default function ServerConfigScreen({ navigation }) {
  const { updateServerUrl, switchMode } = useMode();
  const [serverUrl, setServerUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [error, setError] = useState('');
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);

  const handleUrlChange = (text) => {
    setServerUrl(text);
    setError('');
    setConnectionStatus(null);
  };

  const testConnection = async () => {
    try {
      setTesting(true);
      setError('');
      setConnectionStatus(null);

      // Validate URL format
      const validation = modeService.validateServerUrl(serverUrl);
      if (!validation.valid) {
        setError(validation.error || 'Invalid URL');
        return;
      }

      const normalizedUrl = validation.normalized;
      console.log('[ServerConfig] Testing connection to:', normalizedUrl);

      // Test connection to server
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch(`${normalizedUrl}/api/health`, {
          method: 'GET',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          setConnectionStatus('success');
          Alert.alert(
            'Connection Successful',
            `Connected to server at ${normalizedUrl}`
          );
          // Don't save yet - let user confirm they want to proceed
        } else {
          setConnectionStatus('error');
          setError(`Server responded with status ${response.status}`);
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          setConnectionStatus('error');
          setError('Connection timeout - server not responding');
        } else {
          setConnectionStatus('error');
          setError('Connection failed - server unreachable');
        }
      }
    } catch (err) {
      console.error('Error testing connection:', err);
      setConnectionStatus('error');
      setError(err.message || 'Failed to test connection');
    } finally {
      setTesting(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setValidating(true);
      setError('');

      // Validate URL format
      const validation = modeService.validateServerUrl(serverUrl);
      if (!validation.valid) {
        setError(validation.error || 'Invalid URL');
        return;
      }

      const normalizedUrl = validation.normalized;

      // Save server URL
      await updateServerUrl(normalizedUrl);
      console.log('[ServerConfig] Server URL saved:', normalizedUrl);

      // Navigate to login screen
      // Navigation will be handled by ModeContext state change
    } catch (err) {
      console.error('Error saving server URL:', err);
      setError(err.message || 'Failed to save server configuration');
    } finally {
      setValidating(false);
    }
  };

  const handleSkip = async () => {
    Alert.alert(
      'Skip Configuration?',
      'You can configure the server later in Settings.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Skip',
          onPress: async () => {
            try {
              // Save with empty URL but mark as connected mode
              await updateServerUrl('');
            } catch (err) {
              console.error('Error skipping:', err);
            }
          },
        },
      ]
    );
  };

  const handleSwitchToStandalone = async () => {
    Alert.alert(
      'Switch to Standalone?',
      'Are you sure you want to switch back to standalone mode? This will clear your current session.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Switch',
          onPress: async () => {
            try {
              await switchMode('standalone');
            } catch (error) {
              console.error('Error switching mode:', error);
              Alert.alert('Error', `Failed to switch mode: ${error.message}`);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={[styles.content, { backgroundColor: theme.colors.background }]} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Server Configuration</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Enter your Nocts server address to connect
          </Text>
        </View>

        <View style={[styles.formContainer, { backgroundColor: theme.colors.cardBg }]}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Server URL</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.inputBg,
                borderColor: error ? theme.colors.error : connectionStatus === 'success' ? theme.colors.success : theme.colors.inputBorder,
                color: theme.colors.text,
              },
            ]}
            placeholder="e.g., 192.168.1.100:5000"
            placeholderTextColor={theme.colors.textTertiary}
            value={serverUrl}
            onChangeText={handleUrlChange}
            editable={!testing && !validating}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}

          {connectionStatus === 'success' && (
            <Text style={[styles.successText, { color: theme.colors.success }]}>✓ Connection successful</Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.colors.textTertiary },
                (testing || validating || !serverUrl) && styles.buttonDisabled,
              ]}
              onPress={testConnection}
              disabled={testing || validating || !serverUrl}
            >
              {testing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.testButtonText}>Test Connection</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.colors.primary },
                (validating || !serverUrl || connectionStatus !== 'success') &&
                  styles.buttonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={validating || !serverUrl || connectionStatus !== 'success'}
            >
              {validating ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.confirmButtonText}>Proceed to Login</Text>
              )}
            </TouchableOpacity>
          </View>

          {serverUrl && connectionStatus === 'success' && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              disabled={validating}
            >
              <Text style={[styles.skipButtonText, { color: theme.colors.textSecondary }]}>Skip for Now</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.switchToStandaloneButton, { borderColor: theme.colors.error }]}
          onPress={handleSwitchToStandalone}
        >
          <Text style={[styles.switchToStandaloneText, { color: theme.colors.error }]}>
            ← Switch Back to Standalone
          </Text>
        </TouchableOpacity>

        <View style={[
          styles.infoContainer,
          { 
            backgroundColor: isDarkMode ? '#1e3a5f' : '#f0f9ff',
            borderLeftColor: isDarkMode ? '#0284c7' : '#0284c7',
          }
        ]}>
          <Text style={[
            styles.infoTitle,
            { color: isDarkMode ? '#7dd3fc' : '#0c4a6e' }
          ]}>Server URL Format:</Text>
          <Text style={[
            styles.infoText,
            { color: isDarkMode ? '#7dd3fc' : '#0c4a6e' }
          ]}>
            • Local Network: http://192.168.1.100:5000
          </Text>
          <Text style={[
            styles.infoText,
            { color: isDarkMode ? '#7dd3fc' : '#0c4a6e' }
          ]}>• Hostname: http://server-name:5000</Text>
          <Text style={[
            styles.infoText,
            { color: isDarkMode ? '#7dd3fc' : '#0c4a6e' }
          ]}>
            • Include protocol (http:// or https://)
          </Text>
          <Text style={[
            styles.infoText,
            { color: isDarkMode ? '#7dd3fc' : '#0c4a6e' }
          ]}>• Default port is 5000 for Nocts</Text>
        </View>

        <View style={[
          styles.debugContainer,
          {
            backgroundColor: isDarkMode ? '#713f12' : '#fef3c7',
            borderLeftColor: isDarkMode ? '#ca8a04' : '#ca8a04',
          }
        ]}>
          <Text style={[
            styles.debugTitle,
            { color: isDarkMode ? '#fbbf24' : '#78350f' }
          ]}>Need help?</Text>
          <Text style={[
            styles.debugText,
            { color: isDarkMode ? '#fbbf24' : '#78350f' }
          ]}>
            Make sure your Nocts server is running and accessible from your device on the same network.
          </Text>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  formContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 12,
  },
  successText: {
    fontSize: 12,
    marginBottom: 12,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 14,
  },
  switchToStandaloneButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  switchToStandaloneText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
  debugContainer: {
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
  },
  debugTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  debugText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
