import axios from 'axios';
import createLogger from '../utils/logger';

const logger = createLogger('frontend:http');

function getDefaultApiBaseUrl() {
  if (typeof window === 'undefined') {
    return 'http://localhost:5000';
  }

  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:5000`;
}

// Use build-time override when provided, otherwise derive the backend host
// from the browser location so published images are not tied to localhost.
const API_BASE_URL = process.env.REACT_APP_API_URL || getDefaultApiBaseUrl();

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

logger.info('Configured API client', { baseURL: API_BASE_URL, logLevel: logger.level });

// Add token to requests if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    logger.verbose('HTTP request', {
      method: config.method,
      baseURL: config.baseURL,
      url: config.url,
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    logger.error('HTTP request setup failed', {
      message: error.message,
      stack: error.stack,
    });
    return Promise.reject(error);
  }
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => {
    logger.verbose('HTTP response', {
      method: response.config?.method,
      url: response.config?.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    logger.error('HTTP response failed', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      response: error.response?.data,
    });

    if (error.response?.status === 401) {
      // Clear token and redirect to login on unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
