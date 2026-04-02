import { getDatabase } from '../db/database';
import { encrypt, decrypt } from '../utils/encryption';

export const localSelfAssessmentService = {
  async createAssessment(userId, addictionId, responses = {}, score = 0) {
    const db = getDatabase();
    
    try {
      const responsesJson = JSON.stringify(responses);
      const encryptedResponses = responsesJson ? encrypt(responsesJson).encrypted : null;

      const result = await db.runAsync(
        `INSERT INTO self_assessments 
          (userId, addictionId, score, responses) 
        VALUES (?, ?, ?, ?)`,
        [userId, addictionId, score, encryptedResponses]
      );

      return await this.getAssessmentById(userId, result.lastInsertRowId);
    } catch (error) {
      console.error('Error creating self-assessment:', error);
      throw error;
    }
  },

  async getAssessments(userId, addictionId = null) {
    const db = getDatabase();
    
    try {
      let query = 'SELECT * FROM self_assessments WHERE userId = ?';
      const params = [userId];

      if (addictionId) {
        query += ' AND addictionId = ?';
        params.push(addictionId);
      }

      query += ' ORDER BY createdAt DESC';

      const assessments = await db.getAllAsync(query, params);

      return assessments.map(assessment => ({
        ...assessment,
        responses: assessment.responses ? JSON.parse(decrypt(assessment.responses)) : {},
      }));
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
  },

  async getLatestAssessment(userId, addictionId = null) {
    const db = getDatabase();
    
    try {
      let query = 'SELECT * FROM self_assessments WHERE userId = ?';
      const params = [userId];

      if (addictionId) {
        query += ' AND addictionId = ?';
        params.push(addictionId);
      }

      query += ' ORDER BY createdAt DESC LIMIT 1';

      const assessment = await db.getFirstAsync(query, params);

      if (!assessment) return null;

      return {
        ...assessment,
        responses: assessment.responses ? JSON.parse(decrypt(assessment.responses)) : {},
      };
    } catch (error) {
      console.error('Error fetching latest assessment:', error);
      throw error;
    }
  },

  async getAssessmentById(userId, assessmentId) {
    const db = getDatabase();
    
    try {
      const assessment = await db.getFirstAsync(
        'SELECT * FROM self_assessments WHERE id = ? AND userId = ?',
        [assessmentId, userId]
      );

      if (!assessment) return null;

      return {
        ...assessment,
        responses: assessment.responses ? JSON.parse(decrypt(assessment.responses)) : {},
      };
    } catch (error) {
      console.error('Error fetching assessment:', error);
      throw error;
    }
  },

  async deleteAssessment(userId, assessmentId) {
    const db = getDatabase();
    
    try {
      const result = await db.runAsync(
        'DELETE FROM self_assessments WHERE id = ? AND userId = ?',
        [assessmentId, userId]
      );

      return {
        message: 'Assessment deleted',
        deletedCount: result.changes
      };
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  },
};
