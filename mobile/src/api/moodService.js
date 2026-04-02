import AsyncStorage from '@react-native-async-storage/async-storage';
import { localMoodService } from '../services/localMoodService';
import remoteMoodService from '../services/remoteMoodService';
import modeService from '../services/modeService';

const getMoodService = async () => {
  const mode = await modeService.getActiveMode();
  if (mode === 'connected') {
    return remoteMoodService;
  }
  return localMoodService;
};

export const moodService = {
  async getMoods(year, month) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) return [];
      
      const service = await getMoodService();
      return await service.getMoodForMonth(user.id, year, month);
    } catch (error) {
      if (error.message !== 'User not found') {
        console.error('Error fetching moods:', error);
      }
      return [];
    }
  },

  async getMoodById(date) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) return null;
      
      const service = await getMoodService();
      return await service.getMoodForDate(user.id, date);
    } catch (error) {
      if (error.message !== 'User not found') {
        console.error('Error fetching mood:', error);
      }
      return null;
    }
  },

  async createMood(moodData) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not authenticated');
      
      const service = await getMoodService();
      return await service.createMood(user.id, moodData);
    } catch (error) {
      console.error('Error creating mood:', error);
      throw error;
    }
  },

  async updateMood(date, moodData) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getMoodService();
      return await service.updateMood(user.id, date, moodData);
    } catch (error) {
      console.error('Error updating mood:', error);
      throw error;
    }
  },

  async deleteMood(date) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getMoodService();
      return await service.deleteMood(user.id, date);
    } catch (error) {
      console.error('Error deleting mood:', error);
      throw error;
    }
  },
};

export default moodService;
