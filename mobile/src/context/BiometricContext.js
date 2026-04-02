import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

export const BiometricContext = createContext();

export function BiometricProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState(null);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check biometric availability on app start
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricAvailable(compatible);

      if (compatible) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setBiometricType(types);
      }

      // Check if user has enabled biometric lock
      const enabled = await AsyncStorage.getItem('biometricEnabled');
      if (enabled !== null) {
        setIsBiometricEnabled(JSON.parse(enabled));
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const authenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: false,
        reason: 'Unlock your app to continue',
      });

      if (result.success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  const enableBiometric = async () => {
    try {
      setIsBiometricEnabled(true);
      await AsyncStorage.setItem('biometricEnabled', JSON.stringify(true));
      return true;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      return false;
    }
  };

  const disableBiometric = async () => {
    try {
      setIsBiometricEnabled(false);
      await AsyncStorage.setItem('biometricEnabled', JSON.stringify(false));
      return true;
    } catch (error) {
      console.error('Error disabling biometric:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <BiometricContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isBiometricAvailable,
        biometricType,
        isBiometricEnabled,
        authenticate,
        enableBiometric,
        disableBiometric,
        logout,
        loading,
      }}
    >
      {children}
    </BiometricContext.Provider>
  );
}
