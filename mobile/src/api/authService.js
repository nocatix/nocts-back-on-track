import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { localAuthService } from '../services/localAuthService';
import { saveToken, getToken, removeToken } from '../utils/jwtHelper';
import { saveSecure, getSecure, removeSecure } from '../utils/encryption';
import modeService from '../services/modeService';

/**
 * Get remote API client for connected mode
 */
const getRemoteClient = async () => {
  const serverUrl = await modeService.getServerUrl();
  if (!serverUrl) {
    throw new Error('Server URL not configured');
  }
  
  return axios.create({
    baseURL: `${serverUrl}/api`,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const authService = {
  async login(username, password) {
    try {
      const mode = await modeService.getActiveMode();
      console.log('[AuthService] Login mode:', mode);
      
      let result;
      
      if (mode === 'standalone') {
        // Standalone mode - use local authentication
        result = await localAuthService.login(username, password);
        await saveToken(result.token);
      } else if (mode === 'connected') {
        // Connected mode - use remote API
        const client = await getRemoteClient();
        const response = await client.post('/auth/login', {
          username,
          password,
        });
        result = response.data;
        
        if (result.token) {
          await saveToken(result.token);
        }
      } else {
        throw new Error('Mode not configured');
      }
      
      if (result.token) {
        await saveSecure('user', JSON.stringify(result.user));
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(username, fullName, password) {
    try {
      const mode = await modeService.getActiveMode();
      console.log('[AuthService] Register mode:', mode);
      
      let result;
      
      if (mode === 'standalone') {
        // Standalone mode - use local registration
        result = await localAuthService.register(username, fullName, password);
        await saveToken(result.token);
      } else if (mode === 'connected') {
        // Connected mode - use remote API
        const client = await getRemoteClient();
        const response = await client.post('/auth/register', {
          username,
          fullName,
          password,
        });
        result = response.data;
        
        if (result.token) {
          await saveToken(result.token);
        }
      } else {
        throw new Error('Mode not configured');
      }
      
      if (result.token) {
        await saveSecure('user', JSON.stringify(result.user));
      }
      
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      const mode = await modeService.getActiveMode();
      console.log('[AuthService] Logout mode:', mode);
      
      if (mode === 'connected') {
        // Try to notify server (optional)
        try {
          const token = await AsyncStorage.getItem('userToken');
          const secureToken = token || await getToken();
          if (secureToken) {
            const client = await getRemoteClient();
            await client.post('/auth/logout', {}, {
              headers: { Authorization: `Bearer ${secureToken}` },
            });
          }
        } catch (serverError) {
          console.warn('Error notifying server of logout:', serverError);
          // Continue with local cleanup anyway
        }
      }
      
      await removeToken();
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
      await removeSecure('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getCurrentUser() {
    try {
      const userJson = await getSecure('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async verifyToken() {
    try {
      const mode = await modeService.getActiveMode();
      
      if (mode === 'standalone') {
        const token = await getToken();
        if (!token) {
          return null;
        }
        
        const user = await localAuthService.getUserFromToken(token);
        return user;
      } else if (mode === 'connected') {
        const token = await getToken();
        if (!token) {
          return null;
        }
        
        // Verify token with server
        try {
          const client = await getRemoteClient();
          const response = await client.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          return response.data.user;
        } catch (error) {
          console.error('Token verification failed:', error);
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  },

  async updatePreferences(username, unitPreference) {
    try {
      const mode = await modeService.getActiveMode();
      console.log('[AuthService] Update preferences mode:', mode);
      
      // Get current user
      const user = await this.getCurrentUser();
      if (!user) {
        throw new Error('User not found');
      }
      
      if (mode === 'standalone') {
        // Update locally
        const result = await localAuthService.updateUserPreferences(user.id, unitPreference);
        
        // Update stored user
        user.unitPreference = unitPreference;
        await saveSecure('user', JSON.stringify(user));
        
        return result;
      } else if (mode === 'connected') {
        // Update via server API
        const token = await getToken();
        const client = await getRemoteClient();
        const response = await client.post('/auth/preferences', 
          { unitPreference },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Update stored user
        const updatedUser = { ...user, unitPreference };
        await saveSecure('user', JSON.stringify(updatedUser));
        
        return response.data;
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
};

export default authService;
