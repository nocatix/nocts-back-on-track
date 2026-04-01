import api from './axiosConfig';

export const weightService = {
  async getWeights(filters = {}) {
    try {
      const response = await api.get('/weights', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createWeight(weightData) {
    try {
      const response = await api.post('/weights', {
        ...weightData,
        date: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateWeight(id, weightData) {
    try {
      const response = await api.put(`/weights/${id}`, weightData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async deleteWeight(id) {
    try {
      const response = await api.delete(`/weights/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default weightService;
