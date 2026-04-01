import api from './axiosConfig';

export const achievementService = {
  async getAchievements() {
    try {
      const response = await api.get('/achievements');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getTrophies() {
    try {
      const response = await api.get('/trophies');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async checkAchievements() {
    try {
      const response = await api.post('/achievements/check');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default achievementService;
