import AsyncStorage from '@react-native-async-storage/async-storage';
import { localAchievementService } from '../services/localAchievementService';
import { localTrophyService } from '../services/localTrophyService';

export const achievementService = {
  async getAchievements() {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      return await localAchievementService.getAchievements(user.id);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  },

  async getTrophies() {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      return await localTrophyService.getTrophies(user.id);
    } catch (error) {
      console.error('Error fetching trophies:', error);
      throw error;
    }
  },

  async checkAchievements() {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      // For local version, you can implement logic to check achievements
      return { message: 'Achievements checked' };
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw error;
    }
  },

  async initializeAchievements() {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      return await localAchievementService.initializeAchievements(user.id);
    } catch (error) {
      console.error('Error initializing achievements:', error);
      throw error;
    }
  },
};

export default achievementService;
