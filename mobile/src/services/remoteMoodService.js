import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import modeService from './modeService';

/**
 * Remote Mood Service
 * Handles mood operations via server API
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

export const remoteMoodService = {
  async createMood(userId, moodData) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.post('/moods', moodData, config);
      return response.data;
    } catch (error) {
      console.error('Error creating mood:', error);
      throw this._handleError(error);
    }
  },

  async getMoods(userId, startDate, endDate) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.get('/moods', {
        ...config,
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching moods:', error);
      throw this._handleError(error);
    }
  },

  async getMoodByDate(userId, date) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.get(`/moods/date/${date}`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching mood:', error);
      throw this._handleError(error);
    }
  },

  async updateMood(userId, moodId, moodData) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.put(`/moods/${moodId}`, moodData, config);
      return response.data;
    } catch (error) {
      console.error('Error updating mood:', error);
      throw this._handleError(error);
    }
  },

  async deleteMood(userId, moodId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      await client.delete(`/moods/${moodId}`, config);
      return { success: true };
    } catch (error) {
      console.error('Error deleting mood:', error);
      throw this._handleError(error);
    }
  },

  _handleError(error) {
    if (error.response) {
      const message = error.response.data?.message || `Server error: ${error.response.status}`;
      return new Error(message);
    } else if (error.request) {
      return new Error('Server not responding. Check your connection.');
    } else {
      return error;
    }
  },
};

export default remoteMoodService;
