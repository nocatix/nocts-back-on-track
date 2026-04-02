import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Hook for monitoring network connectivity
 * Returns true if device has internet connection
 */
export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial network state
    const checkNetwork = async () => {
      try {
        const state = await NetInfo.fetch();
        setIsConnected(state.isConnected && state.isInternetReachable !== false);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking network:', error);
        setIsLoading(false);
      }
    };

    checkNetwork();

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected && state.isInternetReachable !== false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { isConnected, isLoading };
}

/**
 * Check if currently connected to network
 */
export async function checkNetworkConnection() {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable !== false;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
}

/**
 * Get detailed network information
 */
export async function getNetworkInfo() {
  try {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
      details: state.details,
    };
  } catch (error) {
    console.error('Error getting network info:', error);
    return {
      isConnected: false,
      isInternetReachable: false,
      type: 'unknown',
      details: null,
    };
  }
}
