import { getDatabase } from '../db/database';
import { encrypt, decrypt } from '../utils/encryption';

export const localAddictionService = {
  async createAddiction(userId, name, stopDate, frequencyPerDay, moneySpentPerDay, notes) {
    const db = getDatabase();
    
    try {
      const encryptedNotes = notes ? encrypt(notes).encrypted : null;
      
      const result = await db.runAsync(
        `INSERT INTO addictions 
          (userId, name, stopDate, frequencyPerDay, moneySpentPerDay, notes) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, name, stopDate, frequencyPerDay, moneySpentPerDay, encryptedNotes]
      );
      
      const addiction = await db.getFirstAsync(
        'SELECT * FROM addictions WHERE id = ?',
        [result.lastInsertRowId]
      );
      
      return {
        ...addiction,
        notes: addiction.notes ? decrypt(addiction.notes) : ''
      };
    } catch (error) {
      console.error('Error creating addiction:', error);
      throw error;
    }
  },

  async getAddictions(userId) {
    const db = getDatabase();
    
    try {
      const addictions = await db.getAllAsync(
        'SELECT * FROM addictions WHERE userId = ? ORDER BY stopDate DESC',
        [userId]
      );
      
      return addictions.map(addiction => ({
        ...addiction,
        notes: addiction.notes ? decrypt(addiction.notes) : ''
      }));
    } catch (error) {
      console.error('Error fetching addictions:', error);
      throw error;
    }
  },

  async getAddiction(userId, addictionId) {
    const db = getDatabase();
    
    try {
      const addiction = await db.getFirstAsync(
        'SELECT * FROM addictions WHERE id = ? AND userId = ?',
        [addictionId, userId]
      );
      
      if (!addiction) {
        return null;
      }
      
      return {
        ...addiction,
        notes: addiction.notes ? decrypt(addiction.notes) : ''
      };
    } catch (error) {
      console.error('Error fetching addiction:', error);
      throw error;
    }
  },

  async updateAddiction(userId, addictionId, updates) {
    const db = getDatabase();
    
    try {
      const { name, frequencyPerDay, moneySpentPerDay, notes } = updates;
      
      const encryptedNotes = notes !== undefined ? (notes ? encrypt(notes).encrypted : null) : undefined;
      
      let updateQuery = 'UPDATE addictions SET ';
      const values = [];
      
      if (name !== undefined) {
        updateQuery += 'name = ?, ';
        values.push(name);
      }
      if (frequencyPerDay !== undefined) {
        updateQuery += 'frequencyPerDay = ?, ';
        values.push(frequencyPerDay);
      }
      if (moneySpentPerDay !== undefined) {
        updateQuery += 'moneySpentPerDay = ?, ';
        values.push(moneySpentPerDay);
      }
      if (encryptedNotes !== undefined) {
        updateQuery += 'notes = ?, ';
        values.push(encryptedNotes);
      }
      
      updateQuery += 'updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?';
      values.push(addictionId, userId);
      
      await db.runAsync(updateQuery, values);
      
      return await this.getAddiction(userId, addictionId);
    } catch (error) {
      console.error('Error updating addiction:', error);
      throw error;
    }
  },

  async deleteAddiction(userId, addictionId) {
    const db = getDatabase();
    
    try {
      const result = await db.runAsync(
        'DELETE FROM addictions WHERE id = ? AND userId = ?',
        [addictionId, userId]
      );
      
      return {
        message: 'Addiction deleted',
        deletedCount: result.changes
      };
    } catch (error) {
      console.error('Error deleting addiction:', error);
      throw error;
    }
  }
};
