import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import modeService from './modeService';

/**
 * Remote Addiction Service
 * Handles addiction operations via server API
 * Mirrors local service interface for abstraction
 */

const getApiClient = async () => {
  const serverUrl = await modeService.getServerUrl();
  if (!serverUrl) {
    throw new Error('Server URL not configured');
  }
  
  return axios.create({
    baseURL: `${serverUrl}/api`,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const addAuthToken = async (config) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting token:', error);
  }
  return config;
};

export const remoteAddictionService = {
  async createAddiction(userId, name, stopDate, frequencyPerDay, moneySpentPerDay, notes) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.post(
        '/addictions',
        {
          name,
          stopDate,
          frequencyPerDay,
          moneySpentPerDay,
          notes,
        },
        config
      );
      
      return response.data;
    } catch (error) {
      console.error('Error creating addiction:', error);
      throw this._handleError(error);
    }
  },

  async getAddictions(userId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.get('/addictions', config);
      return response.data;
    } catch (error) {
      console.error('Error fetching addictions:', error);
      throw this._handleError(error);
    }
  },

  async getAddiction(userId, addictionId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.get(`/addictions/${addictionId}`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching addiction:', error);
      throw this._handleError(error);
    }
  },

  async updateAddiction(userId, addictionId, updates) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.put(
        `/addictions/${addictionId}`,
        updates,
        config
      );
      
      return response.data;
    } catch (error) {
      console.error('Error updating addiction:', error);
      throw this._handleError(error);
    }
  },

  async deleteAddiction(userId, addictionId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      await client.delete(`/addictions/${addictionId}`, config);
      return { success: true };
    } catch (error) {
      console.error('Error deleting addiction:', error);
      throw this._handleError(error);
    }
  },

  async getCravings(addictionId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.get(`/addictions/${addictionId}/cravings`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching cravings:', error);
      throw this._handleError(error);
    }
  },

  async logCraving(addictionId, craving) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.post(
        `/addictions/${addictionId}/cravings`,
        craving,
        config
      );
      
      return response.data;
    } catch (error) {
      console.error('Error logging craving:', error);
      throw this._handleError(error);
    }
  },

  _handleError(error) {
    if (error.response) {
      // Server returned error response
      const message = error.response.data?.message || `Server error: ${error.response.status}`;
      return new Error(message);
    } else if (error.request) {
      // Request made but no response
      return new Error('Server not responding. Check your connection.');
    } else {
      // Other errors
      return error;
    }
  },
};

export default remoteAddictionService;
