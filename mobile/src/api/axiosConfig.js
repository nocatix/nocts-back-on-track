import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import modeService from '../services/modeService';

/**
 * Get dynamic axios instance based on mode
 * For standalone: uses localhost (won't be used)
 * For connected: uses configured server URL from ModeContext
 */
const getApiInstance = async () => {
  const mode = await modeService.getActiveMode();
  let baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

  if (mode === 'connected') {
    const serverUrl = await modeService.getServerUrl();
    if (serverUrl) {
      baseURL = `${serverUrl}/api`;
    }
  }

  return axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Create a shared axios instance
 * This is initialized once at app startup
 */
let instance = null;
let instancePromise = null;

export const initializeAxiosInstance = async () => {
  if (!instance) {
    if (instancePromise) {
      return instancePromise;
    }
    
    instancePromise = getApiInstance();
    instance = await instancePromise;
    
    // Add request interceptor for token
    instance.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('[Axios] Error retrieving token:', error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for token refresh and error handling
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - token expired or invalid
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            console.log('[Axios] Token expired, attempting refresh...');
            
            // Clear invalid token
            await AsyncStorage.removeItem('userToken');
            
            // In a real app, you might refresh the token here
            // For now, we redirect to login by rejecting
            // The auth context will handle the logout
            
            return Promise.reject(error);
          } catch (refreshError) {
            console.error('[Axios] Error handling 401:', refreshError);
            return Promise.reject(refreshError);
          }
        }

        // Handle network errors
        if (error.response?.status === 0 || !error.response) {
          console.error('[Axios] Network error:', error.message);
        }

        // Handle other errors
        if (error.response?.status >= 500) {
          console.error('[Axios] Server error:', error.response.status);
        }

        return Promise.reject(error);
      }
    );
  }

  return instance;
};

/**
 * Reset instance when mode changes
 * Call this when switching between modes
 */
export const resetAxiosInstance = () => {
  instance = null;
  instancePromise = null;
};

/**
 * Default export - gets or initializes the instance
 */
export default {
  async request(config) {
    const axiosInstance = await initializeAxiosInstance();
    return axiosInstance.request(config);
  },

  async get(url, config) {
    const axiosInstance = await initializeAxiosInstance();
    return axiosInstance.get(url, config);
  },

  async post(url, data, config) {
    const axiosInstance = await initializeAxiosInstance();
    return axiosInstance.post(url, data, config);
  },

  async put(url, data, config) {
    const axiosInstance = await initializeAxiosInstance();
    return axiosInstance.put(url, data, config);
  },

  async delete(url, config) {
    const axiosInstance = await initializeAxiosInstance();
    return axiosInstance.delete(url, config);
  },

  async patch(url, data, config) {
    const axiosInstance = await initializeAxiosInstance();
    return axiosInstance.patch(url, data, config);
  },
};
