import { getDatabase } from '../db/database';
import { createToken, verifyToken } from '../utils/jwtHelper';

export const localAuthService = {
  async register(username, fullName, password) {
    const db = getDatabase();
    
    try {
      // Check if user already exists
      const existingUser = await db.getFirstAsync(
        'SELECT id FROM users WHERE username = ?',
        [username.toLowerCase()]
      );
      
      if (existingUser) {
        throw new Error('Username already exists');
      }
      
      // For standalone mode, store password as simple hash (local only, not for production)
      // Use a simple btoa encoding for local storage
      const hashedPassword = btoa(password);
      
      // Create user
      const result = await db.runAsync(
        'INSERT INTO users (username, fullName, password, unitPreference) VALUES (?, ?, ?, ?)',
        [username.toLowerCase(), fullName, hashedPassword, 'imperial']
      );
      
      const userId = result.lastInsertRowId;
      
      // Create token
      const token = createToken(userId, username);
      
      return {
        token,
        user: {
          id: userId,
          username: username.toLowerCase(),
          fullName,
          unitPreference: 'imperial'
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(username, password) {
    const db = getDatabase();
    
    try {
      // Find user
      const user = await db.getFirstAsync(
        'SELECT id, username, fullName, unitPreference, password FROM users WHERE username = ?',
        [username.toLowerCase()]
      );
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Verify password - simple comparison with btoa encoded password
      const encodedPassword = btoa(password);
      if (encodedPassword !== user.password) {
        throw new Error('Invalid password');
      }
      
      // Create token
      const token = createToken(user.id, user.username);
      
      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          unitPreference: user.unitPreference
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async getUserFromToken(token) {
    try {
      const decoded = verifyToken(token);
      if (!decoded) return null;
      
      const db = getDatabase();
      const user = await db.getFirstAsync(
        'SELECT id, username, fullName, unitPreference FROM users WHERE id = ?',
        [decoded.userId]
      );
      
      return user;
    } catch (error) {
      console.error('Error getting user from token:', error);
      return null;
    }
  },

  async updateUserPreferences(userId, unitPreference) {
    const db = getDatabase();
    
    try {
      await db.runAsync(
        'UPDATE users SET unitPreference = ? WHERE id = ?',
        [unitPreference, userId]
      );
      
      return {
        success: true,
        message: 'Preferences updated'
      };
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
};
