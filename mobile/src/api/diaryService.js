import AsyncStorage from '@react-native-async-storage/async-storage';
import { localDiaryService } from '../services/localDiaryService';

export const diaryService = {
  async getDiaryEntries(limit = 50, offset = 0) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      return await localDiaryService.getDiaryEntries(user.id, limit, offset);
    } catch (error) {
      console.error('Error fetching diary entries:', error);
      throw error;
    }
  },

  async getDiaryEntryById(id) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      return await localDiaryService.getDiaryEntry(user.id, id);
    } catch (error) {
      console.error('Error fetching diary entry:', error);
      throw error;
    }
  },

  async createDiaryEntry(entryData) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const { title, content, mood, date } = entryData;
      
      return await localDiaryService.createDiaryEntry(
        user.id,
        date || new Date().toISOString().split('T')[0],
        title,
        content,
        mood
      );
    } catch (error) {
      console.error('Error creating diary entry:', error);
      throw error;
    }
  },

  async updateDiaryEntry(id, entryData) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      return await localDiaryService.updateDiaryEntry(user.id, id, entryData);
    } catch (error) {
      console.error('Error updating diary entry:', error);
      throw error;
    }
  },

  async deleteDiaryEntry(id) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      return await localDiaryService.deleteDiaryEntry(user.id, id);
    } catch (error) {
      console.error('Error deleting diary entry:', error);
      throw error;
    }
  },
};

export default diaryService;
