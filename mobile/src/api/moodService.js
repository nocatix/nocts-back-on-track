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
      if (!user) throw new Error('User not found');
      
      const service = await getMoodService();
      return await service.getMoodForMonth(user.id, year, month);
    } catch (error) {
      console.error('Error fetching moods:', error);
      throw error;
    }
  },

  async getMoodById(date) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getMoodService();
      return await service.getMoodForDate(user.id, date);
    } catch (error) {
      console.error('Error fetching mood:', error);
      throw error;
    }
  },

  async createMood(moodData) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
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
