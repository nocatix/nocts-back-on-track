import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import modeService from './modeService';

/**
 * Remote Achievement Service
 * Handles achievement operations via server API
 */

const getApiClient = async () => {
  const serverUrl = await modeService.getServerUrl();
  if (!serverUrl) {
    throw new Error('Server URL not configured');
  }
  
  return axios.create({
    baseURL: `${serverUrl}/api`,
    timeout: 10000,
  });
};

const addAuthToken = async (config) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    }
  } catch (error) {
    console.error('Error getting token:', error);
  }
  return config;
};

export const remoteAchievementService = {
  async initializeAchievements(userId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.post('/achievements/initialize', {}, config);
      return response.data;
    } catch (error) {
      // It's ok if achievements already exist
      if (error.response?.status === 409) {
        return { message: 'Achievements already initialized' };
      }
      throw this._handleError(error);
    }
  },

  async getAchievements(userId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.get('/achievements', config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async checkAchievements(userId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.post('/achievements/check', {}, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async getAchievementById(userId, achievementId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.get(`/achievements/${achievementId}`, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  _handleError(error) {
    if (error.response) {
      return new Error(error.response.data?.message || `Server error: ${error.response.status}`);
    }
    return new Error('Server not responding. Check your connection.');
  },
};

export default remoteAchievementService;
