import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import modeService from './modeService';

/**
 * Remote Weight Service
 * Handles weight operations via server API
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

export const remoteWeightService = {
  async createWeight(userId, weightData) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.post('/weights', weightData, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async getWeights(userId, startDate, endDate) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.get('/weights', {
        ...config,
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async updateWeight(userId, weightId, weightData) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.put(`/weights/${weightId}`, weightData, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async deleteWeight(userId, weightId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      await client.delete(`/weights/${weightId}`, config);
      return { success: true };
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

export default remoteWeightService;
