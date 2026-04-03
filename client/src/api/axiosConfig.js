import axios from 'axios';

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

// Add token to requests if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login on unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
