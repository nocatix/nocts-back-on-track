import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import modeService from './modeService';

/**
 * Remote Preparation Service
 * Handles preparation plan operations via server API
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

export const remotePreparationService = {
  async createPreparationPlan(userId, addictionId, responses = {}) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.post('/preparation', {
        addictionId,
        responses,
      }, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async getPreparationPlan(userId, addictionId = null) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      let url = '/preparation';
      if (addictionId) {
        url += `?addictionId=${addictionId}`;
      }
      
      const response = await client.get(url, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async updatePreparationPlan(userId, planId, updates) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.put(`/preparation/${planId}`, updates, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async updatePreparationField(userId, planId, fieldId, value) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.put(`/preparation/${planId}/${fieldId}`, { value }, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async deletePreparationPlan(userId, planId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      await client.delete(`/preparation/${planId}`, config);
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

export default remotePreparationService;
