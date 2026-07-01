import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// AsyncStorage Key for JWT Token
export const AUTH_TOKEN_KEY = 'revive_auth_token';

// Placeholder Base URL. Can be overridden in development via app.json extra properties
const DEFAULT_BASE_URL = 'https://api.revive-app.example.com/v1';

// Create Centralized Axios Instance
const apiClient: AxiosInstance = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl || DEFAULT_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically retrieves JWT token from AsyncStorage and attaches it to the Authorization header.
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('API Client: Error retrieving auth token from storage', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Standardizes API responses, handles global error cases (such as 401 Unauthorized),
 * and structures error payloads for easy UI handling.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return standard Axios response
    return response;
  },
  async (error: AxiosError) => {
    // 1. Handle 401 Unauthorized (invalid/expired JWT)
    if (error.response?.status === 401) {
      console.warn('API Client: Unauthorized access (401). Removing token from storage...');
      try {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      } catch (storageError) {
        console.error('API Client: Failed to clear auth token from storage', storageError);
      }
      
      // Note: Screens or state managers (e.g. React Context, Zustand) should listen
      // to storage changes or api failures to trigger redirect to Login route.
    }

    // 2. Standardize error message & structure
    const standardizedError = {
      message: 'An unexpected error occurred. Please try again.',
      status: error.response?.status,
      errors: null as any,
      originalError: error,
    };

    if (error.response && error.response.data) {
      const responseData = error.response.data as any;
      
      // Try to extract message or list of validation errors from backend response structure
      if (typeof responseData === 'string') {
        standardizedError.message = responseData;
      } else {
        standardizedError.message = responseData.message || responseData.error || standardizedError.message;
        standardizedError.errors = responseData.errors || null;
      }
    } else if (error.request) {
      // Request was made but no response was received (network failure)
      standardizedError.message = 'Network error. Please check your internet connection.';
    }

    return Promise.reject(standardizedError);
  }
);

export default apiClient;
