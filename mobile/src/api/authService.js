import AsyncStorage from '@react-native-async-storage/async-storage';
import { localAuthService } from '../services/localAuthService';
import { saveToken, getToken, removeToken } from '../utils/jwtHelper';

export const authService = {
  async login(username, password) {
    try {
      const result = await localAuthService.login(username, password);
      
      if (result.token) {
        await saveToken(result.token);
        await AsyncStorage.setItem('user', JSON.stringify(result.user));
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(username, fullName, password) {
    try {
      const result = await localAuthService.register(username, fullName, password);
      
      if (result.token) {
        await saveToken(result.token);
        await AsyncStorage.setItem('user', JSON.stringify(result.user));
      }
      
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await removeToken();
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
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
      const token = await getToken();
      if (!token) {
        return null;
      }
      
      const user = await localAuthService.getUserFromToken(token);
      return user;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  },

  async updatePreferences(username, unitPreference) {
    try {
      // Get current user
      const user = await this.getCurrentUser();
      if (!user) {
        throw new Error('User not found');
      }
      
      const result = await localAuthService.updateUserPreferences(user.id, unitPreference);
      
      // Update stored user
      user.unitPreference = unitPreference;
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      return result;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
};

export default authService;
