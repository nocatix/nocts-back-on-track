import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BiometricContext } from '../context/BiometricContext';
import { DarkModeContext } from '../context/DarkModeContext';
import { getTheme } from '../utils/theme';

export default function BiometricLockScreen() {
  const { isAuthenticated, authenticate, isBiometricAvailable, loading: bioLoading } = useContext(BiometricContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = getTheme(isDarkMode);
  const [authenticating, setAuthenticating] = React.useState(false);

  useEffect(() => {
    // Auto-trigger biometric on component mount if available
    if (isBiometricAvailable && !isAuthenticated && !bioLoading) {
      handleBiometricUnlock();
    }
  }, [isBiometricAvailable, isAuthenticated, bioLoading]);

  const handleBiometricUnlock = async () => {
    setAuthenticating(true);
    const success = await authenticate();
    setAuthenticating(false);

    if (!success) {
      Alert.alert('Authentication Failed', 'Please try again or use your PIN', [
        { text: 'Try Again', onPress: () => handleBiometricUnlock() },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* App Icon */}
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
          <MaterialCommunityIcons
            name="lock"
            size={60}
            color="#fff"
          />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.colors.text }]}>
          App Locked
        </Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {isBiometricAvailable
            ? 'Use your biometric or system unlock'
            : 'Use your system PIN to unlock'}
        </Text>

        {/* Unlock Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleBiometricUnlock}
          disabled={authenticating}
        >
          {authenticating ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <>
              <MaterialCommunityIcons
                name={isBiometricAvailable ? 'fingerprint' : 'lock-open'}
                size={32}
                color="#fff"
              />
              <Text style={styles.buttonText}>
                {isBiometricAvailable ? 'Unlock' : 'Enter PIN'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Info Text */}
        <Text style={[styles.infoText, { color: theme.colors.textTertiary }]}>
          This app is protected with system authentication
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
    minHeight: 56,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});
