import axios from 'axios';
import TokenManager from '../../features/auth/services/tokenManager';
import { errorLogger } from '../errorLogger';
import { errorMessageMapper } from '../errorMessageMapper';

const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async config => {
    const token = await TokenManager.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      params: config.params,
    });

    return config;
  },
  error => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const endpoint = originalRequest?.url || 'unknown';
    const method = originalRequest?.method?.toUpperCase() || 'UNKNOWN';

    const isNetworkError = errorMessageMapper.isNetworkError(error);

    if (error.response?.status === 401) {
      errorLogger.logAuthError(
        'Session expired or invalid token',
        endpoint,
      );

      await TokenManager.deleteToken();

      const { default: useAuthStore } = await import('../../stores/useAuthStore');

      const userMessage = errorMessageMapper.getSimpleMessage(error);

      useAuthStore.setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: userMessage,
      });

      return Promise.reject(error);
    }

    if (!originalRequest._retry) {
      originalRequest._retry = 0;
    }

    const shouldRetry =
      (isNetworkError || (error.response && error.response.status >= 500)) &&
      originalRequest._retry < 2;

    if (shouldRetry) {
      originalRequest._retry += 1;
      const retryDelay = Math.pow(2, originalRequest._retry - 1) * 1000;

      errorLogger.log({
        type: isNetworkError ? 'network' : 'api',
        endpoint,
        method,
        statusCode: error.response?.status,
        message: `Retry attempt ${originalRequest._retry} after ${retryDelay}ms`,
      });

      await new Promise<void>(resolve => setTimeout(resolve, retryDelay));

      return apiClient(originalRequest);
    }

    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        'Unknown error';

      errorLogger.logApiError(endpoint, method, status, message);
    } else if (isNetworkError) {
      errorLogger.logNetworkError(
        endpoint,
        method,
        'No internet connection or request timeout',
      );
    } else {
      errorLogger.log({
        type: 'api',
        endpoint,
        method,
        message: error.message || 'Unknown error',
      });
    }

    return Promise.reject(error);
  },
);

export default apiClient;
