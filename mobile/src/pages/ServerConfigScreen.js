import React, { useState } from 'react';
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
} from 'react-native';
import { useMode } from '../context/ModeContext';
import modeService from '../services/modeService';

export default function ServerConfigScreen({ navigation }) {
  const { updateServerUrl } = useMode();
  const [serverUrl, setServerUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [error, setError] = useState('');

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Server Configuration</Text>
          <Text style={styles.subtitle}>
            Enter your Nocts server address to connect
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Server URL</Text>
          <TextInput
            style={[
              styles.input,
              error && styles.inputError,
              connectionStatus === 'success' && styles.inputSuccess,
            ]}
            placeholder="e.g., 192.168.1.100:5000"
            placeholderTextColor="#d1d5db"
            value={serverUrl}
            onChangeText={handleUrlChange}
            editable={!testing && !validating}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          {connectionStatus === 'success' && (
            <Text style={styles.successText}>✓ Connection successful</Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.testButton,
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
                styles.confirmButton,
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
              <Text style={styles.skipButtonText}>Skip for Now</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Server URL Format:</Text>
          <Text style={styles.infoText}>
            • Local Network: http://192.168.1.100:5000
          </Text>
          <Text style={styles.infoText}>• Hostname: http://server-name:5000</Text>
          <Text style={styles.infoText}>
            • Include protocol (http:// or https://)
          </Text>
          <Text style={styles.infoText}>• Default port is 5000 for Nocts</Text>
        </View>

        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Need help?</Text>
          <Text style={styles.debugText}>
            Make sure your Nocts server is running and accessible from your device on the same network.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
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
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 8,
    backgroundColor: '#f9fafb',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  inputSuccess: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 12,
  },
  successText: {
    color: '#10b981',
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
  testButton: {
    backgroundColor: '#9ca3af',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#6366f1',
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
    color: '#6b7280',
    fontSize: 14,
  },
  infoContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0284c7',
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0c4a6e',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#0c4a6e',
    lineHeight: 18,
    marginBottom: 4,
  },
  debugContainer: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ca8a04',
  },
  debugTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#78350f',
    marginBottom: 6,
  },
  debugText: {
    fontSize: 12,
    color: '#78350f',
    lineHeight: 18,
  },
});
