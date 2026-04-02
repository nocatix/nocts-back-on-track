import AsyncStorage from '@react-native-async-storage/async-storage';
import { localTrophyService } from '../services/localTrophyService';
import remoteTrophyService from '../services/remoteTrophyService';
import modeService from '../services/modeService';

const getTrophyService = async () => {
  const mode = await modeService.getActiveMode();
  if (mode === 'connected') {
    return remoteTrophyService;
  }
  return localTrophyService;
};

export const trophyService = {
  async getTrophies() {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) return [];
      
      const service = await getTrophyService();
      return await service.getTrophies(user.id);
    } catch (error) {
      if (error.message !== 'User not found') {
        console.error('Error fetching trophies:', error);
      }
      return [];
    }
  },

  async getTrophyById(id) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) return null;
      
      const service = await getTrophyService();
      return await service.getTrophyById(user.id, id);
    } catch (error) {
      if (error.message !== 'User not found') {
        console.error('Error fetching trophy:', error);
      }
      return null;
    }
  },
};

export default trophyService;
