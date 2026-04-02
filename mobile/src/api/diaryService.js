import AsyncStorage from '@react-native-async-storage/async-storage';
import { localDiaryService } from '../services/localDiaryService';
import remoteDiaryService from '../services/remoteDiaryService';
import modeService from '../services/modeService';

const getDiaryService = async () => {
  const mode = await modeService.getActiveMode();
  if (mode === 'connected') {
    return remoteDiaryService;
  }
  return localDiaryService;
};

export const diaryService = {
  async getDiaryEntries(limit = 50, offset = 0) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) return [];
      
      const service = await getDiaryService();
      return await service.getDiaryEntries(user.id, limit, offset);
    } catch (error) {
      if (error.message !== 'User not found') {
        console.error('Error fetching diary entries:', error);
      }
      return [];
    }
  },

  async getDiaryEntryById(id) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) return null;
      
      const service = await getDiaryService();
      return await service.getDiary(user.id, id);
    } catch (error) {
      if (error.message !== 'User not found') {
        console.error('Error fetching diary entry:', error);
      }
      return null;
    }
  },

  async createDiaryEntry(entryData) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not authenticated');
      
      const service = await getDiaryService();
      return await service.createDiary(user.id, entryData);
    } catch (error) {
      console.error('Error creating diary entry:', error);
      throw error;
    }
  },

  async updateDiaryEntry(id, entryData) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getDiaryService();
      return await service.updateDiary(user.id, id, entryData);
    } catch (error) {
      console.error('Error updating diary entry:', error);
      throw error;
    }
  },

  async deleteDiaryEntry(id) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getDiaryService();
      return await service.deleteDiary(user.id, id);
    } catch (error) {
      console.error('Error deleting diary entry:', error);
      throw error;
    }
  },
};

export default diaryService;
