import AsyncStorage from '@react-native-async-storage/async-storage';
import { localAchievementService } from '../services/localAchievementService';
import { localTrophyService } from '../services/localTrophyService';
import remoteAchievementService from '../services/remoteAchievementService';
import remoteTrophyService from '../services/remoteTrophyService';
import modeService from '../services/modeService';

const getAchievementService = async () => {
  const mode = await modeService.getActiveMode();
  if (mode === 'connected') {
    return remoteAchievementService;
  }
  return localAchievementService;
};

const getTrophyService = async () => {
  const mode = await modeService.getActiveMode();
  if (mode === 'connected') {
    return remoteTrophyService;
  }
  return localTrophyService;
};

export const achievementService = {
  async getAchievements() {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getAchievementService();
      return await service.getAchievements(user.id);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  },

  async getTrophies() {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getTrophyService();
      return await service.getTrophies(user.id);
    } catch (error) {
      console.error('Error fetching trophies:', error);
      throw error;
    }
  },

  async checkAchievements() {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getAchievementService();
      return await service.checkAchievements(user.id);
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw error;
    }
  },

  async initializeAchievements() {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getAchievementService();
      return await service.initializeAchievements(user.id);
    } catch (error) {
      console.error('Error initializing achievements:', error);
      throw error;
    }
  },
};

export default achievementService;
