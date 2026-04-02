import AsyncStorage from '@react-native-async-storage/async-storage';

export const modeService = {
  /**
   * Get the currently active mode
   * @returns {'standalone' | 'connected' | null}
   */
  async getActiveMode() {
    try {
      const mode = await AsyncStorage.getItem('appMode');
      return mode;
    } catch (error) {
      console.error('Error getting active mode:', error);
      return null;
    }
  },

  /**
   * Set the active mode
   * @param {string} mode - 'standalone' or 'connected'
   */
  async setActiveMode(mode) {
    try {
      if (!['standalone', 'connected'].includes(mode)) {
        throw new Error('Invalid mode. Use "standalone" or "connected"');
      }
      await AsyncStorage.setItem('appMode', mode);
    } catch (error) {
      console.error('Error setting active mode:', error);
      throw error;
    }
  },

  /**
   * Get the configured server URL
   * @returns {string | null}
   */
  async getServerUrl() {
    try {
      const url = await AsyncStorage.getItem('serverUrl');
      return url;
    } catch (error) {
      console.error('Error getting server URL:', error);
      return null;
    }
  },

  /**
   * Set the server URL for connected mode
   * @param {string} url - Full server URL (e.g., http://192.168.1.100:5000)
   */
  async setServerUrl(url) {
    try {
      if (!url || typeof url !== 'string') {
        throw new Error('Invalid server URL');
      }
      await AsyncStorage.setItem('serverUrl', url);
    } catch (error) {
      console.error('Error setting server URL:', error);
      throw error;
    }
  },

  /**
   * Check if mode is properly configured
   * @returns {boolean}
   */
  async isModeConfigured() {
    try {
      const mode = await this.getActiveMode();
      if (!mode) return false;

      if (mode === 'standalone') {
        return true;
      }

      if (mode === 'connected') {
        const url = await this.getServerUrl();
        return !!url;
      }

      return false;
    } catch (error) {
      console.error('Error checking if mode is configured:', error);
      return false;
    }
  },

  /**
   * Normalize and validate a server URL
   * @param {string} url - Server URL to validate
   * @returns {{valid: boolean, normalized?: string, error?: string}}
   */
  validateServerUrl(url) {
    try {
      if (!url || typeof url !== 'string') {
        return { valid: false, error: 'Server URL is required' };
      }

      // Trim whitespace
      url = url.trim();

      // Add http:// prefix if missing
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `http://${url}`;
      }

      // Basic URL validation
      try {
        new URL(url);
      } catch (e) {
        return { valid: false, error: 'Invalid URL format' };
      }

      // Ensure no trailing slash
      url = url.replace(/\/$/, '');

      return { valid: true, normalized: url };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  },

  /**
   * Clear all mode-related data
   */
  async clearModeData() {
    try {
      await AsyncStorage.multiRemove(['appMode', 'serverUrl']);
    } catch (error) {
      console.error('Error clearing mode data:', error);
      throw error;
    }
  },

  /**
   * Get mode configuration object
   * Useful for logging and debugging
   * @returns {Object}
   */
  async getModeConfig() {
    try {
      const mode = await this.getActiveMode();
      const serverUrl = await this.getServerUrl();
      const isConfigured = await this.isModeConfigured();

      return {
        mode,
        serverUrl,
        isConfigured,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting mode config:', error);
      return {
        mode: null,
        serverUrl: null,
        isConfigured: false,
        error: error.message,
      };
    }
  },

  /**
   * Check if current mode is standalone
   * @returns {boolean}
   */
  async isStandalone() {
    const mode = await this.getActiveMode();
    return mode === 'standalone';
  },

  /**
   * Check if current mode is connected
   * @returns {boolean}
   */
  async isConnected() {
    const mode = await this.getActiveMode();
    return mode === 'connected';
  },
};

export default modeService;
