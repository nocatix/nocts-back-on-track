import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import modeService from './modeService';

/**
 * Remote Trophy Service
 * Handles trophy operations via server API
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

export const remoteTrophyService = {
  async getTrophies(userId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.get('/trophies', config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async getTrophyById(userId, trophyId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.get(`/trophies/${trophyId}`, config);
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

export default remoteTrophyService;
