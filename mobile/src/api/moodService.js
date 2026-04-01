import api from './axiosConfig';

export const moodService = {
  async getMoods(filters = {}) {
    try {
      const response = await api.get('/moods', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getMoodById(id) {
    try {
      const response = await api.get(`/moods/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createMood(moodData) {
    try {
      const response = await api.post('/moods', {
        ...moodData,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateMood(id, moodData) {
    try {
      const response = await api.put(`/moods/${id}`, moodData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async deleteMood(id) {
    try {
      const response = await api.delete(`/moods/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default moodService;
