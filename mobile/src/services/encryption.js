// Re-export from the canonical utils location.
// localAddictionService.js imports './encryption' which resolves here.
export { encrypt, decrypt, saveSecure, getSecure, removeSecure } from '../utils/encryption';
