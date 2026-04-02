import AsyncStorage from '@react-native-async-storage/async-storage';
import { localAddictionService } from '../services/localAddictionService';
import remoteAddictionService from '../services/remoteAddictionService';
import modeService from '../services/modeService';

/**
 * Get appropriate addiction service based on mode
 */
const getAddictionService = async () => {
  const mode = await modeService.getActiveMode();
  if (mode === 'connected') {
    return remoteAddictionService;
  }
  return localAddictionService;
};

export const addictionService = {
  async getAddictions() {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getAddictionService();
      return await service.getAddictions(user.id);
    } catch (error) {
      console.error('Error fetching addictions:', error);
      throw error;
    }
  },

  async getAddictionById(id) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getAddictionService();
      return await service.getAddiction(user.id, id);
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
      
      const service = await getAddictionService();
      return await service.createAddiction(
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
      
      const service = await getAddictionService();
      return await service.updateAddiction(user.id, id, addictionData);
    } catch (error) {
      console.error('Error updating addiction:', error);
      throw error;
    }
  },

  async deleteAddiction(id) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getAddictionService();
      return await service.deleteAddiction(user.id, id);
    } catch (error) {
      console.error('Error deleting addiction:', error);
      throw error;
    }
  },

  async getCravings(addictionId) {
    try {
      const service = await getAddictionService();
      return await service.getCravings(addictionId);
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
