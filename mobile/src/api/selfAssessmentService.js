import AsyncStorage from '@react-native-async-storage/async-storage';
import { localSelfAssessmentService } from '../services/localSelfAssessmentService';
import remoteSelfAssessmentService from '../services/remoteSelfAssessmentService';
import modeService from '../services/modeService';

const getSelfAssessmentService = async () => {
  const mode = await modeService.getActiveMode();
  if (mode === 'connected') {
    return remoteSelfAssessmentService;
  }
  return localSelfAssessmentService;
};

export const selfAssessmentService = {
  async getAssessments(addictionId = null) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getSelfAssessmentService();
      return await service.getAssessments(user.id, addictionId);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
  },

  async getLatestAssessment(addictionId = null) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getSelfAssessmentService();
      return await service.getLatestAssessment(user.id, addictionId);
    } catch (error) {
      console.error('Error fetching latest assessment:', error);
      throw error;
    }
  },

  async createAssessment(addictionId, responses, score) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getSelfAssessmentService();
      return await service.createAssessment(user.id, addictionId, responses, score);
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  },

  async deleteAssessment(id) {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      if (!user) throw new Error('User not found');
      
      const service = await getSelfAssessmentService();
      return await service.deleteAssessment(user.id, id);
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  },
};

export default selfAssessmentService;
