import AsyncStorage from '@react-native-async-storage/async-storage';
import { localAddictionService } from '../services/localAddictionService';

export const addictionService = {
  async getAddictions() {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      return await localAddictionService.getAddictions(user.id);
    } catch (error) {
      console.error('Error fetching addictions:', error);
      throw error;
    }
  },

  async getAddictionById(id) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      return await localAddictionService.getAddiction(user.id, id);
    } catch (error) {
      console.error('Error fetching addiction:', error);
      throw error;
    }
  },

  async createAddiction(addictionData) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const { name, stopDate, frequencyPerDay, moneySpentPerDay, notes } = addictionData;
      
      return await localAddictionService.createAddiction(
        user.id,
        name,
        stopDate,
        frequencyPerDay,
        moneySpentPerDay,
        notes
      );
    } catch (error) {
      console.error('Error creating addiction:', error);
      throw error;
    }
  },

  async updateAddiction(id, addictionData) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      return await localAddictionService.updateAddiction(user.id, id, addictionData);
    } catch (error) {
      console.error('Error updating addiction:', error);
      throw error;
    }
  },

  async deleteAddiction(id) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      return await localAddictionService.deleteAddiction(user.id, id);
    } catch (error) {
      console.error('Error deleting addiction:', error);
      throw error;
    }
  },

  async getCravings(addictionId) {
    try {
      // For local use, you might track cravings differently
      // This is a placeholder implementation
      return [];
    } catch (error) {
      console.error('Error fetching cravings:', error);
      throw error;
    }
  },

  async addCraving(addictionId, intensity) {
    try {
      // For local use, you can log cravings to async storage or database
      return { success: true, message: 'Craving logged' };
    } catch (error) {
      console.error('Error adding craving:', error);
      throw error;
    }
  },
};

export default addictionService;
