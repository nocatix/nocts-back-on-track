import { getDatabase } from '../db/database';
import { encrypt, decrypt } from './encryption';

const toLocalDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const localMoodService = {
  async getMoodForMonth(userId, year, month) {
    const db = getDatabase();
    
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      
      const startISOString = startDate.toISOString().split('T')[0];
      const endISOString = endDate.toISOString().split('T')[0];
      
      const moods = await db.getAllAsync(
        'SELECT * FROM moods WHERE userId = ? AND date >= ? AND date < ? ORDER BY date ASC',
        [userId, startISOString, endISOString]
      );
      
      return moods.map(mood => ({
        ...mood,
        notes: mood.notes ? decrypt(mood.notes) : '',
        triggers: mood.triggers ? JSON.parse(mood.triggers) : []
      }));
    } catch (error) {
      console.error('Error fetching moods for month:', error);
      throw error;
    }
  },

  async getMoodForDate(userId, date) {
    const db = getDatabase();
    
    try {
      const dateString = toLocalDateKey(date);
      
      const mood = await db.getFirstAsync(
        'SELECT * FROM moods WHERE userId = ? AND date = ?',
        [userId, dateString]
      );
      
      if (!mood) {
        return null;
      }
      
      return {
        ...mood,
        notes: mood.notes ? decrypt(mood.notes) : '',
        triggers: mood.triggers ? JSON.parse(mood.triggers) : []
      };
    } catch (error) {
      console.error('Error fetching mood for date:', error);
      throw error;
    }
  },

  async saveMood(userId, date, primaryMood, secondaryMood, intensity, notes, triggers) {
    const db = getDatabase();
    
    try {
      const dateString = toLocalDateKey(date);
      
      // Check if mood exists for this date
      const existingMood = await db.getFirstAsync(
        'SELECT id FROM moods WHERE userId = ? AND date = ?',
        [userId, dateString]
      );
      
      const encryptedNotes = notes ? encrypt(notes).encrypted : null;
      const triggersJson = JSON.stringify(triggers || []);
      
      if (existingMood) {
        // Update existing mood
        await db.runAsync(
          `UPDATE moods SET 
            primaryMood = ?, 
            secondaryMood = ?, 
            intensity = ?, 
            notes = ?, 
            triggers = ? 
          WHERE userId = ? AND date = ?`,
          [primaryMood, secondaryMood || null, intensity, encryptedNotes, triggersJson, userId, dateString]
        );
      } else {
        // Create new mood
        await db.runAsync(
          `INSERT INTO moods 
            (userId, date, primaryMood, secondaryMood, intensity, notes, triggers) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [userId, dateString, primaryMood, secondaryMood || null, intensity, encryptedNotes, triggersJson]
        );
      }
      
      // Return the saved mood
      const result = await db.getFirstAsync(
        'SELECT * FROM moods WHERE userId = ? AND date = ?',
        [userId, dateString]
      );
      
      return {
        ...result,
        notes: result.notes ? decrypt(result.notes) : '',
        triggers: result.triggers ? JSON.parse(result.triggers) : []
      };
    } catch (error) {
      console.error('Error saving mood:', error);
      throw error;
    }
  },

  async deleteMood(userId, date) {
    const db = getDatabase();
    
    try {
      const dateString = toLocalDateKey(date);
      
      const result = await db.runAsync(
        'DELETE FROM moods WHERE userId = ? AND date = ?',
        [userId, dateString]
      );
      
      return {
        message: 'Mood deleted',
        deletedCount: result.changes
      };
    } catch (error) {
      console.error('Error deleting mood:', error);
      throw error;
    }
  }
};
