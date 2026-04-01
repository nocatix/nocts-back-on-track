import AsyncStorage from '@react-native-async-storage/async-storage';
import { localMoodService } from '../services/localMoodService';

export const moodService = {
  async getMoods(year, month) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      return await localMoodService.getMoodForMonth(user.id, year, month);
    } catch (error) {
      console.error('Error fetching moods:', error);
      throw error;
    }
  },

  async getMoodById(date) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      return await localMoodService.getMoodForDate(user.id, new Date(date));
    } catch (error) {
      console.error('Error fetching mood:', error);
      throw error;
    }
  },

  async createMood(moodData) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const { date, primaryMood, secondaryMood, intensity, notes, triggers } = moodData;
      
      return await localMoodService.saveMood(
        user.id,
        date,
        primaryMood,
        secondaryMood,
        intensity,
        notes,
        triggers
      );
    } catch (error) {
      console.error('Error creating mood:', error);
      throw error;
    }
  },

  async updateMood(date, moodData) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const { primaryMood, secondaryMood, intensity, notes, triggers } = moodData;
      
      return await localMoodService.saveMood(
        user.id,
        date,
        primaryMood,
        secondaryMood,
        intensity,
        notes,
        triggers
      );
    } catch (error) {
      console.error('Error updating mood:', error);
      throw error;
    }
  },

  async deleteMood(date) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      return await localMoodService.deleteMood(user.id, new Date(date));
    } catch (error) {
      console.error('Error deleting mood:', error);
      throw error;
    }
  },
};

export default moodService;
