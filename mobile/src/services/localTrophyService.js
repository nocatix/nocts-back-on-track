import { getDatabase } from '../db/database';

export const localTrophyService = {
  async createTrophy(userId, title, description) {
    const db = getDatabase();
    
    try {
      const result = await db.runAsync(
        `INSERT INTO trophies 
          (userId, title, description, earnedDate) 
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
        [userId, title, description]
      );
      
      const trophy = await db.getFirstAsync(
        'SELECT * FROM trophies WHERE id = ?',
        [result.lastInsertRowId]
      );
      
      return trophy;
    } catch (error) {
      console.error('Error creating trophy:', error);
      throw error;
    }
  },

  async getTrophies(userId) {
    const db = getDatabase();
    
    try {
      const trophies = await db.getAllAsync(
        'SELECT * FROM trophies WHERE userId = ? ORDER BY earnedDate DESC',
        [userId]
      );
      
      return trophies;
    } catch (error) {
      console.error('Error fetching trophies:', error);
      throw error;
    }
  },

  async getTrophy(userId, trophyId) {
    const db = getDatabase();
    
    try {
      const trophy = await db.getFirstAsync(
        'SELECT * FROM trophies WHERE id = ? AND userId = ?',
        [trophyId, userId]
      );
      
      return trophy || null;
    } catch (error) {
      console.error('Error fetching trophy:', error);
      throw error;
    }
  },

  async deleteTrophy(userId, trophyId) {
    const db = getDatabase();
    
    try {
      const result = await db.runAsync(
        'DELETE FROM trophies WHERE id = ? AND userId = ?',
        [trophyId, userId]
      );
      
      return {
        message: 'Trophy deleted',
        deletedCount: result.changes
      };
    } catch (error) {
      console.error('Error deleting trophy:', error);
      throw error;
    }
  }
};
