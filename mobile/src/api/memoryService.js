import AsyncStorage from '@react-native-async-storage/async-storage';
import { localMemoryService } from '../services/localMemoryService';
import remoteMemoryService from '../services/remoteMemoryService';
import modeService from '../services/modeService';

const getMemoryService = async () => {
  const mode = await modeService.getActiveMode();
  if (mode === 'connected') {
    return remoteMemoryService;
  }
  return localMemoryService;
};

export const memoryService = {
  async getMemories(limit = 100, offset = 0) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) return [];
      
      const service = await getMemoryService();
      return await service.getMemories(user.id, limit, offset);
    } catch (error) {
      if (error.message !== 'User not found' && error.message !== 'Database not initialized') {
        console.error('Error fetching memories:', error);
      }
      return [];
    }
  },

  async getMemory(id) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) return null;
      
      const service = await getMemoryService();
      return await service.getMemory(user.id, id);
    } catch (error) {
      if (error.message !== 'User not found' && error.message !== 'Database not initialized') {
        console.error('Error fetching memory:', error);
      }
      return null;
    }
  },

  async createMemory(memoryData) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not authenticated');
      
      const service = await getMemoryService();
      return await service.createMemory(user.id, memoryData.date, memoryData.title, memoryData.description, memoryData.type);
    } catch (error) {
      console.error('Error creating memory:', error);
      throw error;
    }
  },

  async updateMemory(id, memoryData) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getMemoryService();
      return await service.updateMemory(user.id, id, memoryData);
    } catch (error) {
      console.error('Error updating memory:', error);
      throw error;
    }
  },

  async deleteMemory(id) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getMemoryService();
      return await service.deleteMemory(user.id, id);
    } catch (error) {
      console.error('Error deleting memory:', error);
      throw error;
    }
  },
};

export default memoryService;
