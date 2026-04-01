import AsyncStorage from '@react-native-async-storage/async-storage';
import { localWeightService } from '../services/localWeightService';

export const weightService = {
  async getWeights(limit = 100, offset = 0) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      return await localWeightService.getWeights(user.id, limit, offset);
    } catch (error) {
      console.error('Error fetching weights:', error);
      throw error;
    }
  },

  async createWeight(weightData) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const { weight, unit, notes, date } = weightData;
      
      return await localWeightService.addWeight(
        user.id,
        date || new Date().toISOString().split('T')[0],
        weight,
        unit || 'lbs',
        notes
      );
    } catch (error) {
      console.error('Error creating weight:', error);
      throw error;
    }
  },

  async updateWeight(id, weightData) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      return await localWeightService.updateWeight(user.id, id, weightData);
    } catch (error) {
      console.error('Error updating weight:', error);
      throw error;
    }
  },

  async deleteWeight(id) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      return await localWeightService.deleteWeight(user.id, id);
    } catch (error) {
      console.error('Error deleting weight:', error);
      throw error;
    }
  },
};

export default weightService;
