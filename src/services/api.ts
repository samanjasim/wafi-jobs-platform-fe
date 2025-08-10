import axios from 'axios';
import type {
  JobApplicationFormData,
  SubmitFormResponse,
  SubmissionFilterDto,
  PaginatedResult,
  SubmissionListDto,
  SubmissionDetailDto,
  UpdateStatusRequest,
  LoginCredentials,
  AuthResponse,
} from '@/types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post('/api/auth/refresh', {
            refreshToken,
          });
          
          const { token } = response.data;
          localStorage.setItem('authToken', token);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('authUser');
        window.location.href = '/admin/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Public API - Job Application
export const submitJobApplication = async (formData: JobApplicationFormData): Promise<SubmitFormResponse> => {
  const response = await api.post('/submissions/submit/job-application', formData);
  return response.data;
};

// Admin APIs - Authentication
export const loginAdmin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const refreshToken = async (): Promise<AuthResponse> => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await api.post('/auth/refresh', { refreshToken });
  return response.data;
};

export const logoutAdmin = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
  }
};

// Admin APIs - Submissions
export const getSubmissions = async (filters: SubmissionFilterDto): Promise<PaginatedResult<SubmissionListDto>> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (value instanceof Date) {
        params.append(key, value.toISOString());
      } else {
        params.append(key, String(value));
      }
    }
  });
  
  const response = await api.get(`/submissions?${params.toString()}`);
  return response.data;
};

export const getSubmissionDetails = async (id: string): Promise<SubmissionDetailDto> => {
  const response = await api.get(`/submissions/${id}`);
  return response.data;
};

export const updateSubmissionStatus = async (
  id: string, 
  updateRequest: UpdateStatusRequest
): Promise<{ message: string }> => {
  const response = await api.put(`/submissions/${id}/status`, updateRequest);
  return response.data;
};

// Utility function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('authUser');
  return !!(token && user);
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('authUser');
  return userStr ? JSON.parse(userStr) : null;
};

export default api;
