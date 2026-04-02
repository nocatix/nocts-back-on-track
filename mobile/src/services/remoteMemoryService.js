import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import modeService from './modeService';

/**
 * Remote Memory Service
 * Handles memory operations via server API
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

export const remoteMemoryService = {
  async createMemory(userId, memoryData) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.post('/memories', memoryData, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async getMemories(userId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.get('/memories', config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async getMemory(userId, memoryId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.get(`/memories/${memoryId}`, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async updateMemory(userId, memoryId, memoryData) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.put(`/memories/${memoryId}`, memoryData, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async deleteMemory(userId, memoryId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      await client.delete(`/memories/${memoryId}`, config);
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

export default remoteMemoryService;
