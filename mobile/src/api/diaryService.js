import api from './axiosConfig';

export const diaryService = {
  async getDiaryEntries(filters = {}) {
    try {
      const response = await api.get('/diary', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getDiaryEntryById(id) {
    try {
      const response = await api.get(`/diary/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createDiaryEntry(entryData) {
    try {
      const response = await api.post('/diary', {
        ...entryData,
        date: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateDiaryEntry(id, entryData) {
    try {
      const response = await api.put(`/diary/${id}`, entryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async deleteDiaryEntry(id) {
    try {
      const response = await api.delete(`/diary/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default diaryService;
