import { getDatabase } from '../db/database';
import { encrypt, decrypt } from '../utils/encryption';

export const localPreparationService = {
  async createPreparationPlan(userId, addictionId, responses = {}) {
    const db = getDatabase();
    
    try {
      // Encrypt sensitive response fields
      const encryptedResponses = {};
      Object.keys(responses).forEach(key => {
        if (responses[key]) {
          encryptedResponses[key] = encrypt(responses[key]).encrypted;
        }
      });

      const result = await db.runAsync(
        `INSERT INTO preparation_plans 
          (userId, addictionId, assessFrequency, assessMoney, assessTime, 
           assessTriggers, assessImpact, assessObstacles) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          addictionId,
          encryptedResponses['assess_frequency'] || null,
          encryptedResponses['assess_money'] || null,
          encryptedResponses['assess_time'] || null,
          encryptedResponses['assess_triggers'] || null,
          encryptedResponses['assess_impact'] || null,
          encryptedResponses['assess_obstacles'] || null,
        ]
      );

      return await this.getPreparationPlan(userId, addictionId);
    } catch (error) {
      console.error('Error creating preparation plan:', error);
      throw error;
    }
  },

  async getPreparationPlan(userId, addictionId = null) {
    const db = getDatabase();
    
    try {
      let query = 'SELECT * FROM preparation_plans WHERE userId = ?';
      const params = [userId];

      if (addictionId) {
        query += ' AND addictionId = ?';
        params.push(addictionId);
      }

      query += ' ORDER BY createdAt DESC LIMIT 1';

      const plan = await db.getFirstAsync(query, params);

      if (!plan) return null;

      // Decrypt sensitive fields
      return {
        ...plan,
        assessFrequency: plan.assessFrequency ? decrypt(plan.assessFrequency) : '',
        assessMoney: plan.assessMoney ? decrypt(plan.assessMoney) : '',
        assessTime: plan.assessTime ? decrypt(plan.assessTime) : '',
        assessTriggers: plan.assessTriggers ? decrypt(plan.assessTriggers) : '',
        assessImpact: plan.assessImpact ? decrypt(plan.assessImpact) : '',
        assessObstacles: plan.assessObstacles ? decrypt(plan.assessObstacles) : '',
      };
    } catch (error) {
      console.error('Error fetching preparation plan:', error);
      throw error;
    }
  },

  async updatePreparationPlan(userId, planId, updates) {
    const db = getDatabase();
    
    try {
      // Encrypt sensitive fields
      const encryptedUpdates = {};
      Object.keys(updates).forEach(key => {
        if (updates[key]) {
          encryptedUpdates[key] = encrypt(updates[key]).encrypted;
        }
      });

      let updateQuery = 'UPDATE preparation_plans SET ';
      const values = [];
      
      if (updates.assessFrequency !== undefined) {
        updateQuery += 'assessFrequency = ?, ';
        values.push(encryptedUpdates.assessFrequency || null);
      }
      if (updates.assessMoney !== undefined) {
        updateQuery += 'assessMoney = ?, ';
        values.push(encryptedUpdates.assessMoney || null);
      }
      if (updates.assessTime !== undefined) {
        updateQuery += 'assessTime = ?, ';
        values.push(encryptedUpdates.assessTime || null);
      }
      if (updates.assessTriggers !== undefined) {
        updateQuery += 'assessTriggers = ?, ';
        values.push(encryptedUpdates.assessTriggers || null);
      }
      if (updates.assessImpact !== undefined) {
        updateQuery += 'assessImpact = ?, ';
        values.push(encryptedUpdates.assessImpact || null);
      }
      if (updates.assessObstacles !== undefined) {
        updateQuery += 'assessObstacles = ?, ';
        values.push(encryptedUpdates.assessObstacles || null);
      }

      updateQuery += 'synced = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?';
      values.push(0, planId, userId);

      await db.runAsync(updateQuery, values);

      const plan = await db.getFirstAsync(
        'SELECT * FROM preparation_plans WHERE id = ? AND userId = ?',
        [planId, userId]
      );

      return {
        ...plan,
        assessFrequency: plan.assessFrequency ? decrypt(plan.assessFrequency) : '',
        assessMoney: plan.assessMoney ? decrypt(plan.assessMoney) : '',
        assessTime: plan.assessTime ? decrypt(plan.assessTime) : '',
        assessTriggers: plan.assessTriggers ? decrypt(plan.assessTriggers) : '',
        assessImpact: plan.assessImpact ? decrypt(plan.assessImpact) : '',
        assessObstacles: plan.assessObstacles ? decrypt(plan.assessObstacles) : '',
      };
    } catch (error) {
      console.error('Error updating preparation plan:', error);
      throw error;
    }
  },

  async updatePreparationField(userId, planId, fieldId, value) {
    const db = getDatabase();
    
    try {
      const fieldMap = {
        'assess_frequency': 'assessFrequency',
        'assess_money': 'assessMoney',
        'assess_time': 'assessTime',
        'assess_triggers': 'assessTriggers',
        'assess_impact': 'assessImpact',
        'assess_obstacles': 'assessObstacles',
      };

      const columnName = fieldMap[fieldId];
      if (!columnName) throw new Error(`Unknown field: ${fieldId}`);

      const encryptedValue = value ? encrypt(value).encrypted : null;

      await db.runAsync(
        `UPDATE preparation_plans SET ${columnName} = ?, synced = 0, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?`,
        [encryptedValue, planId, userId]
      );

      const plan = await db.getFirstAsync(
        'SELECT * FROM preparation_plans WHERE id = ? AND userId = ?',
        [planId, userId]
      );

      return {
        ...plan,
        assessFrequency: plan.assessFrequency ? decrypt(plan.assessFrequency) : '',
        assessMoney: plan.assessMoney ? decrypt(plan.assessMoney) : '',
        assessTime: plan.assessTime ? decrypt(plan.assessTime) : '',
        assessTriggers: plan.assessTriggers ? decrypt(plan.assessTriggers) : '',
        assessImpact: plan.assessImpact ? decrypt(plan.assessImpact) : '',
        assessObstacles: plan.assessObstacles ? decrypt(plan.assessObstacles) : '',
      };
    } catch (error) {
      console.error('Error updating preparation field:', error);
      throw error;
    }
  },

  async deletePreparationPlan(userId, planId) {
    const db = getDatabase();
    
    try {
      const result = await db.runAsync(
        'DELETE FROM preparation_plans WHERE id = ? AND userId = ?',
        [planId, userId]
      );

      return {
        message: 'Preparation plan deleted',
        deletedCount: result.changes
      };
    } catch (error) {
      console.error('Error deleting preparation plan:', error);
      throw error;
    }
  },
};
