import api from './axiosConfig';

export const addictionService = {
  async getAddictions() {
    try {
      const response = await api.get('/addictions');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getAddictionById(id) {
    try {
      const response = await api.get(`/addictions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createAddiction(addictionData) {
    try {
      const response = await api.post('/addictions', addictionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateAddiction(id, addictionData) {
    try {
      const response = await api.put(`/addictions/${id}`, addictionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async deleteAddiction(id) {
    try {
      const response = await api.delete(`/addictions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getCravings(addictionId) {
    try {
      const response = await api.get(`/addictions/${addictionId}/cravings`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async addCraving(addictionId, intensity) {
    try {
      const response = await api.post(`/addictions/${addictionId}/cravings`, {
        intensity,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default addictionService;
