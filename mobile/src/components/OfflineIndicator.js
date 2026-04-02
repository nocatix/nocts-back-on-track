import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useMode } from '../context/ModeContext';
import { useNetworkStatus } from '../utils/networkStatus';

/**
 * Offline banner component
 * Shows when in connected mode and offline
 */
export default function OfflineIndicator() {
  const { mode } = useMode();
  const { isConnected } = useNetworkStatus();
  const [shouldShow, setShouldShow] = useState(false);
  const slideAnim = new Animated.Value(-50);

  useEffect(() => {
    // Only show banner in connected mode when offline
    const show = mode === 'connected' && isConnected === false;
    
    if (show !== shouldShow) {
      setShouldShow(show);
      
      Animated.timing(slideAnim, {
        toValue: show ? 0 : -50,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [mode, isConnected]);

  if (!shouldShow) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>🔴</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>No Internet Connection</Text>
          <Text style={styles.message}>
            Some features may not work properly
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fee2e2',
    borderBottomWidth: 1,
    borderBottomColor: '#fecaca',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
    color: '#b91c1c',
  },
});
