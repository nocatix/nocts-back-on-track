import AsyncStorage from '@react-native-async-storage/async-storage';
import { localWeightService } from '../services/localWeightService';
import remoteWeightService from '../services/remoteWeightService';
import modeService from '../services/modeService';

const getWeightService = async () => {
  const mode = await modeService.getActiveMode();
  if (mode === 'connected') {
    return remoteWeightService;
  }
  return localWeightService;
};

export const weightService = {
  async getWeights(limit = 100, offset = 0) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getWeightService();
      return await service.getWeights(user.id);
    } catch (error) {
      console.error('Error fetching weights:', error);
      throw error;
    }
  },

  async createWeight(weightData) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getWeightService();
      return await service.createWeight(user.id, weightData);
    } catch (error) {
      console.error('Error creating weight:', error);
      throw error;
    }
  },

  async updateWeight(id, weightData) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getWeightService();
      return await service.updateWeight(user.id, id, weightData);
    } catch (error) {
      console.error('Error updating weight:', error);
      throw error;
    }
  },

  async deleteWeight(id) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getWeightService();
      return await service.deleteWeight(user.id, id);
    } catch (error) {
      console.error('Error deleting weight:', error);
      throw error;
    }
  },
};

export default weightService;
