import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import modeService from './modeService';

/**
 * Remote Self-Assessment Service
 * Handles self-assessment operations via server API
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

export const remoteSelfAssessmentService = {
  async createAssessment(userId, addictionId, responses = {}, score = 0) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      const response = await client.post('/self-assessments', {
        addictionId,
        responses,
        score,
      }, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async getAssessments(userId, addictionId = null) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      let url = '/self-assessments';
      if (addictionId) {
        url += `?addictionId=${addictionId}`;
      }
      
      const response = await client.get(url, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async getLatestAssessment(userId, addictionId = null) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      let url = '/self-assessments/latest';
      if (addictionId) {
        url += `?addictionId=${addictionId}`;
      }
      
      const response = await client.get(url, config);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  },

  async deleteAssessment(userId, assessmentId) {
    try {
      const client = await getApiClient();
      const config = await addAuthToken({});
      
      await client.delete(`/self-assessments/${assessmentId}`, config);
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

export default remoteSelfAssessmentService;
