import axios from 'axios';
import { AuthState, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authAPI = {
  getStatus: async (): Promise<AuthState> => {
    const response = await api.get('/api/auth/status');
    return response.data.data; // Extract data from { success: true, data: ... }
  },

  initiateAuth: async (): Promise<{ authUrl: string }> => {
    const response = await api.get('/api/auth/initiate');
    return response.data.data; // Extract data from { success: true, data: { authUrl, message } }
  },
};

export const chatAPI = {
  sendMessage: async (message: string): Promise<ApiResponse> => {
    try {
      // For now, we'll simulate the chat response since we need to integrate with Claude Desktop
      // In a real implementation, this would connect to Claude Desktop MCP client
      const response = await api.post('/api/chat', { message });
      return response.data;
    } catch (error) {
      console.error('Chat API error:', error);
      throw error;
    }
  },
};

export const healthAPI = {
  check: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
