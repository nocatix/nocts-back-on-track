import { getDatabase } from '../db/database';
import { encrypt, decrypt } from '../utils/encryption';

export const localDiaryService = {
  async createDiaryEntry(userId, date, title, content, mood) {
    const db = getDatabase();
    
    try {
      const encryptedContent = content ? encrypt(content).encrypted : null;
      
      const result = await db.runAsync(
        `INSERT INTO diaries 
          (userId, date, title, content, mood) 
        VALUES (?, ?, ?, ?, ?)`,
        [userId, date, title, encryptedContent, mood || null]
      );
      
      const entry = await db.getFirstAsync(
        'SELECT * FROM diaries WHERE id = ?',
        [result.lastInsertRowId]
      );
      
      return {
        ...entry,
        content: entry.content ? decrypt(entry.content) : ''
      };
    } catch (error) {
      console.error('Error creating diary entry:', error);
      throw error;
    }
  },

  async getDiaryEntries(userId, limit = 50, offset = 0) {
    const db = getDatabase();
    
    try {
      const entries = await db.getAllAsync(
        'SELECT * FROM diaries WHERE userId = ? ORDER BY date DESC LIMIT ? OFFSET ?',
        [userId, limit, offset]
      );
      
      return entries.map(entry => ({
        ...entry,
        content: entry.content ? decrypt(entry.content) : ''
      }));
    } catch (error) {
      console.error('Error fetching diary entries:', error);
      throw error;
    }
  },

  async getDiaryEntry(userId, entryId) {
    const db = getDatabase();
    
    try {
      const entry = await db.getFirstAsync(
        'SELECT * FROM diaries WHERE id = ? AND userId = ?',
        [entryId, userId]
      );
      
      if (!entry) return null;
      
      return {
        ...entry,
        content: entry.content ? decrypt(entry.content) : ''
      };
    } catch (error) {
      console.error('Error fetching diary entry:', error);
      throw error;
    }
  },

  async updateDiaryEntry(userId, entryId, updates) {
    const db = getDatabase();
    
    try {
      const { title, content, mood } = updates;
      
      const encryptedContent = content !== undefined ? (content ? encrypt(content).encrypted : null) : undefined;
      
      let updateQuery = 'UPDATE diaries SET ';
      const values = [];
      
      if (title !== undefined) {
        updateQuery += 'title = ?, ';
        values.push(title);
      }
      if (encryptedContent !== undefined) {
        updateQuery += 'content = ?, ';
        values.push(encryptedContent);
      }
      if (mood !== undefined) {
        updateQuery += 'mood = ?, ';
        values.push(mood);
      }
      
      updateQuery += 'updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?';
      values.push(entryId, userId);
      
      await db.runAsync(updateQuery, values);
      
      return await this.getDiaryEntry(userId, entryId);
    } catch (error) {
      console.error('Error updating diary entry:', error);
      throw error;
    }
  },

  async deleteDiaryEntry(userId, entryId) {
    const db = getDatabase();
    
    try {
      const result = await db.runAsync(
        'DELETE FROM diaries WHERE id = ? AND userId = ?',
        [entryId, userId]
      );
      
      return {
        message: 'Diary entry deleted',
        deletedCount: result.changes
      };
    } catch (error) {
      console.error('Error deleting diary entry:', error);
      throw error;
    }
  }
};
