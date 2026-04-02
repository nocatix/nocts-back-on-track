import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import modeService from './modeService';

/**
 * Remote Diary Service
 * Handles diary operations via server API
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

export const remoteDiaryService = {
  async createDiary(userId, diaryData) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.post('/diary', diaryData, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async getDiaries(userId, startDate, endDate) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.get('/diary', {
        ...config,
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async getDiary(userId, diaryId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.get(`/diary/${diaryId}`, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async updateDiary(userId, diaryId, diaryData) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.put(`/diary/${diaryId}`, diaryData, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async deleteDiary(userId, diaryId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      await client.delete(`/diary/${diaryId}`, config);
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

export default remoteDiaryService;
