import { getDatabase } from '../db/database';
import { encrypt, decrypt } from './encryption';

export const localMemoryService = {
  async createMemory(userId, date, title, description, type) {
    const db = getDatabase();
    
    try {
      const encryptedDescription = description ? encrypt(description).encrypted : null;
      
      const result = await db.runAsync(
        `INSERT INTO memories 
          (userId, date, title, description, type) 
        VALUES (?, ?, ?, ?, ?)`,
        [userId, date, title, encryptedDescription, type || null]
      );
      
      const memory = await db.getFirstAsync(
        'SELECT * FROM memories WHERE id = ?',
        [result.lastInsertRowId]
      );
      
      return {
        ...memory,
        description: memory.description ? decrypt(memory.description) : ''
      };
    } catch (error) {
      console.error('Error creating memory:', error);
      throw error;
    }
  },

  async getMemories(userId, limit = 100, offset = 0) {
    const db = getDatabase();
    
    try {
      const memories = await db.getAllAsync(
        'SELECT * FROM memories WHERE userId = ? ORDER BY date DESC LIMIT ? OFFSET ?',
        [userId, limit, offset]
      );
      
      return memories.map(memory => ({
        ...memory,
        description: memory.description ? decrypt(memory.description) : ''
      }));
    } catch (error) {
      console.error('Error fetching memories:', error);
      throw error;
    }
  },

  async getMemory(userId, memoryId) {
    const db = getDatabase();
    
    try {
      const memory = await db.getFirstAsync(
        'SELECT * FROM memories WHERE id = ? AND userId = ?',
        [memoryId, userId]
      );
      
      if (!memory) return null;
      
      return {
        ...memory,
        description: memory.description ? decrypt(memory.description) : ''
      };
    } catch (error) {
      console.error('Error fetching memory:', error);
      throw error;
    }
  },

  async updateMemory(userId, memoryId, updates) {
    const db = getDatabase();
    
    try {
      const { title, description, type } = updates;
      
      const encryptedDescription = description !== undefined ? (description ? encrypt(description).encrypted : null) : undefined;
      
      let updateQuery = 'UPDATE memories SET ';
      const values = [];
      
      if (title !== undefined) {
        updateQuery += 'title = ?, ';
        values.push(title);
      }
      if (encryptedDescription !== undefined) {
        updateQuery += 'description = ?, ';
        values.push(encryptedDescription);
      }
      if (type !== undefined) {
        updateQuery += 'type = ?, ';
        values.push(type);
      }
      
      updateQuery += 'updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?';
      values.push(memoryId, userId);
      
      await db.runAsync(updateQuery, values);
      
      return await this.getMemory(userId, memoryId);
    } catch (error) {
      console.error('Error updating memory:', error);
      throw error;
    }
  },

  async deleteMemory(userId, memoryId) {
    const db = getDatabase();
    
    try {
      const result = await db.runAsync(
        'DELETE FROM memories WHERE id = ? AND userId = ?',
        [memoryId, userId]
      );
      
      return {
        message: 'Memory deleted',
        deletedCount: result.changes
      };
    } catch (error) {
      console.error('Error deleting memory:', error);
      throw error;
    }
  }
};
