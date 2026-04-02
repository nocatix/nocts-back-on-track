import AsyncStorage from '@react-native-async-storage/async-storage';
import { localPreparationService } from '../services/localPreparationService';
import remotePreparationService from '../services/remotePreparationService';
import modeService from '../services/modeService';

const getPreparationService = async () => {
  const mode = await modeService.getActiveMode();
  if (mode === 'connected') {
    return remotePreparationService;
  }
  return localPreparationService;
};

export const preparationService = {
  async getPreparationPlan(addictionId = null) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) return null;
      
      const service = await getPreparationService();
      return await service.getPreparationPlan(user.id, addictionId);
    } catch (error) {
      if (error.message !== 'User not found') {
        console.error('Error fetching preparation plan:', error);
      }
      return null;
    }
  },

  async createPreparationPlan(addictionId, responses) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not authenticated');
      
      const service = await getPreparationService();
      return await service.createPreparationPlan(user.id, addictionId, responses);
    } catch (error) {
      console.error('Error creating preparation plan:', error);
      throw error;
    }
  },

  async updatePreparationPlan(id, updates) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not authenticated');
      
      const service = await getPreparationService();
      return await service.updatePreparationPlan(user.id, id, updates);
    } catch (error) {
      console.error('Error updating preparation plan:', error);
      throw error;
    }
  },

  async updatePreparationField(id, fieldId, value) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getPreparationService();
      return await service.updatePreparationField(user.id, id, fieldId, value);
    } catch (error) {
      console.error('Error updating preparation field:', error);
      throw error;
    }
  },

  async deletePreparationPlan(id) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getPreparationService();
      return await service.deletePreparationPlan(user.id, id);
    } catch (error) {
      console.error('Error deleting preparation plan:', error);
      throw error;
    }
  },
};

export default preparationService;
