import { getDatabase } from '../db/database';

export const localAchievementService = {
  async initializeAchievements(userId) {
    const db = getDatabase();
    
    try {
      // Default achievements
      const achievements = [
        { title: 'First Step', description: 'Add your first addiction', type: 'milestone' },
        { title: '7 Days Strong', description: 'Go 7 days without relapse', type: 'streak' },
        { title: '30 Days Strong', description: 'Go 30 days without relapse', type: 'streak' },
        { title: '90 Days Strong', description: 'Go 90 days without relapse', type: 'streak' },
        { title: 'Month of Memories', description: 'Create memories for 30 days', type: 'milestone' },
        { title: 'Mood Tracker', description: 'Track your mood for 10 days', type: 'milestone' },
        { title: 'Diary Keeper', description: 'Write diary entries for 7 days', type: 'milestone' }
      ];
      
      for (const achievement of achievements) {
        await db.runAsync(
          `INSERT INTO achievements 
            (userId, title, description, type, isUnlocked) 
          VALUES (?, ?, ?, ?, ?)`,
          [userId, achievement.title, achievement.description, achievement.type, 0]
        );
      }
      
      return achievements;
    } catch (error) {
      console.error('Error initializing achievements:', error);
      throw error;
    }
  },

  async getAchievements(userId) {
    const db = getDatabase();
    
    try {
      const achievements = await db.getAllAsync(
        'SELECT * FROM achievements WHERE userId = ? ORDER BY isUnlocked DESC, unlockedDate DESC',
        [userId]
      );
      
      return achievements;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  },

  async unlockAchievement(userId, achievementId) {
    const db = getDatabase();
    
    try {
      await db.runAsync(
        'UPDATE achievements SET isUnlocked = 1, unlockedDate = CURRENT_TIMESTAMP WHERE id = ? AND userId = ?',
        [achievementId, userId]
      );
      
      return {
        message: 'Achievement unlocked',
        success: true
      };
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      throw error;
    }
  },

  async getUnlockedAchievements(userId) {
    const db = getDatabase();
    
    try {
      const achievements = await db.getAllAsync(
        'SELECT * FROM achievements WHERE userId = ? AND isUnlocked = 1 ORDER BY unlockedDate DESC',
        [userId]
      );
      
      return achievements;
    } catch (error) {
      console.error('Error fetching unlocked achievements:', error);
      throw error;
    }
  },

  async checkAndUnlockStreakAchievements(userId, addictionId) {
    // This would check dates and unlock achievements based on streaks
    // Implementation depends on addiction data
    try {
      const db = getDatabase();
      
      const unlockedList = await db.getAllAsync(
        'SELECT id FROM achievements WHERE userId = ? AND isUnlocked = 1',
        [userId]
      );
      
      return unlockedList;
    } catch (error) {
      console.error('Error checking streak achievements:', error);
      throw error;
    }
  }
};
