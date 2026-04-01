import api from './axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      if (token) {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
      
      return { token, user };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async register(email, password, nameOnPhone) {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        nameOnPhone,
      });
      const { token, user } = response.data;
      
      if (token) {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
      
      return { token, user };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
    }
  },

  async getCurrentUser() {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async verifyToken() {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
