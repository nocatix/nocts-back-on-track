import { checkNetworkConnection } from './networkStatus';

/**
 * Retry a Promise-based operation with exponential backoff
 * @param {Function} operation - Async function to retry
 * @param {number} maxAttempts - Maximum number of attempts (default: 3)
 * @param {number} initialDelay - Initial delay in milliseconds (default: 1000)
 * @returns {Promise} Result of the operation
 */
export async function retryWithBackoff(
  operation,
  maxAttempts = 3,
  initialDelay = 1000
) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[Retry] Attempt ${attempt}/${maxAttempts}`);
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`[Retry] Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxAttempts) {
        // Exponential backoff: delay increases with each attempt
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.log(`[Retry] Waiting ${delay}ms before next attempt...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Retry an operation only if network is available
 * Waits for network if currently offline
 * @param {Function} operation - Async function to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} timeout - Timeout in milliseconds to wait for network (default: 30000)
 * @returns {Promise} Result of the operation
 */
export async function retryWithNetworkCheck(
  operation,
  maxAttempts = 3,
  timeout = 30000
) {
  const startTime = Date.now();
  
  // Wait for network to be available
  let isConnected = await checkNetworkConnection();
  
  while (!isConnected && (Date.now() - startTime) < timeout) {
    console.log('[Retry] Waiting for network connection...');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    isConnected = await checkNetworkConnection();
  }
  
  if (!isConnected) {
    throw new Error('Network timeout - device offline');
  }
  
  // Network is available, retry with backoff
  return retryWithBackoff(operation, maxAttempts);
}

/**
 * Retry with specific error handling
 * Only retries on network/timeout errors, not on validation/auth errors
 * @param {Function} operation - Async function to retry
 * @param {Object} options - Configuration options
 * @returns {Promise} Result of the operation
 */
export async function intelligentRetry(operation, options = {}) {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    shouldRetry = (error) => defaultShouldRetry(error),
  } = options;
  
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Check if we should retry this error
      if (!shouldRetry(error)) {
        console.log('[IntelligentRetry] Error is not retryable, throwing:', error.message);
        throw error;
      }
      
      if (attempt < maxAttempts) {
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.log(
          `[IntelligentRetry] Retryable error (${error.message}), waiting ${delay}ms`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Determine if an error should be retried
 */
function defaultShouldRetry(error) {
  // Retry on network errors
  if (!error.response) {
    return true; // Network error, timeout, etc.
  }
  
  // Retry on server errors (5xx)
  if (error.response.status >= 500) {
    return true;
  }
  
  // Retry on timeout-like errors
  if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
    return true;
  }
  
  // Don't retry on client errors (4xx) like 401, 403, 400, etc.
  if (error.response.status >= 400 && error.response.status < 500) {
    return false;
  }
  
  return false;
}

/**
 * Create a cancellable promise that times out
 * Useful for fetch operations with timeout
 */
export function withTimeout(promise, timeoutMs = 10000) {
  let timeoutId;
  
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Operation timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}
