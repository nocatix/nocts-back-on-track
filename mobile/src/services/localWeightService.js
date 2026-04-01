import { getDatabase } from '../db/database';
import { encrypt, decrypt } from './encryption';

export const localWeightService = {
  async addWeight(userId, date, weight, unit = 'lbs', notes) {
    const db = getDatabase();
    
    try {
      const encryptedNotes = notes ? encrypt(notes).encrypted : null;
      
      const result = await db.runAsync(
        `INSERT INTO weights 
          (userId, date, weight, unit, notes) 
        VALUES (?, ?, ?, ?, ?)`,
        [userId, date, weight, unit, encryptedNotes]
      );
      
      const weightEntry = await db.getFirstAsync(
        'SELECT * FROM weights WHERE id = ?',
        [result.lastInsertRowId]
      );
      
      return {
        ...weightEntry,
        notes: weightEntry.notes ? decrypt(weightEntry.notes) : ''
      };
    } catch (error) {
      console.error('Error adding weight:', error);
      throw error;
    }
  },

  async getWeights(userId, limit = 100, offset = 0) {
    const db = getDatabase();
    
    try {
      const weights = await db.getAllAsync(
        'SELECT * FROM weights WHERE userId = ? ORDER BY date DESC LIMIT ? OFFSET ?',
        [userId, limit, offset]
      );
      
      return weights.map(weight => ({
        ...weight,
        notes: weight.notes ? decrypt(weight.notes) : ''
      }));
    } catch (error) {
      console.error('Error fetching weights:', error);
      throw error;
    }
  },

  async getWeightForDate(userId, date) {
    const db = getDatabase();
    
    try {
      const weight = await db.getFirstAsync(
        'SELECT * FROM weights WHERE userId = ? AND date = ?',
        [userId, date]
      );
      
      if (!weight) return null;
      
      return {
        ...weight,
        notes: weight.notes ? decrypt(weight.notes) : ''
      };
    } catch (error) {
      console.error('Error fetching weight for date:', error);
      throw error;
    }
  },

  async updateWeight(userId, weightId, updates) {
    const db = getDatabase();
    
    try {
      const { weight, unit, notes } = updates;
      
      const encryptedNotes = notes !== undefined ? (notes ? encrypt(notes).encrypted : null) : undefined;
      
      let updateQuery = 'UPDATE weights SET ';
      const values = [];
      
      if (weight !== undefined) {
        updateQuery += 'weight = ?, ';
        values.push(weight);
      }
      if (unit !== undefined) {
        updateQuery += 'unit = ?, ';
        values.push(unit);
      }
      if (encryptedNotes !== undefined) {
        updateQuery += 'notes = ?, ';
        values.push(encryptedNotes);
      }
      
      updateQuery += 'updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?';
      values.push(weightId, userId);
      
      await db.runAsync(updateQuery, values);
      
      const updated = await db.getFirstAsync(
        'SELECT * FROM weights WHERE id = ?',
        [weightId]
      );
      
      return {
        ...updated,
        notes: updated.notes ? decrypt(updated.notes) : ''
      };
    } catch (error) {
      console.error('Error updating weight:', error);
      throw error;
    }
  },

  async deleteWeight(userId, weightId) {
    const db = getDatabase();
    
    try {
      const result = await db.runAsync(
        'DELETE FROM weights WHERE id = ? AND userId = ?',
        [weightId, userId]
      );
      
      return {
        message: 'Weight deleted',
        deletedCount: result.changes
      };
    } catch (error) {
      console.error('Error deleting weight:', error);
      throw error;
    }
  }
};
